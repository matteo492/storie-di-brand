/**
 * I marchi con cui abbiamo collaborato, mostrati nel nastro scorrevole.
 *
 * `logo` è il file in /public/partners: SVG monocromatico reso con una
 * maschera, così tutti prendono lo stesso colore del testo.
 * `ratio` è la proporzione larghezza/altezza del file, usata per dare a ogni
 * logo lo stesso "peso ottico" invece della stessa scatola: un marchio largo
 * viene tenuto più basso, uno verticale più alto.
 *
 * Per aggiungerne uno: metti l'SVG in public/partners e aggiungi una riga.
 * Senza `logo` il nastro mostra il nome scritto.
 */
export interface Partner {
  name: string;
  logo?: string;
  ratio?: number;
  /** Ritocco fine della dimensione (1 = neutro), per pareggiare a occhio. */
  scale?: number;
  /** Pagina del case study. Quando c'e', la scheda diventa cliccabile. */
  href?: string;
  /** Immagine di copertina in /public/collaborazioni/. Finché non c'è, la
   *  scheda mostra il logo su un pannello. */
  immagine?: string;
  /** Punto dell'immagine da tenere in vista quando viene ritagliata nel
   *  formato della scheda (valore di `background-position`, es. "50% 100%").
   *  Serve a non tagliare il soggetto: senza, si centra. */
  fuoco?: string;
  /** Le due righe sotto la scheda. Segnaposto finché non arrivano i testi. */
  descrizione?: string;
}

/** Testo di servizio: va sostituito marchio per marchio insieme alle immagini. */
export const DESCRIZIONE_SEGNAPOSTO =
  "Descrizione del progetto: due righe su obiettivo, formato e risultato della collaborazione.";

/**
 * Altezza e larghezza di un logo a parita' di "inchiostro" percepito: un
 * marchio largo resta piu' basso, uno verticale piu' alto. Cosi' nella griglia
 * (e nel nastro) nessun logo schiaccia gli altri.
 */
const AREE = {
  nastro: { area: 2400, min: 20, max: 40 },
  muro: { area: 4000, min: 23, max: 50 },
} as const;

export type LogoScale = keyof typeof AREE;

export function logoSize(kind: LogoScale, ratio = 3.4, scale = 1) {
  const { area, min, max } = AREE[kind];
  const h = Math.min(max, Math.max(min, Math.sqrt(area / ratio))) * scale;
  return { h: Math.round(h), w: Math.round(h * ratio) };
}

export const PARTNERS: Partner[] = [
  {
    name: "JUVENTUS",
    logo: "juventus",
    ratio: 0.63,
    immagine: "juventus.jpg",
    // Il soggetto sta in basso: tenendo il fondo si centra nella scheda.
    fuoco: "50% 100%",
  },
  { name: "MASERATI", logo: "maserati", ratio: 2.46, immagine: "maserati.jpg" },
  { name: "WWF", logo: "wwf", ratio: 0.67, immagine: "wwf.jpg" },
  { name: "HAIER", logo: "haier", ratio: 3.22, scale: 0.82 },
  { name: "REVOLUT", logo: "revolut", ratio: 4.53, scale: 0.82 },
  { name: "NORDVPN", logo: "nordvpn", ratio: 4.61 },
  { name: "SURFSHARK", logo: "surfshark", ratio: 4.31 },
  { name: "ODOO", logo: "odoo", ratio: 3.14, scale: 0.82 },
  { name: "FINOM", logo: "finom", ratio: 3.42, scale: 0.82 },
  { name: "HIGGSFIELD", logo: "higgsfield", ratio: 4.89 },
  { name: "JACK DANIEL'S", logo: "jack-daniels", ratio: 2.94 },
];
