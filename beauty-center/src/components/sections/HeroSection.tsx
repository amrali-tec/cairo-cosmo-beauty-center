// src/components/sections/HeroSection.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/locale-context";
import { siteConfig } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import heroBg from "@/assets/hero-bg.webp";
import heroBgMobile from "@/assets/hero-bg-mobile.webp";

type XY = { x: number; y: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export const HeroSection = () => {
  const { locale, t, translations, isRTL } = useLocale();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  const rafRef = useRef<number | null>(null);
  const targetRef = useRef<XY>({ x: 0, y: 0 });
  const currentRef = useRef<XY>({ x: 0, y: 0 });

  const [mounted, setMounted] = useState(false);
  const [disableMotion, setDisableMotion] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 40);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px), (prefers-reduced-motion: reduce)");
    const sync = () => setDisableMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const rotating = useMemo(() => {
    if (locale === "ar") {
      return [
        "نتائج طبيعية بدون مبالغة",
        "بروتوكولات آمنة وتقنيات حديثة",
        "خطة تناسب بشرتك… مش ترند",
      ];
    }

    return [
      "Natural results, never overdone",
      "Safe protocols with modern tech",
      "A plan for your skin, not trends",
    ];
  }, [locale]);

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let intervalId: any;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setIdx((v) => (v + 1) % rotating.length);
      }, 4500);
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [rotating]);

  const rotatingText = rotating[idx];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || disableMotion) return;

    let rect: DOMRect | null = null;

    const onEnter = () => {
      rect = el.getBoundingClientRect();
    };

    const onMove = (e: PointerEvent) => {
      if (!rect) rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const nx = clamp(px * 2 - 1, -1, 1);
      const ny = clamp(py * 2 - 1, -1, 1);

      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${nx * 10}px, ${ny * 8}px, 0) scale(1.05)`;
        bgRef.current.style.transition = "transform 0.3s cubic-bezier(0.2, 0, 0, 1)";
      }
    };

    const onLeave = () => {
      rect = null;
      if (bgRef.current) {
        bgRef.current.style.transform = "translate3d(0, 0, 0) scale(1.05)";
        bgRef.current.style.transition = "transform 0.5s ease-out";
      }
    };

    el.addEventListener("pointerenter", onEnter, { passive: true });
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [disableMotion]);

  return (
    <section
      ref={sectionRef as any}
      className="relative min-h-[75vh] md:min-h-[92vh] flex items-center overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* background */}
      <div className="absolute inset-0 z-0">

        <div ref={bgRef} className="absolute inset-0 will-change-transform">

          <picture>
            <source media="(max-width: 640px)" srcSet="/assets/hero-bg-mobile.webp" type="image/webp" />
            <img
              src={heroBg}
              alt="Cairo Cosmo Center Aesthetic Clinic"
              fetchpriority="high"
              loading="eager"
              decoding="async"
              width="1200"
              height="675"
              className="w-full h-full object-cover"
            />
          </picture>

        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/50" />

      </div>

      {/* content */}
      <div className="section-container relative z-10 py-16 md:py-20">

        <div
          className={cn(
            "relative max-w-2xl rounded-3xl p-6 md:p-10",
            "border bg-card/35 backdrop-blur-xl shadow-xl",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >

          <div className="inline-flex items-center gap-2 rounded-full border bg-background/40 px-3 py-1 text-xs text-muted-foreground">

            <span className="h-1.5 w-1.5 rounded-full bg-primary" />

            {locale === "ar"
              ? "تجميل طبي فاخر"
              : "Luxury Medical Aesthetics"}

          </div>

          <h1 className="mt-5 text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">

            <span className="hero-text-gradient">

              {t(translations.hero.title)}

            </span>

          </h1>

          <div className="mt-4 text-base md:text-lg text-muted-foreground min-h-[28px]">

            {rotatingText}

          </div>

          <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">

            {t(translations.hero.subtitle)}

          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-4">

            <Button
              variant="hero"
              size="xl"
              asChild
              className="w-full sm:w-auto"
            >
              <Link to={`/${locale}/book`} className="gap-2">

                {t(translations.hero.cta)}

                <ArrowIcon className="h-5 w-5" />

              </Link>

            </Button>

            <Button
              variant="whatsapp"
              size="xl"
              asChild
              className="w-full sm:w-auto"
            >

              <a
                href={siteConfig.getWhatsAppUrl(locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >

                <Phone className="h-5 w-5" />

                {t(translations.hero.whatsappCta)}

              </a>

            </Button>

          </div>

        </div>

      </div>

    </section>
  );
};
