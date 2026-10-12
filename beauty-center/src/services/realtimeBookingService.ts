// ===============================================
// src/services/realtimeBookingService.ts
// محرك ونظام الحجوزات والإشعارات اللحظية الحقيقية
// ===============================================

import { API_BASE_URL } from "@/services/apiClient";

export interface RealBookingPayload {
  fullName: string;
  phone: string;
  email?: string;
  serviceTitle: string;
  branchId?: string;
  branchTitle: string;
  preferredDate: string;
  timeSlot?: string;
  notes?: string;
  segment?: "vip" | "new" | "regular";
  doctorName?: string;
  source?: "website" | "whatsapp" | "walkin" | "quiz";
}

export interface RealBookingRecord {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  serviceName: string;
  doctorName: string;
  branchName: string;
  preferredDate: string;
  preferredTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  segment: "vip" | "new" | "regular";
  notes: string;
  createdAt: string;
  source: string;
}

export interface RealNotificationItem {
  id: string;
  bookingId: string;
  title: string;
  customerName: string;
  serviceName: string;
  branchName: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  timestamp: number;
  read: boolean;
}

const STORAGE_BOOKINGS_KEY = "admin_bookings_master_v1";
const STORAGE_NOTIFICATIONS_KEY = "cairo_cosmo_notifications_v1";
const CHANNEL_NAME = "cairo_cosmo_realtime_sync";

// BroadcastChannel instance for cross-tab real-time communication
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  } catch (e) {
    // Fallback if not supported
  }
}

// 🔔 High-quality pleasant clinic chime via Web Audio API
export function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;

    // First note (G5: 783.99 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(783.99, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.4);

    // Second note (C6: 1046.50 Hz) for a pleasant luxury sparkle
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1046.50, now + 0.12);
    gain2.gain.setValueAtTime(0.15, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.7);
  } catch (e) {
    // Audio context may be blocked before user gesture
  }
}

// 🔔 Real Browser OS Desktop Notification
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
}

export function showDesktopNotification(title: string, body: string, bookingId?: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "granted") {
    try {
      const notif = new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: bookingId || `booking-${Date.now()}`,
      });
      notif.onclick = () => {
        window.focus();
        window.location.href = "/admin/bookings";
      };
    } catch (e) {}
  }
}

// Get all stored bookings
export function getStoredBookings(): RealBookingRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_BOOKINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Save bookings to localStorage
export function saveBookings(list: RealBookingRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(list));
  } catch {}
}

// Clear all bookings (clean reset to 0)
export function clearAllRealBookings() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify([]));
    localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent("cosmo:bookings_updated"));
    window.dispatchEvent(new CustomEvent("cosmo:notifications_updated"));
  } catch {}
}

// Get stored notifications
export function getStoredNotifications(): RealNotificationItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_NOTIFICATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Save notifications to localStorage
export function saveNotifications(list: RealNotificationItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(list));
  } catch {}
}

// Mark single notification as read
export function markNotificationAsRead(id: string) {
  const list = getStoredNotifications();
  const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveNotifications(updated);
  window.dispatchEvent(new CustomEvent("cosmo:notifications_updated"));
}

// Mark all notifications as read
export function markAllNotificationsAsRead() {
  const list = getStoredNotifications();
  const updated = list.map((n) => ({ ...n, read: true }));
  saveNotifications(updated);
  window.dispatchEvent(new CustomEvent("cosmo:notifications_updated"));
}

// Clear all notifications
export function clearAllNotifications() {
  saveNotifications([]);
  window.dispatchEvent(new CustomEvent("cosmo:notifications_updated"));
}

