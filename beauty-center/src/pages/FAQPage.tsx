import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useLocaleParam } from "@/lib/use-locale-param";
import { getTranslation, siteConfig } from "@/lib/i18n";
import { useSeo } from "@/hooks/useSeo";
import { homeFAQs } from "@/lib/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const BRAND_EN = "Cairo Cosmo Center";
const BRAND_AR = "مركز القاهرة الطبي لجراحات التجميل والليزر";

function safeText(input: string, max = 160) {
  const s = (input || "").replace(/\s+/g, " ").trim();
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trim() + "…";
}

export default function FAQPage() {
  const locale = useLocaleParam();
  const baseUrl = (siteConfig as any)?.url || "https://cairocosmo.online";
  const canonical = `${baseUrl}/${locale}/faq`;

  const seoTitle =
    locale === "ar" ? `الأسئلة الشائعة | ${BRAND_AR}` : `FAQ | ${BRAND_EN}`;

  const seoDescription =
    locale === "ar"
      ? safeText(
          "إجابات على أكثر الأسئلة شيوعاً حول خدمات التجميل والليزر والحجز والاستشارات. إذا لم تجد إجابتك، تواصل معنا عبر واتساب.",
          160,
        )
      : safeText(
          "Answers to common questions about our services, laser treatments, booking and consultations. If you need more help, contact us on WhatsApp.",
          160,
        );

  useSeo({ title: seoTitle, description: seoDescription, canonical });

  const jsonLd = useMemo(() => {
    const faqUrl = canonical;

    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "ar" ? "الرئيسية" : "Home",
          item: `${baseUrl}/${locale}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: locale === "ar" ? "الأسئلة الشائعة" : "FAQ",
          item: faqUrl,
        },
      ],
    };

    const faqPage = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${faqUrl}#faq`,
      url: faqUrl,
      inLanguage: locale === "ar" ? "ar" : "en",
      mainEntity: homeFAQs.map((f) => ({
        "@type": "Question",
        name: getTranslation(f.question, locale),
        acceptedAnswer: {
          "@type": "Answer",
          text: getTranslation(f.answer, locale),
        },
      })),
    };

    const webPage = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${faqUrl}#webpage`,
      url: faqUrl,
      name: seoTitle,
      description: seoDescription,
      isPartOf: {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: BRAND_EN,
      },
    };

    const compact = (obj: any) =>
      JSON.parse(
        JSON.stringify(obj, (_k, v) => (v === undefined ? undefined : v)),
      );

    return [compact(breadcrumb), compact(webPage), compact(faqPage)];
  }, [baseUrl, canonical, locale, seoDescription, seoTitle]);

  return (
    <div className="section-container py-10 md:py-14">
      {/* ✅ JSON-LD */}
      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold">
          {locale === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
        </h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          {locale === "ar"
            ? "هنا ستجد إجابات سريعة وواضحة. ولأي تفاصيل إضافية، تواصل معنا وسنساعدك."
            : "Quick, clear answers. For anything else, contact us and we’ll help you."}
        </p>

        {/* ✅ Internal links */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to={`/${locale}/services`}
            className="px-3 py-2 rounded-full border text-sm hover:bg-muted/30"
          >
            {locale === "ar" ? "الخدمات" : "Services"}
          </Link>
          <Link
            to={`/${locale}/doctors`}
            className="px-3 py-2 rounded-full border text-sm hover:bg-muted/30"
          >
            {locale === "ar" ? "الأطباء" : "Doctors"}
          </Link>
          <Link
            to={`/${locale}/contact`}
            className="px-3 py-2 rounded-full border text-sm hover:bg-muted/30"
          >
            {locale === "ar" ? "تواصل معنا" : "Contact"}
          </Link>
          <a
            href={siteConfig.getWhatsAppUrl(locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-full border text-sm hover:bg-muted/30"
          >
            {locale === "ar" ? "واتساب" : "WhatsApp"}
          </a>
        </div>

        {/* ✅ FAQ Accordion */}
        <div className="mt-8">
          <Accordion type="single" collapsible className="space-y-4">
            {homeFAQs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="bg-card rounded-2xl border px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-start hover:no-underline py-5">
                  <span className="font-medium text-foreground">
                    {getTranslation(faq.question, locale)}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {getTranslation(faq.answer, locale)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* ✅ CTA */}
        <div className="mt-10 rounded-2xl border bg-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">
              {locale === "ar" ? "لسه عندك سؤال؟" : "Still have a question?"}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {locale === "ar"
                ? "ابعت لنا على واتساب وسنرد بسرعة لتأكيد الحجز أو توضيح التفاصيل."
                : "Message us on WhatsApp for quick booking confirmation or details."}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={siteConfig.getWhatsAppUrl(locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm"
            >
              {locale === "ar" ? "افتح واتساب" : "Open WhatsApp"}
            </a>
            <Link
              to={`/${locale}/book`}
              className="px-4 py-3 rounded-xl border text-sm hover:bg-muted/30"
            >
              {locale === "ar" ? "احجز موعد" : "Book appointment"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
