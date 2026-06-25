"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Sistema globale di "reveal on scroll".
 * - Qualsiasi elemento con classe `reveal` parte nascosto (fade + translateY)
 *   e si rivela quando entra nel viewport.
 * - Fallback sicuro: la classe gate `reveal-ready` viene aggiunta solo via JS,
 *   quindi senza JavaScript tutto resta visibile (SEO/accessibilità).
 * - One-shot: a fine animazione le classi vengono rimosse, così l'elemento
 *   torna al suo comportamento naturale (hover, transition proprie) senza interferenze.
 * - Stagger opzionale via attributo `data-reveal-delay` (in ms).
 * - Rispetta `prefers-reduced-motion`: niente animazioni, contenuto subito visibile.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const root = document.documentElement;
    if (reduce) {
      // Nessuna animazione: mostra tutto e non agganciare osservatori.
      root.classList.remove("reveal-ready");
      return;
    }

    root.classList.add("reveal-ready");

    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal:not(.in-view)")
    );
    if (els.length === 0) return;

    const finalize = (el: HTMLElement) => {
      el.classList.remove("reveal", "in-view");
      el.style.transitionDelay = "";
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          io.unobserve(el);

          const delay = Number(el.dataset.revealDelay || 0);
          if (delay) el.style.transitionDelay = `${delay}ms`;

          // doppio rAF: garantisce che lo stato iniziale sia stato dipinto
          requestAnimationFrame(() =>
            requestAnimationFrame(() => el.classList.add("in-view"))
          );

          // a fine transizione restituiamo l'elemento al suo stato naturale
          const cleanup = (e: TransitionEvent) => {
            if (e.target !== el || e.propertyName !== "transform") return;
            el.removeEventListener("transitionend", cleanup);
            finalize(el);
          };
          el.addEventListener("transitionend", cleanup);
          // fallback se transitionend non scatta
          window.setTimeout(() => finalize(el), 1200 + delay);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -7% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
