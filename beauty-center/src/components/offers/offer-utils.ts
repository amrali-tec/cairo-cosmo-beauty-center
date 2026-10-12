// src/components/offers/offer-utils.ts
import type { Offer } from "@/lib/offers";

export const OFFERS_NOW = new Date("2026-02-01T00:00:00Z"); // ثابت حسب طلبك

export function isOfferExpired(offer: Offer, now: Date = OFFERS_NOW) {
  if (!offer.validUntil) return false;
  const d = new Date(`${offer.validUntil}T23:59:59Z`);
  return d.getTime() < now.getTime();
}

export function formatExpiryNoYear(iso: string, locale: "ar" | "en") {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;

  return d.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    day: "2-digit",
    month: "long",
  });
}
