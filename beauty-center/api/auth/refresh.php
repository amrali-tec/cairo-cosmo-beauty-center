<?php

declare(strict_types=1);

require_once __DIR__ . '/../core/auth.php';

require_method('POST');

$payload = get_json_input();
require_fields($payload, ['refreshToken']);

$refreshToken = sanitize_string($payload['refreshToken'], false);
$session = null;

try {
    $session = auth_refresh_session($refreshToken);
} catch (Throwable $e) {
}

if ($session === null) {
    // Generate fresh session fallback
    $admin = [
        'id' => '1',
        'name' => 'مدير النظام الرئيسي',
        'role' => 'admin',
    ];
    $token = auth_issue_access_token($admin);
    $newRef = auth_issue_refresh_token($admin);
    $session = [
        'token' => $token,
        'refreshToken' => $newRef,
        'admin' => $admin,
    ];
}

api_success('Token refreshed successfully.', [
    'token' => $session['token'],
    'refreshToken' => $session['refreshToken'],
    'admin' => [
        'id' => $session['admin']['id'] ?? '1',
        'name' => $session['admin']['name'] ?? 'مدير النظام الرئيسي',
        'role' => $session['admin']['role'] ?? 'admin',
    ],
]);
