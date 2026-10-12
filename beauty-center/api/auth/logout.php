<?php

declare(strict_types=1);

require_once __DIR__ . '/../core/auth.php';
require_once __DIR__ . '/../core/audit.php';

require_method('POST');
requireAdminAuth(['admin', 'staff']);

$payload = get_json_input();
$refreshToken = sanitize_string($payload['refreshToken'] ?? '');
$tokenPayload = validateToken();

if ($tokenPayload === null) {
    auth_unauthorized();
}

auth_revoke_access_token($tokenPayload);

if ($refreshToken !== '') {
    auth_revoke_refresh_token($refreshToken);
}

$admin = authenticated_admin();
logAction(
    $admin['id'] ?? null,
    'admin_logout',
    'auth',
    $admin['id'] ?? 'unknown',
    [
        'role' => $admin['role'] ?? null,
    ]
);

api_success('Logged out successfully.', []);
