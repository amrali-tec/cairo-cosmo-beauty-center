import { offers as defaultOffers, type Offer } from "@/lib/offers";

export type AdminOfferStatus = "draft" | "published";

export type AdminOffer = Offer & {
  status: AdminOfferStatus;
};

const STORAGE_KEY = "admin_offers_v1";

export function getAllAdminOffers(): AdminOffer[] {
  if (typeof window === "undefined") {
    return defaultOffers.map((o) => ({ ...o, status: "published" }));
  }
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
    }
  }
  const initial = defaultOffers.map((o) => ({ ...o, status: "published" as const }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

export function saveAllAdminOffers(offers: AdminOffer[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(offers));
}

export function getPublishedAdminOffers(): AdminOffer[] {
  return getAllAdminOffers().filter((offer) => offer.status === "published");
}
