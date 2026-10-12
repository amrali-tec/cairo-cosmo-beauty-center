// ===============================================
// src/pages/admin/SophiaAgentPage.tsx
// مركز عمليات الآجينت صوفيا للذكاء الاصطناعي (SOPHIA AI OPERATIONS)
// ===============================================

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Bot,
  Sparkles,
  Send,
  User,
  Zap,
  Calendar,
  Users,
  MessageCircle,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Sliders,
  Play,
  RotateCcw,
  Power,
  Volume2,
  VolumeX,
  Activity,
  CalendarDays,
  Radio,
  FileText,
  Layers,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { BookingNotificationToast } from "@/components/admin/BookingNotificationToast";
import { SystemDiagnosticModal } from "@/components/admin/SystemDiagnosticModal";
import {
  SophiaMessage,
  SophiaAutomatedWorkflow,
  processSophiaCommand,
  getStoredWorkflows,
  saveStoredWorkflows,
} from "@/services/sophiaAgentService";
import {
  getStoredCronTasks,
  getStoredCronLogs,
  runCronJobNow,
  toggleCronJob,
  SophiaCronTask,
  SophiaCronLog,
} from "@/services/sophiaAutonomousScheduler";
import { playNotificationChime, getStoredBookings } from "@/services/realtimeBookingService";

const initialSophiaChat: SophiaMessage[] = [
  {
    id: "welcome-1",
    sender: "sophia",
    text: `أهلاً بك يا دكتور في مركز العمليات الذكي! 🌸 أنا **صوفيا (Sophia AI)**، مساعدتكِ ومستشاركِ التنفيذي لإدارة وتشغيل كايرو كوزمو سنتر.\n\n🧠 **العقل الموحد مفعّل:** أنا متصلة لحظياً بشات زوار الموقع، قواعد بيانات الحجوزات، غرف وأجهزة الليزر (كانديلا وديكا)، ملفات العملاء CRM، ومؤشرات الأداء.\n⏰ **الجدولة الذاتية بالخلفية:** أقوم بتشغيل التقارير اليومية، تتبع الأجهزة، وتنبيهات الجلسات تلقائياً.\n\nكيف يمكنني مساعدتك الآن؟`,
    timestamp: "الآن",
    quickPrompts: [
      "⏰ شغلي التقرير الصباحي الشامل الآن",
      "🌐 فحص منظومة العقل الموحد والزوار",
      "📊 ملخص أداء ومواعيد اليوم",
      "⚡ فحص أجهزة الليزر والغرف",
      "👥 استعراض شرائح العملاء VIP",
      "📢 تجهيز مسودة حملة واتساب",
    ],
  },
];

