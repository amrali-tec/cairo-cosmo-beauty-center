import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Stethoscope, BriefcaseMedical, FileText, X } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { Link } from "react-router-dom";
import { services as staticServices, doctors as staticDoctors } from "@/lib/data";
import { blogPosts as staticPosts } from "@/lib/blog";
import { getAllAdminServices } from "@/lib/admin/services";
import { getAllAdminDoctors } from "@/lib/admin/doctors";
import { getAllAdminBlogPosts } from "@/lib/admin/blog";

function normalizeArabicText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[\u064B-\u065F]/g, "") // Remove harakat
    .replace(/[أإآ]/g, "ا") // Normalize alef
    .replace(/ة/g, "ه") // Normalize taa marbouta
    .replace(/ى/g, "ي"); // Normalize alef maqsura
}

export function HeaderSearchOverlay({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { locale, isRTL } = useLocale();
  const [query, setQuery] = useState("");

  const allServicesList = useMemo(() => {
    const adminSvcs = getAllAdminServices();
    if (adminSvcs && adminSvcs.length > 0) {
      return adminSvcs.filter((s) => s.status === "published");
    }
    return staticServices;
  }, []);

  const allDoctorsList = useMemo(() => {
    const adminDocs = getAllAdminDoctors();
    if (adminDocs && adminDocs.length > 0) {
      return adminDocs.filter((d) => d.status === "published");
    }
    return staticDoctors;
  }, []);

  const allPostsList = useMemo(() => {
    const adminPosts = getAllAdminBlogPosts();
    if (adminPosts && adminPosts.length > 0) {
      return adminPosts.filter((p) => p.status === "published");
    }
    return staticPosts;
  }, []);

  const results = useMemo(() => {
    const qNorm = normalizeArabicText(query);
    if (!qNorm) return { services: [], doctors: [], posts: [] };

    const matchedServices = allServicesList
      .filter((s) => {
        const titleAr = normalizeArabicText(typeof s.title === "object" ? s.title.ar : s.title);
        const titleEn = normalizeArabicText(typeof s.title === "object" ? s.title.en : s.title);
        const descAr = normalizeArabicText(typeof s.shortDescription === "object" ? s.shortDescription.ar : s.shortDescription || "");
        const descEn = normalizeArabicText(typeof s.shortDescription === "object" ? s.shortDescription.en : s.shortDescription || "");
        return titleAr.includes(qNorm) || titleEn.includes(qNorm) || descAr.includes(qNorm) || descEn.includes(qNorm);
      })
      .slice(0, 4);

    const matchedDoctors = allDoctorsList
      .filter((d) => {
        const nameAr = normalizeArabicText(typeof d.name === "object" ? d.name.ar : d.name);
        const nameEn = normalizeArabicText(typeof d.name === "object" ? d.name.en : d.name);
        const specAr = normalizeArabicText(typeof d.specialty === "object" ? d.specialty.ar : d.specialty || "");
        const specEn = normalizeArabicText(typeof d.specialty === "object" ? d.specialty.en : d.specialty || "");
        const bioAr = normalizeArabicText(typeof d.bio === "object" ? d.bio.ar : d.bio || "");
        return nameAr.includes(qNorm) || nameEn.includes(qNorm) || specAr.includes(qNorm) || specEn.includes(qNorm) || bioAr.includes(qNorm);
      })
      .slice(0, 4);

    const matchedPosts = allPostsList
      .filter((p) => {
        const titleAr = normalizeArabicText(typeof p.title === "object" ? p.title.ar : p.title);
        const titleEn = normalizeArabicText(typeof p.title === "object" ? p.title.en : p.title);
        const excAr = normalizeArabicText(typeof p.excerpt === "object" ? p.excerpt.ar : p.excerpt || "");
        return titleAr.includes(qNorm) || titleEn.includes(qNorm) || excAr.includes(qNorm);
      })
      .slice(0, 4);

    return {
      services: matchedServices,
      doctors: matchedDoctors,
      posts: matchedPosts,
    };
  }, [query, allServicesList, allDoctorsList, allPostsList]);

  const totalCount =
    results.services.length + results.doctors.length + results.posts.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-[2.5rem] p-6 md:p-8" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader className="border-b border-border/60 pb-4">
          <DialogTitle className="text-xl font-bold text-foreground flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              {locale === "ar" ? "البحث الشامل بالمركز" : "Instant Search"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Search Bar Input */}
          <div className="relative">
            <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                locale === "ar"
                  ? "ابحث عن خدمة، طبيب، أو مقال طبي (مثل: ليزر، بوتوكس، د. باسم)..."
                  : "Search services, doctors, or articles..."
              }
              className="h-14 rounded-2xl pr-12 text-base bg-background border-primary/30 focus-visible:ring-primary"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          {/* Quick Suggestions Tags when empty */}
          {!query ? (
            <div className="space-y-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                {locale === "ar" ? "كلمات دليليلة شائعة (انقر للبحث المباشر):" : "Popular Searches (click to search):"}
              </span>
              <div className="flex flex-wrap gap-2">
                {["ليزر", "بوتوكس", "ناهد", "باسم", "هيدرافيشل", "تجميل"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="rounded-xl border border-border bg-muted/40 px-3.5 py-1.5 text-xs font-semibold hover:border-primary hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Search Results Display */}
          {query ? (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
              {totalCount === 0 ? (
                <div className="p-12 text-center text-muted-foreground rounded-2xl border border-dashed">
                  <Search className="mx-auto h-10 w-10 text-primary/30 mb-2" />
                  <p className="font-bold text-foreground">
                    {locale === "ar" ? "لم نجد نتائج مطابقة للبحث حالياً" : "No matching results found"}
                  </p>
                  <p className="text-xs mt-1">جرب البحث بكلمات أخرى مثل "ليزر" أو "ناهد" أو "علاج"</p>
                </div>
              ) : (
                <>
                  {/* Services Results */}
                  {results.services.length > 0 ? (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase">
                        <BriefcaseMedical className="h-4 w-4" />
                        {locale === "ar" ? "الخدمات الطبية:" : "Medical Services:"}
                      </span>
                      <div className="grid gap-2">
                        {results.services.map((s) => {
                          const titleStr = typeof s.title === "object" ? s.title[locale] || s.title.ar : s.title;
                          const descStr = typeof s.shortDescription === "object" ? s.shortDescription[locale] || s.shortDescription.ar : s.shortDescription || "";
                          return (
                            <Link
                              key={s.slug}
                              to={`/${locale}/services/${s.slug}`}
                              onClick={() => onOpenChange(false)}
                              className="p-3.5 rounded-2xl border border-border/70 bg-card hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-between group"
                            >
                              <div>
                                <div className="font-bold text-sm text-foreground">{titleStr}</div>
                                <div className="text-xs text-muted-foreground line-clamp-1">{descStr}</div>
                              </div>
                              <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                {locale === "ar" ? "التفاصيل ⬅️" : "View ➡️"}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {/* Doctors Results */}
                  {results.doctors.length > 0 ? (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase">
                        <Stethoscope className="h-4 w-4" />
                        {locale === "ar" ? "الأطباء والاستشاريين:" : "Consultants:"}
                      </span>
                      <div className="grid gap-2">
                        {results.doctors.map((d) => {
                          const nameStr = typeof d.name === "object" ? d.name[locale] || d.name.ar : d.name;
                          const specStr = typeof d.specialty === "object" ? d.specialty[locale] || d.specialty.ar : d.specialty || "";
                          const imgStr = d.image || (d as any).avatar || "/assets/logo-outbg.png";
                          return (
                            <Link
                              key={d.slug}
                              to={`/${locale}/doctors/${d.slug}`}
                              onClick={() => onOpenChange(false)}
                              className="p-3.5 rounded-2xl border border-border/70 bg-card hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3">
                                <img src={imgStr} alt={nameStr} className="h-9 w-9 rounded-full object-cover shrink-0 border border-primary/20 bg-muted" />
                                <div>
                                  <div className="font-bold text-sm text-foreground">{nameStr}</div>
                                  <div className="text-xs text-primary font-semibold">{specStr}</div>
                                </div>
                              </div>
                              <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                {locale === "ar" ? "الملف الطبي ⬅️" : "Profile ➡️"}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {/* Articles Results */}
                  {results.posts.length > 0 ? (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase">
                        <FileText className="h-4 w-4" />
                        {locale === "ar" ? "المقالات والنصائح الطبية:" : "Articles & Advice:"}
                      </span>
                      <div className="grid gap-2">
                        {results.posts.map((p) => {
                          const titleStr = typeof p.title === "object" ? p.title[locale] || p.title.ar : p.title;
                          const excStr = typeof p.excerpt === "object" ? p.excerpt[locale] || p.excerpt.ar : p.excerpt || "";
                          return (
                            <Link
                              key={p.slug}
                              to={`/${locale}/blog/${p.slug}`}
                              onClick={() => onOpenChange(false)}
                              className="p-3.5 rounded-2xl border border-border/70 bg-card hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-between group"
                            >
                              <div>
                                <div className="font-bold text-sm text-foreground">{titleStr}</div>
                                <div className="text-xs text-muted-foreground line-clamp-1">{excStr}</div>
                              </div>
                              <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                {locale === "ar" ? "قراءة المقال ⬅️" : "Read ➡️"}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
