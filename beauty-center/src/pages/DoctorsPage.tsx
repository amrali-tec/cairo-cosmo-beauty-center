// src/pages/DoctorsPage.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { branches, doctors } from "@/lib/data";
import { getTranslation, siteConfig } from "@/lib/i18n";
import { useLocaleParam } from "@/lib/use-locale-param";
import { useSeo } from "@/hooks/useSeo";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { getAllAdminDoctors } from "@/lib/admin/doctors";
import { DoctorMatchingSection } from "@/components/sections/DoctorMatchingSection";
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M21 8.1c-1.2 0-2.4-.4-3.4-1.1-1-.7-1.8-1.7-2.3-2.9v10.7c0 2.9-2.3 5.2-5.2 5.2S4.9 17.7 4.9 14.8s2.3-5.2 5.2-5.2c.3 0 .7 0 1 .1v2.8c-.3-.1-.6-.2-1-.2-1.4 0-2.6 1.2-2.6 2.6s1.2 2.6 2.6 2.6 2.6-1.2 2.6-2.6V3h2.9c.4 1.3 1.1 2.4 2.1 3.3 1 .9 2.2 1.4 3.5 1.5v2.3z" />
  </svg>
);

const BRAND_EN = "Cairo Cosmo Center";
const BRAND_AR = "مركز القاهرة الطبي لجراحات التجميل والليزر";

