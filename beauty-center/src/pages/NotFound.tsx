import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Home, Search, Calendar, PhoneCall, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { defaultLocale } from "@/lib/i18n";
import { useSeo } from "@/hooks/useSeo";

const NotFound = () => {
  const location = useLocation();
  const params = useParams<{ locale?: string }>();
  const locale = params.locale === "ar" || params.locale === "en" ? params.locale : defaultLocale;
  const isAr = locale === "ar";

  useSeo({
    title: isAr ? "404 - الصفحة غير موجودة | كايرو كوزمو" : "404 - Page Not Found | Cairo Cosmo",
    description: isAr ? "الصفحة المطلوبة غير موجودة أو تم نقلها." : "The requested page was not found or moved.",
    noindex: true,
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="flex min-h-[75vh] items-center justify-center section-container py-12"
    >
      <div className="card-elevated max-w-lg w-full rounded-3xl p-8 md:p-10 text-center border border-primary/20 space-y-6 bg-card relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-primary via-rose-400 to-amber-300" />

        {/* 404 Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
          <Sparkles className="h-4 w-4" />
          <span>{isAr ? "خطأ 404 - صفحة غير متوفرة" : "404 Error - Page Not Found"}</span>
        </div>

        <div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-rose-500 to-amber-500 tracking-tight">
            404
          </h1>
          <h2 className="mt-2 text-xl font-bold text-foreground">
            {isAr ? "عذراً، الصفحة التي تبحثين عنها غير موجودة!" : "Oops! The page you're looking for doesn't exist."}
          </h2>
          <p className="mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
            {isAr
              ? "قد يكون الرابط تغير أو تم مسحه. يمكنك استخدام الأزرار أدناه للوصول لأقسام العيادة والخدمات فوراً."
              : "The link might be broken or moved. Use the quick buttons below to navigate back."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button variant="hero" asChild className="rounded-xl font-bold text-xs gap-2">
            <Link to={`/${locale}`}>
              <Home className="h-4 w-4" />
              <span>{isAr ? "الرئيسية" : "Home"}</span>
            </Link>
          </Button>

          <Button variant="outline" asChild className="rounded-xl font-bold text-xs gap-2 border-primary/30">
            <Link to={`/${locale}/services`}>
              <Search className="h-4 w-4 text-primary" />
              <span>{isAr ? "تصفح الخدمات" : "Browse Services"}</span>
            </Link>
          </Button>

          <Button variant="outline" asChild className="rounded-xl font-bold text-xs gap-2 border-primary/30">
            <Link to={`/${locale}/book`}>
              <Calendar className="h-4 w-4 text-primary" />
              <span>{isAr ? "حجز موعد" : "Book Appointment"}</span>
            </Link>
          </Button>

          <Button variant="whatsapp" asChild className="rounded-xl font-bold text-xs gap-2">
            <Link to={`/${locale}/contact`}>
              <PhoneCall className="h-4 w-4" />
              <span>{isAr ? "تواصل معنا" : "Contact Us"}</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
