<?php

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/response.php';

function db(): ?PDO
{
    static $connection = null;

    if ($connection instanceof PDO) {
        return $connection;
    }

    $config = api_db_config();
    if ($config['host'] === '' || $config['name'] === '' || $config['user'] === '') {
        return null;
    }

    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        $config['host'],
        $config['name'],
        $config['charset']
    );

    try {
        $connection = new PDO(
            $dsn,
            $config['user'],
            $config['pass'],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    } catch (Throwable $exception) {
        return null;
    }

    return $connection;
}

function table_exists(PDO $pdo, string $table): bool
{
    try {
        $statement = $pdo->prepare('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = :table_name');
        $statement->execute(['table_name' => $table]);
        return (bool) $statement->fetchColumn();
    } catch (Throwable $e) {
        return false;
    }
}

function table_columns(PDO $pdo, string $table): array
{
    try {
        $statement = $pdo->prepare('SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = :table_name');
        $statement->execute(['table_name' => $table]);
        return $statement->fetchAll(PDO::FETCH_COLUMN) ?: [];
    } catch (Throwable $e) {
        return [];
    }
}

function column_exists(PDO $pdo, string $table, string $column): bool
{
    return in_array($column, table_columns($pdo, $table), true);
}
