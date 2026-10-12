"use client";

// src/components/sections/BeforeAfterSection.tsx
//
// قسم قبل/بعد
// • Slider سحب يمين/يسار للمقارنة
// • فلتر بالخدمة والكاتيجوري
// • ثنائي اللغة ar/en مع i18n
// • Tailwind CSS transitions
//
// الاستخدام:
//   <BeforeAfterSection />
//   <BeforeAfterSection initialCategory="laser" />
//   <BeforeAfterSection initialServiceId="botox" />

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { beforeAfterData } from "@/lib/data/beforeAfter";
import { mergedServicesBase } from "@/lib/data/services";
import { serviceCategoryLabels, type ServiceCategory } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BeforeAfterSectionProps {
  locale: Locale;
  initialCategory?: ServiceCategory | "all";
  initialServiceId?: string;
}

// ─── Translations ─────────────────────────────────────────────────────────────

const t = {
  ar: {
    sectionTitle: "النتائج تتكلم",
    sectionSubtitle: "قبل وبعد حقيقية من عملائنا",
    all: "الكل",
    filterByService: "الخدمة",
    filterByCategory: "التصنيف",
    noResults: "لا توجد نتائج لهذا الاختيار",
    imageAlt: "صورة قبل وبعد",
    noImage: "الصورة ستتوفر قريبًا",
  },
  en: {
    sectionTitle: "Results Speak",
    sectionSubtitle: "Real before & after from our clients",
    all: "All",
    filterByService: "Service",
    filterByCategory: "Category",
    noResults: "No results for this selection",
    imageAlt: "Before and after image",
    noImage: "Image coming soon",
  },
};

// ─── BeforeAfter Slider Card ───────────────────────────────────────────────────

interface SliderCardProps {
  beforeImage: string;
  afterImage: string;
  label: string;
  lang: "ar" | "en";
}

