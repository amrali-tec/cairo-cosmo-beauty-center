// ===============================================
// src/pages/admin/RoomsScheduleAdmin.tsx
// صفحة جدولة غرف وأجهزة العيادة الطبية
// ===============================================

import { RoomMachineScheduler } from "@/components/admin/RoomMachineScheduler";
import { BookingNotificationToast } from "@/components/admin/BookingNotificationToast";
import { Sparkles, Zap, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RoomsScheduleAdmin() {
  return (
    <div className="space-y-8">
      {/* Toast Alert Integration */}
      <BookingNotificationToast />

      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-card via-card/80 to-primary/5 p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Sparkles className="h-4 w-4" />
              <span>منظومة إدارة الأصول وغرف الكشف الطبية • Cairo Cosmo Asset Manager</span>
            </div>
            <h1 className="text-3xl font-black text-foreground">
              جدولة غرف العيادات وأجهزة الليزر
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              تتبع حي لحالة غرف الليزر، أجنحة الهيدرافيشل، وعيادات الحقن عبر جميع الفروع لمنع تضارب الحجوزات ورفع كفاءة استغلال الأجهزة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-bold px-3 py-1.5 rounded-2xl">
              🟢 7 غرف وأجهزة نشطة
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Scheduler Component */}
      <RoomMachineScheduler />
    </div>
  );
}
