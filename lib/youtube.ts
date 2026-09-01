import fs from "node:fs";
import path from "node:path";

/**
 * I 4 video "top" del canale, messi in evidenza in home e nella pagina /youtube.
 * Curati a mano per valore produttivo e visualizzazioni (il primo è il featured).
 */
export type YtVideo = {
  id: string;
  title: string;
  main?: boolean;
  /**
   * Credito da mostrare sotto al titolo, quando il video non è solo nostro.
   * `logo` è il nome del file in /public/partners; `ratio` è larghezza diviso
   * altezza del suo disegno, serve a dare al marchio la sua forma senza
   * doverlo misurare a video.
   */
  collaborazione?: { testo: string; logo?: string; ratio?: number };
};

/* Toccando questa lista va aggiornata anche VIDEO_IDS in
   scripts/update-youtube-stats.js: è da lì che arrivano le visualizzazioni, e
   un id rimasto indietro lascia il video senza numero. */
export const YT_VIDEOS: YtVideo[] = [
  {
    id: "FQwaYebscxU",
    title:
      "Juventus: perché un club di 120 anni ha rifatto il suo simbolo (e cosa è diventato dopo)",
    main: true,
    collaborazione: {
      testo: "In collaborazione con Juventus",
      logo: "juventus",
      ratio: 0.63,
    },
  },
  { id: "QRc5dydzwqo", title: "L'incredibile storia della Multipla: l'auto più brutta di sempre" },
  { id: "ihcYNgSVsTY", title: "L'oscura scomparsa della Standa" },
  { id: "ZTT2LnpcQic", title: "80 milioni di passeggeri con un solo autobus: l'assurdo business di FlixBus" },
];

/** Visualizzazioni per video (aggiornate ogni notte dal workflow). Vuoto se il file manca. */
export function getYoutubeStats(): Record<string, string> {
  try {
    const statsPath = path.join(process.cwd(), "public", "youtube-stats.json");
    return JSON.parse(fs.readFileSync(statsPath, "utf8"));
  } catch {
    return {};
  }
}
