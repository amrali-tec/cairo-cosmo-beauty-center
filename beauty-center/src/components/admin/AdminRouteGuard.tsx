import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/lib/admin-auth";

export default function AdminRouteGuard() {
  const { isAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-background text-muted-foreground"
        dir="rtl"
      >
        جاري التحقق من الجلسة...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
