// src/pages/DoctorDetailPage.tsx
import { Link, useParams } from "react-router-dom";
import { Facebook, Globe, Instagram, Youtube } from "lucide-react";
import { doctors } from "@/lib/data";
import { getTranslation, siteConfig } from "@/lib/i18n";
import { useLocaleParam } from "@/lib/use-locale-param";
import { useSeo } from "@/hooks/useSeo";
import { getAllAdminDoctors } from "@/lib/admin/doctors";

export default function DoctorDetailPage() {
  const locale = useLocaleParam();
  const { slug } = useParams();

  const adminDoctors = getAllAdminDoctors();
  const activeDoctors =
    adminDoctors.length > 0
      ? adminDoctors.filter((doctor) => doctor.status === "published")
      : doctors;

  const doctor = activeDoctors.find((d) => d.slug === slug);
  const doctorName = doctor
    ? getTranslation(doctor.name, locale)
    : locale === "ar"
      ? "الدكتور غير موجود"
      : "Doctor not found";
  const doctorSpecialty = doctor
    ? getTranslation(doctor.specialty, locale)
    : locale === "ar"
      ? "الصفحة غير متاحة"
      : "Profile unavailable";

  useSeo({
    title: doctorName,
    description:
      doctor && doctorSpecialty
        ? locale === "ar"
          ? `${doctorName} - ${doctorSpecialty} في كايرو كوزمو سنتر. تعرف على نبذة الطبيب ومواعيد العمل واحجز موعدك.`
          : `${doctorName} - ${doctorSpecialty} at Cairo Cosmo Center. Explore profile details, working days, and book your appointment.`
        : locale === "ar"
          ? "الملف المطلوب غير متاح حاليًا."
          : "The requested doctor profile is currently unavailable.",
    canonical: `${siteConfig.url}/${locale}/doctors/${slug ?? ""}`,
    ogImage: doctor?.image || siteConfig.defaultOgImage,
    keywords: doctor
      ? `${doctorName}, ${doctorSpecialty}, Cairo Cosmo Center`
      : doctorName,
  });

  if (!doctor) {
    return (
      <div className="section-container py-16">
        <div className="rounded-3xl border bg-card p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold">
            {locale === "ar" ? "الدكتور غير موجود" : "Doctor not found"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {locale === "ar"
              ? "الصفحة التي تبحث عنها غير متاحة حالياً."
              : "The page you are looking for is currently unavailable."}
          </p>
          <Link
            to={`/${locale}/doctors`}
            className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            {locale === "ar" ? "العودة إلى الأطباء" : "Back to doctors"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-10 md:py-14">
      <div className="mb-8">
        <Link
          className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
          to={`/${locale}/doctors`}
        >
          {locale === "ar" ? "← رجوع للأطباء" : "← Back to doctors"}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <div className="aspect-[4/5] overflow-hidden bg-muted">
              <img
                src={doctor.image}
                alt={doctorName}
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>

            <div className="p-6">
              <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {getTranslation(doctor.specialty, locale)}
              </div>

              <h1 className="mt-4 text-2xl font-bold md:text-3xl">
                {getTranslation(doctor.name, locale)}
              </h1>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {locale === "ar"
                  ? "نقدم لك رعاية طبية باحترافية واهتمام بالتفاصيل لضمان أفضل تجربة علاجية ممكنة."
                  : "Providing professional medical care with attention to detail for the best possible patient experience."}
              </p>

              {doctor.socialLinks &&
                (doctor.socialLinks.facebook ||
                  doctor.socialLinks.youtube ||
                  doctor.socialLinks.instagram ||
                  doctor.socialLinks.website) && (
                  <div className="mt-5">
                    <p className="mb-3 text-sm font-medium text-foreground">
                      {locale === "ar" ? "روابط التواصل" : "Social Links"}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      {doctor.socialLinks.facebook && (
                        <a
                          href={doctor.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Facebook - ${doctorName}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-primary hover:text-primary"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}

                      {doctor.socialLinks.youtube && (
                        <a
                          href={doctor.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`YouTube - ${doctorName}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-red-500 hover:text-red-500"
                        >
                          <Youtube className="h-5 w-5" />
                        </a>
                      )}

                      {doctor.socialLinks.instagram && (
                        <a
                          href={doctor.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Instagram - ${doctorName}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-pink-500 hover:text-pink-500"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}

                      {doctor.socialLinks.website && (
                        <a
                          href={doctor.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Website - ${doctorName}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-primary hover:text-primary"
                        >
                          <Globe className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={`/${locale}/contact`}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  {locale === "ar" ? "احجز موعد" : "Book Appointment"}
                </Link>

                <Link
                  to={`/${locale}/doctors`}
                  className="inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-medium transition hover:bg-muted"
                >
                  {locale === "ar" ? "عرض باقي الأطباء" : "View All Doctors"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border bg-card p-6 md:p-8 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              {locale === "ar" ? "نبذة تعريفية" : "About the Doctor"}
            </p>

            <h2 className="mt-3 text-2xl font-bold md:text-3xl leading-snug">
              {getTranslation(doctor.name, locale)}
            </h2>

            <p className="mt-2 text-base text-muted-foreground">
              {getTranslation(doctor.specialty, locale)}
            </p>

            <div className="mt-6 h-px w-full bg-border" />

            <p className="mt-6 text-base leading-8 text-foreground/90">
              {getTranslation(doctor.bio, locale)}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <p className="text-sm font-medium text-primary">
                {locale === "ar" ? "أيام العمل" : "Working Days"}
              </p>
              <p className="mt-3 text-lg font-semibold leading-7">
                {getTranslation(doctor.workingDays, locale)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {locale === "ar"
                  ? "يمكنك التواصل معنا لتأكيد المواعيد المتاحة."
                  : "Contact us to confirm available appointment times."}
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <p className="text-sm font-medium text-primary">
                {locale === "ar" ? "معلومات إضافية" : "Additional Info"}
              </p>
              <p className="mt-3 text-lg font-semibold">
                {locale === "ar" ? "رعاية طبية مخصصة" : "Personalized Care"}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {locale === "ar"
                  ? "نهتم بتقديم تجربة علاجية مريحة وواضحة تبدأ من الاستشارة وحتى المتابعة."
                  : "We focus on delivering a clear and comfortable care journey from consultation to follow-up."}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold">
              {locale === "ar"
                ? "ابدأ رحلتك العلاجية الآن"
                : "Start your care journey today"}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {locale === "ar"
                ? "احجز موعدك الآن مع الطبيب المناسب لك، ودعنا نساعدك في الوصول إلى أفضل خطة علاجية."
                : "Book your appointment now with the right doctor and let us help you reach the best care plan."}
            </p>

            <div className="mt-5">
              <Link
                to={`/${locale}/contact`}
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                {locale === "ar" ? "احجز الآن" : "Book Now"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