export default function SophiaAgentPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<SophiaMessage[]>(initialSophiaChat);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [workflows, setWorkflows] = useState<SophiaAutomatedWorkflow[]>(getStoredWorkflows());
  const [cronTasks, setCronTasks] = useState<SophiaCronTask[]>(getStoredCronTasks());
  const [cronLogs, setCronLogs] = useState<SophiaCronLog[]>(getStoredCronLogs());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeRightTab, setActiveRightTab] = useState<"cron" | "actions" | "logs">("cron");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat feed
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Sync cron tasks and logs on custom events
  useEffect(() => {
    const handleTasksUpdate = () => setCronTasks(getStoredCronTasks());
    const handleLogsUpdate = () => setCronLogs(getStoredCronLogs());

    window.addEventListener("cosmo:cron_tasks_updated", handleTasksUpdate);
    window.addEventListener("cosmo:cron_logs_updated", handleLogsUpdate);

    return () => {
      window.removeEventListener("cosmo:cron_tasks_updated", handleTasksUpdate);
      window.removeEventListener("cosmo:cron_logs_updated", handleLogsUpdate);
    };
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    setInputText("");

    const now = new Date();
    const timeStr = now.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });

    // Add Admin Message
    const userMsg: SophiaMessage = {
      id: `user-${Date.now()}`,
      sender: "admin",
      text,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const sophiaResponse = await processSophiaCommand(text);
      setMessages((prev) => [...prev, sophiaResponse]);

      if (soundEnabled) {
        playNotificationChime();
      }
    } catch (e) {
      toast({
        title: "خطأ في المعالجة",
        description: "حدث خطأ غير متوقع أثناء معالجة الأمر",
        variant: "destructive",
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleRunCron = async (task: SophiaCronTask) => {
    toast({
      title: "جاري تشغيل المهمة ذاتياً...",
      description: task.title,
    });

    try {
      const log = await runCronJobNow(task.id);
      setCronTasks(getStoredCronTasks());
      setCronLogs(getStoredCronLogs());

      if (soundEnabled) {
        playNotificationChime();
      }

      toast({
        title: "تم إكمال المهمة بنجاح 🚀",
        description: log.summary,
      });

      // Also announce in chat
      const now = new Date();
      const timeStr = now.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [
        ...prev,
        {
          id: `sophia-cron-${Date.now()}`,
          sender: "sophia",
          text: `تم تنفيذ المهمة الذاتية بنجاح! ⚡\n\n📌 **المهمة:** ${task.title}\n🕒 **الوقت:** ${timeStr}\n✨ **النتيجة:** ${log.summary}`,
          timestamp: timeStr,
        },
      ]);
    } catch (e) {
      toast({
        title: "تعذر تنفيذ المهمة",
        description: "يرجى التحقق من سجل الأخطاء",
        variant: "destructive",
      });
    }
  };

  const handleToggleCron = (taskId: string, enabled: boolean) => {
    toggleCronJob(taskId, enabled);
    setCronTasks(getStoredCronTasks());
    toast({
      title: enabled ? "تم تفعيل الجدولة الذاتية للمهمة 🟢" : "تم إيقاف المهمة مؤقتاً ⏸️",
    });
  };

  const storedBookings = getStoredBookings();
  const enabledCronCount = cronTasks.filter((t) => t.enabled).length;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Toast Alert Integration */}
      <BookingNotificationToast />

      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-card via-card/80 to-primary/5 p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Sparkles className="h-4 w-4" />
              <span>مركز الذكاء الاصطناعي والعمليات المركزية • Sophia AI Operations Hub</span>
            </div>
            <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
              <span>صوفيا للذكاء الاصطناعي (Sophia AI)</span>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold px-3 py-1">
                Copilot V2.5
              </Badge>
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              منظومة الذكاء الاصطناعي المركزي والعقل الموحد لإدارة حجوزات العيادات، جدولة غرف الليزر، الجدولة الذاتية بالخلفية، وتنسيق حملات الواتساب ذاتياً.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live Subsystem Diagnostic Button */}
            <SystemDiagnosticModal
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-2xl border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs gap-1.5 h-10 px-4 transition-all"
                >
                  <Activity className="h-4 w-4 animate-pulse text-emerald-500" />
                  <span>الفحص والتشخيص الذاتي</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping mr-0.5" />
                </Button>
              }
            />

            {/* Omni-Brain Badge */}
            <div className="rounded-2xl border border-primary/25 bg-primary/5 px-3.5 py-2 text-center">
              <div className="text-[10px] text-muted-foreground font-semibold">العقل الموحد</div>
              <div className="text-xs font-black text-primary flex items-center justify-center gap-1">
                <Radio className="h-3 w-3 text-primary animate-pulse" /> متصل بالزوار
              </div>
            </div>

            {/* Sound Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="rounded-2xl text-xs gap-1.5 font-bold h-10 px-3 bg-background"
              title={soundEnabled ? "التنبيه الصوتي مفعّل" : "التنبيه الصوتي مكتوم"}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="h-4 w-4 text-emerald-500" />
                  <span className="hidden sm:inline">الصوت مفعّل</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                  <span className="hidden sm:inline">مكتوم</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Main Operations Grid */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Sophia Conversational Interactive Terminal (8 cols) */}
        <div className="space-y-4 lg:col-span-8">
          <Card className="rounded-[2.5rem] border border-border/80 bg-card/95 shadow-md flex flex-col h-[680px]">
            <CardHeader className="p-4 md:p-6 border-b border-border/60 flex flex-row items-center justify-between space-y-0 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold shadow-md shadow-primary/25">
                  <Bot className="h-6 w-6" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-card animate-pulse" />
                </div>
                <div>
                  <CardTitle className="text-base font-black text-foreground flex items-center gap-2">
                    <span>غرفة عمليات صوفيا AI (Executive Terminal)</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                    <span>متصلة بالعقل الموحد وقاعدة البيانات السحابية (0ms)</span>
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMessages(initialSophiaChat)}
                  className="rounded-xl text-xs text-muted-foreground hover:text-foreground h-8 px-2.5"
                  title="تطهير المحادثة"
                >
                  <RotateCcw className="h-3.5 w-3.5 ml-1" />
                  مسح
                </Button>
              </div>
            </CardHeader>

            {/* Chat Feed */}
            <CardContent className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-muted/10">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 text-xs leading-relaxed ${
                    msg.sender === "admin" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold shadow-xs ${
                      msg.sender === "admin"
                        ? "bg-foreground text-background"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {msg.sender === "admin" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  <div
                    className={`rounded-2xl p-4 max-w-[85%] space-y-3 shadow-xs ${
                      msg.sender === "admin"
                        ? "bg-primary text-primary-foreground font-medium rounded-tr-none"
                        : "bg-card border border-border/70 text-foreground rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed font-sans text-xs md:text-sm">
                      {msg.text}
                    </p>

                    {/* Action Cards & Rich Tools Payload */}
                    {msg.action && (
                      <div className="rounded-xl bg-muted/40 border border-border/60 p-3 space-y-2 text-xs">
                        <div className="font-bold text-foreground flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            {msg.action.title}
                          </span>
                        </div>

                        {msg.action.data && (
                          <div className="space-y-1 text-[11px] text-muted-foreground font-mono bg-background/60 p-2 rounded-lg border border-border/40">
                            {Object.entries(msg.action.data).map(([k, v]) => (
                              <div key={k} className="flex items-center justify-between">
                                <span className="text-muted-foreground">{k}:</span>
                                <span className="font-bold text-foreground truncate max-w-[200px]">
                                  {typeof v === "object" ? JSON.stringify(v) : String(v)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {msg.action.actionButton && (
                          <div className="pt-1">
                            {msg.action.actionButton.url ? (
                              <Link to={msg.action.actionButton.url}>
                                <Button size="sm" className="w-full h-7 rounded-lg text-xs font-bold gap-1 btn-primary-gradient">
                                  <span>{msg.action.actionButton.label}</span>
                                  <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                                </Button>
                              </Link>
                            ) : null}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quick Prompts Suggestions */}
                    {msg.quickPrompts && msg.quickPrompts.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.quickPrompts.map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(p)}
                            className="rounded-lg border border-primary/25 bg-primary/5 hover:bg-primary/15 text-primary text-[10px] font-bold px-2 py-1 transition-all"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                    <Bot className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="rounded-2xl bg-card border border-border/60 px-4 py-2.5 space-y-1">
                    <span className="font-bold text-foreground">صوفيا تفكر وتحلل البيانات...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 md:p-4 border-t border-border/60 bg-card/80 flex items-center gap-2 shrink-0"
            >
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="اكتب أمرك لصوفيا (مثال: شغلي التقرير الصباحي، احجز موعد، فحص أجهزة الليزر...)"
                disabled={isThinking}
                className="rounded-2xl text-xs h-11 bg-background"
              />

              <Button
                type="submit"
                disabled={!inputText.trim() || isThinking}
                className="h-11 px-5 rounded-2xl btn-primary-gradient border-0 text-white font-bold text-xs gap-1.5 shadow-md shadow-primary/20"
              >
                <span>إرسال</span>
                <Send className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column: Autonomous Cron Engine & 1-Click Actions (4 cols) */}
        <div className="space-y-6 lg:col-span-4">
          <Card className="rounded-[2.5rem] border border-border/80 bg-card/95 shadow-sm p-5 space-y-4">
            {/* Tab Header Switcher */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-black text-xs text-foreground">المهام الذاتية بالخلفية</span>
              </div>
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                🟢 {enabledCronCount} مهام نشطة
              </Badge>
            </div>

            {/* Sub-Tabs: Cron Tasks vs 1-Click Actions vs Logs */}
            <Tabs value={activeRightTab} onValueChange={(v: any) => setActiveRightTab(v)} className="w-full">
              <TabsList className="grid grid-cols-3 bg-muted/40 rounded-xl p-1 text-xs mb-3">
                <TabsTrigger value="cron" className="rounded-lg text-[11px] font-bold">
                  المهام الذاتية
                </TabsTrigger>
                <TabsTrigger value="actions" className="rounded-lg text-[11px] font-bold">
                  أوامر سريعة
                </TabsTrigger>
                <TabsTrigger value="logs" className="rounded-lg text-[11px] font-bold">
                  السجل ({cronLogs.length})
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: Autonomous Cron Tasks */}
              <TabsContent value="cron" className="space-y-3 mt-0">
                {cronTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`rounded-2xl border p-3.5 space-y-2 transition-all ${
                      task.enabled ? "border-primary/30 bg-primary/5 shadow-xs" : "border-border/60 bg-muted/20 opacity-70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="font-bold text-xs text-foreground truncate">{task.title}</h4>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      </div>

                      <Switch
                        checked={task.enabled}
                        onCheckedChange={(checked) => handleToggleCron(task.id, checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-border/40 pt-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock className="h-3 w-3 text-primary" />
                        <span className="truncate max-w-[140px]">{task.scheduleLabel}</span>
                      </span>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRunCron(task)}
                        className="h-6 px-2 text-[10px] font-bold text-primary hover:bg-primary/15 rounded-lg"
                      >
                        <Play className="h-2.5 w-2.5 ml-1" />
                        تشغيل الآن
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* TAB 2: Categorized 1-Click Actions */}
              <TabsContent value="actions" className="space-y-3 mt-0">
                {/* Group 1: BI & Analytics */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground block">📊 التحليلات والتقارير:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage("ملخص أداء ومواعيد اليوم")}
                      className="rounded-xl text-[10px] font-semibold h-8 justify-start px-2 bg-background hover:bg-primary/10"
                    >
                      <TrendingUp className="h-3 w-3 ml-1 text-primary shrink-0" />
                      <span className="truncate">ملخص اليوم</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage("مقارنة إشغال الفروع الثلاثة")}
                      className="rounded-xl text-[10px] font-semibold h-8 justify-start px-2 bg-background hover:bg-primary/10"
                    >
                      <TrendingUp className="h-3 w-3 ml-1 text-primary shrink-0" />
                      <span className="truncate">إشغال الفروع</span>
                    </Button>
                  </div>
                </div>

                {/* Group 2: Appointments & CRM */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground block">📅 الحجوزات والمراجعين:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage("احجز موعد لمراجع جديد اليوم")}
                      className="rounded-xl text-[10px] font-semibold h-8 justify-start px-2 bg-background hover:bg-primary/10"
                    >
                      <Calendar className="h-3 w-3 ml-1 text-primary shrink-0" />
                      <span className="truncate">حجز فوري جديد</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage("تجهيز تذكيرات مواعيد الغد 24h")}
                      className="rounded-xl text-[10px] font-semibold h-8 justify-start px-2 bg-background hover:bg-primary/10"
                    >
                      <Clock className="h-3 w-3 ml-1 text-primary shrink-0" />
                      <span className="truncate">تذكيرات 24h</span>
                    </Button>
                  </div>
                </div>

                {/* Group 3: Devices & Laser Rooms */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground block">⚡ أجهزة الليزر والغرف:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage("فحص غرف وأجهزة كانديلا وديكا")}
                      className="rounded-xl text-[10px] font-semibold h-8 justify-start px-2 bg-background hover:bg-primary/10"
                    >
                      <Zap className="h-3 w-3 ml-1 text-primary shrink-0" />
                      <span className="truncate">أجهزة الليزر</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage("حالة غرفة الليزر 1 كانديلا")}
                      className="rounded-xl text-[10px] font-semibold h-8 justify-start px-2 bg-background hover:bg-primary/10"
                    >
                      <ShieldCheck className="h-3 w-3 ml-1 text-primary shrink-0" />
                      <span className="truncate">غرفة كانديلا 1</span>
                    </Button>
                  </div>
                </div>

                {/* Group 4: Marketing & VIP Retention */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground block">📢 التسويق والواتساب:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage("استعراض شرائح عملاء VIP المنقطعين")}
                      className="rounded-xl text-[10px] font-semibold h-8 justify-start px-2 bg-background hover:bg-primary/10"
                    >
                      <Users className="h-3 w-3 ml-1 text-primary shrink-0" />
                      <span className="truncate">عملاء VIP</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage("تجهيز مسودة حملة واتساب لعروض الصيف")}
                      className="rounded-xl text-[10px] font-semibold h-8 justify-start px-2 bg-background hover:bg-primary/10"
                    >
                      <Send className="h-3 w-3 ml-1 text-primary shrink-0" />
                      <span className="truncate">حملة عروض الصيف</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 3: Live Cron Execution Logs */}
              <TabsContent value="logs" className="space-y-2 mt-0">
                {cronLogs.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-xs">
                    لا توجد سجلات منشأة بعد
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                    {cronLogs.slice(0, 10).map((log) => (
                      <div key={log.id} className="rounded-xl border border-border/60 bg-muted/20 p-2.5 space-y-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-foreground text-[11px]">
                          <span className="truncate max-w-[150px]">{log.taskTitle}</span>
                          <span className="text-[9px] text-muted-foreground">{log.timestamp}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
                          {log.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
