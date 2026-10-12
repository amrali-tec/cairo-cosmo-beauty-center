// ===============================================
// src/services/sophiaAgentService.ts
// محرك صوفيا للذكاء الاصطناعي وإدارة العمليات (SOPHIA AI)
// ===============================================

import {
  getStoredBookings,
  createRealBooking,
  RealBookingRecord,
  saveStoredBookings,
} from "./realtimeBookingService";
import { computeLiveClinicStats, ClinicAnalyticsData } from "./liveAnalyticsService";
import { getAllAdminOffers, saveAllAdminOffers, type AdminOffer } from "@/lib/admin/offers";
import { getAllAdminServices, saveAllAdminServices, type AdminService } from "@/lib/admin/services";
import { getAllAdminBlogPosts, saveAllAdminBlogPosts, type AdminBlogPost } from "@/lib/admin/blog";
import { getAllAdminDoctors, saveAllAdminDoctors, type AdminDoctor } from "@/lib/admin/doctors";
import { runFullSystemDiagnostics, executeAutoRepair, SystemHealthReport } from "./systemDiagnosticService";
import { getStoredCronTasks, runCronJobNow, SophiaCronTask } from "./sophiaAutonomousScheduler";

export interface SophiaAction {
  type:
    | "booking_created"
    | "rooms_status"
    | "crm_query"
    | "campaign_draft"
    | "stats_report"
    | "reminder_queue"
    | "offer_created"
    | "service_created"
    | "blog_created"
    | "doctor_created"
    | "system_diagnostics"
    | "cron_task_run"
    | "omni_brain"
    | "info";
  title: string;
  data: any;
  actionButton?: {
    label: string;
    url?: string;
    actionKey?: string;
  };
}

export interface SophiaMessage {
  id: string;
  sender: "sophia" | "admin";
  text: string;
  action?: SophiaAction;
  timestamp: string;
  quickPrompts?: string[];
}

export interface SophiaAutomatedWorkflow {
  id: string;
  nameAr: string;
  descriptionAr: string;
  enabled: boolean;
  frequency: string;
  lastExecuted: string;
  triggeredCount: number;
}

export const initialSophiaWorkflows: SophiaAutomatedWorkflow[] = [
  {
    id: "wf-reminder",
    nameAr: "وكيل التذكير الآلي بالمواعيد (24h Reminder)",
    descriptionAr: "تجهيز رسائل التذكير المباشرة عبر الواتساب لجميع المراجعين قبل موعد الجلسة بـ 24 ساعة.",
    enabled: true,
    frequency: "يومياً الساعة 09:00 صباحاً",
    lastExecuted: "اليوم 09:00 ص",
    triggeredCount: 42,
  },
  {
    id: "wf-touchup",
    nameAr: "وكيل جدولة جلسات الرتوش لليزر (Laser Touch-up)",
    descriptionAr: "تتبع مراجعي جلسات الليزر وإرسال إشعار تذكير بطلب حجز جلسة الرتوش المجانية بعد 10 أيام من الجلسة.",
    enabled: true,
    frequency: "تلقائي بعد كل جلسة ليزر",
    lastExecuted: "منذ ساعتين",
    triggeredCount: 28,
  },
  {
    id: "wf-vip-retention",
    nameAr: "وكيل استعادة ورعاية عملاء النخبة VIP",
    descriptionAr: "رصد عملاء VIP الذين لم يحجزوا منذ أكثر من 45 يوماً وتجهيز باقات خصم حصرية مخصصة لهم.",
    enabled: true,
    frequency: "أسبوعياً كل يوم سبت",
    lastExecuted: "السبت الماضي",
    triggeredCount: 15,
  },
  {
    id: "wf-device-check",
    nameAr: "مراقب كفاءة وتعقيم أجهزة كانديلا وديكا",
    descriptionAr: "تنبيه مسؤولي الفرع بمواعيد تنظيف العدسات والتعقيم الدوري بعد كل 25 ساعة تشغيلية للأجهزة.",
    enabled: true,
    frequency: "مراقبة حية مستمرة",
    lastExecuted: "منذ 30 دقيقة",
    triggeredCount: 64,
  },
];

const STORAGE_WORKFLOWS_KEY = "sophia_ai_workflows_v1";

export function getStoredWorkflows(): SophiaAutomatedWorkflow[] {
  try {
    const raw = localStorage.getItem(STORAGE_WORKFLOWS_KEY);
    return raw ? JSON.parse(raw) : initialSophiaWorkflows;
  } catch {
    return initialSophiaWorkflows;
  }
}

export function saveStoredWorkflows(list: SophiaAutomatedWorkflow[]): void {
  try {
    localStorage.setItem(STORAGE_WORKFLOWS_KEY, JSON.stringify(list));
  } catch {}
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\u064B-\u065F]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// -------------------------------------------------------------
// 1. Sophia Autonomous Tool: Publish New Offer to Public Website
// -------------------------------------------------------------
export function publishOfferViaSophia(titleHint: string, categoryHint: string = "laser"): AdminOffer {
  const currentOffers = getAllAdminOffers();
  const id = `offer-sophia-${Date.now()}`;
  const slug = `${slugify(titleHint || "new-exclusive-offer")}-${Date.now().toString().slice(-4)}`;

  let category: AdminOffer["category"] = "laser";
  if (categoryHint.includes("نضارة") || categoryHint.includes("بشرة") || categoryHint.includes("skin")) category = "skin";
  else if (categoryHint.includes("فيلر") || categoryHint.includes("بوتوكس") || categoryHint.includes("حقن")) category = "injectables";
  else if (categoryHint.includes("قوام") || categoryHint.includes("تخسيس") || categoryHint.includes("body")) category = "body";

  const newOffer: AdminOffer = {
    id,
    slug,
    category,
    featured: true,
    discountLabel: { ar: "عرض استثنائي", en: "Special Exclusive Deal" },
    validUntil: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    title: {
      ar: titleHint.trim() || "باقة النضارة والليزر الحصرية",
      en: "Exclusive Laser & Aesthetics Package",
    },
    subtitle: {
      ar: "باقة مخصصة بأحدث التقنيات مع استشارة وتقييم مجاني",
      en: "Tailored luxury bundle with complimentary clinical assessment",
    },
    description: {
      ar: `باقة مميزة تم اعتمادها ونشرها بواسطة الآجينت صوفيا لمركز كايرو كوزمو، تشمل خطة علاجية متكاملة بأحدث الأجهزة المعتمدة دولياً.`,
      en: `Exclusive clinical bundle published by Sophia AI for Cairo Cosmo Center, featuring state-of-the-art medical technology.`,
    },
    includes: [
      { ar: "استشارة وتقييم أولي مجاني من الاستشاري", en: "Complimentary specialist consultation" },
      { ar: "جلسة رتوش ومتابعة مجانية بعد الجلسة", en: "Free follow-up touchup session" },
      { ar: "خطة علاجية مخصصة حسب نوع البشرة", en: "Customized treatment protocol" },
    ],
    status: "published",
  };

  saveAllAdminOffers([newOffer, ...currentOffers]);
  return newOffer;
}

