// ===============================================
// src/components/calculator/TreatmentCalculator.tsx
// مصمم ومخصص باقات التجميل الذكي (أيقونات متطورة وفائقة الوضوح)
// ===============================================

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Zap,
  Calendar,
  Gift,
  Send,
  MessageCircle,
  Mail,
  Award,
  Layers,
  HeartHandshake,
  Check,
  Syringe,
  Droplet,
  Waves,
  SunMedium,
  Flame,
  Activity,
  Gem,
  Clock,
  Sparkle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/lib/locale-context";
import { useToast } from "@/hooks/use-toast";
import { siteConfig } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface TreatmentItem {
  id: string;
  category: "laser" | "injections" | "skincare" | "body";
  nameAr: string;
  nameEn: string;
  unitAr: string;
  unitEn: string;
  deviceAr: string;
  deviceEn: string;
  icon: any;
  colorClass: string;
  popular?: boolean;
}

const treatmentCatalog: TreatmentItem[] = [
  // Laser Treatments
  {
    id: "laser_fullbody",
    category: "laser",
    nameAr: "ليزر الجسم بالكامل (كانديلا برو)",
    nameEn: "Full Body Laser (Candela Pro)",
    unitAr: "جلسة كاملة + رتوش",
    unitEn: "Full session + touchup",
    deviceAr: "Candela GentleMax Pro",
    deviceEn: "Candela Pro Plus",
    icon: Zap,
    colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/25",
    popular: true,
  },
  {
    id: "laser_bikini_underarm",
    category: "laser",
    nameAr: "ليزر بكيني واندر آرم (ديكا موفيو)",
    nameEn: "Bikini & Underarm Laser (DEKA)",
    unitAr: "جلسة بدون ألم",
    unitEn: "Painless session",
    deviceAr: "DEKA Motus AX Moveo",
    deviceEn: "DEKA Motus AX",
    icon: SunMedium,
    colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/25",
  },
  {
    id: "laser_face_neck",
    category: "laser",
    nameAr: "ليزر الوجه والرقبة (شعر وبري)",
    nameEn: "Face & Neck Fine Hair Laser",
    unitAr: "جلسة ناعمة للبشرة",
    unitEn: "Gentle session",
    deviceAr: "DEKA Motus AX Moveo",
    deviceEn: "DEKA Moveo",
    icon: Sparkles,
    colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/25",
  },

  // Aesthetic Injections
  {
    id: "filler_lips_1ml",
    category: "injections",
    nameAr: "فيلر الشفاه الفرنسي (1 مل)",
    nameEn: "French Lip Filler (1 ml)",
    unitAr: "حقن استشاري متخصص",
    unitEn: "Consultant injection",
    deviceAr: "Juvederm / Restylane",
    deviceEn: "Juvederm / Restylane",
    icon: Syringe,
    colorClass: "text-rose-500 bg-rose-500/10 border-rose-500/25",
    popular: true,
  },
  {
    id: "botox_fullface",
    category: "injections",
    nameAr: "بوتوكس الجبهة ومحيط العين",
    nameEn: "Full Forehead & Eye Botox",
    unitAr: "Allergan USA أصلي",
    unitEn: "Allergan Original",
    deviceAr: "Allergan Botox USA",
    deviceEn: "Allergan Botox",
    icon: Gem,
    colorClass: "text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/25",
  },
  {
    id: "profhilo_skin",
    category: "injections",
    nameAr: "إبرة النضارة الملكية (بروفايلو)",
    nameEn: "Royal Profhilo Bio-Remodeling",
    unitAr: "حمض هيالورونيك نقي",
    unitEn: "Pure Hyaluronic Acid",
    deviceAr: "IBSA Profhilo Italy",
    deviceEn: "Profhilo Italy",
    icon: Droplet,
    colorClass: "text-pink-500 bg-pink-500/10 border-pink-500/25",
    popular: true,
  },

  // Clinical Skincare
  {
    id: "hydrafacial_royal",
    category: "skincare",
    nameAr: "الهيدرافيشل الملكي (12 خطوة)",
    nameEn: "12-Step Royal Hydrafacial",
    unitAr: "تنظيف وتقشير عميق",
    unitEn: "Deep hydro-peel",
    deviceAr: "Hydrafacial Elite USA",
    deviceEn: "Hydrafacial USA",
    icon: Waves,
    colorClass: "text-cyan-500 bg-cyan-500/10 border-cyan-500/25",
    popular: true,
  },
  {
    id: "fractional_co2",
    category: "skincare",
    nameAr: "فراكشنال ليزر للندبات والمسام",
    nameEn: "Fractional CO2 Laser & Scars",
    unitAr: "تجديد كولاجين البشرة",
    unitEn: "Collagen remodeling",
    deviceAr: "DEKA SmartXide Fractional",
    deviceEn: "DEKA Fractional",
    icon: Flame,
    colorClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25",
  },

  // Body Sculpting
  {
    id: "coolsculpting_360",
    category: "body",
    nameAr: "نحت وتجميد الدهون CoolSculpting",
    nameEn: "CoolSculpting 360 Fat Freeze",
    unitAr: "تجميد دهون بدون جراحة",
    unitEn: "Non-invasive freeze",
    deviceAr: "CoolSculpting Elite",
    deviceEn: "CoolSculpting 360",
    icon: Activity,
    colorClass: "text-indigo-500 bg-indigo-500/10 border-indigo-500/25",
  },
];