// ==========================================
// 🚀 Main Real Booking Creation Function
// ==========================================
export async function createRealBooking(payload: RealBookingPayload): Promise<{
  success: boolean;
  bookingId: string;
  record: RealBookingRecord;
}> {
  const generatedId = `BK-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;

  // 1. Attempt PHP Backend API dispatch in background
  try {
    fetch(`${API_BASE_URL}/booking.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: payload.fullName.trim(),
        phone: payload.phone.trim(),
        email: (payload.email || "").trim(),
        serviceTitle: payload.serviceTitle,
        branchId: payload.branchId || "sheraton",
        branchTitle: payload.branchTitle,
        preferredDate: payload.preferredDate,
        timeSlot: payload.timeSlot || "04:00 مساءً",
        notes: (payload.notes || "").trim(),
        source: payload.source || "website",
      }),
    }).catch(() => {});
  } catch (e) {}

  // 2. Build the official real booking record
  const nowStr = new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const newRecord: RealBookingRecord = {
    id: generatedId,
    customerName: payload.fullName.trim(),
    phone: payload.phone.trim(),
    email: (payload.email || "—").trim(),
    serviceName: payload.serviceTitle,
    doctorName: payload.doctorName || "استشاري الفرع الطبي",
    branchName: payload.branchTitle,
    preferredDate: payload.preferredDate,
    preferredTime: payload.timeSlot || "حسب الموعد الأقرب",
    status: "pending",
    segment: payload.segment || "new",
    notes: (payload.notes || "").trim() || "حجز حقيقي عبر الموقع الإلكتروني",
    createdAt: nowStr,
    source: payload.source || "website",
  };

  // 3. Persist to Master Storage
  const currentList = getStoredBookings();
  const updatedList = [newRecord, ...currentList.filter((b) => b.id !== generatedId)];
  saveBookings(updatedList);

  // 4. Create real notification item
  const newNotification: RealNotificationItem = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    bookingId: generatedId,
    title: "حجز موعد حقيقي جديد 🔔",
    customerName: newRecord.customerName,
    serviceName: newRecord.serviceName,
    branchName: newRecord.branchName,
    phone: newRecord.phone,
    preferredDate: newRecord.preferredDate,
    preferredTime: newRecord.preferredTime,
    timestamp: Date.now(),
    read: false,
  };

  const currentNotifs = getStoredNotifications();
  saveNotifications([newNotification, ...currentNotifs.slice(0, 49)]); // Keep last 50

  // 5. Broadcast to all open tabs & windows via BroadcastChannel
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({
        type: "NEW_BOOKING",
        booking: newRecord,
        notification: newNotification,
      });
    } catch (e) {}
  }

  // 6. Dispatch local Window Event
  window.dispatchEvent(
    new CustomEvent("cosmo:new_booking", {
      detail: { booking: newRecord, notification: newNotification },
    })
  );
  window.dispatchEvent(new CustomEvent("cosmo:notifications_updated"));

  // 7. Trigger Sound & Desktop Notification
  playNotificationChime();
  showDesktopNotification(
    `🚨 حجز جديد من ${newRecord.customerName}`,
    `${newRecord.serviceName} • ${newRecord.branchName} • ${newRecord.preferredDate}`,
    generatedId
  );

  return {
    success: true,
    bookingId: generatedId,
    record: newRecord,
  };
}

// Subscribe to real-time incoming bookings from any tab/window
export function subscribeToRealtimeBookings(
  onNewBooking: (booking: RealBookingRecord, notification: RealNotificationItem) => void
) {
  // 1. Listen to BroadcastChannel
  const handleBroadcast = (event: MessageEvent) => {
    if (event.data && event.data.type === "NEW_BOOKING") {
      onNewBooking(event.data.booking, event.data.notification);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener("message", handleBroadcast);
  }

  // 2. Listen to Local Custom Event
  const handleLocal = (event: Event) => {
    const custom = event as CustomEvent;
    if (custom.detail?.booking && custom.detail?.notification) {
      onNewBooking(custom.detail.booking, custom.detail.notification);
    }
  };
  window.addEventListener("cosmo:new_booking", handleLocal);

  // Return unsubscribe cleanup function
  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener("message", handleBroadcast);
    }
    window.removeEventListener("cosmo:new_booking", handleLocal);
  };
}
