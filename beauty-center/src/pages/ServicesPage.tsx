import { Link } from "react-router-dom";
import { services } from "@/lib/data";
import { getTranslation, siteConfig } from "@/lib/i18n";
import { useLocaleParam } from "../lib/use-locale-param";
import { PageHeader } from "@/components/PageHeader";
import { useSeo } from "@/hooks/useSeo";
import { getAllAdminServices } from "@/lib/admin/services";
import { useMemo } from "react";

export default function ServicesPage() {
  const locale = useLocaleParam();
  const canonical = `${siteConfig.url}/${locale}/services`;
  const mergedServices = useMemo(() => {
    const adminServices = getAllAdminServices();
    const activeServices =
      adminServices.length > 0
        ? adminServices.filter((service) => service.status === "published")
        : services;

    return activeServices;
  }, []);

  useSeo({
    title: locale === "ar" ? "الخدمات" : "Services",
    description:
      locale === "ar"
        ? "استعرض خدمات كايرو كوزمو سنتر في الليزر، الحقن التجميلية، العناية بالبشرة، الشعر، والاستشارات الطبية."
        : "Explore Cairo Cosmo Center services in laser, injectables, skincare, hair treatments, and medical consultations.",
    canonical,
    keywords:
      locale === "ar"
        ? "خدمات التجميل, ليزر, بوتوكس, هيدرافيشل, علاج الشعر"
        : "aesthetic services, laser, botox, hydrafacial, hair treatments",
  });

  return (
    <div className="section-container py-10">
      <PageHeader
        title={{ ar: "الخدمات", en: "Services" }}
        description={{
          ar: "اختر الخدمة المناسبة واستكشف التفاصيل.",
          en: "Pick the right service and explore details.",
        }}
        ctas={[
          {
            label: { ar: "احجز الآن", en: "Book now" },
            href: `/${locale}/book`,
            variant: "primary",
          },
          {
            label: { ar: "واتساب", en: "WhatsApp" },
            href: siteConfig.getWhatsAppUrl(locale),
            variant: "outline",
            external: true,
          },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mergedServices.map((s) => (
          <Link
            key={s.id}
            to={`/${locale}/services/${s.slug}`}
            className="group card-elevated rounded-2xl overflow-hidden"
          >
            <div className="aspect-[4/3] overflow-hidden">
              {s.image ? (
                <img
                  src={s.image}
                  alt={getTranslation(s.title, locale)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted/40 px-6 text-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {locale === "ar"
                      ? "الصورة غير متوفرة"
                      : "Image not available"}
                  </span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {getTranslation(s.title, locale)}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {getTranslation(s.shortDescription, locale)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
