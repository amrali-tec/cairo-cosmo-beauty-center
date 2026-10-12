import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  MessageSquare,
  Send,
  Sparkles,
  Building2,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/PageHeader";

import { branches } from "@/lib/data";
import { getTranslation, siteConfig } from "@/lib/i18n";
import { useLocaleParam } from "@/lib/use-locale-param";
import { useSeo } from "@/hooks/useSeo";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/services/apiClient";

export default function ContactPage() {
  const locale = useLocaleParam();
  const isAr = locale === "ar";
  const canonical = `${siteConfig.url}/${locale}/contact`;

  useSeo({
    title: isAr ? "تواصل معنا | كايرو كوزمو سنتر" : "Contact Us | Cairo Cosmo Center",
    description:
      isAr
        ? "تواصل مع كايرو كوزمو سنتر، استعرض عناوين الفروع الـ 5 (الشيراتون، الدقي، 6 أكتوبر، المنصورة، شبرا)، الخريطة الفورية، ووسائل التواصل المباشرة."
        : "Contact Cairo Cosmo Center, explore our 5 branch locations (Sheraton, Dokki, 6th of October, Mansoura, Shubra), maps, and direct contact options.",
    canonical,
    keywords:
      isAr
        ? "تواصل معنا, فروع كايرو كوزمو, رقم كايرو كوزمو, عنوان فرع الشيراتون, عنوان فرع الدقي, واتساب الحجز"
        : "contact us, Cairo Cosmo branches, Cairo Cosmo phone, Sheraton branch, Dokki branch, booking WhatsApp",
  });

  const [activeBranchId, setActiveBranchId] = useState<string>("sheraton");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    branchId: "sheraton",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || loading) return;

    setLoading(true);
    setError("");
    setSubmitted(false);

    try {
      const selectedB = branches.find((b) => b.id === form.branchId) || activeBranch;
      const branchTitle = getTranslation(selectedB.title, locale);

      const response = await fetch(`${API_BASE_URL}/booking.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          serviceTitle: form.subject.trim() || (isAr ? "استفسار عام" : "General Inquiry"),
          branchId: form.branchId,
          branchTitle,
          branchEmail: selectedB.email || "bookings@cairocosmo.online",
          notes: form.message.trim(),
          locale,
          pageUrl: window.location.href,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to send message");
      }

      setSubmitted(true);
      setForm({
        fullName: "",
        phone: "",
        email: "",
        branchId: "sheraton",
        subject: "",
        message: "",
      });
    } catch {
      setError(
        isAr
          ? "حدث خطأ أثناء الإرسال. يمكنك استخدام الواتساب للتواصل المباشر."
          : "Something went wrong. You can use WhatsApp for direct contact.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container py-10 md:py-14 space-y-12">
      {/* Header */}
      <PageHeader
        title={{
          ar: "تواصل معنا واختاري أقرب فرع",
          en: "Contact Us & Choose Your Nearest Branch",
        }}
        description={{
          ar: "يسعدنا استقبال استفساراتكم وحجوزاتكم عبر كافة وسائل التواصل وفروعنا الـ 5 المجهزة بجميع أنحاء الجمهورية.",
          en: "We are delighted to receive your inquiries and bookings across all contact channels and our 5 fully equipped branches.",
        }}
        ctas={[
          {
            label: { ar: "احجز موعدك الآن", en: "Book Appointment Now" },
            href: `/${locale}/book`,
            variant: "primary",
          },
          {
            label: { ar: "محادثات الواتساب", en: "WhatsApp Chat" },
            href: siteConfig.getWhatsAppUrl(locale),
            variant: "outline",
          },
        ]}
      />

      {/* Quick Contact Badges Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          href={siteConfig.getWhatsAppUrl(locale)}
          target="_blank"
          rel="noopener noreferrer"
          className="group card-elevated rounded-2xl p-5 transition-all hover:scale-[1.02] border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-4"
        >
          <div className="rounded-xl bg-emerald-500 p-3 text-white shadow-md shadow-emerald-500/20">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {isAr ? "خدمة العملاء الفورية" : "Instant Customer Support"}
            </div>
            <div className="text-base font-bold text-foreground group-hover:text-emerald-600 transition-colors">
              {isAr ? "واتساب العيادة" : "Clinic WhatsApp"}
            </div>
          </div>
        </a>

        <a
          href="mailto:bookings@cairocosmo.online"
          className="group card-elevated rounded-2xl p-5 transition-all hover:scale-[1.02] border border-primary/20 bg-primary/5 flex items-center gap-4"
        >
          <div className="rounded-xl bg-primary p-3 text-primary-foreground shadow-md shadow-primary/20">
            <Mail className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-primary">
              {isAr ? "البريد الموحد للحجوزات" : "Master Booking Email"}
            </div>
            <div className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
              bookings@cairocosmo.online
            </div>
          </div>
        </a>

        <div className="card-elevated rounded-2xl p-5 flex items-center gap-4 border border-border">
          <div className="rounded-xl bg-accent p-3 text-accent-foreground">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">
              {isAr ? "مواعيد العمل الرسمية" : "Working Hours"}
            </div>
            <div className="text-sm font-bold text-foreground">
              {isAr ? "يومياً: 10:00 ص - 10:00 م" : "Daily: 10 AM - 10 PM"}
            </div>
          </div>
        </div>

        <div className="card-elevated rounded-2xl p-5 flex items-center gap-4 border border-border">
          <div className="rounded-xl bg-accent p-3 text-accent-foreground">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">
              {isAr ? "شبكة الفروع" : "Branch Network"}
            </div>
            <div className="text-sm font-bold text-foreground">
              {isAr ? "5 فروع رئيسية بمصر" : "5 Major Branches in Egypt"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Branches + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Top: Interactive Branch Selector (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span>{isAr ? "فروعنا المعتمدة" : "Our Certified Branches"}</span>
            </h2>
            <span className="text-xs font-medium text-muted-foreground">
              {isAr ? "اختر الفرع لعرض العنوان والتفاصيل" : "Click branch to view address & details"}
            </span>
          </div>

          {/* Branch Cards List */}
          <div className="grid grid-cols-1 gap-4">
            {branches.map((b) => {
              const isSelected = b.id === activeBranchId;
              return (
                <div
                  key={b.id}
                  onClick={() => setActiveBranchId(b.id)}
                  className={cn(
                    "cursor-pointer rounded-2xl p-5 transition-all border text-start relative overflow-hidden",
                    isSelected
                      ? "bg-card border-primary ring-2 ring-primary/20 shadow-lg scale-[1.01]"
                      : "bg-card/60 border-border hover:border-primary/40 hover:bg-card/80",
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/40" />
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-foreground">
                          {getTranslation(b.title, locale)}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {isAr ? "المحدد" : "Selected"}
                          </span>
                        )}
                      </div>

                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed flex items-start gap-1.5">
                        <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <span>{getTranslation(b.address, locale)}</span>
                      </p>

                      {b.email && (
                        <p className="text-xs text-primary font-medium flex items-center gap-1.5 pt-1">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{b.email}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-center gap-2 shrink-0">
                      <a
                        href={b.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>{isAr ? "اتجاهات الخريطة" : "Map Directions"}</span>
                      </a>

                      <Link
                        to={`/${locale}/book?branch=${b.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold btn-primary-gradient text-primary-foreground shadow-sm"
                      >
                        <span>{isAr ? "حجز بالفرع" : "Book Branch"}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Branch Map Banner */}
          <div className="card-elevated rounded-2xl p-6 bg-gradient-to-br from-card via-card to-primary/5 border border-primary/15 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {isAr ? "الفرع النشط حالياً" : "Active Selected Branch"}
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  {getTranslation(activeBranch.title, locale)}
                </h3>
              </div>

              <a
                href={activeBranch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                <span>{isAr ? "فتح الخريطة الكاملة" : "Open Full Map"}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <p className="text-xs text-muted-foreground">
              📍 {getTranslation(activeBranch.address, locale)}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button variant="whatsapp" size="sm" asChild className="rounded-xl gap-2 font-bold text-xs">
                <a
                  href={siteConfig.getWhatsAppUrl(locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="h-4 w-4" />
                  {isAr ? "تواصل مع موظف الاستقبال" : "Chat with Receptionist"}
                </a>
              </Button>

              <Button variant="outline" size="sm" asChild className="rounded-xl gap-2 font-bold text-xs">
                <a href={`mailto:${activeBranch.email || "bookings@cairocosmo.online"}`}>
                  <Mail className="h-4 w-4 text-primary" />
                  {activeBranch.email || "bookings@cairocosmo.online"}
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Right / Bottom: Instant Contact & Inquiry Form (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="card-elevated rounded-3xl p-6 md:p-8 space-y-6 border border-primary/20 relative overflow-hidden bg-card">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-primary via-rose-400 to-amber-300" />

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isAr ? "رسالة استفسار سريعة" : "Quick Inquiry Form"}</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {isAr ? "أرسلي استفسارك فوراً" : "Send Your Inquiry"}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {isAr
                  ? "سيقوم الفريق الطبي بمراجعة استفسارك والرد عليك في أقرب وقت."
                  : "Our medical team will review your inquiry and get back to you promptly."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="grid gap-1.5">
                <Label htmlFor="fullName" className="text-xs font-semibold">
                  {isAr ? "الاسم بالكامل *" : "Full Name *"}
                </Label>
                <Input
                  id="fullName"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))}
                  placeholder={isAr ? "مثال: مريم محمود" : "e.g. Mariam Mahmoud"}
                  className="rounded-xl"
                />
              </div>

              {/* Phone */}
              <div className="grid gap-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold">
                  {isAr ? "رقم الهاتف / الواتساب *" : "Phone / WhatsApp *" }
                </Label>
                <Input
                  id="phone"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                  placeholder={isAr ? "مثال: 01xxxxxxxxx" : "e.g. +20 1xxxxxxxxx"}
                  className="rounded-xl"
                />
              </div>

              {/* Email */}
              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">
                  {isAr ? "البريد الإلكتروني" : "Email Address"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                  placeholder={isAr ? "name@example.com" : "name@example.com"}
                  className="rounded-xl"
                />
              </div>

              {/* Target Branch */}
              <div className="grid gap-1.5">
                <Label htmlFor="branchId" className="text-xs font-semibold">
                  {isAr ? "الفرع المستهدف *" : "Target Branch *"}
                </Label>
                <select
                  id="branchId"
                  value={form.branchId}
                  onChange={(e) => setForm((s) => ({ ...s, branchId: e.target.value }))}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {getTranslation(b.title, locale)} ({b.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div className="grid gap-1.5">
                <Label htmlFor="subject" className="text-xs font-semibold">
                  {isAr ? "موضوع الاستفسار" : "Subject"}
                </Label>
                <Input
                  id="subject"
                  value={form.subject}
                  onChange={(e) => setForm((s) => ({ ...s, subject: e.target.value }))}
                  placeholder={isAr ? "مثال: استفسار عن جلسات الليزر أو الفيلر" : "e.g. Laser or Filler Inquiry"}
                  className="rounded-xl"
                />
              </div>

              {/* Message */}
              <div className="grid gap-1.5">
                <Label htmlFor="message" className="text-xs font-semibold">
                  {isAr ? "تفاصيل الرسالة" : "Your Message"}
                </Label>
                <Textarea
                  id="message"
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                  placeholder={isAr ? "اكتبي تفاصيل استفسارك هنا…" : "Write details here…"}
                  className="rounded-xl text-xs"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              {submitted && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-foreground space-y-1">
                  <div className="font-bold text-emerald-600 flex items-center gap-1.5">
                    <span>✅ تم إرسال رسالتك بنجاح!</span>
                  </div>
                  <p className="text-muted-foreground">
                    سيقوم موظف استقبال الفرع المختار بمواصلة التواصل معك قريباً.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !form.fullName || !form.phone}
                className="w-full rounded-xl btn-primary-gradient border-0 font-bold gap-2 text-primary-foreground shadow-md shadow-primary/20"
              >
                <Send className="h-4 w-4" />
                <span>
                  {loading
                    ? isAr
                      ? "جارٍ الإرسال..."
                      : "Sending..."
                    : isAr
                      ? "إرسال الاستفسار للفرع"
                      : "Send Inquiry to Branch"}
                </span>
              </Button>
            </form>

            <div className="pt-4 border-t text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
                <span>{isAr ? "مركز مرخص ومصرح من وزارة الصحة المصرية" : "Licensed by Ministry of Health"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