function SliderCard({ beforeImage, afterImage, label, lang }: SliderCardProps) {
  const strings = t[lang];
  const combinedImage = afterImage || beforeImage;

  return (
    <div
      className="group relative rounded-2xl overflow-hidden shadow-md bg-white border border-neutral-100
                 hover:shadow-xl transition-shadow duration-300 animate-fadeIn"
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-50">
        {combinedImage ? (
          <img
            src={combinedImage}
            alt={strings.imageAlt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 px-6 text-center">
            <span className="text-sm font-medium text-neutral-400">
              {strings.noImage}
            </span>
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-neutral-100">
        <p className="text-sm font-medium text-neutral-700 truncate">{label}</p>
      </div>
    </div>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────────

export function BeforeAfterSection({
  locale,
  initialCategory = "all",
  initialServiceId,
}: BeforeAfterSectionProps) {
  const lang = locale;
  const strings = t[lang] ?? t.ar;
  const isRtl = lang === "ar";

  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "all">(
    initialCategory,
  );
  const [activeServiceId, setActiveServiceId] = useState<string>(
    initialServiceId ?? "all",
  );
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const populatedItems = beforeAfterData.filter((item) =>
    Boolean(item.afterImage || item.beforeImage),
  );

  // Build category list from data
  const availableCategories = Array.from(
    new Set(
      populatedItems
        .map((item) => {
          const svc = mergedServicesBase.find((s) => s.id === item.serviceId);
          return svc?.category;
        })
        .filter(Boolean) as ServiceCategory[],
    ),
  );

  // Build service list (filtered by category)
  const availableServices = mergedServicesBase.filter((svc) => {
    const hasData = populatedItems.some((d) => d.serviceId === svc.id);
    const matchCat =
      activeCategory === "all" || svc.category === activeCategory;
    return hasData && matchCat;
  });

  // Filtered data
  const filteredData = populatedItems.filter((item) => {
    const svc = mergedServicesBase.find((s) => s.id === item.serviceId);
    if (!svc) return false;
    const matchCat =
      activeCategory === "all" || svc.category === activeCategory;
    const matchSvc =
      activeServiceId === "all" || item.serviceId === activeServiceId;
    return matchCat && matchSvc;
  });

  // Reset service filter when category changes
  const handleCategoryChange = (cat: ServiceCategory | "all") => {
    setActiveCategory(cat);
    setActiveServiceId("all");
  };

  const scrollSlider = (direction: "prev" | "next") => {
    const container = sliderTrackRef.current;
    if (!container) return;

    const amount = Math.max(container.clientWidth * 0.85, 280);
    const sign =
      direction === "next"
        ? isRtl
          ? -1
          : 1
        : isRtl
          ? 1
          : -1;

    container.scrollBy({
      left: amount * sign,
      behavior: "smooth",
    });
  };

  // ─── Pill Button ─────────────────────────────────────────────────────────────
  const Pill = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`
        whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200
        ${
          active
            ? "bg-[var(--color-primary,#b08d6a)] text-white shadow-sm"
            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
        }
      `}
    >
      {children}
    </button>
  );

  return (
    <section
      className="relative w-full py-16 md:py-24 bg-white overflow-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Subtle background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="mb-10 text-center animate-fadeIn">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary,#b08d6a)]">
            {strings.sectionSubtitle}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {strings.sectionTitle}
          </h2>
          {/* Decorative line */}
          <div className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-[var(--color-primary,#b08d6a)]" />
        </div>

        {/* ── Filters ── */}
        <div className="mb-8 space-y-3 animate-fadeIn">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            <Pill
              active={activeCategory === "all"}
              onClick={() => handleCategoryChange("all")}
            >
              {strings.all}
            </Pill>
            {availableCategories.map((cat) => (
              <Pill
                key={cat}
                active={activeCategory === cat}
                onClick={() => handleCategoryChange(cat)}
              >
                {serviceCategoryLabels[cat]?.[lang as "ar" | "en"] ?? cat}
              </Pill>
            ))}
          </div>

          {/* Service filter (shown only if multiple services exist) */}
          {availableServices.length > 1 && (
            <div className="flex flex-wrap gap-2">
              <Pill
                active={activeServiceId === "all"}
                onClick={() => setActiveServiceId("all")}
              >
                {strings.all}
              </Pill>
              {availableServices.map((svc) => (
                <Pill
                  key={svc.id}
                  active={activeServiceId === svc.id}
                  onClick={() => setActiveServiceId(svc.id)}
                >
                  {svc.title[lang as "ar" | "en"]}
                </Pill>
              ))}
            </div>
          )}
        </div>

        {/* ── Slider ── */}
        <div
          key={`${activeCategory}-${activeServiceId}`}
          className="transition-opacity duration-300"
        >
          {filteredData.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-neutral-200 text-neutral-400">
              {strings.noResults}
            </div>
          ) : (
            <div className="relative">
              <div className="mb-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => scrollSlider("prev")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50"
                  aria-label={lang === "ar" ? "السابق" : "Previous"}
                >
                  {isRtl ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => scrollSlider("next")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50"
                  aria-label={lang === "ar" ? "التالي" : "Next"}
                >
                  {isRtl ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div
                ref={sliderTrackRef}
                className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {filteredData.map((item, i) => {
                  const svc = mergedServicesBase.find(
                    (s) => s.id === item.serviceId,
                  );
                  const label =
                    svc?.title?.[lang as "ar" | "en"] ?? item.serviceId;
                  return (
                    <div
                      key={`${item.serviceId}-${i}`}
                      className="min-w-0 shrink-0 snap-start basis-[85%] sm:basis-[calc(50%-0.75rem)] xl:basis-[calc(33.333%-1rem)]"
                    >
                      <SliderCard
                        beforeImage={item.beforeImage}
                        afterImage={item.afterImage}
                        label={label}
                        lang={lang as "ar" | "en"}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default BeforeAfterSection;
