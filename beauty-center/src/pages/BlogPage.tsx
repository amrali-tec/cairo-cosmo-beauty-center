import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLocale } from "@/lib/locale-context";
import { getTranslation, Locale } from "@/lib/i18n";
import { services } from "@/lib/data";
import { blogPosts, sortPostsNewestFirst } from "@/lib/blog";
import { getPublishedBlogPosts } from "@/lib/posts";
import { useSeo } from "@/hooks/useSeo";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";

type UiPost = {
  id: number | string;
  slug: string;
  title: { ar: string; en: string };
  excerpt: { ar: string; en: string };
  cardImage?: string;
  dateISO: string;
  serviceSlug?: string;
  source: "static" | "admin";
};

export default function BlogPage() {
  const { locale: localeFromUrl } = useParams<{ locale: Locale }>();
  const { locale: ctxLocale, dir } = useLocale();

  const locale: Locale =
    localeFromUrl === "en" || localeFromUrl === "ar"
      ? localeFromUrl
      : ctxLocale;

  const [serviceFilter, setServiceFilter] = useState<string>("all");

  useSeo({
    title: locale === "ar" ? "المدونة | كايرو كوزمو" : "Blog | Cairo Cosmo",
    description:
      locale === "ar"
        ? "مقالات طبية عن خدمات التجميل والليزر ونصائح الأطباء."
        : "Medical articles about aesthetic and laser services with doctors’ tips.",
    canonical: `${window.location.origin}/${locale}/blog`,
  });

  const filtered = useMemo(() => {
    const staticPosts: UiPost[] = [...blogPosts]
      .sort(sortPostsNewestFirst)
      .map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        cardImage: post.cardImage,
        dateISO: post.dateISO,
        serviceSlug: post.serviceSlug,
        source: "static" as const,
      }));

    const adminPosts: UiPost[] = getPublishedBlogPosts().map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      cardImage: post.cardImage || post.coverImage,
      dateISO: post.dateISO,
      serviceSlug: post.serviceSlug,
      source: "admin" as const,
    }));

    // ✅ Deduplicate by slug: admin posts override static posts if same slug exists
    const mapBySlug = new Map<string, UiPost>();

    for (const post of staticPosts) {
      if (post.slug) {
        mapBySlug.set(post.slug, post);
      }
    }

    for (const post of adminPosts) {
      if (post.slug) {
        mapBySlug.set(post.slug, post);
      }
    }

    const merged = Array.from(mapBySlug.values()).sort((a, b) => {
      return new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime();
    });

    if (serviceFilter === "all") return merged;

    return merged.filter((post) => post.serviceSlug === serviceFilter);
  }, [serviceFilter]);

  return (
    <div dir={dir} className="section-container py-10 md:py-14">
      <PageHeader
        title={{ ar: "المدونة", en: "Blog" }}
        description={{
          ar: "مقالات طبية ونصائح للعناية والجمال.",
          en: "Medical articles and beauty care tips.",
        }}
        ctas={[
          {
            label: { ar: "شوف العروض", en: "View offers" },
            href: `/${locale}/offers`,
            variant: "primary",
          },
          {
            label: { ar: "احجز", en: "Book" },
            href: `/${locale}/book`,
            variant: "outline",
          },
        ]}
      />

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">
            {locale === "ar" ? "المدونة" : "Blog"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {locale === "ar"
              ? "مقالات ونصائح طبية مرتبطة بالخدمات والدكاترة."
              : "Articles and medical tips linked to services and doctors."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">
            {locale === "ar" ? "فلترة بالخدمة" : "Filter by service"}
          </label>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className={cn("h-10 rounded-md border bg-background px-3 text-sm")}
          >
            <option value="all">
              {locale === "ar" ? "كل المقالات" : "All posts"}
            </option>

            {services.map((s) => (
              <option key={s.id} value={s.slug}>
                {getTranslation(s.title, locale)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          {locale === "ar"
            ? "لا توجد مقالات منشورة حاليًا."
            : "No published posts yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Link
              key={`${post.source}-${post.id}`}
              to={`/${locale}/blog/${post.slug}`}
              className="group card-elevated overflow-hidden rounded-2xl"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                {post.cardImage ? (
                  <img
                    src={post.cardImage}
                    alt={getTranslation(post.title, locale)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                    {locale === "ar" ? "صورة المقال" : "Post image"}
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="mb-2 text-xs text-muted-foreground">
                  {new Date(post.dateISO).toLocaleDateString(
                    locale === "ar" ? "ar-EG" : "en-US",
                  )}
                </div>

                <h3 className="line-clamp-2 text-xl font-semibold transition-colors group-hover:text-primary">
                  {getTranslation(post.title, locale)}
                </h3>

                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {getTranslation(post.excerpt, locale)}
                </p>

                {post.serviceSlug ? (
                  <div className="mt-4 inline-flex items-center rounded-full border px-3 py-1 text-xs">
                    {locale === "ar" ? "مرتبط بالخدمة:" : "Related service:"}
                    <span className="ms-1 font-medium">{post.serviceSlug}</span>
                  </div>
                ) : (
                  <div className="mt-4 inline-flex items-center rounded-full border px-3 py-1 text-xs">
                    {locale === "ar" ? "مقال من لوحة الإدارة" : "Admin post"}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
