<?php

declare(strict_types=1);

header('Content-Type: text/html; charset=utf-8');

echo "<h2>📧 اختبار إرسال البريد الإلكتروني في هوستنجر - Cairo Cosmo Center</h2>";

$configPath = __DIR__ . '/_mail-config.php';
if (!file_exists($configPath)) {
  die("<p style='color:red;'>⚠️ ملف الإعدادات _mail-config.php غير موجود!</p>");
}

$config = require $configPath;
echo "<ul>";
echo "<li><strong>SMTP Host:</strong> " . htmlspecialchars($config['SMTP_HOST']) . "</li>";
echo "<li><strong>SMTP Port:</strong> " . htmlspecialchars((string)$config['SMTP_PORT']) . "</li>";
echo "<li><strong>SMTP User:</strong> " . htmlspecialchars($config['SMTP_USER']) . "</li>";
echo "<li><strong>SMTP Pass:</strong> " . ($config['SMTP_PASS'] !== '' ? "✅ مُمكّنة" : "❌ غير مكتوبة بعد في _mail-config.php") . "</li>";
echo "</ul>";

$to = "bookings@cairocosmo.online";
$subject = "اختبار نظام البريد - " . date("Y-m-d H:i:s");
$body = "هذه الرسالة لاختبار إرسال واستقبال البريد الإلكتروني على استضافة هوستنجر بنجاح.";

// 1. Test PHP mail()
$headers = "From: Cairo Cosmo Center <no-reply@cairocosmo.online>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$mailSent = @mail($to, mb_encode_mimeheader($subject, "UTF-8"), $body, $headers);

if ($mailSent) {
  echo "<p style='color:green; font-weight:bold;'>✅ تم إرسال رسالة الاختبار بنجاح عبر نظام PHP mail() إلى bookings@cairocosmo.online!</p>";
} else {
  echo "<p style='color:orange;'>⚠️ تعذر الإرسال عبر PHP mail(). جاري اختبار PHPMailer...</p>";
}

// 2. Test PHPMailer if pass is set
if ($config['SMTP_PASS'] !== '') {
  require_once __DIR__ . '/PHPMailer/Exception.php';
  require_once __DIR__ . '/PHPMailer/PHPMailer.php';
  require_once __DIR__ . '/PHPMailer/SMTP.php';

  try {
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $config['SMTP_HOST'];
    $mail->Port = (int)$config['SMTP_PORT'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['SMTP_USER'];
    $mail->Password = $config['SMTP_PASS'];
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($config['FROM_EMAIL'], $config['FROM_NAME']);
    $mail->addAddress($to);
    $mail->Subject = $subject;
    $mail->Body = $body;
    $mail->send();

    echo "<p style='color:green; font-weight:bold;'>✅ تم الإرسال بنجاح عبر سيرفر PHPMailer (SMTP Hostinger)!</p>";
  } catch (Throwable $e) {
    echo "<p style='color:red;'>❌ خطأ في إرسال SMTP: " . htmlspecialchars($e->getMessage()) . "</p>";
  }
}
