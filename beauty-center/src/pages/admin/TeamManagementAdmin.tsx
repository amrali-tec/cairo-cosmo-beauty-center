// ============================================
// src/pages/admin/TeamManagementAdmin.tsx
// ============================================
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  UserPlus,
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Lock,
  Key,
  Building2,
  Stethoscope,
  Headphones,
  Sparkles,
  ChevronDown,
  Mail,
  Phone,
  Shield,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { branches } from "@/lib/data/branches";

export type RoleType = "admin" | "doctor" | "receptionist" | "marketer" | "viewer";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: RoleType;
  branchId: string; // 'all' or branch id
  status: "active" | "inactive";
  lastLogin?: string;
  createdAt: string;
}

const ROLE_METADATA: Record<
  RoleType,
  { label: string; description: string; color: string; badgeVariant: "default" | "secondary" | "outline" | "destructive" }
> = {
  admin: {
    label: "مدير عام (Full Admin)",
    description: "صلاحيات كاملة للتحكم في الحجوزات، العملاء، الفريق، العروض، وإعدادات النظام الأمني.",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    badgeVariant: "default",
  },
  doctor: {
    label: "طبيب / استشاري (Consultant)",
    description: "صلاحية الاطلاع على ملفات العملاء الطبية، إضافة الملاحظات العلاجية، وجدول المواعيد.",
    color: "text-rose-500 bg-rose-500/10 border-rose-500/30",
    badgeVariant: "secondary",
  },
  receptionist: {
    label: "موظف استقبال (Reception)",
    description: "صلاحية استلام وإنشاء وتحديث حالات الحجوزات والمواعيد لفرع محدد.",
    color: "text-blue-500 bg-blue-500/10 border-blue-500/30",
    badgeVariant: "outline",
  },
  marketer: {
    label: "مسؤول تسويق (Marketing)",
    description: "صلاحية نشر المقالات الطبية، إضافة وتعديل العروض والباقات، ومتابعة التقييمات.",
    color: "text-purple-500 bg-purple-500/10 border-purple-500/30",
    badgeVariant: "secondary",
  },
  viewer: {
    label: "مشاهد (اطلاع فقط / Read-Only)",
    description: "صلاحية الاطلاع فقط على الحجوزات والبيانات والتقارير بدون إمكانية التعديل أو الحذف.",
    color: "text-slate-600 bg-slate-500/10 border-slate-500/30",
    badgeVariant: "outline",
  },
};

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tm-1",
    name: "د. باسم زكي",
    email: "dr.bassem@cairocosmo.online",
    phone: "01000000001",
    role: "admin",
    branchId: "all",
    status: "active",
    lastLogin: "منذ 10 دقائق",
    createdAt: "2026-01-01",
  },
  {
    id: "tm-2",
    name: "د. ناهد سمير",
    email: "dr.nahid@cairocosmo.online",
    phone: "01000000002",
    role: "doctor",
    branchId: "sheraton",
    status: "active",
    lastLogin: "منذ ساعتين",
    createdAt: "2026-01-05",
  },
  {
    id: "tm-3",
    name: "أحمد الشريف (مدير الاستقبال)",
    email: "sheraton@cairocosmo.online",
    phone: "01000000003",
    role: "receptionist",
    branchId: "sheraton",
    status: "active",
    lastLogin: "اليوم 09:30 ص",
    createdAt: "2026-02-01",
  },
  {
    id: "tm-4",
    name: "سارة محمود (استقبال الدقي)",
    email: "dokki@cairocosmo.online",
    phone: "01000000004",
    role: "receptionist",
    branchId: "dokki",
    status: "active",
    lastLogin: "أمس 04:15 م",
    createdAt: "2026-02-10",
  },
  {
    id: "tm-5",
    name: "م. كريم طارق (مسؤول التسويق)",
    email: "marketing@cairocosmo.online",
    phone: "01000000005",
    role: "marketer",
    branchId: "all",
    status: "active",
    lastLogin: "منذ 3 أيام",
    createdAt: "2026-02-15",
  },
];

const PERMISSIONS_MATRIX = [
  { feature: "إدارة الحجوزات والمواعيد", admin: true, doctor: true, receptionist: true, marketer: false, viewer: true },
  { feature: "إنشاء وتعديل الحجز", admin: true, doctor: false, receptionist: true, marketer: false, viewer: false },
  { feature: "حذف وإلغاء الحجوزات", admin: true, doctor: false, receptionist: false, marketer: false, viewer: false },
  { feature: "عرض بيانات وتليفونات العملاء (CRM)", admin: true, doctor: true, receptionist: true, marketer: false, viewer: true },
  { feature: "إضافة ملاحظات وتاريخ طبي للمراجع", admin: true, doctor: true, receptionist: false, marketer: false, viewer: false },
  { feature: "إدارة العروض والباقات الترويجية", admin: true, doctor: false, receptionist: false, marketer: true, viewer: false },
  { feature: "نشر وتعديل المقالات الطبية (Blog)", admin: true, doctor: true, receptionist: false, marketer: true, viewer: false },
  { feature: "إدارة أعضاء الفريق والصلاحيات", admin: true, doctor: false, receptionist: false, marketer: false, viewer: false },
  { feature: "تغيير إعدادات السيرفر والبريد الإلكتروني", admin: true, doctor: false, receptionist: false, marketer: false, viewer: false },
];

