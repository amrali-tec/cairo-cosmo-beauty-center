// src/lib/data/types.ts
import type { TranslatedString } from "@/lib/i18n";

export type ServiceCategory =
  | "surgery"
  | "body"
  | "injectables"
  | "laser"
  | "skin"
  | "threads"
  | "hair"
  | "wellness";

export const serviceCategoryLabels = {
  surgery: { ar: "جراحات التجميل", en: "Aesthetic Surgery" },
  body: { ar: "نحت القوام", en: "Body Contouring" },
  injectables: { ar: "الحقن التجميلية", en: "Injectables" },
  laser: { ar: "الليزر", en: "Laser" },
  skin: { ar: "البشرة والعناية", en: "Skin Care" },
  threads: { ar: "الخيوط الطبية", en: "Threads" },
  hair: { ar: "الشعر", en: "Hair" },
  wellness: { ar: "الصحة والتغذية", en: "Health & Wellness" },
} as const satisfies Record<ServiceCategory, TranslatedString>;

export interface ServiceFAQ {
  question: TranslatedString;
  answer: TranslatedString;
}

export interface Branch {
  id: string;
  title: TranslatedString;
  address: TranslatedString;
  mapUrl: string;
  phone?: string;
}

export interface Doctor {
  id: string;
  slug: string;
  name: TranslatedString;
  specialty: TranslatedString;
  bio: TranslatedString;
  experience: TranslatedString;
  image: string;
  workingDays: TranslatedString;
  serviceIds: string[];
  branchId?: Branch["id"];
  socialLinks?: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    tiktok?: string;
    website?: string;
  };
}

export interface LocalizedList {
  ar: string[];
  en: string[];
}

// ==============================
// ✅ Before & After
// ==============================
export interface BeforeAfterItem {
  serviceId: string;
  beforeImage: string;
  afterImage: string;
}

export interface Service {
  id: string;
  slug: string;
  category: ServiceCategory;

  title: TranslatedString;
  shortDescription: TranslatedString;
  description: TranslatedString;

  highlights?: LocalizedList;
  idealFor?: LocalizedList;
  steps?: LocalizedList;
  aftercare?: LocalizedList;

  duration?: TranslatedString;
  recovery?: TranslatedString;
  results?: TranslatedString;

  seo?: {
    title: TranslatedString;
    description: TranslatedString;
    keywords?: { ar: string[]; en: string[] };
  };

  image: string;
  faqs: ServiceFAQ[];

  beforeAfter?: BeforeAfterItem[];

  doctorIds: string[];
  featured?: boolean;
}

export type DoctorBase = Omit<Doctor, "serviceIds"> & { serviceIds?: string[] };
export type ServiceBase = Omit<Service, "doctorIds"> & { doctorIds?: string[] };