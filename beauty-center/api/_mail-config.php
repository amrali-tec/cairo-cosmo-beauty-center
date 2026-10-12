<?php

declare(strict_types=1);

$getEnv = static function (string $key, mixed $default = null): mixed {
  if (array_key_exists($key, $_SERVER) && $_SERVER[$key] !== '') {
    return $_SERVER[$key];
  }

  if (array_key_exists($key, $_ENV) && $_ENV[$key] !== '') {
    return $_ENV[$key];
  }

  $value = getenv($key);
  if ($value !== false && $value !== '') {
    return $value;
  }

  return $default;
};

return [
  'SMTP_HOST' => (string) $getEnv('SMTP_HOST', 'smtp.hostinger.com'),
  'SMTP_PORT' => (int) $getEnv('SMTP_PORT', 465),
  'SMTP_SECURE' => filter_var($getEnv('SMTP_SECURE', true), FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE) ?? true,
  'SMTP_USER' => (string) $getEnv('SMTP_USER', 'no-reply@cairocosmo.online'),
  'SMTP_PASS' => (string) $getEnv('SMTP_PASS', ''),
  'FROM_EMAIL' => (string) $getEnv('FROM_EMAIL', 'no-reply@cairocosmo.online'),
  'FROM_NAME' => (string) $getEnv('FROM_NAME', 'Cairo Cosmo Center | مركز القاهرة الطبي'),
];
