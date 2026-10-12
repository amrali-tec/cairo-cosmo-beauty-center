import { useEffect, useState } from "react";

export function useThemeMode() {
  const getIsDark = () => document.documentElement.classList.contains("dark");

  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return false;
    return getIsDark();
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(getIsDark());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return { isDark };
}
