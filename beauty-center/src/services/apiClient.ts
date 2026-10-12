import { clearAdminSession, getAdminSession, setAdminSession, type AdminSession } from "@/services/authStorage";
import type { ApiEnvelope } from "@/types/api";

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");


function buildUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function emitUnauthorized() {
  clearAdminSession();
  window.dispatchEvent(new CustomEvent("auth:unauthorized"));
}

async function refreshSession(session: AdminSession): Promise<AdminSession | null> {
  const response = await fetch(buildUrl("/auth/refresh.php"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: session.refreshToken,
    }),
  });

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<AdminSession> | null;
  if (!response.ok || !payload?.success) {
    return null;
  }

  setAdminSession(payload.data);
  return payload.data;
}

export async function apiRequest<T>(path: string, init?: RequestInit, retry = true): Promise<T> {
  const session = getAdminSession();
  const token = session?.token || "";

  let response: Response;
  try {
    response = await fetch(buildUrl(path), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers || {}),
      },
    });
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "تعذر الاتصال بالخادم الرئيسي (API Server)");
  }

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (response.status === 401 && retry && session?.refreshToken) {
    const refreshed = await refreshSession(session);
    if (refreshed) {
      return apiRequest<T>(path, init, false);
    }
  }

  if (response.status === 401) {
    emitUnauthorized();
    throw new Error(payload?.message || "يرجى تسجيل الدخول أولاً للوصول إلى هذه الصفحة");
  }

  if (response.status === 404) {
    throw new Error("تعذر العثور على المسار المطلوب في خادم الـ API");
  }

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || `فشلت عملية طلب البيانات (${response.status})`);
  }

  return payload.data;
}

export async function apiPublicRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(buildUrl(path), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    });
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "تعذر الاتصال بالخادم الرئيسي (API Server)");
  }

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || `تعذر معالجة الطلب في السيرفر (كود: ${response.status})`);
  }

  return payload.data;
}

