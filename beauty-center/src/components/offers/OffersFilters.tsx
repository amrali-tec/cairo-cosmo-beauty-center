// src/components/offers/OffersFilters.tsx
import { Button } from "@/components/ui/button";
import { getTranslation } from "@/lib/i18n";
import type { OfferCategory } from "@/lib/offers";

export type OffersStatusFilter = "all" | "active" | "expired";

export function OffersFilters({
  locale,
  category,
  setCategory,
  status,
  setStatus,
  q,
  setQ,
  categories,
  resultsCount,
  onReset,
}: {
  locale: "ar" | "en";
  category: OfferCategory;
  setCategory: (v: OfferCategory) => void;
  status: OffersStatusFilter;
  setStatus: (v: OffersStatusFilter) => void;
  q: string;
  setQ: (v: string) => void;
  categories: { id: OfferCategory; label: { ar: string; en: string } }[];
  resultsCount: number;
  onReset: () => void;
}) {
  return (
    <div className="mb-8 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
      <div className="rounded-3xl border bg-card p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={
              locale === "ar" ? "ابحث في العروض..." : "Search offers..."
            }
            className="h-11 w-full md:flex-1 rounded-2xl border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />

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

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as OfferCategory)}
            className="h-11 rounded-2xl border bg-background px-3 text-sm"
          >
            {categories.map((c) => (
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
            ? `المعروض: ${resultsCount} عرض`
            : `Showing: ${resultsCount} offers`}
        </div>
        <Button variant="outline" size="sm" onClick={onReset}>
          {locale === "ar" ? "إعادة ضبط" : "Reset"}
        </Button>
      </div>
    </div>
  );
}