const VALID_COUPONS: Record<string, { discountPercent: number; label: string; benefitAr: string; benefitEn: string }> = {
  COSMO2026: {
    discountPercent: 20,
    label: "كود خصم كوزمو الافتتاحي 2026",
    benefitAr: "خصم إضافي واستشارة كشف مجانية مع استشاري الجلدية",
    benefitEn: "Extra discount & free consultation with specialist",
  },
  VIPBEAUTY: {
    discountPercent: 25,
    label: "كود باقات VIP الحصرية",
    benefitAr: "خصم VIP وترقية مجانية لجلسة رتوش إضافية",
    benefitEn: "VIP discount & free touch-up upgrade",
  },
};

interface Props {
  isModal?: boolean;
}

export function TreatmentCalculator({ isModal = true }: Props) {
  const { locale } = useLocale();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState<"all" | "laser" | "injections" | "skincare" | "body">("all");
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({
    laser_fullbody: true,
    hydrafacial_royal: true,
  });
  const [sessionCount, setSessionCount] = useState<number>(4);
  const [couponCode, setCouponCode] = useState<string>("COSMO2026");
  const [appliedCoupon, setAppliedCoupon] = useState<string>("COSMO2026");

  // Toggle item selection
  const toggleItem = (id: string) => {
    setSelectedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      const hasAny = Object.values(next).some(Boolean);
      if (!hasAny) {
        toast({
          title: locale === "ar" ? "تنبيه" : "Notice",
          description: locale === "ar" ? "يرجى اختيار خدمة واحدة على الأقل في الباقة" : "Please select at least one treatment",
        });
        return prev;
      }
      return next;
    });
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (VALID_COUPONS[clean]) {
      setAppliedCoupon(clean);
      toast({
        title: locale === "ar" ? "تم تفعيل كود الخصم! 🎉" : "Promo Code Applied! 🎉",
        description: locale === "ar" ? VALID_COUPONS[clean].benefitAr : VALID_COUPONS[clean].benefitEn,
      });
    } else {
      toast({
        title: locale === "ar" ? "كود غير معتمد" : "Invalid Code",
        description: locale === "ar" ? "يرجى التأكد من كود الخصم والمحاولة مجدداً" : "Please verify your promo code",
        variant: "destructive",
      });
    }
  };

  const selectedTreatmentsList = useMemo(() => {
    return treatmentCatalog.filter((t) => selectedItems[t.id]);
  }, [selectedItems]);

  const bundleSummaryText = useMemo(() => {
    const names = selectedTreatmentsList
      .map((t) => (locale === "ar" ? t.nameAr : t.nameEn))
      .join(" + ");

    return `باقة مخصصة (${sessionCount} جلسات): ${names} [كود: ${appliedCoupon || "COSMO2026"}]`;
  }, [selectedTreatmentsList, sessionCount, appliedCoupon, locale]);

  // WhatsApp Quote Request Handler
  const handleRequestQuoteWhatsApp = () => {
    const isAr = locale === "ar";
    const selectedNames = selectedTreatmentsList
      .map((t) => `• ${isAr ? t.nameAr : t.nameEn} (${isAr ? t.deviceAr : t.deviceEn})`)
      .join("\n");

    const message = isAr
      ? `مرحباً إدارة كايرو كوزمو سنتر 🌸\nأود الاستفسار والحصول على عرض السعر والخصم المخصص لباقة التجميل التي صممتها عبر الموقع:\n\n📋 **الخدمات المختارة:**\n${selectedNames}\n\n🔢 **عدد الجلسات:** ${sessionCount} جلسات\n🎁 **كود الخصم المطبق:** ${appliedCoupon || "COSMO2026"}\n\nيرجى إرسال تفاصيل السعر وخطة المواعيد المتاحة لأقرب فرع. شكراً لكم!`
      : `Hello Cairo Cosmo Center 🌸\nI would like to request the tailored quote and exclusive discount for my custom beauty package built on the website:\n\n📋 **Selected Treatments:**\n${selectedNames}\n\n🔢 **Number of Sessions:** ${sessionCount} sessions\n🎁 **Applied Promo Code:** ${appliedCoupon || "COSMO2026"}\n\nPlease send me the pricing details and available appointments. Thank you!`;

    const whatsappNumber = siteConfig.whatsapp || "201288880000";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Booking Page Navigation Handler
  const handleBookViaForm = () => {
    navigate(`/${locale}/book`, {
      state: {
        calculatedBundle: bundleSummaryText,
        prefilledNotes: `طلب تسعير وحجز باقة مخصصة: ${bundleSummaryText}`,
      },
    });
  };

  const filteredCatalog = useMemo(() => {
    if (activeCategory === "all") return treatmentCatalog;
    return treatmentCatalog.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="w-full space-y-4" dir={locale === "ar" ? "rtl" : "ltr"}>
      {/* 2-Column Split Cockpit Layout (Fits within single screen without scroll) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Column: Treatments & Sessions (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
          {/* Category Filter Tabs with High-Clarity Icons */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/40 border border-border/70 overflow-x-auto">
            {[
              { id: "all", labelAr: "الكل", labelEn: "All", icon: Sparkles, iconColor: "text-amber-500" },
              { id: "laser", labelAr: "الليزر", labelEn: "Laser", icon: Zap, iconColor: "text-amber-500" },
              { id: "injections", labelAr: "فيلر وبوتوكس", labelEn: "Injectables", icon: Syringe, iconColor: "text-rose-500" },
              { id: "skincare", labelAr: "بشرة", labelEn: "Skincare", icon: Waves, iconColor: "text-cyan-500" },
              { id: "body", labelAr: "قوام", labelEn: "Body", icon: Activity, iconColor: "text-indigo-500" },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1.5 flex-1 whitespace-nowrap",
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5 shrink-0", activeCategory === cat.id ? "text-primary-foreground" : cat.iconColor)} />
                  <span>{locale === "ar" ? cat.labelAr : cat.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Compact Treatment Chips Grid with Duotone Icon Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredCatalog.map((item) => {
              const isSelected = Boolean(selectedItems[item.id]);
              const ItemIcon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={cn(
                    "rounded-2xl border p-2.5 cursor-pointer transition-all duration-200 flex items-center justify-between gap-2.5 select-none",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/40"
                      : "border-border/60 bg-card hover:border-primary/40 hover:bg-card/80"
                  )}
                >
                  {/* Left Duotone Icon */}
                  <div className={cn("h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 shadow-xs", item.colorClass)}>
                    <ItemIcon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="font-bold text-xs text-foreground truncate">
                      {locale === "ar" ? item.nameAr : item.nameEn}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-medium truncate flex items-center gap-1">
                      <span>{locale === "ar" ? item.deviceAr : item.deviceEn}</span>
                    </div>
                  </div>

                  {/* Selection Check Badge */}
                  <div
                    className={cn(
                      "h-5 w-5 rounded-lg flex items-center justify-center shrink-0 transition-all",
                      isSelected ? "bg-primary text-primary-foreground shadow-xs" : "border border-border/80 bg-background"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compact Session Count Row */}
          <div className="p-3 rounded-2xl border border-border/70 bg-card/70 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>{locale === "ar" ? "عدد الجلسات:" : "Sessions:"}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {[
                { count: 1, labelAr: "1 جلسة" },
                { count: 3, labelAr: "3 جلسات" },
                { count: 6, labelAr: "6 جلسات" },
                { count: 12, labelAr: "12 جلسة (VIP)" },
              ].map((s) => (
                <button
                  key={s.count}
                  type="button"
                  onClick={() => setSessionCount(s.count)}
                  className={cn(
                    "px-3 py-1 rounded-xl text-xs font-black transition-all border",
                    sessionCount === s.count
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-background border-border/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s.labelAr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Summary & 1-Click WhatsApp Quote (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-4 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-primary/5 space-y-3">
          {/* Header Tag */}
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <span className="font-black text-xs text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{locale === "ar" ? "ملخص باقتكِ المخصصة" : "Custom Bundle"}</span>
            </span>

            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-black gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>{selectedTreatmentsList.length} {locale === "ar" ? "خدمات مختارة" : "Items"}</span>
            </Badge>
          </div>

          {/* Selected Items Tags List */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap gap-1 max-h-24 overflow-hidden">
              {selectedTreatmentsList.map((t) => (
                <span
                  key={t.id}
                  className="rounded-lg bg-background/80 border border-primary/25 text-foreground text-[10px] font-bold px-2 py-1 flex items-center gap-1"
                >
                  <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                  <span className="truncate max-w-[150px]">{locale === "ar" ? t.nameAr : t.nameEn}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Promo Code Inline Form */}
          <form onSubmit={handleApplyCoupon} className="flex items-center gap-1.5 pt-1">
            <div className="relative flex-1">
              <Tag className="h-3.5 w-3.5 text-primary absolute start-2.5 top-2.5" />
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="COSMO2026"
                className="h-8 ps-8 rounded-xl uppercase font-mono text-[11px] tracking-wider bg-background"
              />
            </div>
            <Button type="submit" size="sm" variant="secondary" className="h-8 rounded-xl text-[11px] font-bold shrink-0">
              {locale === "ar" ? "تفعيل" : "Apply"}
            </Button>
          </form>

          {/* Free Perks Ribbon */}
          <div className="p-2 rounded-xl bg-background/60 border border-border/50 text-[10px] text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1 font-bold text-foreground">
              <Gift className="h-3.5 w-3.5 text-primary" />
              <span>كشف واستشارة مجانية</span>
            </span>
            <span className="text-emerald-600 font-bold">خصم 20% + رتوش هدية</span>
          </div>

          {/* WhatsApp Direct Quote Button */}
          <div className="space-y-1.5 pt-1">
            <Button
              type="button"
              onClick={handleRequestQuoteWhatsApp}
              className="w-full h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black gap-2 shadow-md shadow-emerald-600/20 hover:scale-[1.02] transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{locale === "ar" ? "طلب عرض السعر والخصم عبر الواتساب" : "Request Quote via WhatsApp"}</span>
            </Button>

            <Button
              type="button"
              onClick={handleBookViaForm}
              variant="outline"
              className="w-full h-8 rounded-xl border-border/70 hover:bg-primary/5 text-foreground text-[11px] font-bold"
            >
              <Mail className="h-3 w-3 ml-1 text-primary" />
              <span>{locale === "ar" ? "طلب الحجز المباشر بالعيادة" : "Direct Clinic Booking"}</span>
            </Button>
          </div>

          <div className="text-center text-[9px] text-muted-foreground flex items-center justify-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
            <span>{locale === "ar" ? "خصوصية تامة وسرية لبيانات العملاء • رد فوري عبر الواتساب" : "100% Privacy • Rapid Response"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
