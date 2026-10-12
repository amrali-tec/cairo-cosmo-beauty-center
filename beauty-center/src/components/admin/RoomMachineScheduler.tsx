// ===============================================
// src/components/admin/RoomMachineScheduler.tsx
// منظومة جدولة غرف العيادات وأجهزة الليزر المتقدمة (Clinical Asset & Room Scheduler)
// ===============================================

import { useState, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Stethoscope,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Zap,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User,
  Wrench,
  Search,
  RefreshCw,
  Trash2,
  Layers,
  LayoutGrid,
  List,
  CalendarDays,
  Info,
  Check,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getStoredBookings } from "@/services/realtimeBookingService";

export interface ClinicRoomDevice {
  id: string;
  name: string;
  deviceModel: string;
  branch: string;
  category: "laser" | "skincare" | "injections" | "body";
  status: "available" | "in_use" | "maintenance";
  currentPatient?: string;
  doctor?: string;
  timeSlot?: string;
  color: string;
  specifications: string[];
}

export interface RoomBookingSlot {
  id: string;
  roomId: string;
  roomName: string;
  branch: string;
  customerName: string;
  doctorName: string;
  serviceName: string;
  timeHour: string; // e.g. "04:00 م"
  durationMinutes: number;
  date: string;
  notes?: string;
}

const STORAGE_SLOTS_KEY = "clinic_room_reservations_v1";

const initialRooms: ClinicRoomDevice[] = [
  {
    id: "rm-1",
    name: "غرفة الليزر 1 (VIP Suite)",
    deviceModel: "كانديلا جينتل ماكس برو 2026 (Candela GentleMax Pro Plus)",
    branch: "فرع مصر الجديدة (شيراتون)",
    category: "laser",
    status: "available",
    color: "from-rose-500/10 via-card to-pink-500/5 border-pink-500/30 hover:border-pink-500/60",
    specifications: ["تبريد DCD فوري", "ألكسندرايت 755nm + إن دي ياج 1064nm", "لجميع أنواع البشرة"],
  },
  {
    id: "rm-2",
    name: "غرفة الليزر 2 (بدون ألم)",
    deviceModel: "ديكا موفيو ألكسندرايت الإيطالي (DEKA Motus AX Moveo)",
    branch: "فرع مصر الجديدة (شيراتون)",
    category: "laser",
    status: "available",
    color: "from-purple-500/10 via-card to-indigo-500/5 border-purple-500/30 hover:border-purple-500/60",
    specifications: ["تقنية Moveo بدون ألم", "خاص بالشعر الوبري والناعم", "آمن للبشرة الحساسة"],
  },
  {
    id: "rm-3",
    name: "جناح الهيدرافيشل والعناية الملكية",
    deviceModel: "هيدرافيشل إليت بلس الأصلي الأمريكي (Hydrafacial Elite USA)",
    branch: "فرع مصر الجديدة (شيراتون)",
    category: "skincare",
    status: "available",
    color: "from-cyan-500/10 via-card to-sky-500/5 border-cyan-500/30 hover:border-cyan-500/60",
    specifications: ["تنظيف عميق 12 خطوة", "سيرومات مضادة للأكسدة", "تقشير مائي بحمض الهيالورونيك"],
  },
  {
    id: "rm-4",
    name: "عيادة الحقن التجميلي والبوتوكس",
    deviceModel: "إضاءة جراحية ألمانية + مبرد موضعي Cryo 6 Zimmer",
    branch: "فرع مصر الجديدة (شيراتون)",
    category: "injections",
    status: "available",
    color: "from-emerald-500/10 via-card to-teal-500/5 border-emerald-500/30 hover:border-emerald-500/60",
    specifications: ["فيلر وبوتوكس معتمد", "خيوط شد كورية PDO", "تعقيم جراحي كامل"],
  },
  {
    id: "rm-5",
    name: "جناح نحت القوام وتنسيق الدهون",
    deviceModel: "كول سكلبتنج 360 (CoolSculpting) + EMS Muscle Sculpt",
    branch: "فرع مصر الجديدة (شيراتون)",
    category: "body",
    status: "available",
    color: "from-amber-500/10 via-card to-orange-500/5 border-amber-500/30 hover:border-amber-500/60",
    specifications: ["تجميد دهون 360 درجة", "بناء عضلات EMS", "بدون تخدير أو جراحة"],
  },
  {
    id: "rm-6",
    name: "غرفة ليزر كانديلا (الدقي)",
    deviceModel: "Candela GentleMax Pro Plus (فرع الدقي)",
    branch: "فرع الدقي",
    category: "laser",
    status: "available",
    color: "from-rose-500/10 via-card to-pink-500/5 border-pink-500/30 hover:border-pink-500/60",
    specifications: ["أعلى طاقة ليزر", "نبضات فائقة السرعة", "باقة الرتوش المجانية"],
  },
  {
    id: "rm-7",
    name: "جناح الجلدية والليزر (أكتوبر)",
    deviceModel: "DEKA Motus AX + Fractional CO2 Laser (أكتوبر)",
    branch: "فرع 6 أكتوبر",
    category: "laser",
    status: "available",
    color: "from-purple-500/10 via-card to-indigo-500/5 border-purple-500/30 hover:border-purple-500/60",
    specifications: ["فراكشنال ليزر للندبات", "إزالة تصبغات", "تجديد الكولاجين"],
  },
];

