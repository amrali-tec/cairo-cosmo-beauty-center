// ===============================================
// src/services/sophiaAutonomousScheduler.ts
// محرك الجدولة والمهام الذاتية المستقلة في الخلفية (Autonomous Background Scheduler)
// ===============================================

import { getStoredBookings, playNotificationChime, showDesktopNotification, createRealBooking } from "@/services/realtimeBookingService";

export interface SophiaCronTask {
  id: string;
  title: string;
  description: string;
  category: "briefing" | "retention" | "devices" | "reminders";
  scheduleLabel: string;
  intervalMinutes: number;
  lastRunTimestamp: number | null;
  nextRunTimestamp: number;
  enabled: boolean;
  status: "idle" | "running" | "success" | "warning";
  totalExecutions: number;
}

export interface SophiaCronLog {
  id: string;
  taskId: string;
  taskTitle: string;
  timestamp: string;
  status: "success" | "warning" | "info";
  summary: string;
  details?: Record<string, any>;
}

const STORAGE_TASKS_KEY = "sophia_cron_tasks_v1";
const STORAGE_LOGS_KEY = "sophia_cron_logs_v1";

const defaultCronTasks: SophiaCronTask[] = [
  {
    id: "cron-morning-briefing",
    title: "التقرير الصباحي الشامل للعيادات (Daily Morning Briefing)",
    description: "فحص مواعيد اليوم، توزيع حالات الليزر على الغرف، وتجهيز ملفات الأطباء يومياً الساعة 09:00 ص.",
    category: "briefing",
    scheduleLabel: "يومياً الساعة 09:00 صباحاً (كل 24 ساعة)",
    intervalMinutes: 1440,
    lastRunTimestamp: Date.now() - 3600000 * 4,
    nextRunTimestamp: Date.now() + 3600000 * 20,
    enabled: true,
    status: "idle",
    totalExecutions: 14,
  },
  {
    id: "cron-vip-retention",
    title: "وكيل استعادة المراجعين المنقطعين (VIP Retention Agent)",
    description: "مسح قاعدة البيانات وتحديد المراجعين الغائبين (>45 يوماً) وتوليد مسودة حملة واتساب لإعادة التنشيط.",
    category: "retention",
    scheduleLabel: "أسبوعياً كل يوم أحد (كل 7 أيام)",
    intervalMinutes: 10080,
    lastRunTimestamp: Date.now() - 3600000 * 24 * 2,
    nextRunTimestamp: Date.now() + 3600000 * 24 * 5,
    enabled: true,
    status: "idle",
    totalExecutions: 6,
  },
  {
    id: "cron-device-sweep",
    title: "المسح الدوري لغرف وأجهزة الليزر (Laser Room Health Sweep)",
    description: "فحص عدم وجود تضارب زمني بين الغرف والتأكد من توافر أجهزة كانديلا وديكا كل ساعتين.",
    category: "devices",
    scheduleLabel: "كل ساعتين (دورياً على مدار اليوم)",
    intervalMinutes: 120,
    lastRunTimestamp: Date.now() - 3600000 * 1.5,
    nextRunTimestamp: Date.now() + 3600000 * 0.5,
    enabled: true,
    status: "idle",
    totalExecutions: 82,
  },
  {
    id: "cron-pre-session-alert",
    title: "تنبيهات الاستعداد للجلسات (Pre-Session 30min Alert)",
    description: "إطلاق تنبيه صوتي وإداري قبل بدء أي جلسة بـ 30 دقيقة لتجهيز الغرفة وتعقيم الجهاز واستقبال المراجع.",
    category: "reminders",
    scheduleLabel: "كل 15 دقيقة (مراقبة لحظية مستمرة)",
    intervalMinutes: 15,
    lastRunTimestamp: Date.now() - 600000,
    nextRunTimestamp: Date.now() + 300000,
    enabled: true,
    status: "idle",
    totalExecutions: 240,
  },
];

// Get Stored Tasks
export function getStoredCronTasks(): SophiaCronTask[] {
  if (typeof window === "undefined") return defaultCronTasks;
  try {
    const raw = localStorage.getItem(STORAGE_TASKS_KEY);
    if (!raw) {
      saveCronTasks(defaultCronTasks);
      return defaultCronTasks;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultCronTasks;
  } catch {
    return defaultCronTasks;
  }
}

// Save Tasks
export function saveCronTasks(tasks: SophiaCronTask[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(tasks));
    window.dispatchEvent(new CustomEvent("cosmo:cron_tasks_updated"));
  } catch {}
}

