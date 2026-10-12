// src/hooks/useSeo.ts
import { useEffect } from "react";
import { useLocale } from "@/lib/locale-context";
import { siteConfig } from "@/lib/i18n";

type SeoInput = {
  title: string; // عنوان الصفحة فقط
  description: string;
  ogImage?: string;
  canonical?: string;
  type?: "website" | "article";
  keywords?: string;
  noindex?: boolean;
};

function upsertMeta(
  nameOrProp: "name" | "property",
  key: string,
  content: string,
) {
  const selector = `meta[${nameOrProp}="${key}"]`;
  let tag = document.querySelector(selector) as HTMLMetaElement | null;

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(nameOrProp, key);
    document.head.appendChild(tag);
  }

  tag.content = content;
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;

  let tag = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!tag) {
    tag = document.createElement("link");
    tag.rel = rel;
    if (hreflang) tag.hreflang = hreflang;
    document.head.appendChild(tag);
  }

  tag.href = href;
}

export function useSeo({
  title,
  description,
  ogImage,
  canonical,
  type = "website",
  keywords,
  noindex = false,
}: SeoInput) {
  const { locale } = useLocale();

  useEffect(() => {
    const brandAr = "مركز القاهرة الطبي لجراحات التجميل والليزر";
    const brandEn = "Cairo Cosmo Center";
    const brand = locale === "ar" ? brandAr : brandEn;

    const fullTitle = title?.trim() ? `${title} | ${brand}` : brand;
    const resolvedCanonical =
      canonical || `${siteConfig.url}${window.location.pathname}`;
    const resolvedOgImage = ogImage
      ? ogImage.startsWith("http")
        ? ogImage
        : `${siteConfig.url}${ogImage}`
      : `${siteConfig.url}${siteConfig.defaultOgImage}`;
    const alternateLocale = locale === "ar" ? "en" : "ar";
    const alternateUrl = resolvedCanonical.replace(
      /\/(ar|en)(?=\/|$)/,
      `/${alternateLocale}`,
    );

    document.title = fullTitle;

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", resolvedOgImage);
    upsertMeta("name", "author", brand);
    upsertMeta("name", "theme-color", "#9d2f69");
    if (keywords?.trim()) upsertMeta("name", "keywords", keywords);

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", resolvedCanonical);
    upsertMeta("property", "og:site_name", siteConfig.name.en);
    upsertMeta("property", "og:image", resolvedOgImage);

    // Locale OG
    upsertMeta("property", "og:locale", locale === "ar" ? "ar_EG" : "en_US");
    upsertMeta(
      "property",
      "og:locale:alternate",
      alternateLocale === "ar" ? "ar_EG" : "en_US",
    );

    upsertLink("canonical", resolvedCanonical);
    upsertLink("alternate", resolvedCanonical, locale);
    upsertLink("alternate", alternateUrl, alternateLocale);
    upsertLink("alternate", resolvedCanonical.replace(/\/(ar|en)(?=\/|$)/, "/ar"), "x-default");
  }, [title, description, ogImage, canonical, type, locale, keywords, noindex]);
}
