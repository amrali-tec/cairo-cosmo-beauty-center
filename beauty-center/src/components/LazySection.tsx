import React, { useEffect, useRef, useState } from "react";

interface LazySectionProps {
  children: React.ReactNode;
  rootMargin?: string;
  minHeight?: string;
  fallback?: React.ReactNode;
}

export const LazySection: React.FC<LazySectionProps> = ({
  children,
  rootMargin = "350px",
  minHeight = "150px",
  fallback = null,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0] && entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return (
    <div ref={ref} style={{ minHeight: inView ? undefined : minHeight }}>
      {inView ? children : fallback}
    </div>
  );
};

export default LazySection;
