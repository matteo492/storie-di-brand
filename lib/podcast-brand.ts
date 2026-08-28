// Nessun accesso al filesystem qui: questo modulo viene incluso anche nel
// bundle del browser (lo usa la griglia lato client).
import type { PodcastEpisode } from "./podcast";

/**
 * Nome dell'azienda da mostrare sulle copertine, sempre in maiuscolo.
 *
 * Per quasi tutte le puntate coincide con la serie ricavata dal titolo; queste
 * poche non lo dichiarano nel titolo (o lo dichiarano in forma discorsiva),
 * quindi le mappiamo a mano.
 */
const BRAND_A_MANO: [RegExp, string][] = [
  [/assurda promozione di Mediaworld/i, "MEDIAWORLD"],
  [/pubblicit\u00e0 peggiore del secolo/i, "HOOVER"],
  [/PUMA SUEDE/i, "PUMA"],
  [/caduta di BLOCKBUSTER/i, "BLOCKBUSTER"],
  [/AIR JORDAN/i, "AIR JORDAN"],
  [/NUMBER FEVER/i, "PEPSI"],
  [/Christmas Edition/i, "COCA-COLA"],
  [/Donne di gloria/i, "DONNE DI GLORIA"],
];

export function brandLabel(ep: PodcastEpisode): string {
  const manuale = BRAND_A_MANO.find(([re]) => re.test(ep.title));
  if (manuale) return manuale[1];

  const base = ep.series ?? ep.title.split("|")[0];
  return base
    // "I SEGRETI DI COCA-COLA" → "COCA-COLA" (non tocchiamo articoli generici:
    // "LA SPORTIVA" è un marchio vero)
    .replace(/^\s*I SEGRETI DI\s+/i, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .toUpperCase();
}
