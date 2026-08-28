import fs from "node:fs";
import path from "node:path";

/**
 * I 4 video "top" del canale, messi in evidenza in home e nella pagina /youtube.
 * Curati a mano per valore produttivo e visualizzazioni (il primo è il featured).
 */
export type YtVideo = { id: string; title: string; main?: boolean };

export const YT_VIDEOS: YtVideo[] = [
  {
    id: "F06RtRjXrCU",
    title: "Che fine ha fatto A-STYLE? Il simbolo più trasgressivo degli anni 2000",
    main: true,
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
