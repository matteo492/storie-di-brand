"use client";

import { useEffect, useRef, useState } from "react";
import AncoraDolce from "./AncoraDolce";

/** Il trailer, in streaming da Mux. */
const TRAILER =
  "https://stream.mux.com/PwUG5Zx5WeHMI9BRVUkOcuP6kwZChhPaQA7N02XEnnck.m3u8";

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
 * Il video arriva da Mux in HLS, quindi a qualità adattiva: parte subito e
 * scende solo quello che serve. A leggerlo è hls.js, scaricato solo
 * all'apertura della finestra — chi non preme il pulsante non ne paga un
 * byte — con il ripiego sul lettore di sistema sull'iPhone, dove hls.js non
 * può girare.
 */
export default function LiveBanner() {
  const finestra = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  // Serve al congedo per smontare hls.js e chiudere le sue connessioni.
  const hls = useRef<{ destroy: () => void } | null>(null);
  const [aperta, setAperta] = useState(false);

  const apri = () => {
    finestra.current?.showModal();
    setAperta(true);
    collega();
  };

  const chiudi = () => finestra.current?.close();

  /**
   * Attacca il trailer al <video> e fa partire la riproduzione.
   *
   * Non è nel corpo del componente ma qui, dentro al gesto dell'utente: il
   * caricamento comincia solo quando la finestra si apre davvero.
   */
  const collega = async () => {
    const v = video.current;
    if (!v || v.dataset.pronto === "sì") {
      // Se il browser rifiuta l'avvio automatico restano i controlli nativi.
      v?.play().catch(() => {});
      return;
    }

    // Sull'iPhone il Media Source non c'è e hls.js non potrebbe lavorare:
    // l'HLS lo legge il sistema, e la libreria non la scarichiamo nemmeno.
    if (
      typeof MediaSource === "undefined" &&
      v.canPlayType("application/vnd.apple.mpegurl")
    ) {
      v.src = TRAILER;
    } else {
      const { default: Hls } = await import("hls.js");
      if (!Hls.isSupported()) return;
      const h = new Hls();
      // Un tetto al 1080p: oggi la scaletta di Mux si ferma lì da sola, ma se
      // un domani il trailer viene ricaricato più grande hls.js salirebbe fino
      // in cima — e per un video che si guarda in un riquadro, o al massimo a
      // schermo intero, oltre il 1080p si scaricano megabit per niente.
      // Il tetto si mette quando le qualità sono note, cioè a manifesto letto.
      h.on(Hls.Events.MANIFEST_PARSED, () => {
        const tetto = h.levels.reduce(
          (miglior, l, i) =>
            l.height <= 1080 &&
            (miglior < 0 || l.height > h.levels[miglior].height)
              ? i
              : miglior,
          -1
        );
        if (tetto >= 0) h.autoLevelCapping = tetto;
      });
      h.loadSource(TRAILER);
      h.attachMedia(v);
      hls.current = h;
    }

    v.dataset.pronto = "sì";
    v.play().catch(() => {});
  };

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

  // Chi lascia la pagina con la finestra aperta non deve lasciarsi dietro
  // una libreria che continua a scaricare pezzi di video.
  useEffect(() => () => hls.current?.destroy(), []);

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
          height={848}
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
              il video dentro al gesto dell'utente. Senza src non scarica
              niente finché non si preme. */}
          <video
            ref={video}
            className="live-finestra__video"
            controls
            playsInline
            preload="none"
            poster="/live-banner.jpg"
          />
        </div>
      </dialog>
    </>
  );
}
