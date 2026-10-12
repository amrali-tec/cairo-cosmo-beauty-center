<?php

declare(strict_types=1);

require_once __DIR__ . '/response.php';

function require_method(string $method): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== strtoupper($method)) {
        api_error('Method not allowed.', 405);
    }
}

function get_json_input(): array
{
    $raw = file_get_contents('php://input');

    if ($raw === false || $raw === '') {
        return [];
    }

    $data = json_decode($raw, true);

    if (!is_array($data)) {
        api_error('Invalid JSON input.', 400);
    }

    return $data;
}

function sanitize_string(mixed $value, bool $allowEmpty = true): string
{
    if ($value === null) {
        return '';
    }

    $value = trim((string) $value);
    $value = preg_replace('/[\x00-\x1F\x7F]/u', '', $value) ?? '';

    if (!$allowEmpty && $value === '') {
        api_error('Missing required field.', 422);
    }

    return $value;
}

function sanitize_email(mixed $value, bool $required = false): string
{
    $email = sanitize_string($value, !$required);

    if ($email === '') {
        return '';
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        api_error('Invalid email address.', 422);
    }

    return $email;
}

function sanitize_int(mixed $value, bool $required = true): int
{
    if ($value === null || $value === '') {
        if ($required) {
            api_error('Missing required field.', 422);
        }

        return 0;
    }

    if (filter_var($value, FILTER_VALIDATE_INT) === false) {
        api_error('Invalid integer value.', 422);
    }

    return (int) $value;
}

function require_fields(array $data, array $fields): void
{
    foreach ($fields as $field) {
        if (!array_key_exists($field, $data) || sanitize_string($data[$field]) === '') {
            api_error(sprintf('Missing required field: %s.', $field), 422);
        }
    }
}
