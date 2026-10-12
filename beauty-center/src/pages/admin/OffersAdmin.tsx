import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { offers, type Offer, type OfferCategory } from "@/lib/offers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  Clock3,
  Eye,
  Languages,
  Pencil,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import {
  getAllAdminOffers,
  saveAllAdminOffers,
  type AdminOffer,
  type AdminOfferStatus,
} from "@/lib/admin/offers";

type OfferForm = {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: OfferCategory;
  discountLabelAr: string;
  discountLabelEn: string;
  validUntil: string;
  featured: string;
  includesAr: string;
  includesEn: string;
  status: AdminOfferStatus;
};

const emptyForm: OfferForm = {
  id: "",
  slug: "",
  titleAr: "",
  titleEn: "",
  subtitleAr: "",
  subtitleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  category: "laser",
  discountLabelAr: "",
  discountLabelEn: "",
  validUntil: "",
  featured: "false",
  includesAr: "",
  includesEn: "",
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
  return `offer-${Date.now()}`;
}

function mapFormToOffer(form: OfferForm): AdminOffer {
  const includesAr = form.includesAr
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  const includesEn = form.includesEn
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const includes =
    includesAr.length || includesEn.length
      ? Array.from({ length: Math.max(includesAr.length, includesEn.length) }, (_, index) => ({
          ar: includesAr[index] || includesEn[index] || "",
          en: includesEn[index] || includesAr[index] || "",
        }))
      : undefined;

  const offer: Offer = {
    id: form.id || generateId(),
    slug: form.slug || slugify(form.titleEn || form.titleAr || "offer"),
    title: {
      ar: form.titleAr,
      en: form.titleEn || form.titleAr,
    },
    subtitle: {
      ar: form.subtitleAr,
      en: form.subtitleEn || form.subtitleAr,
    },
    description: {
      ar: form.descriptionAr,
      en: form.descriptionEn || form.descriptionAr,
    },
    category: form.category,
    discountLabel:
      form.discountLabelAr || form.discountLabelEn
        ? {
            ar: form.discountLabelAr,
            en: form.discountLabelEn || form.discountLabelAr,
          }
        : undefined,
    validUntil: form.validUntil || undefined,
    featured: form.featured === "true",
    includes,
  };

  return {
    ...offer,
    status: form.status,
  };
}

