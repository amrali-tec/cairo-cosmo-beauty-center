type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  adUserData: boolean;
  adPersonalization: boolean;
};

const CONSENT_KEY = "cc_cookie_consent";
const ATTRIBUTION_KEY = "cc_attribution";

export const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  adUserData: false,
  adPersonalization: false,
};

export function setCookie(name: string, value: string, days = 180) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax; Secure`;
}

export function getCookie(name: string): string | null {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export function saveConsent(consent: ConsentState) {
  setCookie(CONSENT_KEY, JSON.stringify(consent), 180);
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  applyGoogleConsentMode(consent);
}

export function readConsent(): ConsentState {
  const fromCookie = getCookie(CONSENT_KEY);
  const fromStorage = localStorage.getItem(CONSENT_KEY);
  const raw = fromCookie || fromStorage;

  if (!raw) return defaultConsent;

  try {
    return { ...defaultConsent, ...JSON.parse(raw) };
  } catch {
    return defaultConsent;
  }
}

export function saveAttributionParams() {
  const url = new URL(window.location.href);
  const payload = {
    utm_source: url.searchParams.get("utm_source") || "",
    utm_medium: url.searchParams.get("utm_medium") || "",
    utm_campaign: url.searchParams.get("utm_campaign") || "",
    utm_term: url.searchParams.get("utm_term") || "",
    utm_content: url.searchParams.get("utm_content") || "",
    gclid: url.searchParams.get("gclid") || "",
    fbclid: url.searchParams.get("fbclid") || "",
    landing_page: window.location.pathname,
    captured_at: new Date().toISOString(),
  };

  setCookie(ATTRIBUTION_KEY, JSON.stringify(payload), 90);
  localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(payload));
}

export function readAttributionParams() {
  const raw = getCookie(ATTRIBUTION_KEY) || localStorage.getItem(ATTRIBUTION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function initGoogleConsentModeDefaults() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function (...args: unknown[]) {
      window.dataLayer!.push(args as unknown as Record<string, unknown>);
    };

  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  });
}

export function applyGoogleConsentMode(consent: ConsentState) {
  if (!window.gtag) return;

  window.gtag("consent", "update", {
    ad_storage: consent.marketing ? "granted" : "denied",
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_user_data: consent.adUserData ? "granted" : "denied",
    ad_personalization: consent.adPersonalization ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  });
}

export function canRunAnalytics() {
  return readConsent().analytics;
}

export function canRunMarketing() {
  return readConsent().marketing;
}