"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  // Fade-in on every route change
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    // Stesso raccordo del resto del sito: il token vive in globals.css.
    const raccordo = "var(--curva)";
    const raf = requestAnimationFrame(() => {
      el.style.transition = `opacity 0.84s ${raccordo}, transform 0.84s ${raccordo}`;
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // Fix hash anchor navigation when coming from another page
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const timer = setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
