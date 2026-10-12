import { useParams } from "react-router-dom";
import type { Locale } from "@/lib/i18n";

export function useLocaleParam(): Locale {
  const { locale } = useParams();
  return locale === "en" ? "en" : "ar";
}
