// src/components/offers/OfferCard.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTranslation } from "@/lib/i18n";
import type { Offer } from "@/lib/offers";
import { formatExpiryNoYear, isOfferExpired } from "./offer-utils";

export function OfferCard({
  offer,
  locale,
  showBookButton = true,
}: {
  offer: Offer;
  locale: "ar" | "en";
  showBookButton?: boolean;
}) {
  const expired = isOfferExpired(offer);
  const title = getTranslation(offer.title, locale);
  const subtitle = getTranslation(offer.subtitle, locale);
  const desc = getTranslation(offer.description, locale);

  return (
    <div
      className={cn(
        "rounded-3xl border bg-card p-6 transition hover:shadow-sm",
        expired && "opacity-70 grayscale border-dashed",
      )}
    >
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
          {offer.discountLabel ? (
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
                expired
                  ? "bg-background text-muted-foreground"
                  : "bg-primary/10 text-primary border-primary/20",
              )}
            >
              {getTranslation(offer.discountLabel, locale)}
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

      <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-4">
        {desc}
      </p>

      {offer.includes?.length ? (
        <ul className="mt-4 space-y-2 text-sm">
          {offer.includes.slice(0, 3).map((it, idx) => (
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

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          {offer.validUntil ? (
            <>
              {locale === "ar" ? "تاريخ الانتهاء: " : "Expires: "}
              <span className="text-foreground font-medium">
                {formatExpiryNoYear(offer.validUntil, locale)}
              </span>
            </>
          ) : null}
        </div>

        {showBookButton ? (
          <Button variant={expired ? "outline" : "default"} size="sm" asChild>
            <a href={`/${locale}/booking`}>
              {locale === "ar" ? "احجز" : "Book"}
            </a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
