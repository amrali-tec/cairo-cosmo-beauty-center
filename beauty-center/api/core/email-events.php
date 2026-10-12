<?php

declare(strict_types=1);

require_once __DIR__ . '/db.php';

function email_events_migrate_table(): void
{
    return;
}

function triggerEmailEvent(int $customerId, string $eventType, array $payload = []): void
{
    email_events_migrate_table();

    $statement = db()->prepare(
        'INSERT INTO email_events (customer_id, event_type, status, payload, created_at)
         VALUES (:customer_id, :event_type, :status, :payload, UTC_TIMESTAMP())'
    );
    $statement->execute([
        'customer_id' => $customerId,
        'event_type' => $eventType,
        'status' => 'pending',
        'payload' => json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    ]);
}