export default function DoctorsPage() {
  const locale = useLocaleParam();

  const baseUrl = (siteConfig as any)?.url || "https://cairocosmo.online";
  const canonical = `${baseUrl}/${locale}/doctors`;

  const seoTitle =
    locale === "ar" ? `أطباؤنا | ${BRAND_AR}` : `Our Doctors | ${BRAND_EN}`;

  const seoDescription =
    locale === "ar"
      ? "تعرف على نخبة أطباء مركز القاهرة الطبي لجراحات التجميل والليزر. فلتر حسب الفرع أو التخصص، ثم احجز استشارتك بسهولة."
      : "Meet the expert doctors at Cairo Cosmo Center. Filter by branch or specialty, then book your consultation easily.";

  useSeo({ title: seoTitle, description: seoDescription, canonical });

  const social = (siteConfig as any)?.socialLinks;

  // ✅ Branch filter
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  const mergedDoctors = useMemo(() => {
    const adminDoctors = getAllAdminDoctors();
    const activeDoctors =
      adminDoctors.length > 0
        ? adminDoctors.filter((doctor) => doctor.status === "published")
        : doctors;

    return activeDoctors;
  }, []);

  const filteredDoctors = useMemo(() => {
    if (selectedBranch === "all") return mergedDoctors;
    return mergedDoctors.filter((d) => d.branchId === selectedBranch);
  }, [selectedBranch, mergedDoctors]);

  const branchOptions = useMemo(() => {
    return [
      { id: "all", label: locale === "ar" ? "كل الفروع" : "All branches" },
      ...branches.map((b) => ({
        id: b.id,
        label: getTranslation(b.title, locale),
      })),
    ];
  }, [locale]);

  return (
    <div className="section-container py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {locale === "ar" ? "الأطباء" : "Doctors"}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            {locale === "ar"
              ? "اختار طبيبك حسب الفرع أو التخصص، واستكشف الخدمات المرتبطة بكل طبيب."
              : "Choose your doctor by branch or specialty, and explore the services linked to each physician."}
          </p>
        </div>

        {/* ✅ Branch filter */}
        <div className="w-full md:w-[280px]">
          <label className="text-sm font-medium">
            {locale === "ar" ? "فلترة حسب الفرع" : "Filter by branch"}
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="mt-2 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          >
            {branchOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Finder Specialty Matching Tool */}
      <DoctorMatchingSection />

      {/* ✅ CTA + links block */}
      <div className="rounded-2xl border bg-card p-5 mb-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground leading-relaxed">
            {locale === "ar"
              ? "جاهز تبدأ؟ احجز استشارة، أو راسلنا على واتساب، أو استعرض الخدمات لتعرف الأنسب لحالتك."
              : "Ready to start? Book a consultation, chat on WhatsApp, or browse services to find the best option for you."}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to={`/${locale}/book`}
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-95"
            >
              {locale === "ar" ? "احجز الآن" : "Book now"}
            </Link>

            <a
              href={siteConfig.getWhatsAppUrl(locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full border text-sm hover:bg-muted/30"
            >
              {locale === "ar" ? "تواصل واتساب" : "WhatsApp"}
            </a>

            <Link
              to={`/${locale}/services`}
              className="px-4 py-2 rounded-full border text-sm hover:bg-muted/30"
            >
              {locale === "ar" ? "استعرض الخدمات" : "View services"}
            </Link>

            <Link
              to={`/${locale}/contact`}
              className="px-4 py-2 rounded-full border text-sm hover:bg-muted/30"
            >
              {locale === "ar" ? "اتصل بنا" : "Contact"}
            </Link>
          </div>
        </div>

        {/* ✅ External links (social) */}
        {social &&
          (social.facebook ||
            social.instagram ||
            social.youtube ||
            social.tiktok) && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm font-medium mb-2">
                {locale === "ar" ? "تابعنا على" : "Follow us"}
              </div>

              <div className="flex flex-wrap gap-2">
                {social.facebook && (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm hover:bg-muted/30 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook
                      className="h-4 w-4 text-primary"
                      strokeWidth={1.8}
                    />
                    <span>Facebook</span>
                  </a>
                )}

                {social.instagram && (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm hover:bg-muted/30 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram
                      className="h-4 w-4 text-primary"
                      strokeWidth={1.8}
                    />
                    <span>Instagram</span>
                  </a>
                )}

                {social.youtube && (
                  <a
                    href={social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm hover:bg-muted/30 transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube
                      className="h-4 w-4 text-primary"
                      strokeWidth={1.8}
                    />
                    <span>YouTube</span>
                  </a>
                )}

                {/* ✅ TikTok button (simple) */}
                {social.tiktok && (
                  <a
                    href={siteConfig.socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm hover:bg-muted/30 transition-colors"
                    aria-label="TikTok"
                  >
                    <TikTokIcon className="h-4 w-4" />
                    <span className="font-semibold">TikTok</span>{" "}
                  </a>
                )}
              </div>
            </div>
          )}
      </div>

      {/* ✅ Doctors Grid (smaller cards + rounded image) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((d) => (
          <Link
            key={d.id}
            to={`/${locale}/doctors/${d.slug}`}
            className="card-elevated rounded-2xl overflow-hidden hover:opacity-[0.99]"
            aria-label={
              locale === "ar"
                ? `عرض صفحة ${getTranslation(d.name, locale)}`
                : `View ${getTranslation(d.name, locale)} profile`
            }
          >
            <div className="p-4">
              <div className="aspect-[4/3] overflow-hidden rounded-xl">
                <img
                  src={d.image}
                  alt={getTranslation(d.name, locale)}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="mt-4">
                <div className="text-lg font-semibold leading-tight">
                  {getTranslation(d.name, locale)}
                </div>
                <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {getTranslation(d.specialty, locale)}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {getTranslation(d.experience, locale)}
                </div>

                {/* ✅ Mini CTA inside card */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full border text-xs text-muted-foreground">
                    {d.branchId
                      ? getTranslation(
                          branches.find((b) => b.id === d.branchId)?.title || {
                            ar: "—",
                            en: "—",
                          },
                          locale,
                        )
                      : locale === "ar"
                        ? "بدون فرع"
                        : "No branch"}
                  </span>

                  <span className="px-3 py-1 rounded-full border text-xs text-primary">
                    {locale === "ar" ? "عرض الملف" : "View profile"}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ✅ Bottom CTA section */}
      <div className="mt-10 rounded-2xl border bg-card p-6">
        <div className="text-lg font-semibold">
          {locale === "ar"
            ? "محتاج مساعدة في اختيار الطبيب المناسب؟"
            : "Need help choosing the right doctor?"}
        </div>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          {locale === "ar"
            ? "احكيلنا عن حالتك على واتساب وسنرشح لك التخصص والطبيب الأنسب، مع اقتراح الخدمة المناسبة."
            : "Tell us about your case on WhatsApp and we’ll recommend the best specialty, doctor, and service for you."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={siteConfig.getWhatsAppUrl(locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-95"
          >
            {locale === "ar" ? "تواصل واتساب الآن" : "Chat on WhatsApp"}
          </a>

          <Link
            to={`/${locale}/services`}
            className="px-4 py-2 rounded-full border text-sm hover:bg-muted/30"
          >
            {locale === "ar" ? "شوف الخدمات" : "Browse services"}
          </Link>

          <Link
            to={`/${locale}/book`}
            className="px-4 py-2 rounded-full border text-sm hover:bg-muted/30"
          >
            {locale === "ar" ? "احجز استشارة" : "Book consultation"}
          </Link>
        </div>
      </div>

      {/* ✅ Extra footer SEO paragraph */}
      <div className="mt-6 text-sm text-muted-foreground leading-relaxed">
        {locale === "ar"
          ? "نقدم خدمات التجميل والليزر والعناية بالبشرة عبر فروع متعددة. اختر الفرع الأقرب وابدأ رحلة العناية بثقة."
          : "We provide aesthetics, laser, and skincare across multiple branches. Pick the nearest branch and start your care journey with confidence."}
      </div>
    </div>
  );
}
