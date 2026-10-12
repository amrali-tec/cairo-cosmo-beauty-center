import { MapPin, ExternalLink } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { branches } from "@/lib/data";
import { getTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const BranchesSection = () => {
  const { locale, t, translations, dir } = useLocale();

  return (
    <section className="py-16 md:py-24 bg-card" dir={dir}>
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t(translations.common.ourBranches)}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {locale === "ar"
              ? "فروعنا مصممة لتقديم تجربة طبية راقية بمعايير أمان وراحة عالية"
              : "Our branches are designed to deliver a refined medical experience with comfort and safety"}
          </p>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => {
            const title = getTranslation(branch.title, locale);
            const address = getTranslation(branch.address, locale);

            const directUrl =
              (branch as any).mapUrl || (branch as any).googleMapsUrl || "";

            const query = encodeURIComponent(
              [title, address, "Cairo", "Egypt"].join(" - "),
            );

            const mapsUrl =
              directUrl && directUrl.length
                ? directUrl
                : `https://www.google.com/maps/search/?api=1&query=${query}`;

            return (
              <div
                key={branch.id}
                className={cn(
                  "group relative rounded-3xl border bg-background/70 p-6",
                  "backdrop-blur-xl transition-all duration-500",
                  "hover:-translate-y-1 hover:shadow-xl hover:border-primary/30",
                )}
              >
                {/* Glow */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition">
                  <div className="absolute inset-0 rounded-3xl bg-primary/5 blur-2xl" />
                </div>

                {/* Icon */}
                <div className="relative z-10 flex items-start gap-4">
                  <div className="shrink-0 h-12 w-12 rounded-2xl grid place-items-center bg-primary/10 text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground text-lg mb-1">
                      {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {address}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 mt-5 flex justify-end">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-2 text-sm font-medium",
                      "px-4 py-2 rounded-full border",
                      "text-primary border-primary/20",
                      "hover:bg-primary hover:text-primary-foreground",
                      "transition-all",
                    )}
                    aria-label={
                      locale === "ar"
                        ? `افتح ${title} على خرائط جوجل`
                        : `Open ${title} on Google Maps`
                    }
                  >
                    {locale === "ar" ? "الموقع على الخريطة" : "View on map"}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
