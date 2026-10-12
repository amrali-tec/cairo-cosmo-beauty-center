// src/pages/OffersPage.tsx
import { useMemo, useState } from "react";
import {
  offers,
  offerCategories,
  type OfferCategory,
  type Offer,
} from "@/lib/offers";
import { getTranslation } from "@/lib/i18n";
import { useLocaleParam } from "@/lib/use-locale-param";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";
import { siteConfig } from "@/lib/i18n";

import { getPublishedAdminOffers } from "@/lib/admin/offers";

type StatusFilter = "all" | "active" | "expired";

// احنا في 01-02-2026 (ثابت حسب طلبك)
const NOW = new Date("2026-02-01T00:00:00Z");

function isExpired(offer: Offer) {
  if (!offer.validUntil) return false;
  const d = new Date(`${offer.validUntil}T23:59:59Z`);
  return d.getTime() < NOW.getTime();
}

function formatExpiry(iso: string, locale: "ar" | "en") {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;

  // ✅ يوم + شهر فقط (بدون سنة)
  return d.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    day: "2-digit",
    month: "long",
  });
}

export default function OffersPage() {
  const locale = useLocaleParam();
  const isRTL = locale === "ar";
  const canonical = `${siteConfig.url}/${locale}/offers`;

  useSeo({
    title: locale === "ar" ? "العروض" : "Offers",
    description:
      locale === "ar"
        ? "اكتشف أحدث عروض كايرو كوزمو سنتر على خدمات الليزر والبشرة والحقن التجميلية والاستشارات."
        : "Discover the latest Cairo Cosmo Center offers on laser, skincare, injectables, and consultations.",
    canonical,
    keywords:
      locale === "ar"
        ? "عروض التجميل, عروض الليزر, عروض البشرة"
        : "aesthetic offers, laser offers, skincare offers",
  });

  const [category, setCategory] = useState<OfferCategory>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [q, setQ] = useState("");

  const activeOffersList = useMemo(() => {
    const adminOffers = getPublishedAdminOffers();
    return adminOffers.length > 0 ? adminOffers : offers;
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return activeOffersList
      .slice()
      .sort((a, b) => {
        // ✅ الساري أولاً، المنتهي في الآخر
        const ea = isExpired(a) ? 1 : 0;
        const eb = isExpired(b) ? 1 : 0;
        if (ea !== eb) return ea - eb;

        // featured للأهم
        const fa = a.featured ? -1 : 0;
        const fb = b.featured ? -1 : 0;
        if (fa !== fb) return fa - fb;

        // الأحدث/الأقرب انتهاء (حسب validUntil)
        const da = a.validUntil ? new Date(a.validUntil).getTime() : 0;
        const db = b.validUntil ? new Date(b.validUntil).getTime() : 0;
        return db - da;
      })
      .filter((o) => (category === "all" ? true : o.category === category))
      .filter((o) => {
        if (status === "all") return true;
        const exp = isExpired(o);
        return status === "expired" ? exp : !exp;
      })
      .filter((o) => {
        if (!query) return true;
        const t = getTranslation(o.title, locale).toLowerCase();
        const s = getTranslation(o.subtitle, locale).toLowerCase();
        const d = getTranslation(o.description, locale).toLowerCase();
        return [t, s, d].some((x) => x.includes(query));
      });
  }, [category, status, q, locale]);

  return (
    <div className="section-container py-10" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          {locale === "ar" ? "العروض" : "Offers"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {locale === "ar"
            ? "اختَر التصنيف وفلتر الساري/المنتهي بسرعة."
            : "Filter by category and active/expired status."}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
        <div className="rounded-3xl border bg-card p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            {/* Search */}
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={
                locale === "ar" ? "ابحث في العروض..." : "Search offers..."
              }
              className="h-11 w-full md:flex-1 rounded-2xl border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />

            {/* Status */}
            <div className="flex items-center gap-2">
              <Button
                variant={status === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatus("all")}
              >
                {locale === "ar" ? "الكل" : "All"}
              </Button>
              <Button
                variant={status === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatus("active")}
              >
                {locale === "ar" ? "ساري" : "Active"}
              </Button>
              <Button
                variant={status === "expired" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatus("expired")}
              >
                {locale === "ar" ? "منتهي" : "Expired"}
              </Button>
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as OfferCategory)}
              className="h-11 rounded-2xl border bg-background px-3 text-sm"
            >
              {offerCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {getTranslation(c.label, locale)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-4 md:p-5 flex items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {locale === "ar"
              ? `المعروض: ${filtered.length} عرض`
              : `Showing: ${filtered.length} offers`}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCategory("all");
              setStatus("all");
              setQ("");
            }}
          >
            {locale === "ar" ? "إعادة ضبط" : "Reset"}
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((o) => {
          const expired = isExpired(o);
          const title = getTranslation(o.title, locale);
          const subtitle = getTranslation(o.subtitle, locale);
          const desc = getTranslation(o.description, locale);

          return (
            <div
              key={o.id}
              className={cn(
                "rounded-3xl border bg-card p-6 transition hover:shadow-sm",
                expired && "opacity-70 grayscale border-dashed",
              )}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-lg font-semibold text-foreground line-clamp-2">
                    {title}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {subtitle}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {o.discountLabel ? (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
                        expired
                          ? "bg-background text-muted-foreground"
                          : "bg-primary/10 text-primary border-primary/20",
                      )}
                    >
                      {getTranslation(o.discountLabel, locale)}
                    </span>
                  ) : null}

                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                      expired
                        ? "bg-background text-muted-foreground"
                        : "bg-background/60 text-foreground",
                    )}
                  >
                    {expired
                      ? locale === "ar"
                        ? "منتهي"
                        : "Expired"
                      : locale === "ar"
                        ? "ساري"
                        : "Active"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {desc}
              </p>

              {/* Includes */}
              {o.includes?.length ? (
                <ul className="mt-4 space-y-2 text-sm">
                  {o.includes.slice(0, 3).map((it, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-muted-foreground"
                    >
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span>{getTranslation(it, locale)}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  {o.validUntil ? (
                    <>
                      {locale === "ar" ? "تاريخ الانتهاء: " : "Expires: "}
                      <span className="text-foreground font-medium">
                        {formatExpiry(o.validUntil, locale)}
                      </span>
                    </>
                  ) : null}
                </div>

                <Button
                  variant={expired ? "outline" : "default"}
                  size="sm"
                  asChild
                >
                  <a href={`/${locale}/booking`}>
                    {locale === "ar" ? "احجز" : "Book"}
                  </a>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
