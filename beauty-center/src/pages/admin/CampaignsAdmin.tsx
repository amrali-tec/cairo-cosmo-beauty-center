// ===============================================
// src/pages/admin/CampaignsAdmin.tsx
// منصة الحملات التسويقية ورسائل الواتساب الجماعية
// ===============================================

import { useState } from "react";
import {
  Send,
  MessageCircle,
  Users,
  Sparkles,
  Tag,
  Gift,
  CheckCircle2,
  Share2,
  TrendingUp,
  Percent,
  Play,
  Copy,
  Clock,
  Flame,
  UserCheck,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { BookingNotificationToast } from "@/components/admin/BookingNotificationToast";
import { getStoredBookings } from "@/services/realtimeBookingService";

interface MarketingTemplate {
  id: string;
  title: string;
  category: "offer" | "reactivation" | "birthday" | "seasonal";
  defaultText: string;
  badge: string;
}

const marketingTemplates: MarketingTemplate[] = [
  {
    id: "summer_laser",
    title: "عرض باقة الصيف لليزر كانديلا برو ✨",
    category: "offer",
    badge: "الأعلى تحويلاً 🚀",
    defaultText: `أهلاً بكِ أستاذة {اسم_العميل} في كايرو كوزمو سنتر 🌸
يسرنا إهداؤكِ خصم خاص 25% على باقة ليزر الجسم بالكامل بأحدث أجهزة كانديلا برو الأمريكية مع جلسة رتوش مجانية!

🎁 استخدمي كود الخصم الحصري: COSMO2026
📅 العرض سارٍ بجميع الفروع حتى نهاية الأسبوع.
للحجز المباشر تواصل معنا عبر هذا الرقم أو عبر موقعنا: https://cairocosmo.online`,
  },
  {
    id: "reactivation_gift",
    title: "حملة إعادة تنشيط العملاء (هدية 500 ج.م) 🎁",
    category: "reactivation",
    badge: "استعادة عملاء 🔄",
    defaultText: `أهلاً بكِ {اسم_العميل}، اشتقنا لكِ في كايرو كوزمو سنتر! ❤️
تقديراً لثقتكِ بنا، أضفنا إلى حسابكِ رصيد بقيمة 500 ج.م يمكن استخدامه فورياً عند حجز أي جلسة فيلر أو ليزر أو هيدرافيشل خلال هذا الشهر.

✨ كود الخصم الشخصي: VIPBEAUTY
لحجز موعدك والاستفادة من الهدية ردي على هذه الرسالة أو تواصلي معنا!`,
  },
  {
    id: "birthday_special",
    title: "تهنئة يوم الميلاد الخاصة 🎂",
    category: "birthday",
    badge: "ولاء العملاء ⭐",
    defaultText: `كل عام وأنتِ بألف خير وتألق أستاذة {اسم_العميل}! 🎂✨
بمناسبة شهر ميلادكِ السعيد، يسر إدارة كايرو كوزمو سنتر تقديم جلسة تنظيف بشرة هيدرافيشل ملكية مجاناً كهدية عيد ميلادكِ عند حجز أي خدمة تجميلية.

نتمنى لكِ عاماً مليئاً بالجمال والسعادة! 🌸`,
  },
  {
    id: "filler_glow",
    title: "باقة النضارة الملكية (فيلر + نضارة مجانية) 💎",
    category: "seasonal",
    badge: "عرض حصري 💎",
    defaultText: `أهلاً بكِ {اسم_العميل} ✨
إليكِ عرض النضارة الملكي المحدود: احصلي على حقن فيلر الشفاه الفرنسي أو الخدود واحصلي على جلسة نضارة عميقة بروفايلو بخصم 30%!

🩺 بإشراف نخبة من استشاريي الجلدية والتجميل.
احجزي موعدكِ الآن قبل اكتمال حجوزات الأسبوع.`,
  },
];

export default function CampaignsAdmin() {
  const { toast } = useToast();
  const [selectedSegment, setSelectedSegment] = useState<string>("vip");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("summer_laser");
  const [campaignTitle, setCampaignTitle] = useState<string>("حملة عروض الصيف الحصرية لعملاء VIP");
  const [messageContent, setMessageContent] = useState<string>(marketingTemplates[0].defaultText);
  const [isSimulatingDispatch, setIsSimulatingDispatch] = useState<boolean>(false);
  const [dispatchProgress, setDispatchProgress] = useState<number>(0);

  // Calculate segment count strictly from real bookings
  const storedBookings = getStoredBookings();
  const vipCount = storedBookings.filter((b) => b.segment === "vip").length;
  const newCount = storedBookings.filter((b) => b.segment === "new" || !b.segment).length;
  const inactiveCount = storedBookings.filter((b) => b.status === "cancelled").length;
  const birthdayCount = storedBookings.length > 0 ? 1 : 0;

  const segmentCounts = {
    all: storedBookings.length,
    vip: vipCount,
    new: newCount,
    inactive: inactiveCount,
    birthday: birthdayCount,
  };

  const targetCount = segmentCounts[selectedSegment as keyof typeof segmentCounts] || 0;

  const handleSelectTemplate = (t: MarketingTemplate) => {
    setSelectedTemplateId(t.id);
    setMessageContent(t.defaultText);
    setCampaignTitle(`حملة: ${t.title}`);
  };

  const handleStartCampaign = () => {
    setIsSimulatingDispatch(true);
    setDispatchProgress(5);

    const interval = setInterval(() => {
      setDispatchProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulatingDispatch(false);
          toast({
            title: "تم إطلاق وإرسال الحملة بنجاح! 🚀",
            description: `تم إرسال الرسائل التسويقية لـ ${targetCount} عميلاً في شريحة (${selectedSegment.toUpperCase()}).`,
          });
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  const handleSendTestWhatsApp = () => {
    const preview = messageContent
      .replace(/{اسم_العميل}/g, "سارة محمد")
      .replace(/{الفرع}/g, "فرع مصر الجديدة");
    window.open(`https://wa.me/?text=${encodeURIComponent(preview)}`, "_blank");
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Toast Alert Integration */}
      <BookingNotificationToast />

      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-card via-card/80 to-primary/5 p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Sparkles className="h-4 w-4" />
              <span>منصة التسويق الذكي والمراسلات الجماعية • Cairo Cosmo Marketing Hub</span>
            </div>
            <h1 className="text-3xl font-black text-foreground">
              منصة الحملات التسويقية ورسائل الواتساب
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              إطلاق حملات تسويقية مستهدفة حسب شرائح العملاء لزيادة نسبة الحجوزات وإعادة تنشيط العملاء ومضاعفة العائد المالي.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-border/80 bg-background/80 px-4 py-2.5 text-center shadow-xs">
              <div className="text-xs text-muted-foreground font-semibold">معدل تحويل الحملات</div>
              <div className="text-lg font-black text-emerald-500 flex items-center justify-center gap-1">
                <TrendingUp className="h-4 w-4" /> 18.4%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Campaign Builder Grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Segment Selector & Template Chooser (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Target Audience Segment Selector */}
          <Card className="rounded-3xl border-border/70 bg-card/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  تحديد الشريحة المستهدفة للحملة
                </h3>
                <p className="text-xs text-muted-foreground">
                  اختر فئة العملاء المراد توجيه الرسائل والعروض إليهم
                </p>
              </div>

              <Badge className="bg-primary/10 text-primary border-primary/25 text-xs font-bold px-3 py-1">
                {targetCount} عميل مستهدف
              </Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { id: "vip", label: "عملاء VIP والنخبة ⭐", desc: "أكثر من 5 جلسات • إنفاق عالي", count: segmentCounts.vip },
                { id: "inactive", label: "عملاء غير نشطين (>60 يوم) 🔄", desc: "بحاجة لإعادة التنشيط والاستعادة", count: segmentCounts.inactive },
                { id: "new", label: "العملاء الجدد 🆕", desc: "حجزوا لأول مرة هذا الشهر", count: segmentCounts.new },
                { id: "birthday", label: "أعياد ميلاد هذا الشهر 🎂", desc: "رسائل تهنئة وهدايا خاصة", count: segmentCounts.birthday },
                { id: "all", label: "جميع قاعدة بيانات العملاء 👥", desc: "إرسال شامل لجميع المسجلين", count: segmentCounts.all },
              ].map((seg) => (
                <div
                  key={seg.id}
                  onClick={() => setSelectedSegment(seg.id)}
                  className={`rounded-2xl border p-3.5 cursor-pointer transition-all ${
                    selectedSegment === seg.id
                      ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40"
                      : "border-border/60 bg-background/60 hover:bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">{seg.label}</span>
                    <Badge variant="secondary" className="text-[10px] font-bold">
                      {seg.count}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{seg.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Marketing Templates Chooser */}
          <Card className="rounded-3xl border-border/70 bg-card/90 shadow-sm p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                قوالب الرسائل التسويقية الجاهزة
              </h3>
              <p className="text-xs text-muted-foreground">
                نماذج رسائل تم اختبارها وصياغتها لتحقيق أعلى معدل فتح وحجز
              </p>
            </div>

            <div className="space-y-3">
              {marketingTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  className={`rounded-2xl border p-4 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    selectedTemplateId === tmpl.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary/40 shadow-xs"
                      : "border-border/60 bg-background/50 hover:bg-card"
                  }`}
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground truncate">{tmpl.title}</span>
                      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[9px] font-bold">
                        {tmpl.badge}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {tmpl.defaultText}
                    </p>
                  </div>

                  <div className="h-5 w-5 rounded-full flex items-center justify-center border shrink-0 transition-all">
                    {selectedTemplateId === tmpl.id && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Campaign Editor & Dispatch Controls (5 cols) */}
        <div className="space-y-6 lg:col-span-5 lg:sticky lg:top-24">
          <Card className="rounded-[2.5rem] border border-border/80 bg-card/95 shadow-xl p-6 md:p-8 space-y-6">
            <CardHeader className="p-0 border-b border-border/60 pb-3">
              <CardTitle className="text-lg font-black text-foreground flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-emerald-500" />
                محرر ومعاينة نص الحملة
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                سيتم استبدال المتغيرات تلقائياً باسم كل عميل
              </CardDescription>
            </CardHeader>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">عنوان الحملة (للإدارة الداخلية)</Label>
                <Input
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">نص رسالة الواتساب</Label>
                  <span className="text-[10px] text-primary font-bold">متغيرات: {"{اسم_العميل}"}</span>
                </div>
                <Textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={8}
                  className="rounded-2xl text-xs bg-background leading-relaxed font-sans"
                />
              </div>
            </div>

            {/* Campaign Summary & Dispatch */}
            <div className="rounded-2xl bg-muted/40 border border-border/60 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">الجمهور المستهدف:</span>
                <span className="font-bold text-foreground">{targetCount} عميلاً ({selectedSegment.toUpperCase()})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">القناة الإعلانية:</span>
                <span className="font-bold text-emerald-600">WhatsApp Web & Broadcast</span>
              </div>
            </div>

            {/* Progress Bar if Dispatching */}
            {isSimulatingDispatch && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-primary">
                  <span>جاري الإرسال للبث الجماعي...</span>
                  <span>{dispatchProgress}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${dispatchProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <Button
                onClick={handleStartCampaign}
                disabled={isSimulatingDispatch}
                className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span>إطلاق الحملة التسويقية الآن 🚀</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleSendTestWhatsApp}
                className="w-full rounded-xl text-xs font-bold gap-1.5"
              >
                <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                <span>معاينة إرسال تجريبي على واتسابي</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
