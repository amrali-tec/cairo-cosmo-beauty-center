// src/components/sections/ArticleBookingCta.tsx
import { Link } from "react-router-dom";
import { CalendarDays, ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export const ArticleBookingCta = ({ className }: Props) => {
  const { locale, isRTL } = useLocale();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className={cn("not-prose", className)}>
      <div className="rounded-3xl border bg-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <CalendarDays className="h-5 w-5" />
              <h3 className="text-xl md:text-2xl font-bold">
                {locale === "ar" ? "احجزي استشارة" : "Book a consultation"}
              </h3>
            </div>

            <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
              {locale === "ar"
                ? "لو حابة خطة جرعات ومناطق حقن مناسبة لوجهك، احجزي موعدك الآن وخلي الخطة تبقى محسوبة وهادية."
                : "Want a tailored plan for dosing and placement? Book your appointment for a precise, natural approach."}
            </p>
          </div>

          <Link
            to={`/${locale}/book`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-95 transition"
          >
            {locale === "ar" ? "احجزي موعد" : "Book now"}
            <Arrow className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