const timeHours = [
  "10:00 ص",
  "11:00 ص",
  "12:00 م",
  "01:00 م",
  "02:00 م",
  "03:00 م",
  "04:00 م",
  "05:00 م",
  "06:00 م",
  "07:00 م",
  "08:00 م",
  "09:00 م",
];

function loadStoredSlots(): RoomBookingSlot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_SLOTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveStoredSlots(slots: RoomBookingSlot[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_SLOTS_KEY, JSON.stringify(slots));
    window.dispatchEvent(new CustomEvent("cosmo:room_slots_updated"));
  } catch {}
}

export function RoomMachineScheduler() {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<ClinicRoomDevice[]>(initialRooms);
  const [slots, setSlots] = useState<RoomBookingSlot[]>(() => loadStoredSlots());
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"matrix" | "grid" | "list">("matrix");
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);

  // New Reservation Form State
  const [reserveRoomId, setReserveRoomId] = useState<string>("rm-1");
  const [reservePatient, setReservePatient] = useState<string>("");
  const [reserveDoctor, setReserveDoctor] = useState<string>("د. ناهد سمير (استشاري الجلدية)");
  const [reserveService, setReserveService] = useState<string>("جلسة ليزر كانديلا برو");
  const [reserveHour, setReserveHour] = useState<string>("04:00 م");
  const [reserveNotes, setReserveNotes] = useState<string>("");

  // Sync with stored real bookings from CRM on mount
  useEffect(() => {
    const storedRealBookings = getStoredBookings();
    if (storedRealBookings.length > 0 && slots.length === 0) {
      // Auto-assign real bookings to relevant rooms
      const mappedSlots: RoomBookingSlot[] = storedRealBookings.map((b, idx) => {
        let assignedRoomId = "rm-1";
        if (b.serviceName?.includes("هيدرافيشل") || b.serviceName?.includes("بشرة")) assignedRoomId = "rm-3";
        else if (b.serviceName?.includes("فيلر") || b.serviceName?.includes("بوتوكس")) assignedRoomId = "rm-4";
        else if (b.serviceName?.includes("نحت") || b.serviceName?.includes("قوام")) assignedRoomId = "rm-5";
        else if (b.branchName?.includes("الدقي")) assignedRoomId = "rm-6";
        else if (b.branchName?.includes("أكتوبر")) assignedRoomId = "rm-7";

        const room = initialRooms.find((r) => r.id === assignedRoomId) || initialRooms[0];
        const hour = b.preferredTime || timeHours[idx % timeHours.length];

        return {
          id: `slot-real-${b.id || idx}`,
          roomId: room.id,
          roomName: room.name,
          branch: room.branch,
          customerName: b.customerName,
          doctorName: b.doctorName || "د. ناهد سمير",
          serviceName: b.serviceName || "جلسة تجميلية",
          timeHour: hour,
          durationMinutes: 60,
          date: b.preferredDate || selectedDate,
          notes: b.notes,
        };
      });

      setSlots(mappedSlots);
      saveStoredSlots(mappedSlots);
    }
  }, []);

  // Filter rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const matchBranch = selectedBranch === "all" || r.branch.includes(selectedBranch);
      const matchCategory = selectedCategory === "all" || r.category === selectedCategory;
      const matchSearch =
        searchQuery === "" ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.deviceModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.branch.toLowerCase().includes(searchQuery.toLowerCase());
      return matchBranch && matchCategory && matchSearch;
    });
  }, [rooms, selectedBranch, selectedCategory, searchQuery]);

  // Capacity KPIs
  const totalRoomsCount = rooms.length;
  const availableCount = rooms.filter((r) => r.status === "available").length;
  const inUseCount = rooms.filter((r) => r.status === "in_use").length;
  const maintenanceCount = rooms.filter((r) => r.status === "maintenance").length;
  const occupancyPercentage = Math.round(((inUseCount + (slots.length > 0 ? 1 : 0)) / totalRoomsCount) * 100);

  const handleToggleRoomStatus = (roomId: string, newStatus: ClinicRoomDevice["status"]) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r))
    );

    const labels = {
      available: "متاحة للحجز والاستقبال 🟢",
      in_use: "داخل الجلسة حالياً مع الطبيب 🟣",
      maintenance: "تعقيم وصيانة دورية للجهاز 🟡",
    };

    toast({
      title: "تم تحديث حالة الغرفة / الجهاز",
      description: labels[newStatus],
    });
  };

  const handleAddReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservePatient.trim()) {
      toast({
        title: "بيانات غير مكتملة",
        description: "يرجى كتابة اسم المراجع",
        variant: "destructive",
      });
      return;
    }

    // Check for room conflict at same date & hour
    const hasConflict = slots.some(
      (s) => s.roomId === reserveRoomId && s.timeHour === reserveHour && s.date === selectedDate
    );

    if (hasConflict) {
      toast({
        title: "⚠️ تنبيه تضارب في المواعيد!",
        description: "هذه الغرفة / الجهاز محجوز بالفعل في هذا التوقيت لنفس التاريخ. يرجى اختيار ساعة أو غرفة أخرى.",
        variant: "destructive",
      });
      return;
    }

    const room = rooms.find((r) => r.id === reserveRoomId);

    const newSlot: RoomBookingSlot = {
      id: `slot-${Date.now()}`,
      roomId: reserveRoomId,
      roomName: room?.name || "غرفة علاجية",
      branch: room?.branch || "فرع مصر الجديدة (شيراتون)",
      customerName: reservePatient.trim(),
      doctorName: reserveDoctor,
      serviceName: reserveService,
      timeHour: reserveHour,
      durationMinutes: 60,
      date: selectedDate,
      notes: reserveNotes,
    };

    const updated = [...slots, newSlot];
    setSlots(updated);
    saveStoredSlots(updated);
    setIsReserveModalOpen(false);
    setReservePatient("");
    setReserveNotes("");

    toast({
      title: "تم تثبيت حجز الغرفة بنجاح 📅",
      description: `تم حجز ${newSlot.roomName} للمراجع (${newSlot.customerName}) الساعة ${newSlot.timeHour}`,
    });
  };

  const handleDeleteSlot = (slotId: string) => {
    const updated = slots.filter((s) => s.id !== slotId);
    setSlots(updated);
    saveStoredSlots(updated);
    toast({
      title: "تم إلغاء حجز الغرفة",
      description: "تم تحرير الموعد وإتاحته للجدولة من جديد.",
    });
  };

  const handleClearAllSlots = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في إفراغ جدول الغرف بالكامل لهذا اليوم؟")) {
      setSlots([]);
      saveStoredSlots([]);
      toast({
        title: "تم إفراغ جدول الغرف بالكامل 🗑️",
        description: "كافة الغرف والأجهزة متاحة الآن للحجز 100%.",
      });
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* 1. Live Capacity & KPI Ribbon */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-5">
        <div className="rounded-3xl border border-border/70 bg-card/90 p-4 shadow-sm space-y-1">
          <div className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span>إجمالي الغرف والأجهزة</span>
          </div>
          <div className="text-2xl font-black text-foreground">{totalRoomsCount} <span className="text-xs text-muted-foreground font-normal">أجهزة طبية</span></div>
        </div>

        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-sm space-y-1">
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>متاحة فوراً للحجز</span>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{availableCount} <span className="text-xs font-normal">جاهزة 🟢</span></div>
        </div>

        <div className="rounded-3xl border border-purple-500/20 bg-purple-500/5 p-4 shadow-sm space-y-1">
          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5" />
            <span>قيد الجلسة حالياً</span>
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{inUseCount} <span className="text-xs font-normal">مشغولة 🟣</span></div>
        </div>

        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-4 shadow-sm space-y-1">
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
            <Wrench className="h-3.5 w-3.5" />
            <span>تعقيم وصيانة دورية</span>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{maintenanceCount} <span className="text-xs font-normal">تعقيم 🟡</span></div>
        </div>

        <div className="col-span-2 md:col-span-1 rounded-3xl border border-primary/25 bg-primary/5 p-4 shadow-sm space-y-1">
          <div className="text-[11px] text-primary font-semibold flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            <span>معدل الإشغال اللحظي</span>
          </div>
          <div className="text-2xl font-black text-primary">{occupancyPercentage}% <span className="text-xs font-normal">كفاءة تشغيل</span></div>
        </div>
      </section>

      {/* 2. Enhanced Filter & View Mode Controls Bar */}
      <Card className="rounded-[2.5rem] border-border/70 bg-card/90 shadow-sm p-4 md:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الغرفة، نوع الجهاز، أو الفرع..."
              className="pr-10 rounded-2xl text-xs bg-background"
            />
          </div>

          {/* Branch Selector */}
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="h-10 w-44 rounded-2xl text-xs font-bold bg-background">
              <MapPin className="h-3.5 w-3.5 ml-1.5 text-primary" />
              <SelectValue placeholder="الفرع" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="all">جميع الفروع (3 فروع)</SelectItem>
              <SelectItem value="شيراتون">مصر الجديدة (شيراتون)</SelectItem>
              <SelectItem value="الدقي">فرع الدقي</SelectItem>
              <SelectItem value="أكتوبر">فرع 6 أكتوبر</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Picker */}
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-10 w-40 rounded-2xl text-xs font-bold bg-background"
          />

          {/* View Mode Switcher */}
          <div className="flex items-center rounded-2xl border border-border/70 bg-background p-1">
            <button
              onClick={() => setViewMode("matrix")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === "matrix" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>البطاقات</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === "grid" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>المخطط الزمني للساعات</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === "list" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>قائمة المواعيد ({slots.length})</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAllSlots}
              className="rounded-2xl border-rose-500/30 text-rose-600 hover:bg-rose-500/10 text-xs font-bold gap-1.5"
              title="إفراغ جدول الغرف"
            >
              <Trash2 className="h-3.5 w-3.5 text-rose-500" />
              <span>تصفير الجدول</span>
            </Button>

            <Button
              size="sm"
              onClick={() => setIsReserveModalOpen(true)}
              className="rounded-2xl text-xs font-bold gap-1.5 btn-primary-gradient shadow-md shadow-primary/20"
            >
              <Plus className="h-4 w-4" />
              <span>حجز موعد على جهاز</span>
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="border-t border-border/50 pt-3">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="bg-background/80 rounded-2xl p-1 w-full justify-start overflow-x-auto flex-nowrap">
              <TabsTrigger value="all" className="rounded-xl text-xs font-bold">
                🌟 جميع الأجهزة والغرف ({rooms.length})
              </TabsTrigger>
              <TabsTrigger value="laser" className="rounded-xl text-xs font-bold">
                ⚡ ليزر كانديلا وديكا ({rooms.filter((r) => r.category === "laser").length})
              </TabsTrigger>
              <TabsTrigger value="injections" className="rounded-xl text-xs font-bold">
                💉 عيادات الحقن والفيلر ({rooms.filter((r) => r.category === "injections").length})
              </TabsTrigger>
              <TabsTrigger value="skincare" className="rounded-xl text-xs font-bold">
                💆‍♀️ أجنحة الهيدرافيشل ({rooms.filter((r) => r.category === "skincare").length})
              </TabsTrigger>
              <TabsTrigger value="body" className="rounded-xl text-xs font-bold">
                🏃‍♀️ نحت وتنسيق القوام ({rooms.filter((r) => r.category === "body").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {/* 3. VIEW 1: Cards Matrix View */}
      {viewMode === "matrix" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRooms.map((room) => {
            const roomSlots = slots.filter((s) => s.roomId === room.id && s.date === selectedDate);
            const isCurrentlyBooked = roomSlots.length > 0;

            return (
              <Card
                key={room.id}
                className={`rounded-[2rem] border bg-gradient-to-br p-5 space-y-4 shadow-sm transition-all duration-300 hover:shadow-lg ${room.color}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h4 className="font-black text-sm text-foreground">{room.name}</h4>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary shrink-0" />
                      <span>{room.branch}</span>
                    </p>
                  </div>

                  {room.status === "available" && !isCurrentlyBooked && (
                    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                      متاح الآن 🟢
                    </Badge>
                  )}
                  {(room.status === "in_use" || isCurrentlyBooked) && (
                    <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px] font-bold">
                      مجدول / قيد الجلسة 🟣
                    </Badge>
                  )}
                  {room.status === "maintenance" && (
                    <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-bold">
                      تعقيم 🟡
                    </Badge>
                  )}
                </div>

                {/* Device Model Info */}
                <div className="rounded-2xl bg-card/90 p-3.5 space-y-2 text-xs border border-border/50">
                  <div className="font-bold text-foreground text-[11px] flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">{room.deviceModel}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {room.specifications.map((spec, i) => (
                      <span key={i} className="text-[9px] bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-md font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Scheduled Slots Count */}
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground font-semibold">حجوزات اليوم:</span>
                    <Badge variant="secondary" className="font-bold text-[10px]">
                      {roomSlots.length} مواعيد
                    </Badge>
                  </div>
                </div>

                {/* Quick Status Toggles & Quick Reserve */}
                <div className="space-y-2 pt-1 border-t border-border/40">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground font-semibold">الحالة:</span>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant={room.status === "available" ? "default" : "ghost"}
                        onClick={() => handleToggleRoomStatus(room.id, "available")}
                        className="h-6 px-2 text-[9px] rounded-lg"
                      >
                        متاح
                      </Button>
                      <Button
                        size="sm"
                        variant={room.status === "in_use" ? "default" : "ghost"}
                        onClick={() => handleToggleRoomStatus(room.id, "in_use")}
                        className="h-6 px-2 text-[9px] rounded-lg text-purple-600"
                      >
                        مشغول
                      </Button>
                      <Button
                        size="sm"
                        variant={room.status === "maintenance" ? "default" : "ghost"}
                        onClick={() => handleToggleRoomStatus(room.id, "maintenance")}
                        className="h-6 px-2 text-[9px] rounded-lg text-amber-600"
                      >
                        تعقيم
                      </Button>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReserveRoomId(room.id);
                      setIsReserveModalOpen(true);
                    }}
                    className="w-full h-8 rounded-xl text-xs font-bold gap-1 bg-background/80 hover:bg-primary hover:text-primary-foreground"
                  >
                    <Plus className="h-3 w-3" />
                    <span>حجز موعد على هذا الجهاز</span>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 4. VIEW 2: Hourly Time Schedule Grid Matrix */}
      {viewMode === "grid" && (
        <Card className="rounded-[2.5rem] border-border/70 bg-card/90 shadow-md">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-black text-foreground flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                المخطط الزمني لساعات إشغال الأجهزة الطبية ({selectedDate})
              </CardTitle>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary font-bold">
                {slots.length} مواعيد مجدولة
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              انقر على أي خانة فارغة (+) لحجز الساعة فوراً ومنع أي تضارب
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 md:p-6 overflow-x-auto">
            <table className="w-full text-right text-xs min-w-[760px]">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground">
                  <th className="pb-3 pr-2 font-bold w-52">الغرفة والجهاز الطبي</th>
                  {timeHours.map((h) => (
                    <th key={h} className="pb-3 text-center font-semibold text-[11px]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 pr-2 font-bold text-foreground">
                      <div className="truncate max-w-[190px]">{room.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{room.branch}</div>
                    </td>

                    {timeHours.map((h) => {
                      const slot = slots.find(
                        (s) => s.roomId === room.id && s.timeHour === h && s.date === selectedDate
                      );

                      return (
                        <td key={h} className="py-2.5 px-1 text-center">
                          {slot ? (
                            <div
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="rounded-xl p-1.5 bg-primary/15 border border-primary/30 text-primary space-y-0.5 shadow-xs cursor-pointer hover:bg-rose-500/15 hover:border-rose-500/40 hover:text-rose-600 transition-all group"
                              title={`المراجع: ${slot.customerName} - ${slot.serviceName} (${slot.doctorName})\nانقر للإلغاء`}
                            >
                              <div className="font-bold text-[10px] truncate max-w-[80px] mx-auto group-hover:hidden">
                                {slot.customerName}
                              </div>
                              <div className="font-bold text-[10px] truncate max-w-[80px] mx-auto hidden group-hover:block">
                                إلغاء ✕
                              </div>
                              <div className="text-[8px] opacity-80 truncate max-w-[80px] mx-auto">
                                {slot.doctorName.split(" ")[1] || slot.doctorName}
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setReserveRoomId(room.id);
                                setReserveHour(h);
                                setIsReserveModalOpen(true);
                              }}
                              className="h-9 w-full rounded-xl border border-dashed border-border/60 hover:border-primary/60 hover:bg-primary/10 transition-all flex items-center justify-center text-muted-foreground hover:text-primary font-bold text-xs"
                              title={`حجز هذه الساعة (${h})`}
                            >
                              +
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* 5. VIEW 3: Reservations Manifest List */}
      {viewMode === "list" && (
        <Card className="rounded-[2.5rem] border-border/70 bg-card/90 shadow-md">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-base font-black text-foreground flex items-center gap-2">
              <List className="h-4 w-4 text-primary" />
              سجل الحجوزات والمواعيد المسجلة على الغرف ({slots.length} موعد)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {slots.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-xs space-y-2">
                <CalendarDays className="h-8 w-8 text-primary/40 mx-auto" />
                <p className="font-bold text-foreground">لا توجد حجوزات غرف مسجلة حالياً</p>
                <p className="text-[11px] max-w-sm mx-auto">
                  تظهر هنا قائمة المواعيد المجدولة على أجهزة الليزر وغرف الكشف مع إمكانية التعديل والإلغاء.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground">
                      <th className="pb-3 font-semibold">المراجع</th>
                      <th className="pb-3 font-semibold">الغرفة والجهاز الطبي</th>
                      <th className="pb-3 font-semibold">الخدمة والتخصص</th>
                      <th className="pb-3 font-semibold">الطبيب المعالج</th>
                      <th className="pb-3 font-semibold">التوقيت والتاريخ</th>
                      <th className="pb-3 font-semibold text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {slots.map((s) => (
                      <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 font-bold text-foreground">{s.customerName}</td>
                        <td className="py-3">
                          <div className="font-medium text-foreground">{s.roomName}</div>
                          <div className="text-[10px] text-muted-foreground">{s.branch}</div>
                        </td>
                        <td className="py-3 text-muted-foreground">{s.serviceName}</td>
                        <td className="py-3 font-medium text-foreground">{s.doctorName}</td>
                        <td className="py-3 font-bold text-primary">
                          <div>{s.timeHour}</div>
                          <div className="text-[10px] font-normal text-muted-foreground">{s.date}</div>
                        </td>
                        <td className="py-3 text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteSlot(s.id)}
                            className="h-7 text-rose-600 hover:bg-rose-500/10 text-xs px-2 rounded-lg font-bold"
                          >
                            إلغاء الحجز
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 6. Reservation Dialog Modal */}
      <Dialog open={isReserveModalOpen} onOpenChange={setIsReserveModalOpen}>
        <DialogContent className="max-w-lg rounded-[2.5rem] p-6 md:p-8" dir="rtl">
          <DialogHeader className="border-b border-border/60 pb-3">
            <DialogTitle className="text-xl font-black text-foreground flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              حجز موعد على جهاز / غرفة كشف طبية
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              تسجيل وتسكين موعد مباشر على غرف وأجهزة العيادة الطبية لمنع التعارضات.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddReservation} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">الغرفة / الجهاز الطبي المستهدف *</Label>
              <Select value={reserveRoomId} onValueChange={setReserveRoomId}>
                <SelectTrigger className="rounded-xl text-xs bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  {rooms.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name} — {r.branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">اسم المراجع / العميل *</Label>
              <Input
                value={reservePatient}
                onChange={(e) => setReservePatient(e.target.value)}
                placeholder="مثال: ياسمين خالد علي"
                className="rounded-xl text-xs bg-background"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">الطبيب الاستشاري</Label>
                <Select value={reserveDoctor} onValueChange={setReserveDoctor}>
                  <SelectTrigger className="rounded-xl text-xs bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="د. ناهد سمير (استشاري الجلدية)">د. ناهد سمير (جلدية وتجميل)</SelectItem>
                    <SelectItem value="د. باسم زكي (استشاري طب تجميل)">د. باسم زكي (طب تجميلي)</SelectItem>
                    <SelectItem value="د. أحمد الشريف (استشاري جراحة)">د. أحمد الشريف (نحت قوام)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">ساعة الحجز</Label>
                <Select value={reserveHour} onValueChange={setReserveHour}>
                  <SelectTrigger className="rounded-xl text-xs bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    {timeHours.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">الخدمة الطبية المطلوبة</Label>
              <Input
                value={reserveService}
                onChange={(e) => setReserveService(e.target.value)}
                placeholder="مثال: ليزر إزالة الشعر كانديلا"
                className="rounded-xl text-xs bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">ملاحظات إضافية (اختياري)</Label>
              <Input
                value={reserveNotes}
                onChange={(e) => setReserveNotes(e.target.value)}
                placeholder="مخدر موضعي، رتوش، تفضيلات خاصة..."
                className="rounded-xl text-xs bg-background"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsReserveModalOpen(false)}
                className="rounded-xl text-xs"
              >
                إلغاء
              </Button>
              <Button type="submit" className="rounded-xl text-xs font-bold btn-primary-gradient">
                تثبيت حجز الغرفة 🚀
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