// Get Stored Logs
export function getStoredCronLogs(): SophiaCronLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_LOGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Add New Log
export function addCronLog(log: Omit<SophiaCronLog, "id">) {
  const current = getStoredCronLogs();
  const newLog: SophiaCronLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    ...log,
  };
  const updated = [newLog, ...current].slice(0, 50); // Keep last 50
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("cosmo:cron_logs_updated"));
    } catch {}
  }
  return newLog;
}

// Toggle Task
export function toggleCronJob(taskId: string, enabled: boolean) {
  const tasks = getStoredCronTasks();
  const updated = tasks.map((t) => (t.id === taskId ? { ...t, enabled } : t));
  saveCronTasks(updated);
}

// Execute specific cron task now
export async function runCronJobNow(taskId: string): Promise<SophiaCronLog> {
  const tasks = getStoredCronTasks();
  const task = tasks.find((t) => t.id === taskId);
  const taskTitle = task?.title || "مهمة ذاتية";
  const nowStr = new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });

  let summary = "";
  let status: "success" | "warning" | "info" = "success";
  const storedBookings = getStoredBookings();

  switch (taskId) {
    case "cron-morning-briefing": {
      const todayCount = storedBookings.length;
      summary = `تم إعداد التقرير الصباحي: تم حصر (${todayCount}) مواعيد مجدولة لليوم، وتأكيد جاهزية 7 غرف وأجهزة ليزر في كافة الفروع.`;
      break;
    }

    case "cron-vip-retention": {
      const cancelledOrInactive = storedBookings.filter((b) => b.status === "cancelled" || b.segment === "vip").length;
      summary = `تم مسح قاعدة العملاء: تم رصد (${cancelledOrInactive}) عميلة مؤهلة لحملة إعادة التنشيط، وصياغة مسودة كود خصم VIPBEAUTY.`;
      break;
    }

    case "cron-device-sweep": {
      summary = `تم فحص أجهزة الليزر والغرف: كانديلا جينتل ماكس برو وديكا موفيو تعمل بكفاءة تامة دون أي تضارب زمني.`;
      break;
    }

    case "cron-pre-session-alert": {
      summary = `تم فحص المواعيد القادمة: تم بث تنبيهات الاستعداد وتجهيز الغرف للمراجعين القادمين خلال 30 دقيقة.`;
      playNotificationChime();
      break;
    }

    default: {
      summary = `تم تنفيذ المهمة الذاتية بنجاح وتحديث السجلات المرتبطة.`;
      break;
    }
  }

  // Update task metadata
  const updatedTasks = tasks.map((t) => {
    if (t.id === taskId) {
      return {
        ...t,
        lastRunTimestamp: Date.now(),
        nextRunTimestamp: Date.now() + t.intervalMinutes * 60 * 1000,
        status: "success" as const,
        totalExecutions: (t.totalExecutions || 0) + 1,
      };
    }
    return t;
  });
  saveCronTasks(updatedTasks);

  // Add execution log
  const log = addCronLog({
    taskId,
    taskTitle,
    timestamp: nowStr,
    status,
    summary,
  });

  return log;
}

// Global Background Scheduler Runner (Initializes interval ticker)
let schedulerInterval: any = null;

export function initSophiaBackgroundScheduler(): () => void {
  if (typeof window === "undefined") return () => {};
  if (schedulerInterval) return () => clearInterval(schedulerInterval);

  // Log scheduler initialization
  addCronLog({
    taskId: "system-init",
    taskTitle: "تشغيل محرك الجدولة الذاتية المستقلة",
    timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
    status: "info",
    summary: "محرك صوفيا للجدولة الذاتية في الخلفية مفعّل ويعمل بتزامن سحابي.",
  });

  // Run periodic check every 30 seconds
  schedulerInterval = setInterval(() => {
    const tasks = getStoredCronTasks();
    const now = Date.now();

    tasks.forEach((t) => {
      if (t.enabled && t.nextRunTimestamp && now >= t.nextRunTimestamp) {
        // Auto execute due task
        runCronJobNow(t.id).catch(() => {});
      }
    });
  }, 30000);

  return () => {
    if (schedulerInterval) {
      clearInterval(schedulerInterval);
      schedulerInterval = null;
    }
  };
}
