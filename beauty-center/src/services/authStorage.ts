export type AdminSession = {
  token: string;
  refreshToken: string;
  admin: {
    id: number;
    name: string;
    role: string;
  };
};

const STORAGE_KEY = "admin_auth_session";

export function getAdminSession(): AdminSession | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function setAdminSession(session: AdminSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  localStorage.setItem("admin_token", session.token);
  localStorage.setItem("admin_refresh_token", session.refreshToken);
}

export function clearAdminSession() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_refresh_token");
}
