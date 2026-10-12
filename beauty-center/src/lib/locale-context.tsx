// src/lib/locale-context.tsx
import { createContext, useContext, ReactNode } from "react";
import {
  Locale,
  defaultLocale,
  localeDirection,
  getTranslation,
  TranslatedString,
  translations,
} from "./i18n";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslatedString) => string;
  dir: "rtl" | "ltr";
  isRTL: boolean;
  translations: typeof translations;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};

interface LocaleProviderProps {
  children: ReactNode;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const LocaleProvider = ({
  children,
  locale,
  setLocale,
}: LocaleProviderProps) => {
  const dir = localeDirection[locale];
  const isRTL = dir === "rtl";

  const t = (key: TranslatedString): string => {
    return getTranslation(key, locale);
  };

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, t, dir, isRTL, translations }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export { LocaleContext };
