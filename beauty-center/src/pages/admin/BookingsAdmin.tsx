import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  createRealBooking,
  subscribeToRealtimeBookings,
  clearAllRealBookings,
} from "@/services/realtimeBookingService";
import {
  Search,
  Calendar,
  Clock,
  Phone,
  MessageCircle,
  MapPin,
  Stethoscope,
  CheckCircle2,
  XCircle,
  Plus,
  Eye,
  Trash2,
  User,
  Sparkles,
  FileText,
  Filter,
  RefreshCw,
  Share2,
  Save,
  LayoutGrid,
  List,
  Send,
  Navigation,
  HelpCircle,
  Copy,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type CustomerSegment = "vip" | "new" | "regular";

export type BookingRecord = {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  serviceName: string;
  doctorName: string;
  branchName: string;
  preferredDate: string;
  preferredTime: string;
  status: BookingStatus;
  segment: CustomerSegment;
  notes: string;
  createdAt: string;
};

const initialBookings: BookingRecord[] = [
  {
    id: "bk-1001",
    customerName: "سارة محمد محمود",
    phone: "01012345678",
    email: "sara.m@gmail.com",
    serviceName: "جلسات الفراكشنال ليزر وتجديد البشرة",
    doctorName: "د. ناهد سمير (استشاري الجلدية والتجميل)",
    branchName: "فرع مصر الجديدة (شيراتون)",
    preferredDate: "2026-08-20",
    preferredTime: "04:00 مساءً",
    status: "confirmed",
    segment: "vip",
    notes: "تم التأكيد هاتفياً. ترغب في تركيب مخدر موضع قبل الجلسة بـ 30 دقيقة.",
    createdAt: "2026-08-18 10:30 ص",
  },
  {
    id: "bk-1002",
    customerName: "مي أحمد الحسيني",
    phone: "01123456789",
    email: "mai.ahmed@yahoo.com",
    serviceName: "حقن البوتوكس والتجاعيد التعبيرية",
    doctorName: "د. باسم زكي (استشاري طب التجميل)",
    branchName: "فرع الدقي",
    preferredDate: "2026-08-21",
    preferredTime: "06:30 مساءً",
    status: "pending",
    segment: "new",
    notes: "حجز من خلال أداة التشخيص الذكي بالصفحة الرئيسية للموقع.",
    createdAt: "2026-08-18 11:15 ص",
  },
  {
    id: "bk-1003",
    customerName: "نورهان سمير عبدالفتاح",
    phone: "01234567890",
    email: "nourhan.samir@hotmail.com",
    serviceName: "إزالة الشعر بالليزر الجلسة الكاملة",
    doctorName: "د. ناهد سمير (استشاري الجلدية والتجميل)",
    branchName: "فرع 6 أكتوبر",
    preferredDate: "2026-08-19",
    preferredTime: "02:00 ظهراً",
    status: "completed",
    segment: "regular",
    notes: "تم تنفيذ الجلسة بنجاح وتحديد موعد الجلسة الإعادة بعد 4 أسابيع.",
    createdAt: "2026-08-17 04:20 م",
  },
  {
    id: "bk-1004",
    customerName: "ياسمين خالد علي",
    phone: "01098765432",
    email: "yasmine.k@gmail.com",
    serviceName: "جلسة تنظيف البشرة والتغذية بالهيدرافيشل",
    doctorName: "د. باسم زكي (استشاري طب التجميل)",
    branchName: "فرع مصر الجديدة (شيراتون)",
    preferredDate: "2026-08-22",
    preferredTime: "05:00 مساءً",
    status: "pending",
    segment: "new",
    notes: "ترغب في الاستفسار عن باقة الخصم المتاحة لـ 3 جلسات.",
    createdAt: "2026-08-18 12:00 م",
  },
  {
    id: "bk-1005",
    customerName: "هدى مصطفى كامل",
    phone: "01555443322",
    email: "hoda.m@gmail.com",
    serviceName: "جلسات نحت القوام وتنسيق الدهون",
    doctorName: "د. أحمد الشريف (استشاري جراحة التجميل)",
    branchName: "فرع الدقي",
    preferredDate: "2026-08-23",
    preferredTime: "07:00 مساءً",
    status: "cancelled",
    segment: "regular",
    notes: "تم الإلغاء بناءً على طلب العميل لسفر مفاجئ.",
    createdAt: "2026-08-16 01:10 م",
  },
];

const STORAGE_KEY = "admin_bookings_master_v1";

function loadStoredBookings(): BookingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {}
  return [];
}

