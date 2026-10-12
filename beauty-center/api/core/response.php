<?php

declare(strict_types=1);

if (!headers_sent()) {
    header('Content-Type: application/json; charset=utf-8');
}

function api_payload(bool $success, string $message, mixed $data = []): array
{
    return [
        'success' => $success,
        'message' => $message,
        'data' => $data,
    ];
}

function api_response(bool $success, string $message, mixed $data = [], int $statusCode = 200): never
{
    if (!headers_sent()) {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
    }

    echo json_encode(
        api_payload($success, $message, $data),
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
    exit;
}

function api_success(string $message = 'OK', mixed $data = [], int $statusCode = 200): never
{
    api_response(true, $message, $data, $statusCode);
}

function api_error(string $message = 'Error', int $statusCode = 400, mixed $data = []): never
{
    api_response(false, $message, $data, $statusCode);
}

set_exception_handler(
    static function (Throwable $exception): void {
        api_error($exception->getMessage(), 500);
    }
);

set_error_handler(
    static function (int $severity, string $message, string $file = '', int $line = 0): bool {
        throw new ErrorException($message, 0, $severity, $file, $line);
    }
);
