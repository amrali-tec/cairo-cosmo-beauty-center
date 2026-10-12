// src/components/PageHeader.tsx
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLocaleParam } from "@/lib/use-locale-param";
import { siteConfig } from "@/lib/i18n";
import {
  ArrowLeft,
  ArrowRight,
  Facebook,
  Instagram,
  Youtube,
  Sparkles,
} from "lucide-react";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M21 8.1c-1.2 0-2.4-.4-3.4-1.1-1-.7-1.8-1.7-2.3-2.9v10.7c0 2.9-2.3 5.2-5.2 5.2S4.9 17.7 4.9 14.8s2.3-5.2 5.2-5.2c.3 0 .7 0 1 .1v2.8c-.3-.1-.6-.2-1-.2-1.4 0-2.6 1.2-2.6 2.6s1.2 2.6 2.6 2.6 2.6-1.2 2.6-2.6V3h2.9c.4 1.3 1.1 2.4 2.1 3.3 1 .9 2.2 1.4 3.5 1.5v2.3z" />
  </svg>
);

type CTA = {
  label: { ar: string; en: string };
  href: string;
  variant?: "primary" | "outline";
  external?: boolean;
};

type SocialLinks = {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
};

type PageHeaderProps = {
  title: { ar: string; en: string };
  description?: { ar: string; en: string };

  // Breadcrumb/back
  backTo?: string; // e.g. `/${locale}/blog`
  backLabel?: { ar: string; en: string };

  // Right side slot (filters etc.)
  rightSlot?: ReactNode;

  // CTA block
  ctas?: CTA[];
  showCtas?: boolean;

  // Social block
  showSocial?: boolean;
  socialLinks?: SocialLinks;

  className?: string;
};

export function PageHeader({
  title,
  description,
  backTo,
  backLabel,
  rightSlot,
  ctas,
  showCtas = true,
  showSocial = true,
  socialLinks,
  className,
}: PageHeaderProps) {
  const locale = useLocaleParam();
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const tTitle = locale === "ar" ? title.ar : title.en;
  const tDesc = description
    ? locale === "ar"
      ? description.ar
      : description.en
    : "";

  const socials = socialLinks ?? (siteConfig as any)?.socialLinks;

  const hasSocial =
    !!socials &&
    (socials.facebook ||
      socials.instagram ||
      socials.youtube ||
      socials.tiktok);

  const fallbackBackLabel = backLabel ?? {
    ar: "رجوع",
    en: "Back",
  };

  const defaultCtas: CTA[] = [
    {
      label: { ar: "احجز الآن", en: "Book now" },
      href: `/${locale}/book`,
      variant: "primary",
    },
    {
      label: { ar: "تواصل واتساب", en: "WhatsApp" },
      href: siteConfig.getWhatsAppUrl(locale),
      variant: "outline",
      external: true,
    },
  ];

  const finalCtas = ctas?.length ? ctas : defaultCtas;

  return (
    <div className={cn("mb-8", className)} dir={isRTL ? "rtl" : "ltr"}>
      {/* Top row: title/desc + rightSlot */}
      <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-[linear-gradient(135deg,hsl(var(--card)),hsl(var(--muted)/0.55))] p-6 shadow-[0_20px_60px_hsl(var(--primary)/0.06)] md:p-8">
        <div className="pointer-events-none absolute inset-y-0 end-0 w-1/2 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.08),transparent_55%)]" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          {backTo ? (
            <Link
              to={backTo}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowIcon className="h-4 w-4" />
              <span>
                {locale === "ar" ? fallbackBackLabel.ar : fallbackBackLabel.en}
              </span>
            </Link>
          ) : null}

          <div className={cn(backTo ? "mt-3" : "")}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{locale === "ar" ? "Luxury clean" : "Luxury clean"}</span>
            </div>

            <h1 className="mt-3 text-3xl md:text-4xl font-bold text-foreground">
              {tTitle}
            </h1>

            {tDesc ? (
              <p className="mt-2 text-muted-foreground max-w-2xl leading-relaxed">
                {tDesc}
              </p>
            ) : null}
          </div>
        </div>

        {rightSlot ? (
          <div className="w-full md:w-[320px]">{rightSlot}</div>
        ) : null}
        </div>
      </div>

      {/* CTA + Social card */}
      {(showCtas || (showSocial && hasSocial)) && (
        <div className="mt-6 rounded-[2rem] border border-primary/10 bg-card/90 p-5 shadow-sm">
          {showCtas ? (
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-muted-foreground leading-relaxed">
                {locale === "ar"
                  ? "جاهز تبدأ؟ احجز استشارة، أو تواصل واتساب، أو استكشف الخيارات المناسبة."
                  : "Ready to start? Book a consultation, chat on WhatsApp, or explore your options."}
              </div>

              <div className="flex flex-wrap gap-2">
                {finalCtas.map((c) => {
                  const label = locale === "ar" ? c.label.ar : c.label.en;
                  const base =
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors";
                  const styles =
                    c.variant === "primary"
                      ? "bg-primary text-primary-foreground hover:opacity-95"
                      : "border hover:bg-muted/30";

                  if (c.external) {
                    return (
                      <a
                        key={label}
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(base, styles)}
                      >
                        {label}
                      </a>
                    );
                  }

                  return (
                    <Link key={label} to={c.href} className={cn(base, styles)}>
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}

          {showSocial && hasSocial ? (
            <div className={cn(showCtas ? "mt-4 pt-4 border-t" : "")}>
              <div className="text-sm font-medium mb-2">
                {locale === "ar" ? "تابعنا على" : "Follow us"}
              </div>

              <div className="flex flex-wrap gap-2">
                {socials.facebook ? (
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm hover:bg-muted/30 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook
                      className="h-4 w-4 text-primary"
                      strokeWidth={1.8}
                    />
                    <span>Facebook</span>
                  </a>
                ) : null}

                {socials.instagram ? (
                  <a
                    href={socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm hover:bg-muted/30 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram
                      className="h-4 w-4 text-primary"
                      strokeWidth={1.8}
                    />
                    <span>Instagram</span>
                  </a>
                ) : null}

                {socials.youtube ? (
                  <a
                    href={socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm hover:bg-muted/30 transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube
                      className="h-4 w-4 text-primary"
                      strokeWidth={1.8}
                    />
                    <span>YouTube</span>
                  </a>
                ) : null}

                {socials.tiktok ? (
                  <a
                    href={socials.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm hover:bg-muted/30 transition-colors"
                    aria-label="TikTok"
                  >
                    <TikTokIcon className="h-4 w-4 text-primary" />
                    <span className="font-semibold">TikTok</span>
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
