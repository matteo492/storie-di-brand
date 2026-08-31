import fs from "node:fs";
import path from "node:path";
import type { PodcastEpisode } from "./podcast";
import { brandLabel } from "./podcast-brand";
import {
  SETTORI,
  ANNI_MANCANTI,
  ALIAS_TIMELINE,
  epocaDaAnno,
} from "./podcast-settori";

/**
 * Settore ed epoca di fondazione di ogni marchio del podcast, pronti per i
 * filtri dell'archivio.
 *
 * Gli anni di fondazione arrivano da public/brand-timeline.json — la stessa
 * fonte del gioco della timeline, così non ci sono due liste da tenere
 * allineate — completati dai pochi marchi che lì non ci sono
 * (ANNI_MANCANTI in podcast-settori.ts).
 *
 * Gira solo sul server: legge dal filesystem e passa al componente due mappe
 * già pronte, senza spedire al browser l'intero elenco degli anni.
 */
export function classificaMarchi(episodes: PodcastEpisode[]): {
  settori: Record<string, string>;
  epoche: Record<string, string>;
} {
  const file = path.join(process.cwd(), "public", "brand-timeline.json");
  const timeline: { brand: string; year: number }[] = JSON.parse(
    fs.readFileSync(file, "utf8")
  );
  const anniTimeline = new Map(
    timeline.map((b) => [b.brand.toUpperCase(), b.year])
  );

  const settori: Record<string, string> = {};
  const epoche: Record<string, string> = {};

  for (const ep of episodes) {
    const marchio = brandLabel(ep);
    if (settori[marchio] && epoche[marchio]) continue;

    const settore = SETTORI[marchio];
    if (settore) settori[marchio] = settore;

    const nomeTimeline = (ALIAS_TIMELINE[marchio] ?? marchio).toUpperCase();
    const anno = anniTimeline.get(nomeTimeline) ?? ANNI_MANCANTI[marchio];
    if (anno) epoche[marchio] = epocaDaAnno(anno);
  }

  return { settori, epoche };
}
