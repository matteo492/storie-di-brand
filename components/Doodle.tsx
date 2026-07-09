"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Segni disegnati a mano (cerchietti, sottolineature, frecce, sparkle…) per
 * smorzare il tono istituzionale. Si "disegnano" da soli (stroke animato)
 * quando entrano nel viewport; rispettano prefers-reduced-motion.
 */
export type DoodleType =
  | "underline"
  | "scallop"
  | "circle"
  | "arrow"
  | "sparkle";

const DOODLES: Record<DoodleType, { vb: string; paths: string[] }> = {
  // Sottolineatura ondulata a mano libera
  underline: {
    vb: "0 0 200 22",
    paths: ["M4 14 C 34 5, 60 19, 92 12 C 124 5, 150 19, 196 9"],
  },
  // Sottolineatura a festoni/loop (come la riga 3 del riferimento)
  scallop: {
    vb: "0 0 232 26",
    paths: [
      "M5 17 q 13 -16 26 0 q 13 16 26 0 q 13 -16 26 0 q 13 16 26 0 q 13 -16 26 0 q 13 16 26 0 q 13 -16 26 0 q 13 16 26 0",
    ],
  },
  // Cerchio storto tracciato a mano che si chiude con un piccolo sormonto
  circle: {
    vb: "0 0 224 96",
    paths: [
      "M164 16 C 100 3, 24 12, 16 48 C 9 82, 92 90, 152 82 C 214 74, 220 40, 192 24 C 176 15, 146 13, 108 16",
    ],
  },
  // Freccia curva con punta
  arrow: {
    vb: "0 0 96 96",
    paths: [
      "M10 12 C 44 10, 78 28, 72 72",
      "M52 58 L 74 78",
      "M86 54 L 74 78",
    ],
  },
  // Scintilla / stella radiante
  sparkle: {
    vb: "0 0 44 44",
    paths: [
      "M22 3 V 16",
      "M22 28 V 41",
      "M3 22 H 16",
      "M28 22 H 41",
      "M9 9 L 17 17",
      "M35 9 L 27 17",
      "M9 35 L 17 27",
      "M35 35 L 27 27",
    ],
  },
};

export default function Doodle({
  type,
  className = "",
}: {
  type: DoodleType;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setDrawn(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const d = DOODLES[type];
  return (
    <svg
      ref={ref}
      className={`doodle doodle--${type}${drawn ? " is-drawn" : ""}${className ? " " + className : ""}`}
      viewBox={d.vb}
      fill="none"
      aria-hidden="true"
    >
      {d.paths.map((p, i) => (
        <path
          key={i}
          d={p}
          pathLength={1}
          style={{ ["--i" as string]: i } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}
