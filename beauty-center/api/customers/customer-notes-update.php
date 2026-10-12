<?php

declare(strict_types=1);

require_once __DIR__ . '/../core/auth.php';
require_once __DIR__ . '/../core/audit.php';
require_once __DIR__ . '/../core/db.php';
require_once __DIR__ . '/../core/helpers.php';
require_once __DIR__ . '/../core/booking-service.php';

requireAdminAuth(['admin', 'staff']);
require_method('POST');

$payload = get_json_input();
require_fields($payload, ['customer_id']);

$customerId = sanitize_int($payload['customer_id']);
$notes = sanitize_string($payload['notes'] ?? '');
$pdo = db();

if ($pdo === null) {
    $fileCustomers = get_json_file_db('customers.json');
    foreach ($fileCustomers as $idx => $c) {
        if ((string)($c['id'] ?? '') === (string)$customerId) {
            $fileCustomers[$idx]['admin_notes'] = $notes;
            break;
        }
    }
    save_json_file_db('customers.json', $fileCustomers);
    api_success('Customer notes updated successfully.', [
        'updated' => true,
        'id' => $customerId,
    ]);
}

if (!table_exists($pdo, 'customers')) {
    api_error('Customers table is not available.', 500);
}

if (!column_exists($pdo, 'customers', 'admin_notes')) {
    api_error('Database schema is outdated.', 500);
}

$selectStatement = $pdo->prepare('SELECT admin_notes FROM customers WHERE id = :id LIMIT 1');
$selectStatement->execute(['id' => $customerId]);
$customer = $selectStatement->fetch();

if (!$customer) {
    api_error('Customer not found.', 404);
}

$statement = $pdo->prepare('UPDATE customers SET admin_notes = :notes WHERE id = :id');
$statement->execute([
    'notes' => $notes,
    'id' => $customerId,
]);

$admin = authenticated_admin();
logAction(
    $admin['id'] ?? null,
    'customer_notes_updated',
    'customer',
    $customerId,
    [
        'previousNotes' => $customer['admin_notes'] ?? null,
        'adminNotes' => $notes,
    ]
);

api_success('Customer notes updated successfully.', [
    'updated' => $statement->rowCount() > 0,
    'id' => $customerId,
]);
