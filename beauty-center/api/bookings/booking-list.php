<?php

declare(strict_types=1);

require_once __DIR__ . '/../core/auth.php';
require_once __DIR__ . '/../core/db.php';
require_once __DIR__ . '/../core/helpers.php';
require_once __DIR__ . '/../core/booking-service.php';

requireAdminAuth(['admin', 'staff']);
require_method('GET');

$pdo = db();
if ($pdo === null) {
    $fileBookings = get_json_file_db('bookings.json');
    api_success('Bookings fetched successfully.', $fileBookings);
}

try {
    $statement = $pdo->query(
        'SELECT
            b.id,
            b.date AS preferredDate,
            b.notes,
            b.status,
            b.created_at AS createdAt,
            b.service AS serviceName,
            b.branch AS branchName,
            c.name AS customerName,
            c.phone,
            c.email
         FROM bookings b
         JOIN customers c ON c.id = b.customer_id
         ORDER BY b.created_at DESC'
    );
    $bookings = $statement->fetchAll();
} catch (Throwable $e) {
    $bookings = get_json_file_db('bookings.json');
}

api_success('Bookings fetched successfully.', $bookings ?: get_json_file_db('bookings.json'));
