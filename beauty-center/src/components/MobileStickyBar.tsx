import { useLocale } from "@/lib/locale-context";
import { Phone, Calendar, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function MobileStickyBar() {
  const { locale } = useLocale();

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-card/95 border-t border-border/70 backdrop-blur shadow-[0_-10px_30px_rgba(0,0,0,0.15)] p-3">
      <div className="flex items-center justify-around gap-2 max-w-md mx-auto">
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/201000000000"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold text-[11px] p-2 rounded-2xl bg-emerald-500/10 flex-1 border border-emerald-500/20 active:scale-95 transition-all"
        >
          <MessageCircle className="h-5 w-5" />
          <span>{locale === "ar" ? "واتساب" : "WhatsApp"}</span>
        </a>

        {/* Call Us Button */}
        <a
          href="tel:+201000000000"
          className="flex flex-col items-center justify-center gap-1 text-primary font-semibold text-[11px] p-2 rounded-2xl bg-primary/10 flex-1 border border-primary/20 active:scale-95 transition-all"
        >
          <Phone className="h-5 w-5" />
          <span>{locale === "ar" ? "اتصل بنا" : "Call Us"}</span>
        </a>

        {/* Booking Button */}
        <Link
          to={`/${locale}/booking`}
          className="flex flex-col items-center justify-center gap-1 text-primary-foreground font-bold text-[11px] p-2 rounded-2xl bg-primary flex-1 shadow-md shadow-primary/20 active:scale-95 transition-all"
        >
          <Calendar className="h-5 w-5" />
          <span>{locale === "ar" ? "احجز الآن" : "Book Now"}</span>
        </Link>
      </div>
    </div>
  );
}
