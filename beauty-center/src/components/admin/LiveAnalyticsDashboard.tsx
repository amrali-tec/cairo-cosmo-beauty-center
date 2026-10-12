// ===============================================
// src/components/admin/LiveAnalyticsDashboard.tsx
// مركز التحليلات الحية والذكاء الإداري المتكامل
// ===============================================

import { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Users,
  DollarSign,
  CalendarCheck,
  Sparkles,
  MapPin,
  Stethoscope,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw,
  SlidersHorizontal,
  Flame,
  PieChart as PieIcon,
  Radio,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Layers,
  ChevronRight,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  computeLiveClinicStats,
  exportAnalyticsToCsv,
  TimeRange,
  BranchFilter,
  ClinicLiveStats,
} from "@/services/liveAnalyticsService";

interface Props {
  condensed?: boolean;
}

export function LiveAnalyticsDashboard({ condensed = false }: Props) {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<TimeRange>("today");
  const [branchFilter, setBranchFilter] = useState<BranchFilter>("all");
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [stats, setStats] = useState<ClinicLiveStats>(() =>
    computeLiveClinicStats("today", "all")
  );
  const [liveVisitorPulse, setLiveVisitorPulse] = useState(stats.activeVisitors);

  // Recalculate stats when filters change
  useEffect(() => {
    setStats(computeLiveClinicStats(timeRange, branchFilter));
  }, [timeRange, branchFilter]);

  // Live subscription to real booking additions or updates
  useEffect(() => {
    const handleUpdate = () => {
      setStats(computeLiveClinicStats(timeRange, branchFilter));
    };

    window.addEventListener("cosmo:bookings_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("cosmo:bookings_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [timeRange, branchFilter]);

  // Export analytics
  const handleExport = () => {
    const csvContent = exportAnalyticsToCsv(stats);
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `cairo_cosmo_analytics_${timeRange}_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "تم تصدير التقرير بنجاح",
      description: "تم تحميل ملف البيانات التحليلية الشامل بصيغة Excel / CSV",
    });
  };

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-border/80 bg-popover/95 p-3 shadow-xl backdrop-blur-md text-xs space-y-1">
          <p className="font-bold text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="flex items-center gap-2" style={{ color: entry.color || entry.stroke }}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color || entry.stroke }} />
              <span>{entry.name}:</span>
              <span className="font-bold">
                {typeof entry.value === "number" && entry.name.includes("إيراد")
                  ? `${entry.value.toLocaleString()} ج.م`
                  : entry.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Real-time Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-primary/5 p-4 md:p-6 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Radio className="h-5 w-5 animate-pulse text-primary" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-foreground">
                منظومة النبض الحي والمؤشرات اللحظية
              </h3>
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-bold">
                🟢 متصل حي • بث مباشر
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              متابعة تدفق الحجوزات ونشاط العيادات وسلوك الزوار لحظة بلحظة
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Range Filter */}
          <Select
            value={timeRange}
            onValueChange={(val) => setTimeRange(val as TimeRange)}
          >
            <SelectTrigger className="h-9 w-[130px] rounded-xl text-xs font-semibold bg-background/80">
              <Clock className="h-3.5 w-3.5 ml-1.5 text-primary" />
              <SelectValue placeholder="النطاق الزمني" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value="today">اليوم (مباشر)</SelectItem>
              <SelectItem value="week">آخر 7 أيام</SelectItem>
              <SelectItem value="month">هذا الشهر</SelectItem>
              <SelectItem value="quarter">الربع السنوي</SelectItem>
              <SelectItem value="year">هذا العام</SelectItem>
            </SelectContent>
          </Select>

          {/* Branch Filter */}
          <Select
            value={branchFilter}
            onValueChange={(val) => setBranchFilter(val as BranchFilter)}
          >
            <SelectTrigger className="h-9 w-[145px] rounded-xl text-xs font-semibold bg-background/80">
              <MapPin className="h-3.5 w-3.5 ml-1.5 text-primary" />
              <SelectValue placeholder="الفرع الطبي" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value="all">جميع الفروع</SelectItem>
              <SelectItem value="sheraton">مصر الجديدة (شيراتون)</SelectItem>
              <SelectItem value="dokki">فرع الدقي</SelectItem>
              <SelectItem value="october">فرع 6 أكتوبر</SelectItem>
            </SelectContent>
          </Select>

          {/* Simulation Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSimulating(!isSimulating)}
            className="h-9 rounded-xl text-xs font-bold gap-1.5 bg-background/80"
            title={isSimulating ? "إيقاف المحاكاة الحية" : "تشغيل المحاكاة الحية"}
          >
            {isSimulating ? (
              <>
                <Pause className="h-3.5 w-3.5 text-amber-500" />
                <span>محاكاة نشطة</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-emerald-500" />
                <span>تشغيل المحاكاة</span>
              </>
            )}
          </Button>

          {/* Export Report */}
          <Button
            variant="default"
            size="sm"
            onClick={handleExport}
            className="h-9 rounded-xl text-xs font-bold gap-1.5 shadow-md shadow-primary/20"
          >
            <Download className="h-3.5 w-3.5" />
            <span>تصدير تقرير BI</span>
          </Button>
        </div>
      </div>

      {/* Top 4 Live KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Active Online Visitors */}
        <Card className="rounded-3xl border-border/70 bg-gradient-to-br from-card to-card/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">
                الزوار المتواجدون الآن
              </span>
              <div className="h-8 w-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500">
                <Activity className="h-4 w-4 animate-spin text-sky-500" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="text-3xl font-black text-foreground flex items-center gap-2">
                <span>{liveVisitorPulse}</span>
                <span className="text-xs font-bold text-emerald-500 flex items-center">
                  <ArrowUpRight className="h-3.5 w-3.5" /> +14%
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] text-sky-600 dark:text-sky-400 border-sky-500/30">
                أونلاين متفاعل
              </Badge>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2.5">
              <span>موبايل: 72%</span>
              <span>كمبيوتر: 24%</span>
              <span>تابلت: 4%</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Bookings */}
        <Card className="rounded-3xl border-border/70 bg-gradient-to-br from-card to-card/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">
                إجمالي الحجوزات ({timeRange === "today" ? "اليوم" : "الفترة"})
              </span>
              <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <CalendarCheck className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="text-3xl font-black text-foreground flex items-center gap-2">
                <span>{stats.todayBookings}</span>
                <span className="text-xs font-bold text-emerald-500 flex items-center">
                  <ArrowUpRight className="h-3.5 w-3.5" /> +{stats.confirmedRatio}% تأكيد
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                مكتمل ومؤكد
              </Badge>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2.5">
              <span>VIP: {stats.vipClientsCount} عميل</span>
              <span>متوسط الانتظار: 8 دقائق</span>
            </div>
          </CardContent>
        </Card>

        {/* Estimated Clinic Revenue */}
        <Card className="rounded-3xl border-border/70 bg-gradient-to-br from-card to-card/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">
                الإيرادات التقديرية (ج.م)
              </span>
              <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="text-3xl font-black text-foreground flex items-center gap-2">
                <span>{stats.todayRevenue.toLocaleString()}</span>
                <span className="text-xs font-bold text-emerald-500 flex items-center">
                  <ArrowUpRight className="h-3.5 w-3.5" /> +18.4%
                </span>
              </div>
              <span className="text-xs font-bold text-muted-foreground">ج.م</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2.5">
              <span>متوسط السلة: {stats.avgBookingValue.toLocaleString()} ج.م</span>
              <span className="text-emerald-500 font-bold">معدل مرتفع 🌟</span>
            </div>
          </CardContent>
        </Card>

        {/* Clinic Occupancy & Conversion */}
        <Card className="rounded-3xl border-border/70 bg-gradient-to-br from-card to-card/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">
                نسبة الإشغال ومعدل التحويل
              </span>
              <div className="h-8 w-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Flame className="h-4 w-4 text-purple-500" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="text-3xl font-black text-foreground flex items-center gap-2">
                <span>{stats.clinicOccupancyRate}%</span>
                <span className="text-xs font-bold text-purple-500">إشغال</span>
              </div>
              <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px]">
                تحويل: {stats.conversionRate}%
              </Badge>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2.5">
              <span>سعة الغرف: شبه ممتلئة</span>
              <span className="text-primary font-bold">ذروة إقبال</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue & Booking Area Flow Chart (Spans 2 columns) */}
        <Card className="rounded-3xl border-border/70 bg-card/90 shadow-md lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                تدفق الحجوزات والإيرادات اللحظية
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                معدل تدفق الحجوزات بالساعة مع قمم الذروة والإيراد المالي المتولد
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                مباشر
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="h-[280px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.bookingTrend}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                  <XAxis
                    dataKey="timeLabel"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="إيراد تقديري"
                    stroke="#ec4899"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    name="عدد الحجوزات"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBookings)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-around border-t border-border/50 pt-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">الإيرادات (ج.م)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-purple-500" />
                <span className="text-muted-foreground">الحجوزات المؤكدة</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span className="font-bold text-foreground">ذروة الحجوزات: 04:00 - 08:00 مساءً</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Demand Breakdown Donut Chart */}
        <Card className="rounded-3xl border-border/70 bg-card/90 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-2">
                <PieIcon className="h-4 w-4 text-primary" />
                توزيع الخدمات الأكثر طلباً
              </span>
              <span className="text-xs font-normal text-muted-foreground">حصة الإيراد</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="h-[200px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.serviceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="percentage"
                  >
                    {stats.serviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value}% من الإجمالي`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 space-y-2">
              {stats.serviceDistribution.slice(0, 4).map((s, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="truncate text-foreground font-medium">{s.name}</span>
                  </div>
                  <span className="font-bold text-muted-foreground shrink-0">{s.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {!condensed && (
        <>
          {/* Secondary BI Matrix: Branch Performance & Acquisition Channels */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Branch Performance Comparison */}
            <Card className="rounded-3xl border-border/70 bg-card/90 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  مقارنة أداء وإشغال الفروع
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  توزيع الإيرادات ونسب الإشغال لكل فرع من فروع كايرو كوزمو
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {stats.branchPerformance.map((branch, idx) => (
                  <div key={idx} className="rounded-2xl border border-border/60 bg-background/50 p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-bold text-sm text-foreground flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        {branch.name}
                      </div>
                      <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary">
                        {branch.capacityRate}% نسبة الإشغال
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{branch.totalBookings} حجز ({branch.completedBookings} مكتمل)</span>
                      <span className="font-bold text-foreground">{branch.revenue.toLocaleString()} ج.م</span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500"
                        style={{ width: `${branch.capacityRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Acquisition Channels & Funnel */}
            <Card className="rounded-3xl border-border/70 bg-card/90 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  قنوات جذب العملاء والتحويل
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  أعلى المصادر تحقيقاً للحجوزات الفعلية ومعدل التحويل لكل قناة
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {stats.acquisitionChannels.map((channel, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: channel.color }} />
                        <span className="text-foreground">{channel.channel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{channel.conversions} حجز</span>
                        <Badge variant="secondary" className="text-[10px] font-bold">
                          {channel.rate}% تحويل
                        </Badge>
                      </div>
                    </div>

                    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, channel.rate * 8)}%`,
                          backgroundColor: channel.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Doctor Matrix & Real-time Live Stream */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Doctor Performance Table */}
            <Card className="rounded-3xl border-border/70 bg-card/90 shadow-md lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-primary" />
                  مصفوفة إنتاجية وتقييمات الفريق الطبي
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  ساعات الكشف المحجوزة، عدد الحالات، وتقييم رضا المراجعين
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-3">
                  {stats.doctorUtilization.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/50 p-4 transition-all hover:bg-background/80"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                          <Stethoscope className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-foreground">{doc.name}</div>
                          <div className="text-xs text-muted-foreground">{doc.specialty}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <div className="text-center">
                          <div className="font-bold text-foreground">{doc.patientsCount} حالة</div>
                          <div className="text-[10px] text-muted-foreground">إجمالي الكشوفات</div>
                        </div>

                        <div className="text-center">
                          <div className="font-bold text-emerald-500">⭐ {doc.rating}</div>
                          <div className="text-[10px] text-muted-foreground">تقييم المرضى</div>
                        </div>

                        <Badge
                          variant="secondary"
                          className="rounded-xl px-3 py-1 font-bold text-xs bg-primary/10 text-primary border-primary/20"
                        >
                          إشغال {doc.occupancyRate}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Live Activity Feed */}
            <Card className="rounded-3xl border-border/70 bg-card/90 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    شريط الأحداث اللحظية
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  تحديثات الحجوزات وتأكيدات الدخول مباشرة
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {stats.recentLiveEvents.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground text-xs space-y-2">
                      <Activity className="h-6 w-6 text-primary/40 mx-auto" />
                      <p className="font-bold text-foreground">لا توجد أحداث حجز مسجلة حتى الآن</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xs mx-auto">
                        يتم رصد وبث الأحداث هنا لحظياً فور استلام أي حجز فعلي من نماذج الموقع أو تسجيل موعد جديد بالعيادة.
                      </p>
                    </div>
                  ) : (
                    stats.recentLiveEvents.map((ev) => (
                      <div key={ev.id} className="flex items-start gap-3 text-xs">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground truncate">{ev.title}</span>
                            <span className="text-[10px] text-muted-foreground shrink-0">{ev.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate">{ev.subtitle}</p>
                          <div className="flex items-center justify-between text-[10px] text-primary/80 pt-0.5">
                            <span>{ev.branchName}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
