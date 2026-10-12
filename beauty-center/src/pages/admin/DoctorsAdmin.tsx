// src/pages/admin/DoctorsAdmin.tsx
import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import type { DoctorBase } from "@/lib/data/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Search,
  Pencil,
  Trash2,
  Eye,
  Save,
  Users,
  CheckCircle2,
  Clock3,
  Image as ImageIcon,
  CalendarDays,
  Link2,
  Stethoscope,
  Plus,
  ArrowRight,
  Sparkles,
  Wand2,
  Languages,
} from "lucide-react";
import {
  getAllAdminDoctors,
  saveAllAdminDoctors,
  type AdminDoctor,
  type AdminDoctorStatus,
} from "@/lib/admin/doctors";
import { mergedDoctorsBase } from "@/lib/data/doctors";

type DoctorForm = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  specialtyAr: string;
  specialtyEn: string;
  bioAr: string;
  bioEn: string;
  experienceAr: string;
  experienceEn: string;
  image: string;
  workingDaysAr: string;
  workingDaysEn: string;
  branchId: string;
  serviceIds: string;
  facebook: string;
  youtube: string;
  instagram: string;
  tiktok: string;
  website: string;
  status: AdminDoctorStatus;
};

const emptyForm: DoctorForm = {
  id: "",
  slug: "",
  nameAr: "",
  nameEn: "",
  specialtyAr: "",
  specialtyEn: "",
  bioAr: "",
  bioEn: "",
  experienceAr: "",
  experienceEn: "",
  image: "",
  workingDaysAr: "",
  workingDaysEn: "",
  branchId: "sheraton",
  serviceIds: "botox, laser-hair-removal",
  facebook: "",
  youtube: "",
  instagram: "",
  tiktok: "",
  website: "",
  status: "published",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\u064B-\u065F]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function generateId() {
  return `doctor-${Date.now()}`;
}

function mapFormToDoctor(form: DoctorForm): AdminDoctor {
  const doctor: DoctorBase = {
    id: form.id || generateId(),
    slug: form.slug || slugify(form.nameEn || form.nameAr || "doctor"),
    name: {
      ar: form.nameAr,
      en: form.nameEn || form.nameAr,
    },
    specialty: {
      ar: form.specialtyAr,
      en: form.specialtyEn || form.specialtyAr,
    },
    bio: {
      ar: form.bioAr,
      en: form.bioEn || form.bioAr,
    },
    experience: {
      ar: form.experienceAr,
      en: form.experienceEn || form.experienceAr,
    },
    image: form.image || "/assets/services/ahmed-alshrif.jpg",
    workingDays: {
      ar: form.workingDaysAr || "السبت - الأربعاء",
      en: form.workingDaysEn || "Sat - Wed",
    },
    branchId: form.branchId || undefined,
    serviceIds: form.serviceIds
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    socialLinks: {
      facebook: form.facebook || undefined,
      youtube: form.youtube || undefined,
      instagram: form.instagram || undefined,
      tiktok: form.tiktok || undefined,
      website: form.website || undefined,
    },
  };

  return {
    ...doctor,
    status: form.status,
  };
}

