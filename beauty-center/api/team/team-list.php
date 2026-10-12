<?php

declare(strict_types=1);

require_once __DIR__ . '/../core/auth.php';
require_once __DIR__ . '/../core/db.php';
require_once __DIR__ . '/../core/helpers.php';
require_once __DIR__ . '/../core/booking-service.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST') {
    $payload = get_json_input();
    $name = sanitize_string($payload['name'] ?? '', false);
    $email = filter_var(trim($payload['email'] ?? ''), FILTER_VALIDATE_EMAIL);
    $phone = sanitize_string($payload['phone'] ?? '', false);
    $role = sanitize_string($payload['role'] ?? 'receptionist', false);
    $branchId = sanitize_string($payload['branchId'] ?? 'all', false);
    $status = sanitize_string($payload['status'] ?? 'active', false);

    if (!$email) {
        api_error('عنوان البريد الإلكتروني غير صحيح.', 400);
    }

    $team = get_json_file_db('team.json');
    $newMember = [
        'id' => 'tm-' . time(),
        'name' => $name !== '' ? $name : 'عضو جديد',
        'email' => $email,
        'phone' => $phone,
        'role' => $role,
        'branchId' => $branchId,
        'status' => $status,
        'lastLogin' => 'لم يسجل بعد',
        'createdAt' => date('Y-m-d'),
    ];

    array_unshift($team, $newMember);
    save_json_file_db('team.json', $team);

    api_success('تم إضافة العضو بنجاح.', $newMember);
}

// GET
$pdo = db();
if ($pdo === null) {
    $team = get_json_file_db('team.json');
    api_success('Team fetched successfully.', $team);
}

try {
    $statement = $pdo->query(
        'SELECT id, name, email, phone, role, branch_id as branchId, status, last_login as lastLogin, created_at as createdAt
         FROM admin_users
         ORDER BY created_at DESC'
    );
    $rows = $statement->fetchAll();
    if (!$rows) {
        $rows = get_json_file_db('team.json');
    }
} catch (Throwable $e) {
    $rows = get_json_file_db('team.json');
}

api_success('Team fetched successfully.', $rows ?: []);
