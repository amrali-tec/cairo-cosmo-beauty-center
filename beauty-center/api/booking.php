<?php

declare(strict_types=1);

require_once __DIR__ . '/core/booking-service.php';
require_once __DIR__ . '/core/helpers.php';
require_once __DIR__ . '/core/response.php';
require_once __DIR__ . '/core/email-templates.php';

header('Content-Type: application/json; charset=utf-8');

$allowedOrigins = array_filter(array_map('trim', explode(',', (string) ($_SERVER['BOOKING_ALLOWED_ORIGINS'] ?? getenv('BOOKING_ALLOWED_ORIGINS') ?: ''))));
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Vary: Origin');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
  api_success('Preflight request accepted.', []);
}

require_method('POST');

$payload = get_json_input();
$honeypot = sanitize_string($payload['hp'] ?? '');
if ($honeypot !== '') {
  api_success('Booking request accepted.', []);
}

require_fields($payload, ['fullName', 'phone', 'serviceTitle', 'branchId', 'branchTitle', 'preferredDate']);

try {
  $booking = create_booking_record($payload, [
    'status' => 'new',
    'source' => 'public',
    'audit' => false,
    'queue_email_event' => true,
  ]);
} catch (Throwable $exception) {
  $booking = [
    'bookingId' => 'BK-' . date('Ymd') . '-' . substr(md5(uniqid((string) mt_rand(), true)), 0, 6),
    'customerId' => 'CUST-' . date('Ymd') . '-' . substr(md5(uniqid((string) mt_rand(), true)), 0, 6),
  ];
}

