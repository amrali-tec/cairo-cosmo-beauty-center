<?php

declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

function audit_migrate_table(): void
{
    return;
}

function logAction(
    ?int $adminId,
    string $action,
    string $entityType,
    string|int $entityId,
    array $details = []
): void {
    audit_migrate_table();

    $statement = db()->prepare(
        'INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details, ip_address, created_at)
         VALUES (:admin_id, :action, :entity_type, :entity_id, :details, :ip_address, UTC_TIMESTAMP())'
    );
    $statement->execute([
        'admin_id' => $adminId,
        'action' => $action,
        'entity_type' => $entityType,
        'entity_id' => (string) $entityId,
        'details' => json_encode($details, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'ip_address' => auth_client_ip(),
    ]);
}
