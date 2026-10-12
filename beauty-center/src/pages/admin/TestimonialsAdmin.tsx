import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Star,
  Plus,
  Pencil,
  Trash2,
  Search,
  Save,
  ArrowRight,
  Sparkles,
  Wand2,
  CheckCircle2,
  Clock3,
  MessageSquareQuote,
  User,
} from "lucide-react";
import {
  getAllAdminTestimonials,
  saveAllAdminTestimonials,
  type Testimonial,
} from "@/lib/testimonials";
import { translateArabicToEnglish } from "@/services/translateService";

type TestimonialForm = {
  id: string;
  nameAr: string;
  nameEn: string;
  serviceAr: string;
  serviceEn: string;
  textAr: string;
  textEn: string;
  rating: number;
  status: "published" | "draft";
};

const emptyForm: TestimonialForm = {
  id: "",
  nameAr: "",
  nameEn: "",
  serviceAr: "جلسات الفراكشنال ليزر وتجديد البشرة",
  serviceEn: "Fractional CO2 Laser",
  textAr: "",
  textEn: "",
  rating: 5,
  status: "published",
};

function generateId() {
  return `t-${Date.now()}`;
}

export default function TestimonialsAdmin() {
  const [list, setList] = useState<Testimonial[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    setList(getAllAdminTestimonials());
  }, []);

  useEffect(() => {
    if (list.length > 0) {
      saveAllAdminTestimonials(list);
    }
  }, [list]);

  const stats = useMemo(
    () => ({
      total: list.length,
      published: list.filter((item) => item.status !== "draft").length,
      draft: list.filter((item) => item.status === "draft").length,
    }),
    [list],
  );

  const filteredList = useMemo(() => {
    const q = search.toLowerCase();
    return list.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(q) ||
        item.service.toLowerCase().includes(q) ||
        item.text.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && item.status !== "draft") ||
        (statusFilter === "draft" && item.status === "draft");

      return matchSearch && matchStatus;
    });
  }, [list, search, statusFilter]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const openNewForm = () => {
    resetForm();
    setViewMode("form");
  };

  const openEditForm = (item: Testimonial) => {
    setEditingId(item.id);
    setForm({
      id: item.id,
      nameAr: item.name,
      nameEn: item.name,
      serviceAr: item.service,
      serviceEn: item.service,
      textAr: item.text,
      textEn: item.text,
      rating: item.rating || 5,
      status: item.status || "published",
    });
    setViewMode("form");
  };

  const handleAutoTranslate = async () => {
    setIsTranslating(true);
    try {
      const [nameEn, serviceEn, textEn] = await Promise.all([
        translateArabicToEnglish(form.nameAr),
        translateArabicToEnglish(form.serviceAr),
        translateArabicToEnglish(form.textAr),
      ]);

      setForm((prev) => ({
        ...prev,
        nameEn: nameEn || prev.nameAr,
        serviceEn: serviceEn || prev.serviceAr,
        textEn: textEn || prev.textAr,
      }));
    } catch {
      setForm((prev) => ({
        ...prev,
        nameEn: prev.nameEn || prev.nameAr,
        serviceEn: prev.serviceEn || prev.serviceAr,
        textEn: prev.textEn || prev.textAr,
      }));
    } finally {
      setIsTranslating(false);
    }
  };

  const applyPreset = (type: "laser" | "botox" | "hydra") => {
    if (type === "laser") {
      setForm((prev) => ({
        ...prev,
        nameAr: "ياسمين محمود",
        nameEn: "Yasmine M.",
        serviceAr: "إزالة الشعر بالليزر",
        serviceEn: "Laser Hair Removal",
        textAr: "تجربة ممتازة ونظافة عالية وأهم حاجة المتابعة بدون أي ألم بعد الجلسة.",
        textEn: "Excellent experience, highly clean place, and painless sessions.",
        rating: 5,
        status: "published",
      }));
    } else if (type === "botox") {
      setForm((prev) => ({
        ...prev,
        nameAr: "رانيا عبدالكريم",
        nameEn: "Rania A.",
        serviceAr: "حقن البوتوكس والتجاعيد",
        serviceEn: "Botox Wrinkle Smoothing",
        textAr: "النتيجة هادية وطبيعية جدًا، دكتور باسم شرحلي كل حاجة قبل الإجراء.",
        textEn: "Very subtle and natural result. Dr. Bassem explained everything clearly.",
        rating: 5,
        status: "published",
      }));
    } else if (type === "hydra") {
      setForm((prev) => ({
        ...prev,
        nameAr: "نور سليم",
        nameEn: "Nour S.",
        serviceAr: "تنظيف البشرة بالهيدرافيشل",
        serviceEn: "Hydrafacial Cleansing",
        textAr: "بشرتي رجعت نضرة ومشدودة من أول جلسة، شكراً لفريق كايرو كوزمو.",
        textEn: "My skin felt refreshed and hydrated from the very first session.",
        rating: 5,
        status: "published",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Testimonial = {
      id: form.id || generateId(),
      name: form.nameAr,
      service: form.serviceAr,
      rating: Number(form.rating) || 5,
      text: form.textAr,
      status: form.status,
    };

    if (editingId) {
      setList((prev) => prev.map((item) => (item.id === editingId ? payload : item)));
    } else {
      setList((prev) => [payload, ...prev]);
    }

    setViewMode("list");
    resetForm();
  };

  const handleDelete = (id: string) => {
    setList((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div className="space-y-6">
      {viewMode === "list" ? (
        /* List Mode View */
        <div className="space-y-6">
          <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">آراء وتجارب المرضى والمراجعين</p>
              <h2 className="mt-1 text-3xl font-black text-foreground">إدارة آراء العملاء بالموقع</h2>
            </div>

            <Button
              onClick={openNewForm}
              size="lg"
              className="rounded-2xl btn-primary-gradient border-0 font-bold shadow-md shadow-primary/20"
            >
              <Plus className="ml-2 h-5 w-5" />
              إضافة رأي مراجع جديد
            </Button>
          </section>

          {/* Stats Bar */}
          <section className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-[1.6rem] border-border/70 bg-card/90">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الآراء</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{stats.total}</p>
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <MessageSquareQuote className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[1.6rem] border-border/70 bg-card/90">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">الآراء المنشورة بالموقع</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{stats.published}</p>
                </div>
                <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[1.6rem] border-border/70 bg-card/90">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">المسودات الخفية</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{stats.draft}</p>
                </div>
                <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-600">
                  <Clock3 className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Search & Filter Bar */}
          <Card className="glass-panel rounded-[2rem] border-border/70 bg-card/90">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-md">
                  <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ابحث باسم المراجع أو الخدمة أو النص..."
                    className="h-11 rounded-2xl border-border bg-background/70 pr-10"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                    className="rounded-xl text-xs"
                  >
                    الكل ({list.length})
                  </Button>
                  <Button
                    variant={statusFilter === "published" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("published")}
                    className="rounded-xl text-xs"
                  >
                    منشور ({stats.published})
                  </Button>
                  <Button
                    variant={statusFilter === "draft" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("draft")}
                    className="rounded-xl text-xs"
                  >
                    مسودة ({stats.draft})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonials Cards Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredList.length === 0 ? (
              <Card className="col-span-full rounded-[2rem] border-border/70 bg-card/70 p-12 text-center text-muted-foreground">
                <MessageSquareQuote className="mx-auto h-12 w-12 text-primary/40 mb-3" />
                <p className="text-lg font-bold text-foreground">لا توجد آراء مطابقة للبحث</p>
                <p className="mt-1 text-sm">اضغط على زر "إضافة رأي مراجع جديد" لإضافة تقييم جديد للموقع</p>
              </Card>
            ) : (
              filteredList.map((item) => (
                <Card key={item.id} className="card-elevated flex flex-col justify-between overflow-hidden rounded-[2rem] border-border/70 bg-card/90 p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn("h-4 w-4", i < item.rating ? "fill-amber-500" : "text-muted")} />
                        ))}
                      </div>

                      <Badge className={cn("rounded-full px-3 py-0.5 text-xs font-semibold", item.status !== "draft" ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground")}>
                        {item.status !== "draft" ? "منشور" : "مسودة"}
                      </Badge>
                    </div>

                    <p className="text-sm font-medium text-foreground leading-relaxed line-clamp-3">“{item.text}”</p>
                  </div>

                  <div className="border-t border-border/60 pt-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-primary" />
                        {item.name}
                      </h4>
                      <p className="text-xs text-primary font-semibold">{item.service}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditForm(item)} className="rounded-xl">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} className="rounded-xl">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Full-Page Edit Form View */
        <Card className="rounded-[2.5rem] border-border/70 bg-card/95 shadow-2xl">
          <CardContent className="p-6 md:p-10 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => setViewMode("list")} className="rounded-xl">
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                  العودة للقائمة
                </Button>
                <h2 className="text-xl font-black text-foreground">
                  {editingId ? `تعديل رأي المراجع: ${form.nameAr}` : "إضافة رأي مراجع جديد"}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAutoTranslate}
                  disabled={isTranslating}
                  className="rounded-xl border-primary/30 text-primary font-bold text-xs"
                >
                  <Wand2 className={cn("ml-1.5 h-4 w-4", isTranslating && "animate-spin")} />
                  {isTranslating ? "جاري الترجمة..." : "🤖 ترجمة تلقائية للإنجليزية"}
                </Button>

                <Button onClick={handleSubmit} className="rounded-xl btn-primary-gradient border-0 font-bold px-6">
                  <Save className="ml-1.5 h-4 w-4" />
                  حفظ ونشر التقييم
                </Button>
              </div>
            </div>

            {/* Quick Presets Bar */}
            <div className="flex items-center gap-2 bg-muted/40 p-3 rounded-2xl border border-border/60">
              <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                نماذج تقييمات سريعة:
              </span>
              <Button type="button" variant="secondary" size="sm" onClick={() => applyPreset("laser")} className="rounded-xl text-xs">
                تقييم ليزر
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={() => applyPreset("botox")} className="rounded-xl text-xs">
                تقييم بوتوكس
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={() => applyPreset("hydra")} className="rounded-xl text-xs">
                تقييم هيدرافيشل
              </Button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-bold text-sm text-foreground">اسم المراجع بالعربية *</Label>
                  <Input
                    required
                    value={form.nameAr}
                    onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                    placeholder="سارة محمد..."
                    className="h-12 rounded-2xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-sm text-foreground">الخدمة المعنية بالعربية *</Label>
                  <Input
                    required
                    value={form.serviceAr}
                    onChange={(e) => setForm({ ...form, serviceAr: e.target.value })}
                    placeholder="ليزر إزالة الشعر..."
                    className="h-12 rounded-2xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-sm text-foreground">نص تقييم وتجربة المراجع بالعربية *</Label>
                <Textarea
                  required
                  value={form.textAr}
                  onChange={(e) => setForm({ ...form, textAr: e.target.value })}
                  rows={4}
                  placeholder="التجربة كانت ممتازة جداً والمتابعة بعد الجلسة كانت احترافية..."
                  className="rounded-2xl text-sm"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2 border-t border-border/60 pt-6">
                <div className="space-y-2">
                  <Label className="font-bold text-sm text-foreground">عدد النجوم التقييم (من 1 إلى 5)</Label>
                  <Select value={String(form.rating)} onValueChange={(val) => setForm({ ...form, rating: Number(val) })}>
                    <SelectTrigger className="h-12 rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">⭐⭐⭐⭐⭐ (5 من 5 - ممتاز جداً)</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐ (4 من 5 - ممتاز)</SelectItem>
                      <SelectItem value="3">⭐⭐⭐ (3 من 5 - جيد جداً)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-sm text-foreground">حالة النشر بالموقع</Label>
                  <Select value={form.status} onValueChange={(val: "published" | "draft") => setForm({ ...form, status: val })}>
                    <SelectTrigger className="h-12 rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">منشور معروض بالموقع 🟢</SelectItem>
                      <SelectItem value="draft">مسودة خفية 🟡</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setViewMode("list")} className="rounded-2xl">
                  إلغاء
                </Button>
                <Button type="submit" className="rounded-2xl btn-primary-gradient border-0 font-bold px-8 h-12 text-base">
                  حفظ ونشر التقييم بالموقع
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
