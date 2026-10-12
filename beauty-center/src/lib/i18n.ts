// src/lib/i18n.ts
// i18n Configuration for Cairo Cosmo Center
// Bilingual: Arabic (RTL) + English (LTR)

export type Locale = "ar" | "en";

export const defaultLocale: Locale = "ar";
export const locales: Locale[] = ["ar", "en"];

export const localeNames: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
};

export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
};

export interface TranslatedString {
  ar: string;
  en: string;
}

export const getTranslation = (obj: TranslatedString, locale: Locale): string => {
  return obj?.[locale] ?? obj?.[defaultLocale] ?? "";
};


// Site Configuration
export const siteConfig = {
  url: "https://cairocosmo.online",
  name: {
    ar: "مركز القاهرة الطبي لجراحات التجميل والليزر",
    en: "Cairo Cosmo Center",
  },
  shortName: {
    ar: "كايرو كوزمو",
    en: "Cairo Cosmo",
  },
  description: {
    ar: "مركز القاهرة الطبي لجراحات التجميل والليزر - أفضل خدمات التجميل والعناية بالبشرة في مصر",
    en: "Cairo Cosmo Center - Premier Medical Aesthetic & Laser Center in Egypt",
  },
  defaultOgImage: "/assets/blog/How-to-choose-your-aesthetic-plan-cover.png",
  email: "info@cairocosmo.online",

  whatsapp: "201206666390",
  getWhatsAppMessage: (locale: Locale) => {
    return locale === "ar"
      ? "مرحباً، أود حجز موعد في Cairo Cosmo Center"
      : "Hi, I would like to book an appointment at Cairo Cosmo Center";
  },
  getWhatsAppUrl: (locale: Locale) => {
    const message = encodeURIComponent(siteConfig.getWhatsAppMessage(locale));
    return `https://wa.me/${siteConfig.whatsapp}?text=${message}`;
  },

  socialLinks: {
    facebook: "https://www.facebook.com/CCosmoCenter",
    instagram:
      "https://www.instagram.com/cairocosmocenter?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    youtube: "https://www.youtube.com/@cairocosmo",
    tiktok: "https://www.tiktok.com/@cairo.cosmo.cente?is_from_webapp=1&sender_device=pc",
  },
};

// ✅ كل الترجمات في مكان واحد
export const translations = {
  navigation: {
    home: { ar: "الرئيسية", en: "Home" },
    services: { ar: "الخدمات", en: "Services" },
    doctors: { ar: "الأطباء", en: "Doctors" },

    // ✅ صفحات موجودة في المشروع
    offers: { ar: "العروض", en: "Offers" },
    about: { ar: "من نحن", en: "About" },
    faq: { ar: "الأسئلة الشائعة", en: "FAQ" },

    // صفحات إضافية موجودة عندك
    beforeAfter: { ar: "قبل وبعد", en: "Before & After" },
    blog: { ar: "المدونة", en: "Blog" },
    contact: { ar: "اتصل بنا", en: "Contact" },
    bookNow: { ar: "احجز الآن", en: "Book Now" },
  },

  common: {
    learnMore: { ar: "اعرف المزيد", en: "Learn More" },
    viewAll: { ar: "عرض الكل", en: "View All" },
    readMore: { ar: "اقرأ المزيد", en: "Read More" },
    bookAppointment: { ar: "احجز موعد", en: "Book Appointment" },
    contactUs: { ar: "تواصل معنا", en: "Contact Us" },
    ourServices: { ar: "خدماتنا", en: "Our Services" },
    ourDoctors: { ar: "أطباؤنا", en: "Our Doctors" },
    ourBranches: { ar: "فروعنا", en: "Our Branches" },
    faq: { ar: "الأسئلة الشائعة", en: "FAQ" },
    loading: { ar: "جاري التحميل...", en: "Loading..." },
    submit: { ar: "إرسال", en: "Submit" },
    success: { ar: "تم بنجاح", en: "Success" },
    error: { ar: "حدث خطأ", en: "Error" },
  },

  hero: {
    title: {
      ar: "اكتشفي جمالك الحقيقي",
      en: "Discover Your True Beauty",
    },
    subtitle: {
      ar: "أحدث تقنيات التجميل والجلدية واالليزر بأيدي أفضل الأطباء في مصر",
      en: "Advanced dermatological and laser treatments performed by top-tier medical experts in Egypt.",
    },
    cta: { ar: "احجز استشارتك المجانية", en: "Book Your Free Consultation" },
    whatsappCta: { ar: "تواصل عبر واتساب", en: "Chat on WhatsApp" },
  },

  footer: {
    rights: { ar: "جميع الحقوق محفوظة", en: "All rights reserved" },
    quickLinks: { ar: "روابط سريعة", en: "Quick Links" },
    workingHours: { ar: "ساعات العمل", en: "Working Hours" },
    workingHoursValue: {
      ar: "السبت - الخميس: 10 ص - 10 م",
      en: "Sat - Thu: 10 AM - 10 PM",
    },
    followUs: { ar: "تابعونا", en: "Follow Us" },
  },

  booking: {
    title: { ar: "احجز موعدك", en: "Book Your Appointment" },
    subtitle: {
      ar: "املأ النموذج وسنتواصل معك في أقرب وقت",
      en: "Fill out the form and we'll contact you shortly",
    },
    fullName: { ar: "الاسم الكامل", en: "Full Name" },
    phone: { ar: "رقم الهاتف", en: "Phone Number" },
    service: { ar: "الخدمة المطلوبة", en: "Service Required" },
    branch: { ar: "الفرع المفضل", en: "Preferred Branch" },
    preferredDate: { ar: "التاريخ المفضل", en: "Preferred Date" },
    notes: { ar: "ملاحظات إضافية", en: "Additional Notes" },
    submitButton: { ar: "تأكيد الحجز", en: "Confirm Booking" },
    successMessage: {
      ar: "تم استلام طلبك! سنتواصل معك قريباً",
      en: "Request received! We'll contact you soon",
    },
    sendViaWhatsApp: { ar: "إرسال عبر واتساب", en: "Send via WhatsApp" },
  },

  contact: {
    title: { ar: "تواصل معنا", en: "Contact Us" },
    subtitle: {
      ar: "نحن هنا للإجابة على جميع استفساراتك",
      en: "We're here to answer all your questions",
    },
    address: { ar: "العنوان", en: "Address" },
    phone: { ar: "الهاتف", en: "Phone" },
    email: { ar: "البريد الإلكتروني", en: "Email" },
  },
} as const;

// ✅ Helper صغير يخليك تكتب: t(translations.navigation.home)
export const t = (key: TranslatedString, locale: Locale) => getTranslation(key, locale);