const STORAGE_KEY = "cairo_cosmo_team_members_v1";

export default function TeamManagementAdmin() {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return DEFAULT_TEAM_MEMBERS;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>("all");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "receptionist" as RoleType,
    branchId: "all",
    password: "",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }, [members]);

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm);

    const matchesRole = selectedRoleFilter === "all" || m.role === selectedRoleFilter;
    const matchesBranch = selectedBranchFilter === "all" || m.branchId === selectedBranchFilter;

    return matchesSearch && matchesRole && matchesBranch;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "receptionist",
      branchId: "all",
      password: "",
      status: "active",
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      branchId: member.branchId,
      password: "",
      status: member.status,
    });
    setIsEditOpen(true);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanPhone = formData.phone.trim();

    if (!cleanName) {
      toast({ title: "تنبيه ⚠️", description: "يرجى كتابة الاسم الكامل للموظف أو الطبيب.", variant: "destructive" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      toast({
        title: "صيغة البريد غير صحيحة ⚠️",
        description: "يرجى كتابة البريد الإلكتروني بصيغة صحيحة (مثال: name@gmail.com).",
        variant: "destructive",
      });
      return;
    }

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      role: formData.role,
      branchId: formData.branchId,
      status: formData.status,
      lastLogin: "لم يسجل بعد",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setMembers((prev) => [newMember, ...prev]);
    setIsAddOpen(false);

    // Sync to Server API
    try {
      await fetch("/api/team/team-list.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          role: formData.role,
          branchId: formData.branchId,
          status: formData.status,
        }),
      });
    } catch {}

    toast({
      title: "تم إضافة العضو بنجاح 🎉",
      description: `تم منح ${cleanName} صلاحية (${ROLE_METADATA[formData.role].label}).`,
    });
  };

  const handleUpdateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    setMembers((prev) =>
      prev.map((m) =>
        m.id === editingMember.id
          ? {
              ...m,
              name: formData.name.trim(),
              email: formData.email.trim(),
              phone: formData.phone.trim(),
              role: formData.role,
              branchId: formData.branchId,
              status: formData.status,
            }
          : m
      )
    );

    setIsEditOpen(false);
    setEditingMember(null);
    toast({
      title: "تم تحديث البيانات والصلاحيات ⚙️",
      description: `تم حفظ تعديلات العضو ${formData.name} بنجاح.`,
    });
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`هل أنت تأكد من إلغاء وتجميد حساب العضو (${name})؟`)) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast({
        title: "تم حذف العضو",
        description: `تم إزالة حساب ${name} من قائمة الفريق.`,
      });
    }
  };

  const getBranchLabel = (id: string) => {
    if (id === "all") return "جميع الفروع";
    const branch = branches.find((b) => b.id === id);
    return branch ? branch.title.ar : id;
  };

  // Metrics
  const totalCount = members.length;
  const adminCount = members.filter((m) => m.role === "admin").length;
  const doctorCount = members.filter((m) => m.role === "doctor").length;
  const receptionCount = members.filter((m) => m.role === "receptionist").length;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary/15 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
              <ShieldCheck className="h-5 w-5" />
              <span>نظام إدارة فريق العمل والأذونات الإدارية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">إدارة الأعضاء والصلاحيات</h2>
            <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
              إضافة وتصنيف أفراد الفريق الطبي والاستقبال، وتحديد حدود الاطلاع على الحجوزات والبيانات حسب الفرع والدور الوظيفي.
            </p>
          </div>

          <Button onClick={handleOpenAdd} size="lg" className="rounded-2xl gap-2 shadow-lg shadow-primary/25 font-bold">
            <UserPlus className="h-5 w-5" />
            <span>إضافة عضو جديد</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border/70 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground">إجمالي الأعضاء</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">حساب مفعّل بالإدارة</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground">المدراء العموم</CardTitle>
            <Shield className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-amber-500">{adminCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">سلطات كاملة للنظام</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground">الأطباء والعيادات</CardTitle>
            <Stethoscope className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-rose-500">{doctorCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">اطلاع على الملف الطبي</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground">موظفو الاستقبال</CardTitle>
            <Headphones className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-blue-500">{receptionCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">إدارة الحجوزات والمواعيد</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs (Team List vs Permissions Matrix) */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md rounded-2xl p-1 bg-muted">
          <TabsTrigger value="list" className="rounded-xl font-bold gap-2">
            <Users className="h-4 w-4" />
            <span>قائمة أعضاء الفريق ({filteredMembers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="matrix" className="rounded-xl font-bold gap-2">
            <Lock className="h-4 w-4" />
            <span>مصفوفة الصلاحيات (Permissions)</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Team Members List */}
        <TabsContent value="list" className="space-y-6 mt-6">
          {/* Filters Bar */}
          <Card className="rounded-2xl border-border/70 p-4 shadow-xs">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-80">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث بالاسم، البريد أو الهاتف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 rounded-xl"
                />
              </div>

              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <Select value={selectedRoleFilter} onValueChange={setSelectedRoleFilter}>
                  <SelectTrigger className="w-44 rounded-xl">
                    <Filter className="h-4 w-4 ml-2 text-muted-foreground" />
                    <SelectValue placeholder="تصفية الدور" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأدوار</SelectItem>
                    <SelectItem value="admin">مدير عام</SelectItem>
                    <SelectItem value="doctor">طبيب / استشاري</SelectItem>
                    <SelectItem value="receptionist">موظف استقبال</SelectItem>
                    <SelectItem value="marketer">مسؤول تسويق</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedBranchFilter} onValueChange={setSelectedBranchFilter}>
                  <SelectTrigger className="w-44 rounded-xl">
                    <Building2 className="h-4 w-4 ml-2 text-muted-foreground" />
                    <SelectValue placeholder="تصفية الفرع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفروع</SelectItem>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.title.ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Members Table */}
          <Card className="rounded-2xl border-border/70 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-border/70 bg-muted/40 text-xs font-bold text-muted-foreground uppercase">
                    <th className="p-4">العضو والمعلومات</th>
                    <th className="p-4">الدور والصلاحيات</th>
                    <th className="p-4">الفرع المخصص</th>
                    <th className="p-4">الحالة والنشاط</th>
                    <th className="p-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm">
                  <AnimatePresence>
                    {filteredMembers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                          لا يوجد أعضاء يطابقون خيارات البحث المحددة.
                        </td>
                      </tr>
                    ) : (
                      filteredMembers.map((member) => {
                        const meta = ROLE_METADATA[member.role];
                        return (
                          <motion.tr
                            key={member.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            {/* Member Name & Email */}
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-base">
                                  {member.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-foreground">{member.name}</p>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                    <span className="flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {member.email}
                                    </span>
                                    {member.phone && (
                                      <span className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {member.phone}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Role Badge */}
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.color}`}>
                                <Shield className="h-3.5 w-3.5" />
                                {meta.label}
                              </span>
                            </td>

                            {/* Branch */}
                            <td className="p-4">
                              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{getBranchLabel(member.branchId)}</span>
                              </div>
                            </td>

                            {/* Status & Last Login */}
                            <td className="p-4">
                              <div className="space-y-1">
                                <Badge variant={member.status === "active" ? "default" : "destructive"} className="text-[10px]">
                                  {member.status === "active" ? "حساب نشط" : "حساب مجمد"}
                                </Badge>
                                {member.lastLogin && (
                                  <p className="text-[11px] text-muted-foreground">آخـر دخول: {member.lastLogin}</p>
                                )}
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleOpenEdit(member)}
                                  className="h-8 w-8 text-muted-foreground hover:text-primary rounded-lg"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteMember(member.id, member.name)}
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-lg"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 2: Permissions Matrix */}
        <TabsContent value="matrix" className="mt-6">
          <Card className="rounded-2xl border-border/70 overflow-hidden shadow-xs">
            <CardHeader className="bg-muted/30 border-b border-border/70">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <span>مصفوفة صلاحيات النظام حسب الدور الوظيفي (Permissions Matrix)</span>
              </CardTitle>
              <CardDescription>
                تحدد هذه المصفوفة الحدود الأمنية الدقيقة لحسابات الموظفين والأطباء لمنع تسريب البيانات أو التعديل غير المصرح به.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-border/70 bg-muted/50 text-xs font-bold text-muted-foreground uppercase">
                      <th className="p-4">الصلاحية / الميزة</th>
                      <th className="p-4 text-center text-amber-500">مدير عام (Admin)</th>
                      <th className="p-4 text-center text-rose-500">طبيب (Doctor)</th>
                      <th className="p-4 text-center text-blue-500">استقبال (Reception)</th>
                      <th className="p-4 text-center text-purple-500">تسويق (Marketer)</th>
                      <th className="p-4 text-center text-slate-500">مشاهد (Viewer)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-sm">
                    {PERMISSIONS_MATRIX.map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-semibold text-foreground">{row.feature}</td>

                        {/* Admin */}
                        <td className="p-4 text-center">
                          {row.admin ? (
                            <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-500" />
                          ) : (
                            <XCircle className="h-5 w-5 mx-auto text-muted-foreground/40" />
                          )}
                        </td>

                        {/* Doctor */}
                        <td className="p-4 text-center">
                          {row.doctor ? (
                            <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-500" />
                          ) : (
                            <XCircle className="h-5 w-5 mx-auto text-muted-foreground/40" />
                          )}
                        </td>

                        {/* Reception */}
                        <td className="p-4 text-center">
                          {row.receptionist ? (
                            <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-500" />
                          ) : (
                            <XCircle className="h-5 w-5 mx-auto text-muted-foreground/40" />
                          )}
                        </td>

                        {/* Marketer */}
                        <td className="p-4 text-center">
                          {row.marketer ? (
                            <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-500" />
                          ) : (
                            <XCircle className="h-5 w-5 mx-auto text-muted-foreground/40" />
                          )}
                        </td>

                        {/* Viewer */}
                        <td className="p-4 text-center">
                          {row.viewer ? (
                            <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-500" />
                          ) : (
                            <XCircle className="h-5 w-5 mx-auto text-muted-foreground/40" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal: Add New Member */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg dir-rtl text-right rounded-3xl">
          <DialogHeader className="text-right border-b border-border/60 pb-4">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              <span>إضافة عضو جديد للفريق</span>
            </DialogTitle>
            <DialogDescription>
              أنشئ حساباً جديداً للموظف أو الطبيب وحدد فرع العمل والصلاحيات الإدارية.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddMember} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الاسم الكامل *</Label>
                <Input
                  required
                  placeholder="د. أحمد الشريف"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>رقم الهاتف</Label>
                <Input
                  placeholder="01012345678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-xl text-left dir-ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>البريد الإلكتروني للتسجيل *</Label>
              <Input
                required
                type="email"
                placeholder="staff@cairocosmo.online"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-xl text-left dir-ltr"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الدور الوظيفي والصلاحية *</Label>
                <Select value={formData.role} onValueChange={(val: RoleType) => setFormData({ ...formData, role: val })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">مدير عام (Full Admin)</SelectItem>
                    <SelectItem value="doctor">طبيب / استشاري (Doctor)</SelectItem>
                    <SelectItem value="receptionist">موظف استقبال (Reception)</SelectItem>
                    <SelectItem value="marketer">مسؤول تسويق (Marketing)</SelectItem>
                    <SelectItem value="viewer">مشاهد (اطلاع فقط / Read-Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>الفرع المخصص *</Label>
                <Select value={formData.branchId} onValueChange={(val) => setFormData({ ...formData, branchId: val })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفروع (Master)</SelectItem>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.title.ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>كلمة المرور المبدئية</Label>
              <Input
                type="password"
                placeholder="اتركها فارغة لإنشاء كلمة افتراضية (Cosmo@2026)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="rounded-xl dir-ltr"
              />
            </div>

            <DialogFooter className="border-t border-border/60 pt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl">
                إلغاء
              </Button>
              <Button type="submit" className="rounded-xl font-bold">
                حفظ وإضافة العضو
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Edit Member */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg dir-rtl text-right rounded-3xl">
          <DialogHeader className="text-right border-b border-border/60 pb-4">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              <span>تعديل بيانات وصلاحيات العضو</span>
            </DialogTitle>
            <DialogDescription>
              تحديث الصلاحية، الفرع المخصص، أو حالة الحساب الإدارية.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateMember} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الاسم الكامل *</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>رقم الهاتف</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-xl text-left dir-ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>البريد الإلكتروني *</Label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-xl text-left dir-ltr"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الدور الوظيفي للصلاحية *</Label>
                <Select value={formData.role} onValueChange={(val: RoleType) => setFormData({ ...formData, role: val })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">مدير عام (Full Admin)</SelectItem>
                    <SelectItem value="doctor">طبيب / استشاري (Doctor)</SelectItem>
                    <SelectItem value="receptionist">موظف استقبال (Reception)</SelectItem>
                    <SelectItem value="marketer">مسؤول تسويق (Marketing)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>الفرع المخصص *</Label>
                <Select value={formData.branchId} onValueChange={(val) => setFormData({ ...formData, branchId: val })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفروع (Master)</SelectItem>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.title.ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>حالة الحساب</Label>
              <Select value={formData.status} onValueChange={(val: "active" | "inactive") => setFormData({ ...formData, status: val })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">مفعّل (Active)</SelectItem>
                  <SelectItem value="inactive">مُجمّد (Inactive)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="border-t border-border/60 pt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-xl">
                إلغاء
              </Button>
              <Button type="submit" className="rounded-xl font-bold">
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
