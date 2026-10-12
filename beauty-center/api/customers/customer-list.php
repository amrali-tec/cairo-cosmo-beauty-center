<?php

declare(strict_types=1);

require_once __DIR__ . '/../core/auth.php';
require_once __DIR__ . '/../core/db.php';
require_once __DIR__ . '/../core/helpers.php';
require_once __DIR__ . '/../core/segments.php';
require_once __DIR__ . '/../core/booking-service.php';

requireAdminAuth(['admin', 'staff']);
require_method('GET');

$pdo = db();
if ($pdo === null) {
    $fileCustomers = get_json_file_db('customers.json');
    api_success('Customers fetched successfully.', $fileCustomers);
}

try {
    $statement = $pdo->query(
        'SELECT
            c.id,
            c.name,
            c.phone,
            c.email,
            c.admin_notes,
            c.created_at,
            COALESCE(COUNT(b.id), 0) AS bookings_count,
            MAX(COALESCE(b.date, b.created_at)) AS last_booking_date
         FROM customers c
         LEFT JOIN bookings b ON b.customer_id = c.id
         GROUP BY c.id, c.name, c.phone, c.email, c.admin_notes, c.created_at
         ORDER BY COALESCE(MAX(COALESCE(b.date, b.created_at)), c.created_at) DESC'
    );

    $customers = [];
    foreach ($statement->fetchAll() as $customer) {
        $customer['segment'] = resolve_customer_segment(
            (int) ($customer['bookings_count'] ?? 0),
            $customer['last_booking_date'] ?? null,
            $customer['created_at'] ?? null
        );
        $customers[] = $customer;
    }
} catch (Throwable $e) {
    $customers = get_json_file_db('customers.json');
}

api_success('Customers fetched successfully.', $customers ?: get_json_file_db('customers.json'));
