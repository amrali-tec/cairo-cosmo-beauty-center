import { lazy, Suspense, useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { LocaleProvider } from "@/lib/locale-context";
import { defaultLocale, Locale, localeDirection } from "@/lib/i18n";
import { AdminAuthProvider } from "@/lib/admin-auth";
import { Layout } from "@/components/Layout";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Lazy-load Admin routes for high performance and reduced initial JS bundle
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const LiveAnalyticsPage = lazy(() => import("./pages/admin/LiveAnalyticsPage"));
const BlogAdmin = lazy(() => import("./pages/admin/BlogAdmin"));
const DoctorsAdmin = lazy(() => import("./pages/admin/DoctorsAdmin"));
const ServicesAdmin = lazy(() => import("./pages/admin/ServicesAdmin"));
const OffersAdmin = lazy(() => import("./pages/admin/OffersAdmin"));
const TestimonialsAdmin = lazy(() => import("./pages/admin/TestimonialsAdmin"));
const BookingsAdmin = lazy(() => import("./pages/admin/BookingsAdmin"));
const CustomerProfile = lazy(() => import("./pages/admin/customers/CustomerProfile"));
const CustomersList = lazy(() => import("./pages/admin/customers/CustomersList"));
const TeamManagementAdmin = lazy(() => import("./pages/admin/TeamManagementAdmin"));
const RoomsScheduleAdmin = lazy(() => import("./pages/admin/RoomsScheduleAdmin"));
const CampaignsAdmin = lazy(() => import("./pages/admin/CampaignsAdmin"));
const SophiaAgentPage = lazy(() => import("./pages/admin/SophiaAgentPage"));

// Eagerly import HomePage for zero-waterfall instant First Contentful Paint
import HomePage from "@/pages/HomePage";

// Lazy-load other Public Pages
const CalculatorPage = lazy(() => import("@/pages/CalculatorPage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const ServiceDetailPage = lazy(() => import("@/pages/ServiceDetailPage"));
const DoctorsPage = lazy(() => import("@/pages/DoctorsPage"));
const DoctorDetailPage = lazy(() => import("@/pages/DoctorDetailPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const BookingPage = lazy(() => import("@/pages/BookingPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const FAQPage = lazy(() => import("@/pages/FAQPage"));
const OffersPage = lazy(() => import("@/pages/OffersPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const DisclaimerPage = lazy(() => import("@/pages/DisclaimerPage"));
const CookiesPage = lazy(() => import("@/pages/CookiesPage"));

const queryClient = new QueryClient();

function LocaleLayout() {
  const params = useParams<{ locale?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLocale: Locale = useMemo(() => {
    const raw = params.locale;
    return raw === "ar" || raw === "en" ? raw : defaultLocale;
  }, [params.locale]);

  useEffect(() => {
    const dir = localeDirection[currentLocale];
    document.documentElement.lang = currentLocale;
    document.documentElement.dir = dir;

    document.documentElement.classList.toggle("rtl", dir === "rtl");
    document.documentElement.classList.toggle("ltr", dir === "ltr");
  }, [currentLocale]);

  const setLocaleAndSyncUrl = (next: Locale) => {
    const restPath = location.pathname.replace(/^\/(ar|en)(?=\/|$)/, "");
    navigate(`/${next}${restPath || ""}`, { replace: true });
  };

  return (
    <LocaleProvider locale={currentLocale} setLocale={setLocaleAndSyncUrl}>
      <Layout>
        <Outlet />
      </Layout>
    </LocaleProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <Suspense
              fallback={
                <div className="min-h-screen bg-background pt-32">
                  <div className="section-container">
                    <div className="mx-auto flex min-h-[40vh] max-w-2xl items-center justify-center rounded-[2rem] border border-primary/10 bg-card/70 px-6 text-center shadow-sm">
                      <div>
                        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-primary/15 border-t-primary" />
                        <p className="text-sm text-muted-foreground">
                          Loading Cairo Cosmo Center...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to={`/${defaultLocale}`} replace />}
                />

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route element={<AdminRouteGuard />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="sophia" element={<SophiaAgentPage />} />
                    <Route path="analytics" element={<LiveAnalyticsPage />} />
                    <Route path="bookings" element={<BookingsAdmin />} />
                    <Route path="rooms-schedule" element={<RoomsScheduleAdmin />} />
                    <Route path="campaigns" element={<CampaignsAdmin />} />
                    <Route path="blog" element={<BlogAdmin />} />
                    <Route path="doctors" element={<DoctorsAdmin />} />
                    <Route path="services" element={<ServicesAdmin />} />
                    <Route path="offers" element={<OffersAdmin />} />
                    <Route path="testimonials" element={<TestimonialsAdmin />} />
                    <Route path="customers" element={<CustomersList />} />
                    <Route path="customers/:id" element={<CustomerProfile />} />
                    <Route path="team" element={<TeamManagementAdmin />} />
                  </Route>
                </Route>

                <Route path="/:locale" element={<LocaleLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="calculator" element={<CalculatorPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="faq" element={<FAQPage />} />
                  <Route path="offers" element={<OffersPage />} />
                  <Route path="services" element={<ServicesPage />} />
                  <Route path="services/:slug" element={<ServiceDetailPage />} />
                  <Route path="doctors" element={<DoctorsPage />} />
                  <Route path="doctors/:slug" element={<DoctorDetailPage />} />
                  <Route path="blog" element={<BlogPage />} />
                  <Route path="blog/:slug" element={<BlogPostPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="book" element={<BookingPage />} />
                  <Route path="privacy" element={<PrivacyPage />} />
                  <Route path="terms" element={<TermsPage />} />
                  <Route path="disclaimer" element={<DisclaimerPage />} />
                  <Route path="cookies" element={<CookiesPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* Un-prefixed public path aliases mapped to default Arabic locale */}
                <Route path="/services" element={<Navigate to="/ar/services" replace />} />
                <Route path="/doctors" element={<Navigate to="/ar/doctors" replace />} />
                <Route path="/offers" element={<Navigate to="/ar/offers" replace />} />
                <Route path="/blog" element={<Navigate to="/ar/blog" replace />} />
                <Route path="/contact" element={<Navigate to="/ar/contact" replace />} />
                <Route path="/book" element={<Navigate to="/ar/book" replace />} />
                <Route path="/about" element={<Navigate to="/ar/about" replace />} />
                <Route path="/faq" element={<Navigate to="/ar/faq" replace />} />
                <Route path="/calculator" element={<Navigate to="/ar/calculator" replace />} />
                <Route path="/privacy" element={<Navigate to="/ar/privacy" replace />} />
                <Route path="/terms" element={<Navigate to="/ar/terms" replace />} />

                {/* Explicit 404 page for unknown routes (Prevents Soft 404 in Search Console) */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}
