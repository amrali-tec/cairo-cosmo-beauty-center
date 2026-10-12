// src/lib/data/services.ts
import type { ServiceBase } from "./types";

// ✅ Service images
import Botox from "@/assets/services/service-botox.png";
import filler from "@/assets/services/service-fillers.jpg";
import dermatology from "@/assets/services/service-dermatology.jpg";
import Microneedling from "@/assets/services/service-rejuvenation.jpg";
import treatment from "@/assets/services/Acne-treatment.jpeg";
import treatment2 from "@/assets/services/treatment2.jpeg";
import contouring from "@/assets/services/contouring.jpeg";
import laserhairremoval from "@/assets/services/laser-hair-removal.jpeg";
import hydrafacial from "@/assets/services/service-hydrafacial.png";
import deepskincleaning from "@/assets/services/deep-skin-cleaning.png";
import Chemicalpeel from "@/assets/services/Chemical-peel-treatment-relaxation.png";
import threadlift from "@/assets/services/thread-lift.png";
import Pigmentation from "@/assets/services/pigmentation-treatment.png";

// ==============================
// ✅ SERVICES DATA
// ==============================
const allServices: ServiceBase[] = [

  // ─────────────────────────────────────────
  // LASER
  // ─────────────────────────────────────────
  {
    id: "laser-hair-removal",
    slug: "laser-hair-removal",
    category: "laser",
    title: { ar: "ليزر إزالة الشعر", en: "Laser Hair Removal" },
    shortDescription: {
      ar: "تقليل نمو الشعر تدريجيًا مع نعومة أطول وخطة جلسات حسب نوع البشرة والشعر.",
      en: "Progressively reduce hair growth with longer smoothness and a session plan based on skin and hair type.",
    },
    description: {
      ar:
        "ليزر إزالة الشعر يقلل نمو الشعر تدريجيًا ويمنح نعومة طويلة الأمد. " +
        "يتم تحديد عدد الجلسات حسب المنطقة ونوع الشعر ودرجة لون البشرة، مع بروتوكول يركز على الأمان وتقليل التهيج وتحسين التهاب بصيلات الشعر.",
      en:
        "Laser hair removal gradually reduces hair growth and delivers long-lasting smoothness. " +
        "Session count is personalized based on the treated area, hair type, and skin tone, with a safety-first protocol to minimize irritation and improve folliculitis.",
    },
    highlights: {
      ar: ["نعومة أطول", "خطة جلسات حسب حالتك", "تقليل التهاب البصيلات", "مناسب لجميع مناطق الجسم"],
      en: ["Longer smoothness", "Personalized session plan", "Reduces folliculitis", "Suitable for all body areas"],
    },
    idealFor: {
      ar: ["الوجه والجسم", "البشرة الحساسة", "التهاب بصيلات الشعر المتكرر", "من يريد راحة دائمة من الحلاقة"],
      en: ["Face and body", "Sensitive skin", "Recurring folliculitis", "Those wanting long-term relief from shaving"],
    },
    steps: {
      ar: ["تقييم نوع البشرة والشعر", "تحديد بروتوكول الجلسات", "الجلسات بفترات منتظمة", "متابعة النتيجة وتعديل الخطة"],
      en: ["Skin and hair assessment", "Session protocol planning", "Regular sessions", "Progress review and plan adjustment"],
    },
    aftercare: {
      ar: ["تجنب الشمس المباشر بعد الجلسة", "استخدام واقي الشمس بانتظام", "تجنب الحلاقة باستثناء الماكينة بين الجلسات"],
      en: ["Avoid direct sun after sessions", "Apply sunscreen regularly", "Avoid waxing between sessions"],
    },
    duration: { ar: "15–60 دقيقة حسب المنطقة", en: "15–60 minutes depending on area" },
    recovery: { ar: "احمرار بسيط لساعات", en: "Mild redness for a few hours" },
    results: { ar: "تدريجي بعد عدة جلسات", en: "Progressive over multiple sessions" },
    seo: {
      title: { ar: "ليزر إزالة الشعر | Cosmo Clinic", en: "Laser Hair Removal | Cosmo Clinic" },
      description: {
        ar: "إزالة الشعر بالليزر بخطة جلسات تناسب نوع البشرة والشعر لنعومة طويلة الأمد.",
        en: "Laser hair removal with a plan tailored to your skin and hair type for long-lasting smoothness.",
      },
      keywords: {
        ar: ["ليزر إزالة الشعر", "إزالة شعر الجسم", "نعومة طويلة", "كوزمو كلينيك"],
        en: ["laser hair removal", "body hair removal", "long-lasting smooth skin", "cosmo clinic"],
      },
    },
    image: "/assets/services/Laser.jpeg",
    beforeAfter: [
      {
        serviceId: "laser-hair-removal",
        beforeImage: "",
        afterImage: "",
      },
    ],
    faqs: [
      {
        question: { ar: "كم عدد الجلسات المطلوبة؟", en: "How many sessions do I need?" },
        answer: {
          ar: "غالبًا 6–8 جلسات كبداية، وقد تختلف حسب المنطقة ونوع الشعر واستجابة الجسم.",
          en: "Typically 6–8 sessions to start, varying by area, hair type, and response.",
        },
      },
      {
        question: { ar: "هل الإجراء مؤلم؟", en: "Is the procedure painful?" },
        answer: {
          ar: "معظم الأشخاص يشعرون بإحساس خفيف مثل طقطقة لطيفة، ويمكن استخدام مبرد موضعي لتعزيز الراحة.",
          en: "Most people feel a mild snapping sensation. A cooling device can be used to enhance comfort.",
        },
      },
    ],
    featured: true,
  },

  // ─────────────────────────────────────────
  // INJECTABLES
  // ─────────────────────────────────────────
  {
    id: "botox",
    slug: "botox",
    category: "injectables",
    title: { ar: "بوتوكس وفيلر", en: "Botox & Fillers" },
    shortDescription: {
      ar: "تخفيف خطوط التعبير واستعادة الامتلاء بنتائج طبيعية تحافظ على ملامح الوجه.",
      en: "Soften expression lines and restore volume with natural results that preserve facial features.",
    },
    description: {
      ar:
        "البوتوكس والفيلر يكملان بعضهما لتجديد مظهر الوجه بشكل متوازن. " +
        "البوتوكس يقلل خطوط التعبير في الجبهة وحول العينين، بينما يستعيد الفيلر الامتلاء في مناطق مثل الشفاه والخدود وخط الفك. " +
        "نقيّم الوجه بشكل شامل لاختيار الكميات والمناطق المناسبة لتحقيق نتيجة متناسقة وطبيعية.",
      en:
        "Botox and fillers complement each other to refresh the face in a balanced way. " +
        "Botox reduces expression lines on the forehead and around the eyes, while fillers restore volume to areas like lips, cheeks, and jawline. " +
        "We assess the full face to choose the right amounts and areas for a harmonious, natural result.",
    },
    highlights: {
      ar: ["تقييم شامل للوجه", "نتيجة طبيعية متوازنة", "جلسة سريعة وبدون نقاهة تقريبًا", "يمكن الدمج بين الاثنين"],
      en: ["Full facial assessment", "Natural balanced result", "Quick with minimal downtime", "Can be combined"],
    },
    idealFor: {
      ar: ["خطوط الجبهة والعيون", "استعادة امتلاء الشفاه والخدود", "تحديد الفك والذقن", "الوقاية من تعمق الخطوط"],
      en: ["Forehead and eye lines", "Restoring lip and cheek volume", "Jawline and chin definition", "Preventive treatment"],
    },
    steps: {
      ar: ["تقييم الوجه وتحديد الخطة", "تعليم النقاط وتطبيق مخدر موضعي", "الحقن الدقيق", "إرشادات ما بعد الجلسة"],
      en: ["Facial assessment and plan", "Marking + topical numbing", "Precise injections", "Aftercare guidance"],
    },
    aftercare: {
      ar: ["تجنب فرك المنطقة 24 ساعة", "تجنب الرياضة العنيفة أول 24 ساعة", "تجنب الشمس الشديدة بعد الفيلر"],
      en: ["Avoid rubbing for 24 hours", "Skip intense workouts for 24 hours", "Avoid strong sun after fillers"],
    },
    duration: { ar: "20–45 دقيقة", en: "20–45 minutes" },
    recovery: { ar: "بدون توقف / تورم بسيط محتمل", en: "No downtime / mild swelling possible" },
    results: { ar: "بوتوكس: 3–5 أيام | فيلر: فوري", en: "Botox: 3–5 days | Filler: immediate" },
    seo: {
      title: { ar: "بوتوكس وفيلر | Cosmo Clinic", en: "Botox & Fillers | Cosmo Clinic" },
      description: {
        ar: "جلسات بوتوكس وفيلر بتقييم شامل ونتائج طبيعية لتجديد مظهر الوجه.",
        en: "Botox and filler sessions with full facial assessment for natural facial rejuvenation.",
      },
      keywords: {
        ar: ["بوتوكس", "فيلر", "خطوط التعبير", "تجميل الوجه", "كوزمو كلينيك"],
        en: ["botox", "fillers", "expression lines", "facial aesthetics", "cosmo clinic"],
      },
    },
    image: "/assets/services/botox.jpeg",
    beforeAfter: [
      {
        serviceId: "botox",
        beforeImage: "",
        afterImage: "",
      },
    ],
    faqs: [
      {
        question: { ar: "هل البوتوكس مؤلم؟", en: "Is Botox painful?" },
        answer: {
          ar: "الإحساس بسيط جدًا ويشبه وخزة خفيفة، ويمكن استخدام تبريد موضعي عند الحاجة.",
          en: "Discomfort is minimal, like a tiny pinch, and local cooling can be applied if needed.",
        },
      },
      {
        question: { ar: "كم تستمر النتيجة؟", en: "How long do results last?" },
        answer: {
          ar: "البوتوكس: 3–5 أشهر. الفيلر: 6–12 شهرًا حسب النوع والمنطقة.",
          en: "Botox: 3–5 months. Filler: 6–12 months depending on product and area.",
        },
      },
    ],
    featured: true,
  },

  // ─────────────────────────────────────────
  // SKIN BOOSTERS
  // ─────────────────────────────────────────
  {
    id: "skin-booster",
    slug: "skin-booster",
    category: "injectables",
    title: { ar: "سكين بوستر", en: "Skin Booster" },
    shortDescription: {
      ar: "ترطيب عميق من الداخل لتحسين نعومة البشرة وإشراقتها بشكل ملحوظ.",
      en: "Deep internal hydration to noticeably improve skin smoothness and radiance.",
    },
    description: {
      ar:
        "سكين بوستر هو حقن ترطيب عميق يستهدف طبقات الجلد الداخلية لتحسين الرطوبة والمرونة والنعومة. " +
        "يختلف عن الفيلر لأنه لا يهدف لإضافة حجم بل لتحسين جودة الجلد من الداخل. " +
        "مثالي لمن يعاني من جفاف البشرة أو فقدان النضارة مع التقدم في العمر، ويمكن تطبيقه على الوجه والرقبة والديكولتيه.",
      en:
        "Skin boosters are deep hydration injections targeting inner skin layers to improve moisture, elasticity, and smoothness. " +
        "Unlike fillers, the goal is improving skin quality—not adding volume. " +
        "Ideal for dry or dull skin and age-related loss of radiance, applicable on face, neck, and décolletage.",
    },
    highlights: {
      ar: ["ترطيب عميق من الداخل", "تحسين المرونة والنعومة", "إشراقة طبيعية ملحوظة", "مناسب للوجه والرقبة"],
      en: ["Deep hydration from within", "Improves elasticity and smoothness", "Visible natural glow", "Face, neck & décolletage"],
    },
    idealFor: {
      ar: ["البشرة الجافة وفاقدة الحيوية", "ظهور التجاعيد الدقيقة بسبب الجفاف", "من يريد تحسين جودة البشرة بدون فيلر"],
      en: ["Dry or dull skin", "Fine lines from dehydration", "Those wanting skin quality improvement without volume"],
    },
    steps: {
      ar: ["تقييم البشرة وتحديد المنطقة", "تطبيق مخدر موضعي", "حقن السكين بوستر بتوزيع منتظم", "إرشادات ما بعد الجلسة"],
      en: ["Skin assessment", "Topical numbing", "Evenly distributed injections", "Aftercare instructions"],
    },
    aftercare: {
      ar: ["تجنب المكياج 24 ساعة", "ترطيب منتظم", "واقي شمس يومي"],
      en: ["Avoid makeup for 24 hours", "Regular moisturizing", "Daily sunscreen"],
    },
    duration: { ar: "30–45 دقيقة", en: "30–45 minutes" },
    recovery: { ar: "احمرار وتورم بسيط 24–48 ساعة", en: "Mild redness/swelling 24–48 hours" },
    results: { ar: "تدريجي خلال أسبوعين مع تحسن مستمر", en: "Progressive over 2 weeks with ongoing improvement" },
    seo: {
      title: { ar: "سكين بوستر | Cosmo Clinic", en: "Skin Booster | Cosmo Clinic" },
      description: {
        ar: "جلسات سكين بوستر لترطيب البشرة عميقًا وتحسين نعومتها وإشراقتها.",
        en: "Skin booster sessions for deep hydration and improved skin smoothness and glow.",
      },
      keywords: {
        ar: ["سكين بوستر", "ترطيب البشرة", "نضارة البشرة", "كوزمو كلينيك"],
        en: ["skin booster", "skin hydration", "skin radiance", "cosmo clinic"],
      },
    },
    image: "/assets/services/skinbooster.jpeg",
    beforeAfter: [
      {
        serviceId: "skin-booster",
        beforeImage: "",
        afterImage: "",
      },
    ],
    faqs: [
      {
        question: { ar: "ما الفرق بين سكين بوستر والفيلر؟", en: "What's the difference between skin booster and filler?" },
        answer: {
          ar: "الفيلر يضيف حجمًا وتعريفًا للملامح، بينما السكين بوستر يركز على ترطيب الجلد وتحسين جودته من الداخل دون إضافة حجم.",
          en: "Fillers add volume and definition, while skin boosters focus on hydrating and improving skin quality from within without adding volume.",
        },
      },
    ],
    featured: false,
  },

  {
    id: "dermapen",
    slug: "dermapen",
    category: "skin",
    title: { ar: "ديرما بن", en: "Dermapen" },
    shortDescription: {
      ar: "تحفيز الكولاجين الطبيعي لتحسين الملمس والمسام والتجاعيد الدقيقة.",
      en: "Stimulate natural collagen to improve texture, pores, and fine lines.",
    },
    description: {
      ar:
        "الديرما بن (Dermapen) هو جهاز ميكرونيدلينج متطور يستخدم إبرًا دقيقة جدًا لإحداث قنوات صغيرة في الجلد، مما يحفز إنتاج الكولاجين والإيلاستين الطبيعي. " +
        "يساعد على تحسين ملمس البشرة وتقليل المسام وآثار الحبوب والتجاعيد الدقيقة. " +
        "يمكن دمجه مع سيرومات طبية لتعزيز امتصاصها وتحسين النتائج.",
      en:
        "Dermapen is an advanced microneedling device using ultra-fine needles to create micro-channels that stimulate natural collagen and elastin production. " +
        "It improves skin texture, minimizes pores, and softens acne marks and fine lines. " +
        "Can be combined with medical serums for enhanced absorption and better results.",
    },
    highlights: {
      ar: ["تحفيز الكولاجين الطبيعي", "تقليل المسام والتجاعيد الدقيقة", "يُحسّن ملمس البشرة", "يمكن دمجه مع سيرومات"],
      en: ["Stimulates natural collagen", "Minimizes pores and fine lines", "Improves skin texture", "Can be combined with serums"],
    },
    idealFor: {
      ar: ["المسام الواسعة", "آثار الحبوب الخفيفة", "التجاعيد الدقيقة", "خشونة الملمس"],
      en: ["Enlarged pores", "Mild acne marks", "Fine lines", "Rough texture"],
    },
    steps: {
      ar: ["تنظيف البشرة وتطبيق مخدر", "جلسة الديرما بن", "تطبيق سيروم علاجي", "إرشادات العناية"],
      en: ["Skin cleansing and numbing", "Dermapen session", "Therapeutic serum application", "Aftercare guidance"],
    },
    aftercare: {
      ar: ["احمرار بسيط 24–48 ساعة طبيعي", "تجنب المكياج 24 ساعة", "واقي شمس إلزامي", "ترطيب كثيف"],
      en: ["Mild redness 24–48 hours is normal", "Avoid makeup for 24 hours", "Sunscreen is essential", "Intensive moisturizing"],
    },
    duration: { ar: "30–45 دقيقة", en: "30–45 minutes" },
    recovery: { ar: "احمرار بسيط 24–48 ساعة", en: "Mild redness 24–48 hours" },
    results: { ar: "تدريجي خلال أسابيع", en: "Progressive over weeks" },
    seo: {
      title: { ar: "ديرما بن | Cosmo Clinic", en: "Dermapen | Cosmo Clinic" },
      description: {
        ar: "جلسات ديرما بن لتحفيز الكولاجين وتحسين ملمس البشرة وتقليل المسام والآثار.",
        en: "Dermapen sessions to stimulate collagen and improve skin texture, pores, and marks.",
      },
      keywords: {
        ar: ["ديرما بن", "ميكرونيدلينج", "تحفيز الكولاجين", "كوزمو كلينيك"],
        en: ["dermapen", "microneedling", "collagen stimulation", "cosmo clinic"],
      },
    },
    image: "/assets/services/Dermapen.jpeg",
    beforeAfter: [
      {
        serviceId: "dermapen",
        beforeImage: "",
        afterImage: "",
      },
    ],
    faqs: [
      {
        question: { ar: "كم جلسة تحتاج لرؤية نتيجة؟", en: "How many sessions to see results?" },
        answer: {
          ar: "غالبًا تبدأ النتيجة بالظهور بعد 2–3 جلسات، ويُنصح بـ 4–6 جلسات للحصول على أفضل نتيجة.",
          en: "Results typically start showing after 2–3 sessions, with 4–6 sessions recommended for best outcomes.",
        },
      },
    ],
    featured: false,
  },

  {
    id: "mesotherapy",
    slug: "mesotherapy",
    category: "injectables",
    title: { ar: "ميزوثيرابي", en: "Mesotherapy" },
    shortDescription: {
      ar: "حقن مغذية مباشرة في طبقات الجلد لتحسين البشرة والشعر والتقليص الموضعي.",
      en: "Targeted nutrient injections into skin layers to improve skin, hair, and localized concerns.",
    },
    description: {
      ar:
        "الميزوثيرابي يعتمد على حقن خليط من الفيتامينات والمعادن وحمض الهيالورونيك مباشرة في طبقات الجلد المستهدفة. " +
        "يستخدم لتحسين جودة البشرة ونضارتها، وعلاج تساقط الشعر، وتقليص الدهون الموضعية. " +
        "يتم تخصيص تركيبة المواد حسب الهدف والحاجة لتحقيق أفضل نتائج.",
      en:
        "Mesotherapy involves injecting a customized blend of vitamins, minerals, and hyaluronic acid directly into targeted skin layers. " +
        "It is used to improve skin quality and radiance, treat hair loss, and reduce localized fat. " +
        "The formula is tailored to your goal for optimal results.",
    },
    highlights: {
      ar: ["تغذية مباشرة للجلد", "يعالج تساقط الشعر", "تقليص موضعي للدهون", "تركيبة مخصصة"],
      en: ["Direct skin nourishment", "Treats hair loss", "Localized fat reduction", "Customized formula"],
    },
    idealFor: {
      ar: ["تحسين إشراقة البشرة", "تساقط الشعر المبكر", "الدهون الموضعية المحدودة", "فقدان الحيوية والنضارة"],
      en: ["Improving skin glow", "Early hair loss", "Localized stubborn fat", "Loss of vitality and radiance"],
    },
    steps: {
      ar: ["تقييم الحاجة وتخصيص التركيبة", "تطبيق مخدر موضعي", "الحقن بتقنية دقيقة", "إرشادات ما بعد الجلسة"],
      en: ["Assessment and formula customization", "Topical numbing", "Precise injection technique", "Aftercare guidance"],
    },
    aftercare: {
      ar: ["تجنب الشمس المباشر يوم الجلسة", "لا تمرين مكثف أول 24 ساعة", "واقي شمس يومي"],
      en: ["Avoid direct sun on session day", "No intense exercise for 24 hours", "Daily sunscreen"],
    },
    duration: { ar: "30–45 دقيقة", en: "30–45 minutes" },
    recovery: { ar: "احمرار بسيط لساعات", en: "Mild redness for a few hours" },
    results: { ar: "تدريجي بعد 3–4 جلسات", en: "Progressive after 3–4 sessions" },
    seo: {
      title: { ar: "ميزوثيرابي | Cosmo Clinic", en: "Mesotherapy | Cosmo Clinic" },
      description: {
        ar: "جلسات ميزوثيرابي لتحسين البشرة وعلاج تساقط الشعر وتقليص الدهون الموضعية.",
        en: "Mesotherapy sessions for skin improvement, hair loss treatment, and localized fat reduction.",
      },
      keywords: {
        ar: ["ميزوثيرابي", "حقن تغذية البشرة", "علاج تساقط الشعر", "كوزمو كلينيك"],
        en: ["mesotherapy", "skin nutrition injections", "hair loss treatment", "cosmo clinic"],
      },
    },
    image: "/assets/services/Mesotherapy.jpeg",
    beforeAfter: [
      {
        serviceId: "mesotherapy",
        beforeImage: "",
        afterImage: "",
      },
    ],
    faqs: [
      {
        question: { ar: "كم جلسة تحتاج الميزوثيرابي؟", en: "How many mesotherapy sessions are needed?" },
        answer: {
          ar: "عادةً 4–6 جلسات للحصول على نتيجة ملحوظة، وتختلف حسب الهدف والاستجابة.",
          en: "Usually 4–6 sessions for noticeable results, varying by goal and response.",
        },
      },
    ],
    featured: false,
  },

  {
    id: "hifu",
    slug: "hifu",
    category: "laser",
    title: { ar: "هايفو (HIFU)", en: "HIFU" },
    shortDescription: {
      ar: "شد غير جراحي بالموجات فوق الصوتية لرفع الوجه والرقبة مع تحفيز الكولاجين.",
      en: "Non-surgical ultrasound lifting for face and neck with deep collagen stimulation.",
    },
    description: {
      ar:
        "هايفو (High-Intensity Focused Ultrasound) يستخدم الموجات فوق الصوتية المركزة لاستهداف طبقات عميقة من الجلد وتحفيز إنتاج الكولاجين دون جراحة. " +
        "يمنح شدًا ورفعًا تدريجيًا لمنطقة الوجه والرقبة والذقن، ويُعد خيارًا مثاليًا لمن يريد نتيجة جوهرية دون تدخل جراحي. " +
        "النتائج تتحسن تدريجيًا خلال 2–3 أشهر مع استمرار تحفيز الكولاجين.",
      en:
        "HIFU (High-Intensity Focused Ultrasound) uses focused ultrasound energy to target deep skin layers and stimulate collagen without surgery. " +
        "It provides progressive lifting and tightening of the face, neck, and chin—an ideal choice for meaningful results without surgical intervention. " +
        "Results improve gradually over 2–3 months as collagen remodeling continues.",
    },
    highlights: {
      ar: ["شد وترميم بدون جراحة", "يستهدف الطبقات العميقة", "تحسين تدريجي خلال أشهر", "جلسة واحدة تكفي في الغالب"],
      en: ["Non-surgical tightening", "Targets deep skin layers", "Gradual improvement over months", "Often one session is sufficient"],
    },
    idealFor: {
      ar: ["ترهل الخدين وخط الفك", "الرقبة المترهلة", "ترهل جلد تحت الذقن", "من يريد شدًا بدون جراحة"],
      en: ["Cheek and jawline laxity", "Loose neck skin", "Submental laxity", "Those wanting lifting without surgery"],
    },
    steps: {
      ar: ["تقييم المناطق المستهدفة", "وضع جل موصل وتطبيق الجهاز", "الجلسة بإحساس دفء لطيف", "إرشادات ما بعد الجلسة"],
      en: ["Assessment of target areas", "Gel application and device placement", "Session with gentle warmth sensation", "Aftercare instructions"],
    },
    aftercare: {
      ar: ["لا توقف عن الأنشطة اليومية", "تجنب المكياج الثقيل يوم الجلسة", "ترطيب وواقي شمس"],
      en: ["No interruption to daily activities", "Avoid heavy makeup on session day", "Moisturize and apply sunscreen"],
    },
    duration: { ar: "60–90 دقيقة", en: "60–90 minutes" },
    recovery: { ar: "بدون نقاهة تقريبًا", en: "Minimal to no downtime" },
    results: { ar: "يبدأ خلال 4–6 أسابيع ويكتمل بعد 2–3 أشهر", en: "Begins in 4–6 weeks, full results in 2–3 months" },
    seo: {
      title: { ar: "هايفو | Cosmo Clinic", en: "HIFU | Cosmo Clinic" },
      description: {
        ar: "جلسات هايفو لشد الوجه والرقبة بدون جراحة مع تحفيز عميق للكولاجين.",
        en: "HIFU sessions for non-surgical face and neck lifting with deep collagen stimulation.",
      },
      keywords: {
        ar: ["هايفو", "شد الوجه", "ليفتينج بدون جراحة", "كوزمو كلينيك"],
        en: ["HIFU", "face lifting", "non-surgical lifting", "cosmo clinic"],
      },
    },
    image: "/assets/services/Non-surgical facelift.jpeg",
    beforeAfter: [
      {
        serviceId: "hifu",
        beforeImage: "",
        afterImage: "",
      },
    ],
    faqs: [
      {
        question: { ar: "هل هايفو مؤلم؟", en: "Is HIFU painful?" },
        answer: {
          ar: "قد يشعر بعض الأشخاص بإحساس دفء أو طنين خفيف أثناء الجلسة، وهو أمر طبيعي ويزول بعد الانتهاء.",
          en: "Some people feel a warm or tingling sensation during the session, which is normal and fades after the procedure.",
        },
      },
      {
        question: { ar: "كم تستمر نتائج هايفو؟", en: "How long do HIFU results last?" },
        answer: {
          ar: "عادةً تستمر النتائج من سنة إلى سنتين حسب نوع الجلد ونمط الحياة.",
          en: "Results typically last 1–2 years depending on skin type and lifestyle.",
        },
      },
    ],
    featured: true,
  },

  // ─────────────────────────────────────────
  // SKIN SESSIONS
  // ─────────────────────────────────────────
  {
    id: "hydrafacial",
    slug: "hydrafacial",
    category: "skin",
    title: { ar: "تنظيف بشرة بأنواعه (هيدرافيشل)", en: "Skin Cleansing – HydraFacial & More" },
    shortDescription: {
      ar: "تنظيف عميق وترطيب وإشراقة فورية بأنواع جلسات متعددة تناسب كل نوع بشرة.",
      en: "Deep cleansing, hydration, and instant glow with multiple session types for every skin type.",
    },
    description: {
      ar:
        "نقدم مجموعة جلسات تنظيف البشرة المتقدمة بما فيها الهيدرافيشل الذي يجمع التنظيف والتقشير والاستخلاص مع ترطيب مكثف وجرعة من مضادات الأكسدة. " +
        "مناسب لمعظم أنواع البشرة، يساعد على تقليل الرؤوس السوداء وتحسين ملمس البشرة وإعطاء إشراقة فورية. " +
        "خيار مثالي قبل المناسبات أو كصيانة شهرية منتظمة للبشرة.",
      en:
        "We offer advanced skin cleansing sessions including HydraFacial, which combines cleansing, exfoliation, extraction, intensive hydration, and antioxidants. " +
        "Suitable for most skin types, it reduces blackheads, refines texture, and delivers an instant glow. " +
        "A perfect choice before events or as monthly maintenance.",
    },
    highlights: {
      ar: ["إشراقة فورية", "تنظيف عميق للمسام", "بدون نقاهة", "أنواع متعددة تناسب البشرة"],
      en: ["Instant glow", "Deep pore cleansing", "No downtime", "Multiple types for every skin"],
    },
    idealFor: {
      ar: ["البهتان والجفاف", "الرؤوس السوداء والمسام الواسعة", "قبل المناسبات", "الصيانة الشهرية للبشرة"],
      en: ["Dullness and dehydration", "Blackheads and enlarged pores", "Pre-event prep", "Monthly skin maintenance"],
    },
    steps: {
      ar: ["تقييم نوع البشرة واختيار البروتوكول", "تنظيف وتقشير", "استخلاص الرؤوس السوداء", "ترطيب وتغذية"],
      en: ["Skin type assessment and protocol selection", "Cleansing and exfoliation", "Blackhead extraction", "Hydration and nourishment"],
    },
    aftercare: {
      ar: ["ترطيب منتظم", "واقي شمس يومي", "تجنب التقشير لأسبوع"],
      en: ["Regular moisturizing", "Daily sunscreen", "Avoid exfoliation for a week"],
    },
    duration: { ar: "30–45 دقيقة", en: "30–45 minutes" },
    recovery: { ar: "بدون نقاهة", en: "No downtime" },
    results: { ar: "فوري", en: "Immediate" },
    seo: {
      title: { ar: "تنظيف البشرة | هيدرافيشل | Cosmo Clinic", en: "Skin Cleansing | HydraFacial | Cosmo Clinic" },
      description: {
        ar: "جلسات تنظيف البشرة العميق بما فيها الهيدرافيشل لإشراقة فورية ومسام نظيفة.",
        en: "Advanced skin cleansing sessions including HydraFacial for instant glow and clean pores.",
      },
      keywords: {
        ar: ["هيدرافيشل", "تنظيف البشرة", "إشراقة البشرة", "كوزمو كلينيك"],
        en: ["hydrafacial", "skin cleansing", "skin glow", "cosmo clinic"],
      },
    },
    image: "/assets/services/hydrafacial.jpeg",
    beforeAfter: [
      {
        serviceId: "hydrafacial",
        beforeImage: "",
        afterImage: "",
      },
    ],
    faqs: [
      {
        question: { ar: "ما الفرق بين الهيدرافيشل والتنظيف العادي؟", en: "What's the difference between HydraFacial and regular cleansing?" },
        answer: {
          ar: "الهيدرافيشل يجمع خطوات متعددة في جلسة واحدة: تنظيف، تقشير، استخلاص، وترطيب مكثف، بينما التنظيف العادي يقتصر على إزالة الشوائب السطحية.",
          en: "HydraFacial combines multiple steps in one session: cleansing, exfoliation, extraction, and intensive hydration, while regular cleansing only removes surface impurities.",
        },
      },
    ],
    featured: true,
  },

  {
    id: "oxygeneo",
    slug: "oxygeneo",
    category: "skin",
    title: { ar: "جلسات أكسيزومو (OxyGeneo)", en: "OxyGeneo Sessions" },
    shortDescription: {
      ar: "تأكسج طبيعي وتجديد للبشرة وترطيب عميق في جلسة واحدة بدون إبر.",
      en: "Natural oxygenation, skin renewal, and deep hydration in one needle-free session.",
    },
    description: {
      ar:
        "جلسة أكسيزومو تجمع بين ثلاثة عناصر في آن واحد: التأكسج الطبيعي من الداخل، التقشير الفوري، وإدخال مواد نشطة مغذية في عمق الجلد. " +
        "تُحسّن ألوان البشرة وملمسها وتمنح إشراقة ملحوظة. " +
        "متوفرة للبشرة والشعر، ومناسبة لجميع أنواع البشرة بما فيها الحساسة.",
      en:
        "OxyGeneo combines three elements at once: natural oxygenation from within, instant exfoliation, and deep infusion of nourishing actives. " +
        "It improves skin tone, texture, and delivers a notable glow. " +
        "Available for skin and hair, suitable for all skin types including sensitive skin.",
    },
    highlights: {
      ar: ["تأكسج طبيعي بدون إبر", "تقشير وترطيب في نفس الوقت", "مناسب للبشرة الحساسة", "للبشرة والشعر"],
      en: ["Natural oxygenation, no needles", "Exfoliation and hydration simultaneously", "Safe for sensitive skin", "For skin and hair"],
    },
    idealFor: {
      ar: ["البشرة الباهتة وفاقدة الإشراقة", "الترطيب المكثف", "العناية بالشعر وفروة الرأس", "من يتجنب الإجراءات بالإبر"],
      en: ["Dull, glow-lacking skin", "Intensive hydration", "Hair and scalp care", "Those avoiding needle-based treatments"],
    },
    steps: {
      ar: ["تقييم البشرة واختيار التركيبة", "تطبيق رأس الجهاز على المنطقة المستهدفة", "التأكسج والتقشير والتغذية", "ترطيب ختامي"],
      en: ["Skin assessment and formula selection", "Device head applied to target area", "Oxygenation, exfoliation, and nourishment", "Final hydration"],
    },
    aftercare: {
      ar: ["ترطيب يومي", "واقي شمس", "يمكن وضع المكياج مباشرة بعد الجلسة"],
      en: ["Daily moisturizing", "Sunscreen", "Makeup can be applied immediately after the session"],
    },
    duration: { ar: "45–60 دقيقة", en: "45–60 minutes" },
    recovery: { ar: "بدون نقاهة", en: "No downtime" },
    results: { ar: "فوري ومستمر", en: "Immediate and ongoing" },
    seo: {
      title: { ar: "أكسيزومو | Cosmo Clinic", en: "OxyGeneo | Cosmo Clinic" },
      description: {
        ar: "جلسات أكسيزومو للتأكسج الطبيعي وتجديد البشرة وترطيب عميق.",
        en: "OxyGeneo sessions for natural oxygenation, skin renewal, and deep hydration.",
      },
      keywords: {
        ar: ["أكسيزومو", "تأكسج البشرة", "تجديد البشرة", "كوزمو كلينيك"],
        en: ["oxygeneo", "skin oxygenation", "skin renewal", "cosmo clinic"],
      },
    },
    image: "/assets/services/exosomes.jpeg",
    beforeAfter: [
      {
        serviceId: "oxygeneo",
        beforeImage: "",
        afterImage: "",
      },
    ],
    faqs: [],
    featured: false,
  },

  {
    id: "oxygeno-facial",
    slug: "oxygeno-facial",
    category: "skin",
    title: { ar: "جلسات أكسجينو للوجه", en: "Oxygen Facial Sessions" },
    shortDescription: {
      ar: "ضخ الأكسجين النقي مع مواد نشطة لإنعاش البشرة وإشراقتها الفورية.",
      en: "Infusing pure oxygen with active ingredients for instant skin revival and glow.",
    },
    description: {
      ar:
        "جلسات الأكسجين تضخ الأكسجين النقي مع سيرومات مخصصة مباشرة في البشرة لتعزيز الإشراقة الفورية وتحسين الرطوبة وإنعاش الخلايا. " +
        "تناسب جميع أنواع البشرة، وخاصة البشرة المتعبة وفاقدة الحيوية. " +
        "شائعة كإجراء تجميلي سريع قبل المناسبات الكبيرة.",
      en:
        "Oxygen facial sessions infuse pure oxygen along with customized serums directly into the skin to boost instant glow, improve hydration, and revive cells. " +
        "Suitable for all skin types, especially tired and dull skin. " +
        "Popular as a quick aesthetic treatment before major events.",
    },
    highlights: {
      ar: ["إشراقة فورية ملحوظة", "بدون إبر أو توقف", "مناسب لجميع أنواع البشرة", "ممتاز قبل المناسبات"],
      en: ["Instant visible glow", "No needles or downtime", "Suitable for all skin types", "Great before events"],
    },
    duration: { ar: "30–45 دقيقة", en: "30–45 minutes" },
    recovery: { ar: "بدون نقاهة", en: "No downtime" },
    results: { ar: "فوري", en: "Immediate" },
    image: "/assets/services/Oxygen.jpeg",
    beforeAfter: [
      {
        serviceId: "oxygeno-facial",
        beforeImage: "",
        afterImage: "",
      },
    ],
    faqs: [],
    featured: false,
  },

  {
    id: "pigmentation-acne-treatment",
    slug: "pigmentation-acne-treatment",
    category: "skin",
    title: { ar: "علاج التصبغات وآثار الحبوب", en: "Pigmentation & Acne Marks Treatment" },
    shortDescription: {
      ar: "خطة علاج متكاملة لتوحيد لون البشرة وتقليل التصبغات وآثار الحبوب تدريجيًا.",
      en: "A comprehensive plan to even skin tone and progressively reduce pigmentation and acne marks.",
    },
    description: {
      ar:
        "التصبغات وآثار الحبوب قد تكون ناتجة عن الشمس أو الهرمونات أو التهابات سابقة. " +
        "نحدد السبب أولًا ثم نبني خطة تشمل جلسات ليزر، تقشير، أو عناية طبية منزلية حسب الحالة. " +
        "الهدف هو توحيد اللون وتحسين الملمس بشكل آمن وتدريجي مع الحفاظ على صحة البشرة.",
      en:
        "Pigmentation and acne marks can result from sun exposure, hormonal changes, or past inflammation. " +
        "We identify the cause first, then build a plan using laser sessions, peels, or medical skincare based on your condition. " +
        "The goal is safe, progressive tone-evening and texture improvement while maintaining skin health.",
    },
    highlights: {
      ar: ["تحديد السبب قبل العلاج", "خطة مخصصة حسب الحالة", "تحسين اللون والملمس", "آمن وتدريجي"],
      en: ["Cause identified before treatment", "Customized plan per condition", "Tone and texture improvement", "Safe and progressive"],
    },
    idealFor: {
      ar: ["بقع الشمس", "آثار ما بعد الحبوب", "التصبغات الهرمونية (كلف)", "عدم انتظام لون البشرة"],
      en: ["Sun spots", "Post-acne marks", "Hormonal pigmentation (melasma)", "Uneven skin tone"],
    },
    steps: {
      ar: ["تقييم نوع وعمق التصبغ", "اختيار بروتوكول العلاج", "الجلسات المتتالية حسب الخطة", "متابعة وتعديل الخطة"],
      en: ["Assessment of pigmentation type and depth", "Treatment protocol selection", "Sequential sessions per plan", "Follow-up and plan adjustment"],
    },
    aftercare: {
      ar: ["واقي شمس SPF50+ يوميًا إلزامي", "تجنب العوامل المحفزة للتصبغ", "العناية المنزلية حسب وصفة الطبيب"],
      en: ["Daily SPF50+ sunscreen is mandatory", "Avoid pigmentation triggers", "Home care as prescribed"],
    },
    duration: { ar: "20–45 دقيقة حسب البروتوكول", en: "20–45 minutes depending on protocol" },
    recovery: { ar: "يختلف حسب نوع الجلسة", en: "Varies by session type" },
    results: { ar: "تدريجي خلال أسابيع إلى أشهر", en: "Progressive over weeks to months" },
    seo: {
      title: { ar: "علاج التصبغات وآثار الحبوب | Cosmo Clinic", en: "Pigmentation & Acne Marks Treatment | Cosmo Clinic" },
      description: {
        ar: "خطة علاج التصبغات وآثار الحبوب بتقنيات ليزر وتقشير وعناية طبية لتوحيد لون البشرة.",
        en: "Pigmentation and acne marks treatment with laser, peels, and medical skincare to even skin tone.",
      },
      keywords: {
        ar: ["علاج التصبغات", "آثار الحبوب", "توحيد لون البشرة", "كوزمو كلينيك"],
        en: ["pigmentation treatment", "acne marks", "even skin tone", "cosmo clinic"],
      },
    },
    image: "/assets/services/microneedling.jpeg",
    beforeAfter: [
      {
        serviceId: "pigmentation-acne-treatment",
        beforeImage: "",
        afterImage: "",
      },
    ],
    faqs: [
      {
        question: { ar: "هل التصبغات تعود بعد العلاج؟", en: "Can pigmentation return after treatment?" },
        answer: {
          ar: "يمكن أن تعود التصبغات بدون وقاية مناسبة من الشمس، لذا واقي الشمس اليومي جزء أساسي من خطة العلاج.",
          en: "Pigmentation can return without proper sun protection, which is why daily sunscreen is an essential part of the treatment plan.",
        },
      },
    ],
    featured: true,
  },

  {
    id: "chemical-peel",
    slug: "chemical-peel",
    category: "skin",
    title: { ar: "تقشير كيميائي", en: "Chemical Peel" },
    shortDescription: {
      ar: "تحسين الملمس وتفتيح التصبغات ومنح إشراقة تدريجية حسب نوع التقشير.",
      en: "Refine texture, brighten pigmentation, and reveal progressive glow based on peel type.",
    },
    description: {
      ar:
        "التقشير الكيميائي يساعد على توحيد لون البشرة وتقليل آثار الحبوب والتصبغات وتحسين الملمس. " +
        "نختار نوع التقشير وعمقه حسب نوع بشرتك وهدفك، مع خطة عناية بعد الجلسة لحماية البشرة وضمان نتائج أفضل.",
      en:
        "Chemical peels help even skin tone, reduce acne marks and pigmentation, and improve texture. " +
        "We select peel type and depth based on your skin and goals, with a clear aftercare plan to protect your skin and ensure better results.",
    },
    highlights: {
      ar: ["تفتيح تدريجي", "تحسين الملمس والمسام", "خطة تناسب نوع البشرة", "يمكن الدمج مع علاجات أخرى"],
      en: ["Progressive brightening", "Improved texture and pores", "Tailored plan per skin type", "Can be combined with other treatments"],
    },
    duration: { ar: "20–30 دقيقة", en: "20–30 minutes" },
    recovery: { ar: "تقشر خفيف عدة أيام حسب النوع", en: "Light peeling for days depending on type" },
    results: { ar: "تدريجي", en: "Progressive" },
    image: "/assets/services/Peeling.jpeg",
    beforeAfter: [
      {
        serviceId: "chemical-peel",
        beforeImage: "",
        afterImage: "",
      },
    ],
    faqs: [
      {
        question: { ar: "هل التقشير الكيميائي مناسب لجميع أنواع البشرة؟", en: "Is chemical peel suitable for all skin types?" },
        answer: {
          ar: "يوجد أنواع مختلفة من التقشير تناسب كل نوع بشرة، ويتم اختيار النوع والعمق المناسب بعد تقييم البشرة.",
          en: "Different peel types suit different skin types, and the right type and depth are chosen after a skin assessment.",
        },
      },
    ],
    featured: false,
  },

  // ─────────────────────────────────────────
  // HAIR LOSS
  // ─────────────────────────────────────────
  {
    id: "hair-loss-treatment",
    slug: "hair-loss-treatment",
    category: "hair",
    title: { ar: "علاج تساقط الشعر", en: "Hair Loss Treatment" },
    shortDescription: {
      ar: "خطة علاج متكاملة لتساقط الشعر تجمع بين الحلول الطبية والتقنية لنتائج ملحوظة.",
      en: "A comprehensive hair loss plan combining medical and technology-based solutions for noticeable results.",
    },
    description: {
      ar:
        "تساقط الشعر له أسباب متعددة منها الهرمونات والنظام الغذائي والضغط العصبي والعوامل الوراثية. " +
        "نبدأ بتشخيص السبب ثم نضع خطة تشمل جلسات ميزوثيرابي للشعر، بلازما PRP، ليزر للفروة، أو علاجات طبية حسب الحالة. " +
        "الهدف هو تقليل التساقط وتحفيز نمو الشعر الجديد بشكل آمن وتدريجي.",
      en:
        "Hair loss has multiple causes including hormones, diet, stress, and genetics. " +
        "We start with diagnosis then build a plan including hair mesotherapy, PRP plasma, scalp laser, or medical treatments depending on the case. " +
        "The goal is to reduce shedding and stimulate new hair growth safely and progressively.",
    },
    highlights: {
      ar: ["تشخيص السبب أولًا", "خطة علاج مخصصة", "تحفيز نمو الشعر الطبيعي", "جلسات غير جراحية"],
      en: ["Cause diagnosis first", "Customized treatment plan", "Stimulates natural hair growth", "Non-surgical sessions"],
    },
    idealFor: {
      ar: ["تساقط الشعر الهرموني", "الثعلبة المحدودة", "ضعف كثافة الشعر", "ما بعد الولادة أو النظام الغذائي"],
      en: ["Hormonal hair loss", "Localized alopecia", "Thinning hair", "Post-partum or diet-related loss"],
    },
    steps: {
      ar: ["تقييم الشعر وفروة الرأس", "تشخيص السبب وبناء الخطة", "الجلسات حسب البروتوكول", "متابعة ومراجعة التقدم"],
      en: ["Hair and scalp assessment", "Cause diagnosis and plan building", "Protocol-based sessions", "Progress follow-up"],
    },
    aftercare: {
      ar: ["اتباع التعليمات الغذائية حسب التوصيات", "المنتجات المنزلية الموصى بها", "الالتزام بمواعيد الجلسات"],
      en: ["Follow dietary recommendations", "Use recommended home products", "Commit to session schedule"],
    },
    duration: { ar: "30–60 دقيقة", en: "30–60 minutes" },
    recovery: { ar: "بدون نقاهة في الغالب", en: "Minimal to no downtime" },
    results: { ar: "تدريجي خلال 3–6 أشهر", en: "Progressive over 3–6 months" },
    seo: {
      title: { ar: "علاج تساقط الشعر | Cosmo Clinic", en: "Hair Loss Treatment | Cosmo Clinic" },
      description: {
        ar: "علاج تساقط الشعر بخطة مخصصة تجمع الميزوثيرابي والبلازما وعلاجات متقدمة.",
        en: "Hair loss treatment with a customized plan combining mesotherapy, PRP, and advanced treatments.",
      },
      keywords: {
        ar: ["علاج تساقط الشعر", "ميزوثيرابي الشعر", "PRP للشعر", "كوزمو كلينيك"],
        en: ["hair loss treatment", "hair mesotherapy", "PRP for hair", "cosmo clinic"],
      },
    },
    image: "/assets/services/exosome2.jpeg",
    beforeAfter: [
      {
        serviceId: "hair-loss-treatment",
        beforeImage: "",
        afterImage: "",
      },
    ],
    faqs: [
      {
        question: { ar: "متى تبدأ رؤية نتائج علاج تساقط الشعر؟", en: "When do hair loss treatment results start showing?" },
        answer: {
          ar: "عادةً تبدأ النتائج بالظهور بعد 2–3 أشهر من بدء الجلسات، مع استمرار التحسن تدريجيًا.",
          en: "Results usually begin showing after 2–3 months of sessions, with continued progressive improvement.",
        },
      },
    ],
    featured: false,
  },

  // ─────────────────────────────────────────
  // NUTRITION
  // ─────────────────────────────────────────
  {
    id: "nutrition-consultation",
    slug: "nutrition-consultation",
    category: "wellness",
    title: { ar: "استشارات تغذية علاجية", en: "Therapeutic Nutrition Consultation" },
    shortDescription: {
      ar: "خطة غذائية علاجية مخصصة تدعم أهداف البشرة والجسم والصحة العامة.",
      en: "A personalized therapeutic nutrition plan supporting skin, body, and overall health goals.",
    },
    description: {
      ar:
        "الاستشارات الغذائية العلاجية تُقدّم خطة أكل مخصصة مبنية على الوضع الصحي والأهداف العلاجية للشخص. " +
        "سواء كان الهدف دعم صحة البشرة، تحسين الوزن، دعم علاج تساقط الشعر، أو تحسين الطاقة العامة، نبني خطة واضحة ومتابعة دورية. " +
        "التغذية الصحيحة تُعزز نتائج الجلسات التجميلية بشكل كبير.",
      en:
        "Therapeutic nutrition consultations provide a personalized eating plan built on your health status and treatment goals. " +
        "Whether the goal is supporting skin health, improving weight, supporting hair loss treatment, or boosting energy, we build a clear plan with regular follow-ups. " +
        "Proper nutrition significantly enhances aesthetic session results.",
    },
    highlights: {
      ar: ["خطة غذائية مخصصة", "تدعم نتائج الجلسات التجميلية", "متابعة دورية", "مناسبة لأهداف متعددة"],
      en: ["Personalized nutrition plan", "Supports aesthetic session results", "Regular follow-up", "Suitable for multiple goals"],
    },
    idealFor: {
      ar: ["من يريد دعم صحة البشرة بالتغذية", "علاج تساقط الشعر", "تحسين الوزن والطاقة", "الاستعداد للإجراءات التجميلية"],
      en: ["Those wanting nutrition-based skin support", "Hair loss treatment", "Weight and energy improvement", "Pre-aesthetic procedure prep"],
    },
    steps: {
      ar: ["تقييم الحالة الصحية والأهداف", "خطة غذائية مخصصة", "متابعة دورية وتعديل الخطة"],
      en: ["Health status and goal assessment", "Personalized nutrition plan", "Regular follow-up and plan adjustments"],
    },
    aftercare: {
      ar: ["الالتزام بالخطة الغذائية", "التواصل مع المختص عند التغييرات", "المراجعات الدورية"],
      en: ["Commit to the nutrition plan", "Contact specialist with changes", "Regular check-in appointments"],
    },
    duration: { ar: "45–60 دقيقة", en: "45–60 minutes" },
    recovery: { ar: "—", en: "—" },
    results: { ar: "تدريجي مع الالتزام بالخطة", en: "Progressive with plan adherence" },
    seo: {
      title: { ar: "استشارات تغذية علاجية | Cosmo Clinic", en: "Therapeutic Nutrition Consultation | Cosmo Clinic" },
      description: {
        ar: "استشارات تغذية علاجية لخطة غذائية مخصصة تدعم أهداف البشرة والجسم والصحة.",
        en: "Therapeutic nutrition consultations for a personalized plan supporting skin, body, and health goals.",
      },
      keywords: {
        ar: ["استشارات تغذية", "تغذية علاجية", "خطة غذائية", "كوزمو كلينيك"],
        en: ["nutrition consultation", "therapeutic nutrition", "diet plan", "cosmo clinic"],
      },
    },
    image: "/assets/blog/How-to-choose-your-aesthetic-plan-cover.png",
    beforeAfter: [
      {
        serviceId: "nutrition-consultation",
        beforeImage: "",
        afterImage: "",
      },
    ],
    faqs: [
      {
        question: { ar: "هل استشارة التغذية تكمّل الجلسات التجميلية؟", en: "Does nutrition consultation complement aesthetic sessions?" },
        answer: {
          ar: "نعم، التغذية الصحيحة تعزز نتائج معظم الجلسات التجميلية وتسرع التعافي وتدعم صحة البشرة والشعر من الداخل.",
          en: "Yes, proper nutrition enhances most aesthetic session results, speeds recovery, and supports skin and hair health from within.",
        },
      },
    ],
    featured: false,
  },

  // ─────────────────────────────────────────
  // MEN'S SERVICES
  // ─────────────────────────────────────────
  {
    id: "mens-laser-hair-removal",
    slug: "mens-laser-hair-removal",
    category: "laser",
    title: { ar: "ليزر إزالة الشعر الرجالي", en: "Men's Laser Hair Removal" },
    shortDescription: {
      ar: "إزالة الشعر بالليزر للرجال بخطة جلسات تناسب مناطق الجسم المختلفة.",
      en: "Laser hair removal for men with a session plan tailored to different body areas.",
    },
    description: {
      ar:
        "ليزر إزالة الشعر الرجالي يقدم حلًا عمليًا لتقليل الشعر الزائد في مناطق متعددة مثل الظهر والصدر والوجه واليدين. " +
        "نحدد عدد الجلسات ونوع الليزر المناسب حسب كثافة الشعر ودرجة لون البشرة. " +
        "يساعد أيضًا على تقليل التهاب بصيلات الشعر الذي يشكو منه كثير من الرجال في مناطق الحلاقة.",
      en:
        "Men's laser hair removal offers a practical solution to reduce excess hair in multiple areas such as back, chest, face, and arms. " +
        "We determine session count and laser type based on hair density and skin tone. " +
        "It also helps reduce folliculitis, a common concern in men's shaving areas.",
    },
    highlights: {
      ar: ["مناسب لمناطق واسعة مثل الظهر والصدر", "تقليل التهاب بصيلات الشعر", "بروتوكول آمن للبشرة الرجالية", "نتائج طويلة الأمد"],
      en: ["Suitable for large areas like back and chest", "Reduces folliculitis", "Safe protocol for men's skin", "Long-lasting results"],
    },
    idealFor: {
      ar: ["الشعر الزائد في الظهر والصدر", "تهيج منطقة الحلاقة", "الوجه والرقبة والأطراف", "الرجال الرياضيين الذين يفضلون بشرة خالية من الشعر"],
      en: ["Excess back and chest hair", "Shaving area irritation", "Face, neck, and limbs", "Athletes preferring hair-free skin"],
    },
    steps: {
      ar: ["تقييم نوع الشعر والبشرة", "تحديد المناطق وبروتوكول الجلسات", "الجلسات بفترات منتظمة", "متابعة النتيجة"],
      en: ["Hair and skin type assessment", "Area mapping and session protocol", "Regular sessions", "Result follow-up"],
    },
    aftercare: {
      ar: ["واقي شمس للمناطق المكشوفة", "تجنب الحلاقة بالشمع بين الجلسات", "ترطيب المناطق المعالجة"],
      en: ["Sunscreen for exposed areas", "Avoid waxing between sessions", "Moisturize treated areas"],
    },
    duration: { ar: "20–90 دقيقة حسب المنطقة", en: "20–90 minutes depending on area" },
    recovery: { ar: "احمرار بسيط لساعات", en: "Mild redness for a few hours" },
    results: { ar: "تدريجي بعد 6–8 جلسات", en: "Progressive after 6–8 sessions" },
    seo: {
      title: { ar: "ليزر إزالة الشعر الرجالي | Cosmo Clinic", en: "Men's Laser Hair Removal | Cosmo Clinic" },
      description: {
        ar: "ليزر إزالة الشعر للرجال بخطة مخصصة حسب المنطقة ونوع البشرة.",
        en: "Men's laser hair removal with a plan tailored to area and skin type.",
      },
      keywords: {
        ar: ["ليزر رجالي", "إزالة شعر الرجال", "ليزر الظهر", "كوزمو كلينيك"],
        en: ["men's laser", "men hair removal", "back laser", "cosmo clinic"],
      },
    },
    image: "/assets/services/mens-laser-hair-removal.png",
    beforeAfter: [
      {
        serviceId: "mens-laser-hair-removal",
        beforeImage: "",
        afterImage: "",
      },
    ],
    faqs: [
      {
        question: { ar: "هل ليزر إزالة الشعر مناسب للبشرة الداكنة؟", en: "Is laser hair removal suitable for darker skin?" },
        answer: {
          ar: "نعم، نستخدم أنواع ليزر مناسبة للبشرة الداكنة مع بروتوكول يضمن الأمان والفعالية.",
          en: "Yes, we use laser types suitable for darker skin with a protocol ensuring safety and effectiveness.",
        },
      },
    ],
    featured: false,
  },

  {
    id: "mens-dermatology-consultation",
    slug: "mens-dermatology-consultation",
    category: "skin",
    title: { ar: "استشارات جلدية متخصصة للرجال", en: "Men's Specialized Dermatology Consultation" },
    shortDescription: {
      ar: "تقييم شامل لمشكلات البشرة والشعر الخاصة بالرجال مع خطة علاجية دقيقة.",
      en: "Comprehensive assessment of men's skin and hair concerns with a precise treatment plan.",
    },
    description: {
      ar:
        "الاستشارة الجلدية المتخصصة للرجال تأخذ بعين الاعتبار خصائص البشرة الرجالية ومشكلاتها الخاصة مثل التهاب بصيلات الشعر، حب الشباب، التصبغات، والتساقط. " +
        "نقيّم الحالة بشكل شامل ونضع خطة علاجية واضحة تناسب نمط الحياة الرجالي.",
      en:
        "The specialized men's dermatology consultation accounts for male skin characteristics and specific concerns such as folliculitis, acne, pigmentation, and hair loss. " +
        "We comprehensively assess the condition and create a clear treatment plan suited to a male lifestyle.",
    },
    highlights: {
      ar: ["تقييم خاص بالبشرة الرجالية", "خطة علاج مخصصة", "يشمل مشكلات الشعر والبشرة", "نهج عملي يناسب الرجال"],
      en: ["Assessment specific to men's skin", "Customized treatment plan", "Covers skin and hair concerns", "Practical male-oriented approach"],
    },
    duration: { ar: "30–45 دقيقة", en: "30–45 minutes" },
    recovery: { ar: "—", en: "—" },
    results: { ar: "يعتمد على خطة العلاج", en: "Depends on treatment plan" },
    image: "/assets/services/mens-dermatology.jpg",
    beforeAfter: [
      {
        serviceId: "mens-dermatology-consultation",
        beforeImage: "/assets/services/mens-dermatology.jpg",
        afterImage: "/assets/services/mens-dermatology.jpg",
      },
    ],
    faqs: [],
    featured: false,
  },

  {
    id: "mens-nutrition-consultation",
    slug: "mens-nutrition-consultation",
    category: "wellness",
    title: { ar: "استشارات تغذية علاجية للرجال", en: "Men's Therapeutic Nutrition Consultation" },
    shortDescription: {
      ar: "خطة تغذية علاجية مخصصة للرجال تدعم أهداف الصحة والجسم والبشرة.",
      en: "Personalized therapeutic nutrition plan for men supporting health, body, and skin goals.",
    },
    description: {
      ar:
        "تغذية الرجل لها احتياجات خاصة تختلف عن المرأة، خاصة في ما يتعلق بالطاقة وبناء العضلات وصحة الشعر والبشرة. " +
        "نقدم خطة غذائية علاجية مخصصة تراعي هذه الاحتياجات مع متابعة دورية لضمان التقدم نحو الأهداف.",
      en:
        "Men's nutrition has specific needs different from women's, particularly around energy, muscle building, and hair and skin health. " +
        "We provide a personalized therapeutic nutrition plan addressing these needs with regular follow-ups to ensure progress toward goals.",
    },
    duration: { ar: "45–60 دقيقة", en: "45–60 minutes" },
    recovery: { ar: "—", en: "—" },
    results: { ar: "تدريجي مع الالتزام", en: "Progressive with commitment" },
    image: "/assets/services/mens-nutrition.jpg",
    beforeAfter: [
      {
        serviceId: "mens-nutrition-consultation",
        beforeImage: "/assets/services/mens-nutrition.jpg",
        afterImage: "/assets/services/mens-nutrition.jpg",
      },
    ],
    faqs: [],
    featured: false,
  },

  {
    id: "skin-tag-removal",
    slug: "skin-tag-removal",
    category: "skin",
    title: { ar: "إزالة الزوائد الجلدية", en: "Skin Tag Removal" },
    shortDescription: {
      ar: "إزالة الزوائد الجلدية الصغيرة بدقة وبأسلوب مناسب لنوع البشرة ومكان الزائدة.",
      en: "Precise removal of small skin tags with an approach tailored to skin type and tag location.",
    },
    description: {
      ar:
        "إزالة الزوائد الجلدية تتم بعد تقييم شكل الزائدة ومكانها للتأكد من ملاءمة الإجراء واختيار التقنية المناسبة. " +
        "نركز على إزالة آمنة ودقيقة مع تقليل التهيج قدر الإمكان، خاصة في المناطق الظاهرة أو المعرضة للاحتكاك مثل الرقبة وتحت الإبط والجفون.",
      en:
        "Skin tag removal starts with assessing the lesion and its location to confirm suitability and choose the right technique. " +
        "We focus on precise, safe removal while minimizing irritation, especially in visible or friction-prone areas such as the neck, underarms, and eyelids.",
    },
    highlights: {
      ar: ["إزالة دقيقة", "مناسبة للمناطق الحساسة", "تقليل التهيج بعد الإجراء", "تقييم طبي قبل الإزالة"],
      en: ["Precise removal", "Suitable for sensitive areas", "Minimized post-procedure irritation", "Medical assessment before removal"],
    },
    idealFor: {
      ar: ["الزوائد الجلدية الصغيرة", "الرقبة وتحت الإبط", "المناطق المعرضة للاحتكاك", "منزعج من شكل الزوائد أو احتكاكها"],
      en: ["Small skin tags", "Neck and underarms", "Friction-prone areas", "Those bothered by appearance or rubbing"],
    },
    steps: {
      ar: ["تقييم الزائدة الجلدية", "اختيار التقنية المناسبة", "إزالة دقيقة وسريعة", "تعليمات عناية بسيطة بعد الإجراء"],
      en: ["Skin tag assessment", "Selecting the right technique", "Quick precise removal", "Simple aftercare instructions"],
    },
    aftercare: {
      ar: ["الحفاظ على نظافة المنطقة", "تجنب العبث بالقشرة إن وجدت", "استخدام الكريم الموصوف عند الحاجة", "مراجعة العيادة إذا ظهر تهيج غير طبيعي"],
      en: ["Keep the area clean", "Do not pick any small scab if present", "Use prescribed cream if needed", "Return if unusual irritation appears"],
    },
    duration: { ar: "15–30 دقيقة", en: "15–30 minutes" },
    recovery: { ar: "احمرار خفيف مؤقت", en: "Temporary mild redness" },
    results: { ar: "فوري بعد الإزالة", en: "Immediate after removal" },
    seo: {
      title: { ar: "إزالة الزوائد الجلدية | Cosmo Clinic", en: "Skin Tag Removal | Cosmo Clinic" },
      description: {
        ar: "إزالة الزوائد الجلدية الصغيرة بدقة وبروتوكول مناسب للمناطق الحساسة والظاهرة.",
        en: "Precise skin tag removal with a protocol suited to visible and sensitive areas.",
      },
      keywords: {
        ar: ["إزالة الزوائد الجلدية", "زوائد جلدية", "إزالة skin tags", "كوزمو كلينيك"],
        en: ["skin tag removal", "skin tags", "lesion removal", "cosmo clinic"],
      },
    },
    image: dermatology,
    beforeAfter: [
      {
        serviceId: "skin-tag-removal",
        beforeImage: "",
        afterImage: "",
      },
    ],
    faqs: [
      {
        question: { ar: "هل إزالة الزوائد الجلدية تترك أثرًا؟", en: "Does skin tag removal leave a mark?" },
        answer: {
          ar: "في الغالب يكون الأثر بسيطًا جدًا ويخف تدريجيًا، ويعتمد ذلك على حجم الزائدة ومكانها وطريقة العناية بعد الإجراء.",
          en: "Any mark is usually minimal and fades gradually, depending on the tag size, location, and aftercare.",
        },
      },
    ],
    featured: false,
  },
];

const allowedServiceIds = [
  "laser-hair-removal",
  "botox",
  "skin-booster",
  "dermapen",
  "mesotherapy",
  "hifu",
  "hydrafacial",
  "oxygeneo",
  "oxygeno-facial",
  "pigmentation-acne-treatment",
  "chemical-peel",
  "hair-loss-treatment",
  "nutrition-consultation",
  "mens-laser-hair-removal",
  "mens-dermatology-consultation",
  "mens-nutrition-consultation",
] as const;

const allowedServicesMap = new Map(allServices.map((service) => [service.id, service]));

// ==============================
// ✅ Export
// ==============================
export const mergedServicesBase: ServiceBase[] = allowedServiceIds
  .map((id) => allowedServicesMap.get(id))
  .filter((service): service is ServiceBase => Boolean(service));
export const ALL_SERVICE_IDS = mergedServicesBase.map((s) => s.id);
