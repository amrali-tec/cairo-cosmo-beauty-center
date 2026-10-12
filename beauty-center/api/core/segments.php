<?php

declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/email-events.php';

function customer_segments_migrate_table(): void
{
    return;
}

function resolve_customer_segment(int $bookingCount, ?string $lastBookingDate, ?string $createdAt): string
{
    if ($bookingCount >= 5) {
        return 'vip';
    }

    if ($lastBookingDate !== null && $lastBookingDate !== '') {
        $timestamp = strtotime($lastBookingDate);
        if ($timestamp !== false && $timestamp <= strtotime('-60 days')) {
            return 'inactive';
        }
    }

    $referenceDate = $lastBookingDate ?: $createdAt;
    if ($bookingCount <= 1 && $referenceDate !== null && $referenceDate !== '') {
        $timestamp = strtotime($referenceDate);
        if ($timestamp !== false && $timestamp >= strtotime('-7 days')) {
            return 'new';
        }
    }

    return 'regular';
}

function customer_spending_column(PDO $pdo): ?string
{
    $columns = table_columns($pdo, 'bookings');

    foreach (['total_amount', 'amount', 'price', 'service_price'] as $column) {
        if (in_array($column, $columns, true)) {
            return $column;
        }
    }

    return null;
}

function calculateCustomerSegment(int $customerId): ?array
{
    $pdo = db();

    if (!table_exists($pdo, 'customers') || !table_exists($pdo, 'bookings')) {
        return null;
    }

    $customerStatement = $pdo->prepare('SELECT id, name, email, created_at FROM customers WHERE id = :id LIMIT 1');
    $customerStatement->execute(['id' => $customerId]);
    $customer = $customerStatement->fetch();

    if (!$customer) {
        return null;
    }

    $spendingColumn = customer_spending_column($pdo);
    $sumExpression = $spendingColumn !== null ? 'COALESCE(SUM(`' . $spendingColumn . '`), 0)' : '0';
    $bookingStatement = $pdo->prepare(
        'SELECT
            COUNT(*) AS booking_count,
            MAX(date) AS last_booking_date,
            ' . $sumExpression . ' AS total_spending
         FROM bookings
         WHERE customer_id = :customer_id'
    );
    $bookingStatement->execute(['customer_id' => $customerId]);
    $stats = $bookingStatement->fetch() ?: [];

    $bookingCount = (int) ($stats['booking_count'] ?? 0);
    $lastBookingDate = $stats['last_booking_date'] ?? null;
    $totalSpending = (float) ($stats['total_spending'] ?? 0);

    $segmentType = resolve_customer_segment(
        $bookingCount,
        is_string($lastBookingDate) ? $lastBookingDate : null,
        $customer['created_at'] ?? null
    );

    $score = min(
        100,
        ($bookingCount * 15)
        + ($segmentType === 'vip' ? 30 : 0)
        + ($segmentType === 'inactive' ? 5 : 0)
    );

    return [
        'customer' => $customer,
        'segment_type' => $segmentType,
        'score' => $score,
        'booking_count' => $bookingCount,
        'total_spending' => $totalSpending,
        'last_booking_date' => $lastBookingDate,
    ];
}

function updateCustomerSegment(int $customerId): ?array
{
    customer_segments_migrate_table();

    $segmentData = calculateCustomerSegment($customerId);

    if ($segmentData === null) {
        return null;
    }

    $pdo = db();
    $existingStatement = $pdo->prepare(
        'SELECT id, segment_type FROM customer_segments WHERE customer_id = :customer_id LIMIT 1'
    );
    $existingStatement->execute(['customer_id' => $customerId]);
    $existing = $existingStatement->fetch();
    $previousSegment = $existing['segment_type'] ?? null;

    if ($existing) {
        $updateStatement = $pdo->prepare(
            'UPDATE customer_segments
             SET segment_type = :segment_type,
                 score = :score,
                 updated_at = UTC_TIMESTAMP()
             WHERE customer_id = :customer_id'
        );
        $updateStatement->execute([
            'segment_type' => $segmentData['segment_type'],
            'score' => $segmentData['score'],
            'customer_id' => $customerId,
        ]);
    } else {
        $insertStatement = $pdo->prepare(
            'INSERT INTO customer_segments (customer_id, segment_type, score, updated_at)
             VALUES (:customer_id, :segment_type, :score, UTC_TIMESTAMP())'
        );
        $insertStatement->execute([
            'customer_id' => $customerId,
            'segment_type' => $segmentData['segment_type'],
            'score' => $segmentData['score'],
        ]);
    }

    if ($segmentData['segment_type'] === 'vip' && $previousSegment !== 'vip') {
        triggerEmailEvent($customerId, 'vip_upgraded', [
            'customerId' => $customerId,
            'segment' => $segmentData['segment_type'],
            'score' => $segmentData['score'],
        ]);
    }

    if ($segmentData['segment_type'] === 'inactive' && $previousSegment !== 'inactive') {
        triggerEmailEvent($customerId, 'inactive_reminder', [
            'customerId' => $customerId,
            'segment' => $segmentData['segment_type'],
            'lastBookingDate' => $segmentData['last_booking_date'],
        ]);
    }

    return $segmentData;
}
