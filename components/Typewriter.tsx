"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Effetto "macchina da scrivere": compone il testo carattere per carattere
 * quando l'elemento entra nel viewport (parte una sola volta).
 * - `delay`   ms prima di iniziare a digitare (per sincronizzarsi con l'entrata).
 * - `speed`   ms tra un carattere e l'altro.
 * - Fallback: con `prefers-reduced-motion` mostra subito il testo completo.
 * - Accessibilità: il valore completo resta nell'aria-label dello span.
 */
export default function Typewriter({
  text,
  delay = 0,
  speed = 70,
  className,
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setShown(text);
      setDone(true);
      return;
    }

    let started = false;
    const timers: number[] = [];

    const start = () => {
      if (started) return;
      started = true;
      window.setTimeout(() => {
        const chars = Array.from(text);
        chars.forEach((_, i) => {
          const t = window.setTimeout(() => {
            setShown(text.slice(0, i + 1));
            if (i === chars.length - 1) setDone(true);
          }, i * speed);
          timers.push(t);
        });
      }, delay);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            start();
            io.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(node);

    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [text, delay, speed]);

  return (
    <span
      ref={ref}
      className={`typewriter${done ? " is-done" : ""}${
        className ? ` ${className}` : ""
      }`}
      aria-label={text}
    >
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
