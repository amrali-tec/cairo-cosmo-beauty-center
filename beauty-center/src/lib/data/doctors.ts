// src/lib/data/doctors.ts
import type { Branch, DoctorBase } from "./types";

// Doctor images (المؤكدين عندك)
import drbassamzak1 from "@/assets/bassim-zaki.png";
import ahmedalshri from "@/assets/ahmed.jpeg";
import nahidsami from "@/assets/nahid-samir.png";
import drbassemzaki from "../../../public/assets/logo-outbg.png";


// ==============================
// ✅ Core Doctors (3)
// ==============================
const baseDoctors: DoctorBase[] = [
  {
    id: "1",
    slug: "dr-basim-zaki",
    name: { ar: "أ.د. باسم زكي", en: "Prof. Dr. Basim Zaki" },
    specialty: { ar: "استشاري جراحة التجميل", en: "Professor of Plastic Surgery" },
    bio: {
      ar: "أستاذ جراحة التجميل، كلية الطب - جامعة عين شمس.",
      en: "Professor of Plastic Surgery, Faculty of Medicine - Ain Shams University.",
    },
    experience: { ar: "+25 سنة خبرة", en: "25+ Years Experience" },
    image: drbassamzak1,
    workingDays: { ar: "السبت - الأربعاء", en: "Sat - Wed" },
    socialLinks: {
      facebook: "https://www.facebook.com/DrBasimZaki/",
      youtube: "https://www.youtube.com/@drbasimzaki6139",
    },
  },
  {
    id: "3",
    slug: "prof-ahmed-el-sherif",
    name: { ar: "أ.د. أحمد الشريف", en: "Prof. Dr. Ahmed El Sherif" },
    specialty: { ar: "استشاري جراحة التجميل", en: "Cosmetic Surgery Consultant" },
    bio: {
      ar: "استشاري جراحة التجميل بكلية الطب جامعة القاهرة. خبرة واسعة في الإجراءات التجميلية المتقدمة وتقنيات الليزر الحديثة.",
      en: "Dermatology and Aesthetics Consultant at Cairo University. Extensive experience in advanced aesthetic procedures and modern laser techniques.",
    },
    experience: { ar: "+25 سنة خبرة", en: "25+ Years Experience" },
    image: ahmedalshri,
    workingDays: { ar: "الأحد - الخميس", en: "Sun - Thu" },
  },
  {
    id: "2",
    slug: "prof-nahed-samir",
    name: { ar: "أ.د. ناهد سمير", en: "Prof. Dr. Nahed Samir" },
    specialty: {
      ar: "استشاري جراحة التجميل",
      en: "Cosmetic Surgery Consultant",
    },
    bio: {
      ar: "استشاري جراحة التجميل، كلية الطب - جامعة عين شمس.",
      en: "Cosmetic Surgery Consultant, Faculty of Medicine - Ain Shams University.",
    },
    experience: { ar: "+25 سنة خبرة", en: "25+ Years Experience" },
    image: nahidsami,
    workingDays: { ar: "السبت - الثلاثاء", en: "Sat - Tue" },
    socialLinks: {
      youtube: "https://www.youtube.com/channel/UC9Q90G8oHbezdkt7jgPg95g/videos",
      facebook: "https://www.facebook.com/DrNahedSamir/",
    },
  },
];

// ==============================
// ✅ Branch Doctors (Grouped)
// ==============================
const doctorPlaceholder = drbassemzaki;

