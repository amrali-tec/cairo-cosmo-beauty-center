<?php

declare(strict_types=1);

function api_load_env(): void
{
    static $loaded = false;
    if ($loaded) {
        return;
    }
    $loaded = true;

    $candidates = [
        __DIR__ . '/../.env',
        __DIR__ . '/../../.env',
    ];

    foreach ($candidates as $file) {
        if (file_exists($file) && is_readable($file)) {
            $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            if ($lines !== false) {
                foreach ($lines as $line) {
                    $line = trim($line);
                    if ($line === '' || str_starts_with($line, '#')) {
                        continue;
                    }
                    if (str_contains($line, '=')) {
                        [$name, $value] = explode('=', $line, 2);
                        $name = trim($name);
                        $value = trim($value, " \t\n\r\0\x0B\"'");
                        if ($name !== '' && !array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
                            $_SERVER[$name] = $value;
                            $_ENV[$name] = $value;
                            putenv("{$name}={$value}");
                        }
                    }
                }
            }
            break;
        }
    }
}

function api_config(string $key, mixed $default = null): mixed
{
    api_load_env();

    $serverValue = $_SERVER[$key] ?? null;
    if ($serverValue !== null && $serverValue !== '') {
        return $serverValue;
    }

    $envValue = $_ENV[$key] ?? null;
    if ($envValue !== null && $envValue !== '') {
        return $envValue;
    }

    $value = getenv($key);

    return $value === false || $value === '' ? $default : $value;
}

function api_db_config(): array
{
    return [
        'host' => (string) api_config('DB_HOST', '127.0.0.1'),
        'name' => (string) api_config('DB_NAME', 'beauty_center'),
        'user' => (string) api_config('DB_USER', 'root'),
        'pass' => (string) api_config('DB_PASS', ''),
        'charset' => (string) api_config('DB_CHARSET', 'utf8mb4'),
    ];
}
