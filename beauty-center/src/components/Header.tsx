import { useEffect, useMemo, useState } from "react";
import { Menu, X, Phone, Globe, Search, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useLocale } from "@/lib/locale-context";
import { siteConfig, localeNames, Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useThemeMode } from "@/lib/use-theme-mode";
import { HeaderSearchOverlay } from "@/components/HeaderSearchOverlay";
import { useAdminAuth } from "@/lib/admin-auth";

type NavItem = {
  to: string;
  label: string;
  end: boolean;
};

export const Header = () => {
  const { locale, setLocale, dir, translations } = useLocale();
  const { isAuthenticated } = useAdminAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // ✅ detect dark/light mode based on <html class="dark">
  const { isDark } = useThemeMode();
  const logoSrc = isDark ? "/logo-light.png" : "/logo.png";
  const isAr = locale === "ar";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: NavItem[] = useMemo(() => {
    const isAr = locale === "ar";

    return [
      { to: `/${locale}`, label: isAr ? "الرئيسية" : "Home", end: true },
      {
        to: `/${locale}/services`,
        label: isAr ? "الخدمات" : "Services",
        end: false,
      },
      {
        to: `/${locale}/doctors`,
        label: isAr ? "الأطباء" : "Doctors",
        end: false,
      },
      {
        to: `/${locale}/offers`,
        label: isAr ? "العروض" : "Offers",
        end: false,
      },
      { to: `/${locale}/blog`, label: isAr ? "المدونة" : "Blog", end: false },
      { to: `/${locale}/about`, label: isAr ? "من نحن" : "About", end: true },
      {
        to: `/${locale}/faq`,
        label: isAr ? "الأسئلة الشائعة" : "FAQ",
        end: true,
      },
      {
        to: `/${locale}/contact`,
        label: isAr ? "تواصل" : "Contact",
        end: true,
      },
    ];
  }, [locale]);

  const toggleLocale = () => {
    const newLocale: Locale = locale === "ar" ? "en" : "ar";
    setLocale(newLocale);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "py-2 bg-background/90 backdrop-blur-2xl border-b border-primary/15 shadow-[0_10px_40px_hsl(var(--foreground)/0.08)]"
          : "py-4 bg-transparent",
      )}
      dir={dir}
    >
      <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center justify-between gap-3 rounded-[1.6rem] border px-3 py-2 transition-all md:px-4",
            isScrolled
              ? "border-transparent bg-transparent"
              : "border-primary/15 bg-background/70 shadow-[0_8px_30px_hsl(var(--primary)/0.08)] backdrop-blur-2xl",
          )}
        >
          {/* Logo */}
          <Link
            to={`/${locale}`}
            className="flex min-w-0 items-center gap-3 rounded-2xl px-2 py-1.5 transition-colors hover:bg-accent/40"
            aria-label={locale === "ar" ? "الصفحة الرئيسية" : "Home"}
          >
            <img
              src={logoSrc}
              alt="Cairo Cosmo"
              width="56"
              height="56"
              fetchpriority="high"
              decoding="async"
              className={cn(
                "h-12 w-12 rounded-2xl object-contain p-1 md:h-14 md:w-14 shadow-sm border border-primary/10",
                "bg-white/70 dark:bg-white/10",
              )}
              draggable={false}
            />

            <div className="hidden min-w-0 sm:block">
              <div className="truncate text-sm font-black text-foreground md:text-base tracking-tight">
                {isAr ? "مركز القاهرة الطبي" : "Cairo Cosmo Center"}
              </div>
              <div className="truncate text-[11px] text-primary font-semibold md:text-xs">
                {isAr ? "جراحات التجميل والليزر" : "Plastic Surgery & Laser"}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden min-w-0 flex-1 items-center justify-center px-2 lg:flex">
            <div className="flex items-center gap-0.5 rounded-full border border-primary/15 bg-background/80 px-2 py-1.5 backdrop-blur-xl shadow-inner">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className="whitespace-nowrap shrink-0 rounded-full px-3 py-1.5 text-xs font-bold text-foreground/80 transition-all hover:bg-primary/10 hover:text-primary"
                  activeClassName="bg-primary text-primary-foreground font-bold shadow-sm"
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden shrink-0 lg:flex items-center gap-2">

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="rounded-full border border-primary/15 bg-background/80 backdrop-blur text-foreground hover:text-primary hover:border-primary/40"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>

            <ThemeToggle />

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLocale}
              className="gap-2 rounded-full border border-primary/15 bg-background/80 px-4 backdrop-blur font-bold text-xs"
            >
              <Globe className="h-4 w-4" />
              <span>{localeNames[locale === "ar" ? "en" : "ar"]}</span>
            </Button>

            <Button variant="whatsapp" size="sm" asChild className="rounded-full font-bold text-xs">
              <a
                href={siteConfig.getWhatsAppUrl(locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-1.5"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden xl:inline">
                  {locale === "ar" ? "واتساب" : "WhatsApp"}
                </span>
              </a>
            </Button>

            <Button variant="hero" size="default" asChild className="rounded-full btn-primary-gradient border-0 font-bold px-6 shadow-md shadow-primary/20 hover:scale-105 transition-transform">
              <Link to={`/${locale}/book`}>
                {locale === "ar" ? "احجز الآن" : "Book Now"}
              </Link>
            </Button>
          </div>

          {/* Mobile Buttons */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="rounded-full border border-primary/10 bg-background/70 backdrop-blur"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLocale}
              aria-label="Toggle language"
              className="rounded-full border border-primary/10 bg-background/70 backdrop-blur"
            >
              <Globe className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="rounded-full border border-primary/10 bg-background/70 backdrop-blur"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 animate-slide-up pb-4 lg:hidden">
            <div className="overflow-hidden rounded-[1.75rem] border border-primary/10 bg-background/92 p-3 shadow-[0_20px_60px_hsl(var(--foreground)/0.1)] backdrop-blur-2xl">
              <div className="mb-3 rounded-2xl bg-[linear-gradient(135deg,hsl(var(--primary)/0.1),transparent)] p-4">
                <div className="text-sm font-semibold text-foreground">
                  {isAr ? "تنقّل سريع" : "Quick navigation"}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {isAr ? "الخدمات والصفحات الأساسية بين يديك." : "Core pages and actions in one place."}
                </div>
              </div>

              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent/50 hover:text-primary"
                    activeClassName="bg-primary/10 text-primary"
                  >
                    {item.label}
                  </NavLink>
                ))}

                <div className="mt-3 flex gap-2">
                  <Button variant="whatsapp" className="flex-1" asChild>
                    <a
                      href={siteConfig.getWhatsAppUrl(locale)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="justify-center"
                    >
                      <Phone className="h-4 w-4 me-2" />
                      {locale === "ar" ? "واتساب" : "WhatsApp"}
                    </a>
                  </Button>

                  <Button variant="hero" className="flex-1" asChild>
                    <Link
                      to={`/${locale}/book`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="justify-center"
                    >
                      {locale === "ar" ? "احجز الآن" : "Book Now"}
                    </Link>
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
      <HeaderSearchOverlay open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  );
};
