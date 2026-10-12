// ===============================================
// src/lib/testimonials.ts
// منظومة تقييمات وآراء مراجعي كايرو كوزمو سنتر
// ===============================================

export type Testimonial = {
  id: string;
  name: string;
  service: string;
  rating: number;
  text: string;
  status?: "published" | "draft";
  branch?: string;
  doctor?: string;
  date?: string;
  verified?: boolean;
  serviceCategory?: "laser" | "injections" | "skincare" | "body";
};

export const testimonials: Record<"ar" | "en", Testimonial[]> = {
  ar: [
    {
      id: "t1",
      name: "سارة محمد العوضي",
      service: "جلسات ليزر كانديلا جينتل ماكس برو",
      rating: 5,
      text: "تجربة الليزر مع جهاز كانديلا برو فاقت توقعاتي تماماً! من أول جلسة لاحظت فرق كبير في كثافة الشعر، ونظام التبريد DCD جعل الجلسة مريحة جداً بدون أي حروق أو ألم.",
      status: "published",
      branch: "فرع مصر الجديدة (شيراتون)",
      doctor: "د. ناهد سمير",
      date: "منذ أسبوعين",
      verified: true,
      serviceCategory: "laser",
    },
    {
      id: "t2",
      name: "مي أحمد عبد الفتاح",
      service: "حقن فيلر الشفاه الفرنسي والبروفايلو",
      rating: 5,
      text: "د. باسم زكي فنان حقيقي! أول مرة أحس إن في تقييم طبي دقيق لملامح وجهي قبل الحقن. النتيجة طبيعية جداً وبدون أي تكتل، والكل بيسألني عن سر نضارة بشرتي.",
      status: "published",
      branch: "فرع الدقي",
      doctor: "د. باسم زكي",
      date: "منذ 10 أيام",
      verified: true,
      serviceCategory: "injections",
    },
    {
      id: "t3",
      name: "نورهان سمير خليل",
      service: "جلسة الهيدرافيشل الملكية 12 خطوة",
      rating: 5,
      text: "أفضل جلسة تنظيف ونضارة عملتها في حياتي! النظافة والتعقيم في جناح الهيدرافيشل 10/10، وشرحت لي الأخصائية كل خطوة قبل ما تبدأ، وخرجت وبشرتي بتلمع ومنتعشة.",
      status: "published",
      branch: "فرع مصر الجديدة (شيراتون)",
      doctor: "د. ناهد سمير",
      date: "منذ 3 أسابيع",
      verified: true,
      serviceCategory: "skincare",
    },
    {
      id: "t4",
      name: "مريم حسن الشناوي",
      service: "فراكشنال ليزر CO2 لآثار حب الشباب",
      rating: 5,
      text: "كنت بعاني من ندبات قديمة وآثار حب شباب، بعد 3 جلسات فراكشنال ليزر مع د. ناهد سمير، ملمس بشرتي اتغير 180 درجة واختفت معظم المسام الواسعة تماماً.",
      status: "published",
      branch: "فرع 6 أكتوبر",
      doctor: "د. ناهد سمير",
      date: "منذ شهر",
      verified: true,
      serviceCategory: "skincare",
    },
    {
      id: "t5",
      name: "مهندس خالد محمود",
      service: "نحت القوام وتجميد الدهون CoolSculpting",
      rating: 5,
      text: "خطة واضحة من أول يوم استشارة مع د. أحمد الشريف، بدون جراحة وتوقف عن العمل. بعد شهرين من جلسة الكول سكلبتنج نزلت في مقاسات البطن والوسط بشكل ملحوظ.",
      status: "published",
      branch: "فرع مصر الجديدة (شيراتون)",
      doctor: "د. أحمد الشريف",
      date: "منذ شهر ونصف",
      verified: true,
      serviceCategory: "body",
    },
    {
      id: "t6",
      name: "دينا طارق القاضي",
      service: "ليزر ديكا موفيو الإيطالي (بدون ألم)",
      rating: 5,
      text: "بشرتي حساسة جداً وكنت بخاف من الليزر، بس جهاز ديكا موفيو في فرع الدقي كان مريح جداً ومحستش بأي وخز، ونتايجه مع الشعر الوبري ممتازة.",
      status: "published",
      branch: "فرع الدقي",
      doctor: "د. باسم زكي",
      date: "منذ 5 أيام",
      verified: true,
      serviceCategory: "laser",
    },
  ],

  en: [
    {
      id: "t1",
      name: "Sarah M. Al-Awadi",
      service: "Candela GentleMax Pro Laser",
      rating: 5,
      text: "The Candela Pro laser exceeded all my expectations! Visible hair reduction from session 1, and the DCD cryo-cooling made it super comfortable with zero redness.",
      status: "published",
      branch: "Heliopolis (Sheraton)",
      doctor: "Dr. Nahed Samir",
      date: "2 weeks ago",
      verified: true,
      serviceCategory: "laser",
    },
    {
      id: "t2",
      name: "May Ahmed",
      service: "French Lip Filler & Profhilo",
      rating: 5,
      text: "Dr. Bassem Zaki is a true master! Natural, subtle enhancement without any swelling. Everyone keeps asking me about my fresh skin glow.",
      status: "published",
      branch: "Dokki Branch",
      doctor: "Dr. Bassem Zaki",
      date: "10 days ago",
      verified: true,
      serviceCategory: "injections",
    },
    {
      id: "t3",
      name: "Norhan Samir",
      service: "12-Step Royal Hydrafacial",
      rating: 5,
      text: "The highest standard of hygiene and deep cleansing I have ever experienced. My skin felt instantly hydrated, glowing and revitalized.",
      status: "published",
      branch: "Heliopolis (Sheraton)",
      doctor: "Dr. Nahed Samir",
      date: "3 weeks ago",
      verified: true,
      serviceCategory: "skincare",
    },
    {
      id: "t4",
      name: "Mariam Hassan",
      service: "Fractional CO2 Laser",
      rating: 5,
      text: "Treated my acne scars with Fractional laser. After 3 sessions, my skin texture improved dramatically. Highly recommended clinic!",
      status: "published",
      branch: "6th of October Branch",
      doctor: "Dr. Nahed Samir",
      date: "1 month ago",
      verified: true,
      serviceCategory: "skincare",
    },
    {
      id: "t5",
      name: "Khaled Mahmoud",
      service: "CoolSculpting 360 Body Sculpt",
      rating: 5,
      text: "A structured, non-invasive treatment plan with Dr. Ahmed El-Sherif. Significant reduction in waist measurements within two months.",
      status: "published",
      branch: "Heliopolis (Sheraton)",
      doctor: "Dr. Ahmed El-Sherif",
      date: "1 month ago",
      verified: true,
      serviceCategory: "body",
    },
    {
      id: "t6",
      name: "Dina Tarek",
      service: "DEKA Motus AX Painless Laser",
      rating: 5,
      text: "I have very sensitive skin, and the DEKA Moveo laser in Dokki was completely painless and extremely effective on fine baby hair.",
      status: "published",
      branch: "Dokki Branch",
      doctor: "Dr. Bassem Zaki",
      date: "5 days ago",
      verified: true,
      serviceCategory: "laser",
    },
  ],
};

const STORAGE_KEY = "admin_testimonials_v1";

export function getAllAdminTestimonials(): Testimonial[] {
  if (typeof window === "undefined") {
    return testimonials.ar;
  }
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(testimonials.ar));
  return testimonials.ar;
}

export function saveAllAdminTestimonials(list: Testimonial[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("cosmo:testimonials_updated"));
}

export function getPublishedTestimonials(locale: "ar" | "en"): Testimonial[] {
  if (typeof window === "undefined") return testimonials[locale] || testimonials.ar;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const list = JSON.parse(saved) as Testimonial[];
      const published = list.filter((item) => item.status !== "draft");
      if (published.length > 0) return published;
    } catch {}
  }
  return testimonials[locale] || testimonials.ar;
}

export function addPublicReview(review: Omit<Testimonial, "id">): Testimonial {
  const current = getAllAdminTestimonials();
  const newReview: Testimonial = {
    id: `rev-${Date.now()}`,
    ...review,
    status: "published",
    verified: true,
    date: "الآن",
  };
  const updated = [newReview, ...current];
  saveAllAdminTestimonials(updated);
  return newReview;
}
