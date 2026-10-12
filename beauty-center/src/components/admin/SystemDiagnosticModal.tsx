// ===============================================
// src/components/admin/SystemDiagnosticModal.tsx
// نافذة الفحص البرمجي الذاتي وتشخيص اتصال الأنظمة وصوفيا AI
// ===============================================

import { useState } from "react";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Wrench,
  Bot,
  Volume2,
  Database,
  Radio,
  Sparkles,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  runFullSystemDiagnostics,
  executeAutoRepair,
  SystemHealthReport,
  SubsystemDiagnosticResult,
} from "@/services/systemDiagnosticService";
import { useToast } from "@/hooks/use-toast";

export function SystemDiagnosticModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SystemHealthReport | null>(null);
  const [repairingKey, setRepairingKey] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRunDiagnostics = async () => {
    setLoading(true);
    try {
      const res = await runFullSystemDiagnostics();
      setReport(res);
    } catch (err: any) {
      toast({
        title: "تعذر إكمال الفحص",
        description: err?.message || "حدث خطأ غير متوقع أثناء الفحص البرمجي.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setOpen(true);
    handleRunDiagnostics();
  };

  const handleFix = async (fixKey?: string) => {
    if (!fixKey) return;
    setRepairingKey(fixKey);
    try {
      const res = await executeAutoRepair(fixKey);
      toast({
        title: res.success ? "تم تنفيذ الإصلاح بنجاح 🛠️" : "تنبيه في الإصلاح",
        description: res.message,
        variant: res.success ? "default" : "destructive",
      });
      // Re-run scan
      await handleRunDiagnostics();
    } catch {
    } finally {
      setRepairingKey(null);
    }
  };

  const getStatusIcon = (status: SubsystemDiagnosticResult["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
      case "error":
        return <XCircle className="h-4 w-4 text-rose-500 shrink-0" />;
    }
  };

  const getStatusBadge = (status: SubsystemDiagnosticResult["status"]) => {
    switch (status) {
      case "healthy":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
            سليم 🟢
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-bold">
            تنبيه 🟡
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px] font-bold">
            خطأ 🔴
          </Badge>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenModal}
          className="rounded-xl gap-1.5 text-xs font-bold border-border/80 hover:border-primary/40 hover:bg-primary/5 transition-all"
          title="فحص وتشخيص الأخطاء البرمجية وصحة اتصال الأنظمة"
        >
          <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
          <span className="hidden md:inline">الفحص والتشخيص الذاتي</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl rounded-3xl p-0 overflow-hidden bg-card/95 backdrop-blur-xl border-primary/20" dir="rtl">
        {/* Header */}
        <DialogHeader className="p-5 border-b border-border/70 bg-gradient-to-l from-primary/10 via-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-primary/25">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-black text-foreground flex items-center gap-2">
                  <span>منظومة الفحص البرمجي الذاتي وتشخيص الأنظمة</span>
                  <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                    Live Diagnostics 🩺
                  </Badge>
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  فحص سلامة اتصال محرك صوفيا، الحجوزات، التنبيه الصوتي، وشبكة العيادات
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              disabled={loading}
              onClick={handleRunDiagnostics}
              className="rounded-xl text-xs font-bold gap-1.5 h-8 border-primary/30"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
              <span>إعادة الفحص</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Overall Score Summary */}
        {report && (
          <div className="p-4 bg-muted/30 border-b border-border/60">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-2.5 rounded-2xl bg-card border border-border/60 shadow-xs">
                <span className="text-[10px] font-bold text-muted-foreground block">مؤشر الصحة العامة</span>
                <span className="text-xl font-black text-primary">{report.overallScore}%</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-card border border-border/60 shadow-xs">
                <span className="text-[10px] font-bold text-emerald-600 block">أنظمة سليمة</span>
                <span className="text-xl font-black text-emerald-500">{report.healthyCount}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-card border border-border/60 shadow-xs">
                <span className="text-[10px] font-bold text-amber-600 block">تنبيهات</span>
                <span className="text-xl font-black text-amber-500">{report.warningCount}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-card border border-border/60 shadow-xs">
                <span className="text-[10px] font-bold text-rose-600 block">أخطاء برمجية</span>
                <span className="text-xl font-black text-rose-500">{report.errorCount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Subsystems Diagnostic List */}
        <div className="max-h-[380px] overflow-y-auto p-4 space-y-2.5 text-xs">
          {loading && !report ? (
            <div className="py-12 text-center space-y-3">
              <Activity className="h-8 w-8 text-primary animate-spin mx-auto" />
              <p className="text-sm font-bold text-foreground">جاري إجراء فحص عميق للأنظمة البرمجية ومحرك صوفيا...</p>
            </div>
          ) : report ? (
            report.results.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl border border-border/60 bg-card hover:border-primary/30 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="font-bold text-foreground text-xs">{item.nameAr}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">({item.latencyMs}ms)</span>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed pr-6">
                  {item.messageAr}
                </p>

                {item.technicalDetails && (
                  <div className="pr-6">
                    <span className="text-[9px] font-mono text-muted-foreground/80 bg-muted/60 px-2 py-0.5 rounded-md inline-block">
                      {item.technicalDetails}
                    </span>
                  </div>
                )}

                {item.fixActionLabel && item.fixActionKey && (
                  <div className="pr-6 pt-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={repairingKey === item.fixActionKey}
                      onClick={() => handleFix(item.fixActionKey)}
                      className="rounded-xl text-[11px] font-bold h-7 gap-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                    >
                      <Wrench className="h-3 w-3" />
                      <span>{repairingKey === item.fixActionKey ? "جاري المعالجة..." : item.fixActionLabel}</span>
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border/70 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
          <span className="text-[10px]">
            آخر فحص تشخيصي: {report?.timestamp || "الآن"}
          </span>
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl text-xs">
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
