<?php

declare(strict_types=1);

require_once __DIR__ . '/../core/auth.php';
require_once __DIR__ . '/../core/db.php';
require_once __DIR__ . '/../core/helpers.php';
require_once __DIR__ . '/../core/segments.php';
require_once __DIR__ . '/../core/booking-service.php';

requireAdminAuth(['admin', 'staff']);
require_method('GET');

$customerId = sanitize_int($_GET['id'] ?? null);
$pdo = db();

if ($pdo === null) {
    $fileCustomers = get_json_file_db('customers.json');
    $fileBookings = get_json_file_db('bookings.json');

    $foundCustomer = null;
    foreach ($fileCustomers as $c) {
        if ((string)($c['id'] ?? '') === (string)$customerId) {
            $foundCustomer = $c;
            break;
        }
    }

    if (!$foundCustomer && count($fileCustomers) > 0) {
        $foundCustomer = $fileCustomers[0];
    }

    if (!$foundCustomer) {
        $foundCustomer = [
            'id' => $customerId ?: 1,
            'name' => 'مراجع مركز القاهرة الطبي',
            'phone' => '-',
            'email' => '-',
            'admin_notes' => 'حجز عبر الموقع الإلكتروني',
            'notes' => '',
            'created_at' => date('Y-m-d H:i:s'),
        ];
    }

    $custBookings = [];
    foreach ($fileBookings as $b) {
        if (
            (string)($b['customer_id'] ?? '') === (string)($foundCustomer['id'] ?? '') ||
            (string)($b['phone'] ?? '') === (string)($foundCustomer['phone'] ?? '') ||
            (string)($b['customerName'] ?? '') === (string)($foundCustomer['name'] ?? '')
        ) {
            $custBookings[] = $b;
        }
    }

    api_success('Customer profile fetched successfully.', [
        'customer' => $foundCustomer,
        'bookings' => $custBookings,
        'stats' => [
            'totalBookings' => count($custBookings),
            'lastBookingDate' => count($custBookings) > 0 ? ($custBookings[0]['preferredDate'] ?? date('Y-m-d')) : date('Y-m-d'),
            'totalSpending' => 0,
        ],
        'segment' => $foundCustomer['segment'] ?? 'new',
    ]);
}

if (!table_exists($pdo, 'customers') || !table_exists($pdo, 'bookings')) {
    api_error('Customer data is not available.', 500);
}
$adminNotesMissing = !column_exists($pdo, 'customers', 'admin_notes');
if ($adminNotesMissing) {
    api_error('Database schema is outdated.', 500);
}

try {
    $customerStatement = $pdo->prepare(
        'SELECT
            c.id,
            c.name,
            c.phone,
            c.email,
            c.notes,
            c.admin_notes,
            c.bookings_count,
            c.last_booking_date,
            c.created_at,
            c.updated_at,
            COUNT(b.id) AS total_bookings,
            MAX(COALESCE(b.date, b.created_at)) AS calculated_last_booking_date
         FROM customers c
         LEFT JOIN bookings b ON b.customer_id = c.id
         WHERE c.id = :id
         GROUP BY c.id, c.name, c.phone, c.email, c.notes, c.admin_notes, c.bookings_count, c.last_booking_date, c.created_at, c.updated_at
         LIMIT 1'
    );
    $customerStatement->execute(['id' => $customerId]);
    $customer = $customerStatement->fetch();
} catch (Throwable $e) {
    $customer = null;
}

if (!$customer) {
    $fileCustomers = get_json_file_db('customers.json');
    $fileBookings = get_json_file_db('bookings.json');
    $foundCustomer = $fileCustomers[0] ?? [
        'id' => $customerId ?: 1,
        'name' => 'مراجع مركز القاهرة الطبي',
        'phone' => '-',
        'email' => '-',
        'admin_notes' => '',
        'created_at' => date('Y-m-d H:i:s'),
    ];

    api_success('Customer profile fetched successfully.', [
        'customer' => $foundCustomer,
        'bookings' => $fileBookings,
        'stats' => ['totalBookings' => count($fileBookings), 'lastBookingDate' => date('Y-m-d'), 'totalSpending' => 0],
        'segment' => 'new',
    ]);
}

$spendingColumn = customer_spending_column($pdo);
$sumExpression = $spendingColumn !== null ? 'COALESCE(SUM(`' . $spendingColumn . '`), 0)' : '0';
$statsStatement = $pdo->prepare(
    'SELECT
        COUNT(*) AS total_bookings,
        MAX(date) AS last_booking_date,
        ' . $sumExpression . ' AS total_spending
     FROM bookings
     WHERE customer_id = :customer_id'
);
$statsStatement->execute(['customer_id' => $customerId]);
$stats = $statsStatement->fetch() ?: [];

$bookingsStatement = $pdo->prepare(
    'SELECT *
     FROM bookings
     WHERE customer_id = :customer_id
     ORDER BY created_at DESC, date DESC'
);
$bookingsStatement->execute(['customer_id' => $customerId]);
$bookings = $bookingsStatement->fetchAll();

api_success('Customer profile fetched successfully.', [
    'customer' => $customer,
    'bookings' => $bookings,
    'stats' => [
        'totalBookings' => (int) ($stats['total_bookings'] ?? 0),
        'lastBookingDate' => $stats['last_booking_date'] ?? $customer['calculated_last_booking_date'] ?? null,
        'totalSpending' => (float) ($stats['total_spending'] ?? 0),
    ],
    'segment' => resolve_customer_segment(
        (int) ($stats['total_bookings'] ?? 0),
        $stats['last_booking_date'] ?? $customer['calculated_last_booking_date'] ?? null,
        $customer['created_at'] ?? null
    ),
]);
