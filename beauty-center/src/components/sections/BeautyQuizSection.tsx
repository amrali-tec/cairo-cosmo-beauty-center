import { useState } from "react";
import { useLocale } from "@/lib/locale-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  BadgePercent,
  Calendar,
  RotateCcw,
  Sparkle,
} from "lucide-react";
import { Link } from "react-router-dom";

type Area = "face" | "body" | "hair";

type QuizResult = {
  serviceTitleAr: string;
  serviceTitleEn: string;
  serviceSlug: string;
  doctorNameAr: string;
  doctorNameEn: string;
  offerTitleAr: string;
  offerTitleEn: string;
  discount: string;
  reasonAr: string;
  reasonEn: string;
};

const quizMatrix: Record<string, QuizResult> = {
  "face-glow": {
    serviceTitleAr: "جلسات الفراكشنال ليزر وتجديد البشرة",
    serviceTitleEn: "Fractional CO2 Laser Rejuvenation",
    serviceSlug: "fractional-laser",
    doctorNameAr: "د. ناهد سمير (استشاري الجلدية والتجميل)",
    doctorNameEn: "Dr. Nahed Samir (Dermatology Consultant)",
    offerTitleAr: "عرض نضارة البشرة وتصفية المسام",
    offerTitleEn: "Skin Glow & Pore Cleansing Offer",
    discount: "خصم 25%",
    reasonAr: "باقة مخصصة لإعطاء البشرة إشراقة فورية وتصفية المسام وتوحيد اللون بفاعلية عالية.",
    reasonEn: "Customized package to give instant radiance, clean pores, and even out skin tone.",
  },
  "face-wrinkles": {
    serviceTitleAr: "حقن البوتوكس وتنعيم التجاعيد التعبيرية",
    serviceTitleEn: "Botox Wrinkle Smoothing",
    serviceSlug: "botox",
    doctorNameAr: "د. باسم زكي (استشاري طب التجميل)",
    doctorNameEn: "Dr. Bassem Zaki (Aesthetic Medicine Consultant)",
    offerTitleAr: "عرض البوتوكس والتجاعيد التعبيرية",
    offerTitleEn: "Botox Expression Wrinkles Offer",
    discount: "خصم 20%",
    reasonAr: "خطة هادئة ومحسوبة لإخفاء خطوط الجبهة وحول العين للحصول على مظهر شاب وطبيعي.",
    reasonEn: "Subtle and precise plan to smooth forehead and eye lines for natural youthful look.",
  },
  "body-contour": {
    serviceTitleAr: "جلسات نحت وتنسيق القوام وتذويب الدهون",
    serviceTitleEn: "Body Contouring & Sculpting",
    serviceSlug: "body-contouring",
    doctorNameAr: "د. أحمد الشريف (استشاري جراحة التجميل)",
    doctorNameEn: "Dr. Ahmed El-Sherif (Plastic Surgery Consultant)",
    offerTitleAr: "عرض باقة تنسيق القوام والنحت غير الجراحي",
    offerTitleEn: "Non-Surgical Body Contouring Bundle",
    discount: "خصم 30%",
    reasonAr: "أحدث التقنيات لنحت المناطق المستهدفة بدون فترة نقاهة مع متابعة مقاسات دورية.",
    reasonEn: "Latest technologies targeting specific areas with zero downtime and progress tracking.",
  },
  "hair-laser": {
    serviceTitleAr: "إزالة الشعر بالليزر بأحدث أجهزة التبريد",
    serviceTitleEn: "Laser Hair Removal with Dynamic Cooling",
    serviceSlug: "laser-hair-removal",
    doctorNameAr: "د. ناهد سمير (استشاري الجلدية والتجميل)",
    doctorNameEn: "Dr. Nahed Samir (Dermatology Consultant)",
    offerTitleAr: "عرض باقة الجلسات المفتوحة لليزر",
    offerTitleEn: "Laser Unlimited Session Package",
    discount: "خصم 35%",
    reasonAr: "جلسات سريعة وآمنة بدون ألم تناسب جميع أنواع البشرة بأعلى معايير الأمان.",
    reasonEn: "Fast, safe, painless sessions matching all skin types with highest safety standards.",
  },
};

