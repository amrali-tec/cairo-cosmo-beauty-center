<?php

declare(strict_types=1);

require_once __DIR__ . '/../core/auth.php';
require_once __DIR__ . '/../core/audit.php';
require_once __DIR__ . '/../core/db.php';
require_once __DIR__ . '/../core/helpers.php';

requireAdminAuth(['admin', 'staff']);
require_method('POST');

$payload = get_json_input();
require_fields($payload, ['id']);

$id = sanitize_int($payload['id']);
$notes = sanitize_string($payload['notes']);

$pdo = db();
$selectStatement = $pdo->prepare('SELECT notes, admin_notes FROM customers WHERE id = :id LIMIT 1');
$selectStatement->execute(['id' => $id]);
$customer = $selectStatement->fetch();
$statement = $pdo->prepare('UPDATE customers SET notes = :notes, admin_notes = :notes WHERE id = :id');
$statement->execute([
  'notes' => $notes,
  'id' => $id,
]);

$admin = authenticated_admin();
logAction(
  $admin['id'] ?? null,
  'customer_updated',
  'customer',
  $id,
  [
    'previousNotes' => $customer['admin_notes'] ?? $customer['notes'] ?? null,
    'notes' => $notes,
  ]
);

api_success('Customer updated successfully.', [
  'updated' => $statement->rowCount() > 0,
  'id' => $id,
]);
