"use client";

import { useEffect, useRef } from "react";
import EpisodeCard from "./EpisodeCard";
import type { Episode } from "@/lib/episodes";

export default function EpisodeSlider({ episodes }: { episodes: Episode[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  // larghezza in px di una singola copia degli episodi (misurata, non stimata)
  const copyWidth = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const measure = () => {
    const el = trackRef.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>(".slider__item");
    if (items.length >= episodes.length + 1) {
      copyWidth.current =
        items[episodes.length].offsetLeft - items[0].offsetLeft;
    }
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    // si parte dalla copia centrale: c'è materiale identico a sinistra e a destra
    el.scrollLeft = copyWidth.current;

    const onResize = () => {
      const ratio = copyWidth.current ? el.scrollLeft / copyWidth.current : 1;
      measure();
      el.scrollLeft = copyWidth.current * ratio;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodes.length]);

  // Riporta lo scroll dentro la copia centrale [one, 2*one). I contenuti delle
  // copie sono identici, quindi lo spostamento è invisibile = loop infinito.
  const normalize = () => {
    const el = trackRef.current;
    const one = copyWidth.current || (measure(), copyWidth.current);
    if (!el || !one) return;
    if (el.scrollLeft >= 2 * one) el.scrollLeft -= one;
    else if (el.scrollLeft < one) el.scrollLeft += one;
  };

  // Durante lo swipe col dito lo scroll è libero: normalizziamo solo quando si
  // ferma (debounce), così non interrompiamo mai uno scroll in corso.
  const onScroll = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(normalize, 90);
  };

  // Le frecce: prima il salto istantaneo (invisibile) per restare lontani dai
  // bordi, poi lo scroll smooth che così non attraversa mai una giunzione.
  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    const one = copyWidth.current || (measure(), copyWidth.current);
    if (!el || !one) return;
    const step = el.clientWidth * 0.85;
    const target = el.scrollLeft + dir * step;
    if (target >= 2 * one) el.scrollLeft -= one;
    else if (target < one) el.scrollLeft += one;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const loop = [...episodes, ...episodes, ...episodes];

  return (
    <div className="slider">
      <button
        type="button"
        className="slider__arrow slider__arrow--prev"
        aria-label="Episodi precedenti"
        onClick={() => scroll(-1)}
      >
        ‹
      </button>

      <div className="slider__track" ref={trackRef} onScroll={onScroll}>
        {loop.map((ep, i) => (
          <div className="slider__item" key={`${ep.slug}-${i}`}>
            <EpisodeCard episode={ep} />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="slider__arrow slider__arrow--next"
        aria-label="Episodi successivi"
        onClick={() => scroll(1)}
      >
        ›
      </button>
    </div>
  );
}
