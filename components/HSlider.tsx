"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Nastro orizzontale con le frecce sotto, che si spengono a inizio e fine
 * corsa. Lo usano sia le card del progetto sia quelle delle collaborazioni:
 * cambia solo cosa ci sta dentro.
 */
export default function HSlider({
  children,
  etichette,
}: {
  children: React.ReactNode;
  etichette: { prev: string; next: string };
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [inizio, setInizio] = useState(true);
  const [fine, setFine] = useState(false);

  const aggiorna = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const corsa = el.scrollWidth - el.clientWidth;
    // Un pixel di tolleranza: lo scroll finisce spesso su valori frazionari.
    setInizio(el.scrollLeft <= 1);
    // Se non c'è ancora niente da scorrere (primo render, font non caricati)
    // la freccia avanti non va spenta: la misura arriva con l'osservatore.
    setFine(corsa > 1 && el.scrollLeft >= corsa - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    aggiorna();
    // Le schede cambiano misura quando arrivano i font e a ogni ridimensionamento.
    const ro = new ResizeObserver(aggiorna);
    ro.observe(el);
    return () => ro.disconnect();
  }, [aggiorna]);

  const scorri = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className="pslider">
      <div className="pslider__track" ref={trackRef} onScroll={aggiorna}>
        {children}
      </div>
      <div className="car-nav">
        <button
          type="button"
          className="car-arrow"
          onClick={() => scorri(-1)}
          disabled={inizio}
          aria-label={etichette.prev}
        >
          ‹
        </button>
        <button
          type="button"
          className="car-arrow"
          onClick={() => scorri(1)}
          disabled={fine}
          aria-label={etichette.next}
        >
          ›
        </button>
      </div>
    </div>
  );
}