function mapOfferToForm(offer: AdminOffer): OfferForm {
  return {
    id: offer.id,
    slug: offer.slug,
    titleAr: offer.title.ar,
    titleEn: offer.title.en,
    subtitleAr: offer.subtitle.ar,
    subtitleEn: offer.subtitle.en,
    descriptionAr: offer.description.ar,
    descriptionEn: offer.description.en,
    category: offer.category,
    discountLabelAr: offer.discountLabel?.ar || "",
    discountLabelEn: offer.discountLabel?.en || "",
    validUntil: offer.validUntil || "",
    featured: String(Boolean(offer.featured)),
    includesAr: (offer.includes || []).map((item) => item.ar).join("\n"),
    includesEn: (offer.includes || []).map((item) => item.en).join("\n"),
    status: offer.status,
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

export default function OffersAdmin() {
  const [items, setItems] = useState<AdminOffer[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [activeTab, setActiveTab] = useState<"ar" | "en" | "settings">("ar");
  const [form, setForm] = useState<OfferForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = getAllAdminOffers();
    setItems(stored.length > 0 ? stored : offers.map((o) => ({ ...o, status: "published" as const })));
  }, []);

  useEffect(() => {
    saveAllAdminOffers(items);
  }, [items]);

  const stats = useMemo(
    () => ({
      total: items.length,
      published: items.filter((item) => item.status === "published").length,
      draft: items.filter((item) => item.status === "draft").length,
    }),
    [items],
  );

  const filteredOffers = useMemo(() => {
    const q = search.toLowerCase();

    return items.filter(
      (offer) =>
        offer.slug.toLowerCase().includes(q) ||
        offer.title.ar.toLowerCase().includes(q) ||
        offer.title.en.toLowerCase().includes(q) ||
        offer.category.toLowerCase().includes(q) ||
        (offer.validUntil || "").toLowerCase().includes(q),
    );
  }, [items, search]);

  const handleChange = (key: keyof OfferForm, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if ((key === "titleAr" || key === "titleEn") && !editingId) {
        next.slug = slugify(next.titleEn || next.titleAr);
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

  const openEditForm = (offer: AdminOffer) => {
    setEditingId(offer.id);
    setForm(mapOfferToForm(offer));
    setActiveTab("ar");
    setViewMode("form");
  };

  const handleAutoTranslate = () => {
    setForm((prev) => ({
      ...prev,
      titleEn: prev.titleEn || prev.titleAr,
      subtitleEn: prev.subtitleEn || prev.subtitleAr,
      descriptionEn: prev.descriptionEn || prev.descriptionAr,
      discountLabelEn: prev.discountLabelEn || prev.discountLabelAr,
      includesEn: prev.includesEn || prev.includesAr,
      slug: prev.slug || slugify(prev.titleAr),
    }));
  };

  const applyPreset = (presetType: "discount" | "ramadan" | "hydrafacial") => {
    if (presetType === "discount") {
      setForm((prev) => ({
        ...prev,
        titleAr: "عرض خصم 25% على خدمات البشرة",
        titleEn: "25% OFF Skincare Sessions",
        subtitleAr: "نضارة فورية وترطيب عميق للبشرة",
        subtitleEn: "Instant glow and deep skin hydration",
        descriptionAr: "باقة مخصصة لتنظيف وتغذية البشرة وتوحيد لونها مع متابعة أسبوعية.",
        descriptionEn: "A dedicated skin cleansing & nourishing package with weekly follow-up.",
        category: "skin",
        discountLabelAr: "خصم 25%",
        discountLabelEn: "25% OFF",
        validUntil: "2026-03-30",
        featured: "true",
        includesAr: "تنظيف عميق للبشرة\nترطيب مخصص\nتقييم شامل مجاني",
        includesEn: "Deep skin cleansing\nCustomized hydration\nFree consultation",
        status: "published",
        slug: "skincare-25-off-offer",
      }));
    } else if (presetType === "ramadan") {
      setForm((prev) => ({
        ...prev,
        titleAr: "عرض رمضان لليزر والتجميل",
        titleEn: "Ramadan Laser & Beauty Package",
        subtitleAr: "إشراقة خاصة ومظهر أنيق قبل العيد",
        subtitleEn: "Special Ramadan radiance before Eid",
        descriptionAr: "باقة متكاملة لإزالة الشعر بالليزر وتجديد البشرة بأسعار مميزة في رمضان.",
        descriptionEn: "Complete laser hair removal and skin rejuvenation bundle for Ramadan.",
        category: "laser",
        discountLabelAr: "خصم 30%",
        discountLabelEn: "30% OFF",
        validUntil: "2026-03-31",
        featured: "true",
        includesAr: "تقييم مجاني قبل الجلسات\nجلسات ليزر عالية الدقة\nمتابعة دورية",
        includesEn: "Free pre-session assessment\nHigh precision laser sessions\nPeriodic follow-up",
        status: "published",
        slug: "ramadan-beauty-package",
      }));
    } else if (presetType === "hydrafacial") {
      setForm((prev) => ({
        ...prev,
        titleAr: "باقة الهيدرافيشل وترطيب البشرة",
        titleEn: "Hydrafacial Glow Bundle",
        subtitleAr: "تنظيف المسام وإزالة الشوائب والتغذية بالمسكات",
        subtitleEn: "Pore cleansing and serum nourishment",
        descriptionAr: "جلسة هيدرافيشل لتصفية البشرة وإزالة الرؤوس السوداء مع ماسك النضارة.",
        descriptionEn: "Hydrafacial treatment for clear skin, blackhead removal, and glow mask.",
        category: "skin",
        discountLabelAr: "خصم 20%",
        discountLabelEn: "20% OFF",
        validUntil: "2026-04-15",
        featured: "false",
        includesAr: "تنظيف المسام بالهيدرافيشل\nماسك الفيتامينات والترطيب\nإرشادات عناية منزلية",
        includesEn: "Hydrafacial pore cleansing\nVitamin & hydration mask\nHomecare guidance",
        status: "published",
        slug: "hydrafacial-glow-bundle",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = mapFormToOffer(form);

    if (editingId) {
      setItems((prev) => prev.map((item) => (item.id === editingId ? payload : item)));
    } else {
      setItems((prev) => [payload, ...prev]);
    }

    setViewMode("list");
    resetForm();
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div className="space-y-6">
      {/* List Mode View */}
      {viewMode === "list" ? (
        <div className="space-y-6">
          <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">العروض والتخفيضات</p>
              <h2 className="mt-1 text-3xl font-black text-foreground">إدارة العروض والباقات</h2>
            </div>

            <Button onClick={openNewForm} size="lg" className="rounded-2xl btn-primary-gradient border-0 font-bold shadow-md shadow-primary/20">
              <Plus className="ml-2 h-5 w-5" />
              إضافة عرض جديد
            </Button>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <StatCard title="إجمالي العروض" value={stats.total} icon={BadgePercent} />
            <StatCard title="العروض المنشورة" value={stats.published} icon={CheckCircle2} />
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
                    placeholder="ابحث بالعنوان أو التصنيف أو التاريخ..."
                    className="h-11 rounded-2xl border-border bg-background/70 pr-10"
                  />
                </div>

                <div className="text-sm text-muted-foreground">
                  عدد النتائج: <span className="font-bold text-foreground">{filteredOffers.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredOffers.length === 0 ? (
              <Card className="col-span-full rounded-[2rem] border-border/70 bg-card/70 p-12 text-center text-muted-foreground">
                <BadgePercent className="mx-auto h-12 w-12 text-primary/40 mb-3" />
                <p className="text-lg font-bold text-foreground">لا توجد عروض مطابقة</p>
                <p className="mt-1 text-sm">اضغط على زر "إضافة عرض جديد" لإضافة أول عرض لعملاء العيادة</p>
              </Card>
            ) : (
              filteredOffers.map((offer) => (
                <Card key={offer.id} className="card-elevated flex flex-col justify-between overflow-hidden rounded-[2rem] border-border/70 bg-card/90">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          offer.status === "published"
                            ? "bg-primary/15 text-primary hover:bg-primary/15"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {offer.status === "published" ? "منشور" : "مسودة"}
                      </Badge>
                      <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                        {offer.category}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="line-clamp-1 text-xl font-bold text-foreground">{offer.title.ar}</h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{offer.subtitle.ar}</p>
                    </div>

                    <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">{offer.description.ar}</p>

                    <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground border-t border-border/60 pt-3">
                      <span>الخصم: <strong className="text-foreground">{offer.discountLabel?.ar || "—"}</strong></span>
                      <span>•</span>
                      <span>ينتهي: <strong className="text-foreground">{offer.validUntil || "غير محدد"}</strong></span>
                    </div>
                  </CardContent>

                  <div className="border-t border-border/60 bg-muted/20 p-4 flex items-center justify-between gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditForm(offer)} className="rounded-xl flex-1">
                      <Pencil className="ml-1.5 h-4 w-4" />
                      تعديل
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="rounded-xl">
                      <a href="/ar/offers" target="_blank" rel="noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(offer.id)} className="rounded-xl">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Full-Page Edit / Create Form View */
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setViewMode("list")} className="rounded-xl">
                <ArrowRight className="ml-1.5 h-4 w-4" />
                العودة للقائمة
              </Button>
              <div>
                <h2 className="text-2xl font-black text-foreground">
                  {editingId ? `تعديل العرض: ${form.titleAr}` : "إضافة عرض جديد (صفحة متكاملة)"}
                </h2>
                <p className="text-xs text-muted-foreground">أدخل البيانات الأساسية والإنجليزية وسجل التغيرات بكل سهولة</p>
              </div>
            </div>

            {/* Presets Quick Fill Bar */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground hidden lg:inline">قوالب سريعة:</span>
              <Button variant="secondary" size="sm" onClick={() => applyPreset("discount")} className="rounded-xl text-xs">
                <Sparkles className="ml-1 h-3.5 w-3.5 text-primary" />
                خصم 25%
              </Button>
              <Button variant="secondary" size="sm" onClick={() => applyPreset("ramadan")} className="rounded-xl text-xs">
                <Sparkles className="ml-1 h-3.5 w-3.5 text-primary" />
                عرض رمضان
              </Button>
              <Button variant="secondary" size="sm" onClick={() => applyPreset("hydrafacial")} className="rounded-xl text-xs">
                <Sparkles className="ml-1 h-3.5 w-3.5 text-primary" />
                هيدرافيشل
              </Button>
            </div>
          </div>

          <Card className="rounded-[2rem] border-border/70 bg-card/95 shadow-xl">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Form Navigation Tabs */}
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
                        ⚙️ الإعدادات والنشر
                      </TabsTrigger>
                    </TabsList>

                    {activeTab === "en" ? (
                      <Button type="button" variant="outline" size="sm" onClick={handleAutoTranslate} className="rounded-xl text-xs">
                        <Wand2 className="ml-1.5 h-4 w-4 text-primary" />
                        نسخ وترجمة تلقائية من العربية
                      </Button>
                    ) : null}
                  </div>

                  {/* Tab 1: Arabic Content */}
                  <TabsContent value="ar" className="space-y-6 pt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <Field label="العنوان الرئيسي بالعربية" hint="مثال: عرض الفراكشنال ليزر لتجديد البشرة">
                        <Input
                          required
                          value={form.titleAr}
                          onChange={(e) => handleChange("titleAr", e.target.value)}
                          placeholder="اكتب عنوان العرض بالعربية..."
                          className="h-12 rounded-2xl border-border bg-background/80 text-base"
                        />
                      </Field>

                      <Field label="العنوان الفرعي بالعربية" hint="مثال: نضارة فورية وتقليل آثار الحبوب">
                        <Input
                          value={form.subtitleAr}
                          onChange={(e) => handleChange("subtitleAr", e.target.value)}
                          placeholder="اكتب العنوان الفرعي..."
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>
                    </div>

                    <Field label="تفاصيل ووصف العرض بالعربية">
                      <Textarea
                        required
                        value={form.descriptionAr}
                        onChange={(e) => handleChange("descriptionAr", e.target.value)}
                        rows={4}
                        placeholder="شرح تفصيلي عن الباقة وفوائد الجلسات للمراجعين..."
                        className="rounded-2xl border-border bg-background/80 text-base leading-relaxed"
                      />
                    </Field>

                    <Field label="المتضمنات والخدمات المشمولة بالعربية" hint="اكتب كل ميزة أو جلسة مشمولة في سطر مستقل">
                      <Textarea
                        value={form.includesAr}
                        onChange={(e) => handleChange("includesAr", e.target.value)}
                        rows={4}
                        placeholder={"تقييم مجاني للبشرة قبل الجلسة\nمتابعة أسبوعية مجانية\nخصم إضافي على المرة التالية"}
                        className="rounded-2xl border-border bg-background/80"
                      />
                    </Field>
                  </TabsContent>

                  {/* Tab 2: English Content */}
                  <TabsContent value="en" className="space-y-6 pt-6">
                    <div className="flex items-center justify-between rounded-2xl bg-primary/5 p-4 border border-primary/10">
                      <div className="flex items-center gap-2 text-sm text-primary font-medium">
                        <Languages className="h-5 w-5" />
                        يمكنك ترك هذه الحقول فارغة وسيتم توليدها تلقائياً من المحتوى العربي عند الحفظ!
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={handleAutoTranslate} className="rounded-xl text-xs">
                        تعبئة إنجليزية تلقائية
                      </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <Field label="Title in English">
                        <Input
                          value={form.titleEn}
                          onChange={(e) => handleChange("titleEn", e.target.value)}
                          placeholder="Offer title in English..."
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>

                      <Field label="Subtitle in English">
                        <Input
                          value={form.subtitleEn}
                          onChange={(e) => handleChange("subtitleEn", e.target.value)}
                          placeholder="Short subtitle..."
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>
                    </div>

                    <Field label="Description in English">
                      <Textarea
                        value={form.descriptionEn}
                        onChange={(e) => handleChange("descriptionEn", e.target.value)}
                        rows={4}
                        placeholder="Detailed description in English..."
                        className="rounded-2xl border-border bg-background/80"
                      />
                    </Field>

                    <Field label="Includes in English (One item per line)">
                      <Textarea
                        value={form.includesEn}
                        onChange={(e) => handleChange("includesEn", e.target.value)}
                        rows={4}
                        placeholder={"Free skin assessment\nWeekly follow-up\nSpecial discount"}
                        className="rounded-2xl border-border bg-background/80"
                      />
                    </Field>
                  </TabsContent>

                  {/* Tab 3: Settings & Publishing */}
                  <TabsContent value="settings" className="space-y-6 pt-6">
                    <div className="grid gap-6 md:grid-cols-3">
                      <Field label="تصنيف العرض">
                        <Select
                          value={form.category}
                          onValueChange={(value: OfferCategory) => handleChange("category", value)}
                        >
                          <SelectTrigger className="h-12 rounded-2xl border-border bg-background/80">
                            <SelectValue placeholder="اختر التصنيف" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="laser">ليزر إزالة الشعر</SelectItem>
                            <SelectItem value="skin">العناية بالبشرة</SelectItem>
                            <SelectItem value="injectables">الحقن والتجميل</SelectItem>
                            <SelectItem value="surgery">الجراحات التجميلية</SelectItem>
                            <SelectItem value="body">تنسيق القوام</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field label="تاريخ انتهاء الصلاحية">
                        <Input
                          type="date"
                          value={form.validUntil}
                          onChange={(e) => handleChange("validUntil", e.target.value)}
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>

                      <Field label="حالة النشر على الموقع">
                        <Select
                          value={form.status}
                          onValueChange={(value: AdminOfferStatus) => handleChange("status", value)}
                        >
                          <SelectTrigger className="h-12 rounded-2xl border-border bg-background/80">
                            <SelectValue placeholder="اختر حالة النشر" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="published">منشور ومتاح على الموقع</SelectItem>
                            <SelectItem value="draft">مسودة خفية</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                      <Field label="شارة الخصم بالعربية" hint="مثال: خصم 25%">
                        <Input
                          value={form.discountLabelAr}
                          onChange={(e) => handleChange("discountLabelAr", e.target.value)}
                          placeholder="خصم 25%"
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>

                      <Field label="Discount Label EN" hint="Example: 25% OFF">
                        <Input
                          value={form.discountLabelEn}
                          onChange={(e) => handleChange("discountLabelEn", e.target.value)}
                          placeholder="25% OFF"
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>

                      <Field label="تمييز العرض (Featured)">
                        <Select value={form.featured} onValueChange={(value) => handleChange("featured", value)}>
                          <SelectTrigger className="h-12 rounded-2xl border-border bg-background/80">
                            <SelectValue placeholder="اختر" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">نعم (يظهر في الواجهة الرئيسية)</SelectItem>
                            <SelectItem value="false">عادي (في صفحة العروض فقط)</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>

                    <div className="border-t border-border/70 pt-4">
                      <Field label="رابط المسار (Slug)" hint="يتولد تلقائياً ويمكن تخصيصه للـ SEO">
                        <Input
                          value={form.slug}
                          onChange={(e) => handleChange("slug", e.target.value)}
                          placeholder="offer-slug-example"
                          className="h-11 rounded-2xl border-border bg-background/60 font-mono text-sm"
                        />
                      </Field>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Form Footer Buttons */}
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
                      {editingId ? "حفظ التعديلات" : "حفظ ونشر العرض"}
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
