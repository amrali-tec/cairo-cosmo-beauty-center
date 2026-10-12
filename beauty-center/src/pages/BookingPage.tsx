// src/pages/BookingPage.tsx
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, Phone, Send, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useLocale } from "@/lib/locale-context";
import { siteConfig, Locale } from "@/lib/i18n";
import { branches, services } from "@/lib/data";
import { getTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useSeo } from "@/hooks/useSeo";
import { API_BASE_URL } from "@/services/apiClient";
import { createRealBooking } from "@/services/realtimeBookingService";

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  serviceId: string;
  branchId: string;
  preferredDate: string;
  notes: string;
};

const initialState: FormState = {
  fullName: "",
  phone: "",
  email: "",
  serviceId: "",
  branchId: "",
  preferredDate: "",
  notes: "",
};

export default function BookingPage() {
  const { locale: localeFromUrl } = useParams<{ locale: Locale }>();
  const { locale: ctxLocale, t, translations, dir } = useLocale();

  const locale: Locale =
    localeFromUrl === "en" || localeFromUrl === "ar"
      ? localeFromUrl
      : ctxLocale;
  const canonical = `${siteConfig.url}/${locale}/book`;

  useSeo({
    title: locale === "ar" ? "احجز موعدك" : "Book Your Appointment",
    description:
      locale === "ar"
        ? "احجز موعدك في كايرو كوزمو سنتر، واختر الخدمة والفرع والتاريخ المناسب ثم أرسل طلبك مباشرة أو عبر واتساب."
        : "Book your appointment at Cairo Cosmo Center, choose your service, branch, and preferred date, then submit directly or via WhatsApp.",
    canonical,
    keywords:
      locale === "ar"
        ? "حجز موعد, حجز واتساب, كايرو كوزمو"
        : "book appointment, WhatsApp booking, Cairo Cosmo",
  });

  const [form, setForm] = useState<FormState>(initialState);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(locale === "ar" ? "04:00 مساءً" : "04:00 PM");
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const serviceOptions = useMemo(() => services, []);
  const branchOptions = useMemo(() => branches, []);

  const selectedService = serviceOptions.find((s) => s.id === form.serviceId);
  const selectedBranch = branchOptions.find((b) => b.id === form.branchId);

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());

  const isValid =
    form.fullName.trim().length >= 2 &&
    form.phone.trim().length >= 8 &&
    emailIsValid &&
    !!form.serviceId &&
    !!form.branchId &&
    !!form.preferredDate;

  const buildWhatsAppText = () => {
    const lines = [
      locale === "ar" ? "طلب حجز جديد" : "New Booking Request",
      "--------------------",
      `${locale === "ar" ? "الاسم" : "Name"}: ${form.fullName}`,
      `${locale === "ar" ? "الجوال" : "Phone"}: ${form.phone}`,
      `${locale === "ar" ? "الإيميل" : "Email"}: ${form.email}`,
      `${locale === "ar" ? "الخدمة" : "Service"}: ${
        selectedService ? getTranslation(selectedService.title, locale) : "-"
      }`,
      `${locale === "ar" ? "الفرع" : "Branch"}: ${
        selectedBranch ? getTranslation(selectedBranch.title, locale) : "-"
      }`,
      `${locale === "ar" ? "التاريخ المفضل" : "Preferred date"}: ${form.preferredDate}`,
      `${locale === "ar" ? "ملاحظات" : "Notes"}: ${form.notes || "-"}`,
    ];

    return lines.join("\n");
  };

  const openWhatsApp = () => {
    if (!isValid) return;

    const text = encodeURIComponent(buildWhatsAppText());
    window.open(
      `https://wa.me/${siteConfig.whatsapp}?text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid || loading) return;

    setLoading(true);
    setError("");
    setSubmitted(false);
    setBookingId("");

    try {
      const serviceTitle = selectedService
        ? getTranslation(selectedService.title, locale)
        : "جلسة تجميلية متخصصة";

      const branchTitle = selectedBranch
        ? getTranslation(selectedBranch.title, locale)
        : "الفرع الرئيسي";

      // 🚀 Execute real booking creation, persistent storage, and real-time cross-tab broadcast
      const result = await createRealBooking({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        serviceTitle,
        branchId: form.branchId,
        branchTitle,
        preferredDate: form.preferredDate,
        timeSlot: selectedTimeSlot || "04:00 مساءً",
        notes: form.notes.trim(),
        source: "website",
      });

      setSubmitted(true);
      setBookingId(result.bookingId);

      // ✅ Open WhatsApp pre-filled confirmation window
      openWhatsApp();
      setForm(initialState);
    } catch (err) {
      setError(
        locale === "ar"
          ? "حدث خطأ أثناء إرسال طلب الحجز. حاول مرة أخرى."
          : "Something went wrong while sending your booking request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={dir} className="section-container py-10 md:py-14">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {t(translations.booking.title)}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t(translations.booking.subtitle)}
          </p>
        </div>

        <div className="card-elevated rounded-2xl p-6 md:p-8 space-y-6">
          {/* Live Availability Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>
                {locale === "ar"
                  ? "مواعيد اليوم متاحة للحجز المباشر • تأكيد فوري عبر الواتساب"
                  : "Today's slots available for instant booking • Fast confirmation via WhatsApp"}
              </span>
            </div>
            <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
              {locale === "ar" ? "⚡ متبقي 4 مواعيد فقط" : "⚡ Only 4 slots left"}
            </span>
          </div>

          <form onSubmit={onSubmit} className="grid gap-5">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="fullName">
                {t(translations.booking.fullName)}
              </Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) =>
                  setForm((s) => ({ ...s, fullName: e.target.value }))
                }
                placeholder={
                  locale === "ar" ? "مثال: محمد أحمد" : "e.g. Mohamed Ahmed"
                }
              />
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <Label htmlFor="phone">{t(translations.booking.phone)}</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((s) => ({ ...s, phone: e.target.value }))
                }
                placeholder={
                  locale === "ar" ? "مثال: 01xxxxxxxxx" : "e.g. +20 1xxxxxxxxx"
                }
                inputMode="tel"
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">
                {locale === "ar" ? "البريد الإلكتروني" : "Email address"}
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((s) => ({ ...s, email: e.target.value }))
                }
                placeholder={
                  locale === "ar"
                    ? "مثال: name@example.com"
                    : "e.g. name@example.com"
                }
                inputMode="email"
              />
            </div>

            {/* Service + Branch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="grid gap-2">
                <Label htmlFor="service">
                  {t(translations.booking.service)}
                </Label>
                <select
                  id="service"
                  value={form.serviceId}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, serviceId: e.target.value }))
                  }
                  className={cn(
                    "h-10 rounded-md border bg-background px-3 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-ring",
                  )}
                >
                  <option value="">
                    {locale === "ar" ? "اختر الخدمة" : "Select service"}
                  </option>
                  {serviceOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {getTranslation(s.title, locale)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="branch">{t(translations.booking.branch)}</Label>
                <select
                  id="branch"
                  value={form.branchId}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, branchId: e.target.value }))
                  }
                  className={cn(
                    "h-10 rounded-md border bg-background px-3 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-ring",
                  )}
                >
                  <option value="">
                    {locale === "ar" ? "اختر الفرع" : "Select branch"}
                  </option>
                  {branchOptions.map((b) => (
                    <option key={b.id} value={b.id}>
                      {getTranslation(b.title, locale)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="grid gap-2">
              <Label htmlFor="preferredDate">
                {t(translations.booking.preferredDate)}
              </Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="preferredDate"
                  type="date"
                  value={form.preferredDate}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, preferredDate: e.target.value }))
                  }
                  className="pl-10"
                />
              </div>
            </div>

            {/* Live Time Slots Picker */}
            <div className="grid gap-2.5">
              <Label className="text-sm font-semibold flex items-center justify-between">
                <span>{locale === "ar" ? "اختر الوقت المتاح للجلسة:" : "Pick Available Time Slot:"}</span>
                <span className="text-xs text-primary font-bold">{selectedTimeSlot ? `المحدد: ${selectedTimeSlot}` : ""}</span>
              </Label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { ar: "12:00 ظهراً", en: "12:00 PM" },
                  { ar: "02:30 ظهراً", en: "02:30 PM" },
                  { ar: "04:00 مساءً", en: "04:00 PM" },
                  { ar: "05:30 مساءً", en: "05:30 PM" },
                  { ar: "07:00 مساءً", en: "07:00 PM" },
                  { ar: "08:30 مساءً", en: "08:30 PM" },
                ].map((slot) => {
                  const isSelected = selectedTimeSlot === slot[locale];
                  return (
                    <button
                      key={slot.ar}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot[locale])}
                      className={cn(
                        "py-2.5 px-2 rounded-xl text-xs font-bold transition-all border text-center flex flex-col items-center justify-center gap-1",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                          : "bg-background border-border text-foreground hover:border-primary/50 hover:bg-primary/5",
                      )}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      <span>{slot[locale]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="notes">{t(translations.booking.notes)}</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) =>
                  setForm((s) => ({ ...s, notes: e.target.value }))
                }
                placeholder={
                  locale === "ar" ? "أي تفاصيل إضافية…" : "Any extra details…"
                }
                rows={4}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Success */}
            {submitted && (
              <div className="rounded-xl border bg-card p-4 text-sm text-foreground">
                ✅{" "}
                {locale === "ar"
                  ? "تم إرسال طلب الحجز بنجاح."
                  : "Your booking request has been sent successfully."}
                {bookingId && (
                  <div className="mt-2 font-medium">
                    {locale === "ar" ? "رقم الطلب:" : "Booking ID:"} {bookingId}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <Button
                type="submit"
                variant="hero"
                disabled={!isValid || loading}
                className="gap-2 btn-primary-gradient border-0 font-bold shadow-md shadow-primary/20"
              >
                <Send className="h-4 w-4" />
                {loading
                  ? locale === "ar"
                    ? "جارٍ الإرسال والتوجيه..."
                    : "Sending..."
                  : locale === "ar"
                    ? "تأكيد وإرسال الحجز (الإيميل + واتساب ✉️💬)"
                    : "Confirm & Send (Email + WhatsApp)"}
              </Button>

              <Button
                type="button"
                variant="whatsapp"
                onClick={openWhatsApp}
                disabled={!isValid || loading}
                className="gap-2"
              >
                <Phone className="h-4 w-4" />
                {t(translations.booking.sendViaWhatsApp)}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
