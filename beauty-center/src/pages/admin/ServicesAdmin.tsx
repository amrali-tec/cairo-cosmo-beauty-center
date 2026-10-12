import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import type { ServiceBase, ServiceCategory } from "@/lib/data/types";
import { mergedServicesBase } from "@/lib/data/services";
import { serviceCategoryLabels } from "@/lib/data/types";
import { getTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Search,
  Pencil,
  Trash2,
  Eye,
  Save,
  CheckCircle2,
  Clock3,
  BriefcaseMedical,
  Plus,
  ArrowRight,
  Sparkles,
  Wand2,
  Languages,
} from "lucide-react";
import {
  getAllAdminServices,
  saveAllAdminServices,
  type AdminService,
  type AdminServiceStatus,
} from "@/lib/admin/services";

type ServiceForm = {
  id: string;
  slug: string;
  category: ServiceCategory;

  titleAr: string;
  titleEn: string;

  shortDescriptionAr: string;
  shortDescriptionEn: string;

  descriptionAr: string;
  descriptionEn: string;

  highlightsAr: string;
  highlightsEn: string;

  idealForAr: string;
  idealForEn: string;

  stepsAr: string;
  stepsEn: string;

  aftercareAr: string;
  aftercareEn: string;

  durationAr: string;
  durationEn: string;

  recoveryAr: string;
  recoveryEn: string;

  resultsAr: string;
  resultsEn: string;

  seoTitleAr: string;
  seoTitleEn: string;

  seoDescriptionAr: string;
  seoDescriptionEn: string;

  seoKeywordsAr: string;
  seoKeywordsEn: string;

  image: string;
  doctorIds: string;
  featured: boolean;
  status: AdminServiceStatus;
};

const emptyForm: ServiceForm = {
  id: "",
  slug: "",
  category: "skin",

  titleAr: "",
  titleEn: "",

  shortDescriptionAr: "",
  shortDescriptionEn: "",

  descriptionAr: "",
  descriptionEn: "",

  highlightsAr: "",
  highlightsEn: "",

  idealForAr: "",
  idealForEn: "",

  stepsAr: "",
  stepsEn: "",

  aftercareAr: "",
  aftercareEn: "",

  durationAr: "30 - 45 دقيقة",
  durationEn: "30 - 45 Mins",

  recoveryAr: "بدون فترة نقاهة",
  recoveryEn: "No downtime",

  resultsAr: "نتائج سريعة ومستمرة",
  resultsEn: "Fast & lasting results",

  seoTitleAr: "",
  seoTitleEn: "",

  seoDescriptionAr: "",
  seoDescriptionEn: "",

  seoKeywordsAr: "",
  seoKeywordsEn: "",

  image: "/assets/services/service-dermatology.jpg",
  doctorIds: "dr-ahmed-alshrif, dr-nahed-samir",
  featured: true,
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
  return `service-${Date.now()}`;
}

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinLines(value?: string[]) {
  return (value || []).join("\n");
}

function getSeedServices(): AdminService[] {
  return mergedServicesBase.map((service) => ({
    ...service,
    doctorIds: service.doctorIds || [],
    status: "published" as const,
  }));
}

