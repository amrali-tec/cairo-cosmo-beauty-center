// ===============================================
// src/components/Footer.tsx
// الفوتر العام المتكامل والفاخر لمركز كايرو كوزمو
// ===============================================

import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  ArrowUp,
  Mail,
  ShieldCheck,
  FileText,
  BadgeInfo,
  Cookie,
  Sparkles,
  Zap,
  Stethoscope,
  Calendar,
  Calculator,
  MessageCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HeartHandshake,
} from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { siteConfig, getTranslation } from "@/lib/i18n";
import { branches } from "@/lib/data/branches";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useThemeMode } from "@/lib/use-theme-mode";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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

export const Footer = () => {
  const { locale, t, dir, translations, isRTL } = useLocale();
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const { isDark } = useThemeMode();
  const logoSrc = isDark ? "/logo-light.png" : "/logo.png";
  const brandName = getTranslation(siteConfig.shortName, locale);

  const topServices = [
    { labelAr: "ليزر إزالة الشعر (كانديلا برو)", labelEn: "Candela Pro Laser Hair Removal", href: `/${locale}/services/laser-hair-removal` },
    { labelAr: "حقن الفيلر والبوتوكس الفرنسي", labelEn: "French Fillers & Allergan Botox", href: `/${locale}/services/botox-and-fillers` },
    { labelAr: "جلسة الهيدرافيشل الملكية 12 خطوة", labelEn: "12-Step Royal Hydrafacial", href: `/${locale}/services/skin-rejuvenation-hydrafacial` },
    { labelAr: "الفراكشنال ليزر وتجديد البشرة", labelEn: "Fractional CO2 Laser & Scars", href: `/${locale}/services/fractional-laser-rejuvenation` },
    { labelAr: "نحت القوام وتجميد الدهون 360", labelEn: "CoolSculpting 360 Body Sculpt", href: `/${locale}/services/body-contouring-slimming` },
    { labelAr: "علاج تساقط الشعر والإكسوزوم", labelEn: "Exosomes & Hair Growth PRP", href: `/${locale}/services/hair-loss-regrowth-prp` },
  ];

  const quickTools = [
    { labelAr: "حاسبة تكلفة التجميل والباقات 🧮", labelEn: "Treatment & Bundle Calculator 🧮", href: `/${locale}/calculator` },
    { labelAr: "مستشار الجمال الذكي (AI Consultant)", labelEn: "AI Smart Beauty Consultant", href: `/${locale}/book` },
    { labelAr: "نتائج وتجارب قبل وبعد 📸", labelEn: "Before & After Real Results", href: `/${locale}#before-after` },
    { labelAr: "آراء وتقييمات المراجعين ⭐", labelEn: "Verified Patient Reviews ⭐", href: `/${locale}#testimonials` },
    { labelAr: "العروض والباقات الحصرية 🎁", labelEn: "Exclusive Offers & Packages 🎁", href: `/${locale}/offers` },
    { labelAr: "الموسوعة والمدونة الطبية 📖", labelEn: "Medical Beauty Blog & Guides 📖", href: `/${locale}/blog` },
  ];

  const legalLinks = [
    { href: `/${locale}/privacy`, label: locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy", icon: ShieldCheck },
    { href: `/${locale}/terms`, label: locale === "ar" ? "الشروط والأحكام" : "Terms & Conditions", icon: FileText },
    { href: `/${locale}/disclaimer`, label: locale === "ar" ? "إخلاء المسؤولية الطبية" : "Medical Disclaimer", icon: BadgeInfo },
    { href: `/${locale}/cookies`, label: locale === "ar" ? "سياسة الكوكيز" : "Cookies Policy", icon: Cookie },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: locale === "ar" ? "تم اشتراكك بنجاح! 🌸" : "Subscribed successfully!",
      description: locale === "ar" ? "ستصلك أحدث نصائح الأطباء والعروض الحصرية مباشرة." : "You will receive our latest medical beauty tips and exclusive packages.",
    });
  };

  return (
    <footer
      className="relative overflow-hidden border-t border-border/80 bg-gradient-to-b from-card via-background to-card text-foreground pt-14 pb-8"
      dir={dir}
    >
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.12),transparent_60%)]" />

      <div className="section-container relative space-y-12">
        {/* 1. TOP HIGHLIGHTS RIBBON (4 Equal Pillars with Duotone Crystal Icons) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-10 border-b border-border/60">
          <div className="flex items-center gap-3.5 p-4 rounded-3xl border border-border/70 bg-card/80 shadow-xs hover:border-amber-500/40 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-xs">
              <Zap className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-foreground truncate">
                {locale === "ar" ? "أحدث أجهزة الليزر العالمية" : "Gold-Standard Lasers"}
              </div>
              <div className="text-[11px] text-muted-foreground truncate">
                {locale === "ar" ? "كانديلا جينتل ماكس برو وديكا" : "Candela & DEKA Moveo"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-3xl border border-border/70 bg-card/80 shadow-xs hover:border-primary/40 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-primary/15 text-primary border border-primary/30 flex items-center justify-center shrink-0 shadow-xs">
              <Stethoscope className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-foreground truncate">
                {locale === "ar" ? "نخبة الاستشاريين المتخصصين" : "Medical Consultants"}
              </div>
              <div className="text-[11px] text-muted-foreground truncate">
                {locale === "ar" ? "د. ناهد سمير ود. باسم زكي" : "Board Certified Specialists"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-3xl border border-border/70 bg-card/80 shadow-xs hover:border-emerald-500/40 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-foreground truncate">
                {locale === "ar" ? "3 فروع كبرى بالقاهرة" : "3 Flagship Branches"}
              </div>
              <div className="text-[11px] text-muted-foreground truncate">
                {locale === "ar" ? "شيراتون • الدقي • 6 أكتوبر" : "Sheraton, Dokki & Oct"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-3xl border border-border/70 bg-card/80 shadow-xs hover:border-rose-500/40 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/15 text-rose-500 border border-rose-500/30 flex items-center justify-center shrink-0 shadow-xs">
              <HeartHandshake className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-foreground truncate">
                {locale === "ar" ? "حجز واستشارة 24/7" : "Instant 24/7 Booking"}
              </div>
              <div className="text-[11px] text-muted-foreground truncate">
                {locale === "ar" ? "عبر الواتساب والمساعد الذكي" : "WhatsApp & Sophia AI"}
              </div>
            </div>
          </div>
        </div>

        {/* 2. MAIN BALANCED 4-COLUMN GRID (Equal Width & Full Space Utilization) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10">
          {/* Column 1: Brand Identity & Accreditations */}
          <div className="space-y-4">
            <Link
              to={`/${locale}`}
              className="inline-flex items-center gap-3 rounded-2xl p-1 transition-transform hover:scale-105"
            >
              <img
                src={logoSrc}
                alt={`${brandName} logo`}
                width="48"
                height="48"
                loading="lazy"
                decoding="async"
                className="h-12 w-12 rounded-2xl object-contain p-1 bg-white/80 dark:bg-white/10 shadow-sm border border-primary/20"
                draggable={false}
              />
              <div>
                <span className="text-sm font-black text-foreground block">
                  {locale === "ar" ? "مركز القاهرة الطبي للتجميل" : "Cairo Cosmo Center"}
                </span>
                <span className="text-[11px] font-semibold text-primary block">
                  {locale === "ar" ? "Cairo Cosmo Medical Center" : "Medical Aesthetics & Laser"}
                </span>
              </div>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed font-sans">
              {locale === "ar"
                ? "المركز الطبي الرائد لجراحات التجميل والليزر وعلاجات البشرة ونحت القوام في مصر. نقدم حلولاً طبية متطورة تضمن نتائج طبيعية راقية تحت إشراف نخبة من أساتذة واستشاريي كليات الطب."
                : "Egypt's premier medical clinic for laser hair removal, aesthetic injectables, and royal skincare with board-certified consultants."}
            </p>

            {/* Licensing Box */}
            <div className="rounded-2xl border border-border/70 bg-card/80 p-3 text-[11px] space-y-1 text-muted-foreground">
              <div className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>{locale === "ar" ? "مركز مرخص ومعتمد طبياً" : "Fully Licensed Facility"}</span>
              </div>
              <div>{locale === "ar" ? "ترخيص وزارة الصحة: 48291/2026" : "MOH License: 48291/2026"}</div>
              <div>{locale === "ar" ? "السجل التجاري: 184920 • نقابة الأطباء" : "Commercial Reg: 184920"}</div>
            </div>

            {/* Social Icons */}
            <div className="pt-1">
              <div className="text-xs font-bold text-foreground mb-2">
                {locale === "ar" ? "تابعنا على منصات التواصل:" : "Connect with us:"}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={siteConfig.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-xl bg-card border border-border/80 text-foreground flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 transition-all shadow-xs"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href={siteConfig.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-xl bg-card border border-border/80 text-foreground flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 transition-all shadow-xs"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href={siteConfig.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-xl bg-card border border-border/80 text-foreground flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 transition-all shadow-xs"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </a>
                <a
                  href={siteConfig.socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-xl bg-card border border-border/80 text-foreground flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 transition-all shadow-xs"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Top Treatments */}
          <div className="space-y-4">
            <h4 className="font-black text-sm text-foreground flex items-center gap-2 border-b border-border/60 pb-2.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{locale === "ar" ? "أبرز الخدمات الطبية" : "Top Treatments"}</span>
            </h4>
            <ul className="space-y-3 text-xs">
              {topServices.map((srv, idx) => (
                <li key={idx}>
                  <Link
                    to={srv.href}
                    className="text-muted-foreground hover:text-primary hover:translate-x-1 rtl:hover:-translate-x-1 transition-all flex items-center gap-2 font-medium leading-normal"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{locale === "ar" ? srv.labelAr : srv.labelEn}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Patient Tools & Links */}
          <div className="space-y-4">
            <h4 className="font-black text-sm text-foreground flex items-center gap-2 border-b border-border/60 pb-2.5">
              <Calculator className="h-4 w-4 text-primary" />
              <span>{locale === "ar" ? "أدوات وصفحات تهمكِ" : "Interactive Tools"}</span>
            </h4>
            <ul className="space-y-3 text-xs">
              {quickTools.map((tool, idx) => (
                <li key={idx}>
                  <Link
                    to={tool.href}
                    className="text-muted-foreground hover:text-primary hover:translate-x-1 rtl:hover:-translate-x-1 transition-all flex items-center gap-2 font-medium leading-normal"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{locale === "ar" ? tool.labelAr : tool.labelEn}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Branches & Direct WhatsApp CTA */}
          <div className="space-y-4">
            <h4 className="font-black text-sm text-foreground flex items-center gap-2 border-b border-border/60 pb-2.5">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{locale === "ar" ? "الفروع وأرقام التواصل" : "Branches & Contact"}</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl border border-border/70 bg-card/80 space-y-1">
                <div className="font-bold text-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{locale === "ar" ? "مصر الجديدة (شيراتون):" : "Heliopolis (Sheraton):"}</span>
                </div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">
                  {locale === "ar" ? "مساكن شيراتون، بجوار الأكاديمية البحرية" : "Sheraton Buildings, Cairo"}
                </div>
              </div>

              <div className="p-3 rounded-2xl border border-border/70 bg-card/80 space-y-1">
                <div className="font-bold text-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{locale === "ar" ? "فرع الدقي (الجيزة):" : "Dokki Branch (Giza):"}</span>
                </div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">
                  {locale === "ar" ? "شارع مصدق، بالقرب من محطة المترو" : "Mossadak St, Dokki, Giza"}
                </div>
              </div>

              <div className="p-3 rounded-2xl border border-border/70 bg-card/80 space-y-1">
                <div className="font-bold text-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{locale === "ar" ? "فرع 6 أكتوبر (الشيخ زايد):" : "6th of October Branch:"}</span>
                </div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">
                  {locale === "ar" ? "المحور المركزي، زايد وأكتوبر" : "Central Axis, Zayed & Oct"}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-2xl btn-primary-gradient text-white text-xs font-bold h-11 flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:scale-105 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{locale === "ar" ? "تواصل واتساب المباشر" : "WhatsApp Direct"}</span>
              </a>
            </div>
          </div>
        </div>

        {/* 3. VIP NEWSLETTER & ACADEMIC ACCREDITATION BAR */}
        <div className="grid gap-6 md:grid-cols-12 rounded-[2.5rem] border border-primary/25 bg-gradient-to-r from-primary/10 via-card to-primary/5 p-6 md:p-8 shadow-sm">
          {/* Newsletter (7 cols) */}
          <div className="space-y-3 md:col-span-7">
            <div className="flex items-center gap-2 text-primary font-black text-sm">
              <Mail className="h-4 w-4" />
              <span>{locale === "ar" ? "اشتركي في النشرة التجميلية واستقبلي عروضكِ المخصصة" : "Subscribe for VIP Clinical Beauty Updates"}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {locale === "ar"
                ? "احصلي على إرشادات الأطباء الأسبوعية، بروتوكولات العناية بعد الليزر، وأكواد الخصم الحصرية المباشرة."
                : "Receive weekly dermatologist guides, post-treatment care routines, and private VIP discount codes."}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-1">
              <Input
                type="email"
                required
                placeholder={locale === "ar" ? "أدخلي بريدكِ الإلكتروني (e.g. name@example.com)" : "Enter your email address..."}
                className="h-11 rounded-2xl bg-background border-border text-xs"
              />
              <Button type="submit" className="rounded-2xl btn-primary-gradient border-0 font-bold text-xs px-6 h-11 shrink-0">
                {locale === "ar" ? "انضمي لعائلة كوزمو ✨" : "Join VIP Club ✨"}
              </Button>
            </form>
          </div>

          {/* Trust Pills (5 cols) */}
          <div className="flex flex-col justify-center space-y-3 md:col-span-5 md:border-r md:rtl:border-r-0 md:rtl:border-l border-border/70 md:pr-6 md:rtl:pr-0 md:rtl:pl-6">
            <span className="text-xs font-black text-foreground uppercase tracking-wider">
              {locale === "ar" ? "معايير السلامة والجودة الطبية:" : "Medical Quality Standards:"}
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-foreground">
              <div className="p-2.5 rounded-2xl border border-border/70 bg-card/90 space-y-1">
                <span className="text-base block">🏅</span>
                <span>{locale === "ar" ? "ترخيص الصحة" : "MOH Certified"}</span>
              </div>
              <div className="p-2.5 rounded-2xl border border-border/70 bg-card/90 space-y-1">
                <span className="text-base block">🎓</span>
                <span>{locale === "ar" ? "استشاريو الطب" : "MD Consultants"}</span>
              </div>
              <div className="p-2.5 rounded-2xl border border-border/70 bg-card/90 space-y-1">
                <span className="text-base block">⚡</span>
                <span>{locale === "ar" ? "أجهزة أصلية" : "FDA Approved"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. BOTTOM COPYRIGHT & LEGAL BAR */}
        <div className="border-t border-border/60 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            © {currentYear} {brandName}. {t(translations.footer.rights)}.
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center gap-4">
            {legalLinks.map((item, idx) => (
              <Link
                key={idx}
                to={item.href}
                className="hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
