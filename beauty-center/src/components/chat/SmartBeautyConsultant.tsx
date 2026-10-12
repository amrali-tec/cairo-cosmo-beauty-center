// ===============================================
// src/components/chat/SmartBeautyConsultant.tsx
// مساعد واستشارات الجمال الذكي التفاعلي
// ===============================================

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  CheckCircle2,
  Calendar,
  Phone,
  ArrowRight,
  Stethoscope,
  Zap,
  HelpCircle,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/locale-context";
import { createRealBooking } from "@/services/realtimeBookingService";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  options?: { label: string; action: string }[];
  bookingAction?: boolean;
  time: string;
}

const initialMessagesAr: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "bot",
    text: "أهلاً بكِ في مركز كايرو كوزمو سنتر! 🌸 أنا مستشاركِ الذكي للتجميل والعناية بالبشرة والليزر. كيف يمكنني مساعدتكِ اليوم للحصول على أفضل إشراقة؟",
    options: [
      { label: "🔍 تحديد جهاز الليزر الأنسب لبشرتي", action: "laser_advice" },
      { label: "💉 استشارة الفيلر والبوتوكس", action: "injections_advice" },
      { label: "✨ علاج المسام والتصبغات والهيدرافيشل", action: "skin_advice" },
      { label: "💰 الاستعلام عن عروض اليوم", action: "offers_info" },
      { label: "📅 حجز موعد مباشر مع الطبيب", action: "direct_booking" },
    ],
    time: "الآن",
  },
];

const initialMessagesEn: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "bot",
    text: "Welcome to Cairo Cosmo Center! 🌸 I am your AI Beauty & Aesthetics Consultant. How can I assist you today to achieve your aesthetic goals?",
    options: [
      { label: "🔍 Find the Best Laser Machine for My Skin", action: "laser_advice" },
      { label: "💉 Fillers & Botox Recommendations", action: "injections_advice" },
      { label: "✨ Pigmentation, Pores & Hydrafacial", action: "skin_advice" },
      { label: "💰 Today's Exclusive Packages & Offers", action: "offers_info" },
      { label: "📅 Book an Instant Appointment", action: "direct_booking" },
    ],
    time: "Now",
  },
];

