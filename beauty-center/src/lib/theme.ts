export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

export function getStoredTheme(): ThemeMode {
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === "light" || v === "dark" || v === "system") return v;
  return "system";
}

export function getSystemTheme(): "light" | "dark" {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(mode: ThemeMode) {
  const resolved = mode === "system" ? getSystemTheme() : mode;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.dataset.theme = mode; // مفيد لو حبيت تعرض الحالة
}

export function setTheme(mode: ThemeMode) {
  localStorage.setItem(STORAGE_KEY, mode);
  applyTheme(mode);
}

export function initTheme() {
  const mode = getStoredTheme();
  applyTheme(mode);

  // لو المستخدم مختار System، تابع تغييرات النظام live
  const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
  const handler = () => {
    if (getStoredTheme() === "system") applyTheme("system");
  };

  mq?.addEventListener?.("change", handler);
  return () => mq?.removeEventListener?.("change", handler);
}
