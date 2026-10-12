<?php

declare(strict_types=1);

require_once __DIR__ . '/../core/auth.php';
require_once __DIR__ . '/../core/audit.php';
require_once __DIR__ . '/../core/booking-service.php';
require_once __DIR__ . '/../core/db.php';
require_once __DIR__ . '/../core/helpers.php';
require_once __DIR__ . '/../core/segments.php';

requireAdminAuth(['admin', 'staff']);
require_method('POST');

$payload = get_json_input();
require_fields($payload, ['id', 'status']);

$rawId = (string) ($payload['id'] ?? '');
$status = sanitize_string($payload['status'], false);
$admin = authenticated_admin();

$pdo = db();
if ($pdo !== null && is_numeric($rawId)) {
    try {
        $id = (int) $rawId;
        $selectStatement = $pdo->prepare('SELECT customer_id, status FROM bookings WHERE id = :id LIMIT 1');
        $selectStatement->execute(['id' => $id]);
        $booking = $selectStatement->fetch();
        $statement = $pdo->prepare('UPDATE bookings SET status = :status WHERE id = :id');
        $statement->execute([
            'status' => $status,
            'id' => $id,
        ]);

        if ($booking && isset($booking['customer_id'])) {
            updateCustomerSegment((int) $booking['customer_id']);
        }
        logAction(
            $admin['id'] ?? null,
            'booking_updated',
            'booking',
            (string) $id,
            [
                'previousStatus' => $booking['status'] ?? null,
                'status' => $status,
                'customerId' => $booking['customer_id'] ?? null,
            ]
        );

        api_success('Booking updated successfully.', [
            'updated' => $statement->rowCount() > 0,
            'id' => $id,
        ]);
    } catch (Throwable $e) {
    }
}

// JSON file storage fallback
$fileBookings = get_json_file_db('bookings.json');
$updated = false;
foreach ($fileBookings as $idx => $b) {
    $bId = (string) ($b['id'] ?? $b['bookingId'] ?? '');
    if ($bId === $rawId) {
        $fileBookings[$idx]['status'] = $status;
        $updated = true;
        break;
    }
}

if ($updated) {
    save_json_file_db('bookings.json', $fileBookings);
}

api_success('Booking updated successfully.', [
    'updated' => $updated,
    'id' => $rawId,
]);
