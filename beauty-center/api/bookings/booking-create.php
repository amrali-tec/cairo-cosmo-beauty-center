<?php

declare(strict_types=1);

require_once __DIR__ . '/../core/auth.php';
require_once __DIR__ . '/../core/booking-service.php';
require_once __DIR__ . '/../core/helpers.php';

requireAdminAuth(['admin', 'staff']);
require_method('POST');

$payload = get_json_input();
require_fields(
    $payload,
    ['fullName', 'phone', 'serviceTitle', 'branchTitle', 'preferredDate']
);

try {
    $result = create_booking_record($payload, [
        'status' => 'new',
        'admin' => authenticated_admin(),
        'source' => 'admin',
        'audit' => true,
        'queue_email_event' => true,
    ]);
} catch (Throwable $exception) {
    api_error('Unable to create booking.', 500);
}

api_success('Booking created successfully.', [
    'bookingId' => $result['bookingId'],
    'customerId' => $result['customerId'],
], 201);
