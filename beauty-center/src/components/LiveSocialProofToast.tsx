// ==========================================
// src/components/LiveSocialProofToast.tsx
// إشعار الأنشطة والحجوزات الحية لإثبات الثقة
// ==========================================

import { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, MapPin, X } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import {
  getStoredBookings,
  subscribeToRealtimeBookings,
  RealBookingRecord,
} from "@/services/realtimeBookingService";

const fallbackBookingsAr = [
  { name: "سارة م.", service: "فراكشنال ليزر وتجديد نضارة", branch: "فرع مصر الجديدة", time: "منذ دقيقتين" },
  { name: "نورهان س.", service: "جلسة إزالة الشعر بالليزر كانديلا", branch: "فرع الدقي", time: "منذ 5 دقائق" },
  { name: "مي أ.", service: "حقن بوتوكس وتجاعيد الجبهة", branch: "فرع شيراتون", time: "منذ 9 دقائق" },
  { name: "ياسمين خ.", service: "تنظيف بشرة هيدرافيشل 12 خطوة", branch: "فرع 6 أكتوبر", time: "منذ 14 دقيقة" },
  { name: "هدى م.", service: "جلسة نحت القوام وتنسيق الدهون", branch: "فرع الدقي", time: "منذ 18 دقيقة" },
];

const fallbackBookingsEn = [
  { name: "Sara M.", service: "Fractional Laser Skin Rejuvenation", branch: "Heliopolis Branch", time: "2 mins ago" },
  { name: "Nourhan S.", service: "Candela Laser Hair Removal", branch: "Dokki Branch", time: "5 mins ago" },
  { name: "Mai A.", service: "Botox & Expression Lines", branch: "Sheraton Branch", time: "9 mins ago" },
  { name: "Yasmine K.", service: "Royal 12-Step Hydrafacial", branch: "6th October Branch", time: "14 mins ago" },
  { name: "Hoda M.", service: "Body Contouring & Slimming", branch: "Dokki Branch", time: "18 mins ago" },
];

function maskName(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1].charAt(0)}.`;
}

export function LiveSocialProofToast() {
  const { locale } = useLocale();
  const [current, setCurrent] = useState<{
    name: string;
    service: string;
    branch: string;
    time: string;
  } | null>(null);
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (closed) return;

    // Only subscribe and show toast when a verified real booking occurs
    const unsubscribe = subscribeToRealtimeBookings((booking) => {
      setCurrent({
        name: maskName(booking.customerName),
        service: booking.serviceName,
        branch: booking.branchName,
        time: locale === "ar" ? "الآن 🌸" : "Just now 🌸",
      });
      setVisible(true);
      setTimeout(() => setVisible(false), 6000);
    });

    return () => {
      unsubscribe();
    };
  }, [closed, locale]);

  if (!visible || !current || closed) return null;

  return (
    <div
      className={`fixed bottom-20 md:bottom-6 z-40 transition-all duration-500 ease-out transform ${
        visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-6 opacity-0 scale-95"
      } ${locale === "ar" ? "right-4 md:right-6" : "left-4 md:left-6"}`}
    >
      <div className="flex items-center gap-3 rounded-2xl border border-primary/25 bg-card/95 p-3.5 shadow-2xl backdrop-blur-xl max-w-sm text-xs">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
          <Sparkles className="h-5 w-5 animate-pulse text-primary" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>

        <div className="space-y-0.5 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="font-bold text-foreground truncate">
              {current.name} {locale === "ar" ? "حجزت للتو" : "just booked"}
            </span>
            <span className="text-[10px] text-muted-foreground shrink-0">{current.time}</span>
          </div>

          <p className="text-[11px] font-medium text-primary truncate">{current.service}</p>

          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <MapPin className="h-2.5 w-2.5 text-primary shrink-0" />
            <span className="truncate">{current.branch}</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
              <CheckCircle2 className="h-2.5 w-2.5" />
              {locale === "ar" ? "حجز مؤكد" : "Verified"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setClosed(true)}
          className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
          title={locale === "ar" ? "إغلاق" : "Close"}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
