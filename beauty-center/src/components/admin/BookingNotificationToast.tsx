// ===============================================
// src/components/admin/BookingNotificationToast.tsx
// منبثقة إشعار الحجز الحقيقي اللحظي
// ===============================================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, X, Calendar, CheckCircle2, MapPin, Stethoscope, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  subscribeToRealtimeBookings,
  RealBookingRecord,
  RealNotificationItem,
} from "@/services/realtimeBookingService";

export function BookingNotificationToast() {
  const [activeNotice, setActiveNotice] = useState<{
    booking: RealBookingRecord;
    notification: RealNotificationItem;
  } | null>(null);

  useEffect(() => {
    // Listen for genuine real-time bookings across tabs and local events
    const unsubscribe = subscribeToRealtimeBookings((booking, notification) => {
      setActiveNotice({ booking, notification });

      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setActiveNotice(null);
      }, 8500);

      return () => clearTimeout(timer);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!activeNotice) return null;

  const { booking } = activeNotice;

  return (
    <div
      dir="rtl"
      className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 duration-300 max-w-sm"
    >
      <div className="rounded-3xl border border-primary/40 bg-card/95 backdrop-blur-xl p-4 shadow-2xl space-y-2 ring-2 ring-primary/20">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary font-bold">
              <Bell className="h-5 w-5 text-primary animate-bounce" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-primary">
                <span>حجز موعد حقيقي وارد 🔔</span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded-md">
                  مباشر
                </span>
              </div>
              <p className="font-bold text-sm text-foreground">{booking.customerName}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveNotice(null)}
            className="h-6 w-6 p-0 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="rounded-2xl bg-muted/40 p-2.5 space-y-1 text-xs text-muted-foreground">
          <div className="font-medium text-foreground flex items-center gap-1.5 truncate">
            <Stethoscope className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{booking.serviceName}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-primary" /> {booking.branchName}
            </span>
            <span className="flex items-center gap-1 font-bold text-primary">
              <Calendar className="h-3 w-3" /> {booking.preferredDate}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-mono text-muted-foreground" dir="ltr">
            {booking.phone}
          </span>
          <Link
            to="/admin/bookings"
            onClick={() => setActiveNotice(null)}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
          >
            <span>فتح السجل في CRM</span>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