function saveStoredBookings(data: BookingRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

const statusMeta: Record<BookingStatus, { label: string; class: string; icon: string }> = {
  pending: { label: "قيد الانتظار", class: "bg-amber-500/15 text-amber-600 border-amber-500/30", icon: "⏳" },
  confirmed: { label: "مؤكد بالحضور", class: "bg-primary/15 text-primary border-primary/30", icon: "✅" },
  completed: { label: "تمت الجلسة بنجاح", class: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30", icon: "🌸" },
  cancelled: { label: "ملغي", class: "bg-red-500/15 text-red-600 border-red-500/30", icon: "❌" },
};

const segmentMeta: Record<CustomerSegment, { label: string; class: string }> = {
  vip: { label: "عميل VIP ⭐", class: "bg-purple-500/15 text-purple-600 border-purple-500/30" },
  new: { label: "عميل جديد 🆕", class: "bg-sky-500/15 text-sky-600 border-sky-500/30" },
  regular: { label: "عميل منتظم 🔄", class: "bg-gray-500/15 text-gray-700 border-gray-500/30" },
};

export default function BookingsAdmin() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [selectedRecord, setSelectedRecord] = useState<BookingRecord | null>(null);
  const [whatsAppModalRecord, setWhatsAppModalRecord] = useState<BookingRecord | null>(null);
  const [whatsAppTemplate, setWhatsAppTemplate] = useState<string>("confirmation");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Booking Form State
  const [newForm, setNewForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    serviceName: "جلسات الفراكشنال ليزر وتجديد البشرة",
    doctorName: "د. ناهد سمير (استشاري الجلدية والتجميل)",
    branchName: "فرع مصر الجديدة (شيراتون)",
    preferredDate: new Date().toISOString().slice(0, 10),
    preferredTime: "04:00 مساءً",
    notes: "",
    segment: "new" as CustomerSegment,
  });

  useEffect(() => {
    const local = loadStoredBookings();
    setBookings(local);

    // Subscribe to live incoming real bookings across tabs
    const unsubscribe = subscribeToRealtimeBookings((newBooking) => {
      setBookings((prev) => [newBooking as any, ...prev.filter((b) => b.id !== newBooking.id)]);
    });

    // Fetch live bookings from server (API / JSON File DB)
    fetch("/api/bookings/booking-list.php")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data?.data) && data.data.length > 0) {
          setBookings((prev) => {
            const map = new Map<string, BookingRecord>();
            // Add server items first
            data.data.forEach((b: any) => {
              const id = b.id || b.bookingId || `bk-${Date.now()}`;
              map.set(id, {
                id,
                customerName: b.customerName || b.name || "مراجع بدون اسم",
                phone: b.phone || "",
                email: b.email || "",
                serviceName: b.serviceName || b.service || "خدمة تجميلية",
                doctorName: b.doctorName || "استشاري الفرع الطبي",
                branchName: b.branchName || b.branch || "الفرع الرئيسي",
                preferredDate: b.preferredDate || b.date || new Date().toISOString().slice(0, 10),
                preferredTime: b.preferredTime || "حسب الموعد الأقرب",
                status: b.status || "pending",
                segment: b.segment || "new",
                notes: b.notes || "",
                createdAt: b.createdAt || b.created_at || new Date().toLocaleString("ar-EG"),
              });
            });
            // Merge with local items that are not on server
            prev.forEach((item) => {
              if (!map.has(item.id)) {
                map.set(item.id, item);
              }
            });
            const merged = Array.from(map.values());
            saveStoredBookings(merged);
            return merged;
          });
        }
      })
      .catch(() => {});

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (bookings.length > 0) {
      saveStoredBookings(bookings);
    }
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const q = search.toLowerCase();
    return bookings.filter((item) => {
      const matchSearch =
        item.customerName.toLowerCase().includes(q) ||
        item.phone.includes(q) ||
        item.serviceName.toLowerCase().includes(q) ||
        item.doctorName.toLowerCase().includes(q) ||
        item.branchName.toLowerCase().includes(q);

      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchBranch = branchFilter === "all" || item.branchName.includes(branchFilter);

      return matchSearch && matchStatus && matchBranch;
    });
  }, [bookings, search, statusFilter, branchFilter]);

  const handleUpdateStatus = (id: string, newStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    toast({
      title: "تم تغيير الحالة بنجاح",
      description: `الحالة الجديدة: ${statusMeta[newStatus].label}`,
    });
  };

  const handleUpdateNotes = (id: string, newNotes: string) => {
    setBookings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes: newNotes } : item))
    );
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord((prev) => (prev ? { ...prev, notes: newNotes } : null));
    }
  };

  const handleSaveRecord = (record: BookingRecord) => {
    setBookings((prev) => {
      const updated = prev.map((b) => (b.id === record.id ? record : b));
      saveStoredBookings(updated);
      return updated;
    });

    fetch("/api/bookings/booking-update.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: record.id,
        status: record.status,
        notes: record.notes,
        preferredDate: record.preferredDate,
        preferredTime: record.preferredTime,
      }),
    }).catch(() => {});

    toast({
      title: "تم حفظ التعديلات بنجاح 💾",
      description: `تم تحديث تفاصيل حجز العميل (${record.customerName}).`,
    });

    setSelectedRecord(null);
  };

  const handleDelete = (id: string) => {
    setBookings((prev) => prev.filter((item) => item.id !== id));
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(null);
    }
  };

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.customerName || !newForm.phone) return;

    const result = await createRealBooking({
      fullName: newForm.customerName,
      phone: newForm.phone,
      email: newForm.email || "—",
      serviceTitle: newForm.serviceName,
      doctorName: newForm.doctorName,
      branchTitle: newForm.branchName,
      preferredDate: newForm.preferredDate,
      timeSlot: newForm.preferredTime,
      segment: newForm.segment,
      notes: newForm.notes || "حجز يدوياً بواسطة موظف الاستقبال.",
      source: "walkin",
    });

    setBookings((prev) => [result.record as any, ...prev.filter((b) => b.id !== result.bookingId)]);
    setIsAddModalOpen(false);
    toast({
      title: "تم تسجيل الحجز بنجاح 🔔",
      description: `تم حفظ الحجز برقم #${result.bookingId}`,
    });

    setNewForm({
      customerName: "",
      phone: "",
      email: "",
      serviceName: "جلسات الفراكشنال ليزر وتجديد البشرة",
      doctorName: "د. ناهد سمير (استشاري الجلدية والتجميل)",
      branchName: "فرع مصر الجديدة (شيراتون)",
      preferredDate: new Date().toISOString().slice(0, 10),
      preferredTime: "04:00 مساءً",
      notes: "",
      segment: "new",
    });
  };

  const exportToCSV = () => {
    const headers = ["رقم الحجز", "اسم العميل", "رقم الهاتف", "البريد الإلكتروني", "الخدمة", "الطبيب", "الفرع", "التاريخ", "الوقت", "الحالة", "ملاحظات"];
    const rows = filteredBookings.map((b) => [
      b.id,
      `"${b.customerName.replace(/"/g, '""')}"`,
      `"${b.phone}"`,
      `"${b.email}"`,
      `"${b.serviceName.replace(/"/g, '""')}"`,
      `"${b.doctorName.replace(/"/g, '""')}"`,
      `"${b.branchName.replace(/"/g, '""')}"`,
      b.preferredDate,
      b.preferredTime,
      statusMeta[b.status]?.label || b.status,
      `"${(b.notes || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Cairo_Cosmo_Bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "تم تصدير الحجوزات بنجاح 📊",
      description: "تم تحضير تنزيل ملف CSV يحتوي على الحجوزات المفلترة.",
    });
  };

  // Generate WhatsApp Message by Template
  const generateWhatsAppMessage = (record: BookingRecord, template: string) => {
    if (template === "confirmation") {
      return `مرحباً أ./أ. ${record.customerName} ✨
نود تأكيد موعد حجزك لخدمة (${record.serviceName}) بمركز كايرو كوزمو سنتر (${record.branchName})
📅 التاريخ: ${record.preferredDate}
⏰ الوقت: ${record.preferredTime}
🩺 الطبيب: ${record.doctorName}

يرجى الرد بكلمة (تأكيد) لتثبيت الحضور. يسعدنا استقبالك! ❤️`;
    }
    if (template === "reminder") {
      return `تذكير بموعدك غداً في كايرو كوزمو سنتر 🌸
أهلاً بحضرتك ${record.customerName}، نذكرك بموعد جلستك غداً في (${record.branchName}) الساعة ${record.preferredTime}.
في حال الرغبة في التعديل يرجى إبلاغنا مسبقاً. نتمنى لكِ يوماً جميلاً!`;
    }
    if (template === "instructions_laser") {
      return `تعليمات هامة قبل جلسة الليزر - كايرو كوزمو سنتر ✨
أهلاً بكِ ${record.customerName}:
1. يرجى حلاقة المنطقة بالشفرة قبل الجلسة بـ 24 ساعة.
2. تجنب التعرض المباشر للشمس أو التسمير (التان) لمدة أسبوعين قبل الجلسة.
3. عدم استخدام أي كريمات تقشير أو عطور يوم الجلسة.
موعدك: ${record.preferredDate} - ${record.preferredTime}`;
    }
    if (template === "location") {
      return `موقع فرع كايرو كوزمو سنتر 📍
أهلاً بكِ ${record.customerName}، إليكِ موقع الفرع لتسهيل الوصول:
${record.branchName}
رابط خرائط جوجل: https://maps.google.com
للاستفسار: 01012345678`;
    }
    return "";
  };

  const openWhatsAppWithTemplate = (record: BookingRecord, template: string) => {
    const formattedPhone = record.phone.replace(/^0/, "20");
    const msg = generateWhatsAppMessage(record, template);
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleClearAllBookings = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في إفراغ وتصفير سجل الحجوزات والعملاء بالكامل؟ سيتم مسح أي حجوزات تجريبية والإبقاء على الحجوزات الحقيقية فقط.")) {
      clearAllRealBookings();
      setBookings([]);
      setSelectedRecord(null);
      toast({
        title: "تم إفراغ السجل بنجاح 🗑️",
        description: "السجل الآن فارغ ونظيف 100% وجاهز لاستقبال الحجوزات الحقيقية فقط.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-4">
        <div>
          <p className="text-xs font-bold text-primary flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            نظام إدارة المراجعين والحجوزات CRM
          </p>
          <h2 className="mt-1 text-3xl font-black text-foreground">سجل الحجوزات وإدارة المواعيد</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center rounded-2xl border border-border/70 bg-card p-1">
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                viewMode === "table" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="h-3.5 w-3.5" />
              <span>جدول</span>
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                viewMode === "kanban" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>كانبان Pipeline</span>
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleClearAllBookings}
            className="rounded-2xl border-rose-500/30 text-rose-600 hover:bg-rose-500/10 font-bold px-3 gap-1.5 transition-all text-xs"
            title="إفراغ وتصفير سجل الحجوزات والعملاء"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
            <span>تصفير السجل</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={exportToCSV}
            className="rounded-2xl border-border text-foreground font-bold px-4 gap-2 hover:bg-primary/10 hover:text-primary transition-all text-xs"
          >
            <Share2 className="h-3.5 w-3.5 text-primary" />
            تصدير CSV 📊
          </Button>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-2xl btn-primary-gradient border-0 font-bold px-5 text-xs shadow-md shadow-primary/20"
          >
            <Plus className="ml-1.5 h-4 w-4" />
            تسجيل حجز جديد
          </Button>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <Card className="rounded-[2rem] border-border/70 bg-card/90 shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم العميل، الهاتف، الخدمة، أو الفرع..."
                className="h-11 rounded-2xl pr-10 bg-background/70 border-border text-xs"
              />
            </div>

            {/* Branch Filter */}
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="h-11 w-full md:w-56 rounded-2xl border-border bg-background text-xs">
                <SelectValue placeholder="كل الفروع" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="all">جميع الفروع</SelectItem>
                <SelectItem value="شيراتون">فرع مصر الجديدة (شيراتون)</SelectItem>
                <SelectItem value="الدقي">فرع الدقي</SelectItem>
                <SelectItem value="أكتوبر">فرع 6 أكتوبر</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-xs text-muted-foreground font-semibold">
              إجمالي النتائج: <strong className="text-foreground text-sm">{filteredBookings.length}</strong> عميلاً
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={cn("px-3.5 py-1.5 rounded-xl font-bold transition-all", statusFilter === "all" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground")}
            >
              جميع الحجوزات ({bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("pending")}
              className={cn("px-3.5 py-1.5 rounded-xl font-bold transition-all", statusFilter === "pending" ? "bg-amber-500 text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground")}
            >
              ⏳ قيد الانتظار ({bookings.filter((b) => b.status === "pending").length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("confirmed")}
              className={cn("px-3.5 py-1.5 rounded-xl font-bold transition-all", statusFilter === "confirmed" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground")}
            >
              ✅ مؤكد ({bookings.filter((b) => b.status === "confirmed").length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("completed")}
              className={cn("px-3.5 py-1.5 rounded-xl font-bold transition-all", statusFilter === "completed" ? "bg-emerald-600 text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground")}
            >
              🌸 تمت الجلسة ({bookings.filter((b) => b.status === "completed").length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("cancelled")}
              className={cn("px-3.5 py-1.5 rounded-xl font-bold transition-all", statusFilter === "cancelled" ? "bg-red-500 text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground")}
            >
              ❌ ملغي ({bookings.filter((b) => b.status === "cancelled").length})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* View Mode: Kanban Pipeline Board */}
      {viewMode === "kanban" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(["pending", "confirmed", "completed", "cancelled"] as BookingStatus[]).map((colStatus) => {
            const colBookings = filteredBookings.filter((b) => b.status === colStatus);
            return (
              <div key={colStatus} className="rounded-3xl border border-border/70 bg-card/60 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{statusMeta[colStatus].icon}</span>
                    <h3 className="font-bold text-sm text-foreground">{statusMeta[colStatus].label}</h3>
                  </div>
                  <Badge variant="secondary" className="rounded-full text-[11px] font-bold px-2 py-0.5">
                    {colBookings.length}
                  </Badge>
                </div>

                <div className="space-y-3 min-h-[400px]">
                  {colBookings.map((record) => (
                    <Card
                      key={record.id}
                      className="rounded-2xl border-border/80 bg-background/90 p-3.5 space-y-2.5 shadow-xs hover:border-primary/50 transition-all text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-sm text-foreground truncate">{record.customerName}</div>
                        <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 border shrink-0", segmentMeta[record.segment].class)}>
                          {segmentMeta[record.segment].label}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-muted-foreground text-[11px]">
                        <div className="flex items-center gap-1.5 text-foreground font-medium truncate">
                          <Stethoscope className="h-3 w-3 text-primary shrink-0" />
                          <span className="truncate">{record.serviceName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-primary shrink-0" />
                          <span className="truncate">{record.branchName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-primary font-bold">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span>{record.preferredDate} • {record.preferredTime}</span>
                        </div>
                      </div>

                      {/* Quick Status Shift Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-1 pt-2 border-t border-border/50">
                        <div className="flex items-center gap-1">
                          {colStatus !== "confirmed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(record.id, "confirmed")}
                              className="h-6 text-[9px] px-1.5 rounded-lg text-primary border-primary/30"
                              title="تأكيد"
                            >
                              تأكيد
                            </Button>
                          )}
                          {colStatus !== "completed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(record.id, "completed")}
                              className="h-6 text-[9px] px-1.5 rounded-lg text-emerald-600 border-emerald-500/30"
                              title="إكمال"
                            >
                              اكتمال
                            </Button>
                          )}
                          {colStatus !== "cancelled" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUpdateStatus(record.id, "cancelled")}
                              className="h-6 text-[9px] px-1.5 rounded-lg text-red-500 hover:bg-red-500/10"
                              title="إلغاء"
                            >
                              إلغاء
                            </Button>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setWhatsAppModalRecord(record);
                              setWhatsAppTemplate("confirmation");
                            }}
                            className="h-6 w-6 p-0 rounded-lg text-emerald-600 hover:bg-emerald-500/10"
                            title="مراسلة واتساب"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedRecord(record)}
                            className="h-6 w-6 p-0 rounded-lg text-muted-foreground hover:text-foreground"
                            title="التفاصيل"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* View Mode: Table List */
        <div className="grid gap-4">
          {filteredBookings.length === 0 ? (
            <Card className="rounded-[2rem] border-border/70 bg-card/70 p-12 text-center text-muted-foreground">
              <User className="mx-auto h-12 w-12 text-primary/40 mb-3" />
              <p className="text-lg font-bold text-foreground">لا توجد حجوزات مطابقة للبحث</p>
              <p className="mt-1 text-xs">جرب تغيير شروط البحث أو اضغط على "تسجيل حجز جديد يدوياً"</p>
            </Card>
          ) : (
            filteredBookings.map((record) => (
              <Card
                key={record.id}
                className="card-elevated rounded-[2rem] border-border/70 bg-card/90 overflow-hidden hover:border-primary/50 transition-all"
              >
                <CardContent className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Client Main Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                      <User className="h-6 w-6" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-lg text-foreground truncate">{record.customerName}</h3>
                        <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold border", segmentMeta[record.segment].class)}>
                          {segmentMeta[record.segment].label}
                        </Badge>
                        <Badge variant="outline" className={cn("rounded-full px-3 py-0.5 text-xs font-bold border", statusMeta[record.status].class)}>
                          {statusMeta[record.status].label}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                        <span className="flex items-center gap-1 font-semibold text-foreground"><Phone className="h-3.5 w-3.5 text-primary" /> {record.phone}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" /> {record.branchName}</span>
                      </div>

                      <div className="text-xs text-foreground font-medium pt-1 line-clamp-1">
                        🩺 <strong>الخدمة:</strong> {record.serviceName} ({record.doctorName})
                      </div>
                    </div>
                  </div>

                  {/* Appointment Date & Actions */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 border-t lg:border-t-0 border-border/60 pt-3 lg:pt-0">
                    <div className="text-right space-y-1">
                      <div className="text-xs font-bold text-foreground flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-primary" /> {record.preferredDate}
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-primary" /> {record.preferredTime}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRecord(record)}
                        className="rounded-xl font-bold text-xs"
                      >
                        <Eye className="ml-1 h-3.5 w-3.5" />
                        التفاصيل الكاملة
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => {
                          setWhatsAppModalRecord(record);
                          setWhatsAppTemplate("confirmation");
                        }}
                        className="h-9 px-3 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 font-bold text-xs border border-emerald-500/20 transition-all gap-1.5"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>قوالب واتساب</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* WhatsApp Template Sender Modal */}
      <Dialog open={!!whatsAppModalRecord} onOpenChange={(open) => !open && setWhatsAppModalRecord(null)}>
        <DialogContent className="max-w-xl rounded-[2.5rem] p-6 md:p-8" dir="rtl">
          <DialogHeader className="border-b border-border/60 pb-3">
            <DialogTitle className="text-xl font-black text-foreground flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-emerald-500" />
              مراسلة العميل الذكية عبر الواتساب
            </DialogTitle>
          </DialogHeader>

          {whatsAppModalRecord && (
            <div className="space-y-4 pt-2">
              <div className="rounded-2xl border border-border/60 bg-muted/30 p-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-foreground">{whatsAppModalRecord.customerName}</div>
                  <div className="text-muted-foreground">{whatsAppModalRecord.phone} • {whatsAppModalRecord.branchName}</div>
                </div>
                <Badge variant="outline">{whatsAppModalRecord.serviceName}</Badge>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold">اختر قالب الرسالة المناسب:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "confirmation", label: "تأكيد موعد الحجز ✨" },
                    { id: "reminder", label: "تذكير قبل الموعد بـ 24h ⏰" },
                    { id: "instructions_laser", label: "تعليمات جلسة الليزر 📜" },
                    { id: "location", label: "موقع الفرع والخريطة 📍" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setWhatsAppTemplate(t.id)}
                      className={cn(
                        "rounded-xl border p-2.5 text-right text-xs font-bold transition-all",
                        whatsAppTemplate === t.id
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "border-border bg-card hover:bg-muted"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">معاينة نص الرسالة قبل الإرسال:</Label>
                <Textarea
                  value={generateWhatsAppMessage(whatsAppModalRecord, whatsAppTemplate)}
                  readOnly
                  rows={6}
                  className="rounded-2xl text-xs bg-background leading-relaxed font-sans"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setWhatsAppModalRecord(null)}
                  className="rounded-xl text-xs"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    openWhatsAppWithTemplate(whatsAppModalRecord, whatsAppTemplate);
                    setWhatsAppModalRecord(null);
                  }}
                  className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>فتح الواتساب والإرسال الآن</span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Record Full Details Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] p-6 md:p-8" dir="rtl">
          <DialogHeader className="border-b border-border/60 pb-3">
            <DialogTitle className="text-2xl font-black text-foreground flex items-center justify-between">
              <span>تفاصيل الحجز الكاملة</span>
              {selectedRecord && (
                <Badge variant="outline" className={cn("rounded-full px-3 py-0.5 text-xs font-bold border", statusMeta[selectedRecord.status].class)}>
                  {statusMeta[selectedRecord.status].label}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedRecord ? (
            <div className="space-y-6 pt-2">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                  <div className="text-[11px] text-muted-foreground">اسم العميل</div>
                  <div className="font-bold text-foreground text-sm">{selectedRecord.customerName}</div>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                  <div className="text-[11px] text-muted-foreground">رقم الهاتف</div>
                  <div className="font-bold text-foreground text-sm font-mono" dir="ltr">{selectedRecord.phone}</div>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                  <div className="text-[11px] text-muted-foreground">الخدمة المطلوبة</div>
                  <div className="font-bold text-foreground text-sm">{selectedRecord.serviceName}</div>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                  <div className="text-[11px] text-muted-foreground">الفرع والطبيب</div>
                  <div className="font-bold text-foreground text-sm">{selectedRecord.branchName} • {selectedRecord.doctorName}</div>
                </div>
              </div>

              {/* Update Status */}
              <div className="space-y-2">
                <Label className="font-bold text-xs text-foreground">تحديث حالة الحجز:</Label>
                <Select value={selectedRecord.status} onValueChange={(val: BookingStatus) => handleUpdateStatus(selectedRecord.id, val)}>
                  <SelectTrigger className="h-11 rounded-2xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="pending">⏳ قيد الانتظار والتدقيق</SelectItem>
                    <SelectItem value="confirmed">✅ مؤكد بالحضور</SelectItem>
                    <SelectItem value="completed">🌸 تمت الجلسة بنجاح</SelectItem>
                    <SelectItem value="cancelled">❌ ملغي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Customer Notes */}
              <div className="space-y-2">
                <Label className="font-bold text-xs text-foreground">ملاحظات العميل وسجل العيادة:</Label>
                <Textarea
                  value={selectedRecord.notes}
                  onChange={(e) => handleUpdateNotes(selectedRecord.id, e.target.value)}
                  rows={3}
                  className="rounded-2xl text-xs bg-background"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedRecord.id)} className="rounded-xl text-xs">
                  <Trash2 className="ml-1 h-3.5 w-3.5" />
                  حذف السجل
                </Button>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSaveRecord(selectedRecord)}
                    className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs px-5 shadow-md"
                  >
                    <Save className="ml-1.5 h-4 w-4" />
                    حفظ التعديلات
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => {
                      setWhatsAppModalRecord(selectedRecord);
                      setWhatsAppTemplate("confirmation");
                      setSelectedRecord(null);
                    }}
                    className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5"
                  >
                    <MessageCircle className="ml-1.5 h-4 w-4" />
                    مراسلة واتساب
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Manual New Booking Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-xl rounded-[2.5rem] p-6 md:p-8" dir="rtl">
          <DialogHeader className="border-b border-border/60 pb-4">
            <DialogTitle className="text-2xl font-black text-foreground flex items-center gap-2">
              <Plus className="h-6 w-6 text-primary" />
              تسجيل حجز جديد هاتفياً أو من العيادة
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddBooking} className="space-y-4 pt-2">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-bold text-xs text-foreground">اسم العميل بالكامل *</Label>
                <Input
                  required
                  value={newForm.customerName}
                  onChange={(e) => setNewForm({ ...newForm, customerName: e.target.value })}
                  placeholder="سارة محمد..."
                  className="h-11 rounded-2xl text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-xs text-foreground">رقم الهاتف *</Label>
                <Input
                  required
                  value={newForm.phone}
                  onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                  placeholder="01012345678"
                  className="h-11 rounded-2xl text-xs"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-bold text-xs text-foreground">الفرع المحجوز</Label>
                <Select value={newForm.branchName} onValueChange={(val) => setNewForm({ ...newForm, branchName: val })}>
                  <SelectTrigger className="h-11 rounded-2xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="فرع مصر الجديدة (شيراتون)">فرع مصر الجديدة (شيراتون)</SelectItem>
                    <SelectItem value="فرع الدقي">فرع الدقي</SelectItem>
                    <SelectItem value="فرع 6 أكتوبر">فرع 6 أكتوبر</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-xs text-foreground">تاريخ الجلسة</Label>
                <Input
                  type="date"
                  value={newForm.preferredDate}
                  onChange={(e) => setNewForm({ ...newForm, preferredDate: e.target.value })}
                  className="h-11 rounded-2xl text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-xs text-foreground">ملاحظات الحجز والاستقبال</Label>
              <Textarea
                value={newForm.notes}
                onChange={(e) => setNewForm({ ...newForm, notes: e.target.value })}
                rows={2}
                placeholder="أضف أي ملاحظات خاصة بالعميل..."
                className="rounded-2xl text-xs"
              />
            </div>

            <Button type="submit" className="w-full h-12 rounded-2xl btn-primary-gradient border-0 font-bold text-base mt-2">
              حفظ وتأكيد الحجز
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
