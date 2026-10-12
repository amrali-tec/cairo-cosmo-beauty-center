<?php

declare(strict_types=1);

require_once __DIR__ . '/../core/auth.php';
require_once __DIR__ . '/../core/audit.php';
require_once __DIR__ . '/../core/db.php';
require_once __DIR__ . '/../core/email-events.php';
require_once __DIR__ . '/../core/helpers.php';

requireAdminAuth(['admin', 'staff']);
require_method('POST');

$pdo = db();

if (!table_exists($pdo, 'offers')) {
    api_error('Offers table is not available.', 500);
}

$payload = get_json_input();
require_fields($payload, ['title']);

$title = sanitize_string($payload['title'], false);
$description = sanitize_string($payload['description'] ?? '');
$id = array_key_exists('id', $payload) ? sanitize_int($payload['id'], false) : 0;
$admin = authenticated_admin();

if ($id > 0) {
    $selectStatement = $pdo->prepare('SELECT title, description FROM offers WHERE id = :id LIMIT 1');
    $selectStatement->execute(['id' => $id]);
    $existingOffer = $selectStatement->fetch();
    $statement = $pdo->prepare(
        'UPDATE offers
         SET title = :title, description = :description
         WHERE id = :id'
    );
    $statement->execute([
        'title' => $title,
        'description' => $description,
        'id' => $id,
    ]);

    logAction(
        $admin['id'] ?? null,
        'offer_updated',
        'offer',
        $id,
        [
            'previousTitle' => $existingOffer['title'] ?? null,
            'previousDescription' => $existingOffer['description'] ?? null,
            'title' => $title,
            'description' => $description,
        ]
    );

    api_success('Offer updated successfully.', ['id' => $id]);
}

$statement = $pdo->prepare(
    'INSERT INTO offers (title, description)
     VALUES (:title, :description)'
);
$statement->execute([
    'title' => $title,
    'description' => $description,
]);

$offerId = (int) $pdo->lastInsertId();
logAction(
    $admin['id'] ?? null,
    'offer_created',
    'offer',
    $offerId,
    [
        'title' => $title,
        'description' => $description,
    ]
);

$customersStatement = $pdo->query('SELECT id FROM customers');
foreach ($customersStatement->fetchAll() as $customer) {
    if (isset($customer['id'])) {
        triggerEmailEvent((int) $customer['id'], 'offer_available', [
            'offerId' => $offerId,
            'title' => $title,
        ]);
    }
}

api_success('Offer created successfully.', [
    'id' => $offerId,
], 201);
