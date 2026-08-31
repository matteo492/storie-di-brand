"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AncoraDolce from "./AncoraDolce";

/**
 * Il banner della sezione live: la foto riempie tutta la fascia e tutto il
 * testo — occhiello, titolo, frase e pulsanti — le sta sopra a sinistra, sulla
 * velatura.
 *
 * "Guarda il video" apre il trailer in una finestra sopra alla pagina, che si
 * chiude con la X, con Esc o cliccando sul fondo. È un <dialog> nativo: da lui
 * arrivano gratis il confinamento del fuoco, la chiusura con Esc e il piano
 * sopra a tutto il resto.
 *
 * Il trailer pesa 95 MB: con preload="none" non scende un byte finché la
 * finestra non viene aperta.
 */
export default function LiveBanner() {
  const finestra = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [aperta, setAperta] = useState(false);

  const apri = () => {
    finestra.current?.showModal();
    setAperta(true);
    // Se il browser rifiuta l'avvio automatico restano i controlli nativi.
    video.current?.play().catch(() => {});
  };

  const chiudi = useCallback(() => finestra.current?.close(), []);

  // Un solo punto di riordino, qualunque sia il modo in cui si è chiuso.
  useEffect(() => {
    const d = finestra.current;
    if (!d) return;
    const alCongedo = () => {
      setAperta(false);
      const v = video.current;
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    };
    d.addEventListener("close", alCongedo);
    return () => d.removeEventListener("close", alCongedo);
  }, []);

  // La pagina dietro non deve scorrere: il <dialog> la rende inerte ma non
  // ne blocca lo scorrimento.
  useEffect(() => {
    if (!aperta) return;
    const prima = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prima;
    };
  }, [aperta]);

  return (
    <>
      <div className="live-banner reveal">
        <img
          className="live-banner__media"
          src="/live-banner.jpg"
          alt=""
          width={2000}
          height={1116}
        />

        <div className="live-banner__testo">
          <p className="eyebrow">Eventi dal vivo</p>
          <h2 className="live-banner__titolo">
            La tua storia, <span className="hl">sul palco</span>
          </h2>
          <p className="live-banner__frase">
            Ogni azienda ha una storia che i suoi clienti non conoscono. La
            scriviamo con il metodo del podcast e la mettiamo in scena.
          </p>
          <div className="live-banner__azioni">
            <button type="button" className="btn btn--ghost" onClick={apri}>
              ▶ Guarda il video
            </button>
            <AncoraDolce href="#collabora" className="btn btn--primary">
              Portala sul palco
            </AncoraDolce>
          </div>
        </div>
      </div>

      <dialog
        ref={finestra}
        className="live-finestra"
        aria-label="Il trailer dei live di Storie di Brand"
        // Il click arriva al <dialog> solo quando cade fuori dal riquadro.
        onClick={(e) => {
          if (e.target === finestra.current) chiudi();
        }}
      >
        <div className="live-finestra__corpo">
          <button
            type="button"
            className="live-finestra__chiudi"
            onClick={chiudi}
            aria-label="Chiudi il video"
          >
            ✕
          </button>
          {/* Sempre montato: serve il riferimento già pronto per far partire
              il video dentro al gesto dell'utente. Con preload="none" resta
              comunque a costo zero finché non si preme. */}
          <video
            ref={video}
            className="live-finestra__video"
            controls
            playsInline
            preload="none"
            poster="/live-banner.jpg"
          >
            <source src="/live-trailer.mp4" type="video/mp4" />
          </video>
        </div>
      </dialog>
    </>
  );
}
