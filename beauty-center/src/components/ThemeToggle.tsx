import { useEffect, useState } from "react";
import { Laptop, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStoredTheme, setTheme, type ThemeMode } from "@/lib/theme";

function nextMode(mode: ThemeMode): ThemeMode {
  if (mode === "system") return "light";
  if (mode === "light") return "dark";
  return "system";
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    setMode(getStoredTheme());
  }, []);

  const Icon = mode === "system" ? Laptop : mode === "dark" ? Moon : Sun;

  const label =
    mode === "system" ? "System" : mode === "dark" ? "Dark" : "Light";

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={() => {
        const nm = nextMode(mode);
        setMode(nm);
        setTheme(nm);
      }}
      aria-label={`Theme: ${label}`}
      title={`Theme: ${label}`}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden md:inline">{label}</span>
    </Button>
  );
}