function mapFormToService(form: ServiceForm): AdminService {
  const payload: ServiceBase = {
    id: form.id || generateId(),
    slug: form.slug || slugify(form.titleEn || form.titleAr || "service"),
    category: form.category,

    title: {
      ar: form.titleAr,
      en: form.titleEn || form.titleAr,
    },

    shortDescription: {
      ar: form.shortDescriptionAr,
      en: form.shortDescriptionEn || form.shortDescriptionAr,
    },

    description: {
      ar: form.descriptionAr,
      en: form.descriptionEn || form.descriptionAr,
    },

    highlights:
      form.highlightsAr || form.highlightsEn
        ? {
            ar: splitLines(form.highlightsAr),
            en: splitLines(form.highlightsEn || form.highlightsAr),
          }
        : undefined,

    idealFor:
      form.idealForAr || form.idealForEn
        ? {
            ar: splitLines(form.idealForAr),
            en: splitLines(form.idealForEn || form.idealForAr),
          }
        : undefined,

    steps:
      form.stepsAr || form.stepsEn
        ? {
            ar: splitLines(form.stepsAr),
            en: splitLines(form.stepsEn || form.stepsAr),
          }
        : undefined,

    aftercare:
      form.aftercareAr || form.aftercareEn
        ? {
            ar: splitLines(form.aftercareAr),
            en: splitLines(form.aftercareEn || form.aftercareAr),
          }
        : undefined,

    duration: {
      ar: form.durationAr,
      en: form.durationEn || form.durationAr,
    },

    recovery: {
      ar: form.recoveryAr,
      en: form.recoveryEn || form.recoveryAr,
    },

    results: {
      ar: form.resultsAr,
      en: form.resultsEn || form.resultsAr,
    },

    seo: {
      title: {
        ar: form.seoTitleAr || form.titleAr,
        en: form.seoTitleEn || form.titleEn || form.titleAr,
      },
      description: {
        ar: form.seoDescriptionAr || form.shortDescriptionAr,
        en: form.seoDescriptionEn || form.shortDescriptionEn || form.shortDescriptionAr,
      },
      keywords:
        form.seoKeywordsAr || form.seoKeywordsEn
          ? {
              ar: splitLines(form.seoKeywordsAr),
              en: splitLines(form.seoKeywordsEn || form.seoKeywordsAr),
            }
          : undefined,
    },

    image: form.image || "/assets/services/service-dermatology.jpg",
    faqs: [],
    beforeAfter: [],
    doctorIds: form.doctorIds
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    featured: form.featured,
  };

  return {
    ...payload,
    status: form.status,
  };
}