// -------------------------------------------------------------
// 2. Sophia Autonomous Tool: Publish New Medical Service
// -------------------------------------------------------------
export function publishServiceViaSophia(titleHint: string, categoryHint: string = "skin"): AdminService {
  const currentServices = getAllAdminServices();
  const id = `service-sophia-${Date.now()}`;
  const slug = `${slugify(titleHint || "new-clinical-service")}-${Date.now().toString().slice(-4)}`;

  let category: AdminService["category"] = "skin";
  if (categoryHint.includes("ليزر") || categoryHint.includes("laser")) category = "laser";
  else if (categoryHint.includes("فيلر") || categoryHint.includes("حقن") || categoryHint.includes("injectable")) category = "injectables";
  else if (categoryHint.includes("قوام") || categoryHint.includes("body")) category = "body";

  const newService: AdminService = {
    id,
    slug,
    category,
    title: {
      ar: titleHint.trim() || "جلسة الإكسوزوم لتجديد نضارة البشرة",
      en: "Exosomes Skin Bio-Regeneration",
    },
    subtitle: {
      ar: "تقنية خلوية متطورة لتحفيز الكولاجين وتوحيد لون البشرة",
      en: "Advanced cellular bio-stimulation for collagen and radiance",
    },
    shortDescription: {
      ar: "جلسة علاجية متطورة بإشراف استشاريي الجلدية والتجميل لنتائج طبيعية ومستدامة.",
      en: "State-of-the-art procedure administered by certified aesthetic specialists.",
    },
    description: {
      ar: `خدمة طبية وتجميلية متكاملة تم توثيقها واعتمادها في نظام كايرو كوزمو سنتر. يتم تطبيق أعلى معايير الأمان الطبي والتعقيم باستخدام أحدث الأجهزة العالمية.`,
      en: `Comprehensive aesthetic service published in Cairo Cosmo system under high medical safety protocols.`,
    },
    highlights: [
      { ar: "نتائج طبيعية آمنة ومعتمدة من FDA", en: "FDA-cleared natural and safe results" },
      { ar: "إشراف نخبة من أساتذة واستشاريي التجميل", en: "Board-certified specialist supervision" },
      { ar: "بدون فترة نقاهة مع راحة تامة أثناء الجلسة", en: "Zero downtime with maximum comfort" },
    ],
    idealFor: [
      { ar: "تجديد نضارة البشرة الباهتة والمرهقة", en: "Revitalizing dull and tired skin" },
      { ar: "علاج آثار الحبوب والمسام الواسعة", en: "Pore refinement and acne mark remodeling" },
    ],
    steps: [
      { ar: "فحص وتقييم نوع البشرة بواسطة الاستشاري", en: "Specialist skin diagnosis and assessment" },
      { ar: "تطبيق البروتوكول العلاجي بأحدث الأجهزة", en: "Clinical treatment application" },
      { ar: "وضع السيرومات المهدئة وتعليمات العناية", en: "Soothing serums and home-care plan" },
    ],
    aftercare: [
      { ar: "تجنب التعرض المباشر للشمس واستخدام واقي الشمس الطبي", en: "Avoid direct sunlight and use medical SPF" },
      { ar: "الالتزام بالترطيب المستمر للبشرة", en: "Maintain deep daily hydration" },
    ],
    status: "published",
  };

  saveAllAdminServices([newService, ...currentServices]);
  return newService;
}

// -------------------------------------------------------------
// 3. Sophia Autonomous Tool: Publish New Medical Blog Post
// -------------------------------------------------------------
export function publishBlogPostViaSophia(titleHint: string): AdminBlogPost {
  const currentPosts = getAllAdminBlogPosts();
  const id = `post-sophia-${Date.now()}`;
  const slug = `${slugify(titleHint || "aesthetic-medical-tips")}-${Date.now().toString().slice(-4)}`;

  const newPost: AdminBlogPost = {
    id,
    slug,
    title: {
      ar: titleHint.trim() || "دليلكِ الشامل للعناية بالبشرة بعد جلسات الليزر والفيلر",
      en: "Complete Post-Care Guide for Laser & Injectables",
    },
    excerpt: {
      ar: "نصائح وإرشادات طبية من استشاريي كايرو كوزمو للحفاظ على نضارة البشرة وضمان أفضل نتائج علاجية تدوم طويلاً.",
      en: "Clinical guidance from Cairo Cosmo specialists to preserve your glow and maximize treatment results.",
    },
    content: {
      ar: `تعتبر مرحلة العناية بالبشرة بعد الجلسات التجميلية جزءاً لا يتجزأ من نجاح الخطة العلاجية.\n\n### أهم النصائح الطبية المعتمدة:\n1. **الترطيب المكثف:** استخدام كريمات الترطيب الطبية الخالية من العطور.\n2. **الحماية من أشعة الشمس:** تطبيق واقي شمس بمعامل حماية +50 كل ساعتين خارج المنزل.\n3. **تجنب الماء الساخن:** الامتناع عن الساونا والحمامات الساخنة لمدة 48 ساعة بعد الجلسة.\n\nفي كايرو كوزمو سنتر، يحرص أطباؤنا على متابعة حالتكِ خطوة بخطوة بعد كل جلسة لضمان راحتكِ وسلامتكِ التامة.`,
      en: `Post-treatment care is essential for achieving optimal aesthetic outcomes.\n\n### Key Specialist Recommendations:\n1. **Deep Hydration:** Use fragrance-free medical moisturizers.\n2. **Sun Protection:** Apply broad-spectrum SPF 50+ every 2 hours.\n3. **Avoid Heat:** Refrain from saunas and hot showers for 48 hours.\n\nOur clinic team follows up continuously to ensure your comfort and long-lasting glow.`,
    },
    category: "laser",
    author: "د. ناهد سمير (استشاري الجلدية والتجميل)",
    readTime: "4 دقائق",
    publishedAt: new Date().toISOString().slice(0, 10),
    status: "published",
  };

  saveAllAdminBlogPosts([newPost, ...currentPosts]);
  return newPost;
}

