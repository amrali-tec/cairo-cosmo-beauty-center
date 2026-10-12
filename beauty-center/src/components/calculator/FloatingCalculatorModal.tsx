// ===============================================
// src/components/calculator/FloatingCalculatorModal.tsx
// زر عائم ومودال منبثق لمصمم وحاسبة الباقات التجميلية المتجاوب مع كافة الشاشات
// ===============================================

import { useState, lazy, Suspense } from "react";
import { Calculator, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLocale } from "@/lib/locale-context";

// Lazy load heavy calculator component only when modal is opened
const TreatmentCalculator = lazy(() =>
  import("./TreatmentCalculator").then((m) => ({ default: m.TreatmentCalculator }))
);

export function FloatingCalculatorModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, isRTL } = useLocale();

  return (
    <>
      {/* Floating Calculator Trigger Button (Positioned safely above Sophia on all devices) */}
      <div className="fixed bottom-36 md:bottom-24 start-3 sm:start-6 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full p-0 bg-gradient-to-tr from-amber-500 via-rose-500 to-primary text-white border-2 border-white/40 shadow-[0_8px_30px_rgba(244,63,94,0.4)] hover:shadow-[0_12px_40px_rgba(244,63,94,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group backdrop-blur-md"
          title={locale === "ar" ? "مصمم وحاسبة الباقات التجميلية" : "Treatment & Bundle Calculator"}
        >
          <Calculator className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.3] group-hover:rotate-12 transition-transform drop-shadow-sm" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-80"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-gradient-to-tr from-amber-400 to-amber-500 text-white items-center justify-center shadow-xs border border-white/40">
              <Sparkles className="h-2.5 w-2.5 text-white" />
            </span>
          </span>
        </Button>
      </div>

      {/* Fully Zero-Scroll Fixed Popup Dialog Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="w-[96vw] sm:w-[92vw] lg:max-w-5xl max-h-[92vh] overflow-hidden rounded-[2.5rem] p-4 sm:p-6 bg-card/98 backdrop-blur-2xl border-primary/30 shadow-2xl"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <DialogHeader className="border-b border-border/60 pb-2.5">
            <DialogTitle className="text-base sm:text-lg font-black text-foreground flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>{locale === "ar" ? "مصمم ومخصص باقات التجميل الذكي" : "Smart Treatment Bundle Builder"}</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-normal hidden sm:inline">
                {locale === "ar" ? "اختاري خدماتكِ واحصلي على عرض السعر فوراً" : "Customize your bundle & request instant quote"}
              </span>
            </DialogTitle>
            <DialogDescription className="sr-only">
              {locale === "ar"
                ? "واجهة مخصصة لاختيار خدمات الليزر والتجميل وتحديد عدد الجلسات وطلب عرض سعر مباشر."
                : "Interactive aesthetic bundle builder to select treatments and request instant tailored quotes."}
            </DialogDescription>
          </DialogHeader>

          <div className="pt-1">
            {isOpen && (
              <Suspense
                fallback={
                  <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent ml-2" />
                    <span>{locale === "ar" ? "جاري تحميل الحاسبة..." : "Loading Calculator..."}</span>
                  </div>
                }
              >
                <TreatmentCalculator isModal={true} />
              </Suspense>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
