import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/locale-context";
import {
  defaultConsent,
  initGoogleConsentModeDefaults,
  readConsent,
  saveAttributionParams,
  saveConsent,
} from "@/lib/cookies";

type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  adUserData: boolean;
  adPersonalization: boolean;
};

export default function CookieBanner() {
  const { locale, dir } = useLocale();

  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(defaultConsent);

  const text = useMemo(
    () => ({
      title:
        locale === "ar"
          ? "نستخدم ملفات تعريف الارتباط"
          : "We use cookies",
      description:
        locale === "ar"
          ? "نستخدم ملفات تعريف الارتباط لتحسين تجربة الاستخدام، وحفظ تفضيلات الخصوصية، وقياس الأداء، ودعم الإعلانات بعد الحصول على موافقتك."
          : "We use cookies to improve your experience, store privacy preferences, measure performance, and support advertising after your consent.",
      acceptAll: locale === "ar" ? "قبول الكل" : "Accept all",
      rejectAll: locale === "ar" ? "رفض غير الضروري" : "Reject non-essential",
      customize: locale === "ar" ? "تخصيص" : "Customize",
      save: locale === "ar" ? "حفظ الاختيارات" : "Save preferences",
      necessary: locale === "ar" ? "ضرورية" : "Necessary",
      analytics: locale === "ar" ? "تحليلية" : "Analytics",
      marketing: locale === "ar" ? "تسويقية" : "Marketing",
      adUserData:
        locale === "ar" ? "بيانات المستخدم الإعلانية" : "Ad user data",
      adPersonalization:
        locale === "ar" ? "تخصيص الإعلانات" : "Ad personalization",
      alwaysOn: locale === "ar" ? "دائمًا مفعلة" : "Always active",
      linksLabel:
        locale === "ar"
          ? "بمتابعة التصفح، يمكنك مراجعة الصفحات القانونية:"
          : "You can review our legal pages:",
      privacy: locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy",
      terms: locale === "ar" ? "الشروط والأحكام" : "Terms & Conditions",
      disclaimer: locale === "ar" ? "إخلاء المسؤولية" : "Disclaimer",
      cookies: locale === "ar" ? "سياسة الكوكيز" : "Cookies Policy",
    }),
    [locale],
  );

  useEffect(() => {
    initGoogleConsentModeDefaults();
    saveAttributionParams();

    const stored = readConsent();
    const hasStoredChoice =
      stored.analytics !== defaultConsent.analytics ||
      stored.marketing !== defaultConsent.marketing ||
      stored.adUserData !== defaultConsent.adUserData ||
      stored.adPersonalization !== defaultConsent.adPersonalization;

    setConsent(stored);
    setIsOpen(!hasStoredChoice);
  }, []);

  const handleAcceptAll = () => {
    const next: ConsentState = {
      necessary: true,
      analytics: true,
      marketing: true,
      adUserData: true,
      adPersonalization: true,
    };
    setConsent(next);
    saveConsent(next);
    setIsOpen(false);
    setSettingsOpen(false);
  };

  const handleRejectAll = () => {
    const next: ConsentState = {
      necessary: true,
      analytics: false,
      marketing: false,
      adUserData: false,
      adPersonalization: false,
    };
    setConsent(next);
    saveConsent(next);
    setIsOpen(false);
    setSettingsOpen(false);
  };

  const handleSave = () => {
    const next: ConsentState = {
      necessary: true,
      analytics: consent.analytics,
      marketing: consent.marketing,
      adUserData: consent.marketing ? consent.adUserData : false,
      adPersonalization: consent.marketing
        ? consent.adPersonalization
        : false,
    };

    setConsent(next);
    saveConsent(next);
    setIsOpen(false);
    setSettingsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      dir={dir}
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90"
    >
      <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-5">
        <div className="rounded-2xl border bg-card p-4 shadow-lg md:p-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <h2 className="text-lg font-bold text-foreground">
                {text.title}
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {text.description}
              </p>
              <p className="text-sm text-muted-foreground">
                {text.linksLabel}{" "}
                <a className="underline" href="/privacy">
                  {text.privacy}
                </a>{" "}
                ·{" "}
                <a className="underline" href="/terms">
                  {text.terms}
                </a>{" "}
                ·{" "}
                <a className="underline" href="/disclaimer">
                  {text.disclaimer}
                </a>{" "}
                ·{" "}
                <a className="underline" href="/cookies">
                  {text.cookies}
                </a>
              </p>
            </div>

            {settingsOpen && (
              <div className="grid gap-4 rounded-xl border bg-muted/30 p-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium">{text.necessary}</div>
                      <div className="text-sm text-muted-foreground">
                        {text.alwaysOn}
                      </div>
                    </div>
                    <input type="checkbox" checked disabled />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium">{text.analytics}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={consent.analytics}
                      onChange={(e) =>
                        setConsent((prev) => ({
                          ...prev,
                          analytics: e.target.checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium">{text.marketing}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={consent.marketing}
                      onChange={(e) =>
                        setConsent((prev) => ({
                          ...prev,
                          marketing: e.target.checked,
                          adUserData: e.target.checked
                            ? prev.adUserData
                            : false,
                          adPersonalization: e.target.checked
                            ? prev.adPersonalization
                            : false,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium">{text.adUserData}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={consent.adUserData}
                      disabled={!consent.marketing}
                      onChange={(e) =>
                        setConsent((prev) => ({
                          ...prev,
                          adUserData: e.target.checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium">
                        {text.adPersonalization}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={consent.adPersonalization}
                      disabled={!consent.marketing}
                      onChange={(e) =>
                        setConsent((prev) => ({
                          ...prev,
                          adPersonalization: e.target.checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 md:flex-row">
              <Button onClick={handleAcceptAll} className="w-full md:w-auto">
                {text.acceptAll}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleRejectAll}
                className="w-full md:w-auto"
              >
                {text.rejectAll}
              </Button>

              {!settingsOpen ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setSettingsOpen(true)}
                  className="w-full md:w-auto"
                >
                  {text.customize}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSave}
                  className="w-full md:w-auto"
                >
                  {text.save}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}