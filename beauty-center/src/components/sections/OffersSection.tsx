// src/components/sections/OffersSection.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { offers, offerCategories, type OfferCategory } from "@/lib/offers";
import { useLocale } from "@/lib/locale-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { OfferCard } from "@/components/offers/OfferCard";
import {
  OffersFilters,
  type OffersStatusFilter,
} from "@/components/offers/OffersFilters";
import { isOfferExpired } from "@/components/offers/offer-utils";

export function OffersSection({
  limit,
  showFilters = true,
  showViewAll = true,
}: {
  limit?: number; // مثال: 6 للهوم
  showFilters?: boolean;
  showViewAll?: boolean;
}) {
  const { locale, t, translations, isRTL } = useLocale();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [category, setCategory] = useState<OfferCategory>("all");
  const [status, setStatus] = useState<OffersStatusFilter>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    const list = offers
      .slice()
      .sort((a, b) => {
        // الساري فوق
        const ea = isOfferExpired(a) ? 1 : 0;
        const eb = isOfferExpired(b) ? 1 : 0;
        if (ea !== eb) return ea - eb;

        // featured فوق
        const fa = a.featured ? -1 : 0;
        const fb = b.featured ? -1 : 0;
        if (fa !== fb) return fa - fb;

        // الأحدث أولاً
        const da = a.validUntil ? new Date(a.validUntil).getTime() : 0;
        const db = b.validUntil ? new Date(b.validUntil).getTime() : 0;
        return db - da;
      })
      .filter((o) => (category === "all" ? true : o.category === category))
      .filter((o) => {
        if (status === "all") return true;
        const exp = isOfferExpired(o);
        return status === "expired" ? exp : !exp;
      })
      .filter((o) => {
        if (!query) return true;
        const t = (locale === "ar" ? o.title.ar : o.title.en).toLowerCase();
        const s = (
          locale === "ar" ? o.subtitle.ar : o.subtitle.en
        ).toLowerCase();
        const d = (
          locale === "ar" ? o.description.ar : o.description.en
        ).toLowerCase();
        return [t, s, d].some((x) => x.includes(query));
      });

    return typeof limit === "number" ? list.slice(0, limit) : list;
  }, [category, status, q, locale, limit]);

  return (
    <section className="py-16 md:py-24 bg-card" dir={isRTL ? "rtl" : "ltr"}>
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {locale === "ar" ? "العروض" : "Offers"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {locale === "ar"
              ? "اختر التصنيف وفلتر الساري والمنتهي بسهولة."
              : "Pick a category and filter active vs expired easily."}
          </p>
        </div>

        {showFilters ? (
          <OffersFilters
            locale={locale}
            category={category}
            setCategory={setCategory}
            status={status}
            setStatus={setStatus}
            q={q}
            setQ={setQ}
            categories={offerCategories}
            resultsCount={filtered.length}
            onReset={() => {
              setCategory("all");
              setStatus("all");
              setQ("");
            }}
          />
        ) : null}

        {/* Grid */}
        <div
          className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6")}
        >
          {filtered.map((o) => (
            <OfferCard key={o.id} offer={o} locale={locale} />
          ))}
        </div>

        {showViewAll ? (
          <div className="text-center mt-10">
            <Button variant="outline" size="lg" asChild>
              <Link to={`/${locale}/offers`} className="gap-2">
                {locale === "ar" ? "عرض كل العروض" : "View all offers"}
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