export const doctorsByBranch: Record<Branch["id"], DoctorBase[]> = {
  // ----------------------------
  // شبرا
  // ----------------------------
  shubra: [
    {
      id: "shubra-asmaa-eihab",
      slug: "dr-asmaa-eihab-shubra",
      name: { ar: "د. أسماء إيهاب", en: "Dr. Asmaa Ehab" },
      specialty: { ar: "استشاري جلدية", en: "Dermatology Consultant" },
      bio: {
        ar: "استشارية جلدية تقدم تشخيصًا دقيقًا وخطط علاجية متقدمة لحالات البشرة والشعر.",
        en: "Dermatology consultant providing accurate diagnosis and advanced treatment plans for skin and hair concerns.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: { ar: "الأحد", en: "Sunday" },
      branchId: "shubra",
    },
    {
      id: "shubra-angie-mansour",
      slug: "dr-angie-mansour-shubra",
      name: { ar: "د. إنجي منصور", en: "Dr. Angie Mansour" },
      specialty: { ar: "استشاري جلدية", en: "Dermatology Consultant" },
      bio: {
        ar: "استشارية جلدية بخبرة في علاج مشكلات البشرة الشائعة والمتقدمة وخطط المتابعة.",
        en: "Dermatology consultant experienced in common and advanced skin concerns and follow-up care.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: { ar: "الإثنين", en: "Monday" },
      branchId: "shubra",
    },
    {
      id: "shubra-nada-gamal",
      slug: "dr-nada-gamal-shubra",
      name: { ar: "د. ندى جمال", en: "Dr. Nada Gamal" },
      specialty: { ar: "أخصائي جلدية", en: "Dermatology Specialist" },
      bio: {
        ar: "أخصائية جلدية تهتم بخطط علاج عملية وتحسين النتائج خطوة بخطوة.",
        en: "Dermatology specialist focused on practical treatment plans and step-by-step results.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: { ar: "الثلاثاء", en: "Tuesday" },
      branchId: "shubra",
    },
    {
      id: "shubra-nadine-elghaly",
      slug: "dr-nadine-elghaly-shubra",
      name: { ar: "د. نادين الغالي", en: "Dr. Nadine Elghaly" },
      specialty: { ar: "أخصائي جلدية", en: "Dermatology Specialist" },
      bio: {
        ar: "أخصائية جلدية تهتم بالعناية الشاملة بالبشرة ووضع خطة علاج مناسبة لكل حالة.",
        en: "Dermatology specialist providing comprehensive skin care and tailored plans.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: { ar: "الأربعاء", en: "Wednesday" },
      branchId: "shubra",
    },
    {
      id: "shubra-ahmed-hany",
      slug: "dr-ahmed-hany-shubra",
      name: { ar: "د. أحمد هاني", en: "Dr. Ahmed Hany" },
      specialty: { ar: "أخصائي جلدية", en: "Dermatology Specialist" },
      bio: {
        ar: "أخصائي جلدية يقدم حلولًا علاجية متقدمة لمشكلات البشرة مع متابعة دقيقة.",
        en: "Dermatology specialist offering advanced treatment options with attentive follow-up.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: { ar: "الخميس", en: "Thursday" },
      branchId: "shubra",
    },
  ],

  // ----------------------------
  // شيراتون
  // ----------------------------
  sheraton: [
    {
      id: "sheraton-nancy-refaat",
      slug: "dr-nancy-refaat-sheraton",
      name: { ar: "د. نانسي رفعت", en: "Dr. Nancy Refaat" },
      specialty: { ar: "استشاري جلدية وليزر", en: "Dermatology & Laser Consultant" },
      bio: {
        ar: "استشارية جلدية وليزر بخطط علاج متقدمة وإجراءات تجميلية غير جراحية.",
        en: "Dermatology & laser consultant delivering advanced care and non-surgical aesthetic solutions.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: {
        ar: "السبت مساء • الإثنين مساء • الخميس (متغير)",
        en: "Sat (Evening) • Mon (Evening) • Thu (Varies)",
      },
      branchId: "sheraton",
    },
    {
      id: "sheraton-thoraya-sayed",
      slug: "dr-thoraya-sayed-sheraton",
      name: { ar: "د. ثريا سيد", en: "Dr. Thoraya Sayed" },
      specialty: { ar: "تجميل وليزر", en: "Aesthetics & Laser" },
      bio: {
        ar: "تخصص تجميل وليزر مع تركيز على نضارة البشرة وتحسين المظهر العام.",
        en: "Aesthetics & laser care focused on skin radiance and overall appearance improvement.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: {
        ar: "السبت 2 ظهرًا • الأحد 2 ظهرًا • الإثنين 2 ظهرًا",
        en: "Sat 2 PM • Sun 2 PM • Mon 2 PM",
      },
      branchId: "sheraton",
    },
    {
      id: "sheraton-rania-elsayed",
      slug: "dr-rania-elsayed-sheraton",
      name: { ar: "د. رانيا السيد", en: "Dr. Rania El Sayed" },
      specialty: { ar: "تجميل وليزر", en: "Aesthetics & Laser" },
      bio: {
        ar: "تجميل وليزر بخطة علاج مرنة حسب احتياج الحالة والهدف الجمالي.",
        en: "Aesthetics & laser care with flexible plans based on your goals and needs.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: { ar: "الأحد مساء • الجمعة 2 ظهرًا", en: "Sun (Evening) • Fri 2 PM" },
      branchId: "sheraton",
    },
    {
      id: "sheraton-yomna-abbas",
      slug: "dr-yomna-abbas-sheraton",
      name: { ar: "د. يمنى عباس", en: "Dr. Yomna Abbas" },
      specialty: { ar: "تجميل وليزر وتغذية", en: "Aesthetics, Laser & Nutrition" },
      bio: {
        ar: "تخصص تجميل وليزر مع دعم تغذوي لتحسين النتائج واستدامتها.",
        en: "Aesthetics & laser care with nutrition support for better and lasting results.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: {
        ar: "الثلاثاء مساء • الأربعاء مساء • الخميس (متغير)",
        en: "Tue (Evening) • Wed (Evening) • Thu (Varies)",
      },
      branchId: "sheraton",
    },
    {
      id: "sheraton-ahmed-hany",
      slug: "dr-ahmed-hany-sheraton",
      name: { ar: "د. أحمد هاني", en: "Dr. Ahmed Hany" },
      specialty: { ar: "تجميل وليزر", en: "Aesthetics & Laser" },
      bio: {
        ar: "تجميل وليزر مع اهتمام بخطط علاج واضحة ونتائج طبيعية.",
        en: "Aesthetics & laser with clear treatment plans and natural-looking results.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: { ar: "الأربعاء مساء (7 مساءً)", en: "Wednesday (Evening, 7 PM)" },
      branchId: "sheraton",
    },
    {
      id: "sheraton-mohamed-abbas",
      slug: "dr-mohamed-abbas-sheraton",
      name: { ar: "د. محمد عباس", en: "Dr. Mohamed Abbas" },
      specialty: { ar: "تجميل وليزر", en: "Aesthetics & Laser" },
      bio: {
        ar: "تجميل وليزر مع متابعة دقيقة للوصول لأفضل نتيجة.",
        en: "Aesthetics & laser with attentive follow-up for optimal outcomes.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: { ar: "السبت مساء", en: "Saturday (Evening)" },
      branchId: "sheraton",
    },
  ],

  // ----------------------------
  // الدقي
  // ----------------------------
  dokki: [
    {
      id: "dokki-shaimaa-ouda",
      slug: "dr-shaimaa-ouda-dokki",
      name: { ar: "د. شيماء عودة", en: "Dr. Shaimaa Ouda" },
      specialty: { ar: "استشاري جلدية", en: "Dermatology Consultant" },
      bio: {
        ar: "استشاري جلدية تهتم بعلاج مشاكل البشرة والشعر بخطة مبنية على تشخيص واضح.",
        en: "Dermatology consultant focused on skin and hair concerns with clear diagnosis-driven plans.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: { ar: "السبت • الأحد • الأربعاء", en: "Sat • Sun • Wed" },
      branchId: "dokki",
    },
    {
      id: "dokki-angie-mansour",
      slug: "dr-angie-mansour-dokki",
      name: { ar: "د. إنجي منصور", en: "Dr. Angie Mansour" },
      specialty: { ar: "استشاري جلدية", en: "Dermatology Consultant" },
      bio: {
        ar: "استشارية جلدية بخبرة في وضع خطط علاج متقدمة ومتابعة التحسن.",
        en: "Dermatology consultant experienced in advanced plans and progress follow-up.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: { ar: "الإثنين • الخميس", en: "Mon • Thu" },
      branchId: "dokki",
    },
    {
      id: "dokki-ahmed-hany",
      slug: "dr-ahmed-hany-dokki",
      name: { ar: "د. أحمد هاني", en: "Dr. Ahmed Hany" },
      specialty: { ar: "أخصائي جلدية", en: "Dermatology Specialist" },
      bio: {
        ar: "أخصائي جلدية يقدم حلولًا علاجية متقدمة لمشكلات البشرة مع متابعة دقيقة.",
        en: "Dermatology specialist offering advanced treatment options with attentive follow-up.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: { ar: "الثلاثاء", en: "Tuesday" },
      branchId: "dokki",
    },
  ],

  // ----------------------------
  // المنصورة
  // ----------------------------
  mansoura: [
    {
      id: "mansoura-yomna-abbas",
      slug: "dr-yomna-abbas-mansoura",
      name: { ar: "د. يمنى عباس", en: "Dr. Yomna Abbas" },
      specialty: { ar: "أخصائي جلدية", en: "Dermatology Specialist" },
      bio: {
        ar: "أخصائية جلدية بخطة علاج واضحة ومتابعة دقيقة لتحسين النتائج.",
        en: "Dermatology specialist with clear plans and attentive follow-up for better outcomes.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: { ar: "السبت • الأحد • الإثنين", en: "Sat • Sun • Mon" },
      branchId: "mansoura",
    },
    {
      id: "mansoura-hadeer-elarabawy",
      slug: "dr-hadeer-elarabawy-mansoura",
      name: { ar: "د. هدير العرباوي", en: "Dr. Hadeer El Arabawy" },
      specialty: { ar: "أخصائي جلدية", en: "Dermatology Specialist" },
      bio: {
        ar: "أخصائية جلدية تهتم بعلاج مشاكل البشرة وخطط العناية المستمرة.",
        en: "Dermatology specialist focused on skin concerns and ongoing care routines.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: { ar: "الخميس", en: "Thursday" },
      branchId: "mansoura",
    },
    {
      id: "mansoura-asmaa-khater",
      slug: "dr-asmaa-khater-mansoura",
      name: { ar: "د. أسماء خاطر", en: "Dr. Asmaa Khater" },
      specialty: { ar: "أخصائي جلدية", en: "Dermatology Specialist" },
      bio: {
        ar: "أخصائية جلدية تقدم تشخيصًا دقيقًا وخطة علاج مناسبة لكل حالة.",
        en: "Dermatology specialist providing accurate diagnosis and tailored treatment plans.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: { ar: "الثلاثاء", en: "Tuesday" },
      branchId: "mansoura",
    },
    {
      id: "mansoura-ghaidaa-ayman",
      slug: "dr-ghaidaa-ayman-mansoura",
      name: { ar: "د. غيداء أيمن", en: "Dr. Ghaidaa Ayman" },
      specialty: { ar: "أخصائي جراحة تجميل", en: "Plastic Surgery Specialist" },
      bio: {
        ar: "أخصائية جراحة تجميل تهتم بالنتائج الطبيعية وخطط علاج مدروسة.",
        en: "Plastic surgery specialist focused on natural results and well-planned treatment journeys.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: { ar: "الأربعاء", en: "Wednesday" },
      branchId: "mansoura",
    },
    {
      id: "mansoura-mohamed-adel",
      slug: "dr-mohamed-adel-mansoura",
      name: { ar: "د. محمد عادل", en: "Dr. Mohamed Adel" },
      specialty: { ar: "أخصائي جراحة تجميل", en: "Plastic Surgery Specialist" },
      bio: {
        ar: "أخصائي جراحة تجميل بخطط علاج دقيقة لتحقيق أفضل نتيجة.",
        en: "Plastic surgery specialist with detailed plans to achieve the best outcome.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: { ar: "الأحد", en: "Sunday" },
      branchId: "mansoura",
    },
  ],

  // ----------------------------
  // أكتوبر (جلدية)
  // ----------------------------
  october: [
    {
      id: "october-angie-mansour",
      slug: "dr-angie-mansour-october",
      name: { ar: "د. إنجي منصور", en: "Dr. Angie Mansour" },
      specialty: { ar: "استشاري جلدية", en: "Dermatology Consultant" },
      bio: {
        ar: "استشارية جلدية بخبرة في علاج مشكلات البشرة ووضع خطط متابعة واضحة لتحقيق أفضل النتائج.",
        en: "Dermatology consultant experienced in treating skin concerns with clear follow-up plans for best results.",
      },
      experience: { ar: "خبرة مميزة", en: "Experienced" },
      image: doctorPlaceholder,
      workingDays: { ar: "الأحد • الثلاثاء • الخميس", en: "Sun • Tue • Thu" },
      branchId: "october",
    },
  ],
};

// ==============================
// ✅ Flatten + Merge
// ==============================
const branchDoctorsFlat: DoctorBase[] = Object.values(doctorsByBranch).flat();
export const mergedDoctorsBase: DoctorBase[] = [...baseDoctors, ...branchDoctorsFlat];

// ✅ final doctors will be generated in index.ts after services exist
export const ALL_DOCTOR_IDS = mergedDoctorsBase.map((d) => d.id);