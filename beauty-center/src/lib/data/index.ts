// src/lib/data/index.ts

// 1) Export types/consts first (بوابة واحدة)
export * from "./types";
export * from "./faqs";
export { branches } from "./branches";

// ✅ لازم نعمل export للـ labels كـ value
export { serviceCategoryLabels } from "./types";

// 2) Import needed types (type-only)
import type { Doctor, Service, ServiceCategory } from "./types";

// 3) Import raw base data
import { mergedDoctorsBase } from "./doctors";
import { mergedServicesBase } from "./services";

// ==============================
// ✅ Auto-linking (ALL ↔ ALL) + Override support
// ==============================
const ALL_DOCTOR_IDS = mergedDoctorsBase.map((d) => d.id);
const ALL_SERVICE_IDS = mergedServicesBase.map((s) => s.id);

export const doctors: Doctor[] = mergedDoctorsBase.map((d) => ({
  ...d,
  serviceIds: d.serviceIds?.length ? d.serviceIds : ALL_SERVICE_IDS,
}));

export const services: Service[] = mergedServicesBase.map((s) => ({
  ...s,
  doctorIds: s.doctorIds?.length ? s.doctorIds : ALL_DOCTOR_IDS,
}));

// ==============================
// Helpers
// ==============================
export const getDoctorsForService = (serviceId: string): Doctor[] => {
  const service = services.find((s) => s.id === serviceId);
  if (!service) return [];
  return doctors.filter((d) => service.doctorIds.includes(d.id));
};

export const getServicesForDoctor = (doctorId: string): Service[] => {
  const doctor = doctors.find((d) => d.id === doctorId);
  if (!doctor) return [];
  return services.filter((s) => doctor.serviceIds.includes(s.id));
};

export const getDoctorBySlug = (slug: string) =>
  doctors.find((d) => d.slug === slug);

export const getServiceBySlug = (slug: string) =>
  services.find((s) => s.slug === slug);

// ==============================
// Grouping for Services Page
// ==============================
export const groupServicesByCategory = () => {
  const groups: Record<ServiceCategory, Service[]> = {
    surgery: [],
    body: [],
    injectables: [],
    laser: [],
    skin: [],
    threads: [],
    hair: [],
    wellness: [],
  };

  services.forEach((s) => groups[s.category].push(s));
  return groups;
};

export const getServicesByCategory = (category: ServiceCategory) =>
  services.filter((s) => s.category === category);
