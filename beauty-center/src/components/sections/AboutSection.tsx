// src/components/sections/about/AboutBlocks.tsx
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useLocaleParam } from "@/lib/use-locale-param";
import { getTranslation, siteConfig } from "@/lib/i18n";
import { doctors, services, branches } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Building2,
  CheckCircle2,
} from "lucide-react";

type BaseProps = { className?: string };

function useArrow() {
  const locale = useLocaleParam();
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  return { locale, isRTL, ArrowIcon };
}

/** 1) Intro صغير (للهوم) */
export function AboutIntroMini({
  className,
  showReadMore = true,
}: BaseProps & { showReadMore?: boolean }) {
  const { locale, ArrowIcon } = useArrow();

  const title = locale === "ar" ? "نبذة عن المركز" : "About the center";
  const desc =
    locale === "ar"
      ? "رفاهية طبية معناها خطة واضحة، أمان، ونتيجة طبيعية تناسب ملامح كل حالة. نبدأ بالتقييم ثم خطة دقيقة ثم متابعة."
      : "Luxury in medical care means clarity: a precise plan, safety, and natural outcomes tailored to each case.";

  return (
    <div className={cn("rounded-3xl border bg-card p-6 md:p-8", className)}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div className="min-w-0">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {title}
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed max-w-2xl">
            {desc}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to={`/${locale}/services`}
              className="px-3 py-2 rounded-full border text-sm hover:bg-muted/30"
            >
              {locale === "ar" ? "استعرض الخدمات" : "Explore services"}
            </Link>
            <Link
              to={`/${locale}/doctors`}
              className="px-3 py-2 rounded-full border text-sm hover:bg-muted/30"
            >
              {locale === "ar" ? "تعرف على الأطباء" : "Meet doctors"}
            </Link>
            <Link
              to={`/${locale}/contact`}
              className="px-3 py-2 rounded-full border text-sm hover:bg-muted/30"
            >
              {locale === "ar" ? "طرق التواصل" : "Contact options"}
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="lg" asChild>
            <Link to={`/${locale}/booking`} className="gap-2">
              {locale === "ar" ? "احجز استشارة" : "Book consultation"}
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </Button>

          {showReadMore ? (
            <Button variant="outline" size="lg" asChild>
              <Link to={`/${locale}/about`} className="gap-2">
                {locale === "ar" ? "اقرأ المزيد" : "Learn more"}
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** 2) Value cards (4 كروت) */
export function AboutValueCards({ className }: BaseProps) {
  const { locale } = useArrow();

  const cards = useMemo(() => {
    return [
      {
        icon: ShieldCheck,
        title: locale === "ar" ? "معايير أمان" : "Safety standards",
        desc:
          locale === "ar"
            ? "بروتوكولات واضحة قبل/بعد الإجراء لتقليل المخاطر."
            : "Clear protocols before/after procedures to reduce risk.",
      },
      {
        icon: Stethoscope,
        title: locale === "ar" ? "تقييم طبي" : "Medical assessment",
        desc:
          locale === "ar"
            ? "نحدد الأنسب حسب نوع البشرة/الحالة والهدف."
            : "We choose what fits your skin/case and goal.",
      },
      {
        icon: Sparkles,
        title: locale === "ar" ? "نتائج طبيعية" : "Natural outcomes",
        desc:
          locale === "ar"
            ? "تحسين مدروس يحافظ على ملامحك."
            : "Thoughtful enhancement that keeps your features.",
      },
      {
        icon: Building2,
        title: locale === "ar" ? "تنظيم ومتابعة" : "Scheduling & follow-up",
        desc:
          locale === "ar"
            ? "خطة واضحة ومتابعة لتجربة أسهل."
            : "A clear plan and follow-up for a smoother journey.",
      },
    ];
  }, [locale]);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
        className,
      )}
    >
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.title} className="rounded-3xl border bg-card p-5">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl border bg-background/60 grid place-items-center text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="font-semibold text-foreground">{c.title}</div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {c.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/** 3) WhyUs compact list */
export function AboutWhyUs({ className }: BaseProps) {
  const { locale } = useArrow();

  const points =
    locale === "ar"
      ? [
          "فريق متخصص في التجميل والليزر",
          "خطة واضحة قبل وبعد الجلسة",
          "تركيز على نتائج طبيعية بدون مبالغة",
          "متابعة وتقييم بعد الجلسات",
        ]
      : [
          "Specialized doctors for aesthetics & laser",
          "Clear plan before and after sessions",
          "Natural results without overdoing it",
          "Follow-up after sessions",
        ];

  return (
    <div className={cn("rounded-3xl border bg-card p-6 md:p-8", className)}>
      <h3 className="text-xl font-semibold text-foreground">
        {locale === "ar" ? "لماذا نحن؟" : "Why us?"}
      </h3>

      <div className="mt-4 space-y-3">
        {points.map((p) => (
          <div key={p} className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground leading-relaxed">
              {p}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 4) Services chips (اختيار عدد) */
export function AboutServicesChips({
  className,
  limit = 10,
  showAllLink = true,
}: BaseProps & { limit?: number; showAllLink?: boolean }) {
  const { locale, ArrowIcon } = useArrow();
  const top = useMemo(() => services.slice(0, limit), [limit]);

  return (
    <div className={cn("rounded-3xl border bg-card p-6 md:p-8", className)}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-xl font-semibold text-foreground">
          {locale === "ar" ? "خدمات قد تهمك" : "Services you may like"}
        </h3>
        {showAllLink ? (
          <Link
            to={`/${locale}/services`}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
          >
            {locale === "ar" ? "كل الخدمات" : "All services"}
            <ArrowIcon className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {top.map((s) => (
          <Link
            key={s.id}
            to={`/${locale}/services/${s.slug}`}
            className="px-3 py-2 rounded-full border text-sm hover:bg-muted/30"
          >
            {getTranslation(s.title, locale)}
          </Link>
        ))}
      </div>
    </div>
  );
}

/** 5) Doctors preview (اختيار عدد) */
export function AboutDoctorsPreview({
  className,
  limit = 6,
  showAllLink = true,
}: BaseProps & { limit?: number; showAllLink?: boolean }) {
  const { locale, ArrowIcon } = useArrow();
  const top = useMemo(() => doctors.slice(0, limit), [limit]);

  return (
    <div className={cn("rounded-3xl border bg-card p-6 md:p-8", className)}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-xl font-semibold text-foreground">
          {locale === "ar" ? "فريق الأطباء" : "Our doctors"}
        </h3>
        {showAllLink ? (
          <Link
            to={`/${locale}/doctors`}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
          >
            {locale === "ar" ? "عرض كل الأطباء" : "View all doctors"}
            <ArrowIcon className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {top.map((d) => (
          <Link
            key={d.id}
            to={`/${locale}/doctors/${d.slug}`}
            className="rounded-2xl border p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="font-semibold text-foreground">
              {getTranslation(d.name, locale)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {getTranslation(d.specialty, locale)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** 6) CTA صغير */
export function AboutCtaBar({ className }: BaseProps) {
  const { locale, ArrowIcon } = useArrow();

  return (
    <div
      className={cn(
        "rounded-3xl border bg-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4",
        className,
      )}
    >
      <div>
        <div className="text-xl font-semibold text-foreground">
          {locale === "ar" ? "جاهز تبدأ؟" : "Ready to start?"}
        </div>
        <div className="text-sm text-muted-foreground mt-1 leading-relaxed">
          {locale === "ar"
            ? "احجز استشارتك الآن لتحديد الخطة الأنسب لحالتك."
            : "Book a consultation to define the best plan for your case."}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="lg" asChild>
          <Link to={`/${locale}/booking`} className="gap-2">
            {locale === "ar" ? "احجز استشارة" : "Book consultation"}
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </Button>

        <Button variant="outline" size="lg" asChild>
          <a
            href={siteConfig.getWhatsAppUrl(locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2"
          >
            <Phone className="h-4 w-4" />
            {locale === "ar" ? "واتساب" : "WhatsApp"}
          </a>
        </Button>
      </div>
    </div>
  );
}
