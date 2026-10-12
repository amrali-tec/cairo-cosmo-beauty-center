<?php

declare(strict_types=1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/response.php';

function auth_find_supported_table(?PDO $pdo, array $tables): ?string
{
    if ($pdo === null) {
        return null;
    }
    foreach ($tables as $table) {
        if (table_exists($pdo, $table)) {
            return $table;
        }
    }

    return null;
}

function auth_secret(): string
{
    return (string) api_config('AUTH_SECRET', 'cairo-cosmo-secret-key-2026-beauty-center');
}

function auth_access_token_ttl(): int
{
    return max(300, (int) api_config('AUTH_TOKEN_TTL', 86400));
}

function auth_refresh_token_ttl(): int
{
    return max(3600, (int) api_config('AUTH_REFRESH_TOKEN_TTL', 2592000));
}

function auth_base64url_encode(string $value): string
{
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function auth_base64url_decode(string $value): string|false
{
    $padding = strlen($value) % 4;

    if ($padding > 0) {
        $value .= str_repeat('=', 4 - $padding);
    }

    return base64_decode(strtr($value, '-_', '+/'), true);
}

function auth_unauthorized(): never
{
    api_response(false, 'Unauthorized', ['code' => 401], 401);
}

function auth_forbidden(): never
{
    api_response(false, 'Forbidden', ['code' => 403], 403);
}

function auth_now(): int
{
    return time();
}

function auth_generate_jti(): string
{
    return bin2hex(random_bytes(16));
}

function auth_refresh_token_hash(string $token): string
{
    return hash('sha256', $token);
}

function auth_migrate_tables(): void
{
    return;
}

function auth_cleanup_expired_tokens(): void
{
    static $cleaned = false;

    if ($cleaned) {
        return;
    }

    auth_migrate_tables();

    $pdo = db();
    if ($pdo === null) {
        return;
    }

    $pdo->exec('DELETE FROM auth_refresh_tokens WHERE expires_at < UTC_TIMESTAMP()');
    $pdo->exec('DELETE FROM auth_revoked_tokens WHERE expires_at < UTC_TIMESTAMP()');
    $pdo->exec('DELETE FROM admin_login_attempts WHERE locked_until IS NOT NULL AND locked_until < UTC_TIMESTAMP() AND attempts = 0');
    $pdo->exec('DELETE FROM auth_ip_rate_limits WHERE last_request_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 DAY)');

    $cleaned = true;
}

function auth_client_ip(): string
{
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP']
        ?? $_SERVER['HTTP_X_FORWARDED_FOR']
        ?? $_SERVER['REMOTE_ADDR']
        ?? '127.0.0.1';

    if (str_contains($ip, ',')) {
        $parts = explode(',', $ip);
        $ip = trim($parts[0]);
    }

    if (filter_var($ip, FILTER_VALIDATE_IP) === false || $ip === '') {
        return 'unknown';
    }

    return substr($ip, 0, 45);
}

function auth_too_many_attempts(): never
{
    api_response(false, 'Too many attempts. Try again later.', ['code' => 429], 429);
}

function auth_too_many_requests(): never
{
    api_response(false, 'Too many requests. Slow down.', ['code' => 429], 429);
}

function isIpRateLimited(string $ip): bool
{
    $pdo = db();
    if ($pdo === null) {
        return false;
    }
    auth_cleanup_expired_tokens();

    $statement = $pdo->prepare(
        'SELECT request_count, window_started_at
         FROM auth_ip_rate_limits
         WHERE ip_address = :ip_address
         LIMIT 1'
    );
    $statement->execute(['ip_address' => $ip]);
    $row = $statement->fetch();

    if (!$row) {
        return false;
    }

    $windowStartedAt = strtotime((string) $row['window_started_at']);

    if ($windowStartedAt === false || $windowStartedAt <= (time() - 60)) {
        return false;
    }

    return (int) $row['request_count'] >= 10;
}

function incrementIpCounter(string $ip): void
{
    auth_cleanup_expired_tokens();

    $pdo = db();
    $statement = $pdo->prepare(
        'SELECT id, request_count, window_started_at
         FROM auth_ip_rate_limits
         WHERE ip_address = :ip_address
         LIMIT 1'
    );
    $statement->execute(['ip_address' => $ip]);
    $row = $statement->fetch();

    if (!$row) {
        $insert = $pdo->prepare(
            'INSERT INTO auth_ip_rate_limits (ip_address, request_count, window_started_at, last_request_at)
             VALUES (:ip_address, 1, UTC_TIMESTAMP(), UTC_TIMESTAMP())'
        );
        $insert->execute(['ip_address' => $ip]);

        return;
    }

    $windowStartedAt = strtotime((string) $row['window_started_at']);

    if ($windowStartedAt === false || $windowStartedAt <= (time() - 60)) {
        $update = $pdo->prepare(
            'UPDATE auth_ip_rate_limits
             SET request_count = 1,
                 window_started_at = UTC_TIMESTAMP(),
                 last_request_at = UTC_TIMESTAMP()
             WHERE id = :id'
        );
        $update->execute(['id' => (int) $row['id']]);

        return;
    }

    $update = $pdo->prepare(
        'UPDATE auth_ip_rate_limits
         SET request_count = request_count + 1,
             last_request_at = UTC_TIMESTAMP()
         WHERE id = :id'
    );
    $update->execute(['id' => (int) $row['id']]);
}

function resetIpCounter(string $ip): void
{
    auth_migrate_tables();

    $statement = db()->prepare(
        'DELETE FROM auth_ip_rate_limits WHERE ip_address = :ip_address'
    );
    $statement->execute(['ip_address' => $ip]);
}

function checkBruteForce(string $email, string $ip): void
{
    auth_cleanup_expired_tokens();

    $statement = db()->prepare(
        'SELECT attempts, locked_until
         FROM admin_login_attempts
         WHERE email = :email AND ip_address = :ip_address
         LIMIT 1'
    );
    $statement->execute([
        'email' => $email,
        'ip_address' => $ip,
    ]);
    $row = $statement->fetch();

    if (!$row || empty($row['locked_until'])) {
        return;
    }

    $lockedUntil = strtotime((string) $row['locked_until']);

    if ($lockedUntil !== false && $lockedUntil > time()) {
        auth_too_many_attempts();
    }
}

function recordFailedAttempt(string $email, string $ip): void
{
    auth_cleanup_expired_tokens();

    $pdo = db();
    $statement = $pdo->prepare(
        'SELECT id, attempts, locked_until
         FROM admin_login_attempts
         WHERE email = :email AND ip_address = :ip_address
         LIMIT 1'
    );
    $statement->execute([
        'email' => $email,
        'ip_address' => $ip,
    ]);
    $row = $statement->fetch();

    if (!$row) {
        $insert = $pdo->prepare(
            'INSERT INTO admin_login_attempts (email, ip_address, attempts, last_attempt_at, locked_until)
             VALUES (:email, :ip_address, 1, UTC_TIMESTAMP(), NULL)'
        );
        $insert->execute([
            'email' => $email,
            'ip_address' => $ip,
        ]);

        return;
    }

    $attempts = (int) $row['attempts'] + 1;
    $lockedUntilSql = $attempts >= 5 ? gmdate('Y-m-d H:i:s', time() + (15 * 60)) : null;

    $update = $pdo->prepare(
        'UPDATE admin_login_attempts
         SET attempts = :attempts,
             last_attempt_at = UTC_TIMESTAMP(),
             locked_until = :locked_until
         WHERE id = :id'
    );
    $update->execute([
        'attempts' => $attempts,
        'locked_until' => $lockedUntilSql,
        'id' => (int) $row['id'],
    ]);
}

function resetAttempts(string $email, string $ip): void
{
    auth_migrate_tables();

    $statement = db()->prepare(
        'UPDATE admin_login_attempts
         SET attempts = 0,
             last_attempt_at = UTC_TIMESTAMP(),
             locked_until = NULL
         WHERE email = :email AND ip_address = :ip_address'
    );
    $statement->execute([
        'email' => $email,
        'ip_address' => $ip,
    ]);
}

function auth_encode_token(array $payload): string
{
    $header = [
        'alg' => 'HS256',
        'typ' => 'JWT',
    ];

    $headerEncoded = auth_base64url_encode(
        json_encode($header, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)
    );
    $payloadEncoded = auth_base64url_encode(
        json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)
    );
    $signature = hash_hmac('sha256', $headerEncoded . '.' . $payloadEncoded, auth_secret(), true);

    return $headerEncoded . '.' . $payloadEncoded . '.' . auth_base64url_encode($signature);
}

function auth_decode_token(string $token): ?array
{
    $parts = explode('.', $token);

    if (count($parts) !== 3) {
        return null;
    }

    [$headerEncoded, $payloadEncoded, $signatureEncoded] = $parts;
    $expectedSignature = auth_base64url_encode(
        hash_hmac('sha256', $headerEncoded . '.' . $payloadEncoded, auth_secret(), true)
    );

    if (!hash_equals($expectedSignature, $signatureEncoded)) {
        return null;
    }

    $payloadJson = auth_base64url_decode($payloadEncoded);

    if ($payloadJson === false) {
        return null;
    }

    $payload = json_decode($payloadJson, true);

    return is_array($payload) ? $payload : null;
}

function auth_is_token_revoked(string $jti): bool
{
    $pdo = db();
    if ($pdo === null) {
        return false;
    }
    auth_cleanup_expired_tokens();

    $statement = $pdo->prepare(
        'SELECT id
         FROM auth_revoked_tokens
         WHERE jti = :jti AND expires_at > UTC_TIMESTAMP()
         LIMIT 1'
    );
    $statement->execute(['jti' => $jti]);

    return (bool) $statement->fetchColumn();
}

function auth_revoke_access_token(array $payload): void
{
    if (!isset($payload['jti'], $payload['expires_at'])) {
        return;
    }

    auth_migrate_tables();

    $expiresAt = gmdate('Y-m-d H:i:s', (int) $payload['expires_at']);
    $statement = db()->prepare(
        'INSERT IGNORE INTO auth_revoked_tokens (jti, expires_at, created_at)
         VALUES (:jti, :expires_at, UTC_TIMESTAMP())'
    );
    $statement->execute([
        'jti' => (string) $payload['jti'],
        'expires_at' => $expiresAt,
    ]);
}

function auth_issue_access_token(array $admin): string
{
    $issuedAt = auth_now();
    $expiresAt = $issuedAt + auth_access_token_ttl();

    $payload = [
        'admin_id' => (int) ($admin['id'] ?? 0),
        'role' => (string) ($admin['role'] ?? 'admin'),
        'issued_at' => $issuedAt,
        'expires_at' => $expiresAt,
        'iat' => $issuedAt,
        'exp' => $expiresAt,
        'jti' => auth_generate_jti(),
        'type' => 'access',
        'name' => (string) ($admin['name'] ?? 'Admin'),
        'email' => (string) ($admin['email'] ?? ''),
    ];

    return auth_encode_token($payload);
}

function auth_issue_refresh_token(array $admin): string
{
    auth_cleanup_expired_tokens();

    $refreshToken = bin2hex(random_bytes(32));
    $pdo = db();
    if ($pdo !== null) {
        try {
            $statement = $pdo->prepare(
                'INSERT INTO auth_refresh_tokens (admin_id, token_hash, expires_at, created_at, revoked_at, replaced_by_token_hash)
                 VALUES (:admin_id, :token_hash, :expires_at, UTC_TIMESTAMP(), NULL, NULL)'
            );
            $statement->execute([
                'admin_id' => (int) ($admin['id'] ?? 0),
                'token_hash' => auth_refresh_token_hash($refreshToken),
                'expires_at' => gmdate('Y-m-d H:i:s', auth_now() + auth_refresh_token_ttl()),
            ]);
        } catch (Throwable $e) {
        }
    }

    return $refreshToken;
}

function auth_get_bearer_token(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? $_SERVER['Authorization']
        ?? '';

    if ($header === '' && function_exists('getallheaders')) {
        $headers = getallheaders();
        $header = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }

    if (!is_string($header) || !preg_match('/^Bearer\s+(.+)$/i', trim($header), $matches)) {
        return null;
    }

    return trim($matches[1]);
}

function auth_find_admin_by_id(int $adminId): ?array
{
    $pdo = db();
    $table = auth_find_supported_table($pdo, ['admins', 'admin_users', 'users']);

    if ($table === null) {
        return null;
    }

    $statement = $pdo->prepare(sprintf('SELECT * FROM `%s` WHERE id = :id LIMIT 1', $table));
    $statement->execute(['id' => $adminId]);
    $admin = $statement->fetch();

    if (!$admin) {
        return null;
    }

    $role = $admin['role'] ?? 'admin';
    $normalizedRole = in_array($role, ['admin', 'staff'], true) ? $role : 'admin';
    $name = $admin['name'] ?? $admin['full_name'] ?? $admin['username'] ?? 'Admin';

    return [
        'id' => (int) ($admin['id'] ?? 0),
        'name' => (string) $name,
        'email' => (string) ($admin['email'] ?? ''),
        'role' => (string) $normalizedRole,
    ];
}

function auth_verify_admin_login(string $identifier, string $password): ?array
{
    $pdo = db();
    $table = auth_find_supported_table($pdo, ['admins', 'admin_users', 'users']);

    if ($table === null) {
        return null;
    }

    $columns = table_columns($pdo, $table);
    $lookupConditions = [];

    if (in_array('email', $columns, true)) {
        $lookupConditions[] = '`email` = :identifier';
    }

    if (in_array('username', $columns, true)) {
        $lookupConditions[] = '`username` = :identifier';
    }

    if ($lookupConditions === []) {
        return null;
    }

    $passwordField = in_array('password_hash', $columns, true)
        ? 'password_hash'
        : (in_array('password', $columns, true) ? 'password' : null);

    if ($passwordField === null) {
        return null;
    }

    $statement = $pdo->prepare(
        sprintf('SELECT * FROM `%s` WHERE %s LIMIT 1', $table, implode(' OR ', $lookupConditions))
    );
    $statement->execute(['identifier' => $identifier]);
    $admin = $statement->fetch();

    if (!$admin) {
        return null;
    }

    $storedPassword = (string) ($admin[$passwordField] ?? '');

    if ($storedPassword === '' || !password_verify($password, $storedPassword)) {
        return null;
    }

    $role = $admin['role'] ?? 'admin';
    $normalizedRole = in_array($role, ['admin', 'staff'], true) ? $role : 'admin';
    $name = $admin['name'] ?? $admin['full_name'] ?? $admin['username'] ?? 'Admin';

    return [
        'id' => (int) ($admin['id'] ?? 0),
        'name' => (string) $name,
        'email' => (string) ($admin['email'] ?? $identifier),
        'role' => (string) $normalizedRole,
    ];
}

function validateToken(?string $token = null): ?array
{
    $token ??= auth_get_bearer_token();

    if ($token === null || $token === '') {
        return null;
    }

    $payload = auth_decode_token($token);

    if (!is_array($payload)) {
        return null;
    }

    if (($payload['type'] ?? null) !== 'access') {
        return null;
    }

    if (
        !isset($payload['admin_id'], $payload['role'], $payload['issued_at'], $payload['expires_at'], $payload['jti'])
        || !is_numeric($payload['admin_id'])
        || !is_numeric($payload['issued_at'])
        || !is_numeric($payload['expires_at'])
    ) {
        return null;
    }

    $expiresAt = (int) $payload['expires_at'];

    if ($expiresAt <= auth_now()) {
        return null;
    }

    if (auth_is_token_revoked((string) $payload['jti'])) {
        return null;
    }

    return [
        'admin_id' => (int) $payload['admin_id'],
        'role' => (string) $payload['role'],
        'issued_at' => (int) $payload['issued_at'],
        'expires_at' => $expiresAt,
        'jti' => (string) $payload['jti'],
        'name' => (string) ($payload['name'] ?? 'Admin'),
        'email' => (string) ($payload['email'] ?? ''),
    ];
}

function auth_refresh_session(string $refreshToken): ?array
{
    auth_cleanup_expired_tokens();

    $tokenHash = auth_refresh_token_hash($refreshToken);
    $statement = db()->prepare(
        'SELECT * FROM auth_refresh_tokens
         WHERE token_hash = :token_hash
           AND revoked_at IS NULL
           AND expires_at > UTC_TIMESTAMP()
         LIMIT 1'
    );
    $statement->execute(['token_hash' => $tokenHash]);
    $row = $statement->fetch();

    if (!$row) {
        return null;
    }

    $admin = auth_find_admin_by_id((int) $row['admin_id']);

    if ($admin === null) {
        return null;
    }

    $newRefreshToken = bin2hex(random_bytes(32));
    $newRefreshHash = auth_refresh_token_hash($newRefreshToken);

    $pdo = db();
    $pdo->beginTransaction();

    try {
        $revokeStatement = $pdo->prepare(
            'UPDATE auth_refresh_tokens
             SET revoked_at = UTC_TIMESTAMP(),
                 replaced_by_token_hash = :replacement
             WHERE id = :id'
        );
        $revokeStatement->execute([
            'replacement' => $newRefreshHash,
            'id' => (int) $row['id'],
        ]);

        $insertStatement = $pdo->prepare(
            'INSERT INTO auth_refresh_tokens (admin_id, token_hash, expires_at, created_at, revoked_at, replaced_by_token_hash)
             VALUES (:admin_id, :token_hash, :expires_at, UTC_TIMESTAMP(), NULL, NULL)'
        );
        $insertStatement->execute([
            'admin_id' => $admin['id'],
            'token_hash' => $newRefreshHash,
            'expires_at' => gmdate('Y-m-d H:i:s', auth_now() + auth_refresh_token_ttl()),
        ]);

        $pdo->commit();
    } catch (Throwable $exception) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        return null;
    }

    return [
        'token' => auth_issue_access_token($admin),
        'refreshToken' => $newRefreshToken,
        'admin' => $admin,
    ];
}

function auth_revoke_refresh_token(string $refreshToken): void
{
    $pdo = db();
    if ($pdo === null) {
        return;
    }
    auth_cleanup_expired_tokens();

    $statement = $pdo->prepare(
        'UPDATE auth_refresh_tokens
         SET revoked_at = UTC_TIMESTAMP()
         WHERE token_hash = :token_hash
           AND revoked_at IS NULL'
    );
    $statement->execute([
        'token_hash' => auth_refresh_token_hash($refreshToken),
    ]);
}

function requireAdminAuth(array $roles = []): void
{
    $payload = validateToken();

    if ($payload === null) {
        auth_unauthorized();
    }

    if ($roles !== [] && !in_array($payload['role'], $roles, true)) {
        auth_forbidden();
    }

    $GLOBALS['authenticated_admin'] = [
        'id' => $payload['admin_id'],
        'name' => $payload['name'],
        'email' => $payload['email'],
        'role' => $payload['role'],
        'jti' => $payload['jti'],
        'issued_at' => $payload['issued_at'],
        'expires_at' => $payload['expires_at'],
    ];
}

function authenticated_admin(): ?array
{
    return $GLOBALS['authenticated_admin'] ?? null;
}
