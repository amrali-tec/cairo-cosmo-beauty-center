// src/components/sections/DoctorsSection.tsx
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Facebook,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/locale-context";
import { doctors } from "@/lib/data";
import { getTranslation } from "@/lib/i18n";

export const DoctorsSection = () => {
  const { locale, t, translations, isRTL } = useLocale();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // ✅ يظهر فقط 3 دكاترة في الرئيسية
  const featuredDoctors = doctors.filter((d) =>
    ["dr-basim-zaki", "prof-ahmed-el-sherif", "prof-nahed-samir"].includes(
      d.slug,
    ),
  );

  return (
    <section className="py-16 md:py-24">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t(translations.common.ourDoctors)}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {locale === "ar"
              ? "نخبة من أفضل الأطباء المتخصصين في مجال التجميل والليزر"
              : "Elite team of specialized doctors in aesthetics and laser treatments"}
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredDoctors.map((doctor) => (
            <div key={doctor.id} className="group text-center">
              <Link
                to={`/${locale}/doctors/${doctor.slug}`}
                aria-label={
                  locale === "ar"
                    ? `عرض صفحة ${getTranslation(doctor.name, locale)}`
                    : `View ${getTranslation(doctor.name, locale)} profile`
                }
              >
                {/* Image */}
                <div className="relative mb-4 mx-auto w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-4 ring-accent group-hover:ring-primary transition-all duration-300">
                  <img
                    src={doctor.image}
                    alt={getTranslation(doctor.name, locale)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {getTranslation(doctor.name, locale)}
                </h3>
                <p className="text-sm text-primary mt-1">
                  {getTranslation(doctor.specialty, locale)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {getTranslation(doctor.experience, locale)}
                </p>
              </Link>

              {/* ✅ Social Links */}
              {doctor.socialLinks && (
                <div className="flex items-center justify-center gap-3 mt-3">
                  {doctor.socialLinks.facebook && (
                    <a
                      href={doctor.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}

                  {doctor.socialLinks.youtube && (
                    <a
                      href={doctor.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-red-500 transition"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10 flex items-center justify-center gap-3 flex-wrap">
          <Button variant="hero" size="lg" asChild>
            <Link to={`/${locale}/book`} className="gap-2">
              <Calendar className="h-5 w-5" />
              {t(translations.common.bookAppointment)}
            </Link>
          </Button>

          <Button variant="outline" size="lg" asChild>
            <Link to={`/${locale}/doctors`} className="gap-2">
              <ArrowIcon className="h-5 w-5" />
              {locale === "ar" ? "عرض كل الأطباء" : "View all doctors"}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
