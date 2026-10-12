import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { loginAdmin, logoutAdmin, refreshAdmin } from "@/services/authService";
import { clearAdminSession, getAdminSession, setAdminSession, type AdminSession } from "@/services/authStorage";

type AdminAuthContextValue = {
  session: AdminSession | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const existing = getAdminSession();

    if (!existing) {
      setLoading(false);
      return;
    }

    void (async () => {
      try {
        const refreshed = await refreshAdmin(existing.refreshToken);
        if (active) {
          setAdminSession(refreshed);
          setSessionState(refreshed);
        }
      } catch {
        clearAdminSession();
        if (active) {
          setSessionState(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handler = () => {
      clearAdminSession();
      setSessionState(null);
    };

    window.addEventListener("auth:unauthorized", handler as EventListener);
    return () => {
      window.removeEventListener("auth:unauthorized", handler as EventListener);
    };
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      session,
      loading,
      isAuthenticated: Boolean(session?.token),
      async login(email: string, password: string) {
        const nextSession = await loginAdmin(email, password);
        setAdminSession(nextSession);
        setSessionState(nextSession);
      },
      async logout() {
        const current = getAdminSession();
        try {
          if (current) {
            await logoutAdmin(current.refreshToken, current.token);
          }
        } catch {
        } finally {
          clearAdminSession();
          setSessionState(null);
        }
      },
    }),
    [loading, session],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
