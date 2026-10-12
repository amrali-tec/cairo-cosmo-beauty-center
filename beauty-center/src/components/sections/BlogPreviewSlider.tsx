// ===============================================
// src/components/sections/BlogPreviewSlider.tsx
// سلايدر المقالات الطبية والتجميلية الفاخر بالصفحة الرئيسية
// ===============================================

import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Sparkles,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Filter,
  Play,
  Pause,
  BookOpen,
  Tag,
  Stethoscope,
} from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { getTranslation } from "@/lib/i18n";
import { getPublishedAdminBlogPosts, AdminBlogPost } from "@/lib/admin/blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  limit?: number;
};

export function BlogPreviewSlider({ limit = 6 }: Props) {
  const { locale, isRTL } = useLocale();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [posts, setPosts] = useState<AdminBlogPost[]>(() => getPublishedAdminBlogPosts());

  // Listen for admin/sophia CMS updates
  useEffect(() => {
    const handleUpdate = () => {
      setPosts(getPublishedAdminBlogPosts());
    };
    window.addEventListener("cosmo:blog_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("cosmo:blog_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const categories = [
    { id: "all", ar: "🌟 الكل", en: "All" },
    { id: "laser", ar: "⚡ ليزر كانديلا وديكا", en: "Laser" },
    { id: "injections", ar: "💉 فيلر وبوتوكس", en: "Injectables" },
    { id: "skincare", ar: "💆‍♀️ العناية بالبشرة", en: "Skincare" },
  ];

  // Filter posts
  const filteredPosts = useMemo(() => {
    const sorted = posts.slice().sort(
      (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
    );

    if (activeCategory === "all") return sorted.slice(0, limit);

    return sorted
      .filter((post) => {
        const title = (getTranslation(post.title, "ar") || "").toLowerCase();
        const excerpt = (getTranslation(post.excerpt, "ar") || "").toLowerCase();
        const cat = (post.category || "").toLowerCase();

        if (activeCategory === "laser") {
          return title.includes("ليزر") || excerpt.includes("ليزر") || cat.includes("laser");
        }
        if (activeCategory === "injections") {
          return title.includes("فيلر") || title.includes("بوتوكس") || excerpt.includes("فيلر");
        }
        if (activeCategory === "skincare") {
          return title.includes("بشرة") || title.includes("هيدرافيشل") || excerpt.includes("نضارة");
        }
        return true;
      })
      .slice(0, limit);
  }, [posts, activeCategory, limit]);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  // Autoplay Slider Timer
  useEffect(() => {
    if (!isPlaying || filteredPosts.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredPosts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying, filteredPosts.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % (filteredPosts.length || 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredPosts.length) % (filteredPosts.length || 1));
  };

  const formatDate = (dateISO: string) =>
    new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateISO));

  if (!filteredPosts.length) return null;

  const currentFeatured = filteredPosts[currentIndex] || filteredPosts[0];
  const featuredTitle = getTranslation(currentFeatured.title, locale);
  const featuredExcerpt = getTranslation(currentFeatured.excerpt, locale);
  const featuredImage = currentFeatured.coverImage || currentFeatured.cardImage || "/assets/service-dermatology.jpg";
  const readingTime = Math.max(3, Math.ceil((featuredExcerpt.length + 220) / 110));

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-background via-card/40 to-background py-20 md:py-28"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.12),transparent_50%)]" />

      <div className="section-container relative space-y-10">
        {/* 1. Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{locale === "ar" ? "مختارات الأطباء • Clinical Editorial" : "Clinical Editorial Picks"}</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
              {locale === "ar" ? "أحدث المقالات والنصائح الطبية" : "Latest Aesthetic Articles"}
            </h2>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {locale === "ar"
                ? "تصفحي أحدث الأدلة الطبية والنصائح المعتمدة من استشاريي المركز لاختيار أفضل خطة تجميلية تناسب بشرتكِ."
                : "Explore evidence-based beauty tips, laser guides, and skincare advice from Cairo Cosmo specialists."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter Tabs */}
            <div className="flex items-center rounded-2xl border border-border/70 bg-card p-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  {locale === "ar" ? cat.ar : cat.en}
                </button>
              ))}
            </div>

            {/* View All Button */}
            <Button
              variant="outline"
              size="sm"
              asChild
              className="rounded-2xl border-primary/30 text-xs font-bold h-10 px-4 hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <Link to={`/${locale}/blog`} className="gap-1.5">
                <span>{locale === "ar" ? "كافة المقالات" : "All Articles"}</span>
                <ArrowIcon className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* 2. Hero Magazine Slider Showcase */}
        <div className="relative group">
          <div className="grid overflow-hidden rounded-[2.5rem] border border-border/80 bg-gradient-to-br from-card via-card/95 to-primary/5 shadow-2xl transition-all duration-500 lg:grid-cols-12 min-h-[460px]">
            {/* Left: Image Canvas (7 cols) */}
            <div className="relative lg:col-span-7 overflow-hidden min-h-[320px] lg:min-h-full">
              <img
                src={featuredImage}
                alt={featuredTitle}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

              {/* Floating Image Badges */}
              <div className="absolute top-5 start-5 flex items-center gap-2">
                <span className="rounded-full bg-primary text-primary-foreground px-3.5 py-1 text-xs font-black shadow-lg shadow-primary/30 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{locale === "ar" ? "مقال مميز" : "Featured"}</span>
                </span>

                <span className="rounded-full bg-background/85 backdrop-blur-md text-foreground border border-white/20 px-3 py-1 text-xs font-bold shadow-md flex items-center gap-1">
                  <Clock className="h-3 w-3 text-primary" />
                  <span>{readingTime} {locale === "ar" ? "دقائق قراءة" : "min read"}</span>
                </span>
              </div>

              {/* Slide Counter Overlay */}
              <div className="absolute bottom-5 start-5 text-white/90 text-xs font-bold bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                {currentIndex + 1} / {filteredPosts.length}
              </div>
            </div>

            {/* Right: Content & Metadata (5 cols) */}
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-xs font-bold border-primary/30 bg-primary/5 text-primary px-3 py-1 rounded-xl">
                    <Tag className="h-3 w-3 ml-1" />
                    <span>
                      {currentFeatured.category === "service"
                        ? locale === "ar" ? "تقنيات وأجهزة" : "Treatments"
                        : currentFeatured.category === "doctor"
                        ? locale === "ar" ? "استشارة استشاري" : "Doctor Insights"
                        : locale === "ar" ? "نصائح الجمال" : "Beauty Tips"}
                    </span>
                  </Badge>

                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-primary" />
                    <span>{formatDate(currentFeatured.dateISO)}</span>
                  </span>
                </div>

                <Link to={`/${locale}/blog/${currentFeatured.slug}`}>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground hover:text-primary transition-colors leading-snug">
                    {featuredTitle}
                  </h3>
                </Link>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-4 font-sans">
                  {featuredExcerpt}
                </p>
              </div>

              {/* Action Bar & Doctor Signature */}
              <div className="pt-6 border-t border-border/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <Stethoscope className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        {locale === "ar" ? "إشراف د. ناهد سمير" : "Supervised by Dr. Nahed"}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {locale === "ar" ? "استشاري الجلدية والتجميل" : "Aesthetic Dermatology"}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    asChild
                    className="rounded-xl btn-primary-gradient text-white text-xs font-bold h-10 px-4 gap-1.5 shadow-md shadow-primary/20 hover:scale-105 transition-all"
                  >
                    <Link to={`/${locale}/blog/${currentFeatured.slug}`}>
                      <span>{locale === "ar" ? "اقرأ المقال كاملاً" : "Read Full"}</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Slider Controls Ribbon */}
                <div className="flex items-center justify-between pt-2">
                  {/* Pagination Dots */}
                  <div className="flex items-center gap-1.5">
                    {filteredPosts.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          currentIndex === idx
                            ? "w-8 bg-primary shadow-xs"
                            : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Prev / Play / Next Controls */}
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="h-8 w-8 rounded-xl bg-card border-border/70 text-muted-foreground hover:text-foreground"
                      title={isPlaying ? "إيقاف التشغيل التلقائي" : "تشغيل العرض التلقائي"}
                    >
                      {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePrev}
                      className="h-8 w-8 rounded-xl bg-card border-border/70 hover:bg-primary hover:text-primary-foreground transition-all"
                      aria-label="Previous Slide"
                    >
                      <PrevIcon className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNext}
                      className="h-8 w-8 rounded-xl bg-card border-border/70 hover:bg-primary hover:text-primary-foreground transition-all"
                      aria-label="Next Slide"
                    >
                      <NextIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Quick Slider Cards Carousel */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
          {filteredPosts.map((post, idx) => {
            const isSelected = idx === currentIndex;
            const pTitle = getTranslation(post.title, locale);
            const pImage = post.cardImage || post.coverImage || "/assets/service-dermatology.jpg";

            return (
              <div
                key={post.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "cursor-pointer rounded-2xl border p-3 flex items-center gap-3.5 transition-all duration-300",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/15 scale-[1.02]"
                    : "border-border/60 bg-card/80 hover:border-primary/40 hover:bg-card"
                )}
              >
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <img src={pImage} alt={pTitle} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="text-[10px] text-primary font-bold flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    <span>{formatDate(post.dateISO)}</span>
                  </div>
                  <h4 className="text-xs font-black text-foreground truncate leading-snug">
                    {pTitle}
                  </h4>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {getTranslation(post.excerpt, locale)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