function mapDoctorToForm(doctor: AdminDoctor): DoctorForm {
  return {
    id: doctor.id,
    slug: doctor.slug,
    nameAr: doctor.name.ar,
    nameEn: doctor.name.en,
    specialtyAr: doctor.specialty.ar,
    specialtyEn: doctor.specialty.en,
    bioAr: doctor.bio.ar,
    bioEn: doctor.bio.en,
    experienceAr: doctor.experience.ar,
    experienceEn: doctor.experience.en,
    image: doctor.image,
    workingDaysAr: doctor.workingDays.ar,
    workingDaysEn: doctor.workingDays.en,
    branchId: doctor.branchId || "",
    serviceIds: (doctor.serviceIds || []).join(", "),
    facebook: doctor.socialLinks?.facebook || "",
    youtube: doctor.socialLinks?.youtube || "",
    instagram: doctor.socialLinks?.instagram || "",
    tiktok: doctor.socialLinks?.tiktok || "",
    website: doctor.socialLinks?.website || "",
    status: doctor.status,
  };
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="font-semibold text-foreground">{label}</Label>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="card-elevated rounded-[1.6rem] border-border/70 bg-card/90">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DoctorsAdmin() {
  const [doctors, setDoctors] = useState<AdminDoctor[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [activeTab, setActiveTab] = useState<"ar" | "en" | "settings">("ar");
  const [form, setForm] = useState<DoctorForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = getAllAdminDoctors();
    if (stored.length > 0) {
      setDoctors(stored);
    } else {
      setDoctors(mergedDoctorsBase.map((d) => ({ ...d, serviceIds: d.serviceIds || [], status: "published" as const })));
    }
  }, []);

  useEffect(() => {
    saveAllAdminDoctors(doctors);
  }, [doctors]);

  const stats = useMemo(
    () => ({
      total: doctors.length,
      published: doctors.filter((d) => d.status === "published").length,
      draft: doctors.filter((d) => d.status === "draft").length,
    }),
    [doctors],
  );

  const filteredDoctors = useMemo(() => {
    const q = search.toLowerCase();
    return doctors.filter(
      (doctor) =>
        doctor.slug.toLowerCase().includes(q) ||
        doctor.name.ar.toLowerCase().includes(q) ||
        doctor.name.en.toLowerCase().includes(q) ||
        doctor.specialty.ar.toLowerCase().includes(q) ||
        doctor.specialty.en.toLowerCase().includes(q) ||
        (doctor.branchId || "").toLowerCase().includes(q),
    );
  }, [doctors, search]);

  const handleChange = (key: keyof DoctorForm, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if ((key === "nameAr" || key === "nameEn") && !editingId) {
        next.slug = slugify(next.nameEn || next.nameAr);
      }
      return next;
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setActiveTab("ar");
  };

  const openNewForm = () => {
    resetForm();
    setViewMode("form");
  };

  const openEditForm = (doctor: AdminDoctor) => {
    setEditingId(doctor.id);
    setForm(mapDoctorToForm(doctor));
    setActiveTab("ar");
    setViewMode("form");
  };

  const handleAutoTranslate = () => {
    setForm((prev) => ({
      ...prev,
      nameEn: prev.nameEn || prev.nameAr,
      specialtyEn: prev.specialtyEn || prev.specialtyAr,
      bioEn: prev.bioEn || prev.bioAr,
      experienceEn: prev.experienceEn || prev.experienceAr,
      workingDaysEn: prev.workingDaysEn || prev.workingDaysAr,
      slug: prev.slug || slugify(prev.nameAr),
    }));
  };

  const applyPreset = (role: "surgeon" | "dermo" | "contour") => {
    if (role === "surgeon") {
      setForm((prev) => ({
        ...prev,
        nameAr: "د. أحمد الشريف",
        nameEn: "Dr. Ahmed El-Sherif",
        specialtyAr: "استشاري جراحة التجميل والترميم",
        specialtyEn: "Consultant Plastic & Reconstructive Surgery",
        bioAr: "استشاري جراحات التجميل وتنسيق القوام ونحت الجسم، عضو الجمعية المصرية لطب التجميل والجراحة.",
        bioEn: "Consultant plastic surgeon specializing in body contouring and cosmetic surgery.",
        experienceAr: "+18 سنة خبرة",
        experienceEn: "18+ Years Experience",
        image: "/assets/services/ahmed-alshrif.jpg",
        workingDaysAr: "السبت والإثنين والأربعاء (من 4 إلى 9 مساءً)",
        workingDaysEn: "Sat, Mon, Wed (4 PM - 9 PM)",
        branchId: "sheraton",
        serviceIds: "breast-augmentation, lipo, contouring",
        status: "published",
        slug: "dr-ahmed-alshrif",
      }));
    } else if (role === "dermo") {
      setForm((prev) => ({
        ...prev,
        nameAr: "د. ناهد سمير",
        nameEn: "Dr. Nahed Samir",
        specialtyAr: "استشاري الجلدية والتجميل والحقن",
        specialtyEn: "Consultant Dermatology & Aesthetic Injectables",
        bioAr: "متخصصة في علاجات البشرة المتقدمة وحقن البوتوكس والفيلر وتجديد خلايا الوجه بالليزر.",
        bioEn: "Specialist in advanced skincare, botox & filler injectables, and laser treatments.",
        experienceAr: "+15 سنة خبرة",
        experienceEn: "15+ Years Experience",
        image: "/assets/services/nahid-samir.png",
        workingDaysAr: "الأحد والثلاثاء والخميس (من 2 إلى 8 مساءً)",
        workingDaysEn: "Sun, Tue, Thu (2 PM - 8 PM)",
        branchId: "dokki",
        serviceIds: "botox, fillers, hydrafacial",
        status: "published",
        slug: "dr-nahed-samir",
      }));
    } else if (role === "contour") {
      setForm((prev) => ({
        ...prev,
        nameAr: "د. باسم زكي",
        nameEn: "Dr. Bassem Zaki",
        specialtyAr: "استشاري طب التجميل وتنسيق القوام",
        specialtyEn: "Consultant Aesthetic Medicine & Body Sculpting",
        bioAr: "خبير أجهزة تنسيق القوام وتذويب الدهون والنحت غير الجراحي بدون فترة نقاهة.",
        bioEn: "Expert in non-surgical body contouring, fat dissolving, and body sculpting.",
        experienceAr: "+12 سنة خبرة",
        experienceEn: "12+ Years Experience",
        image: "/assets/services/bassim-zaki.png",
        workingDaysAr: "السبت والأحد والأربعاء (من 3 إلى 9 مساءً)",
        workingDaysEn: "Sat, Sun, Wed (3 PM - 9 PM)",
        branchId: "october",
        serviceIds: "body-contouring, fractional-laser",
        status: "published",
        slug: "dr-bassem-zaki",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = mapFormToDoctor(form);

    if (editingId) {
      setDoctors((prev) => prev.map((doctor) => (doctor.id === editingId ? payload : doctor)));
    } else {
      setDoctors((prev) => [payload, ...prev]);
    }

    setViewMode("list");
    resetForm();
  };

  const handleDelete = (id: string) => {
    setDoctors((prev) => prev.filter((doctor) => doctor.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div className="space-y-6">
      {viewMode === "list" ? (
        <div className="space-y-6">
          <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">الفريق الطبي</p>
              <h2 className="mt-1 text-3xl font-black text-foreground">إدارة الأطباء والاستشاريين</h2>
            </div>

            <Button onClick={openNewForm} size="lg" className="rounded-2xl btn-primary-gradient border-0 font-bold shadow-md shadow-primary/20">
              <Plus className="ml-2 h-5 w-5" />
              إضافة طبيب جديد
            </Button>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <StatCard title="إجمالي الأطباء" value={stats.total} icon={Users} />
            <StatCard title="الأطباء المنشورون" value={stats.published} icon={CheckCircle2} />
            <StatCard title="المسودات" value={stats.draft} icon={Clock3} />
          </section>

          <Card className="glass-panel rounded-[2rem] border-border/70 bg-card/90">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-md">
                  <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ابحث باسم الطبيب أو التخصص أو الفرع..."
                    className="h-11 rounded-2xl border-border bg-background/70 pr-10"
                  />
                </div>

                <div className="text-sm text-muted-foreground">
                  عدد الأطباء: <span className="font-bold text-foreground">{filteredDoctors.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.length === 0 ? (
              <Card className="col-span-full rounded-[2rem] border-border/70 bg-card/70 p-12 text-center text-muted-foreground">
                <Users className="mx-auto h-12 w-12 text-primary/40 mb-3" />
                <p className="text-lg font-bold text-foreground">لا يوجد أطباء بعد</p>
                <p className="mt-1 text-sm">اضغط على زر "إضافة طبيب جديد" لإدخال استشاري جديد للفريق</p>
              </Card>
            ) : (
              filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="card-elevated flex flex-col justify-between overflow-hidden rounded-[2rem] border-border/70 bg-card/90">
                  <div className="relative h-48 bg-muted overflow-hidden">
                    {doctor.image ? (
                      <img src={doctor.image} alt={doctor.name.ar} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">لا توجد صورة</div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className={cn("rounded-full px-3 py-1 text-xs font-semibold", doctor.status === "published" ? "bg-primary/90 text-primary-foreground" : "bg-muted text-muted-foreground")}>
                        {doctor.status === "published" ? "منشور" : "مسودة"}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-5 space-y-3">
                    <div>
                      <h3 className="line-clamp-1 text-xl font-bold text-foreground">{doctor.name.ar}</h3>
                      <p className="text-xs text-primary font-semibold mt-1">{doctor.specialty.ar}</p>
                    </div>

                    <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">{doctor.bio.ar}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-3">
                      <span>الخبرة: <strong className="text-foreground">{doctor.experience.ar}</strong></span>
                      <span>الفرع: <strong className="text-foreground">{doctor.branchId || "الكل"}</strong></span>
                    </div>
                  </CardContent>

                  <div className="border-t border-border/60 bg-muted/20 p-3 flex items-center justify-between gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditForm(doctor)} className="rounded-xl flex-1">
                      <Pencil className="ml-1.5 h-4 w-4" />
                      تعديل
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="rounded-xl">
                      <a href={`/ar/doctors/${doctor.slug}`} target="_blank" rel="noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(doctor.id)} className="rounded-xl">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Full-Page Edit / Create Doctor Form */
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setViewMode("list")} className="rounded-xl">
                <ArrowRight className="ml-1.5 h-4 w-4" />
                العودة للقائمة
              </Button>
              <div>
                <h2 className="text-2xl font-black text-foreground">
                  {editingId ? `تعديل بيانات: ${form.nameAr}` : "إضافة طبيب جديد (صفحة متكاملة)"}
                </h2>
                <p className="text-xs text-muted-foreground">أدخل التخصص والمواعيد والروابط وسيرة الطبيب كاملة</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground hidden lg:inline">قوالب جاهزة:</span>
              <Button variant="secondary" size="sm" onClick={() => applyPreset("surgeon")} className="rounded-xl text-xs">
                <Sparkles className="ml-1 h-3.5 w-3.5 text-primary" />
                جراحة تجميل
              </Button>
              <Button variant="secondary" size="sm" onClick={() => applyPreset("dermo")} className="rounded-xl text-xs">
                <Sparkles className="ml-1 h-3.5 w-3.5 text-primary" />
                جلدية وحقن
              </Button>
              <Button variant="secondary" size="sm" onClick={() => applyPreset("contour")} className="rounded-xl text-xs">
                <Sparkles className="ml-1 h-3.5 w-3.5 text-primary" />
                تنسيق قوام
              </Button>
            </div>
          </div>

          <Card className="rounded-[2rem] border-border/70 bg-card/95 shadow-xl">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "ar" | "en" | "settings")}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-4 gap-4">
                    <TabsList className="grid grid-cols-3 w-full sm:w-auto rounded-2xl p-1 bg-muted">
                      <TabsTrigger value="ar" className="rounded-xl text-xs sm:text-sm font-bold">
                        🇪🇬 البيانات بالعربية
                      </TabsTrigger>
                      <TabsTrigger value="en" className="rounded-xl text-xs sm:text-sm font-bold">
                        🇬🇧 English Content
                      </TabsTrigger>
                      <TabsTrigger value="settings" className="rounded-xl text-xs sm:text-sm font-bold">
                        ⚙️ التخصص والروابط والنشر
                      </TabsTrigger>
                    </TabsList>

                    {activeTab === "en" ? (
                      <Button type="button" variant="outline" size="sm" onClick={handleAutoTranslate} className="rounded-xl text-xs">
                        <Wand2 className="ml-1.5 h-4 w-4 text-primary" />
                        نسخ وترجمة تلقائية من العربية
                      </Button>
                    ) : null}
                  </div>

                  {/* Tab 1: Arabic */}
                  <TabsContent value="ar" className="space-y-6 pt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <Field label="اسم الطبيب بالعربية" hint="مثال: د. أحمد الشريف">
                        <Input
                          required
                          value={form.nameAr}
                          onChange={(e) => handleChange("nameAr", e.target.value)}
                          placeholder="اسم الطبيب مع اللقب..."
                          className="h-12 rounded-2xl border-border bg-background/80 text-base"
                        />
                      </Field>

                      <Field label="التخصص بالعربية" hint="مثال: استشاري جراحة التجميل والترميم">
                        <Input
                          required
                          value={form.specialtyAr}
                          onChange={(e) => handleChange("specialtyAr", e.target.value)}
                          placeholder="المسمى الوظيفي والتخصص..."
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <Field label="الخبرة بالعربية" hint="مثال: +18 سنة خبرة في جراحات التجميل">
                        <Input
                          value={form.workingDaysAr}
                          onChange={(e) => handleChange("workingDaysAr", e.target.value)}
                          placeholder="مواعيد العمل (مثال: السبت والإثنين والخميس)"
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>

                      <Field label="سنوات الخبرة">
                        <Input
                          value={form.experienceAr}
                          onChange={(e) => handleChange("experienceAr", e.target.value)}
                          placeholder="+15 سنة خبرة"
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>
                    </div>

                    <Field label="نبذة وسيرة الطبيب بالعربية">
                      <Textarea
                        required
                        value={form.bioAr}
                        onChange={(e) => handleChange("bioAr", e.target.value)}
                        rows={4}
                        placeholder="ملخص الخبرات العملية والشهادات وعضويات الجمعيات الطبية..."
                        className="rounded-2xl border-border bg-background/80 text-base leading-relaxed"
                      />
                    </Field>
                  </TabsContent>

                  {/* Tab 2: English */}
                  <TabsContent value="en" className="space-y-6 pt-6">
                    <div className="flex items-center justify-between rounded-2xl bg-primary/5 p-4 border border-primary/10">
                      <div className="flex items-center gap-2 text-sm text-primary font-medium">
                        <Languages className="h-5 w-5" />
                        يمكنك الاستعانة بالترجمة التلقائية بضغطة زر واحدة لتعبئة الإنجليزية
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={handleAutoTranslate} className="rounded-xl text-xs">
                        تعبئة إنجليزية تلقائية
                      </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <Field label="Doctor Name in English">
                        <Input
                          value={form.nameEn}
                          onChange={(e) => handleChange("nameEn", e.target.value)}
                          placeholder="Dr. Ahmed El-Sherif"
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>

                      <Field label="Specialty in English">
                        <Input
                          value={form.specialtyEn}
                          onChange={(e) => handleChange("specialtyEn", e.target.value)}
                          placeholder="Consultant Plastic Surgeon"
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <Field label="Working Days in English">
                        <Input
                          value={form.workingDaysEn}
                          onChange={(e) => handleChange("workingDaysEn", e.target.value)}
                          placeholder="Sat, Mon, Wed (4 PM - 9 PM)"
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>

                      <Field label="Experience in English">
                        <Input
                          value={form.experienceEn}
                          onChange={(e) => handleChange("experienceEn", e.target.value)}
                          placeholder="15+ Years Experience"
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>
                    </div>

                    <Field label="Doctor Bio in English">
                      <Textarea
                        value={form.bioEn}
                        onChange={(e) => handleChange("bioEn", e.target.value)}
                        rows={4}
                        placeholder="Professional summary in English..."
                        className="rounded-2xl border-border bg-background/80"
                      />
                    </Field>
                  </TabsContent>

                  {/* Tab 3: Settings & Links */}
                  <TabsContent value="settings" className="space-y-6 pt-6">
                    <div className="grid gap-6 md:grid-cols-3">
                      <Field label="الفرع">
                        <Select
                          value={form.branchId}
                          onValueChange={(val) => handleChange("branchId", val)}
                        >
                          <SelectTrigger className="h-12 rounded-2xl border-border bg-background/80">
                            <SelectValue placeholder="اختر الفرع الرئيسي" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sheraton">فرع مصر الجديدة (شيراتون)</SelectItem>
                            <SelectItem value="dokki">فرع الدقي</SelectItem>
                            <SelectItem value="october">فرع 6 أكتوبر</SelectItem>
                            <SelectItem value="mansoura">فرع المنصورة</SelectItem>
                            <SelectItem value="shubra">فرع شبرا</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field label="رابط صورة الطبيب">
                        <Input
                          value={form.image}
                          onChange={(e) => handleChange("image", e.target.value)}
                          placeholder="/assets/services/ahmed-alshrif.jpg"
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>

                      <Field label="حالة النشر">
                        <Select
                          value={form.status}
                          onValueChange={(val: AdminDoctorStatus) => handleChange("status", val)}
                        >
                          <SelectTrigger className="h-12 rounded-2xl border-border bg-background/80">
                            <SelectValue placeholder="اختر الحالة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="published">منشور ومتاح على الموقع</SelectItem>
                            <SelectItem value="draft">مسودة خفية</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>

                    <Field label="معرفات الخدمات المرتبطة (مفصولة بفواصل)" hint="مثال: botox, laser-hair-removal, fillers">
                      <Input
                        value={form.serviceIds}
                        onChange={(e) => handleChange("serviceIds", e.target.value)}
                        placeholder="botox, fillers, hydrafacial"
                        className="h-12 rounded-2xl border-border bg-background/80"
                      />
                    </Field>

                    <div className="space-y-3 border-t border-border/70 pt-4">
                      <h4 className="text-sm font-bold text-foreground">روابط التواصل وسوشيال ميديا الطبيب (اختياري)</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input value={form.facebook} onChange={(e) => handleChange("facebook", e.target.value)} placeholder="رابط الفيسبوك..." className="h-11 rounded-2xl border-border bg-background/70" />
                        <Input value={form.instagram} onChange={(e) => handleChange("instagram", e.target.value)} placeholder="رابط الانستجرام..." className="h-11 rounded-2xl border-border bg-background/70" />
                        <Input value={form.youtube} onChange={(e) => handleChange("youtube", e.target.value)} placeholder="رابط قناة اليوتيوب..." className="h-11 rounded-2xl border-border bg-background/70" />
                        <Input value={form.tiktok} onChange={(e) => handleChange("tiktok", e.target.value)} placeholder="رابط تيك توك..." className="h-11 rounded-2xl border-border bg-background/70" />
                      </div>
                    </div>

                    <div className="border-t border-border/70 pt-4">
                      <Field label="رابط المسار (Slug)" hint="يتولد تلقائياً من الاسم">
                        <Input
                          value={form.slug}
                          onChange={(e) => handleChange("slug", e.target.value)}
                          placeholder="doctor-slug"
                          className="h-11 rounded-2xl border-border bg-background/60 font-mono text-sm"
                        />
                      </Field>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-6">
                  <Button type="button" variant="ghost" onClick={() => setViewMode("list")} className="rounded-2xl">
                    إلغاء والعودة
                  </Button>

                  <div className="flex items-center gap-3">
                    <Button type="button" variant="outline" onClick={resetForm} className="rounded-2xl">
                      تفريغ الحقول
                    </Button>

                    <Button type="submit" size="lg" className="rounded-2xl btn-primary-gradient border-0 font-bold px-8 shadow-lg shadow-primary/20">
                      <Save className="ml-2 h-5 w-5" />
                      {editingId ? "حفظ التعديلات" : "حفظ ونشر بيانات الطبيب"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
