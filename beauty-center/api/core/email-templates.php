<?php

declare(strict_types=1);

function renderClientBookingEmailHtml(
  array $booking,
  string $fullName,
  string $email,
  string $phone,
  string $serviceTitle,
  string $branchTitle,
  string $preferredDate,
  string $notes
): string {
  $bookingId = htmlspecialchars($booking['bookingId'] ?? 'BK-COSMO');
  $name = htmlspecialchars($fullName);
  $service = htmlspecialchars($serviceTitle);
  $branch = htmlspecialchars($branchTitle);
  $date = htmlspecialchars($preferredDate);
  $userPhone = htmlspecialchars($phone);
  $extraNotes = htmlspecialchars($notes !== '' ? $notes : 'لا توجد ملاحظات إضافية');

  return <<<HTML
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تأكيد طلب الحجز - مركز القاهرة الطبي</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f1ea;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      direction: rtl;
      text-align: right;
      color: #2b2b2b;
    }
    .wrapper {
      width: 100%;
      background-color: #f4f1ea;
      padding: 30px 10px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      border: 1px solid #e8e2d5;
    }
    .header {
      background: linear-gradient(135deg, #1a1a1a 0%, #2c2520 100%);
      padding: 35px 20px;
      text-align: center;
      border-bottom: 3px solid #d4af37;
    }
    .header img {
      max-width: 180px;
      height: auto;
    }
    .badge {
      display: inline-block;
      background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%);
      color: #ffffff;
      font-size: 13px;
      font-weight: bold;
      padding: 6px 16px;
      border-radius: 50px;
      margin-top: 15px;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 35px 30px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 800;
      color: #1a1a1a;
      margin-bottom: 10px;
    }
    .subtext {
      font-size: 14px;
      color: #666666;
      line-height: 1.6;
      margin-bottom: 25px;
    }
    .details-box {
      background-color: #faf8f5;
      border: 1px solid #ece5d8;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 30px;
    }
    .details-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px border #eee7da;
    }
    .details-row:last-child {
      border-bottom: none;
    }
    .label {
      font-size: 13px;
      color: #777777;
      font-weight: 600;
    }
    .value {
      font-size: 14px;
      color: #1a1a1a;
      font-weight: 700;
    }
    .value-highlight {
      color: #aa820a;
      font-weight: 800;
    }
    .cta-container {
      text-align: center;
      margin: 30px 0 20px 0;
    }
    .btn-gold {
      display: inline-block;
      background: linear-gradient(135deg, #d4af37 0%, #997405 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-size: 15px;
      font-weight: bold;
      padding: 14px 32px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
    }
    .footer {
      background-color: #1a1a1a;
      color: #a0a0a0;
      padding: 25px 20px;
      text-align: center;
      font-size: 12px;
      line-height: 1.8;
      border-top: 1px solid #333;
    }
    .footer a {
      color: #d4af37;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header with Clinic Logo -->
      <div class="header">
        <img src="https://cairocosmo.online/logo-light.png" alt="Cairo Cosmo Center Logo">
        <br>
        <div class="badge">✨ تم استلام طلب الحجز بنجاح</div>
      </div>

      <!-- Main Body Content -->
      <div class="content">
        <div class="greeting">أهلاً بك عزيزي/عزيزتي {$name}،</div>
        <div class="subtext">
          نشكر اختيارك لمركز القاهرة الطبي <strong>Cairo Cosmo Center</strong>. يسعدنا إبلاغك بأنه تم تسجيل طلب حجزك بنجاح وسيقوم فريق الاستقبال بالتواصل معك قريباً لتأكيد الموعد المفضل وترتيب زيارتك للفرع.
        </div>

        <!-- Details Card -->
        <div class="details-box">
          <div style="font-size: 15px; font-weight: 800; color: #1a1a1a; margin-bottom: 15px; border-bottom: 2px solid #d4af37; padding-bottom: 8px;">
            📋 تفاصيل الحجز الخاص بك:
          </div>

          <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e8e2d5;">
              <td class="label">رقم مرجع الحجز:</td>
              <td class="value value-highlight">{$bookingId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e8e2d5;">
              <td class="label">الخدمة المطلوبة:</td>
              <td class="value">{$service}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e8e2d5;">
              <td class="label">الفرع المفضل:</td>
              <td class="value">{$branch}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e8e2d5;">
              <td class="label">الموعد المطلوب:</td>
              <td class="value">{$date}</td>
            </tr>
            <tr>
              <td class="label">رقم الهاتف:</td>
              <td class="value">{$userPhone}</td>
            </tr>
          </table>
        </div>

        <!-- Call to action button -->
        <div class="cta-container">
          <a href="https://cairocosmo.online/" target="_blank" class="btn-gold">
            🌐 زيارة موقعنا واستعراض الخدمات
          </a>
        </div>

        <div style="font-size: 12px; color: #888; text-align: center; margin-top: 25px;">
          إذا كان لديك أي استفسار عاجل، يمكنك التواصل مباشرة مع قسم خدمة العملاء على الرقم الموحد.
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <strong>Cairo Cosmo Center | مركز القاهرة الطبي والتجميلي</strong><br>
        شيراتون • الدقي • 6 أكتوبر • المنصورة • شبرا<br>
        <a href="https://cairocosmo.online/">https://cairocosmo.online/</a> | <a href="mailto:info@cairocosmo.online">info@cairocosmo.online</a><br>
        © 2026 جميع الحقوق محفوظة لمركز القاهرة الطبي.
      </div>
    </div>
  </div>
</body>
</html>
HTML;
}

function renderAdminBookingEmailHtml(
  array $booking,
  string $fullName,
  string $email,
  string $phone,
  string $serviceTitle,
  string $branchTitle,
  string $preferredDate,
  string $notes
): string {
  $bookingId = htmlspecialchars($booking['bookingId'] ?? 'BK-COSMO');
  $name = htmlspecialchars($fullName);
  $service = htmlspecialchars($serviceTitle);
  $branch = htmlspecialchars($branchTitle);
  $date = htmlspecialchars($preferredDate);
  $userPhone = htmlspecialchars($phone);
  $userEmail = htmlspecialchars($email !== '' ? $email : 'غير مدخل');
  $extraNotes = htmlspecialchars($notes !== '' ? $notes : 'لا توجد ملاحظات');

  $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
  if (strlen($cleanPhone) === 11 && str_starts_with($cleanPhone, '01')) {
    $cleanPhone = '2' . $cleanPhone;
  }
  $whatsappUrl = "https://wa.me/{$cleanPhone}?text=" . urlencode("مرحباً {$fullName}، معك فريق استقبال مركز القاهرة الطبي بخصوص حجزك رقم {$bookingId}.");

  return <<<HTML
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>إشعار حجز جديد - Cairo Cosmo Center</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #121212;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      direction: rtl;
      text-align: right;
      color: #e0e0e0;
    }
    .wrapper {
      padding: 30px 10px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #1e1e1e;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid #333333;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .header {
      background: linear-gradient(135deg, #d4af37 0%, #8a6805 100%);
      padding: 25px;
      text-align: center;
      color: #ffffff;
    }
    .header h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 900;
    }
    .content {
      padding: 30px;
    }
    .badge-urgent {
      display: inline-block;
      background-color: #e53e3e;
      color: #ffffff;
      font-size: 12px;
      font-weight: bold;
      padding: 4px 12px;
      border-radius: 50px;
      margin-bottom: 20px;
    }
    .table-box {
      background-color: #262626;
      border: 1px solid #3d3d3d;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 25px;
    }
    .table-box table tr {
      border-bottom: 1px solid #383838;
    }
    .table-box table tr:last-child {
      border-bottom: none;
    }
    .lbl {
      color: #a0a0a0;
      font-size: 13px;
      font-weight: bold;
    }
    .val {
      color: #ffffff;
      font-size: 14px;
      font-weight: bold;
    }
    .val-gold {
      color: #d4af37;
      font-size: 16px;
      font-weight: 900;
    }
    .btn-wa {
      display: inline-block;
      background-color: #25d366;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 15px;
      font-weight: bold;
      padding: 12px 28px;
      border-radius: 12px;
      margin-right: 10px;
    }
    .btn-crm {
      display: inline-block;
      background-color: #3182ce;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 15px;
      font-weight: bold;
      padding: 12px 28px;
      border-radius: 12px;
    }
    .footer {
      background-color: #141414;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h2>🚨 إشعار حجز جديد للموقع الإلكتروني</h2>
        <div style="font-size: 13px; margin-top: 5px; opacity: 0.9;">الفرع المخصص: {$branch}</div>
      </div>

      <div class="content">
        <div class="badge-urgent">⚡ يتطلب التواصل المباشر مع المراجع</div>

        <div class="table-box">
          <table width="100%" cellpadding="8" cellspacing="0">
            <tr>
              <td class="lbl">رقم الحجز:</td>
              <td class="val val-gold">{$bookingId}</td>
            </tr>
            <tr>
              <td class="lbl">اسم المراجع:</td>
              <td class="val">{$name}</td>
            </tr>
            <tr>
              <td class="lbl">رقم الهاتف:</td>
              <td class="val"><a href="tel:{$userPhone}" style="color: #63b3ed; text-decoration: none;">{$userPhone}</a></td>
            </tr>
            <tr>
              <td class="lbl">البريد الإلكتروني:</td>
              <td class="val">{$userEmail}</td>
            </tr>
            <tr>
              <td class="lbl">الخدمة المطلوبة:</td>
              <td class="val">{$service}</td>
            </tr>
            <tr>
              <td class="lbl">الفرع المحدد:</td>
              <td class="val">{$branch}</td>
            </tr>
            <tr>
              <td class="lbl">الموعد المطلوب:</td>
              <td class="val">{$date}</td>
            </tr>
            <tr>
              <td class="lbl">الملاحظات:</td>
              <td class="val">{$extraNotes}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 25px;">
          <a href="{$whatsappUrl}" target="_blank" class="btn-wa">
            💬 فتح واتساب المراجع
          </a>
          <a href="https://cairocosmo.online/admin/bookings" target="_blank" class="btn-crm">
            🖥️ فتح لوحة التحكّم
          </a>
        </div>
      </div>

      <div class="footer">
        نظام إدارة الحجوزات الآلي • Cairo Cosmo Center CRM
      </div>
    </div>
  </div>
</body>
</html>
HTML;
}
