// ===============================================
// src/components/admin/SophiaCopilotDrawer.tsx
// شريط صوفيا الذكي الجانبي في كافة شاشات لوحة الإدارة
// ===============================================

import { useState } from "react";
import {
  Bot,
  Sparkles,
  Send,
  User,
  X,
  ArrowRight,
  TrendingUp,
  Zap,
  Calendar,
  MessageCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SophiaMessage, processSophiaCommand } from "@/services/sophiaAgentService";
import { playNotificationChime } from "@/services/realtimeBookingService";
import { Link } from "react-router-dom";

export function SophiaCopilotDrawer() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<SophiaMessage[]>([
    {
      id: "drawer-init",
      sender: "sophia",
      text: "مرحباً يا دكتور! 🌸 أنا صوفيا، المساعد الذكي بجانبك في أي صفحة. كيف يمكنني مساعدتك الآن؟",
      timestamp: "الآن",
      quickPrompts: ["📊 ملخص اليوم", "⚡ فحص أجهزة الليزر", "📅 حجز موعد سريع"],
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    setInputText("");
    const timeStr = new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "admin", text, timestamp: timeStr },
    ]);
    setIsThinking(true);

    try {
      const response = await processSophiaCommand(text);
      setMessages((prev) => [...prev, response]);
      playNotificationChime();
    } catch {
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          className="rounded-xl btn-primary-gradient border-0 text-white text-xs font-black gap-1.5 shadow-md shadow-primary/25 hover:scale-105 transition-all"
          title="فتح المساعد الذكي صوفيا"
        >
          <Bot className="h-4 w-4 animate-pulse" />
          <span className="hidden sm:inline">صوفيا AI</span>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[90vw] sm:w-[440px] p-0 flex flex-col h-full bg-card/95 backdrop-blur-2xl border-primary/20"
        dir="rtl"
      >
        {/* Header */}
        <SheetHeader className="p-4 border-b border-border/60 bg-gradient-to-l from-primary/15 via-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-primary/25">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <SheetTitle className="text-sm font-black text-foreground flex items-center gap-1.5">
                  <span>صوفيا AI • Copilot</span>
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] font-bold">
                    نشط 🟢
                  </Badge>
                </SheetTitle>
                <p className="text-[10px] text-muted-foreground">
                  المساعد التشغيلي الذكي لمركز كايرو كوزمو
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              asChild
              className="h-8 rounded-xl text-[11px] font-bold"
              onClick={() => setOpen(false)}
            >
              <Link to="/admin/sophia">مركز العمليات الكامل</Link>
            </Button>
          </div>
        </SheetHeader>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 items-start ${
                m.sender === "admin" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {m.sender === "sophia" ? (
                <div className="h-7 w-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
              ) : (
                <div className="h-7 w-7 rounded-xl bg-muted text-foreground flex items-center justify-center shrink-0 font-bold border border-border/60">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}

              <div
                className={`rounded-2xl p-3 max-w-[85%] space-y-2 leading-relaxed whitespace-pre-line shadow-xs ${
                  m.sender === "admin"
                    ? "bg-primary text-primary-foreground font-medium rounded-tl-sm"
                    : "bg-muted/70 text-foreground border border-border/60 rounded-tr-sm"
                }`}
              >
                <p>{m.text}</p>

                {m.action && m.action.actionButton && (
                  <div className="pt-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      asChild
                      className="w-full rounded-xl text-[11px] font-bold h-7 bg-background text-primary border border-primary/20"
                      onClick={() => setOpen(false)}
                    >
                      <Link to={m.action.actionButton.url || "/admin"}>
                        <span>{m.action.actionButton.label}</span>
                        <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                      </Link>
                    </Button>
                  </div>
                )}

                {m.quickPrompts && m.quickPrompts.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1.5 border-t border-border/40">
                    {m.quickPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(p)}
                        className="rounded-lg border border-primary/30 bg-background/80 hover:bg-primary hover:text-primary-foreground px-2 py-0.5 text-[10px] font-bold text-primary transition-all"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[8px] text-left pt-0.5 ${
                    m.sender === "admin" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-muted-foreground text-xs p-2">
              <Bot className="h-4 w-4 text-primary animate-spin" />
              <span className="animate-pulse">صوفيا تفكر وتنفذ الأمر...</span>
            </div>
          )}
        </div>

        {/* Fast Action Quick Triggers */}
        <div className="p-2.5 bg-muted/40 border-t border-border/50 overflow-x-auto space-y-1.5 shrink-0">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              type="button"
              onClick={() => handleSendMessage("شغلي التقرير الصباحي الشامل الآن")}
              className="rounded-xl border border-primary/30 bg-card hover:bg-primary hover:text-primary-foreground px-2.5 py-1 text-[10px] font-bold text-primary transition-all flex items-center gap-1 shrink-0"
            >
              <Clock className="h-2.5 w-2.5 text-emerald-500" />
              <span>التقرير الصباحي ⏰</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage("فحص منظومة العقل الموحد والزوار")}
              className="rounded-xl border border-primary/30 bg-card hover:bg-primary hover:text-primary-foreground px-2.5 py-1 text-[10px] font-bold text-primary transition-all flex items-center gap-1 shrink-0"
            >
              <Sparkles className="h-2.5 w-2.5 text-primary" />
              <span>العقل الموحد 🌐</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage("ملخص أداء ومواعيد اليوم")}
              className="rounded-xl border border-primary/30 bg-card hover:bg-primary hover:text-primary-foreground px-2.5 py-1 text-[10px] font-bold text-primary transition-all flex items-center gap-1 shrink-0"
            >
              <TrendingUp className="h-2.5 w-2.5" />
              <span>ملخص اليوم</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage("فحص غرف وأجهزة الليزر")}
              className="rounded-xl border border-primary/30 bg-card hover:bg-primary hover:text-primary-foreground px-2.5 py-1 text-[10px] font-bold text-primary transition-all flex items-center gap-1 shrink-0"
            >
              <Zap className="h-2.5 w-2.5" />
              <span>أجهزة الليزر</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage("احجز موعد لمراجع جديد")}
              className="rounded-xl border border-primary/30 bg-card hover:bg-primary hover:text-primary-foreground px-2.5 py-1 text-[10px] font-bold text-primary transition-all flex items-center gap-1 shrink-0"
            >
              <Calendar className="h-2.5 w-2.5" />
              <span>حجز فوري</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage("تجهيز تذكيرات مواعيد الغد 24h")}
              className="rounded-xl border border-primary/30 bg-card hover:bg-primary hover:text-primary-foreground px-2.5 py-1 text-[10px] font-bold text-primary transition-all flex items-center gap-1 shrink-0"
            >
              <Sparkles className="h-2.5 w-2.5" />
              <span>تذكيرات 24h</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage("استعراض شرائح عملاء VIP")}
              className="rounded-xl border border-primary/30 bg-card hover:bg-primary hover:text-primary-foreground px-2.5 py-1 text-[10px] font-bold text-primary transition-all flex items-center gap-1 shrink-0"
            >
              <MessageCircle className="h-2.5 w-2.5" />
              <span>عملاء VIP</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage("تجهيز مسودة حملة واتساب")}
              className="rounded-xl border border-primary/30 bg-card hover:bg-primary hover:text-primary-foreground px-2.5 py-1 text-[10px] font-bold text-primary transition-all flex items-center gap-1 shrink-0"
            >
              <Send className="h-2.5 w-2.5" />
              <span>حملة واتساب</span>
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-border/60 bg-card flex items-center gap-2"
        >
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اطلب أي إجراء من صوفيا..."
            className="rounded-xl text-xs h-10 bg-background"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputText.trim() || isThinking}
            className="h-10 w-10 shrink-0 rounded-xl btn-primary-gradient border-0 text-white"
          >
            <Send className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
