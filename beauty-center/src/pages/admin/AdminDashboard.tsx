// ===============================
// src/pages/admin/AdminDashboard.tsx
// ===============================
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Users,
  BriefcaseMedical,
  BadgePercent,
  MessageSquareQuote,
  Sparkles,
  Calendar,
  Plus,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  Download,
  Share2,
  Stethoscope,
  ShieldCheck,
  Zap,
  Bot,
} from "lucide-react";
import { AdminAnalyticsSection } from "@/components/admin/AdminAnalyticsSection";
import { BookingNotificationToast } from "@/components/admin/BookingNotificationToast";
import {
  createRealBooking,
  subscribeToRealtimeBookings,
  getStoredBookings,
} from "@/services/realtimeBookingService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface TodayAppointment {
  id: string;
  customerName: string;
  phone: string;
  service: string;
  doctor: string;
  branch: string;
  time: string;
  status: "waiting" | "in_session" | "completed" | "scheduled";
}

const initialTodayAppointments: TodayAppointment[] = [
  {
    id: "apt-1",
    customerName: "سارة محمد محمود",
    phone: "01012345678",
    service: "فراكشنال ليزر وتجديد البشرة",
    doctor: "د. ناهد سمير",
    branch: "فرع مصر الجديدة",
    time: "04:00 مساءً",
    status: "in_session",
  },
  {
    id: "apt-2",
    customerName: "نورهان سمير عبدالفتاح",
    phone: "01234567890",
    service: "إزالة الشعر بالليزر (كانديلا برو)",
    doctor: "د. ناهد سمير",
    branch: "فرع الدقي",
    time: "04:30 مساءً",
    status: "waiting",
  },
  {
    id: "apt-3",
    customerName: "مي أحمد الحسيني",
    phone: "01123456789",
    service: "حقن بوتوكس وتجاعيد الجبهة",
    doctor: "د. باسم زكي",
    branch: "فرع مصر الجديدة",
    time: "05:15 مساءً",
    status: "scheduled",
  },
  {
    id: "apt-4",
    customerName: "ياسمين خالد علي",
    phone: "01098765432",
    service: "هيدرافيشل 12 خطوة وتغذية ملكية",
    doctor: "د. باسم زكي",
    branch: "فرع 6 أكتوبر",
    time: "06:00 مساءً",
    status: "scheduled",
  },
  {
    id: "apt-5",
    customerName: "هدى مصطفى كامل",
    phone: "01555443322",
    service: "نحت القوام وتكسير الدهون",
    doctor: "د. أحمد الشريف",
    branch: "فرع الدقي",
    time: "07:00 مساءً",
    status: "scheduled",
  },
];

