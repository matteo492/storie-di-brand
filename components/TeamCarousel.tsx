"use client";

import { useEffect, useRef } from "react";
import { TEAM, initials, type TeamMember } from "@/lib/team";

/**
 * Carosello del team a scorrimento infinito.
 *
 * Stessa tecnica dello slider episodi: il elenco è ripetuto tre volte e lo
 * scroll viene riportato nella copia centrale quando esce dai bordi. Poiché le
 * copie sono identiche il salto è invisibile, quindi si va avanti (o indietro)
 * all'infinito e dopo l'ultimo si ricomincia dal primo.
 */
export default function TeamCarousel({ members = TEAM }: { members?: TeamMember[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const copyWidth = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const measure = () => {
    const el = trackRef.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>(".team-card");
    if (items.length >= members.length + 1) {
      copyWidth.current = items[members.length].offsetLeft - items[0].offsetLeft;
    }
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    el.scrollLeft = copyWidth.current; // si parte dalla copia centrale

    const onResize = () => {
      const ratio = copyWidth.current ? el.scrollLeft / copyWidth.current : 1;
      measure();
      el.scrollLeft = copyWidth.current * ratio;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members.length]);

  /** Riporta lo scroll dentro la copia centrale [one, 2*one). */
  const normalize = () => {
    const el = trackRef.current;
    const one = copyWidth.current || (measure(), copyWidth.current);
    if (!el || !one) return;
    if (el.scrollLeft >= 2 * one) el.scrollLeft -= one;
    else if (el.scrollLeft < one) el.scrollLeft += one;
  };

  // Con lo swipe lo scroll è libero: normalizziamo solo quando si ferma.
  const onScroll = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(normalize, 90);
  };

  // Frecce: prima il salto istantaneo (invisibile), poi lo scroll morbido —
  // così l'animazione non attraversa mai la giunzione tra due copie.
  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    const one = copyWidth.current || (measure(), copyWidth.current);
    if (!el || !one) return;
    const step = el.clientWidth * 0.6;
    const target = el.scrollLeft + dir * step;
    if (target >= 2 * one) el.scrollLeft -= one;
    else if (target < one) el.scrollLeft += one;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const loop = [...members, ...members, ...members];

  return (
    <div className="team-carousel">
      <button
        type="button"
        className="team-arrow team-arrow--prev"
        aria-label="Persone precedenti"
        onClick={() => scroll(-1)}
      >
        ‹
      </button>

      <div className="team-track" ref={trackRef} onScroll={onScroll}>
        {loop.map((m, i) => (
          <div className="team-card" key={`${m.name}-${i}`}>
            <div className="team-card__photo">
              {m.photo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={m.photo} alt="" loading="lazy" />
              ) : (
                <span className="team-card__initials" aria-hidden="true">
                  {initials(m.name)}
                </span>
              )}
            </div>
            <p className="team-card__name">{m.name}</p>
            <p className="team-card__role">{m.role}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="team-arrow team-arrow--next"
        aria-label="Persone successive"
        onClick={() => scroll(1)}
      >
        ›
      </button>
    </div>
  );
}
