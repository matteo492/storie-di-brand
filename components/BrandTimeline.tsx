"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import PodcastPlayerMini from "./PodcastPlayerMini";

type BrandEpisode = {
  id: string;
  title: string;
  /** Cosa scrivere sulla linguetta: "Parte 2", "Extra"… La calcola lo script
   *  scripts/build-brand-timeline.js, che ha le date sotto mano. */
  etichetta?: string;
  audio?: string;
  duration?: string;
  excerpt?: string;
  image?: string;
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

export default function BrandTimeline({ brands }: { brands: BrandPoint[] }) {
  const [selected, setSelected] = useState<BrandPoint | null>(null);
  const [discovered, setDiscovered] = useState<Set<string>>(new Set());
  const [parte, setParte] = useState(0);
  const [inizio, setInizio] = useState(true);
  const [fine, setFine] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const btRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [altezza, setAltezza] = useState<number | null>(null);

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
    setParte(0);
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

  // Scelto un marchio, la pagina scende sul player: la scheda compare sotto la
  // linea del tempo e senza questo resterebbe fuori schermo. L'effetto scatta
  // dopo il render, quando la scheda esiste davvero e ha la sua altezza.
  //
  // Non uso scrollIntoView({block:"center"}) perché ricentra sempre: se il
  // player è già davanti agli occhi la pagina si muoverebbe all'insù senza
  // motivo. Qui si scorre solo quando serve, e quel tanto che basta.
  useEffect(() => {
    if (!selected) return;
    const bt = btRef.current;
    const palco = stageRef.current;
    const dentro = innerRef.current;
    if (!bt || !palco || !dentro) return;
    // Si centra tutto il blocco — linea del tempo e scheda insieme — non il
    // solo player: puntando al player la timeline finiva sopra la piega.
    // Il palco sta ancora aprendosi, quindi l'altezza finale del blocco è
    // quella attuale meno il palco di adesso più il suo contenuto disteso.
    const r = bt.getBoundingClientRect();
    const finale =
      r.height - palco.getBoundingClientRect().height + dentro.offsetHeight;
    const testa = 72; // intestazione fissa
    const spazio = window.innerHeight - testa;
    // Se il blocco è più alto dello spazio utile, lo si appoggia sotto
    // l'intestazione invece di centrarlo (altrimenti si perde la timeline).
    const scarto = testa + Math.max(0, (spazio - finale) / 2);
    window.scrollTo({
      top: Math.max(0, window.scrollY + r.top - scarto),
      behavior: "smooth",
    });
  }, [selected]);

  function nudge(dir: 1 | -1) {
    const sc = scrollerRef.current;
    if (sc) sc.scrollBy({ left: dir * sc.clientWidth * 0.7, behavior: "smooth" });
  }

  // Stato delle frecce: spente a inizio e fine corsa, come negli altri caroselli.
  const aggiornaFrecce = useCallback(() => {
    const sc = scrollerRef.current;
    if (!sc) return;
    const corsa = sc.scrollWidth - sc.clientWidth;
    setInizio(sc.scrollLeft <= 1);
    setFine(corsa > 1 && sc.scrollLeft >= corsa - 1);
  }, []);

  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;
    aggiornaFrecce();
    const ro = new ResizeObserver(aggiornaFrecce);
    ro.observe(sc);
    return () => ro.disconnect();
  }, [aggiornaFrecce]);

  // L'espansione della scheda è animata: il contenitore prende l'altezza
  // misurata del contenuto e la transizione CSS fa il resto. Senza questo la
  // comparsa del player farebbe saltare di colpo tutto ciò che sta sotto.
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const misura = () => setAltezza(el.offsetHeight);
    misura();
    const ro = new ResizeObserver(misura);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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

  const puntate = selected?.episodes ?? [];
  const corrente = puntate[parte] ?? puntate[0];

  return (
    <div className="bt" ref={btRef}>
      <p className="bt-bar">
        Trascina la linea e clicca un punto per scoprire il marchio.
        <span className="bt-bar__sep">·</span>
        <strong>{discovered.size}</strong> di {layout.pts.length} scoperti
      </p>

      <div className="bt-scroller" ref={scrollerRef} onScroll={aggiornaFrecce}>
        <div className="bt-track" style={{ width: layout.width }}>
          <div className="bt-line" />

          {layout.pts.map((p, i) => {
            const x = layout.xs[i];
            const isOpen = discovered.has(p.id);
            const isActive = selected?.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`bt-marker${isOpen ? " is-open" : ""}${
                  isActive ? " is-active" : ""
                }`}
                style={{ left: x }}
                onClick={() => select(p, x)}
                aria-label={
                  isOpen ? `${p.brand}, fondato nel ${p.year}` : `Brand fondato nel ${p.year}`
                }
              >
                <span className="bt-marker__dot" />
                <span className="bt-marker__year">{p.year}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="car-nav">
        <button
          type="button"
          className="car-arrow"
          onClick={() => nudge(-1)}
          disabled={inizio}
          aria-label="Indietro nel tempo"
        >
          ‹
        </button>
        <button
          type="button"
          className="car-arrow"
          onClick={() => nudge(1)}
          disabled={fine}
          aria-label="Avanti nel tempo"
        >
          ›
        </button>
      </div>

      {/* Il marchio scoperto: copertina, nome, e l'ascolto ridotto
          all'essenziale — un tasto play e una barra. */}
      <div
        className="bt-stage"
        ref={stageRef}
        style={altezza != null ? { height: altezza } : undefined}
      >
        <div ref={innerRef}>
        {selected ? (
          <div className="pod-hero bt-hero" key={selected.id}>
            <div className="pod-hero__cover">
              {(corrente?.image || selected.image) && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={corrente?.image || selected.image}
                  alt=""
                  width={420}
                  height={420}
                />
              )}
            </div>

            <div className="pod-hero__body">
              <div className="pod-hero__text">
                <p className="pod-hero__label">Dal {selected.year}</p>
                <h3 className="pod-hero__title">
                  {corrente?.title ?? selected.title}
                </h3>
                {corrente?.duration && (
                  <p className="pod-hero__meta">{corrente.duration}</p>
                )}
                {corrente?.excerpt && (
                  <p className="pod-hero__excerpt">{corrente.excerpt}</p>
                )}
              </div>

              {/* La riga c'è sempre, anche vuota: i marchi raccontati in una
                  sola puntata non hanno linguette, ma lo spazio resta occupato
                  così il player non si sposta passando da un marchio all'altro. */}
              <div className="pod-parts" role="group" aria-label="Parti della serie">
                {puntate.length > 1 &&
                  puntate.map((ep, i) => (
                    <button
                      key={ep.id}
                      type="button"
                      className={`pod-part${i === parte ? " is-sel" : ""}`}
                      onClick={() => setParte(i)}
                    >
                      {ep.etichetta ?? `Parte ${i + 1}`}
                    </button>
                  ))}
              </div>

              {corrente?.audio && (
                <div className="pod-hero__player">
                  <PodcastPlayerMini
                    key={corrente.id}
                    src={corrente.audio}
                    title={corrente.title}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="bt-empty">
            Ogni punto è l&apos;anno di nascita di un marchio raccontato nel podcast.
          </p>
        )}
        </div>
      </div>
    </div>
  );
}