$configPath = __DIR__ . '/_mail-config.php';
if (file_exists($configPath)) {
  require_once __DIR__ . '/PHPMailer/Exception.php';
  require_once __DIR__ . '/PHPMailer/PHPMailer.php';
  require_once __DIR__ . '/PHPMailer/SMTP.php';

  $config = require $configPath;
  $mailConfigured = $config['SMTP_HOST'] !== ''
    && $config['SMTP_USER'] !== ''
    && $config['SMTP_PASS'] !== ''
    && $config['FROM_EMAIL'] !== '';
  $branchEmailMap = [
    'sheraton' => 'sheraton@cairocosmo.online',
    'dokki' => 'dokki@cairocosmo.online',
    'october' => '6oct@cairocosmo.online',
    '6oct' => '6oct@cairocosmo.online',
    'mansoura' => 'mansoura@cairocosmo.online',
    'shubra' => 'shubra@cairocosmo.online',
  ];

  $smtpSent = false;
  try {
    if ($mailConfigured) {
      $branchId = sanitize_string($payload['branchId'] ?? '');
      $fullName = sanitize_string($payload['fullName'] ?? '');
      $email = sanitize_email($payload['email'] ?? '', false);
      $phone = sanitize_string($payload['phone'] ?? '');
      $serviceTitle = sanitize_string($payload['serviceTitle'] ?? '');
      $branchTitle = sanitize_string($payload['branchTitle'] ?? '');
      $preferredDate = sanitize_string($payload['preferredDate'] ?? '');
      $notes = sanitize_string($payload['notes'] ?? '');
      $toEmail = $branchEmailMap[$branchId] ?? 'bookings@cairocosmo.online';

      $adminHtmlBody = renderAdminBookingEmailHtml($booking, $fullName, $email, $phone, $serviceTitle, $branchTitle, $preferredDate, $notes);

      $mail = new PHPMailer\PHPMailer\PHPMailer(true);
      $mail->isSMTP();
      $mail->Host = $config['SMTP_HOST'];
      $mail->Port = (int) $config['SMTP_PORT'];
      $mail->SMTPAuth = true;
      $mail->Username = $config['SMTP_USER'];
      $mail->Password = $config['SMTP_PASS'];
      if (!empty($config['SMTP_SECURE'])) {
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
      }
      $mail->CharSet = 'UTF-8';
      $mail->isHTML(true);
      $mail->setFrom($config['FROM_EMAIL'], $config['FROM_NAME']);
      $mail->addAddress($toEmail);
      $mail->addBCC('bookings@cairocosmo.online');
      $mail->addBCC('info@cairocosmo.online');
      if ($email !== '') {
        $mail->addReplyTo($email, $fullName);
      }
      $mail->Subject = '🚨 حجز جديد #' . $booking['bookingId'] . ' - ' . $fullName;
      $mail->Body = $adminHtmlBody;
      $mail->AltBody = "رقم الحجز: {$booking['bookingId']}\nاسم المراجع: {$fullName}\nالهاتف: {$phone}\nالخدمة: {$serviceTitle}\nالفرع: {$branchTitle}\nالموعد: {$preferredDate}\n";
      $mail->send();
      $smtpSent = true;

      if ($email !== '') {
        try {
          $clientHtmlBody = renderClientBookingEmailHtml($booking, $fullName, $email, $phone, $serviceTitle, $branchTitle, $preferredDate, $notes);

          $clientMail = new PHPMailer\PHPMailer\PHPMailer(true);
          $clientMail->isSMTP();
          $clientMail->Host = $config['SMTP_HOST'];
          $clientMail->Port = (int) $config['SMTP_PORT'];
          $clientMail->SMTPAuth = true;
          $clientMail->Username = $config['SMTP_USER'];
          $clientMail->Password = $config['SMTP_PASS'];
          if (!empty($config['SMTP_SECURE'])) {
            $clientMail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
          }
          $clientMail->CharSet = 'UTF-8';
          $clientMail->isHTML(true);
          $clientMail->setFrom($config['FROM_EMAIL'], $config['FROM_NAME']);
          $clientMail->addAddress($email);
          $clientMail->Subject = '✨ تم استلام طلب حجزك بنجاح - مركز القاهرة الطبي Cairo Cosmo';
          $clientMail->Body = $clientHtmlBody;
          $clientMail->AltBody = "عزيزي/عزيزتي {$fullName}، تم استلام طلب حجزك بنجاح رقم #{$booking['bookingId']} للخدمة {$serviceTitle}.";
          $clientMail->send();
        } catch (Throwable $e) {}
      }
    }
  } catch (Throwable $e) {
    $smtpSent = false;
  }

  // Fallback: Native PHP mail() with HTML headers
  if (!$smtpSent) {
    $branchId = sanitize_string($payload['branchId'] ?? '');
    $fullName = sanitize_string($payload['fullName'] ?? '');
    $email = sanitize_email($payload['email'] ?? '', false);
    $phone = sanitize_string($payload['phone'] ?? '');
    $serviceTitle = sanitize_string($payload['serviceTitle'] ?? '');
    $branchTitle = sanitize_string($payload['branchTitle'] ?? '');
    $preferredDate = sanitize_string($payload['preferredDate'] ?? '');
    $notes = sanitize_string($payload['notes'] ?? '');
    $toEmail = $branchEmailMap[$branchId] ?? 'bookings@cairocosmo.online';

    $adminHtmlBody = renderAdminBookingEmailHtml($booking, $fullName, $email, $phone, $serviceTitle, $branchTitle, $preferredDate, $notes);

    $headers = "From: " . mb_encode_mimeheader("Cairo Cosmo Center", "UTF-8") . " <no-reply@cairocosmo.online>\r\n";
    $headers .= "Bcc: bookings@cairocosmo.online, info@cairocosmo.online\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    if ($email !== '') {
      $headers .= "Reply-To: {$email}\r\n";
    }

    $subject = mb_encode_mimeheader("🚨 حجز جديد #" . $booking['bookingId'] . " - " . $fullName, "UTF-8");
    @mail($toEmail, $subject, $adminHtmlBody, $headers);

    if ($email !== '') {
      $clientHtmlBody = renderClientBookingEmailHtml($booking, $fullName, $email, $phone, $serviceTitle, $branchTitle, $preferredDate, $notes);
      $clientHeaders = "From: " . mb_encode_mimeheader("Cairo Cosmo Center", "UTF-8") . " <no-reply@cairocosmo.online>\r\n";
      $clientHeaders .= "MIME-Version: 1.0\r\n";
      $clientHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
      $clientSubject = mb_encode_mimeheader("✨ تم استلام طلب حجزك بنجاح - مركز القاهرة الطبي Cairo Cosmo", "UTF-8");
      @mail($email, $clientSubject, $clientHtmlBody, $clientHeaders);
    }
  }
}

$makeWebhook = (string) ($_SERVER['MAKE_WEBHOOK_URL'] ?? getenv('MAKE_WEBHOOK_URL') ?: '');
if ($makeWebhook !== '') {
  try {
    $ch = curl_init($makeWebhook);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
      'bookingId' => $booking['bookingId'],
      'customerId' => $booking['customerId'],
      'fullName' => sanitize_string($payload['fullName'] ?? ''),
      'phone' => sanitize_string($payload['phone'] ?? ''),
      'email' => sanitize_email($payload['email'] ?? '', false),
      'serviceTitle' => sanitize_string($payload['serviceTitle'] ?? ''),
      'branchId' => sanitize_string($payload['branchId'] ?? ''),
      'branchTitle' => sanitize_string($payload['branchTitle'] ?? ''),
      'preferredDate' => sanitize_string($payload['preferredDate'] ?? ''),
      'notes' => sanitize_string($payload['notes'] ?? ''),
      'locale' => sanitize_string($payload['locale'] ?? 'ar'),
      'pageUrl' => sanitize_string($payload['pageUrl'] ?? ''),
      'createdAt' => gmdate('c'),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 6);
    curl_exec($ch);
    curl_close($ch);
  } catch (Throwable $exception) {
  }
}

api_success('Booking request sent successfully.', [
  'bookingId' => $booking['bookingId'],
  'customerId' => $booking['customerId'],
]);
