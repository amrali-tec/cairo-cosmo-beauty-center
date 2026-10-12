// ===============================================
// src/components/sections/BlogSection.tsx
// منظومة أحدث المقالات الطبية والتجميلية المتقدمة
// ===============================================

import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  Clock,
  User,
  Calendar,
  Filter,
  Tag,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/lib/locale-context";
import { getTranslation } from "@/lib/i18n";
import { getPublishedAdminBlogPosts, AdminBlogPost } from "@/lib/admin/blog";
import { cn } from "@/lib/utils";

export const BlogSection = () => {
  const { locale, isRTL } = useLocale();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [posts, setPosts] = useState<AdminBlogPost[]>(() => getPublishedAdminBlogPosts());

  // Listen for blog updates from admin or Sophia
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
    { id: "all", ar: "🌟 جميع المقالات", en: "All Articles" },
    { id: "laser", ar: "⚡ أجهزة الليزر", en: "Laser Technology" },
    { id: "injections", ar: "💉 الفيلر والبوتوكس", en: "Aesthetic Injections" },
    { id: "skincare", ar: "💆‍♀️ العناية بالبشرة", en: "Clinical Skincare" },
    { id: "doctor", ar: "🩺 نصائح الأطباء", en: "Doctor Insights" },
  ];

  const filteredPosts = useMemo(() => {
    if (activeCategory === "all") return posts.slice(0, 4);

    return posts
      .filter((post) => {
        const title = (getTranslation(post.title, "ar") || "").toLowerCase();
        const excerpt = (getTranslation(post.excerpt, "ar") || "").toLowerCase();
        const cat = (post.category || "").toLowerCase();

        if (activeCategory === "laser") {
          return title.includes("ليزر") || excerpt.includes("ليزر") || cat.includes("laser");
        }
        if (activeCategory === "injections") {
          return title.includes("فيلر") || title.includes("بوتوكس") || excerpt.includes("فيلر") || excerpt.includes("حقن");
        }
        if (activeCategory === "skincare") {
          return title.includes("بشرة") || title.includes("هيدرافيشل") || excerpt.includes("نضارة") || title.includes("تقشير");
        }
        if (activeCategory === "doctor") {
          return post.doctorSlug || title.includes("دكتور") || title.includes("استشاري");
        }
        return true;
      })
      .slice(0, 4);
  }, [posts, activeCategory]);

  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-card/30 via-background to-card/30" dir={isRTL ? "rtl" : "ltr"}>
      <div className="section-container relative">
        {/* Section Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{locale === "ar" ? "الموسوعة الطبية والتجميلية" : "Clinical Beauty Hub"}</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
              {locale === "ar" ? "أحدث المقالات والنصائح الطبية" : "Latest Medical Articles & Tips"}
            </h2>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {locale === "ar"
                ? "محتوى طبي معتمد من استشاريي الجلدية والتجميل يشرح أحدث تقنيات الليزر، أسرار العناية بالبشرة، والتحضير لجلساتكِ بأمان."
                : "Board-certified aesthetic guides, post-laser skincare secrets, and clinical insights from our leading doctors."}
            </p>
          </div>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="rounded-2xl border-primary/30 text-xs font-black h-12 px-6 hover:bg-primary hover:text-primary-foreground transition-all shrink-0"
          >
            <Link to={`/${locale}/blog`} className="gap-2">
              <span>{locale === "ar" ? "تصفح كافة المقالات الطبية" : "Explore Full Medical Blog"}</span>
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Category Filters */}
        <div className="mb-10 flex flex-wrap items-center gap-2.5 pb-2 border-b border-border/50">
          <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 ml-2">
            <Filter className="h-3.5 w-3.5 text-primary" />
            <span>{locale === "ar" ? "المواضيع:" : "Categories:"}</span>
          </span>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-bold transition-all border",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105"
                  : "bg-card border-border/70 text-foreground hover:border-primary/50 hover:bg-muted/30",
              )}
            >
              {locale === "ar" ? cat.ar : cat.en}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPosts.map((post, idx) => {
            const titleStr = getTranslation(post.title, locale);
            const excerptStr = getTranslation(post.excerpt, locale);
            const readingTimeMinutes = Math.max(3, Math.ceil((excerptStr.length + 200) / 100));

            return (
              <Card
                key={post.id || idx}
                className="group rounded-[2.5rem] border border-border/70 bg-gradient-to-br from-card via-card/95 to-primary/5 overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/40 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Zoom & Gradient */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={post.cardImage || post.coverImage || "/assets/service-dermatology.jpg"}
                      alt={titleStr}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Reading Time & Verified Badge */}
                    <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 flex items-center gap-1.5">
                      <span className="rounded-full bg-background/80 backdrop-blur-md border border-white/20 text-foreground text-[10px] font-bold px-2.5 py-1 flex items-center gap-1 shadow-sm">
                        <Clock className="h-3 w-3 text-primary" />
                        <span>{readingTimeMinutes} {locale === "ar" ? "دقائق" : "min"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] text-primary font-bold">
                      <Tag className="h-3 w-3" />
                      <span>
                        {post.category === "service"
                          ? locale === "ar" ? "خدمات طبية" : "Treatments"
                          : post.category === "doctor"
                          ? locale === "ar" ? "استشارة استشاري" : "Doctor Advice"
                          : locale === "ar" ? "نصائح الجمال" : "Beauty Tips"}
                      </span>
                    </div>

                    <h3 className="text-sm md:text-base font-black text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {titleStr}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-sans">
                      {excerptStr}
                    </p>
                  </div>
                </div>

                {/* Footer Link & Author */}
                <div className="p-5 pt-0 border-t border-border/40 mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <User className="h-3 w-3 text-primary" />
                    <span>{locale === "ar" ? "فريق الاستشاريين" : "Medical Board"}</span>
                  </div>

                  <Link
                    to={`/${locale}/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-black text-primary group-hover:underline"
                  >
                    <span>{locale === "ar" ? "قراءة المقال" : "Read Article"}</span>
                    <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
