// src/components/Layout.tsx
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileStickyBar } from "@/components/MobileStickyBar";
import { useLocale } from "@/lib/locale-context";

export function Layout({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const brandAr = "مركز القاهرة الطبي لجراحات التجميل والليزر";
    const brandEn = "Cairo Cosmo Center";

    const defaultTitle = locale === "ar" ? brandAr : brandEn;

    // ✅ لو useSeo مش مغير العنوان، حط الافتراضي
    const hasCustomTitle =
      document.title &&
      document.title.trim().length > 0 &&
      document.title !== "Vite + React";

    if (!hasCustomTitle) document.title = defaultTitle;

    // ✅ تحسين عام: ضبط لغة واتجاه الصفحة
    document.documentElement.lang = locale === "ar" ? "ar" : "en";
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.style.colorScheme = "light";
  }, [locale]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 480);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {locale === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}
      </a>
      <Header />
      <div className="relative min-h-screen overflow-x-clip bg-background">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.08),transparent_52%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

        <main id="main-content" className="relative pt-24">
          {children}
        </main>
      </div>
      <Footer />
      <MobileStickyBar />

      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 md:bottom-6 end-4 md:end-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-background/95 text-primary shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground hover:shadow-primary/25"
          aria-label={locale === "ar" ? "العودة للأعلى" : "Back to top"}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
