// src/components/sections/ServicesSection.tsx
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/locale-context";
import { services, serviceCategoryLabels } from "@/lib/data";
import { getTranslation } from "@/lib/i18n";

export const ServicesSection = () => {
  const { locale, t, translations, isRTL } = useLocale();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const featured = services.filter((s) => s.featured);
  const featuredServices = (featured.length ? featured : services).slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-card" dir={isRTL ? "rtl" : "ltr"}>
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t(translations.common.ourServices)}
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            {locale === "ar"
              ? "نقدم مجموعة شاملة من خدمات التجميل والعناية بالبشرة باستخدام أحدث التقنيات وبروتوكولات آمنة."
              : "We offer a comprehensive range of aesthetic and skincare services using the latest technologies and safe protocols."}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
            <Link
              key={service.id}
              to={`/${locale}/services/${service.slug}`}
              className="group card-elevated rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={getTranslation(service.title, locale)}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted/40 px-6 text-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      {locale === "ar" ? "الصورة غير متوفرة" : "Image not available"}
                    </span>
                  </div>
                )}

                {/* Category badge */}
                <div className="absolute top-4 start-4">
                  <span className="inline-flex items-center rounded-full bg-background/85 backdrop-blur px-3 py-1 text-xs font-medium border">
                    {getTranslation(
                      serviceCategoryLabels[service.category],
                      locale,
                    )}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {getTranslation(service.title, locale)}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {getTranslation(service.shortDescription, locale)}
                </p>

                <div className="mt-4 flex items-center gap-2 text-primary font-medium text-sm">
                  <span>{t(translations.common.learnMore)}</span>
                  <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button variant="outline" size="lg" asChild>
            <Link to={`/${locale}/services`} className="gap-2">
              {t(translations.common.viewAll)}
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
