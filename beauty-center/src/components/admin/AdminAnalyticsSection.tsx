// ===============================================
// src/components/admin/AdminAnalyticsSection.tsx
// ===============================================
import { Link } from "react-router-dom";
import { LiveAnalyticsDashboard } from "./LiveAnalyticsDashboard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Sparkles } from "lucide-react";

export function AdminAnalyticsSection() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h3 className="text-xl font-black text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            تحليلات الأداء والنبض المباشر للعيادة
          </h3>
          <p className="text-xs text-muted-foreground">
            متابعة حية للإيرادات، الحجوزات، إشغال الفروع وسلوك الزوار
          </p>
        </div>

        <Link to="/admin/analytics">
          <Button
            variant="outline"
            size="sm"
            className="rounded-2xl gap-2 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10"
          >
            <span>عرض لوحة التقارير والذكاء التنفيذي الكاملة</span>
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Condensed Live Dashboard for Main Admin Page */}
      <LiveAnalyticsDashboard condensed={false} />
    </div>
  );
}
