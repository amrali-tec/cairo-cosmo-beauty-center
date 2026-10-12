// ==========================================
// src/pages/admin/LiveAnalyticsPage.tsx
// صفحة التحليلات الحية والذكاء الإداري الشاملة
// ==========================================

import { useState } from "react";
import { LiveAnalyticsDashboard } from "@/components/admin/LiveAnalyticsDashboard";
import { BookingNotificationToast } from "@/components/admin/BookingNotificationToast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Zap,
  Target,
  FileSpreadsheet,
  Award,
  ArrowUpRight,
  MapPin,
  Stethoscope,
  Users,
} from "lucide-react";

export default function LiveAnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-8">
      {/* Toast Alert Integration */}
      <BookingNotificationToast />

      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-card via-card/80 to-primary/5 p-8 shadow-sm">
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Sparkles className="h-4 w-4" />
              <span>نظام الذكاء التحليلي المباشر • Cairo Cosmo Intelligence Engine</span>
            </div>
            <h1 className="text-3xl font-black text-foreground">
              التحليلات الحية والتقارير التنفيذية
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              لوحة قيادة شاملة تقدم رؤى فورية وتنبؤات ذكية لدعم اتخاذ القرارات الإدارية، تحسين كفاءة التشغيل، ومضاعفة نمو الإيرادات والحجوزات.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-border/80 bg-background/80 px-4 py-2.5 text-center shadow-xs backdrop-blur-xs">
              <div className="text-xs text-muted-foreground font-semibold">معدل النمو الشهري</div>
              <div className="text-lg font-black text-emerald-500 flex items-center justify-center gap-1">
                <ArrowUpRight className="h-4 w-4" /> +28.6%
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-background/80 px-4 py-2.5 text-center shadow-xs backdrop-blur-xs">
              <div className="text-xs text-muted-foreground font-semibold">رضا المراجعين</div>
              <div className="text-lg font-black text-amber-500">⭐ 4.93 / 5.0</div>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Analytics Component */}
      <LiveAnalyticsDashboard />

      {/* Strategic Management Insights Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            التوصيات الإدارية والتحليل التنبؤي
          </h2>
          <Badge variant="outline" className="rounded-full text-xs border-primary/30 text-primary">
            توليد ذكي مستمر
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <Card className="rounded-3xl border-border/70 bg-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">فرصة زيادة سعة فرع شيراتون</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              ساعات الذروة (04:00 م إلى 08:00 م) تشهد نسبة إشغال تتجاوز 94%. يُنصح بفتح عيادة ليزر إضافية يومي الخميس والسبت لامتصاص الطلب المتزايد.
            </p>
          </Card>

          {/* Card 2 */}
          <Card className="rounded-3xl border-border/70 bg-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 font-bold">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">باقة الفيلر + الهيدرافيشل المزدوجة</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              أظهرت البيانات أن 68% من مراجعي حقن الفيلر يطلبون تنظيف بشرة هيدرافيشل خلال 30 يوماً. إطلاق باقة مدمجة سيزيد متوسط قيمة الفاتورة بنسبة 22%.
            </p>
          </Card>

          {/* Card 3 */}
          <Card className="rounded-3xl border-border/70 bg-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">برنامج إعادة تنشيط عملاء 60 يوماً</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              يوجد حالياً 42 عميلة لم يقمن بحجز جلسة متابعة منذ شهرين. إرسال تذكير واتساب مخصص مع جلسة رتوش مجانية سيستعيد ما لا يقل عن 18 عميلة فورياً.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
