// src/utils/whatsappHelper.ts
import { siteConfig } from "@/lib/i18n";

export function formatEgyptianPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "2" + cleaned;
  }
  if (!cleaned.startsWith("20") && cleaned.length === 10) {
    cleaned = "20" + cleaned;
  }
  return cleaned;
}

export function openWhatsAppChat(phone: string, text: string) {
  const formattedPhone = formatEgyptianPhone(phone);
  const encodedText = encodeURIComponent(text);
  const url = `https://wa.me/${formattedPhone}?text=${encodedText}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function generateBookingConfirmationMsg(booking: {
  customerName: string;
  serviceName: string;
  preferredDate: string;
  preferredTime?: string;
  branchName: string;
  id?: string;
}): string {
  return `مرحباً أ./عزيزي ${booking.customerName} ✨
يسعدنا في *مركز القاهرة الطبي للتجـميل والديرما (Cairo Cosmo)* تأكيد حجز موعدك لدينا:

📍 *الفرع:* ${booking.branchName}
💆‍♀️ *الخدمة:* ${booking.serviceName}
📅 *التاريخ:* ${booking.preferredDate}
⏰ *الوقت:* ${booking.preferredTime || "حسب التنسيق"}
🆔 *رقم الحجز:* ${booking.id || "العيادة"}

يرجى الحضور قبل الموعد بـ 10 دقائق. يسعدنا تقديم أفضل خدمة لكِ/لك! ❤️`;
}

export function generateSessionReminderMsg(customerName: string, serviceName: string, date: string, time: string): string {
  return `تذكير بموعد الجلسة 🌸
أهلاً ${customerName}،
نود تذكيركِ بموعد جلستك القادمة لـ *${serviceName}* غداً بتاريخ ${date} الساعة ${time} في عيادتنا.
نتطلع لرؤيتكِ دائماً في أتم صحة وجمال!✨`;
}

export function generateFollowUpMsg(customerName: string, serviceName: string): string {
  return `مرحباً ${customerName} ✨
نتمنى أن تكون نتائج جلسة *${serviceName}* اليوم ممتازة وتنال إعجابك!
في حال وجود أي استفسار أو تعليمات إضافية للعناية، فريقنا الطبي دائماً بخدمتك. ❤️`;
}
