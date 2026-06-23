"use client";

import { useEffect, useRef } from "react";
import EpisodeCard from "./EpisodeCard";
import type { Episode } from "@/lib/episodes";

export default function EpisodeSlider({ episodes }: { episodes: Episode[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  // larghezza in px di una singola copia degli episodi (misurata, non stimata)
  const copyWidth = useRef(0);

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

  // quando si esce dalla copia centrale, si rientra istantaneamente sulla copia
  // gemella: i contenuti sono identici quindi il salto è invisibile (loop infinito)
  const onScroll = () => {
    const el = trackRef.current;
    const one = copyWidth.current;
    if (!el || !one) return;
    if (el.scrollLeft >= 2 * one) {
      el.scrollLeft -= one;
    } else if (el.scrollLeft < one) {
      el.scrollLeft += one;
    }
  };

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
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
