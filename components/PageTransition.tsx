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

    // A dissolvenza finita si toglie tutto. Un transform lasciato addosso
    // all'involucro della pagina, anche se è un translateY(0), fa da blocco
    // contenitore: ogni `position: fixed` dentro la pagina smette di
    // riferirsi alla finestra e si posiziona rispetto all'involucro.
    // L'opacità resta com'è: il JSX la dichiara a zero e ripulirla la
    // rimetterebbe a zero.
    const pulisci = () => {
      el.style.transition = "";
      el.style.transform = "";
    };
    const alTermine = (e: TransitionEvent) => {
      if (e.target === el && e.propertyName === "transform") pulisci();
    };
    el.addEventListener("transitionend", alTermine);
    // Rete di sicurezza: con `prefers-reduced-motion` la transizione è
    // azzerata e transitionend non arriva mai.
    const scadenza = window.setTimeout(pulisci, 1200);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("transitionend", alTermine);
      clearTimeout(scadenza);
    };
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
