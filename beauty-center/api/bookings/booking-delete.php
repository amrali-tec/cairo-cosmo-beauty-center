<?php

declare(strict_types=1);

require_once __DIR__ . '/../core/auth.php';
require_once __DIR__ . '/../core/audit.php';
require_once __DIR__ . '/../core/booking-service.php';
require_once __DIR__ . '/../core/db.php';
require_once __DIR__ . '/../core/helpers.php';
require_once __DIR__ . '/../core/segments.php';

requireAdminAuth(['admin']);
require_method('POST');

$payload = get_json_input();
require_fields($payload, ['id']);

$rawId = (string) ($payload['id'] ?? '');
$admin = authenticated_admin();

$pdo = db();
if ($pdo !== null && is_numeric($rawId)) {
    try {
        $id = (int) $rawId;
        $selectStatement = $pdo->prepare('SELECT customer_id, service, branch, date, status FROM bookings WHERE id = :id LIMIT 1');
        $selectStatement->execute(['id' => $id]);
        $booking = $selectStatement->fetch();
        $statement = $pdo->prepare('DELETE FROM bookings WHERE id = :id');
        $statement->execute(['id' => $id]);

        if ($booking && isset($booking['customer_id'])) {
            recalculate_customer_stats((int) $booking['customer_id']);
            updateCustomerSegment((int) $booking['customer_id']);
        }
        logAction(
            $admin['id'] ?? null,
            'booking_deleted',
            'booking',
            (string) $id,
            [
                'customerId' => $booking['customer_id'] ?? null,
                'service' => $booking['service'] ?? null,
                'branch' => $booking['branch'] ?? null,
                'date' => $booking['date'] ?? null,
                'status' => $booking['status'] ?? null,
            ]
        );

        api_success('Booking deleted successfully.', [
            'deleted' => $statement->rowCount() > 0,
            'id' => $id,
        ]);
    } catch (Throwable $e) {
    }
}

// JSON file storage fallback
$fileBookings = get_json_file_db('bookings.json');
$updatedBookings = [];
$deleted = false;
foreach ($fileBookings as $b) {
    $bId = (string) ($b['id'] ?? $b['bookingId'] ?? '');
    if ($bId === $rawId) {
        $deleted = true;
    } else {
        $updatedBookings[] = $b;
    }
}

if ($deleted) {
    save_json_file_db('bookings.json', $updatedBookings);
}

api_success('Booking deleted successfully.', [
    'deleted' => $deleted,
    'id' => $rawId,
]);
