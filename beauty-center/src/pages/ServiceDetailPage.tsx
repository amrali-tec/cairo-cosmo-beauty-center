import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { services, doctors, serviceCategoryLabels } from "@/lib/data";
import { getTranslation, siteConfig } from "@/lib/i18n";
import { useLocaleParam } from "@/lib/use-locale-param";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import { getAllAdminServices } from "@/lib/admin/services";
import { getAllAdminDoctors } from "@/lib/admin/doctors";

function Bullets({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="mb-3 font-semibold">{title}</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((x, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DoctorCard({
  locale,
  doctor,
  compact,
}: {
  locale: "ar" | "en";
  doctor: any;
  compact?: boolean;
}) {
  const name = getTranslation(doctor.name, locale);
  const specialty = getTranslation(doctor.specialty, locale);
  const img = doctor.image;

  return (
    <Link
      to={`/${locale}/doctors/${doctor.slug}`}
      className={cn(
        "group rounded-2xl border bg-card transition-colors hover:bg-muted/30",
        compact ? "p-3" : "p-4",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "overflow-hidden rounded-xl border bg-background/50",
            compact ? "h-12 w-12 shrink-0" : "h-14 w-14 shrink-0",
          )}
        >
          {img ? (
            <img
              src={img}
              alt={name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
              DR
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="line-clamp-1 font-semibold text-foreground group-hover:text-primary">
            {name}
          </div>
          <div className="line-clamp-1 text-sm text-muted-foreground">
            {specialty}
          </div>
        </div>
      </div>
    </Link>
  );
}

function DoctorsModal({
  open,
  onClose,
  locale,
  serviceTitle,
  allDoctors,
}: {
  open: boolean;
  onClose: () => void;
  locale: "ar" | "en";
  serviceTitle: string;
  allDoctors: any[];
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return allDoctors;

    return allDoctors.filter((d) => {
      const name = getTranslation(d.name, locale).toLowerCase();
      const specialty = getTranslation(d.specialty, locale).toLowerCase();
      return name.includes(query) || specialty.includes(query);
    });
  }, [q, allDoctors, locale]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
      />

      <div className="absolute inset-x-0 bottom-0 p-3 md:inset-0 md:grid md:place-items-center md:p-6">
        <div className="w-full overflow-hidden rounded-3xl border bg-card shadow-xl md:max-w-3xl">
          <div className="border-b bg-card/60 p-4 md:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-lg font-semibold text-foreground md:text-xl">
                  {locale === "ar" ? "أطباء الخدمة" : "Service Doctors"}
                </div>
                <div className="line-clamp-1 text-sm text-muted-foreground">
                  {serviceTitle}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                {locale === "ar" ? "إغلاق" : "Close"}
              </Button>
            </div>

            <div className="mt-4 flex h-11 items-center gap-2 rounded-2xl border bg-background px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={
                  locale === "ar"
                    ? "ابحث باسم الدكتور أو التخصص..."
                    : "Search by name or specialty..."
                }
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div className="max-h-[70vh] overflow-auto p-4 md:p-5">
            {filtered.length ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filtered.map((d) => (
                  <DoctorCard key={d.id} locale={locale} doctor={d} compact />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border bg-background/40 p-4 text-sm text-muted-foreground">
                {locale === "ar"
                  ? "لا توجد نتائج مطابقة."
                  : "No matching results."}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t bg-card/60 p-4 md:p-5">
            <div className="text-xs text-muted-foreground">
              {locale === "ar"
                ? `الإجمالي: ${allDoctors.length} دكتور`
                : `Total: ${allDoctors.length} doctors`}
            </div>
            <Button variant="default" size="sm" asChild>
              <Link to={`/${locale}/book`}>
                {locale === "ar" ? "احجز الآن" : "Book now"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceDetailPage() {
  const locale = useLocaleParam();
  const isRTL = locale === "ar";
  const { slug } = useParams();

  const adminServices = getAllAdminServices();
  const activeServices =
    adminServices.length > 0
      ? adminServices.filter((service) => service.status === "published")
      : services;

  const adminDoctors = getAllAdminDoctors();
  const activeDoctors =
    adminDoctors.length > 0
      ? adminDoctors.filter((doctor) => doctor.status === "published")
      : doctors;

  const service = activeServices.find((s) => s.slug === slug);

  const serviceTitle = service
    ? getTranslation(service.title, locale)
    : locale === "ar"
      ? "الخدمة غير موجودة"
      : "Service not found";

  const serviceDescription = service
    ? getTranslation(service.shortDescription, locale)
    : locale === "ar"
      ? "الخدمة المطلوبة غير متاحة حاليًا."
      : "The requested service is currently unavailable.";

  const canonical = `${siteConfig.url}/${locale}/services/${slug ?? ""}`;

  useSeo({
    title: serviceTitle,
    description: serviceDescription,
    canonical,
    ogImage: service?.image || siteConfig.defaultOgImage,
    keywords: service
      ? `${serviceTitle}, ${getTranslation(
          serviceCategoryLabels[service.category],
          locale,
        )}`
      : serviceTitle,
  });

  if (!service) {
    return (
      <div className="section-container py-10">
        {locale === "ar" ? "الخدمة غير موجودة" : "Service not found"}
      </div>
    );
  }

  const serviceDoctors = activeDoctors
    .filter((d) => (service.doctorIds || []).includes(d.id))
    .slice()
    .sort((a: any, b: any) => {
      const fa = a.featured ? -1 : 0;
      const fb = b.featured ? -1 : 0;
      if (fa !== fb) return fa - fb;

      const an = getTranslation(a.name, locale);
      const bn = getTranslation(b.name, locale);
      return an.localeCompare(bn);
    });

  const highlights = service.highlights ? service.highlights[locale] : [];
  const idealFor = service.idealFor ? service.idealFor[locale] : [];
  const steps = service.steps ? service.steps[locale] : [];
  const aftercare = service.aftercare ? service.aftercare[locale] : [];

  const PREVIEW_COUNT = 4;
  const doctorsPreview = serviceDoctors.slice(0, PREVIEW_COUNT);

  const [openDoctors, setOpenDoctors] = useState(false);

  return (
    <div className="section-container py-10" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          className="text-sm text-muted-foreground hover:text-foreground"
          to={`/${locale}/services`}
        >
          {locale === "ar" ? "← رجوع للخدمات" : "← Back to services"}
        </Link>

        <span className="rounded-full border bg-muted/40 px-3 py-1 text-xs">
          {getTranslation(serviceCategoryLabels[service.category], locale)}
        </span>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <div className="card-elevated overflow-hidden rounded-2xl">
          {service.image ? (
            <img
              src={service.image}
              alt={getTranslation(service.title, locale)}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex min-h-[320px] w-full items-center justify-center bg-muted/40 px-6 text-center">
              <span className="text-base font-medium text-muted-foreground">
                {locale === "ar" ? "الصورة غير متوفرة" : "Image not available"}
              </span>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">
            {getTranslation(service.title, locale)}
          </h1>

          <p className="mt-4 leading-relaxed text-muted-foreground">
            {getTranslation(service.description, locale)}
          </p>

          {(service.duration || service.recovery || service.results) && (
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {service.duration && (
                <div className="rounded-xl border bg-card p-4">
                  <div className="text-xs text-muted-foreground">
                    {locale === "ar" ? "المدة" : "Duration"}
                  </div>
                  <div className="mt-1 font-semibold">
                    {getTranslation(service.duration, locale)}
                  </div>
                </div>
              )}

              {service.recovery && (
                <div className="rounded-xl border bg-card p-4">
                  <div className="text-xs text-muted-foreground">
                    {locale === "ar" ? "التعافي" : "Recovery"}
                  </div>
                  <div className="mt-1 font-semibold">
                    {getTranslation(service.recovery, locale)}
                  </div>
                </div>
              )}

              {service.results && (
                <div className="rounded-xl border bg-card p-4">
                  <div className="text-xs text-muted-foreground">
                    {locale === "ar" ? "النتائج" : "Results"}
                  </div>
                  <div className="mt-1 font-semibold">
                    {getTranslation(service.results, locale)}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Bullets
              title={locale === "ar" ? "مميزات الخدمة" : "Highlights"}
              items={highlights}
            />
            <Bullets
              title={locale === "ar" ? "مناسبة لـ" : "Ideal For"}
              items={idealFor}
            />
            <Bullets
              title={locale === "ar" ? "خطوات الجلسة/الإجراء" : "Steps"}
              items={steps}
            />
            <Bullets
              title={locale === "ar" ? "تعليمات بعد الجلسة" : "Aftercare"}
              items={aftercare}
            />
          </div>

          <div className="mt-10">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">
                {locale === "ar" ? "أطباء الخدمة" : "Doctors"}
              </h2>

              {serviceDoctors.length > PREVIEW_COUNT ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenDoctors(true)}
                >
                  {locale === "ar" ? "عرض الكل" : "View all"}
                </Button>
              ) : null}
            </div>

            {serviceDoctors.length ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {doctorsPreview.map((d) => (
                    <DoctorCard key={d.id} locale={locale} doctor={d} />
                  ))}
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  {serviceDoctors.length > PREVIEW_COUNT
                    ? locale === "ar"
                      ? `نعرض ${PREVIEW_COUNT} فقط لتقليل طول الصفحة. الإجمالي: ${serviceDoctors.length} دكتور.`
                      : `Showing only ${PREVIEW_COUNT} to keep the page short. Total: ${serviceDoctors.length}.`
                    : locale === "ar"
                      ? `الإجمالي: ${serviceDoctors.length} دكتور.`
                      : `Total: ${serviceDoctors.length}.`}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {locale === "ar"
                  ? "سيتم تحديث قائمة الأطباء المرتبطين بهذه الخدمة قريبًا."
                  : "Doctors linked to this service will be updated soon."}
              </p>
            )}
          </div>

          <div className="mt-10">
            <h2 className="mb-3 text-xl font-semibold">
              {locale === "ar" ? "الأسئلة الشائعة" : "FAQ"}
            </h2>

            {service.faqs?.length ? (
              <div className="space-y-3">
                {service.faqs.map((f, idx) => (
                  <details key={idx} className="rounded-xl border p-4">
                    <summary className="cursor-pointer font-medium">
                      {getTranslation(f.question, locale)}
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {getTranslation(f.answer, locale)}
                    </p>
                  </details>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
                {locale === "ar"
                  ? "لا توجد أسئلة شائعة لهذه الخدمة حالياً. لو عندك استفسار، تواصل معنا وسنرد فوراً."
                  : "No FAQs for this service yet. Contact us and we’ll respond quickly."}
              </div>
            )}
          </div>
        </div>
      </div>

      <DoctorsModal
        open={openDoctors}
        onClose={() => setOpenDoctors(false)}
        locale={locale}
        serviceTitle={getTranslation(service.title, locale)}
        allDoctors={serviceDoctors}
      />
    </div>
  );
}
