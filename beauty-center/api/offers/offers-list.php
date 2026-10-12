<?php

declare(strict_types=1);

require_once __DIR__ . '/../core/auth.php';
require_once __DIR__ . '/../core/db.php';
require_once __DIR__ . '/../core/helpers.php';

requireAdminAuth(['admin', 'staff']);
require_method('GET');

$pdo = db();

if (!table_exists($pdo, 'offers')) {
    api_success('Offers table is not available.', []);
}

$statement = $pdo->query('SELECT * FROM offers ORDER BY id DESC');
api_success('Offers fetched successfully.', $statement->fetchAll());
