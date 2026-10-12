// src/lib/offers.ts
import { TranslatedString } from "./i18n";

export type OfferCategory =
  | "all"
  | "laser"
  | "skin"
  | "surgery"
  | "body"
  | "injectables";

export interface Offer {
  id: string;
  slug: string;
  title: TranslatedString;
  subtitle: TranslatedString;
  description: TranslatedString;
  category: OfferCategory;
  discountLabel?: TranslatedString;
  validUntil?: string;
  featured?: boolean;
  includes?: TranslatedString[];
}

/**
 * ملاحظات:
 * - العروض المنتهية تبقى موجودة للأرشفة لكن بدون featured=true
 * - العروض الحالية فقط هي التي تظهر في الواجهة الرئيسية
 * - تمت إضافة عروض خاصة برمضان 2026
 */
export const offers: Offer[] = [
  // -------------------- ✅ Current Offers (2026) --------------------
  {
    id: "offer-fractional",
    slug: "fractional-laser-offer",
    category: "laser",
    featured: true,
    discountLabel: { ar: "خصم 25%", en: "25% OFF" },
    validUntil: "2026-03-15",
    title: { ar: "عرض الفراكشنال ليزر", en: "Fractional Laser Offer" },
    subtitle: {
      ar: "تجديد للبشرة وتقليل آثار الندبات",
      en: "Skin renewal & scar reduction",
    },
    description: {
      ar: "باقة جلسات الفراكشنال ليزر لتحسين الملمس وتوحيد اللون وتقليل آثار الحبوب والندبات.",
      en: "Fractional laser package to improve texture, even tone, and reduce acne scars.",
    },
    includes: [
      { ar: "خطة جلسات مخصصة", en: "Personalized session plan" },
      { ar: "متابعة بعد كل جلسة", en: "Follow-up after each session" },
    ],
  },

  {
    id: "offer-ramadan-laser-package",
    slug: "ramadan-laser-package",
    category: "laser",
    featured: true,
    discountLabel: { ar: "خصم 30%", en: "30% OFF" },
    validUntil: "2026-03-31",
    title: { ar: "عرض رمضان لليزر", en: "Ramadan Laser Offer" },
    subtitle: {
      ar: "جلسات أكثر بسعر أفضل خلال رمضان",
      en: "More sessions, better value during Ramadan",
    },
    description: {
      ar: "باقة مميزة لإزالة الشعر بالليزر خلال رمضان مع تقييم أولي وخطة جلسات مناسبة لنوع البشرة والشعر.",
      en: "A special Ramadan laser hair removal bundle with an initial assessment and a tailored plan for your skin and hair type.",
    },
    includes: [
      { ar: "تقييم مجاني قبل الجلسة", en: "Free pre-session assessment" },
      { ar: "خطة جلسات مناسبة للحالة", en: "Tailored session plan" },
      { ar: "تعليمات قبل وبعد الجلسة", en: "Pre and post-session guidance" },
    ],
  },

  {
    id: "offer-ramadan-glow",
    slug: "ramadan-glow-offer",
    category: "skin",
    featured: true,
    discountLabel: { ar: "خصم 20%", en: "20% OFF" },
    validUntil: "2026-03-31",
    title: { ar: "عرض نضارة رمضان", en: "Ramadan Glow Offer" },
    subtitle: {
      ar: "ترطيب ونضارة قبل العيد",
      en: "Hydration and glow before Eid",
    },
    description: {
      ar: "جلسات مخصصة لنضارة البشرة وترطيبها وتحسين الملمس لتظهري بإشراقة طبيعية خلال رمضان وقبل العيد.",
      en: "Tailored glow sessions to hydrate, refresh, and improve skin texture for a natural Ramadan and pre-Eid glow.",
    },
    includes: [
      { ar: "تنظيف لطيف للبشرة", en: "Gentle skin cleansing" },
      { ar: "ترطيب عميق", en: "Deep hydration" },
      { ar: "تقييم مناسب لنوع البشرة", en: "Skin-type based assessment" },
    ],
  },

  {
    id: "offer-ramadan-botox",
    slug: "ramadan-botox-offer",
    category: "injectables",
    featured: true,
    discountLabel: { ar: "خصم 15%", en: "15% OFF" },
    validUntil: "2026-03-31",
    title: { ar: "عرض بوتوكس رمضان", en: "Ramadan Botox Offer" },
    subtitle: {
      ar: "نتيجة طبيعية ولمسات هادئة",
      en: "Natural results with subtle refinement",
    },
    description: {
      ar: "خصم خاص خلال رمضان على جلسات البوتوكس مع تقييم دقيق قبل الإجراء للحصول على نتيجة طبيعية وآمنة.",
      en: "Special Ramadan discount on Botox sessions with careful pre-treatment evaluation for a safe, natural result.",
    },
    includes: [
      { ar: "تقييم قبل الجلسة", en: "Pre-session evaluation" },
      { ar: "خطة مناسبة لتعبيرات الوجه", en: "Expression-friendly treatment plan" },
      { ar: "تعليمات متابعة بعد الجلسة", en: "Post-session follow-up guidance" },
    ],
  },

  {
    id: "offer-ramadan-fillers",
    slug: "ramadan-fillers-offer",
    category: "injectables",
    discountLabel: { ar: "خصم 10%", en: "10% OFF" },
    validUntil: "2026-03-31",
    title: { ar: "عرض الفيلر في رمضان", en: "Ramadan Filler Offer" },
    subtitle: {
      ar: "تحديد وامتلاء بشكل طبيعي",
      en: "Soft definition and natural volume",
    },
    description: {
      ar: "عرض خاص على جلسات الفيلر بجرعات مدروسة للحصول على مظهر متناسق وطبيعي.",
      en: "A special filler offer with carefully planned dosing for balanced, natural-looking volume.",
    },
    includes: [
      { ar: "تقييم دقيق للحالة", en: "Careful case assessment" },
      { ar: "خطة حقن مناسبة", en: "Tailored injection plan" },
    ],
  },

  {
    id: "offer-hydrafacial-2026",
    slug: "hydrafacial-2026-offer",
    category: "skin",
    discountLabel: { ar: "خصم 18%", en: "18% OFF" },
    validUntil: "2026-04-10",
    title: { ar: "عرض تنظيف وترطيب البشرة", en: "Skin Cleansing & Hydration Offer" },
    subtitle: {
      ar: "نضارة فورية وملمس أنعم",
      en: "Instant glow and smoother texture",
    },
    description: {
      ar: "جلسة تنظيف عميق وترطيب للبشرة لتحسين مظهر المسام والملمس ومنح البشرة إشراقة صحية.",
      en: "Deep cleansing and hydration session to improve pores, texture, and overall radiance.",
    },
    includes: [
      { ar: "تنظيف عميق", en: "Deep cleansing" },
      { ar: "ترطيب مخصص", en: "Customized hydration" },
      { ar: "إرشادات للعناية المنزلية", en: "Home care guidance" },
    ],
  },

  {
    id: "offer-body-contouring-spring",
    slug: "body-contouring-spring-offer",
    category: "body",
    discountLabel: { ar: "خصم خاص", en: "Special Offer" },
    validUntil: "2026-04-15",
    title: { ar: "عرض تنسيق القوام", en: "Body Contouring Offer" },
    subtitle: {
      ar: "خطة مخصصة للمناطق العنيدة",
      en: "Tailored plan for stubborn areas",
    },
    description: {
      ar: "باقة مخصصة لتنسيق القوام تشمل تقييم شامل وخطة جلسات حسب الهدف والمناطق المستهدفة.",
      en: "A personalized body contouring package including full assessment and a target-based session plan.",
    },
    includes: [
      { ar: "تقييم شامل للحالة", en: "Full assessment" },
      { ar: "خطة حسب الهدف", en: "Goal-based plan" },
      { ar: "متابعة خلال البرنامج", en: "Program follow-up" },
    ],
  },

  {
    id: "offer-consultation-2026",
    slug: "consultation-offer-2026",
    category: "surgery",
    discountLabel: { ar: "خصم 20%", en: "20% OFF" },
    validUntil: "2026-04-30",
    title: { ar: "عرض الاستشارة المتقدمة", en: "Advanced Consultation Offer" },
    subtitle: {
      ar: "خطة واضحة قبل أي إجراء",
      en: "A clear plan before any procedure",
    },
    description: {
      ar: "خصم على الاستشارات المتقدمة للحالات الجراحية وغير الجراحية مع مناقشة الخيارات المناسبة وتوقعات النتائج.",
      en: "Discounted advanced consultations for surgical and non-surgical cases with clear discussion of options and expectations.",
    },
    includes: [
      { ar: "تقييم شامل للحالة", en: "Comprehensive assessment" },
      { ar: "شرح الخيارات المناسبة", en: "Discussion of suitable options" },
    ],
  },

  // -------------------- ⏳ Expired Offers --------------------
  {
    id: "offer-botox",
    slug: "botox-offer",
    category: "injectables",
    discountLabel: { ar: "خصم 20%", en: "20% OFF" },
    validUntil: "2026-02-28",
    title: { ar: "عرض البوتوكس", en: "Botox Offer" },
    subtitle: {
      ar: "نعومة طبيعية بدون مبالغة",
      en: "Natural smoothness without overdoing it",
    },
    description: {
      ar: "خصم لفترة محدودة على جلسات البوتوكس مع تقييم قبل الجلسة لضمان أفضل نتيجة.",
      en: "Limited-time discount on Botox sessions with a pre-session evaluation for the best outcome.",
    },
    includes: [
      { ar: "تقييم سريع قبل الجلسة", en: "Quick pre-session evaluation" },
      { ar: "إرشادات متابعة بعد الجلسة", en: "Post-session care instructions" },
    ],
  },
  {
    id: "offer-body",
    slug: "body-contouring-offer",
    category: "body",
    discountLabel: { ar: "عرض استثنائي", en: "Exclusive Deal" },
    validUntil: "2026-03-01",
    title: { ar: "باقة تنسيق القوام", en: "Body Contouring Package" },
    subtitle: { ar: "للدهون العنيدة بأمان", en: "For stubborn fat, safely" },
    description: {
      ar: "باقة مخصصة لتنسيق القوام تشمل تقييم وخطة حسب حالتك.",
      en: "Tailored body contouring package including assessment and a plan based on your case.",
    },
    includes: [
      { ar: "تقييم وتحليل للحالة", en: "Assessment & case review" },
      { ar: "خطة جلسات حسب الهدف", en: "Goal-based session plan" },
    ],
  },
  {
    id: "offer-laser-summer",
    slug: "laser-summer-pack",
    category: "laser",
    discountLabel: { ar: "خصم 30%", en: "30% OFF" },
    validUntil: "2025-08-31",
    title: { ar: "باقة الليزر الصيفية", en: "Laser Summer Bundle" },
    subtitle: { ar: "جلسات أكثر بسعر أفضل", en: "More sessions, better value" },
    description: {
      ar: "باقة إزالة الشعر بالليزر تشمل تقييم نوع الشعر والبشرة وتعليمات قبل/بعد الجلسة.",
      en: "Laser hair removal bundle with hair/skin assessment and pre/post care guidance.",
    },
    includes: [
      { ar: "تقييم نوع الشعر والبشرة", en: "Hair & skin type assessment" },
      { ar: "إرشادات بعد الجلسة", en: "Aftercare instructions" },
    ],
  },
  {
    id: "offer-underarm-laser",
    slug: "underarm-laser-mini",
    category: "laser",
    discountLabel: { ar: "خصم 20%", en: "20% OFF" },
    validUntil: "2025-07-15",
    title: { ar: "عرض ليزر الإبط", en: "Underarm Laser Deal" },
    subtitle: { ar: "نتيجة أنعم وراحة أكبر", en: "Smoother results, more comfort" },
    description: {
      ar: "جلسات ليزر مركزة لمنطقة الإبط مع تقليل التهيج بخطة متابعة بسيطة.",
      en: "Focused underarm laser sessions with a simple follow-up plan to reduce irritation.",
    },
  },
  {
    id: "offer-bikini-laser",
    slug: "bikini-laser-offer",
    category: "laser",
    discountLabel: { ar: "خصم 25%", en: "25% OFF" },
    validUntil: "2025-09-10",
    title: { ar: "عرض ليزر البيكيني", en: "Bikini Laser Offer" },
    subtitle: { ar: "خطة جلسات مريحة وآمنة", en: "Comfortable, safe plan" },
    description: {
      ar: "باقة جلسات ليزر لمنطقة البيكيني مع إرشادات تهدئة بعد الجلسة.",
      en: "Bikini laser session bundle with soothing aftercare guidance.",
    },
  },
  {
    id: "offer-acne-scars",
    slug: "acne-scar-program",
    category: "skin",
    discountLabel: { ar: "خصم 20%", en: "20% OFF" },
    validUntil: "2025-11-30",
    title: { ar: "برنامج آثار الحبوب", en: "Acne Scar Program" },
    subtitle: { ar: "تحسين الملمس وتوحيد اللون", en: "Texture & tone improvement" },
    description: {
      ar: "برنامج علاجي لتحسين آثار الحبوب بتقسيم حسب شدة الحالة ومتابعة دورية.",
      en: "A structured program to improve acne scars tailored to severity with periodic follow-ups.",
    },
  },
  {
    id: "offer-peel-glow",
    slug: "peel-glow-offer",
    category: "skin",
    discountLabel: { ar: "خصم 15%", en: "15% OFF" },
    validUntil: "2025-10-15",
    title: { ar: "عرض التقشير والإشراقة", en: "Peel & Glow Offer" },
    subtitle: { ar: "بشرة أنعم وإضاءة طبيعية", en: "Smoother skin, natural glow" },
    description: {
      ar: "جلسات تقشير مناسبة لنوع البشرة لتفتيح لطيف وتحسين ملمس الجلد.",
      en: "Skin-type tailored peel sessions for gentle brightening and texture refinement.",
    },
  },
  {
    id: "offer-hydrafacial",
    slug: "hydrafacial-offer",
    category: "skin",
    discountLabel: { ar: "خصم 10%", en: "10% OFF" },
    validUntil: "2025-12-10",
    title: { ar: "عرض تنظيف عميق للبشرة", en: "Deep Skin Cleansing Deal" },
    subtitle: { ar: "ترطيب وتنقية في جلسة واحدة", en: "Hydration and clarity in one session" },
    description: {
      ar: "جلسة تنظيف عميق + ترطيب لتحسين مظهر المسام والملمس.",
      en: "Deep cleansing + hydration session to improve pores and texture.",
    },
  },
  {
    id: "offer-vitamin-glow",
    slug: "vitamin-glow-infusion",
    category: "skin",
    discountLabel: { ar: "خصم 18%", en: "18% OFF" },
    validUntil: "2025-05-31",
    title: { ar: "جلسة نضارة فيتامين", en: "Vitamin Glow Session" },
    subtitle: { ar: "نضارة أسرع بدون مبالغة", en: "Faster glow, naturally" },
    description: {
      ar: "جلسة نضارة داعمة للبشرة مع ترطيب وتغذية حسب الاحتياج.",
      en: "Glow-support session with hydration and nourishment based on skin needs.",
    },
  },
  {
    id: "offer-fillers-natural",
    slug: "natural-filler-deal",
    category: "injectables",
    discountLabel: { ar: "خصم 10%", en: "10% OFF" },
    validUntil: "2025-09-30",
    title: { ar: "عرض فيلر طبيعي", en: "Natural Filler Deal" },
    subtitle: { ar: "تدرج لنتيجة أنعم", en: "Gradual steps for softer results" },
    description: {
      ar: "جلسات فيلر بجرعات متدرجة لنتيجة طبيعية مع مراجعة بعد الجلسة.",
      en: "Gradual filler sessions for natural results with a post-session review.",
    },
  },
  {
    id: "offer-botox-baby",
    slug: "baby-botox-offer",
    category: "injectables",
    discountLabel: { ar: "خصم 12%", en: "12% OFF" },
    validUntil: "2025-04-20",
    title: { ar: "عرض بيبي بوتوكس", en: "Baby Botox Offer" },
    subtitle: { ar: "لمسات خفيفة للتعبيرات", en: "Light touch for expression lines" },
    description: {
      ar: "جرعات خفيفة لنعومة طبيعية مع تقييم دقيق قبل الجلسة.",
      en: "Light dosing for natural smoothness with careful pre-session evaluation.",
    },
  },
  {
    id: "offer-body-sculpt",
    slug: "body-sculpt-bundle",
    category: "body",
    discountLabel: { ar: "باقة مميزة", en: "Special Bundle" },
    validUntil: "2025-12-31",
    title: { ar: "باقة نحت القوام", en: "Body Sculpt Bundle" },
    subtitle: { ar: "تركيز على المناطق العنيدة", en: "Focus on stubborn areas" },
    description: {
      ar: "باقة تنسيق قوام بخطة جلسات مرنة حسب المناطق المستهدفة.",
      en: "Body contouring bundle with flexible sessions based on target areas.",
    },
  },
  {
    id: "offer-tummy-tighten",
    slug: "tummy-tightening-offer",
    category: "body",
    discountLabel: { ar: "خصم 22%", en: "22% OFF" },
    validUntil: "2025-03-31",
    title: { ar: "عرض شد البطن غير الجراحي", en: "Non-Surgical Tummy Tightening" },
    subtitle: { ar: "تحسين مظهر الجلد تدريجيًا", en: "Gradual skin appearance improvement" },
    description: {
      ar: "جلسات مخصصة لتحسين مظهر الجلد وشد بسيط حسب الحالة.",
      en: "Tailored sessions to improve skin appearance and mild tightening based on the case.",
    },
  },
  {
    id: "offer-surgery-consult",
    slug: "surgery-consult-offer",
    category: "surgery",
    discountLabel: { ar: "خصم 25%", en: "25% OFF" },
    validUntil: "2025-06-30",
    title: { ar: "عرض الاستشارة المتقدمة", en: "Advanced Consultation Deal" },
    subtitle: { ar: "تقييم شامل وخطة واضحة", en: "Full assessment & clear plan" },
    description: {
      ar: "خصم على استشارات الإجراءات المتقدمة مع شرح الخيارات وتوقعات النتائج.",
      en: "Discounted advanced consultations with clear options and expectations.",
    },
  },
];

export const offerCategories: { id: OfferCategory; label: TranslatedString }[] =
  [
    { id: "all", label: { ar: "كل العروض", en: "All offers" } },
    { id: "laser", label: { ar: "ليزر", en: "Laser" } },
    { id: "skin", label: { ar: "بشرة", en: "Skin" } },
    { id: "injectables", label: { ar: "حقن تجميلي", en: "Injectables" } },
    { id: "surgery", label: { ar: "جراحات", en: "Surgery" } },
    { id: "body", label: { ar: "تنسيق قوام", en: "Body" } },
  ];