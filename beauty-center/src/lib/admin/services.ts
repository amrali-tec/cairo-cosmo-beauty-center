import { services as defaultServices } from "@/lib/data";
import type { ServiceBase } from "@/lib/data/types";

export type AdminServiceStatus = "draft" | "published";

export type AdminService = ServiceBase & {
  status: AdminServiceStatus;
};

const STORAGE_KEY = "admin_services_v1";

export function getAllAdminServices(): AdminService[] {
  if (typeof window === "undefined") {
    return defaultServices.map((s) => ({ ...s, status: "published" as const }));
  }
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
    }
  }
  const initial = defaultServices.map((s) => ({ ...s, status: "published" as const }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

export function saveAllAdminServices(services: AdminService[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
}

export function getPublishedAdminServices(): AdminService[] {
  return getAllAdminServices().filter((service) => service.status === "published");
}