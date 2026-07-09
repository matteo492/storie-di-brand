"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type BrandEpisode = {
  id: string;
  title: string;
};

type BrandPoint = {
  brand: string;
  year: number;
  id: string;
  title: string;
  image: string;
  parts: number;
  episodes?: BrandEpisode[];
};

// Spaziatura della timeline. La distanza tra due cursori riflette gli anni che li
// separano, ma è limitata tra MIN e MAX così le decadi affollate restano cliccabili
// e i vuoti storici non diventano enormi. L'anno sotto ogni cursore tiene la scala onesta.
const PX_PER_YEAR = 16;
const MIN_GAP = 66;
const MAX_GAP = 190;
const PAD = 80;

/**
 * Carosello dei player quando un brand ha più episodi (Pt 1, Pt 2…).
 * Come lo slider degli episodi ma senza loop: le frecce si disattivano
 * agli estremi e lo swipe si ferma sul primo/ultimo episodio.
 */
function BtEpisodeCarousel({
  episodes,
  brand,
}: {
  episodes: BrandEpisode[];
  brand: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const go = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.min(episodes.length - 1, Math.max(0, index + dir));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    setIndex(next);
  };

  // Tiene l'indice allineato durante lo swipe manuale.
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className="bt-car">
      <div className="bt-car__frame">
        <div className="bt-car__track" ref={trackRef} onScroll={onScroll}>
          {episodes.map((ep) => (
            <div className="bt-car__item" key={ep.id}>
              <iframe
                src={`https://playlist.megaphone.fm?e=${ep.id}`}
                width="100%"
                height="200"
                frameBorder="0"
                scrolling="no"
                allow="autoplay"
                loading="lazy"
                title={`Storie di Brand — ${ep.title}`}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Su desktop le frecce escono ai lati dell'embed (absolute);
          su mobile restano qui, in riga sotto il player col contatore. */}
      <div className="bt-car__foot">
        <button
          type="button"
          className="bt-car__arrow bt-car__arrow--prev"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Episodio precedente"
        >
          ‹
        </button>
        <p className="bt-car__meta">
          {brand} è una storia in più parti — <strong>{index + 1}</strong> di{" "}
          {episodes.length}
        </p>
        <button
          type="button"
          className="bt-car__arrow bt-car__arrow--next"
          onClick={() => go(1)}
          disabled={index === episodes.length - 1}
          aria-label="Episodio successivo"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default function BrandTimeline({ brands }: { brands: BrandPoint[] }) {
  const [selected, setSelected] = useState<BrandPoint | null>(null);
  const [discovered, setDiscovered] = useState<Set<string>>(new Set());
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Calcola le posizioni orizzontali dei cursori (packing monotòno con gap limitato).
  const layout = useMemo(() => {
    const pts = [...brands].sort((a, b) => a.year - b.year);
    const xs: number[] = [];
    let x = PAD;
    for (let i = 0; i < pts.length; i++) {
      if (i > 0) {
        const delta = (pts[i].year - pts[i - 1].year) * PX_PER_YEAR;
        x += Math.min(MAX_GAP, Math.max(MIN_GAP, delta));
      }
      xs.push(x);
    }
    const width = x + PAD;

    return { pts, xs, width };
  }, [brands]);

  function select(b: BrandPoint, x: number) {
    setSelected(b);
    setDiscovered((prev) => {
      const next = new Set(prev);
      next.add(b.id);
      return next;
    });
    // Centra il cursore selezionato nello scroller
    const sc = scrollerRef.current;
    if (sc) {
      sc.scrollTo({ left: x - sc.clientWidth / 2, behavior: "smooth" });
    }
  }

  function nudge(dir: 1 | -1) {
    const sc = scrollerRef.current;
    if (sc) sc.scrollBy({ left: dir * sc.clientWidth * 0.7, behavior: "smooth" });
  }

  // Trascinamento con il puntatore (drag-to-pan) per esplorare la linea del tempo.
  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;
    let down = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    const onDown = (e: PointerEvent) => {
      // Ignora i click diretti sui cursori (gestiti dal loro onClick)
      if ((e.target as HTMLElement).closest(".bt-marker")) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startScroll = sc.scrollLeft;
      sc.classList.add("is-grabbing");
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      sc.scrollLeft = startScroll - dx;
    };
    const onUp = () => {
      down = false;
      sc.classList.remove("is-grabbing");
    };
    // Evita selezione testo durante il drag
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    };

    sc.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    sc.addEventListener("click", onClickCapture, true);
    return () => {
      sc.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      sc.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  return (
    <div className="bt">
      <div className="bt-bar">
        <p className="bt-hint">
          <span className="bt-hint-arrow">←</span> Trascina la timeline e clicca un punto
          rosso per scoprire il brand <span className="bt-hint-arrow">→</span>
        </p>
        <p className="bt-progress">
          <strong>{discovered.size}</strong> / {layout.pts.length} brand scoperti
        </p>
      </div>

      <div className="bt-viewport">
        <div className="bt-scroller" ref={scrollerRef}>
        <div className="bt-track" style={{ width: layout.width }}>
          {/* Il nastro: chiaro e materico, riempie tutta l'altezza */}
          <div className="bt-tape" />

          {/* Cursori — alternati sopra/sotto la linea centrale del nastro */}
          {layout.pts.map((p, i) => {
            const x = layout.xs[i];
            const above = i % 2 === 0;
            const isOpen = discovered.has(p.id);
            const isActive = selected?.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`bt-marker${above ? " is-above" : " is-below"}${
                  isOpen ? " is-open" : ""
                }${isActive ? " is-active" : ""}`}
                style={{ left: x }}
                onClick={() => select(p, x)}
                aria-label={
                  isOpen ? `${p.brand}, fondato nel ${p.year}` : `Brand fondato nel ${p.year}`
                }
              >
                <span className="bt-marker__label">{isOpen ? p.brand : "?"}</span>
                <span className="bt-marker__year">{p.year}</span>
                <span className="bt-marker__stem" />
                <span className="bt-marker__dot" />
              </button>
            );
          })}
        </div>
        </div>
        <div className="bt-edge bt-edge--left" aria-hidden="true" />
        <div className="bt-edge bt-edge--right" aria-hidden="true" />
      </div>

      <div className="bt-nav">
        <button type="button" className="bt-nav__btn" onClick={() => nudge(-1)} aria-label="Indietro nel tempo">
          ←
        </button>
        <button type="button" className="bt-nav__btn" onClick={() => nudge(1)} aria-label="Avanti nel tempo">
          →
        </button>
      </div>

      {/* Palco: il brand scoperto + player */}
      <div className="bt-stage">
        {selected ? (
          <div className="bt-card" key={selected.id}>
            {selected.image && (
              <img className="bt-card__cover" src={selected.image} alt="" width={88} height={88} />
            )}
            <div className="bt-card__body">
              <span className="bt-card__year">Fondato nel {selected.year}</span>
              <h3 className="bt-card__brand">{selected.brand}</h3>
              {(!selected.episodes || selected.episodes.length <= 1) && (
                <span className="bt-card__title">{selected.title}</span>
              )}
            </div>
            <div className="bt-card__player">
              {selected.episodes && selected.episodes.length > 1 ? (
                <BtEpisodeCarousel
                  key={selected.id}
                  episodes={selected.episodes}
                  brand={selected.brand}
                />
              ) : (
                <iframe
                  key={selected.id}
                  src={`https://playlist.megaphone.fm?e=${selected.id}`}
                  width="100%"
                  height="200"
                  frameBorder="0"
                  scrolling="no"
                  allow="autoplay"
                  loading="lazy"
                  title={`Storie di Brand — ${selected.brand}`}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="bt-empty">
            <span className="bt-empty__icon">📍</span>
            <p>
              Ogni punto rosso è la data di nascita di un marchio raccontato nel podcast.
              <br />
              Clicca un anno per scoprire <strong>quale brand si nasconde</strong> — e ascolta la sua storia.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
