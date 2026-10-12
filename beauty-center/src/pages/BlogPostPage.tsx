import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { blogPosts } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";
import { getTranslation, siteConfig } from "@/lib/i18n";
import { useLocaleParam } from "@/lib/use-locale-param";
import { ArticleBookingCta } from "@/components/sections/ArticleBookingCta";
import { useSeo } from "@/hooks/useSeo";
import { getPublishedBlogPosts } from "@/lib/posts";

import {
  Calendar,
  Share2,
  Copy,
  Check,
  Link as LinkIcon,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TocItem = { id: string; text: string; level: 2 | 3 };

const formatISODate = (iso: string, locale: "ar" | "en") => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[\u064B-\u065F]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const estimateReadingTime = (html: string) => {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return { words, minutes };
};

const videoMap: Record<string, string[]> = {
  // "botox-benefits": ["https://www.youtube.com/embed/VIDEO_ID"],
};

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

const isFaqHeading = (text: string) => {
  const t = normalize(text);
  return (
    t.includes("faq") ||
    t.includes("الاسئلة الشائعة") ||
    t.includes("الأسئلة الشائعة") ||
    t.includes("اسئلة شائعة") ||
    t.includes("أسئلة شائعة") ||
    t.includes("questions") ||
    t.includes("common questions")
  );
};

const isLinksHeading = (text: string) => {
  const t = normalize(text);
  return (
    t.includes("روابط") ||
    t.includes("موثوقة") ||
    t.includes("trusted") ||
    t.includes("resources") ||
    t.includes("medical links") ||
    t.includes("روابط طبية")
  );
};

const isFollowHeading = (text: string) => {
  const t = normalize(text);
  return (
    t.includes("تابعنا") ||
    t.includes("تابع") ||
    t.includes("follow") ||
    t.includes("social")
  );
};

const isCtaHeading = (text: string) => {
  const t = normalize(text);
  return (
    t.includes("احجزي") ||
    t.includes("احجز") ||
    t.includes("book") ||
    t.includes("استشارة") ||
    t.includes("consultation")
  );
};

function buildEnhancedHtml({
  locale,
  rawHtml,
  gallery,
  videos,
}: {
  locale: "ar" | "en";
  rawHtml: string;
  gallery?: { src: string; alt: { ar: string; en: string } }[];
  videos?: string[];
}): { html: string; toc: TocItem[] } {
  if (typeof window === "undefined" || !("DOMParser" in window)) {
    return { html: rawHtml, toc: [] };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(
    `<div id="__root__">${rawHtml}</div>`,
    "text/html",
  );
  const root = doc.getElementById("__root__");
  if (!root) return { html: rawHtml, toc: [] };

  const isNextH2 = (n: Node | null) =>
    n?.nodeType === 1 && (n as HTMLElement).tagName === "H2";

  const collectSection = (h2: HTMLElement) => {
    const nodes: Node[] = [];
    let cur = h2.nextSibling;
    while (cur && !isNextH2(cur)) {
      nodes.push(cur);
      cur = cur.nextSibling;
    }
    const parent = h2.parentNode as ParentNode | null;
    const insertBeforeNode = cur;
    return { nodes, parent, insertBeforeNode };
  };

  const cloneSectionIntoTemp = (h2: HTMLElement, nodes: Node[]) => {
    const temp = doc.createElement("div");
    temp.appendChild(h2.cloneNode(true));
    nodes.forEach((n) => temp.appendChild(n.cloneNode(true)));
    return temp;
  };

  const removeOriginalSection = (h2: HTMLElement, nodes: Node[]) => {
    nodes.forEach((n) => n.parentNode?.removeChild(n));
    h2.parentNode?.removeChild(h2);
  };

  if (gallery?.length) {
    const figures = root.querySelectorAll("figure[data-image-slot]");
    figures.forEach((fig) => {
      const slot = fig.getAttribute("data-image-slot");
      const idx = Math.max(0, (slot ? parseInt(slot, 10) : 1) - 1);
      const item = gallery[idx] || gallery[0];
      if (!item) {
        fig.remove();
        return;
      }
      const alt = locale === "ar" ? item.alt.ar : item.alt.en;
      fig.innerHTML = `
        <div class="not-prose my-8 overflow-hidden rounded-2xl border bg-card">
          <img src="${item.src}" alt="${alt}" loading="lazy" class="w-full h-auto object-cover" />
        </div>
      `;
    });
  }

  if (videos?.length) {
    const slots = root.querySelectorAll("div[data-video-slot]");
    slots.forEach((slotEl) => {
      const slot = slotEl.getAttribute("data-video-slot");
      const idx = Math.max(0, (slot ? parseInt(slot, 10) : 1) - 1);
      const url = videos[idx] || videos[0];
      if (!url) {
        slotEl.remove();
        return;
      }
      slotEl.innerHTML = `
        <div class="not-prose my-10 overflow-hidden rounded-2xl border bg-card">
          <div class="aspect-video w-full">
            <iframe
              src="${url}"
              title="YouTube video"
              class="h-full w-full"
              loading="lazy"
              referrerpolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      `;
    });
  }

  const toc: TocItem[] = [];
  const used = new Map<string, number>();

  root.querySelectorAll("h2, h3").forEach((h) => {
    const level = (h.tagName === "H2" ? 2 : 3) as 2 | 3;
    const text = (h.textContent || "").trim();
    if (!text) return;

    let id = slugify(text);
    if (!id) return;

    const count = used.get(id) ?? 0;
    used.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;

    (h as HTMLElement).setAttribute("id", id);
    (h as HTMLElement).classList.add("scroll-mt-28");
    toc.push({ id, text, level });
  });

  const h2s = Array.from(root.querySelectorAll("h2")) as HTMLElement[];

  h2s.forEach((h2) => {
    const title = (h2.textContent || "").trim();

    if (isFaqHeading(title)) {
      const { nodes, parent, insertBeforeNode } = collectSection(h2);
      if (!parent) return;

      const temp = cloneSectionIntoTemp(h2, nodes);
      const questions = Array.from(
        temp.querySelectorAll("h3"),
      ) as HTMLElement[];

      const wrapper = doc.createElement("section");
      wrapper.className =
        "not-prose my-10 rounded-3xl border bg-card p-6 md:p-8";

      const head = doc.createElement("div");
      head.className = "flex items-center gap-3 mb-4";
      head.innerHTML = `
        <div class="h-10 w-10 rounded-2xl border bg-background/60 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-primary">
            <path d="M12 18h.01M9.09 9a3 3 0 115.82 1c-.65.65-1.41 1.05-1.41 2v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div>
          <div class="text-lg font-semibold text-foreground">${title}</div>
          <div class="text-sm text-muted-foreground">${
            locale === "ar"
              ? "إجابات سريعة وواضحة على أكثر الأسئلة شيوعًا"
              : "Clear answers to the most common questions"
          }</div>
        </div>
      `;

      const contentBox = doc.createElement("div");
      contentBox.className = "space-y-3";

      if (questions.length) {
        questions.forEach((q) => {
          const qText = (q.textContent || "").trim();
          if (!qText) return;

          const answerParts: Node[] = [];
          let n = q.nextSibling;
          while (n) {
            const stop =
              n.nodeType === 1 &&
              ((n as HTMLElement).tagName === "H3" ||
                (n as HTMLElement).tagName === "H2");
            if (stop) break;
            answerParts.push(n);
            n = n.nextSibling;
          }

          const details = doc.createElement("details");
          details.className =
            "group rounded-2xl border bg-background/40 px-4 py-3 open:bg-background/70 transition-colors";

          const summary = doc.createElement("summary");
          summary.className =
            "cursor-pointer list-none font-semibold text-foreground flex items-center justify-between gap-3";
          summary.innerHTML = `
            <span>${qText}</span>
            <span class="text-muted-foreground group-open:rotate-180 transition-transform">⌄</span>
          `;

          const body = doc.createElement("div");
          body.className = "mt-3 text-sm text-muted-foreground leading-relaxed";
          body.innerHTML = answerParts
            .map((p) => (p as HTMLElement).outerHTML || p.textContent || "")
            .join("");

          details.appendChild(summary);
          details.appendChild(body);
          contentBox.appendChild(details);
        });
      } else {
        const fallback = doc.createElement("div");
        fallback.className = "text-sm text-muted-foreground leading-relaxed";
        fallback.innerHTML = temp.innerHTML;
        contentBox.appendChild(fallback);
      }

      wrapper.appendChild(head);
      wrapper.appendChild(contentBox);

      parent.insertBefore(wrapper, insertBeforeNode);
      removeOriginalSection(h2, nodes);
      return;
    }

    if (isLinksHeading(title)) {
      const { nodes, parent, insertBeforeNode } = collectSection(h2);
      if (!parent) return;

      const temp = cloneSectionIntoTemp(h2, nodes);
      const links = Array.from(
        temp.querySelectorAll("a"),
      ) as HTMLAnchorElement[];

      const wrapper = doc.createElement("section");
      wrapper.className =
        "not-prose my-10 rounded-3xl border bg-card p-6 md:p-8";

      const head = doc.createElement("div");
      head.className = "flex items-center gap-3 mb-4";
      head.innerHTML = `
        <div class="h-10 w-10 rounded-2xl border bg-background/60 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-primary">
            <path d="M10 13a5 5 0 007.07 0l1.41-1.41a5 5 0 00-7.07-7.07L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 11a5 5 0 01-7.07 0L5.52 9.59a5 5 0 017.07-7.07L14 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div>
          <div class="text-lg font-semibold text-foreground">${title}</div>
          <div class="text-sm text-muted-foreground">${
            locale === "ar"
              ? "مصادر طبية موثوقة لمعلومات أدق"
              : "Trusted medical sources for deeper reading"
          }</div>
        </div>
      `;

      const grid = doc.createElement("div");
      grid.className = "grid gap-3";

      links.forEach((a) => {
        const href = a.getAttribute("href") || "";
        if (!href) return;
        const text = (a.textContent || "").trim() || href;

        const card = doc.createElement("a");
        card.setAttribute("href", href);
        card.setAttribute("target", "_blank");
        card.setAttribute("rel", "nofollow noopener");
        card.className =
          "flex items-center justify-between gap-3 rounded-2xl border bg-background/40 px-4 py-3 hover:bg-background/70 transition-colors";

        const left = doc.createElement("div");
        left.className = "min-w-0";
        left.innerHTML = `
          <div class="font-semibold text-foreground line-clamp-1">${text}</div>
          <div class="text-xs text-muted-foreground line-clamp-1">${href}</div>
        `;

        const icon = doc.createElement("div");
        icon.className =
          "h-9 w-9 shrink-0 rounded-xl border bg-card flex items-center justify-center text-primary";
        icon.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M14 3h7v7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M21 14v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        `;

        card.appendChild(left);
        card.appendChild(icon);
        grid.appendChild(card);
      });

      wrapper.appendChild(head);
      wrapper.appendChild(grid);

      parent.insertBefore(wrapper, insertBeforeNode);
      removeOriginalSection(h2, nodes);
      return;
    }

    if (isFollowHeading(title)) {
      const { nodes, parent, insertBeforeNode } = collectSection(h2);
      if (!parent) return;

      const temp = cloneSectionIntoTemp(h2, nodes);
      const links = Array.from(
        temp.querySelectorAll("a"),
      ) as HTMLAnchorElement[];

      const wrapper = doc.createElement("section");
      wrapper.className =
        "not-prose my-10 rounded-3xl border bg-card p-6 md:p-8";

      const head = doc.createElement("div");
      head.className = "flex items-center gap-3 mb-4";
      head.innerHTML = `
        <div class="h-10 w-10 rounded-2xl border bg-background/60 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-primary">
            <path d="M18 8a6 6 0 10-12 0v7a4 4 0 004 4h4a4 4 0 004-4V8z" stroke="currentColor" stroke-width="2"/>
            <path d="M12 11v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div>
          <div class="text-lg font-semibold text-foreground">${title}</div>
          <div class="text-sm text-muted-foreground">${
            locale === "ar"
              ? "تابع أحدث النصائح والنتائج على منصاتنا"
              : "Follow for tips, updates, and results"
          }</div>
        </div>
      `;

      const chips = doc.createElement("div");
      chips.className = "flex flex-wrap gap-2";

      links.forEach((a) => {
        const href = a.getAttribute("href") || "";
        if (!href) return;
        const label = (a.textContent || "").trim() || href;

        const chip = doc.createElement("a");
        chip.setAttribute("href", href);
        chip.setAttribute("target", "_blank");
        chip.setAttribute("rel", "nofollow noopener");
        chip.className =
          "inline-flex items-center gap-2 rounded-full border bg-background/40 px-3 py-2 text-sm font-medium text-foreground hover:bg-background/70 transition-colors";
        chip.innerHTML = `
          <span class="h-2 w-2 rounded-full bg-primary"></span>
          <span>${label}</span>
        `;
        chips.appendChild(chip);
      });

      wrapper.appendChild(head);
      wrapper.appendChild(chips);

      parent.insertBefore(wrapper, insertBeforeNode);
      removeOriginalSection(h2, nodes);
      return;
    }

    if (isCtaHeading(title)) {
      const { nodes, parent, insertBeforeNode } = collectSection(h2);
      if (!parent) return;

      const wrapper = doc.createElement("section");
      wrapper.className =
        "not-prose my-10 overflow-hidden rounded-3xl border bg-card";

      const body = doc.createElement("div");
      body.className = "p-6 md:p-8";
      body.innerHTML = `
        <div class="flex items-start gap-4">
          <div class="h-12 w-12 rounded-2xl border bg-background/60 flex items-center justify-center text-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="min-w-0">
            <div class="text-lg font-semibold text-foreground">${title}</div>
            <div class="text-sm text-muted-foreground">${
              locale === "ar"
                ? "احجز/ي تقييم سريع وخطة تناسب هدفك بدون مبالغة."
                : "Book an assessment and a plan tailored to your goal."
            }</div>
            <div class="mt-4">
              <a href="/${locale}/booking" class="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                ${locale === "ar" ? "احجز الآن" : "Book now"}
              </a>
            </div>
          </div>
        </div>
      `;

      wrapper.appendChild(body);

      parent.insertBefore(wrapper, insertBeforeNode);
      removeOriginalSection(h2, nodes);
      return;
    }
  });

  root.querySelectorAll("h2").forEach((h2) => {
    const prev = h2.previousElementSibling;
    if (prev && prev.tagName !== "HR") {
      const hr = doc.createElement("hr");
      hr.className = "my-10 border-border";
      h2.parentNode?.insertBefore(hr, h2);
    }
  });

  return { html: root.innerHTML, toc };
}

export default function BlogPostPage() {
  const locale = useLocaleParam();
  const isRTL = locale === "ar";
  const { slug } = useParams();

  const adminPosts = useMemo(() => getPublishedBlogPosts(), []);
  const allPosts: BlogPost[] = useMemo(
    () => [...adminPosts, ...blogPosts],
    [adminPosts],
  );

  const post = allPosts.find((p) => p.slug === slug);

  const [activeId, setActiveId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const title = post
    ? getTranslation(post.title, locale)
    : locale === "ar"
      ? "المقال غير موجود"
      : "Post not found";

  const excerpt = post
    ? getTranslation(post.excerpt, locale)
    : locale === "ar"
      ? "المقال المطلوب غير متاح حاليًا."
      : "The requested article is currently unavailable.";

  const cover =
    post?.coverImage || post?.cardImage || siteConfig.defaultOgImage;

  const canonical = `${siteConfig.url}/${locale}/blog/${slug ?? ""}`;

  useSeo({
    title,
    description: excerpt,
    canonical,
    ogImage: cover,
    type: "article",
    keywords: title,
  });

  if (!post) {
    return (
      <div className="section-container py-10">
        <div className="rounded-2xl border bg-card p-6">
          {locale === "ar" ? "المقال غير موجود" : "Post not found"}
        </div>
      </div>
    );
  }

  const dateText = formatISODate(post.dateISO, locale);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(title);
  const shareLink = encodeURIComponent(shareUrl);

  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .sort(
      (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime(),
    )
    .slice(0, 3);

  const { html, toc } = useMemo(() => {
    const rawHtml = getTranslation(post.content, locale);
    const res = buildEnhancedHtml({
      locale,
      rawHtml,
      gallery: post.gallery,
      videos: videoMap[post.slug],
    });

    const trimmedToc = res.toc.length > 3 ? res.toc.slice(0, -3) : [];
    return { ...res, toc: trimmedToc };
  }, [locale, post]);

  const { minutes } = useMemo(() => {
    const rawHtml = getTranslation(post.content, locale);
    return estimateReadingTime(rawHtml);
  }, [locale, post]);

  const articleJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description: excerpt,
      image: cover.startsWith("http") ? cover : `${siteConfig.url}${cover}`,
      datePublished: post.dateISO,
      dateModified: post.dateISO,
      mainEntityOfPage: canonical,
      inLanguage: locale,
      author: {
        "@type": "Organization",
        name: siteConfig.name.en,
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name.en,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/logo.png`,
        },
      },
    }),
    [canonical, cover, excerpt, locale, post.dateISO, title],
  );

  useEffect(() => {
    if (!toc.length) return;
    const els = toc
      .map((t) => document.getElementById(t.id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0),
          );
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0.1, 0.25, 0.5, 0.75] },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [toc]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className="pb-24" dir={isRTL ? "rtl" : "ltr"}>
      <script type="application/ld+json">
        {JSON.stringify(articleJsonLd)}
      </script>

      <div className="fixed top-1/2 z-40 hidden -translate-y-1/2 xl:block">
        <div
          className={cn(
            "rounded-2xl border bg-card/90 p-3 shadow-sm backdrop-blur",
            isRTL ? "right-6" : "left-6",
          )}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
              <Share2 className="h-4 w-4" />
              {locale === "ar" ? "مشاركة" : "Share"}
            </div>

            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://wa.me/?text=${shareText}%0A${shareLink}`}
                target="_blank"
                rel="nofollow noopener"
              >
                {locale === "ar" ? "واتساب" : "WhatsApp"}
              </a>
            </Button>

            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`}
                target="_blank"
                rel="nofollow noopener"
              >
                Facebook
              </a>
            </Button>

            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareLink}`}
                target="_blank"
                rel="nofollow noopener"
              >
                X
              </a>
            </Button>

            <Button variant="outline" size="sm" onClick={copyLink}>
              <span className="inline-flex items-center gap-2">
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {locale === "ar" ? "نسخ" : "Copy"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      <header className="border-b bg-card/40">
        <div className="section-container py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              to={`/${locale}/blog`}
            >
              <span
                className={cn(
                  isRTL ? "inline-block rotate-180" : "inline-block",
                )}
              >
                ➜
              </span>
              {locale === "ar" ? "رجوع للمدونة" : "Back to blog"}
            </Link>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {dateText}
              </span>
              <span className="opacity-40">•</span>
              <span>
                {locale === "ar"
                  ? `${minutes} دقائق قراءة`
                  : `${minutes} min read`}
              </span>
            </div>
          </div>

          <div className="mt-6 max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-base text-muted-foreground md:text-lg">
              {excerpt}
            </p>
          </div>
        </div>
      </header>

      {cover ? (
        <div className="section-container mt-8">
          <div className="overflow-hidden rounded-3xl border bg-card">
            <div className="relative aspect-[16/7]">
              <img
                src={cover}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
            </div>
          </div>
        </div>
      ) : null}

      <main className="section-container mt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border bg-card p-6 md:p-10">
            <article
              className={cn(
                "prose max-w-none",
                "prose-neutral dark:prose-invert",
                "prose-headings:scroll-mt-28",
                "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
                "prose-strong:text-foreground",
                "prose-hr:border-border",
                "prose-ul:my-4 prose-li:my-1",
              )}
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <ArticleBookingCta className="mt-10" />
          </div>

          <aside className="space-y-6">
            {toc.length ? (
              <div className="rounded-3xl border bg-card p-6 lg:sticky lg:top-24">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="text-lg font-semibold">
                      {locale === "ar" ? "فهرس المقال" : "On this page"}
                    </h3>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {locale === "ar" ? "تنقل سريع" : "Quick nav"}
                  </span>
                </div>

                <div className="mt-4 space-y-1">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={cn(
                        "block rounded-xl px-3 py-2 text-sm transition-colors",
                        "hover:bg-background/60",
                        item.level === 3 && (isRTL ? "me-0 ms-4" : "ms-4"),
                        activeId === item.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {item.text}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="rounded-3xl border bg-card p-6">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                <h3 className="text-lg font-semibold">
                  {locale === "ar" ? "معلومة سريعة" : "Quick note"}
                </h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {locale === "ar"
                  ? "الأقسام زي الأسئلة الشائعة والروابط الطبية وتابعنا هتظهر كـ Cards منظمة تلقائيًا."
                  : "FAQ, trusted links, and follow sections are auto-styled into clean cards."}
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyLink}
                  className="w-full"
                >
                  <span className="inline-flex items-center gap-2">
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <LinkIcon className="h-4 w-4" />
                    )}
                    {locale === "ar" ? "نسخ رابط المقال" : "Copy link"}
                  </span>
                </Button>
              </div>
            </div>

            {related.length ? (
              <div className="rounded-3xl border bg-card p-6">
                <h3 className="text-lg font-semibold">
                  {locale === "ar" ? "مقالات مقترحة" : "Related posts"}
                </h3>

                <div className="mt-4 space-y-4">
                  {related.map((p) => {
                    const pTitle = getTranslation(p.title, locale);
                    const pDate = formatISODate(p.dateISO, locale);
                    const pImg = p.cardImage || p.coverImage;

                    return (
                      <Link
                        key={p.id}
                        to={`/${locale}/blog/${p.slug}`}
                        className="group flex gap-3 rounded-2xl border bg-background/40 p-3 transition-colors hover:bg-background/70"
                      >
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-card">
                          {pImg ? (
                            <img
                              src={pImg}
                              alt={pTitle}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : null}
                        </div>

                        <div className="min-w-0">
                          <div className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
                            {pTitle}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {pDate}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </main>

      <div className="fixed bottom-3 left-3 right-3 z-40 xl:hidden">
        <div className="rounded-2xl border bg-card/95 p-3 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Share2 className="h-4 w-4" />
              {locale === "ar" ? "مشاركة المقال" : "Share"}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://wa.me/?text=${shareText}%0A${shareLink}`}
                  target="_blank"
                  rel="nofollow noopener"
                >
                  {locale === "ar" ? "واتساب" : "WA"}
                </a>
              </Button>

              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`}
                  target="_blank"
                  rel="nofollow noopener"
                >
                  FB
                </a>
              </Button>

              <Button variant="outline" size="sm" onClick={copyLink}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
