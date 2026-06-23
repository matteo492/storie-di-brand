"use client";

import { useRef } from "react";
import EpisodeCard from "./EpisodeCard";
import type { Episode } from "@/lib/episodes";

export default function EpisodeSlider({ episodes }: { episodes: Episode[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

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

      <div className="slider__track" ref={trackRef}>
        {episodes.map((ep) => (
          <div className="slider__item" key={ep.slug}>
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