export function SmartBeautyConsultant() {
  const { locale } = useLocale();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    locale === "ar" ? initialMessagesAr : initialMessagesEn
  );
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  const addMessage = (msg: Omit<ChatMessage, "id" | "time">) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random()}`,
      time: new Date().toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleBotResponse = (actionOrQuery: string) => {
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const isAr = locale === "ar";

      if (actionOrQuery === "laser_advice") {
        addMessage({
          sender: "bot",
          text: isAr
            ? "لدينا في كايرو كوزمو أحدث جهازين في العالم لإزالة الشعر:\n\n1. **كانديلا جينتل ماكس برو (Candela Pro):** الأفضل عالمياً للبشرة الفاتحة والشعر المتوسط إلى السميك مع نظام التبريد الديناميكي DCD.\n2. **ديكا موفيو (DEKA Motus AX):** الأفضل للبشرة الحنطية والداكنة وللشعر الوبري وبدون أي ألم إطلاقاً.\n\nهل ترغبين في حجز جلسة تجريبية أو اختبار نوع الشعر مجاناً؟"
            : "We operate the world's leading gold-standard laser devices:\n\n1. **Candela GentleMax Pro:** Best for fair to medium skin with thick/medium hair & DCD cryo-cooling.\n2. **DEKA Motus AX Moveo:** Completely pain-free and optimal for darker or sensitive skin tones.\n\nWould you like to book a free patch test session?",
          options: [
            { label: isAr ? "📅 حجز جلسة كانديلا برو" : "Book Candela Pro", action: "direct_booking" },
            { label: isAr ? "📅 حجز جلسة ديكا بدون ألم" : "Book DEKA Painless", action: "direct_booking" },
            { label: isAr ? "حاسبة تكلفة الباقات 🧮" : "Treatment Calculator 🧮", action: "open_calculator" },
          ],
        });
      } else if (actionOrQuery === "injections_advice") {
        addMessage({
          sender: "bot",
          text: isAr
            ? "تُجرى جميع حقن الفيلر والبوتوكس بإشراف استشاريي التجميل (د. ناهد سمير ود. باسم زكي) باستخدام مواد أصلية 100% معتمدة:\n\n• **الفيلر (Juvederm & Restylane):** لتحديد الشفاه، ملء الخدود، وتكساس الفك.\n• **البوتوكس (Allergan USA):** لإخفاء تجاعيد الجبهة وحول العينين ورفع الحواجب.\n• **إبر النضارة (Profhilo):** لشد ونضارة الوجه والرقبة."
            : "All injectable procedures are performed by board-certified specialists using genuine FDA-approved fillers (Juvederm, Restylane, Profhilo) and Allergan Botox with natural-looking results.",
          options: [
            { label: isAr ? "📅 حجز استشارة فيلر وبوتوكس" : "Book Injectables Consultation", action: "direct_booking" },
            { label: isAr ? "💰 استعراض الأسعار والباقات" : "View Packages & Prices", action: "offers_info" },
          ],
        });
      } else if (actionOrQuery === "skin_advice") {
        addMessage({
          sender: "bot",
          text: isAr
            ? "للحصول على بشرة زجاجية خالية من التصبغات والمسام الواسعة، ننصح بـ:\n\n1. **جلسة الهيدرافيشل الملكية (12 خطوة):** تنظيف عميق وتقشير مائي وتغذية بالسيرومات.\n2. **الفراكشنال ليزر + الخلايا الجذعية:** لعلاج آثار الحبوب والندبات وتجديد الكولاجين.\n3. **التقشير الكربوني بالليزر:** لتضييق المسام وتفتيح البشرة فورياً."
            : "For flawless, glowing skin, we recommend our 12-Step Royal Hydrafacial for deep cleansing, or Fractional CO2 Laser for acne scar remodeling.",
          options: [
            { label: isAr ? "📅 حجز هيدرافيشل ملكي" : "Book Royal Hydrafacial", action: "direct_booking" },
            { label: isAr ? "📅 حجز فراكشنال ليزر" : "Book Fractional Laser", action: "direct_booking" },
          ],
        });
      } else if (actionOrQuery === "offers_info") {
        addMessage({
          sender: "bot",
          text: isAr
            ? "🌸 **باقات وعروض كايرو كوزمو سنتر الحصرية:**\n\n• باقة ليزر الجسم بالكامل (كانديلا برو + جلسات رتوش مجانية)\n• باقة الفيلر الفرنسي الملكي (مع جلسة هيدرافيشل هدية)\n• باقة نضارة العروس المتكاملة وبروفايلو\n\n📌 **الأسعار والعروض المخفضة تُقدم مخصصة حسب الحالة والفرع عبر الواتساب أو الإيميل.**\nكود الخصم الإضافي: `COSMO2026`"
            : "🌸 **Exclusive Cairo Cosmo Packages:**\n\n• Full Body Candela Laser Bundle (with free touch-ups)\n• Royal French Filler Package (+ Free Hydrafacial gift)\n• Bridal Royal Glow & Profhilo\n\n📌 **Personalized pricing & exclusive discount quotes are sent directly via WhatsApp or Email upon request.**\nPromo Code: `COSMO2026`",
          options: [
            { label: isAr ? "📲 طلب الأسعار والعروض عبر الواتساب" : "Request Pricing via WhatsApp", action: "open_whatsapp" },
            { label: isAr ? "📅 حجز موعد كشف واستشارة" : "Book Consultation", action: "direct_booking" },
            { label: isAr ? "مصمم الباقات المخصصة 🧮" : "Custom Bundle Builder 🧮", action: "open_calculator" },
          ],
        });
      } else if (actionOrQuery === "open_whatsapp") {
        window.open(`https://wa.me/201288880000?text=${encodeURIComponent("مرحباً، أود الاستفسار عن تفاصيل أسعار وعروض الباقات التجميلية المتاحة كود COSMO2026")}`, "_blank");
      } else if (actionOrQuery === "direct_booking") {
        addMessage({
          sender: "bot",
          text: isAr
            ? "يسعدنا جداً خدمتك! يمكنك الانتقال فورياً لصفحة الحجز لاختيار الموعد والفرع المناسب مع تأكيد فوري عبر الواتساب."
            : "We would love to welcome you! You can proceed to the instant booking page to select your branch and preferred date.",
          options: [
            { label: isAr ? "🚀 الانتقال لصفحة الحجز المباشر" : "Proceed to Booking Page", action: "go_to_book" },
          ],
        });
      } else if (actionOrQuery === "open_calculator") {
        navigate(`/${locale}/calculator`);
        setIsOpen(false);
      } else if (actionOrQuery === "go_to_book") {
        navigate(`/${locale}/book`);
        setIsOpen(false);
      } else {
        // Natural language fallback response
        addMessage({
          sender: "bot",
          text: isAr
            ? `شكراً لاستفسارك بخصوص "${actionOrQuery}". يسعد فريقنا الطبي بتقديم استشارة مفصلة ومساعدتك في اختيار أفضل خطة علاجية تناسب احتياجاتكِ وميزانيتكِ.`
            : `Thank you for your question regarding "${actionOrQuery}". Our clinical team is ready to assist you with customized aesthetic guidance.`,
          options: [
            { label: isAr ? "📅 حجز موعد استشارة طبية" : "Book Medical Consultation", action: "direct_booking" },
            { label: isAr ? "حاسبة التكلفة والخصومات 🧮" : "Treatment Cost Calculator", action: "open_calculator" },
          ],
        });
      }
    }, 700);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText("");

    addMessage({
      sender: "user",
      text: userText,
    });

    handleBotResponse(userText);
  };

  const handleOptionClick = (action: string) => {
    handleBotResponse(action);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-20 md:bottom-6 start-3 sm:start-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="relative h-13 w-13 sm:h-14 sm:w-14 rounded-full p-0 btn-primary-gradient border-2 border-white/40 shadow-[0_8px_30px_rgba(236,72,153,0.4)] hover:shadow-[0_12px_40px_rgba(236,72,153,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group backdrop-blur-md"
          title={locale === "ar" ? "مستشار الجمال الذكي (صوفيا AI)" : "Sophia AI Beauty Consultant"}
        >
          <Sparkles className="h-6 w-6 text-white stroke-[2.3] group-hover:rotate-12 transition-transform drop-shadow-sm" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-gradient-to-tr from-emerald-400 to-emerald-600 text-[8px] font-black text-white items-center justify-center shadow-xs border border-white/40">
              AI
            </span>
          </span>
        </Button>
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="fixed bottom-36 md:bottom-24 start-3 sm:start-6 z-50 w-[94vw] sm:w-[400px] h-[540px] max-h-[80vh] rounded-[2.5rem] border border-primary/30 bg-card/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300"
        >
          {/* Header */}
          <div className="p-4 border-b border-border/60 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold shadow-md shadow-primary/25">
                <Bot className="h-5 w-5" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
              </div>

              <div>
                <h3 className="font-black text-sm text-foreground flex items-center gap-1.5">
                  <span>{locale === "ar" ? "مستشار الجمال الذكي" : "Cairo Cosmo AI Assistant"}</span>
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </h3>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {locale === "ar" ? "🟢 متصل للمساعدة الفورية" : "🟢 Online & Ready to Help"}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 items-end ${
                  m.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {m.sender === "bot" && (
                  <div className="h-7 w-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={`rounded-2xl p-3 max-w-[85%] space-y-2 leading-relaxed whitespace-pre-line shadow-xs ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground font-medium rounded-bl-sm"
                      : "bg-muted/70 text-foreground border border-border/60 rounded-br-sm"
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Interactive Quick Action Buttons */}
                  {m.options && m.options.length > 0 && (
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-border/40">
                      {m.options.map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleOptionClick(opt.action)}
                          className="rounded-xl border border-primary/30 bg-background/80 hover:bg-primary hover:text-primary-foreground p-2 text-right text-[11px] font-bold text-primary transition-all flex items-center justify-between"
                        >
                          <span>{opt.label}</span>
                          <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[9px] text-right ${
                      m.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {m.time}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs p-2">
                <Bot className="h-4 w-4 text-primary animate-spin" />
                <span className="animate-pulse">
                  {locale === "ar" ? "المستشار يجهز الإجابة..." : "Consultant is typing..."}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-border/60 bg-card flex items-center gap-2"
          >
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                locale === "ar"
                  ? "اكتبي سؤالكِ هنا (ليزر، فيلر، أسعار...)"
                  : "Ask about laser, fillers, prices..."
              }
              className="rounded-xl text-xs h-10 bg-background/80"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputText.trim() || isTyping}
              className="h-10 w-10 shrink-0 rounded-xl btn-primary-gradient border-0 text-white"
            >
              <Send className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