function mapServiceToForm(service: AdminService): ServiceForm {
  return {
    id: service.id,
    slug: service.slug,
    category: service.category,
    titleAr: service.title.ar,
    titleEn: service.title.en,
    shortDescriptionAr: service.shortDescription.ar,
    shortDescriptionEn: service.shortDescription.en,
    descriptionAr: service.description.ar,
    descriptionEn: service.description.en,
    highlightsAr: joinLines(service.highlights?.ar),
    highlightsEn: joinLines(service.highlights?.en),
    idealForAr: joinLines(service.idealFor?.ar),
    idealForEn: joinLines(service.idealFor?.en),
    stepsAr: joinLines(service.steps?.ar),
    stepsEn: joinLines(service.steps?.en),
    aftercareAr: joinLines(service.aftercare?.ar),
    aftercareEn: joinLines(service.aftercare?.en),
    durationAr: service.duration?.ar || "",
    durationEn: service.duration?.en || "",
    recoveryAr: service.recovery?.ar || "",
    recoveryEn: service.recovery?.en || "",
    resultsAr: service.results?.ar || "",
    resultsEn: service.results?.en || "",
    seoTitleAr: service.seo?.title.ar || "",
    seoTitleEn: service.seo?.title.en || "",
    seoDescriptionAr: service.seo?.description.ar || "",
    seoDescriptionEn: service.seo?.description.en || "",
    seoKeywordsAr: joinLines(service.seo?.keywords?.ar),
    seoKeywordsEn: joinLines(service.seo?.keywords?.en),
    image: service.image || "",
    doctorIds: (service.doctorIds || []).join(", "),
    featured: Boolean(service.featured),
    status: service.status,
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

export default function ServicesAdmin() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [activeTab, setActiveTab] = useState<"ar" | "en" | "settings">("ar");
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = getAllAdminServices();
    if (stored.length > 0) {
      setServices(stored);
    } else {
      setServices(getSeedServices());
    }
  }, []);

  useEffect(() => {
    saveAllAdminServices(services);
  }, [services]);

  const stats = useMemo(
    () => ({
      total: services.length,
      published: services.filter((s) => s.status === "published").length,
      draft: services.filter((s) => s.status === "draft").length,
    }),
    [services],
  );

  const filteredServices = useMemo(() => {
    const q = search.toLowerCase();
    return services.filter(
      (service) =>
        service.slug.toLowerCase().includes(q) ||
        service.title.ar.toLowerCase().includes(q) ||
        service.title.en.toLowerCase().includes(q) ||
        service.category.toLowerCase().includes(q),
    );
  }, [services, search]);

  const handleChange = (key: keyof ServiceForm, value: string | boolean) => {
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

  const openEditForm = (service: AdminService) => {
    setEditingId(service.id);
    setForm(mapServiceToForm(service));
    setActiveTab("ar");
    setViewMode("form");
  };

  const handleAutoTranslate = () => {
    setForm((prev) => ({
      ...prev,
      titleEn: prev.titleEn || prev.titleAr,
      shortDescriptionEn: prev.shortDescriptionEn || prev.shortDescriptionAr,
      descriptionEn: prev.descriptionEn || prev.descriptionAr,
      highlightsEn: prev.highlightsEn || prev.highlightsAr,
      idealForEn: prev.idealForEn || prev.idealForAr,
      stepsEn: prev.stepsEn || prev.stepsAr,
      aftercareEn: prev.aftercareEn || prev.aftercareAr,
      durationEn: prev.durationEn || prev.durationAr,
      recoveryEn: prev.recoveryEn || prev.recoveryAr,
      resultsEn: prev.resultsEn || prev.resultsAr,
      seoTitleEn: prev.seoTitleEn || prev.seoTitleAr || prev.titleAr,
      seoDescriptionEn: prev.seoDescriptionEn || prev.seoDescriptionAr || prev.shortDescriptionAr,
      seoKeywordsEn: prev.seoKeywordsEn || prev.seoKeywordsAr,
      slug: prev.slug || slugify(prev.titleAr),
    }));
  };

  const applyPreset = (presetType: "botox" | "laser" | "fractional") => {
    if (presetType === "botox") {
      setForm((prev) => ({
        ...prev,
        titleAr: "حقن البوتوكس للتجاعيد والتعبير",
        titleEn: "Botox Wrinkle Treatment",
        category: "injectables",
        shortDescriptionAr: "جلسة سريعة لإخفاء تجاعيد الجبهة وحول العين للحصول على مظهر شاب وطبيعي.",
        shortDescriptionEn: "Quick session to smooth forehead & eye wrinkles for a youthful look.",
        descriptionAr: "تعتمد الجلسة على مادة البوتوكس عالية الجودة لعلاج انقباضات العضلات المسببة للتجاعيد التعبيرية بدون أي ألم.",
        descriptionEn: "High quality Botox injectables targeting facial muscles for smooth natural skin.",
        highlightsAr: "نتيجة تظهر خلال 3 إلى 7 أيام\nبدون فترة نقاهة وتستمر حتى 6 أشهر\nإجراء آمن بمعايير طبية عالمية",
        highlightsEn: "Results appear in 3-7 days\nNo downtime, lasts up to 6 months\nSafe medical standards",
        idealForAr: "خطوط الجبهة والتجاعيد التعبيرية\nتجاعيد حول العين (Crow's Feet)\nشد التجاعيد الخفيفة",
        idealForEn: "Forehead wrinkles\nCrow's feet around eyes\nSubtle facial smoothing",
        durationAr: "20 - 30 دقيقة",
        durationEn: "20 - 30 Mins",
        recoveryAr: "بدون فترة نقاهة",
        recoveryEn: "No downtime",
        resultsAr: "تظهر خلال 3-5 أيام وتدوم 6 أشهر",
        resultsEn: "Appears in 3-5 days, lasts 6 months",
        image: "/assets/services/service-dermatology.jpg",
        status: "published",
        slug: "botox-wrinkle-treatment",
      }));
    } else if (presetType === "laser") {
      setForm((prev) => ({
        ...prev,
        titleAr: "إزالة الشعر بالليزر (كانديلا / دايود)",
        titleEn: "Laser Hair Removal",
        category: "laser",
        shortDescriptionAr: "جلسات إزالة الشعر بالليزر بأحدث الأجهزة المزودة بنظام التبريد الفوري.",
        shortDescriptionEn: "Laser hair removal sessions using state of the art cooling technology.",
        descriptionAr: "تحديد واختيار نوع جهاز الليزر المناسب لنوع ولون البشرة مع توفير أعلى مستويات الأمان والراحة بدون ألم.",
        descriptionEn: "Tailored laser sessions matching skin tone with advanced cooling for painless experience.",
        highlightsAr: "تبريد ديناميكي لراحة كاملة\nتناسب جميع أنواع البشرة\nنتائج دائمة ودقيقة",
        highlightsEn: "Dynamic cooling technology\nSuitable for all skin types\nLong-lasting results",
        idealForAr: "إزالة شعر الوجه والجسم كاملاً\nالبشرة الحساسة\nالحد من نمو الشعر غير المرغوب فيه",
        idealForEn: "Full body & facial hair removal\nSensitive skin\nPermanent hair reduction",
        durationAr: "30 - 60 دقيقة",
        durationEn: "30 - 60 Mins",
        recoveryAr: "ساعات قليلة",
        recoveryEn: "Few hours",
        resultsAr: "انخفاض دائم للشعر بعد 4-6 جلسات",
        resultsEn: "Permanent reduction after 4-6 sessions",
        image: "/assets/services/service-dermatology.jpg",
        status: "published",
        slug: "laser-hair-removal-service",
      }));
    } else if (presetType === "fractional") {
      setForm((prev) => ({
        ...prev,
        titleAr: "الفراكشنال ليزر لتجديد البشرة وتصفيتها",
        titleEn: "Fractional CO2 Laser Resurfacing",
        category: "skin",
        shortDescriptionAr: "علاج ندبات الحبوب، التصبغات، وتحفيز الكولاجين لإعادة نضارة البشرة.",
        shortDescriptionEn: "Acne scar treatment, pigmentation removal & collagen stimulation.",
        descriptionAr: "تقنية الفراكشنال ليزر تعمل على تحفيز الأنسجة العميقة وتجديد خلايا السطح لتنعيم البشرة وتصفيتها.",
        descriptionEn: "Fractional laser technology stimulating deep tissues and renewing skin surface for smooth texture.",
        highlightsAr: "تحفيز الكولاجين الطبيعي\nإزالة ندبات الحبوب والتصبغات\nتوحيد ملمس البشرة",
        highlightsEn: "Natural collagen boost\nAcne scar & spot removal\nEven skin texture",
        idealForAr: "آثار ندبات الحبوب القديمة\nالتصبغات والمسام الواسعة\nتجديد نضارة الوجه والرقبة",
        idealForEn: "Acne scars\nPigmentation & enlarged pores\nFace & neck rejuvenation",
        durationAr: "45 - 60 دقيقة",
        durationEn: "45 - 60 Mins",
        recoveryAr: "3 - 5 أيام",
        recoveryEn: "3 - 5 Days",
        resultsAr: "تحسن ملحوظ بعد أول جلسة",
        resultsEn: "Noticeable improvement after 1st session",
        image: "/assets/services/service-dermatology.jpg",
        status: "published",
        slug: "fractional-co2-laser-service",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = mapFormToService(form);

    if (editingId) {
      setServices((prev) => prev.map((item) => (item.id === editingId ? payload : item)));
    } else {
      setServices((prev) => [payload, ...prev]);
    }

    setViewMode("list");
    resetForm();
  };

  const handleDelete = (id: string) => {
    setServices((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div className="space-y-6">
      {viewMode === "list" ? (
        <div className="space-y-6">
          <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">قائمة الخدمات التجميلية</p>
              <h2 className="mt-1 text-3xl font-black text-foreground">إدارة الخدمات الطبية والتجميلية</h2>
            </div>

            <Button onClick={openNewForm} size="lg" className="rounded-2xl btn-primary-gradient border-0 font-bold shadow-md shadow-primary/20">
              <Plus className="ml-2 h-5 w-5" />
              إضافة خدمة جديدة
            </Button>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <StatCard title="إجمالي الخدمات" value={stats.total} icon={BriefcaseMedical} />
            <StatCard title="الخدمات المنشورة" value={stats.published} icon={CheckCircle2} />
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
                    placeholder="ابحث بالاسم أو التصنيف..."
                    className="h-11 rounded-2xl border-border bg-background/70 pr-10"
                  />
                </div>

                <div className="text-sm text-muted-foreground">
                  عدد الخدمات: <span className="font-bold text-foreground">{filteredServices.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.length === 0 ? (
              <Card className="col-span-full rounded-[2rem] border-border/70 bg-card/70 p-12 text-center text-muted-foreground">
                <BriefcaseMedical className="mx-auto h-12 w-12 text-primary/40 mb-3" />
                <p className="text-lg font-bold text-foreground">لا توجد خدمات مطابقة</p>
                <p className="mt-1 text-sm">اضغط على زر "إضافة خدمة جديدة" لإدخال خدمة تجميل جديدة للعملاء</p>
              </Card>
            ) : (
              filteredServices.map((service) => (
                <Card key={service.id} className="card-elevated flex flex-col justify-between overflow-hidden rounded-[2rem] border-border/70 bg-card/90">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge className={cn("rounded-full px-3 py-1 text-xs font-semibold", service.status === "published" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground")}>
                        {service.status === "published" ? "منشور" : "مسودة"}
                      </Badge>
                      <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                        {service.category}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="line-clamp-1 text-xl font-bold text-foreground">{service.title.ar}</h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{service.shortDescription.ar}</p>
                    </div>

                    <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">{service.description.ar}</p>

                    <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground border-t border-border/60 pt-3">
                      <span>المدة: <strong className="text-foreground">{service.duration?.ar || "—"}</strong></span>
                      <span>•</span>
                      <span>التعافي: <strong className="text-foreground">{service.recovery?.ar || "—"}</strong></span>
                    </div>
                  </CardContent>

                  <div className="border-t border-border/60 bg-muted/20 p-4 flex items-center justify-between gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditForm(service)} className="rounded-xl flex-1">
                      <Pencil className="ml-1.5 h-4 w-4" />
                      تعديل
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="rounded-xl">
                      <a href={`/ar/services/${service.slug}`} target="_blank" rel="noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)} className="rounded-xl">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Full-Page Edit / Create Service Form */
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setViewMode("list")} className="rounded-xl">
                <ArrowRight className="ml-1.5 h-4 w-4" />
                العودة للقائمة
              </Button>
              <div>
                <h2 className="text-2xl font-black text-foreground">
                  {editingId ? `تعديل خدمة: ${form.titleAr}` : "إضافة خدمة جديدة (صفحة متكاملة)"}
                </h2>
                <p className="text-xs text-muted-foreground">أدخل تفاصيل الخدمة والمميزات والشرح والـ SEO بكل سهولة</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground hidden lg:inline">قوالب سريعة:</span>
              <Button variant="secondary" size="sm" onClick={() => applyPreset("botox")} className="rounded-xl text-xs">
                <Sparkles className="ml-1 h-3.5 w-3.5 text-primary" />
                حقن البوتوكس
              </Button>
              <Button variant="secondary" size="sm" onClick={() => applyPreset("laser")} className="rounded-xl text-xs">
                <Sparkles className="ml-1 h-3.5 w-3.5 text-primary" />
                إزالة ليزر
              </Button>
              <Button variant="secondary" size="sm" onClick={() => applyPreset("fractional")} className="rounded-xl text-xs">
                <Sparkles className="ml-1 h-3.5 w-3.5 text-primary" />
                فراكشنال ليزر
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
                        ⚙️ التفاصيل والـ SEO والأطباء
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
                      <Field label="عنوان الخدمة بالعربية" hint="مثال: جلسات الفراكشنال ليزر">
                        <Input
                          required
                          value={form.titleAr}
                          onChange={(e) => handleChange("titleAr", e.target.value)}
                          placeholder="عنوان الخدمة..."
                          className="h-12 rounded-2xl border-border bg-background/80 text-base"
                        />
                      </Field>

                      <Field label="الوصف القصير بالعربية" hint="يظهر في البطاقات">
                        <Input
                          required
                          value={form.shortDescriptionAr}
                          onChange={(e) => handleChange("shortDescriptionAr", e.target.value)}
                          placeholder="وصف مختصر من سطرين..."
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>
                    </div>

                    <Field label="الوصف التفصيلي الشامل بالعربية">
                      <Textarea
                        required
                        value={form.descriptionAr}
                        onChange={(e) => handleChange("descriptionAr", e.target.value)}
                        rows={4}
                        placeholder="شرح كامل عن كيفية عمل الجلسة والفوائد والأجهزة المستخدمة..."
                        className="rounded-2xl border-border bg-background/80 text-base leading-relaxed"
                      />
                    </Field>

                    <div className="grid gap-6 md:grid-cols-2">
                      <Field label="أبرز مميزات الخدمة AR (كل ميزة في سطر)">
                        <Textarea
                          value={form.highlightsAr}
                          onChange={(e) => handleChange("highlightsAr", e.target.value)}
                          rows={4}
                          placeholder={"نتائج سريعة من أول جلسة\nبدون ألم وبدون فترة نقاهة\nتناسب جميع أنواع البشرة"}
                          className="rounded-2xl border-border bg-background/80"
                        />
                      </Field>

                      <Field label="مناسبة لمَنْ؟ AR (كل فئة في سطر)">
                        <Textarea
                          value={form.idealForAr}
                          onChange={(e) => handleChange("idealForAr", e.target.value)}
                          rows={4}
                          placeholder={"علاج آثـار الحبوب والندبات\nتوحيد لون البشرة والتصبغات\nالتجاعيد الخفيفة والخطوط"}
                          className="rounded-2xl border-border bg-background/80"
                        />
                      </Field>
                    </div>
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
                      <Field label="Service Title in English">
                        <Input
                          value={form.titleEn}
                          onChange={(e) => handleChange("titleEn", e.target.value)}
                          placeholder="Service name in English..."
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>

                      <Field label="Short Description in English">
                        <Input
                          value={form.shortDescriptionEn}
                          onChange={(e) => handleChange("shortDescriptionEn", e.target.value)}
                          placeholder="Short card summary in English..."
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>
                    </div>

                    <Field label="Full Description in English">
                      <Textarea
                        value={form.descriptionEn}
                        onChange={(e) => handleChange("descriptionEn", e.target.value)}
                        rows={4}
                        placeholder="Comprehensive service description in English..."
                        className="rounded-2xl border-border bg-background/80"
                      />
                    </Field>

                    <div className="grid gap-6 md:grid-cols-2">
                      <Field label="Highlights EN (Line per item)">
                        <Textarea
                          value={form.highlightsEn}
                          onChange={(e) => handleChange("highlightsEn", e.target.value)}
                          rows={4}
                          placeholder={"Fast results after first session\nPainless with no downtime"}
                          className="rounded-2xl border-border bg-background/80"
                        />
                      </Field>

                      <Field label="Ideal For EN (Line per item)">
                        <Textarea
                          value={form.idealForEn}
                          onChange={(e) => handleChange("idealForEn", e.target.value)}
                          rows={4}
                          placeholder={"Acne scar treatment\nSkin tone evening"}
                          className="rounded-2xl border-border bg-background/80"
                        />
                      </Field>
                    </div>
                  </TabsContent>

                  {/* Tab 3: Settings, SEO & Doctors */}
                  <TabsContent value="settings" className="space-y-6 pt-6">
                    <div className="grid gap-6 md:grid-cols-3">
                      <Field label="التصنيف">
                        <select
                          value={form.category}
                          onChange={(e) => handleChange("category", e.target.value)}
                          className="h-12 w-full rounded-2xl border border-border bg-background px-3 font-semibold"
                        >
                          {Object.keys(serviceCategoryLabels).map((key) => (
                            <option key={key} value={key}>
                              {getTranslation(serviceCategoryLabels[key as ServiceCategory], "ar")}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="مدة الجلسة">
                        <Input
                          value={form.durationAr}
                          onChange={(e) => handleChange("durationAr", e.target.value)}
                          placeholder="مثال: 30 - 45 دقيقة"
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>

                      <Field label="حالة النشر">
                        <select
                          value={form.status}
                          onChange={(e) => handleChange("status", e.target.value as AdminServiceStatus)}
                          className="h-12 w-full rounded-2xl border border-border bg-background px-3 font-semibold"
                        >
                          <option value="published">منشور ومتاح على الموقع</option>
                          <option value="draft">مسودة خفية</option>
                        </select>
                      </Field>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                      <Field label="فترة النقاهة والتعافي">
                        <Input
                          value={form.recoveryAr}
                          onChange={(e) => handleChange("recoveryAr", e.target.value)}
                          placeholder="مثال: بدون فترة نقاهة"
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>

                      <Field label="نوع ومدة ظهور النتائج">
                        <Input
                          value={form.resultsAr}
                          onChange={(e) => handleChange("resultsAr", e.target.value)}
                          placeholder="مثال: نتائج سريعة تدوم 6 أشهر"
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>

                      <Field label="رابط صورة الخدمة">
                        <Input
                          value={form.image}
                          onChange={(e) => handleChange("image", e.target.value)}
                          placeholder="/assets/services/service-dermatology.jpg"
                          className="h-12 rounded-2xl border-border bg-background/80"
                        />
                      </Field>
                    </div>

                    <Field label="معرفات الأطباء المعالجين (مفصولة بفواصل)" hint="مثال: dr-ahmed-alshrif, dr-nahed-samir">
                      <Input
                        value={form.doctorIds}
                        onChange={(e) => handleChange("doctorIds", e.target.value)}
                        placeholder="dr-ahmed-alshrif, dr-nahed-samir"
                        className="h-12 rounded-2xl border-border bg-background/80"
                      />
                    </Field>

                    <div className="space-y-4 border-t border-border/70 pt-4">
                      <h4 className="text-sm font-bold text-foreground">إعدادات محركات البحث (SEO Optional)</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input value={form.seoTitleAr} onChange={(e) => handleChange("seoTitleAr", e.target.value)} placeholder="عنوان الـ SEO بالعربية..." className="h-11 rounded-2xl border-border bg-background/70" />
                        <Input value={form.seoDescriptionAr} onChange={(e) => handleChange("seoDescriptionAr", e.target.value)} placeholder="وصف الـ SEO بالعربية..." className="h-11 rounded-2xl border-border bg-background/70" />
                      </div>
                    </div>

                    <div className="border-t border-border/70 pt-4">
                      <Field label="رابط المسار (Slug)" hint="يتولد تلقائياً من اسم الخدمة">
                        <Input
                          value={form.slug}
                          onChange={(e) => handleChange("slug", e.target.value)}
                          placeholder="service-slug"
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
                      {editingId ? "حفظ التعديلات" : "حفظ ونشر الخدمة"}
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