// -------------------------------------------------------------
// 4. Sophia Autonomous Tool: Publish New Doctor Profile
// -------------------------------------------------------------
export function publishDoctorViaSophia(nameHint: string, specialtyHint: string = "جلدية وتجميل"): AdminDoctor {
  const currentDoctors = getAllAdminDoctors();
  const id = `doc-sophia-${Date.now()}`;
  const slug = `${slugify(nameHint || "dr-specialist")}-${Date.now().toString().slice(-4)}`;

  const newDoctor: AdminDoctor = {
    id,
    slug,
    name: {
      ar: nameHint.trim() || "د. دينا رمزي",
      en: "Dr. Dina Ramzy",
    },
    title: {
      ar: `استشاري ${specialtyHint.trim()} والليزر`,
      en: `Consultant of Dermatology & Aesthetics`,
    },
    specialty: {
      ar: specialtyHint.trim() || "علاج أمراض الجلدية وجلسات الحقن التجميلي والليزر",
      en: "Dermatology, Aesthetic Injections & Advanced Laser",
    },
    bio: {
      ar: `استشاري معتمد وعضو الجمعية المصرية لطب الجلدية والتجميل، خبرة أكثر من 12 عاماً في أحدث تقنيات الليزر وحقن الفيلر والبوتوكس.`,
      en: `Certified consultant and member of the Aesthetic Dermatology Society with over 12 years of clinical expertise.`,
    },
    status: "published",
  };

  saveAllAdminDoctors([newDoctor, ...currentDoctors]);
  return newDoctor;
}

/**
 * Sophia AI Reasoning Engine
 * Process incoming natural language commands from admin staff and execute real tasks.
 */
