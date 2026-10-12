<?php

declare(strict_types=1);

require_once __DIR__ . '/audit.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/email-events.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/segments.php';

function get_json_file_db(string $filename): array
{
    $dir = __DIR__ . '/../data';
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    $path = $dir . '/' . $filename;
    if (!file_exists($path)) {
        return [];
    }
    $content = @file_get_contents($path);
    if ($content === false || $content === '') {
        return [];
    }
    $decoded = json_decode($content, true);
    return is_array($decoded) ? $decoded : [];
}

function save_json_file_db(string $filename, array $data): void
{
    $dir = __DIR__ . '/../data';
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    $path = $dir . '/' . $filename;
    @file_put_contents($path, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

function recalculate_customer_stats(int $customerId): array
{
    $pdo = db();
    if ($pdo === null) {
        return ['bookings_count' => 1, 'last_booking_date' => date('Y-m-d')];
    }
    try {
        $statement = $pdo->prepare(
            'SELECT
                COUNT(*) AS booking_count,
                MAX(COALESCE(date, created_at)) AS last_booking_date
             FROM bookings
             WHERE customer_id = :customer_id'
        );
        $statement->execute(['customer_id' => $customerId]);
        $stats = $statement->fetch() ?: [];

        $bookingCount = (int) ($stats['booking_count'] ?? 0);
        $lastBookingDate = $stats['last_booking_date'] ?? null;

        $updateStatement = $pdo->prepare(
            'UPDATE customers
             SET bookings_count = :bookings_count,
                 last_booking_date = :last_booking_date
             WHERE id = :id'
        );
        $updateStatement->execute([
            'bookings_count' => $bookingCount,
            'last_booking_date' => $lastBookingDate,
            'id' => $customerId,
        ]);

        return [
            'bookings_count' => $bookingCount,
            'last_booking_date' => $lastBookingDate,
        ];
    } catch (Throwable $e) {
        return ['bookings_count' => 1, 'last_booking_date' => date('Y-m-d')];
    }
}

function upsert_booking_customer(string $name, string $phone, string $email): int
{
    $pdo = db();
    if ($pdo === null) {
        return 1;
    }

    $selectStatement = $pdo->prepare('SELECT id FROM customers WHERE phone = :phone LIMIT 1');
    $selectStatement->execute(['phone' => $phone]);
    $customerId = $selectStatement->fetchColumn();

    if ($customerId !== false) {
        $updateStatement = $pdo->prepare(
            'UPDATE customers
             SET name = :name,
                 email = :email
             WHERE id = :id'
        );
        $updateStatement->execute([
            'name' => $name,
            'email' => $email,
            'id' => (int) $customerId,
        ]);

        return (int) $customerId;
    }

    $insertStatement = $pdo->prepare(
        'INSERT INTO customers (name, phone, email, bookings_count, created_at, updated_at)
         VALUES (:name, :phone, :email, 0, UTC_TIMESTAMP(), UTC_TIMESTAMP())'
    );
    $insertStatement->execute([
        'name' => $name,
        'phone' => $phone,
        'email' => $email,
    ]);

    return (int) $pdo->lastInsertId();
}

function create_booking_record(array $payload, array $options = []): array
{
    $name = sanitize_string($payload['fullName'] ?? '', false);
    $phone = sanitize_string($payload['phone'] ?? '', false);
    $email = sanitize_email($payload['email'] ?? '', false);
    $service = sanitize_string($payload['serviceTitle'] ?? '', false);
    $branch = sanitize_string($payload['branchTitle'] ?? '', false);
    $preferredDate = sanitize_string($payload['preferredDate'] ?? '', false);
    $notes = sanitize_string($payload['notes'] ?? '');
    $status = sanitize_string($options['status'] ?? 'new', false);
    $admin = $options['admin'] ?? null;
    $source = sanitize_string($options['source'] ?? 'api', false);
    $shouldQueueEmail = (bool) ($options['queue_email_event'] ?? true);
    $shouldAudit = (bool) ($options['audit'] ?? false);

    $pdo = db();

    if ($pdo !== null) {
        try {
            $pdo->beginTransaction();
            $customerId = upsert_booking_customer($name, $phone, $email);

            $insertBooking = $pdo->prepare(
                'INSERT INTO bookings (customer_id, service, branch, date, notes, status, created_at, updated_at)
                 VALUES (:customer_id, :service, :branch, :date, :notes, :status, UTC_TIMESTAMP(), UTC_TIMESTAMP())'
            );
            $insertBooking->execute([
                'customer_id' => $customerId,
                'service' => $service,
                'branch' => $branch,
                'date' => $preferredDate,
                'notes' => $notes,
                'status' => $status,
            ]);

            $bookingId = (int) $pdo->lastInsertId();
            $pdo->commit();

            $stats = recalculate_customer_stats($customerId);
            $segment = updateCustomerSegment($customerId);

            return [
                'bookingId' => 'BK-' . date('Ymd') . '-' . $bookingId,
                'customerId' => 'CUST-' . $customerId,
                'stats' => $stats,
                'segment' => $segment['segment_type'] ?? 'new',
            ];
        } catch (Throwable $exception) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
        }
    }

    // Server File System Backup Storage (When MySQL DB is offline/unconfigured)
    $bookingCode = 'BK-' . date('Ymd') . '-' . substr(md5(uniqid((string) mt_rand(), true)), 0, 6);
    $customerCode = 'CUST-' . date('Ymd') . '-' . substr(md5(uniqid((string) mt_rand(), true)), 0, 6);

    $bookingsList = get_json_file_db('bookings.json');
    $customersList = get_json_file_db('customers.json');

    $newBookingRecord = [
        'id' => $bookingCode,
        'bookingId' => $bookingCode,
        'customer_id' => $customerCode,
        'customerName' => $name,
        'name' => $name,
        'phone' => $phone,
        'email' => $email,
        'service' => $service,
        'serviceName' => $service,
        'branch' => $branch,
        'branchName' => $branch,
        'preferredDate' => $preferredDate,
        'date' => $preferredDate,
        'preferredTime' => 'حسب الموعد الأقرب',
        'status' => 'pending',
        'segment' => 'new',
        'notes' => $notes !== '' ? $notes : 'حجز موعد عبر الموقع الإلكتروني',
        'createdAt' => date('Y-m-d H:i:s'),
        'created_at' => date('Y-m-d H:i:s'),
    ];

    $existingCustomerIndex = -1;
    foreach ($customersList as $idx => $c) {
        if (($c['phone'] ?? '') === $phone && $phone !== '') {
            $existingCustomerIndex = $idx;
            break;
        }
    }

    if ($existingCustomerIndex >= 0) {
        $customersList[$existingCustomerIndex]['bookings_count'] = ($customersList[$existingCustomerIndex]['bookings_count'] ?? 1) + 1;
        $customersList[$existingCustomerIndex]['last_booking_date'] = $preferredDate;
    } else {
        $customersList[] = [
            'id' => count($customersList) + 1,
            'name' => $name,
            'phone' => $phone,
            'email' => $email,
            'admin_notes' => $notes,
            'bookings_count' => 1,
            'last_booking_date' => $preferredDate,
            'created_at' => date('Y-m-d H:i:s'),
            'segment' => 'new',
        ];
    }

    array_unshift($bookingsList, $newBookingRecord);

    save_json_file_db('bookings.json', $bookingsList);
    save_json_file_db('customers.json', $customersList);

    return [
        'bookingId' => $bookingCode,
        'customerId' => $customerCode,
        'stats' => ['bookings_count' => 1, 'last_booking_date' => $preferredDate],
        'segment' => 'new',
    ];
}
