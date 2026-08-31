"use client";

import { useRef, useState } from "react";
import AncoraDolce from "./AncoraDolce";

/**
 * Il banner della sezione live: la foto riempie tutta la fascia e tutto il
 * testo — occhiello, titolo, frase e pulsanti — le sta sopra a sinistra,
 * sulla velatura. Premendo "Guarda il video" parte il
 * trailer al posto della foto e il testo si toglie di mezzo.
 *
 * La foto è il poster del video: il trailer pesa 95 MB e con preload="none"
 * non scende un byte finché non si preme play.
 */
export default function LiveBanner() {
  const video = useRef<HTMLVideoElement>(null);
  const [inRiproduzione, setInRiproduzione] = useState(false);

  return (
    <div className={`live-banner reveal${inRiproduzione ? " is-playing" : ""}`}>
      <video
        ref={video}
        className="live-banner__media"
        poster="/live-banner.jpg"
        preload="none"
        playsInline
        controls={inRiproduzione}
        onPlay={() => setInRiproduzione(true)}
        onEnded={() => setInRiproduzione(false)}
      >
        <source src="/live-trailer.mp4" type="video/mp4" />
      </video>

      {!inRiproduzione && (
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
            <button
              type="button"
              className="btn btn--dark"
              onClick={() => video.current?.play()}
            >
              ▶ Guarda il video
            </button>
            <AncoraDolce href="#collabora" className="btn btn--primary">
              Portala sul palco
            </AncoraDolce>
          </div>
        </div>
      )}
    </div>
  );
}
