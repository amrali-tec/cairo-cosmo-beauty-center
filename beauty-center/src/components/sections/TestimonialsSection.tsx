// ===============================================
// src/components/sections/TestimonialsSection.tsx
// منظومة آراء وتجارب مراجعي كايرو كوزمو سنتر الفاخرة
// ===============================================

import { useMemo, useState, useEffect } from "react";
import {
  Quote,
  Star,
  Filter,
  CheckCircle2,
  Sparkles,
  MapPin,
  Stethoscope,
  Plus,
  Heart,
  ShieldCheck,
  Calendar,
  User,
  Send,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/locale-context";
import {
  Testimonial,
  getPublishedTestimonials,
  addPublicReview,
} from "@/lib/testimonials";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const { locale, isRTL } = useLocale();
  const { toast } = useToast();
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewList, setReviewList] = useState<Testimonial[]>(() =>
    getPublishedTestimonials(locale),
  );

  // New Review Form State
  const [formName, setFormName] = useState("");
  const [formService, setFormService] = useState("جلسات ليزر كانديلا جينتل ماكس برو");
  const [formDoctor, setFormDoctor] = useState("د. ناهد سمير");
  const [formBranch, setFormBranch] = useState("فرع مصر الجديدة (شيراتون)");
  const [formRating, setFormRating] = useState<number>(5);
  const [formCategory, setFormCategory] = useState<"laser" | "injections" | "skincare" | "body">("laser");
  const [formText, setFormText] = useState("");

  // Sync on updates
  useEffect(() => {
    const handleUpdate = () => {
      setReviewList(getPublishedTestimonials(locale));
    };
    window.addEventListener("cosmo:testimonials_updated", handleUpdate);
    return () => window.removeEventListener("cosmo:testimonials_updated", handleUpdate);
  }, [locale]);

  const filteredList = useMemo(() => {
    if (filterCategory === "all") return reviewList;
    return reviewList.filter((item) => item.serviceCategory === filterCategory);
  }, [reviewList, filterCategory]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formText.trim()) {
      toast({
        title: locale === "ar" ? "بيانات ناقصة" : "Missing fields",
        description: locale === "ar" ? "يرجى كتابة اسمكِ ورأيكِ في الجلسة" : "Please enter your name and review.",
        variant: "destructive",
      });
      return;
    }

    addPublicReview({
      name: formName.trim(),
      service: formService,
      doctor: formDoctor,
      branch: formBranch,
      rating: formRating,
      serviceCategory: formCategory,
      text: formText.trim(),
    });

    setIsModalOpen(false);
    setFormName("");
    setFormText("");

    toast({
      title: locale === "ar" ? "تم نشر تقييمكِ بنجاح 🌟" : "Review published successfully!",
      description: locale === "ar" ? "شكراً لمشاركتكِ تجربتكِ مع عائلة كايرو كوزمو سنتر." : "Thank you for sharing your experience with Cairo Cosmo.",
    });
  };

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-background via-card/50 to-background py-20 md:py-28"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.12),transparent_50%)]" />

      <div className="section-container relative">
        {/* Header & Stats Banner */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{locale === "ar" ? "تجارب حقيقية موثقة 100%" : "100% Verified Real Reviews"}</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
              {locale === "ar" ? "آراء مراجعينا وتجاربهم" : "What Our Clients Say"}
            </h2>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {locale === "ar"
                ? "تجارب واقعية لمراجعينا بعد جلسات الليزر، الحقن التجميلي، والعناية بالبشرة مع نخبة أطباء واستشاريي كايرو كوزمو سنتر."
                : "Authentic experiences and natural transformations from our valued clients across laser, aesthetics, and royal skincare."}
            </p>
          </div>

          {/* Overall Rating & Add Review CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-3xl border border-primary/25 bg-card/90 backdrop-blur-md p-4 shadow-sm flex items-center gap-4">
              <div className="text-center border-l rtl:border-l-0 rtl:border-r border-border/70 pr-4 rtl:pr-0 rtl:pl-4">
                <div className="text-3xl font-black text-foreground flex items-center justify-center gap-1">
                  <span>4.9</span>
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400 inline" />
                </div>
                <div className="text-[11px] text-muted-foreground font-semibold">
                  {locale === "ar" ? "من 5 نجوم" : "Out of 5"}
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-bold text-foreground flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{locale === "ar" ? "1,400+ تجربة مؤكدة" : "1,400+ Verified"}</span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {locale === "ar" ? "99% نسبة الرضا والتوصية" : "99% Recommendation Rate"}
                </div>
              </div>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="rounded-2xl btn-primary-gradient text-white text-xs font-black gap-2 h-14 px-6 shadow-lg shadow-primary/25 hover:scale-105 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>{locale === "ar" ? "شاركينا تجربتكِ ✨" : "Share Your Review"}</span>
            </Button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mb-10 flex flex-wrap items-center gap-2.5 pb-2 border-b border-border/50">
          <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 ml-2">
            <Filter className="h-3.5 w-3.5 text-primary" />
            <span>{locale === "ar" ? "تصفية التجارب:" : "Filter by:"}</span>
          </span>

          {[
            { id: "all", ar: "🌟 جميع التجارب", en: "All Reviews" },
            { id: "laser", ar: "⚡ ليزر كانديلا وديكا", en: "Laser Hair Removal" },
            { id: "injections", ar: "💉 الفيلر والبوتوكس", en: "Botox & Fillers" },
            { id: "skincare", ar: "💆‍♀️ الهيدرافيشل والفراكشنال", en: "Skin & Hydrafacial" },
            { id: "body", ar: "🏃‍♀️ نحت القوام CoolSculpting", en: "Body Contouring" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-bold transition-all border",
                filterCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105"
                  : "bg-card border-border/70 text-foreground hover:border-primary/50 hover:bg-muted/30",
              )}
            >
              {locale === "ar" ? cat.ar : cat.en}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredList.map((review) => (
            <Card
              key={review.id}
              className="rounded-[2.5rem] border border-border/70 bg-gradient-to-br from-card via-card/90 to-primary/5 p-6 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Card Top: Stars & Quote Icon */}
                <div className="flex items-center justify-between">
                  <Stars rating={review.rating} />
                  <div className="h-9 w-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Quote className="h-4 w-4" />
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs md:text-sm text-foreground/90 leading-relaxed font-sans font-medium">
                  "{review.text}"
                </p>

                {/* Service Tag */}
                <div className="pt-2">
                  <Badge variant="outline" className="text-[10px] font-bold border-primary/25 bg-primary/5 text-primary py-0.5 px-2.5 rounded-lg">
                    {review.service}
                  </Badge>
                </div>
              </div>

              {/* Card Footer: Patient Info, Doctor & Branch */}
              <div className="pt-5 mt-4 border-t border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-black text-sm text-foreground flex items-center gap-1.5">
                    <span>{review.name}</span>
                    {review.verified && (
                      <span title={locale === "ar" ? "تجربة موثقة" : "Verified Patient"}>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 inline" />
                      </span>
                    )}
                  </div>
                  {review.date && (
                    <span className="text-[10px] text-muted-foreground">{review.date}</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                  {review.doctor && (
                    <span className="flex items-center gap-1">
                      <Stethoscope className="h-3 w-3 text-primary" />
                      <span>{review.doctor}</span>
                    </span>
                  )}
                  {review.branch && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary" />
                      <span className="truncate max-w-[120px]">{review.branch}</span>
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Review Submission Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg rounded-[2.5rem] p-6 md:p-8" dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader className="border-b border-border/60 pb-3">
            <DialogTitle className="text-xl font-black text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>{locale === "ar" ? "شاركينا تجربتكِ في كايرو كوزمو سنتر" : "Share Your Experience"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              {locale === "ar"
                ? "تقييمكِ الصادق يساعدنا في تطوير خدماتنا وتقديم أفضل تجربة علاجية لكافة مراجعينا."
                : "Your genuine feedback helps us continuously elevate our clinical beauty care."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{locale === "ar" ? "الاسم الكامل *" : "Your Name *"}</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder={locale === "ar" ? "مثال: مروة عبد العزيز" : "e.g. Marwa A."}
                className="rounded-xl text-xs bg-background"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{locale === "ar" ? "التخصص *" : "Category"}</Label>
                <Select value={formCategory} onValueChange={(v: any) => setFormCategory(v)}>
                  <SelectTrigger className="rounded-xl text-xs bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="laser">⚡ ليزر إزالة الشعر</SelectItem>
                    <SelectItem value="injections">💉 الفيلر والبوتوكس</SelectItem>
                    <SelectItem value="skincare">💆‍♀️ العناية بالبشرة والهيدرافيشل</SelectItem>
                    <SelectItem value="body">🏃‍♀️ نحت القوام</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{locale === "ar" ? "التقييم (النجوم)" : "Rating"}</Label>
                <Select value={String(formRating)} onValueChange={(v) => setFormRating(Number(v))}>
                  <SelectTrigger className="rounded-xl text-xs bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="5">⭐⭐⭐⭐⭐ 5 نجوم (ممتاز جداً)</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ 4 نجوم (جيد جداً)</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ 3 نجوم (جيد)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{locale === "ar" ? "الطبيب المعالج" : "Doctor"}</Label>
                <Select value={formDoctor} onValueChange={setFormDoctor}>
                  <SelectTrigger className="rounded-xl text-xs bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="د. ناهد سمير">د. ناهد سمير (جلدية وتجميل)</SelectItem>
                    <SelectItem value="د. باسم زكي">د. باسم زكي (طب تجميلي)</SelectItem>
                    <SelectItem value="د. أحمد الشريف">د. أحمد الشريف (نحت قوام)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{locale === "ar" ? "الفرع" : "Branch"}</Label>
                <Select value={formBranch} onValueChange={setFormBranch}>
                  <SelectTrigger className="rounded-xl text-xs bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="فرع مصر الجديدة (شيراتون)">مصر الجديدة (شيراتون)</SelectItem>
                    <SelectItem value="فرع الدقي">فرع الدقي</SelectItem>
                    <SelectItem value="فرع 6 أكتوبر">فرع 6 أكتوبر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{locale === "ar" ? "الخدمة أو الإجراء المجري" : "Treatment Name"}</Label>
              <Input
                value={formService}
                onChange={(e) => setFormService(e.target.value)}
                placeholder="مثال: جلسة ليزر كانديلا برو كاملة"
                className="rounded-xl text-xs bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{locale === "ar" ? "رأيكِ وتجربتكِ بعد الجلسة *" : "Your Review *"}</Label>
              <Textarea
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                placeholder={locale === "ar" ? "اكتبي تجربتكِ وانطباعكِ عن النتيجة والمتابعة..." : "Write your experience and impressions..."}
                rows={3}
                className="rounded-xl text-xs bg-background"
                required
              />
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl text-xs"
              >
                {locale === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" className="rounded-xl text-xs font-bold btn-primary-gradient">
                {locale === "ar" ? "نشر التقييم 🚀" : "Submit Review"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