export function BeautyQuizSection() {
  const { locale, isRTL } = useLocale();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const goalsMap: Record<Area, { id: string; labelAr: string; labelEn: string; icon: string }[]> = {
    face: [
      { id: "face-glow", labelAr: "نضارة فورية وتوحيد لون البشرة", labelEn: "Instant Glow & Skin Rejuvenation", icon: "✨" },
      { id: "face-wrinkles", labelAr: "إزالة خطوط التجاعيد والتعبير", labelEn: "Wrinkle Smoothing & Anti-aging", icon: "🌸" },
    ],
    body: [
      { id: "body-contour", labelAr: "نحت وتنسيق القوام وتذويب الدهون", labelEn: "Body Sculpting & Fat Reduction", icon: "💎" },
    ],
    hair: [
      { id: "hair-laser", labelAr: "إزالة الشعر بالليزر بدون ألم", labelEn: "Painless Laser Hair Removal", icon: "⚡" },
    ],
  };

  const handleSelectArea = (area: Area) => {
    setSelectedArea(area);
    setStep(2);
  };

  const handleSelectGoal = (goalId: string) => {
    setSelectedGoal(goalId);
    setStep(3);
  };

  const resetQuiz = () => {
    setStep(1);
    setSelectedArea(null);
    setSelectedGoal(null);
  };

  const resultKey = selectedGoal || "face-glow";
  const result = quizMatrix[resultKey] || quizMatrix["face-glow"];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-background via-accent/10 to-background" dir={isRTL ? "rtl" : "ltr"}>
      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <Badge variant="outline" className="rounded-full px-4 py-1.5 border-primary/30 text-primary font-bold text-xs">
            <Sparkles className="ml-1.5 h-3.5 w-3.5 inline text-primary" />
            {locale === "ar" ? "أداة التشخيص التفاعلي الذكي" : "AI Interactive Beauty Quiz"}
          </Badge>

          <h2 className="text-3xl md:text-4xl font-black text-foreground">
            {locale === "ar" ? "اكتشفي الخطة العلاجية الأنسب لك في 3 أسئلة" : "Find Your Tailored Treatment in 3 Steps"}
          </h2>

          <p className="text-sm md:text-base text-muted-foreground">
            {locale === "ar"
              ? "اختر المنطقة والنتيجة المطلوبة، ليقوم النظام بتوصية الخدمة والاستشاري والعرض المتاح لك فورياً."
              : "Pick your target area and goal, and our system will match the best service, doctor, and active offer instantly."}
          </p>
        </div>

        <Card className="max-w-3xl mx-auto rounded-[2.5rem] border-primary/20 bg-card/90 shadow-2xl overflow-hidden backdrop-blur">
          <CardContent className="p-6 md:p-10">
            {/* Step Progress Indicator */}
            <div className="flex items-center justify-between border-b border-border/60 pb-6 mb-8 text-xs font-bold text-muted-foreground">
              <span className={cn("flex items-center gap-1.5", step >= 1 && "text-primary")}>
                <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">1</span>
                {locale === "ar" ? "المنطقة المستهدفة" : "Target Area"}
              </span>
              <span>—</span>
              <span className={cn("flex items-center gap-1.5", step >= 2 && "text-primary")}>
                <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">2</span>
                {locale === "ar" ? "النتيجة المطلوبة" : "Desired Result"}
              </span>
              <span>—</span>
              <span className={cn("flex items-center gap-1.5", step === 3 && "text-primary")}>
                <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">3</span>
                {locale === "ar" ? "التوصية والخطة" : "Your Plan"}
              </span>
            </div>

            {/* Step 1: Select Area */}
            {step === 1 ? (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-foreground text-center">
                  {locale === "ar" ? "ما هي المنطقة التي ترغبين في العناية بها؟" : "Which area would you like to focus on?"}
                </h3>

                <div className="grid gap-4 md:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => handleSelectArea("face")}
                    className="card-elevated group p-6 rounded-3xl border border-border/80 bg-background/80 hover:border-primary text-center space-y-3 transition-all"
                  >
                    <span className="text-4xl block group-hover:scale-110 transition-transform">🌸</span>
                    <span className="font-bold text-lg text-foreground block">{locale === "ar" ? "الوجه والشرة" : "Face & Skin"}</span>
                    <span className="text-xs text-muted-foreground block">{locale === "ar" ? "نضارة، بوتوكس، هيدرافيشل" : "Glow, Botox, Hydrafacial"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectArea("body")}
                    className="card-elevated group p-6 rounded-3xl border border-border/80 bg-background/80 hover:border-primary text-center space-y-3 transition-all"
                  >
                    <span className="text-4xl block group-hover:scale-110 transition-transform">💎</span>
                    <span className="font-bold text-lg text-foreground block">{locale === "ar" ? "الجسم وتنسيق القوام" : "Body & Sculpting"}</span>
                    <span className="text-xs text-muted-foreground block">{locale === "ar" ? "نحت، تذويب دهون" : "Sculpting, Contour"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectArea("hair")}
                    className="card-elevated group p-6 rounded-3xl border border-border/80 bg-background/80 hover:border-primary text-center space-y-3 transition-all"
                  >
                    <span className="text-4xl block group-hover:scale-110 transition-transform">⚡</span>
                    <span className="font-bold text-lg text-foreground block">{locale === "ar" ? "إزالة الشعر بالليزر" : "Laser Hair Removal"}</span>
                    <span className="text-xs text-muted-foreground block">{locale === "ar" ? "جلسات ليزر تبريد بدون ألم" : "Painless Cooling Laser"}</span>
                  </button>
                </div>
              </div>
            ) : null}

            {/* Step 2: Select Goal */}
            {step === 2 && selectedArea ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">
                    {locale === "ar" ? "ما هي النتيجة التي تبحثين عنها؟" : "What specific result are you looking for?"}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="rounded-xl text-xs">
                    {isRTL ? <ArrowRight className="ml-1 h-3.5 w-3.5" /> : <ArrowLeft className="mr-1 h-3.5 w-3.5" />}
                    {locale === "ar" ? "الخطوة السابقة" : "Back"}
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {goalsMap[selectedArea].map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => handleSelectGoal(goal.id)}
                      className="card-elevated group p-6 rounded-3xl border border-border/80 bg-background/80 hover:border-primary text-right space-y-2 transition-all flex items-center gap-4"
                    >
                      <span className="text-3xl">{goal.icon}</span>
                      <div>
                        <span className="font-bold text-base text-foreground block">
                          {locale === "ar" ? goal.labelAr : goal.labelEn}
                        </span>
                        <span className="text-xs text-primary font-semibold block mt-1">
                          {locale === "ar" ? "اختر هذه النتيجة ➜" : "Select Result ➜"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Step 3: Quiz Result Card */}
            {step === 3 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>{locale === "ar" ? "الخطة التوصية المخصصة لك جاهزة!" : "Your Tailored Plan is Ready!"}</span>
                  </div>

                  <Button variant="ghost" size="sm" onClick={resetQuiz} className="rounded-xl text-xs">
                    <RotateCcw className="ml-1 h-3.5 w-3.5" />
                    {locale === "ar" ? "إعادة التشخيص" : "Restart Quiz"}
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                    <p className="text-sm text-foreground leading-relaxed font-medium">
                      {locale === "ar" ? result.reasonAr : result.reasonEn}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-5 rounded-2xl border border-border/80 bg-background/80 space-y-2">
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <Sparkle className="h-3.5 w-3.5 text-primary" />
                        {locale === "ar" ? "الخدمة الموصى بها:" : "Recommended Service:"}
                      </span>
                      <p className="font-bold text-lg text-foreground">
                        {locale === "ar" ? result.serviceTitleAr : result.serviceTitleEn}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl border border-border/80 bg-background/80 space-y-2">
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <Stethoscope className="h-3.5 w-3.5 text-primary" />
                        {locale === "ar" ? "الاستشاري الموصى به:" : "Recommended Consultant:"}
                      </span>
                      <p className="font-bold text-base text-foreground">
                        {locale === "ar" ? result.doctorNameAr : result.doctorNameEn}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl border border-primary/20 bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <Badge className="bg-primary/15 text-primary rounded-full px-3 py-1 text-xs font-bold mb-1">
                        {result.discount}
                      </Badge>
                      <p className="font-bold text-foreground text-base">
                        {locale === "ar" ? result.offerTitleAr : result.offerTitleEn}
                      </p>
                    </div>

                    <Button size="lg" asChild className="rounded-2xl btn-primary-gradient border-0 font-bold px-6 shadow-md shadow-primary/20">
                      <Link to={`/${locale}/booking`}>
                        <Calendar className="ml-1.5 h-4 w-4" />
                        {locale === "ar" ? "احجزي موعدك الآن" : "Book Your Appointment"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
