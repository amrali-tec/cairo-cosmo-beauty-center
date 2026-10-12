// ===============================================
// src/components/admin/RealNotificationBell.tsx
// جرس وقائمة الإشعارات الحقيقية في لوحة الإدارة
// ===============================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Trash2,
  Calendar,
  Phone,
  MapPin,
  Stethoscope,
  Clock,
  Sparkles,
  Volume2,
  Monitor,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getStoredNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
  requestNotificationPermission,
  playNotificationChime,
  subscribeToRealtimeBookings,
  RealNotificationItem,
} from "@/services/realtimeBookingService";
import { useToast } from "@/hooks/use-toast";

export function RealNotificationBell() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<RealNotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission === "granted"
      : false
  );

  const loadNotifs = () => {
    setNotifications(getStoredNotifications());
  };

  useEffect(() => {
    loadNotifs();

    // Listen to updates
    const handleUpdate = () => loadNotifs();
    window.addEventListener("cosmo:notifications_updated", handleUpdate);

    // Subscribe to incoming realtime bookings
    const unsubscribe = subscribeToRealtimeBookings((booking, notif) => {
      loadNotifs();
      toast({
        title: "🔔 حجز جديد وارد الآن!",
        description: `${booking.customerName} • ${booking.serviceName} (${booking.branchName})`,
      });
    });

    return () => {
      window.removeEventListener("cosmo:notifications_updated", handleUpdate);
      unsubscribe();
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setHasPermission(granted);
    if (granted) {
      toast({
        title: "تم تفعيل إشعارات سطح المكتب 🖥️",
        description: "ستصلك الآن تنبيهات الحجوزات حتى لو كانت النافذة مصغرة.",
      });
      playNotificationChime();
    } else {
      toast({
        title: "لم يتم منح الصلاحية",
        description: "يرجى السماح بالإشعارات من إعدادات المتصفح.",
        variant: "destructive",
      });
    }
  };

  const timeAgo = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return "الآن";
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    return `منذ ${Math.floor(diff / 86400)} يوم`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-10 w-10 rounded-2xl border-border/80 bg-background/80 hover:bg-card shadow-xs transition-all"
        >
          <Bell className={`h-5 w-5 ${unreadCount > 0 ? "text-primary animate-bounce" : "text-muted-foreground"}`} />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black text-primary-foreground shadow-md ring-2 ring-background">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 rounded-3xl p-0 border border-border/80 bg-card/95 shadow-2xl backdrop-blur-xl z-50 text-right"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-foreground">مركز الإشعارات الحية</h4>
              <p className="text-[10px] text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} إشعار جديد غير مقروء` : "لا توجد إشعارات جديدة"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllNotificationsAsRead}
                className="h-7 px-2 text-[10px] rounded-lg text-primary hover:bg-primary/10 gap-1"
                title="تحديد الكل كمقروء"
              >
                <CheckCheck className="h-3 w-3" />
                <span>قراءة الكل</span>
              </Button>
            )}

            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                title="مسح الكل"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Desktop Notification Banner if not granted */}
        {!hasPermission && (
          <div className="bg-primary/5 border-b border-primary/15 p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[11px] text-foreground font-medium">
              <Monitor className="h-4 w-4 text-primary shrink-0" />
              <span>تفعيل تنبيهات سطح المكتب للحجوزات</span>
            </div>
            <Button
              size="sm"
              onClick={handleRequestPermission}
              className="h-6 text-[10px] px-2 rounded-lg font-bold"
            >
              تفعيل
            </Button>
          </div>
        )}

        {/* Notification List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/40 p-2 space-y-1">
          {notifications.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground space-y-2">
              <Bell className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="text-xs font-semibold">صندوق الإشعارات فارغ حالياً</p>
              <p className="text-[10px]">ستظهر هنا أي حجوزات حقيقية جديدة فور تقديمها من العملاء</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`rounded-2xl p-3 text-xs transition-all cursor-pointer ${
                  n.read
                    ? "bg-transparent opacity-75 hover:bg-muted/40"
                    : "bg-primary/5 border border-primary/20 shadow-xs hover:bg-primary/10"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    <span className="font-black text-foreground text-xs">{n.customerName}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(n.timestamp)}</span>
                </div>

                <div className="mt-1 space-y-0.5 text-muted-foreground text-[11px]">
                  <div className="font-medium text-primary truncate">🩺 {n.serviceName}</div>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5 text-primary" /> {n.branchName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5 text-primary" /> {n.preferredDate}
                    </span>
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-border/30 flex items-center justify-between text-[10px]">
                  <span className="font-mono text-muted-foreground" dir="ltr">{n.phone}</span>
                  <span className="text-primary font-bold flex items-center gap-0.5">
                    عرض الحجز
                    <ChevronLeft className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border/60 p-3 bg-muted/20 flex items-center justify-between text-xs">
          <Link
            to="/admin/bookings"
            onClick={() => setIsOpen(false)}
            className="font-bold text-primary hover:underline text-[11px] flex items-center gap-1"
          >
            <span>عرض كل الحجوزات في CRM</span>
            <ChevronLeft className="h-3 w-3" />
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => playNotificationChime()}
            className="h-6 text-[10px] px-2 rounded-lg text-muted-foreground gap-1 hover:text-foreground"
            title="تجربة صوت الرنين"
          >
            <Volume2 className="h-3 w-3 text-primary" />
            <span>صوت الرنين</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
