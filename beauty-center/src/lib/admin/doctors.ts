import { doctors as defaultDoctors } from "@/lib/data";
import type { DoctorBase } from "@/lib/data/types";

export type AdminDoctorStatus = "draft" | "published";

export type AdminDoctor = DoctorBase & {
  status: AdminDoctorStatus;
};

const STORAGE_KEY = "admin_doctors_v1";

export function getAllAdminDoctors(): AdminDoctor[] {
  if (typeof window === "undefined") {
    return defaultDoctors.map((d) => ({ ...d, status: "published" as const }));
  }
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
    }
  }
  const initial = defaultDoctors.map((d) => ({ ...d, status: "published" as const }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

export function saveAllAdminDoctors(doctors: AdminDoctor[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
}

export function getPublishedAdminDoctors(): AdminDoctor[] {
  return getAllAdminDoctors().filter((doctor) => doctor.status === "published");
}