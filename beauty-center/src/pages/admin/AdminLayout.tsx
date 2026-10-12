// ===============================
// src/pages/admin/AdminLayout.tsx
// ===============================
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Stethoscope,
  BriefcaseMedical,
  BadgePercent,
  MessageSquareQuote,
  Users,
  LogOut,
  Menu,
  ChevronLeft,
  UserCheck,
  Globe,
  ShieldCheck,
  Calendar,
  TrendingUp,
  Zap,
  Send,
  Bot,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAdminAuth } from "@/lib/admin-auth";
import { AdminSecurityModal } from "@/components/admin/AdminSecurityModal";
import { RealNotificationBell } from "@/components/admin/RealNotificationBell";
import { SophiaCopilotDrawer } from "@/components/admin/SophiaCopilotDrawer";
import { SystemDiagnosticModal } from "@/components/admin/SystemDiagnosticModal";
import { initSophiaBackgroundScheduler } from "@/services/sophiaAutonomousScheduler";

const navItems = [
  {
    label: "لوحة التحكم",
    href: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "صوفيا AI (المساعد الذكي)",
    href: "/admin/sophia",
    icon: Bot,
    badge: "SOPHIA 🌟",
  },
  {
    label: "التحليلات الحية والتقارير",
    href: "/admin/analytics",
    icon: TrendingUp,
    badge: "مباشر 🟢",
  },
  {
    label: "سجل الحجوزات والعملاء",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    label: "جدولة الغرف والأجهزة",
    href: "/admin/rooms-schedule",
    icon: Zap,
    badge: "كانديلا ⚡",
  },
  {
    label: "الحملات والتسويق",
    href: "/admin/campaigns",
    icon: Send,
    badge: "واتساب 📢",
  },
  {
    label: "إدارة العملاء (CRM)",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "إدارة الفريق والصلاحيات",
    href: "/admin/team",
    icon: ShieldCheck,
  },
  {
    label: "المقالات والأخبار",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    label: "الفريق الطبي",
    href: "/admin/doctors",
    icon: Stethoscope,
  },
  {
    label: "الخدمات الطبية",
    href: "/admin/services",
    icon: BriefcaseMedical,
  },
  {
    label: "العروض والباقات",
    href: "/admin/offers",
    icon: BadgePercent,
  },
  {
    label: "آراء المراجعين",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
];

function getPageMeta(pathname: string) {
  if (pathname === "/admin" || pathname === "/admin/") {
    return {
      title: "لوحة التحكم الرئيسية",
      subtitle: "نظرة عامة على إحصائيات العيادة والنشاط الحجمي للمراجعين",
      breadcrumb: ["الرئيسية"],
    };
  }
  if (pathname.startsWith("/admin/sophia")) {
    return {
      title: "صوفيا AI • مركز العمليات والذكاء الاصطناعي",
      subtitle: "المساعد الذكي لإدارة وتشغيل العيادات وتنفيذ المهام التلقائية وتحليل الأداء",
      breadcrumb: ["الرئيسية", "صوفيا AI"],
    };
  }
  if (pathname.startsWith("/admin/analytics")) {
    return {
      title: "التحليلات الحية والتقارير التنفيذية",
      subtitle: "متابعة النبض اللحظي والإيرادات ومعدلات الإشغال وأداء العيادات",
      breadcrumb: ["الرئيسية", "التحليلات الحية والـ BI"],
    };
  }
  if (pathname.startsWith("/admin/rooms-schedule")) {
    return {
      title: "جدولة غرف وأجهزة العيادة الطبية",
      subtitle: "تتبع إشغال أجهزة الليزر وأجنحة الهيدرافيشل ومنع تضارب المواعيد",
      breadcrumb: ["الرئيسية", "جدولة الغرف والأجهزة"],
    };
  }
  if (pathname.startsWith("/admin/campaigns")) {
    return {
      title: "منصة الحملات التسويقية والواتساب",
      subtitle: "استهداف شرائح العملاء وإرسال العروض الترويجية الجماعية",
      breadcrumb: ["الرئيسية", "الحملات والتسويق"],
    };
  }
  if (pathname.startsWith("/admin/customers/")) {
    return {
      title: "ملف العميل وسجل الحجوزات",
      subtitle: "استعراض التاريخ الطبي والملاحظات وتفاصيل التواصل مع العميل",
      breadcrumb: ["إدارة العملاء", "ملف العميل"],
    };
  }
  if (pathname.startsWith("/admin/customers")) {
    return {
      title: "إدارة العملاء والشرائح (CRM)",
      subtitle: "عرض وتصنيف قاعدة بيانات العملاء حسب شرائح التفاعل والنشاط",
      breadcrumb: ["إدارة العملاء"],
    };
  }
  if (pathname.startsWith("/admin/team")) {
    return {
      title: "إدارة أعضاء الفريق والصلاحيات",
      subtitle: "إضافة وتحديث أفراد العمل وتحديد حدود الاطلاع والمصفوفة الأمنية لكل فرع",
      breadcrumb: ["إدارة الفريق والصلاحيات"],
    };
  }
  if (pathname.startsWith("/admin/blog")) {
    return {
      title: "إدارة المقالات والأخبار",
      subtitle: "نشر وتحرير النصائح والمقالات الطبية والتجميلية الموجهة للمراجعين",
      breadcrumb: ["المقالات والأخبار"],
    };
  }
  if (pathname.startsWith("/admin/doctors")) {
    return {
      title: "إدارة الأطباء والفريق الطبي",
      subtitle: "إضافة وتعديل بيانات الاستشاريين والتخصصات والخبرات الطبية",
      breadcrumb: ["الفريق الطبي"],
    };
  }
  if (pathname.startsWith("/admin/services")) {
    return {
      title: "إدارة الخدمات والأنشطة الطبية",
      subtitle: "عرض وتحديث خدمات الجلدية والجراحة والتجميل غير الجراحي",
      breadcrumb: ["الخدمات الطبية"],
    };
  }
  if (pathname.startsWith("/admin/offers")) {
    return {
      title: "إدارة العروض والباقات الترويجية",
      subtitle: "تخصيص وتعديل الباقات الموسمية وخصومات الخدمات",
      breadcrumb: ["العروض والباقات"],
    };
  }
  if (pathname.startsWith("/admin/testimonials")) {
    return {
      title: "إدارة آراء وتقييمات العملاء",
      subtitle: "مراجعة واعتماد تجارب وتقييمات مراجعي العيادة",
      breadcrumb: ["آراء المراجعين"],
    };
  }

  return {
    title: "لوحة إدارة الموقع",
    subtitle: "تحكم كامل بمحتوى الموقع والأنظمة الطبية الإدارية",
    breadcrumb: ["الإدارة"],
  };
}

export default function AdminLayout() {
  const { session, logout } = useAdminAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Initialize autonomous background cron scheduler for admin
  useEffect(() => {
    const cleanup = initSophiaBackgroundScheduler();
    return () => cleanup();
  }, []);

  const pageMeta = getPageMeta(location.pathname);
  const adminName = session?.user?.name || "مدير النظام";
  const adminEmail = session?.user?.email || "admin@cairocosmo.com";
  const adminRole = session?.user?.role || "admin";

  const renderNavLinks = (onItemClick?: () => void) => (
    <nav className="space-y-1 px-3 py-3">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.end}
            onClick={onItemClick}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 font-bold"
                  : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={cn("h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {"badge" in item && item.badge && (
                    <Badge variant={isActive ? "secondary" : "outline"} className={cn("text-[9px] px-1.5 py-0 h-4 border-none font-bold", isActive ? "bg-white/20 text-white" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400")}>
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronLeft className={cn("h-3.5 w-3.5 opacity-0 transition-opacity duration-200", isActive ? "opacity-100" : "group-hover:opacity-60")} />
                </div>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  const renderProfileFooter = () => (
    <div className="border-t border-border/70 p-3.5 space-y-2.5 bg-muted/30">
      <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card p-2.5 shadow-xs">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
          <UserCheck className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-xs font-bold text-foreground">{adminName}</p>
            <Badge variant="secondary" className="px-1 py-0 text-[9px] uppercase font-semibold">
              {adminRole}
            </Badge>
          </div>
          <p className="truncate text-[10px] text-muted-foreground">{adminEmail}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" asChild className="w-full text-[11px] h-8 rounded-xl">
          <Link to="/" target="_blank" rel="noreferrer">
            <Globe className="h-3 w-3 ml-1" />
            الموقع
          </Link>
        </Button>
        <Button variant="destructive" size="sm" onClick={() => void logout()} className="w-full text-[11px] h-8 rounded-xl">
          <LogOut className="h-3 w-3 ml-1" />
          خروج
        </Button>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground antialiased">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden xl:flex w-72 shrink-0 border-l border-border/80 bg-card/90 backdrop-blur-xl flex-col sticky top-0 h-screen z-40 overflow-hidden">
          {/* Fixed Top Header */}
          <div className="shrink-0 border-b border-border/70 p-5">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-[11px] font-bold tracking-widest uppercase">Cairo Cosmo CMS</span>
            </div>
            <h2 className="mt-1.5 text-xl font-black text-foreground">لوحة الإدارة</h2>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              نظام إدارة العيادات والمحتوى
            </p>
          </div>

          {/* Scrollable Middle Navigation */}
          <div className="flex-1 min-h-0 overflow-y-auto sidebar-scrollbar">
            {renderNavLinks()}
          </div>

          {/* Fixed Bottom Profile & Actions */}
          <div className="shrink-0">
            {renderProfileFooter()}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur-md shadow-xs">
            <div className="px-4 sm:px-8 2xl:px-12 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile Menu Drawer Trigger */}
                <div className="xl:hidden">
                  <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="h-10 w-10">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">افتح القائمة</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80 p-0 flex flex-col h-full overflow-hidden">
                      <SheetHeader className="shrink-0 p-5 text-right border-b border-border/70">
                        <div className="flex items-center gap-2 text-primary">
                          <ShieldCheck className="h-5 w-5" />
                          <span className="text-[11px] font-bold tracking-widest uppercase">Cairo Cosmo CMS</span>
                        </div>
                        <SheetTitle className="mt-1.5 text-xl font-black">القائمة الإدارية</SheetTitle>
                      </SheetHeader>

                      <div className="flex-1 min-h-0 overflow-y-auto sidebar-scrollbar">
                        {renderNavLinks(() => setMobileOpen(false))}
                      </div>

                      <div className="shrink-0">
                        {renderProfileFooter()}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <span>الرئيسية</span>
                    {pageMeta.breadcrumb.map((crumb, idx) => (
                      <span key={idx} className="flex items-center gap-2">
                        <span>/</span>
                        <span className={idx === pageMeta.breadcrumb.length - 1 ? "text-primary font-medium" : ""}>
                          {crumb}
                        </span>
                      </span>
                    ))}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">{pageMeta.title}</h1>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <SophiaCopilotDrawer />
                <SystemDiagnosticModal />
                <RealNotificationBell />
                <AdminSecurityModal />

                <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex rounded-xl">
                  <Link to="/" target="_blank" rel="noreferrer">
                    <Globe className="h-4 w-4 ml-1.5 text-primary" />
                    معاينة الموقع
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => void logout()} className="text-muted-foreground hover:text-destructive rounded-xl">
                  <LogOut className="h-4 w-4 ml-1.5" />
                  خروج
                </Button>
              </div>
            </div>
          </header>

          {/* Page Content with Smooth Transition */}
          <main className="flex-1 px-4 sm:px-8 2xl:px-12 py-8 w-full max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
