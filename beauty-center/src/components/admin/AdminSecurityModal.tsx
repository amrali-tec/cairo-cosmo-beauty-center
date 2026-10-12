import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Lock, CheckCircle2, KeyRound } from "lucide-react";
import { updateAdminCredentials, getAdminCredentials } from "@/services/authService";

export function AdminSecurityModal() {
  const [open, setOpen] = useState(false);
  const creds = getAdminCredentials();
  
  const [email, setEmail] = useState(creds.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (currentPassword !== creds.password) {
      setMsg({ type: "error", text: "كلمة المرور الحالية غير صحيحة!" });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setMsg({ type: "error", text: "كلمة المرور الجديدة غير متطابقة!" });
      return;
    }

    const updatedPass = newPassword.trim() ? newPassword.trim() : creds.password;
    updateAdminCredentials(email.trim(), updatedPass);

    setMsg({ type: "success", text: "تم تحديث بيانات وأمان الإدارة بنجاح!" });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => {
      setOpen(false);
      setMsg(null);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl border-primary/30 text-primary font-bold text-xs gap-1.5">
          <ShieldCheck className="h-4 w-4" />
          <span>إعدادات الأمان والرمز</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-[2.5rem] p-6 md:p-8" dir="rtl">
        <DialogHeader className="border-b border-border/60 pb-4">
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            تثبيت أمان وبيانات الإدارة
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground">البريد الإلكتروني للإدارة</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-2xl text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground">كلمة المرور الحالية للتأكيد *</Label>
            <Input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="أدخل كلمة المرور الحالية..."
              className="h-11 rounded-2xl text-sm"
            />
          </div>

          <div className="border-t border-border/60 pt-3 space-y-3">
            <span className="text-xs font-bold text-primary block">تغيير كلمة المرور (اختياري):</span>
            
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">كلمة المرور الجديدة</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="كلمة مرور جديدة قوية..."
                className="h-11 rounded-2xl text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">تأكيد كلمة المرور الجديدة</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أعد كتابة كلمة المرور..."
                className="h-11 rounded-2xl text-sm"
              />
            </div>
          </div>

          {msg ? (
            <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${msg.type === "success" ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30" : "bg-destructive/15 text-destructive border border-destructive/30"}`}>
              {msg.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <Lock className="h-4 w-4 shrink-0" />}
              <span>{msg.text}</span>
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-2xl text-xs">
              إلغاء
            </Button>
            <Button type="submit" className="rounded-2xl btn-primary-gradient border-0 font-bold text-xs px-6">
              تثبيت وحفظ الأمان
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
