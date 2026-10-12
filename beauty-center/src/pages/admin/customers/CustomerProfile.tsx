import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, CalendarClock, MessageCircle, Save, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getCustomerById, updateCustomerNotes, type CustomerSegment } from "@/services/customerService";

type CustomerProfileData = Awaited<ReturnType<typeof getCustomerById>>;

const segmentMeta: Record<CustomerSegment, { label: string; variant: "default" | "secondary" | "outline" }> = {
  vip: { label: "VIP", variant: "default" },
  new: { label: "جديد", variant: "secondary" },
  inactive: { label: "غير نشط", variant: "outline" },
  regular: { label: "منتظم", variant: "secondary" },
};

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function CustomerProfile() {
  const params = useParams<{ id: string }>();
  const customerId = Number(params.id || 0);
  const [profile, setProfile] = useState<CustomerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        setLoading(true);
        const data = await getCustomerById(customerId);
        if (active) {
          setProfile(data);
          setNotes(data.customer.admin_notes || "");
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "تعذر تحميل ملف العميل");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [customerId]);

  const whatsappUrl = useMemo(() => {
    if (!profile?.customer.phone) {
      return "#";
    }

    const normalizedPhone = profile.customer.phone.replace(/[^\d+]/g, "");
    const message = encodeURIComponent(
      `مرحباً ${profile.customer.name}، نود متابعتك بخصوص حجوزاتك في العيادة.`,
    );

    return `https://wa.me/${normalizedPhone.replace(/^\+/, "")}?text=${message}`;
  }, [profile]);

  const handleSaveNotes = async () => {
    if (!profile) {
      return;
    }

    try {
      setSaving(true);
      setSaveMessage("");
      await updateCustomerNotes(profile.customer.id, notes);
      setProfile((current) =>
        current
          ? {
              ...current,
              customer: {
                ...current.customer,
                admin_notes: notes,
              },
            }
          : current,
      );
      setSaveMessage("تم حفظ الملاحظات بنجاح.");
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : "تعذر حفظ الملاحظات.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-3xl border border-border/60 bg-card p-8 text-center text-muted-foreground">جاري تحميل ملف العميل...</div>;
  }

  if (error || !profile) {
    return (
      <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-8 text-center text-destructive">
        {error || "تعذر تحميل البيانات"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-3">
            <Link to="/admin/customers">
              <ArrowRight className="h-4 w-4" />
              العودة إلى العملاء
            </Link>
          </Button>
          <p className="text-sm text-primary">CRM / Customer Profile</p>
          <h1 className="mt-2 text-3xl font-bold">{profile.customer.name}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={segmentMeta[profile.segment].variant}>{segmentMeta[profile.segment].label}</Badge>
          <Button asChild variant="whatsapp">
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              إرسال واتساب
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[1.75rem] border-border/60 bg-card/95">
          <CardHeader>
            <CardTitle>بيانات العميل</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">الجوال</p>
              <p className="mt-2 font-semibold">{profile.customer.phone}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
              <p className="mt-2 font-semibold">{profile.customer.email || "—"}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">عدد الزيارات</p>
              <p className="mt-2 text-2xl font-bold">{profile.stats.totalBookings}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">إجمالي الإنفاق</p>
              <p className="mt-2 text-2xl font-bold">{profile.stats.totalSpending.toLocaleString("ar-EG")} </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4 md:col-span-2">
              <p className="text-sm text-muted-foreground">آخر موعد</p>
              <p className="mt-2 font-semibold">{formatDate(profile.stats.lastBookingDate)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-border/60 bg-card/95">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>متابعة باقات الجلسات العلاجية 💆‍♀️</span>
              <Badge variant="outline" className="text-xs font-bold text-primary border-primary/30">
                باقة نشطة ✨
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border/70 bg-background/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-foreground">باقة إزالة الشعر بالليزر / العناية الكاملة</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">تحديث الجلسات المنجزة والمتبقية</p>
                </div>
                <div className="text-left">
                  <span className="text-xl font-black text-primary">3</span>
                  <span className="text-xs text-muted-foreground"> / 6 جلسات</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-3.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: "50%" }} />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                <span className="text-muted-foreground">الجلسات المتبقية: <strong className="text-foreground font-bold">3 جلسات</strong></span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 rounded-xl text-xs font-bold" onClick={() => alert("تم تسجيل خصم جلسة بنجاح 🌸")}>
                    - تسجيل جلسة مستهلكة
                  </Button>
                  <Button size="sm" variant="default" className="h-8 rounded-xl text-xs font-bold" onClick={() => alert("تم إضافة موعد جلسة قادمة بنجاح 📅")}>
                    + حجز الجلسة القادمة
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">ملاحظات فريق الإدارة والأطباء:</label>
              <Textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                placeholder="اكتب ملاحظات فريق المتابعة والتوصيات الطبية هنا..."
              />
            </div>
            {saveMessage ? <p className="text-sm text-muted-foreground">{saveMessage}</p> : null}
            <Button onClick={handleSaveNotes} disabled={saving} className="rounded-xl font-bold">
              <Save className="h-4 w-4 ml-1" />
              {saving ? "جارٍ الحفظ..." : "حفظ الملاحظات"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[1.75rem] border-border/60 bg-card/95">
        <CardHeader>
          <CardTitle>الحجوزات المرتبطة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.bookings.length === 0 ? (
            <div className="rounded-2xl border border-border/70 bg-background/60 p-5 text-center text-muted-foreground">
              لا توجد حجوزات مرتبطة بهذا العميل.
            </div>
          ) : (
            profile.bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-border/70 bg-background/60 p-5"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarClock className="h-4 w-4" />
                      {formatDate((booking.created_at as string | null) || booking.date as string | null)}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">{String(booking.service || "خدمة غير محددة")}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      الفرع: {String(booking.branch || "—")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{String(booking.status || "new")}</Badge>
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <UserRound className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-border/60 bg-card/60 p-3">
                    <p className="text-xs text-muted-foreground">التاريخ المطلوب</p>
                    <p className="mt-1 text-sm font-medium">{formatDate(booking.date as string | null)}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-card/60 p-3">
                    <p className="text-xs text-muted-foreground">ملاحظات الحجز</p>
                    <p className="mt-1 text-sm font-medium">{String(booking.notes || "—")}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="rounded-[1.75rem] border-border/60 bg-card/95">
        <CardHeader>
          <CardTitle>النشاط الزمني</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {profile.bookings.map((booking) => (
            <div key={`timeline-${booking.id}`} className="flex gap-4 rounded-2xl border border-border/70 bg-background/60 p-4">
              <div className="mt-1 h-3 w-3 rounded-full bg-primary" />
              <div>
                <p className="font-medium">
                  {String(booking.service || "حجز")} - {String(booking.status || "new")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate((booking.created_at as string | null) || booking.date as string | null)}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