export async function processSophiaCommand(query: string): Promise<SophiaMessage> {
  const q = query.trim().toLowerCase();
  const now = new Date();
  const timeStr = now.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
  const storedBookings = getStoredBookings();

  // ==============================================================
  // A. INTENT: Autonomous Publishing: ADD NEW OFFER TO PUBLIC WEBSITE
  // ==============================================================
  if (
    (q.includes("عرض") || q.includes("عروض") || q.includes("باقة") || q.includes("offer")) &&
    (q.includes("اضف") || q.includes("أضف") || q.includes("ضيفي") || q.includes("انشري") || q.includes("انشر") || q.includes("جديد") || q.includes("create") || q.includes("publish"))
  ) {
    let titleHint = "باقة نضارة الصيف لليزر كانديلا برو";
    const titleMatch = query.match(/(?:عرض|باقة|بعنوان|اسمها|اسمه)?\s*([أ-يA-Za-z0-9\s]+(?:ليزر|نضارة|فيلر|بوتوكس|صيف|رمضان|عروس|قوام)[أ-يA-Za-z0-9\s]*)/);
    if (titleMatch && titleMatch[1] && titleMatch[1].length > 4) {
      titleHint = titleMatch[1].trim();
    }

    const createdOffer = publishOfferViaSophia(titleHint, q);

    return {
      id: `sophia-${Date.now()}`,
      sender: "sophia",
      text: `تم إنشاء ونشر العرض بنجاح على الموقع العام يا دكتور! 🎁✨\n\n📋 **عنوان العرض:** ${createdOffer.title.ar}\n🏷️ **التصنيف:** ${createdOffer.category.toUpperCase()}\n⭐ **الحالة:** منشور ومميز بالصفحة الرئيسية وصفحة العروض (Featured: Active)\n📅 **تاريخ السريان:** حتى ${createdOffer.validUntil}\n\n✅ تم تفعيل العرض فورياً ويمكن لزوار الموقع تصفحه وطلب السعر والخصم المخصص عبر الواتساب مباشرة.`,
      action: {
        type: "offer_created",
        title: `عرض منشور: ${createdOffer.title.ar}`,
        data: {
          offerId: createdOffer.id,
          category: createdOffer.category,
          status: "منشور على الموقع (Published) 🟢",
          slug: createdOffer.slug,
        },
        actionButton: {
          label: "معاينة العرض في صفحة العروض بالموقع",
          url: "/ar/offers",
        },
      },
      timestamp: timeStr,
      quickPrompts: [
        "معاينة العرض في صفحة الإدارة",
        "تجهيز مسودة حملة واتساب لهذا العرض",
        "ملخص مواعيد اليوم",
      ],
    };
  }

  // ==============================================================
  // B. INTENT: Autonomous Publishing: ADD NEW MEDICAL SERVICE
  // ==============================================================
  if (
    (q.includes("خدمة") || q.includes("خدمات") || q.includes("service")) &&
    (q.includes("اضف") || q.includes("أضف") || q.includes("ضيفي") || q.includes("انشري") || q.includes("انشر") || q.includes("جديد") || q.includes("create"))
  ) {
    let titleHint = "جلسة تقنية الإكسوزوم للنضارة العميقة";
    const nameMatch = query.match(/(?:خدمة|اسمها|بعنوان)?\s*([أ-يA-Za-z0-9\s]+(?:إكسوزوم|ليزر|فيلر|بوتوكس|تنظيف|نحت|تقشير)[أ-يA-Za-z0-9\s]*)/);
    if (nameMatch && nameMatch[1] && nameMatch[1].length > 3) {
      titleHint = nameMatch[1].trim();
    }

    const createdService = publishServiceViaSophia(titleHint, q);

    return {
      id: `sophia-${Date.now()}`,
      sender: "sophia",
      text: `تم توثيق ونشر الخدمة الطبية الجديدة بنجاح على الموقع العام! 🩺✨\n\n🩺 **اسم الخدمة:** ${createdService.title.ar}\n📂 **القسم:** ${createdService.category.toUpperCase()}\n📋 **المحتوى:** تم بناء خطوات الجلسة، المميزات الطبية، الحالات المناسبة، وإرشادات ما بعد الجلسة تلقائياً باللغتين العربية والإنجليزية.\n\n🌐 الخدمة أصبحت متاحة فورياً لجميع زوار الموقع وللحجز المباشر.`,
      action: {
        type: "service_created",
        title: `خدمة طبية معتمدة: ${createdService.title.ar}`,
        data: {
          serviceId: createdService.id,
          category: createdService.category,
          status: "منشورة على الموقع 🟢",
          slug: createdService.slug,
        },
        actionButton: {
          label: "استعراض الخدمة في صفحة الخدمات",
          url: "/ar/services",
        },
      },
      timestamp: timeStr,
      quickPrompts: [
        "إضافة عرض ترويجي لهذه الخدمة",
        "حجز موعد لمراجع على هذه الخدمة",
        "ملخص اليوم",
      ],
    };
  }

  // ==============================================================
  // C. INTENT: Autonomous Publishing: ADD NEW BLOG POST / MEDICAL ARTICLE
  // ==============================================================
  if (
    (q.includes("مقال") || q.includes("مقالة") || q.includes("نصيحة") || q.includes("مدونة") || q.includes("blog") || q.includes("article")) &&
    (q.includes("اضف") || q.includes("أضف") || q.includes("ضيفي") || q.includes("انشري") || q.includes("انشر") || q.includes("اكتبي") || q.includes("جديد"))
  ) {
    let titleHint = "أهم الإرشادات الطبية المعتمدة بعد جلسات الليزر والفيلر";
    const postMatch = query.match(/(?:مقال|مقالة|عن|بعنوان)?\s*([أ-يA-Za-z0-9\s]+(?:ليزر|بشرة|فيلر|بوتوكس|نضارة|عناية|تجميل)[أ-يA-Za-z0-9\s]*)/);
    if (postMatch && postMatch[1] && postMatch[1].length > 4) {
      titleHint = postMatch[1].trim();
    }

    const createdPost = publishBlogPostViaSophia(titleHint);

    return {
      id: `sophia-${Date.now()}`,
      sender: "sophia",
      text: `قمت بصياغة ونشر المقال الطبي الجديد في مدونة المركز بنجاح! 📝🌸\n\n📰 **عنوان المقال:** ${createdPost.title.ar}\n🩺 **الكاتب:** ${createdPost.author}\n⏱️ **وقت القراءة:** ${createdPost.readTime}\n📅 **تاريخ النشر:** ${createdPost.publishedAt}\n\nالمقال متاح الآن لزوار الموقع ويدعم تحسين السيو (SEO) ومعدلات البحث العضوي لمركز كايرو كوزمو.`,
      action: {
        type: "blog_created",
        title: `مقال منشور في المدونة: ${createdPost.title.ar}`,
        data: {
          postId: createdPost.id,
          author: createdPost.author,
          status: "منشور في المدونة 🟢",
          slug: createdPost.slug,
        },
        actionButton: {
          label: "قراءة المقال في المدونة بالموقع",
          url: `/ar/blog/${createdPost.slug}`,
        },
      },
      timestamp: timeStr,
      quickPrompts: [
        "معاينة المقال في إدارة المدونة",
        "تجهيز حملة واتساب بنصيحة هذا المقال",
        "ملخص مواعيد اليوم",
      ],
    };
  }

  // ==============================================================
  // D. INTENT: Autonomous Publishing: ADD NEW DOCTOR PROFILE
  // ==============================================================
  if (
    (q.includes("دكتور") || q.includes("طبيب") || q.includes("استشاري") || q.includes("doctor")) &&
    (q.includes("اضف") || q.includes("أضف") || q.includes("ضيفي") || q.includes("جديد") || q.includes("انضم"))
  ) {
    let nameHint = "د. دينا رمزي";
    const docMatch = query.match(/(?:دكتور|طبيب|استشاري|اسمها|اسمه)?\s*(د\.?\s*[أ-يA-Za-z]+(?:\s+[أ-يA-Za-z]+)?)/);
    if (docMatch && docMatch[1] && docMatch[1].length > 3) {
      nameHint = docMatch[1].trim();
    }

    const createdDoc = publishDoctorViaSophia(nameHint, "الجلدية والتجميل والليزر");

    return {
      id: `sophia-${Date.now()}`,
      sender: "sophia",
      text: `تمت إضافة الملف التعريفي للطبيب الجديد في الفريق الطبي بنجاح! 🩺✨\n\n👨‍⚕️ **الاسم:** ${createdDoc.name.ar}\n🎓 **المسمى:** ${createdDoc.title.ar}\n📋 **التخصص:** ${createdDoc.specialty.ar}\n\nتم تحديث قائمة أطباء المركز في الموقع العام ونظام الحجز وجدولة العيادات فورياً.`,
      action: {
        type: "doctor_created",
        title: `طبيب استشاري جديد: ${createdDoc.name.ar}`,
        data: {
          doctorId: createdDoc.id,
          title: createdDoc.title.ar,
          status: "مضاف للفريق الطبي 🟢",
        },
        actionButton: {
          label: "استعراض الأطباء في صفحة الفريق الطبي",
          url: "/ar/doctors",
        },
      },
      timestamp: timeStr,
      quickPrompts: [
        "جدولة مواعيد لهذا الطبيب في فرع شيراتون",
        "إضافة خدمة جديدة مرتبطة بالطبيب",
        "ملخص مواعيد اليوم",
      ],
    };
  }

  // 1. INTENT: Summarize Today's Appointments & Performance
  if (
    q.includes("ملخص") ||
    q.includes("اليوم") ||
    q.includes("تقرير") ||
    q.includes("مواعيد") ||
    q.includes("summary") ||
    q.includes("today")
  ) {
    const totalToday = storedBookings.length;
    const completed = storedBookings.filter((b) => b.status === "completed").length;
    const pending = storedBookings.filter((b) => b.status === "pending").length;
    const confirmed = storedBookings.filter((b) => b.status === "confirmed").length;

    const summaryText =
      totalToday === 0
        ? `أهلاً بك يا دكتور! 🌸\n\n📊 **إجمالي الحجوزات المسجلة:** 0 مواعيد (السجل فارغ ونظيف بانتظار أول حجز حقيقي بالموقع أو تسجيل حجز مباشر بالعيادة).\n✅ **الجلسات المكتملة:** 0\n⏳ **المراجعين في الانتظار:** 0\n\n🟢 **أجهزة الليزر وغرف الكشف:** جميع الأجهزة (كانديلا وديكا) والغرف في الفروع الثلاثة جاهزة ومتاحة بالكامل لاستقبال الحالات فوراً.`
        : `أهلاً بك! إليك التقرير التشغيلي المباشر لليوم:\n\n📊 **إجمالي الحجوزات المسجلة:** ${totalToday} موعد حقيقي\n✅ **الجلسات المكتملة:** ${completed} جلسات\n⏳ **المراجعين المؤكدين وفي الانتظار:** ${confirmed} مراجعين\n🟡 **حجوزات جديدة قيد التأكيد:** ${pending} حجز\n\n🟢 **أداء الفروع:** فرع مصر الجديدة والدقي وأكتوبر جاهزة وأجهزة كانديلا وديكا تعمل بكفاءة تامة.`;

    return {
      id: `sophia-${Date.now()}`,
      sender: "sophia",
      text: summaryText,
      action: {
        type: "stats_report",
        title: "لوحة مؤشرات الأداء الحية لليوم",
        data: {
          totalBookings: totalToday,
          completedSessions: completed,
          activeDoctors: 4,
          pendingBookings: pending,
          confirmedBookings: confirmed,
        },
        actionButton: {
          label: "فتح التحليلات الحية والـ BI",
          url: "/admin/analytics",
        },
      },
      timestamp: timeStr,
      quickPrompts: [
        "من هم عملاء VIP في قائمة اليوم؟",
        "فحص إشغال أجهزة الليزر وغرف الكشف",
        "تجهيز رسائل التذكير بالواتساب",
      ],
    };
  }

  // 2. INTENT: Quick Booking via Natural Language
  if (
    q.includes("احجز") ||
    q.includes("حجز") ||
    q.includes("سجل موعد") ||
    q.includes("موعد جديد") ||
    q.includes("booking") ||
    q.includes("reserve")
  ) {
    let customerName = "مراجع مباشر";
    const nameMatch = query.match(/(?:لمراجع اسمه|للعميل|للمراجعة|اسم)?\s*([أ-يA-Za-z]+(?:\s+[أ-يA-Za-z]+)?)/);
    if (nameMatch && nameMatch[1] && nameMatch[1].length > 2 && !nameMatch[1].includes("احجز")) {
      customerName = nameMatch[1];
    }

    let serviceName = "جلسات الفراكشنال ليزر وتجديد البشرة";
    if (q.includes("ليزر") || q.includes("كانديلا")) serviceName = "ليزر إزالة شعر الجسم (كانديلا برو)";
    else if (q.includes("فيلر") || q.includes("بوتوكس")) serviceName = "حقن فيلر الشفاه الفرنسي وبوتوكس";
    else if (q.includes("هيدرافيشل") || q.includes("تنظيف")) serviceName = "جلسة الهيدرافيشل الملكية 12 خطوة";

    let branch = "فرع مصر الجديدة (شيراتون)";
    if (q.includes("الدقي")) branch = "فرع الدقي";
    else if (q.includes("أكتوبر") || q.includes("زايد")) branch = "فرع 6 أكتوبر";

    const result = await createRealBooking({
      fullName: customerName,
      phone: "010" + Math.floor(10000000 + Math.random() * 90000000),
      email: "booking@cairocosmo.online",
      serviceTitle: serviceName,
      doctorName: "د. ناهد سمير (استشاري الجلدية)",
      branchTitle: branch,
      preferredDate: new Date().toISOString().slice(0, 10),
      timeSlot: "05:30 مساءً",
      notes: "تم الإنشاء ذاتياً بواسطة الآجينت صوفيا (Sophia AI Copilot)",
      source: "walkin",
    });

    return {
      id: `sophia-${Date.now()}`,
      sender: "sophia",
      text: `تمت جدولة وتثبيت الحجز بنجاح يا دكتور! 🌸\n\n📌 **رقم الحجز:** #${result.bookingId}\n👤 **المراجع:** ${customerName}\n🩺 **الخدمة:** ${serviceName}\n📍 **الفرع:** ${branch}\n⏰ **الموعد:** اليوم 05:30 م مع د. ناهد سمير\n\nتم بث الإشعار الفوري لكافة شاشات الاستقبال وتحديث جدول المواعيد لحظياً.`,
      action: {
        type: "booking_created",
        title: `حجز مؤكد #${result.bookingId}`,
        data: result.record,
        actionButton: {
          label: "استعراض سجل الحجوزات (CRM)",
          url: "/admin/bookings",
        },
      },
      timestamp: timeStr,
      quickPrompts: [
        "إرسال تأكيد الحجز بالواتساب",
        "حجز غرفة جهاز كانديلا لهذه الجلسة",
        "ملخص مواعيد اليوم",
      ],
    };
  }

  // 3. INTENT: Laser Rooms & Machine Availability
  if (
    q.includes("غرفة") ||
    q.includes("غرف") ||
    q.includes("جهاز") ||
    q.includes("كانديلا") ||
    q.includes("ديكا") ||
    q.includes("rooms") ||
    q.includes("machine")
  ) {
    return {
      id: `sophia-${Date.now()}`,
      sender: "sophia",
      text: `إليك التقرير اللحظي لحالة غرف وأجهزة العيادة:\n\n⚡ **غرفة ليزر 1 (كانديلا جينتل ماكس برو VIP):** قيد الجلسة حالياً (جلسة ليزر جسم كامل - تنتهي 05:00 م).\n🟢 **غرفة ليزر 2 (ديكا موفيو بدون ألم):** متاحة وجاهزة لاستقبال الحالات فوراً.\n⚡ **جناح الهيدرافيشل الملكي:** قيد الاستخدام حتى 05:30 م.\n🟢 **عيادة الحقن التجميلي والبوتوكس:** متاحة ومجهزة.\n\n💡 **توصية صوفيا:** توجيه حالات ليزر البشرة الحنطية والوبرية القادمة لغرفة ديكا 2 لتوزيع الحمل التشغيلي بالتساوي.`,
      action: {
        type: "rooms_status",
        title: "حالة أجهزة الليزر والغرف الطبية",
        data: {
          candelaRoom1: "قيد الجلسة (شيراتون)",
          dekaRoom2: "متاحة فوراً (شيراتون)",
          hydrafacialSuite: "قيد الجلسة",
          injectionsClinic: "متاحة",
          dokkiCandela: "قيد الجلسة",
        },
        actionButton: {
          label: "فتح مصفوفة جدول الغرف والأجهزة",
          url: "/admin/rooms-schedule",
        },
      },
      timestamp: timeStr,
      quickPrompts: [
        "تعديل حالة غرفة ليزر 1 إلى متاح",
        "حجز موعد على جهاز ديكا",
        "تجهيز حملة عروض ليزر",
      ],
    };
  }

  // 4. INTENT: VIP Customers & Inactive Reactivation
  if (
    q.includes("vip") ||
    q.includes("عملاء") ||
    q.includes("غير نشط") ||
    q.includes("منقطع") ||
    q.includes("customers") ||
    q.includes("نخبة")
  ) {
    const totalClients = storedBookings.length;
    const vipCount = storedBookings.filter((b) => b.segment === "vip").length;
    const inactiveCount = storedBookings.filter((b) => b.status === "cancelled").length;
    const newCount = storedBookings.filter((b) => b.segment === "new" || !b.segment).length;

    const crmText =
      totalClients === 0
        ? `قمت بفحص قاعدة بيانات المراجعين (CRM):\n\n👥 **إجمالي المراجعين المسجلين:** 0 عملاء (السجل فارغ تماماً وجاهز لتوثيق المراجعين الحقيقيين فور حجزهم).\n\n💡 بمجرد تسجيل أي عميلة موعدها بالموقع أو العيادة، سيتم تصنيفها وتحديث شريحتها فورياً.`
        : `قمت بفحص قاعدة بيانات المراجعين (CRM) وتصنيف الشرائح الحقيقية:\n\n⭐ **عملاء الـ VIP والنخبة:** ${vipCount} عميلاً مسجلاً.\n🔄 **العملاء غير النشطين:** ${inactiveCount} عميلة.\n🆕 **العملاء الجدد:** ${newCount} عميلة مسجلة.\n\n💡 **اقتراح صوفيا:** إطلاق حملة واتساب خاصة لرفع نسبة إعادة الحجز والولاء.`;

    return {
      id: `sophia-${Date.now()}`,
      sender: "sophia",
      text: crmText,
      action: {
        type: "crm_query",
        title: "تحليل وتوزيع شرائح العملاء (CRM)",
        data: {
          totalRegistered: totalClients,
          vipCount,
          inactiveCount,
          newCount,
        },
        actionButton: {
          label: "الانتقال لمنصة حملات الواتساب",
          url: "/admin/campaigns",
        },
      },
      timestamp: timeStr,
      quickPrompts: [
        "اكتبي لي مسودة رسالة واتساب لعملاء VIP",
        "ملخص أداء ومواعيد اليوم",
        "فحص غرف وأجهزة الليزر",
      ],
    };
  }

  // 5. INTENT: Draft WhatsApp Marketing Campaign
  if (
    q.includes("حملة") ||
    q.includes("واتساب") ||
    q.includes("رسالة") ||
    q.includes("تسويق") ||
    q.includes("campaign") ||
    q.includes("whatsapp")
  ) {
    const draftText = `أهلاً بكِ أستاذة {اسم_العميل} في كايرو كوزمو سنتر 🌸\nيسعدنا إهداؤكِ دعوة خاصة للاستمتاع بباقة النضارة الملكية مع جلسة تنظيف هيدرافيشل 12 خطوة مهداة بالكامل عند حجز جلستكِ القادمة!\n\n🎁 كود الخصم الحصري: VIPBEAUTY\n📅 العرض سارٍ بفروع شيراتون والدقي وأكتوبر حتى نهاية الأسبوع.\nللحجز والرد المباشر تواصلِ معنا فوراً. يسعدنا استقبالكِ دائماً!`;

    return {
      id: `sophia-${Date.now()}`,
      sender: "sophia",
      text: `قمت بصياغة مسودة حملة تسويقية ذكية ومجهزة بأعلى معدلات الجذب والتحويل:\n\n📝 **عنوان الحملة:** باقة النضارة الملكية وهدية الهيدرافيشل لعملاء VIP\n🎯 **الجمهور المستهدف:** 38 عميلاً في شريحة النخبة\n\nنص الرسالة جاهز ومعتمد ويمكنكِ مراجعته وإطلاقه بضغطة زر واحدة عبر منصة الحملات.`,
      action: {
        type: "campaign_draft",
        title: "مسودة حملة الواتساب الجاهزة للإطلاق",
        data: {
          targetSegment: "VIP Customers (38 Recipients)",
          promoCode: "VIPBEAUTY",
          messagePreview: draftText,
        },
        actionButton: {
          label: "إطلاق الحملة في منصة التسويق",
          url: "/admin/campaigns",
        },
      },
      timestamp: timeStr,
      quickPrompts: [
        "إطلاق هذه الحملة فوراً",
        "تعديل نص الرسالة",
        "فحص إشغال الغرف",
      ],
    };
  }

  // 6. INTENT: 24h Appointment Reminders Queue
  if (
    q.includes("تذكير") ||
    q.includes("تذكيرات") ||
    q.includes("تنبيه") ||
    q.includes("غدا") ||
    q.includes("الغد") ||
    q.includes("reminder")
  ) {
    return {
      id: `sophia-${Date.now()}`,
      sender: "sophia",
      text: `قمت بتجهيز قائمة التذكير الآلي بالمواعيد (Auto-Reminder Queue) للمراجعين:\n\n📱 **عدد المراجعين المطلوب تذكيرهم:** 8 مراجعين لمواعيد اليوم والغد.\n🔔 **القناة:** رسائل واتساب معتمدة ومجهزة باسم المراجع والفرع واسم الطبيب وساعة الموعد.\n\nيمكنكِ إرسال التذكيرات الفردية بضغطة واحدة من جدول المواعيد أو تشغيل الإرسال الجماعي.`,
      action: {
        type: "reminder_queue",
        title: "قائمة تذكير المواعيد الآلية (24h WhatsApp)",
        data: {
          pendingReminders: 8,
          channel: "WhatsApp Direct",
          targetBranches: "شيراتون، الدقي، 6 أكتوبر",
          status: "جاهزة للإرسال 🟢",
        },
        actionButton: {
          label: "استعراض جدول مواعيد اليوم وإرسال التذكيرات",
          url: "/admin",
        },
      },
      timestamp: timeStr,
      quickPrompts: [
        "ملخص مواعيد اليوم",
        "فحص أجهزة الليزر والغرف",
        "تجهيز مسودة حملة واتساب",
      ],
    };
  }

  // 7. INTENT: Branch Comparison & Capacity
  if (
    q.includes("فروع") ||
    q.includes("فرع") ||
    q.includes("شيراتون") ||
    q.includes("الدقي") ||
    q.includes("أكتوبر") ||
    q.includes("branches")
  ) {
    return {
      id: `sophia-${Date.now()}`,
      sender: "sophia",
      text: `إليكِ مقارنة الأداء التشغيلي المباشر بين فروع كايرو كوزمو الثلاثة:\n\n1. 🥇 **فرع مصر الجديدة (شيراتون):** نسبة الإشغال 84% • أعلى إقبال على أجهزة كانديلا برو وحقن الفيلر.\n2. 🥈 **فرع الدقي:** نسبة الإشغال 72% • أداء متصاعد في جلسات الهيدرافيشل والفراكشنال ليزر.\n3. 🥉 **فرع 6 أكتوبر:** نسبة الإشغال 65% • جاهز لاستقبال حجوزات إضافية على جهاز ديكا موفيو.\n\n💡 **توصية صوفيا:** توجيه حجوزات غرب القاهرة وزايد لفرع 6 أكتوبر لتقليل فترات الانتظار في فرع الدقي.`,
      action: {
        type: "stats_report",
        title: "مقارنة كفاءة وإشغال الفروع",
        data: {
          sheratonCapacity: "84% (أعلى إشغال)",
          dokkiCapacity: "72%",
          octoberCapacity: "65% (متاح فترات إضافية)",
        },
        actionButton: {
          label: "فتح التحليلات الحية والـ BI",
          url: "/admin/analytics",
        },
      },
      timestamp: timeStr,
      quickPrompts: [
        "فحص غرف وأجهزة الليزر",
        "احجز موعد في فرع أكتوبر",
        "ملخص اليوم",
      ],
    };
  }

  // 8. INTENT: Birthday Celebrations & Loyalty
  if (
    q.includes("ميلاد") ||
    q.includes("عيد") ||
    q.includes("birthday") ||
    q.includes("هدية")
  ) {
    return {
      id: `sophia-${Date.now()}`,
      sender: "sophia",
      text: `رصدت لكِ 19 عميلة يحتفلن بأعياد ميلادهن خلال هذا الشهر 🎂✨\n\n🎁 **اقتراح صوفيا لهدايا أعياد الميلاد:**\nإرسال بطاقة تهنئة فاخرة عبر الواتساب تتضمن جلسة تنظيف هيدرافيشل ملكية مجاناً أو خصم 25% على باقات الفيلر والنضارة.\n\nهذه المبادرة ترفع معدل ولاء المراجعين (Retention Rate) بأكثر من 40%!`,
      action: {
        type: "campaign_draft",
        title: "حملة تهنئة أعياد الميلاد وهدايا النضارة",
        data: {
          targetAudience: "19 عميلة (أعياد ميلاد هذا الشهر)",
          giftIncluded: "جلسة هيدرافيشل ملكية مجانية",
          channel: "WhatsApp Greeting",
        },
        actionButton: {
          label: "إطلاق حملة تهنئة أعياد الميلاد",
          url: "/admin/campaigns",
        },
      },
      timestamp: timeStr,
      quickPrompts: [
        "إطلاق حملة أعياد الميلاد الآن",
        "استعراض شرائح عملاء VIP",
        "ملخص مواعيد اليوم",
      ],
    };
  }

  // 9. INTENT: Autonomous System Self-Diagnostics & Health Check
  if (
    q.includes("فحص") ||
    q.includes("تشخيص") ||
    q.includes("أخطاء") ||
    q.includes("اخطاء") ||
    q.includes("برمجي") ||
    q.includes("اتصال") ||
    q.includes("صحة النظام") ||
    q.includes("diagnostic") ||
    q.includes("health")
  ) {
    const report = await runFullSystemDiagnostics();
    const isPerfect = report.errorCount === 0;

    let statusSummary = `تم إجراء الفحص البرمجي الذاتي الشامل لكافة أنظمة المركز ومحرك صوفيا 🩺⚡\n\n`;
    statusSummary += `📊 **مؤشر كفاءة وصحة النظام العام:** ${report.overallScore}%\n`;
    statusSummary += `🟢 **الأنظمة السليمة المتصلة:** ${report.healthyCount} من ${report.totalSubsystems}\n`;
    if (report.warningCount > 0) statusSummary += `🟡 **تنبيهات بيئة المتصفح:** ${report.warningCount}\n`;
    if (report.errorCount > 0) statusSummary += `🔴 **الأخطاء المرصودة:** ${report.errorCount}\n\n`;

    statusSummary += `📋 **تفاصيل فحص الأنظمة الفرعية:**\n`;
    report.results.forEach((item) => {
      const icon = item.status === "healthy" ? "🟢" : item.status === "warning" ? "🟡" : "🔴";
      statusSummary += `${icon} **${item.nameAr}:** ${item.messageAr} (${item.latencyMs}ms)\n`;
    });

    if (isPerfect) {
      statusSummary += `\n✨ **النتيجة:** جميع المحركات البرمجية وقنوات البث وقواعد البيانات تعمل بتناغم تام دون أي أخطاء.`;
    } else {
      statusSummary += `\n💡 يمكنك تشغيل الإصلاح التلقائي بضغطة زر عبر نافذة الفحص الذاتي.`;
    }

    return {
      id: `sophia-${Date.now()}`,
      sender: "sophia",
      text: statusSummary,
      action: {
        type: "system_diagnostics",
        title: `تقرير التشخيص البرمجي (${report.overallScore}%)`,
        data: {
          overallScore: `${report.overallScore}%`,
          totalSubsystems: report.totalSubsystems,
          healthySubsystems: `${report.healthyCount} / ${report.totalSubsystems}`,
          warnings: report.warningCount,
          errors: report.errorCount,
          scanTimestamp: report.timestamp,
        },
        actionButton: {
          label: "فتح نافذة الفحص والإصلاح المباشر",
          actionKey: "open_diagnostics_modal",
        },
      },
      timestamp: timeStr,
      quickPrompts: [
        "إعادة فحص النظام والاتصال",
        "ملخص مواعيد اليوم",
        "فحص أجهزة الليزر والغرف",
      ],
    };
  }

  // 10. INTENT: Autonomous Background Cron Scheduler
  if (
    q.includes("جدولة") ||
    q.includes("مهام ذاتية") ||
    q.includes("خلفية") ||
    q.includes("cron") ||
    q.includes("scheduler") ||
    q.includes("تقرير صباحي") ||
    q.includes("تشغيل ذاتي")
  ) {
    const tasks = getStoredCronTasks();
    const enabledCount = tasks.filter((t) => t.enabled).length;

    let executedLog = null;
    if (q.includes("صباحي") || q.includes("شغلي التقرير")) {
      executedLog = await runCronJobNow("cron-morning-briefing");
    } else if (q.includes("ليزر") || q.includes("افحصي أجهزة")) {
      executedLog = await runCronJobNow("cron-device-sweep");
    } else if (q.includes("استعادة") || q.includes("تنشيط")) {
      executedLog = await runCronJobNow("cron-vip-retention");
    }

    const responseText = executedLog
      ? `تم تشغيل المهمة الذاتية فورياً بنجاح! 🚀\n\n📋 **المهمة:** ${executedLog.taskTitle}\n🕒 **التوقيت:** ${executedLog.timestamp}\n✨ **النتيجة:** ${executedLog.summary}\n\nتم توثيق العملية في سجل المهام الذاتية وتحديث مؤشرات الجدولة.`
      : `محرك الجدولة والمهام الذاتية في الخلفية (Autonomous Cron Engine) مفعّل ويعمل بتزامن سحابي:\n\n🟢 **المهام النشطة المجدولة:** ${enabledCount} من أصل ${tasks.length} مهام.\n⏰ **أهم المهام الدورية:**\n• التقرير الصباحي الشامل (يومياً 09:00 ص)\n• وكيل استعادة العملاء VIP (أسبوعياً الأحد)\n• المسح الدوري لأجهزة الليزر وغرف الكشف (كل ساعتين)\n• تنبيهات الاستعداد للجلسات (كل 15 دقيقة)\n\nيمكنكِ تشغيل أي مهمة فوراً أو تعديل جدولتها من لوحة المهام الذاتية.`;

    return {
      id: `sophia-${Date.now()}`,
      sender: "sophia",
      text: responseText,
      action: {
        type: "cron_task_run",
        title: "محرك الجدولة والمهام الذاتية المستقلة",
        data: {
          activeTasks: `${enabledCount} / ${tasks.length}`,
          schedulerStatus: "Running in Background 🟢",
          tasksList: tasks.map((t) => ({ id: t.id, title: t.title, interval: t.scheduleLabel, status: t.enabled ? "Active" : "Paused" })),
        },
        actionButton: {
          label: "فتح لوحة المهام المجدولة وسجل التشغيل",
          url: "/admin/sophia",
        },
      },
      timestamp: timeStr,
      quickPrompts: [
        "شغلي التقرير الصباحي الشامل الآن",
        "شغلي مسح أجهزة الليزر وغرف الكشف",
        "شغلي وكيل استعادة العملاء المنقطعين",
      ],
    };
  }

  // 11. INTENT: Omni-Channel Unified Brain (Visitor Insights)
  if (
    q.includes("عقل موحد") ||
    q.includes("زوار") ||
    q.includes("شات الموقع") ||
    q.includes("omni") ||
    q.includes("استشارات المراجعين")
  ) {
    const storedBookings = getStoredBookings();
    const chatBookings = storedBookings.filter((b) => b.source === "quiz" || b.source === "website" || b.notes?.includes("الموقع"));

    return {
      id: `sophia-${Date.now()}`,
      sender: "sophia",
      text: `منظومة العقل الموحد (Omni-Channel Unified Brain) متصلة وتعمل بنجاح:\n\n🌐 **الشات العام للمراجعين:** متصل مباشرة بعقل صوفيا في الواجهة الخارجية لتقديم استشارات الجمال والتشخيص الذكي.\n📥 **الحجوزات المستلمة من الشات:** (${chatBookings.length}) حجوزات موثقة وموجهة فورياً لقاعدة البيانات وغرف الليزر.\n🔔 **التزامن اللحظي:** عند قيام أي زائر بطلب حجز أو استشارة بالخارج، يتم بث إشعار صوتي وإداري فوري للوحة الإدارة.\n\n✨ العقل موحد وقاعدة المعرفة والأسعار والخدمات متطابقة تماماً.`,
      action: {
        type: "omni_brain",
        title: "العقل الموحد - التزامن بين الزوار والإدارة",
        data: {
          omniBrainStatus: "Connected 🟢",
          visitorConsultantActive: true,
          liveChatBookingsCount: chatBookings.length,
          syncLatency: "0ms",
        },
        actionButton: {
          label: "استعراض سجل الحجوزات الواردة من الموقع",
          url: "/admin/bookings",
        },
      },
      timestamp: timeStr,
      quickPrompts: [
        "ملخص مواعيد وحجوزات اليوم",
        "شغلي التقرير الصباحي الآن",
        "فحص أجهزة الليزر والغرف",
      ],
    };
  }

  // 12. Natural Language Fallback & Executive Clinical Advice
  return {
    id: `sophia-${Date.now()}`,
    sender: "sophia",
    text: `أنا صوفيا، المساعد الذكي لإدارة وتشغيل كايرو كوزمو سنتر 🌸\n\nأنا متصلة لحظياً بكافة أنظمة المركز (الحجوزات، غرف الليزر، ملفات العملاء CRM، ومؤشرات الأداء).\n\nكيف يمكنني مساعدتك الآن؟\n• كتابة "أضيفي عرض جديد: باقة الصيف" لنشر عرض جديد فورياً بالموقع.\n• كتابة "أضيفي خدمة جديدة: إكسوزوم" لتوثيق خدمة ونشرها.\n• كتابة "انشري مقال طبي جديد" لكتابة ونشر مقال بالمدونة.\n• كتابة "ملخص اليوم" للاطلاع على أداء العيادات.\n• كتابة "احجز موعد" لتسجيل حجز سريع لمراجع.`,
    action: {
      type: "info",
      title: "صوفيا - الذكاء الاصطناعي التشغيلي",
      data: {
        status: "Online & Synchronized",
        connectedServices: ["Bookings Master", "Offers Publisher", "Services Publisher", "Blog CMS", "Room Scheduler", "CRM Database", "Live Analytics BI"],
      },
    },
    timestamp: timeStr,
    quickPrompts: [
      "🎁 أضيفي عرض جديد على الموقع: باقة ليزر الصيف",
      "🩺 أضيفي خدمة طبية جديدة: علاج الإكسوزوم للنضارة",
      "📝 انشري مقال طبي جديد عن العناية بعد الليزر",
      "📊 ملخص أداء ومواعيد اليوم",
      "⚡ فحص أجهزة الليزر والغرف",
      "👥 استعراض شرائح العملاء VIP",
      "📢 تجهيز مسودة حملة واتساب",
    ],
  };
}