const navigationCards = [
  {
    title: "التحليلات الحية والـ BI",
    description: "متابعة النبض اللحظي والإيرادات ومعدلات التحويل",
    icon: TrendingUp,
    href: "/admin/analytics",
    badge: "مباشر 🟢",
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    title: "سجل الحجوزات والمواعيد",
    description: "إدارة الحجوزات، التأكيد، ونظام كانبان التفاعلي",
    icon: Calendar,
    href: "/admin/bookings",
    badge: "تحديث مستمر",
    color: "text-primary bg-primary/10",
  },
  {
    title: "إدارة العملاء والـ CRM",
    description: "سجلات العملاء، الشرائح، VIP، وتاريخ الجلسات",
    icon: Users,
    href: "/admin/customers",
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    title: "الفريق والصلاحيات",
    description: "إدارة أفراد العمل والمصفوفة الأمنية لكل فرع",
    icon: ShieldCheck,
    href: "/admin/team",
    color: "text-sky-500 bg-sky-500/10",
  },
  {
    title: "المقالات والأخبار",
    description: "إدارة مقالات المدونة والنصائح الطبية ومحرر المحتوى",
    icon: FileText,
    href: "/admin/blog",
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    title: "الأطباء والعيادات",
    description: "إضافة وتعديل بيانات الاستشاريين والتخصصات",
    icon: Stethoscope,
    href: "/admin/doctors",
    color: "text-rose-500 bg-rose-500/10",
  },
  {
    title: "الخدمات الطبية",
    description: "إدارة صفحات الخدمات والتفاصيل والأسعار والـ SEO",
    icon: BriefcaseMedical,
    href: "/admin/services",
    color: "text-indigo-500 bg-indigo-500/10",
  },
  {
    title: "العروض والباقات",
    description: "إضافة العروض الموسمية والباقات التخفيضية الحصرية",
    icon: BadgePercent,
    href: "/admin/offers",
    color: "text-teal-500 bg-teal-500/10",
  },
  {
    title: "آراء المراجعين",
    description: "إدارة التقييمات والشهادات التفاعلية والاعتماد",
    icon: MessageSquareQuote,
    href: "/admin/testimonials",
    color: "text-fuchsia-500 bg-fuchsia-500/10",
  },
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<TodayAppointment[]>(() => {
    const stored = getStoredBookings();
    if (stored.length > 0) {
      return stored.slice(0, 10).map((b) => ({
        id: b.id,
        customerName: b.customerName,
        phone: b.phone,
        service: b.serviceName,
        doctor: b.doctorName,
        branch: b.branchName,
        time: b.preferredTime,
        status:
          b.status === "completed"
            ? ("completed" as const)
            : b.status === "confirmed"
            ? ("waiting" as const)
            : ("scheduled" as const),
      }));
    }
    return [];
  });
  const [openNewBooking, setOpenNewBooking] = useState(false);

  // Subscribe to real-time incoming bookings from any tab/device
  useEffect(() => {
    const unsubscribe = subscribeToRealtimeBookings((newBooking) => {
      const newApt: TodayAppointment = {
        id: newBooking.id,
        customerName: newBooking.customerName,
        phone: newBooking.phone,
        service: newBooking.serviceName,
        doctor: newBooking.doctorName,
        branch: newBooking.branchName,
        time: newBooking.preferredTime,
        status: "scheduled",
      };
      setAppointments((prev) => [newApt, ...prev.filter((a) => a.id !== newBooking.id)]);
    });

    return () => unsubscribe();
  }, []);

  // Quick form state for quick walk-in booking
  const [quickName, setQuickName] = useState("");
  const [quickPhone, setQuickPhone] = useState("");
  const [quickService, setQuickService] = useState("جلسات الليزر وإزالة الشعر");
  const [quickDoctor, setQuickDoctor] = useState("د. ناهد سمير");
  const [quickBranch, setQuickBranch] = useState("فرع مصر الجديدة (شيراتون)");
  const [quickTime, setQuickTime] = useState("05:00 مساءً");

  const handleUpdateStatus = (id: string, newStatus: TodayAppointment["status"]) => {
    setAppointments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    const labels: Record<TodayAppointment["status"], string> = {
      waiting: "في صالة الانتظار بالعيادة",
      in_session: "داخل غرفة الكشف / الجلسة الآن",
      completed: "اكتملت الجلسة بنجاح",
      scheduled: "تمت الجدولة",
    };

    toast({
      title: "تم تحديث حالة المراجع",
      description: `الحالة الجديدة: ${labels[newStatus]}`,
    });
  };

  const handleCreateQuickBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickPhone.trim()) {
      toast({
        title: "بيانات غير مكتملة",
        description: "يرجى كتابة اسم العميل ورقم الهاتف",
        variant: "destructive",
      });
      return;
    }

    // 🚀 Create real booking and broadcast
    const result = await createRealBooking({
      fullName: quickName.trim(),
      phone: quickPhone.trim(),
      email: "walkin@cairocosmo.online",
      serviceTitle: quickService,
      doctorName: quickDoctor,
      branchTitle: quickBranch,
      preferredDate: new Date().toISOString().split("T")[0],
      timeSlot: quickTime,
      notes: "حجز مباشر من لوحة التحكم (Walk-in)",
      source: "walkin",
    });

    const newApt: TodayAppointment = {
      id: result.bookingId,
      customerName: quickName.trim(),
      phone: quickPhone.trim(),
      service: quickService,
      doctor: quickDoctor,
      branch: quickBranch,
      time: quickTime,
      status: "scheduled",
    };

    setAppointments((prev) => [newApt, ...prev]);

    toast({
      title: "تم تسجيل وتأكيد الحجز بنجاح 🔔",
      description: `تم إضافة ${quickName} برقم حجز #${result.bookingId}`,
    });

    setQuickName("");
    setQuickPhone("");
    setOpenNewBooking(false);
  };

  const sendWhatsAppReminder = (apt: TodayAppointment) => {
    const text = encodeURIComponent(
      `أهلاً بحضرتك أستاذة ${apt.customerName}، نذكرك بموعد جلستك اليوم في كايرو كوزمو سنتر (${apt.branch}) الساعة ${apt.time} مع ${apt.doctor}.\nيسعدنا دائماً استقبالك!`
    );
    window.open(`https://wa.me/2${apt.phone.replace(/^0/, "")}?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-8">
      {/* Real-time booking toast notification */}
      <BookingNotificationToast />

      {/* Hero Welcome Header with Live Status */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-card via-card/80 to-primary/5 p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Sparkles className="h-4 w-4" />
              <span>لوحة القيادة الإدارية الموحدة • كايرو كوزمو سنتر</span>
            </div>
            <h1 className="text-3xl font-black text-foreground">
              مرحباً بك في لوحة التحكم والذكاء الإداري
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              إدارة شاملة لجميع فروع ومواعيد وخدمات المركز، مع متابعة حية لمؤشرات الأداء وتحليلات الإيرادات ونشاط المراجعين.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" asChild className="rounded-2xl gap-2 font-bold border-primary/40 bg-card hover:bg-primary/10 shadow-sm">
              <Link to="/admin/sophia">
                <Bot className="h-4 w-4 text-primary animate-pulse" />
                <span>مركز عمليات صوفيا AI 🌟</span>
              </Link>
            </Button>

            {/* Quick Walk-in Booking Dialog */}
            <Dialog open={openNewBooking} onOpenChange={setOpenNewBooking}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl gap-2 font-bold shadow-lg shadow-primary/25">
                  <Plus className="h-4 w-4" />
                  <span>تسجيل حجز مباشر سريع</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                    <Plus className="h-5 w-5 text-primary" />
                    تسجيل حجز فوري / مباشر بالعيادة
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleCreateQuickBooking} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">اسم العميل / المراجع</Label>
                    <Input
                      placeholder="مثال: ياسمين أحمد"
                      value={quickName}
                      onChange={(e) => setQuickName(e.target.value)}
                      className="rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">رقم الهاتف (واتساب)</Label>
                    <Input
                      placeholder="010XXXXXXXX"
                      value={quickPhone}
                      onChange={(e) => setQuickPhone(e.target.value)}
                      className="rounded-xl"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">الخدمة المطلوبة</Label>
                      <Select value={quickService} onValueChange={setQuickService}>
                        <SelectTrigger className="rounded-xl text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl text-xs">
                          <SelectItem value="جلسات الليزر وإزالة الشعر">ليزر إزالة الشعر</SelectItem>
                          <SelectItem value="حقن الفيلر والبوتوكس">فيلر وبوتوكس</SelectItem>
                          <SelectItem value="جلسة الهيدرافيشل الملكية">هيدرافيشل ملكي</SelectItem>
                          <SelectItem value="نحت القوام وتنسيق الدهون">نحت قوام وتخسيس</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">الفرع الطبي</Label>
                      <Select value={quickBranch} onValueChange={setQuickBranch}>
                        <SelectTrigger className="rounded-xl text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl text-xs">
                          <SelectItem value="فرع مصر الجديدة">فرع مصر الجديدة (شيراتون)</SelectItem>
                          <SelectItem value="فرع الدقي">فرع الدقي</SelectItem>
                          <SelectItem value="فرع 6 أكتوبر">فرع 6 أكتوبر</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">الطبيب الاستشاري</Label>
                      <Select value={quickDoctor} onValueChange={setQuickDoctor}>
                        <SelectTrigger className="rounded-xl text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl text-xs">
                          <SelectItem value="د. ناهد سمير">د. ناهد سمير (جلدية وتجميل)</SelectItem>
                          <SelectItem value="د. باسم زكي">د. باسم زكي (تجميل)</SelectItem>
                          <SelectItem value="د. أحمد الشريف">د. أحمد الشريف (نحت قوام)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">توقيت الموعد</Label>
                      <Input
                        value={quickTime}
                        onChange={(e) => setQuickTime(e.target.value)}
                        className="rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenNewBooking(false)}
                      className="rounded-xl text-xs"
                    >
                      إلغاء
                    </Button>
                    <Button type="submit" className="rounded-xl text-xs font-bold">
                      حفظ وتأكيد الحجز
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Link to="/admin/analytics">
              <Button variant="outline" className="rounded-2xl gap-2 font-bold bg-background/80">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span>شاشة التحليلات الكاملة</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Analytics Dashboard Engine */}
      <AdminAnalyticsSection />

      {/* Today's Clinic Appointments Manifest (Live Schedule) */}
      <Card className="rounded-[2rem] border-border/70 bg-card/90 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg font-black text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              جدول مواعيد واستقبال عيادات اليوم
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              متابعة حضور المراجعين وتغيير حالة الدخول وإرسال تذكيرات الواتساب فورياً
            </CardDescription>
          </div>

          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold">
            {appointments.length} مواعيد مسجلة اليوم
          </Badge>
        </CardHeader>

        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground">
                  <th className="pb-3 font-semibold">المراجع</th>
                  <th className="pb-3 font-semibold">الخدمة الطبية</th>
                  <th className="pb-3 font-semibold">الفرع والطبيب</th>
                  <th className="pb-3 font-semibold">الموعد</th>
                  <th className="pb-3 font-semibold">حالة الحضور</th>
                  <th className="pb-3 font-semibold text-center">الإجراءات السريعة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground text-xs">
                      <div className="space-y-2">
                        <Calendar className="h-8 w-8 text-primary/40 mx-auto" />
                        <p className="font-bold text-foreground">لا توجد مواعيد مسجلة اليوم حتى الآن</p>
                        <p className="text-[11px] text-muted-foreground max-w-md mx-auto">
                          تظهر هنا الحجوزات الحقيقية فور تسجيلها عبر الموقع الإلكتروني أو تسجيل حجز مباشر بالعيادة.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 font-bold text-foreground">
                      <div>{apt.customerName}</div>
                      <div className="text-[11px] font-normal text-muted-foreground font-mono" dir="ltr">
                        {apt.phone}
                      </div>
                    </td>

                    <td className="py-3.5 text-foreground max-w-[200px] truncate">
                      {apt.service}
                    </td>

                    <td className="py-3.5">
                      <div className="text-foreground font-medium">{apt.branch}</div>
                      <div className="text-[11px] text-muted-foreground">{apt.doctor}</div>
                    </td>

                    <td className="py-3.5 font-bold text-primary flex items-center gap-1.5 pt-4">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{apt.time}</span>
                    </td>

                    <td className="py-3.5">
                      {apt.status === "in_session" && (
                        <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px] font-bold">
                          داخل الجلسة 🟣
                        </Badge>
                      )}
                      {apt.status === "waiting" && (
                        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-bold">
                          في صالة الانتظار 🟡
                        </Badge>
                      )}
                      {apt.status === "completed" && (
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                          اكتملت بنجاح 🟢
                        </Badge>
                      )}
                      {apt.status === "scheduled" && (
                        <Badge variant="outline" className="text-muted-foreground text-[10px]">
                          مجدول ⏳
                        </Badge>
                      )}
                    </td>

                    <td className="py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(apt.id, "waiting")}
                          className="h-7 text-[10px] px-2 rounded-lg"
                          title="تسجيل وصول في صالة الانتظار"
                        >
                          حضر
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(apt.id, "in_session")}
                          className="h-7 text-[10px] px-2 rounded-lg text-purple-600 border-purple-500/30"
                          title="بدء الجلسة مع الطبيب"
                        >
                          دخول
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(apt.id, "completed")}
                          className="h-7 text-[10px] px-2 rounded-lg text-emerald-600 border-emerald-500/30"
                          title="اكتمال الجلسة بنجاح"
                        >
                          اكتملت
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => sendWhatsAppReminder(apt)}
                          className="h-7 w-7 p-0 rounded-lg text-emerald-600 hover:bg-emerald-500/10"
                          title="إرسال تذكير واتساب"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Navigation Sections Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            أقسام ووحدات التحكم والإدارة
          </h3>
          <span className="text-xs text-muted-foreground">وصول سريع لجميع محتويات النظام</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {navigationCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                to={card.href}
                key={card.title}
                className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`inline-flex rounded-2xl p-3.5 ${card.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>

                    {card.badge && (
                      <Badge className="rounded-full text-[10px] font-bold bg-primary/10 text-primary border-primary/20">
                        {card.badge}
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                  <span>فتح القسم</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
