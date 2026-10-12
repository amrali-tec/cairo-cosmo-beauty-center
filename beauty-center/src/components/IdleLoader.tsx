import React, { useEffect, useState } from "react";

interface IdleLoaderProps {
  children: React.ReactNode;
  delayMs?: number;
}

export const IdleLoader: React.FC<IdleLoaderProps> = ({
  children,
  delayMs = 4000,
}) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timer: any;

    const trigger = () => {
      setShouldRender(true);
      cleanup();
    };

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("scroll", trigger);
      window.removeEventListener("pointerdown", trigger);
      window.removeEventListener("touchstart", trigger);
      window.removeEventListener("keydown", trigger);
    };

    window.addEventListener("scroll", trigger, { passive: true, once: true });
    window.addEventListener("pointerdown", trigger, { passive: true, once: true });
    window.addEventListener("touchstart", trigger, { passive: true, once: true });
    window.addEventListener("keydown", trigger, { passive: true, once: true });

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      (window as any).requestIdleCallback(
        () => {
          timer = setTimeout(trigger, delayMs);
        },
        { timeout: 8000 }
      );
    } else {
      timer = setTimeout(trigger, delayMs);
    }

    return cleanup;
  }, [delayMs]);

  if (!shouldRender) return null;

  return <>{children}</>;
};

export default IdleLoader;
