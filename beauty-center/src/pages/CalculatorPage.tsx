// ===============================================
// src/pages/CalculatorPage.tsx
// صفحة حاسبة تكلفة وباقات التجميل
// ===============================================

import { useLocale } from "@/lib/locale-context";
import { siteConfig } from "@/lib/i18n";
import { useSeo } from "@/hooks/useSeo";
import { TreatmentCalculator } from "@/components/calculator/TreatmentCalculator";
import { Sparkles, ShieldCheck, Award, HeartHandshake } from "lucide-react";

export default function CalculatorPage() {
  const { locale } = useLocale();
  const canonical = `${siteConfig.url}/${locale}/calculator`;

  useSeo({
    title: locale === "ar" ? "مصمم باقات التجميل المخصصة" : "Custom Treatment & Bundle Builder",
    description:
      locale === "ar"
        ? "صممي باقتكِ العلاجية المخصصة لليزر والفيلر والبوتوكس والعناية بالبشرة واحصلي على عرض سعر وخصم حصري عبر الواتساب والإيميل."
        : "Design your personalized laser, filler, and skincare bundle to receive an exclusive custom quote via WhatsApp and Email.",
    canonical,
  });

  return (
    <div className="py-12 md:py-20">
      <div className="section-container space-y-12">
        <TreatmentCalculator />

        {/* Feature Guarantees */}
        <div className="grid gap-6 md:grid-cols-3 pt-8 border-t border-border/60">
          <div className="rounded-3xl border border-border/70 bg-card p-6 space-y-2 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-base text-foreground">
              {locale === "ar" ? "ضمان الأجهزة الأصلية" : "Genuine Technology Guarantee"}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {locale === "ar"
                ? "نستخدم فقط أجهزة كانديلا وديكا وسينوشور وكاربوكسي المعتمدة دولياً من الـ FDA."
                : "We exclusively operate authentic FDA-cleared Candela, DEKA, and Cynosure systems."}
            </p>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-6 space-y-2 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Award className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-base text-foreground">
              {locale === "ar" ? "إشراف استشاريين معتمدين" : "Board-Certified Specialists"}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {locale === "ar"
                ? "تُجرى جميع جلسات الحقن والليزر تحت إشراف نخبة من أساتذة واستشاريي الجلدية والتجميل."
                : "All injectable and laser treatments are administered by certified dermatologists."}
            </p>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-6 space-y-2 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-base text-foreground">
              {locale === "ar" ? "تسهيلات الدفع والتقسيط" : "Flexible Payment Options"}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {locale === "ar"
                ? "إمكانية تقسيط الباقات الكبيرة حتى 12 شهراً بدون فوائد لجميع عملاء المركز."
                : "Interest-free installment plans up to 12 months for comprehensive treatment packages."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
