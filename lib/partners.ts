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
}

export const PARTNERS: Partner[] = [
  { name: "JUVENTUS", logo: "juventus", ratio: 0.63 },
  { name: "MASERATI", logo: "maserati", ratio: 2.46 },
  { name: "WWF", logo: "wwf", ratio: 0.67 },
  { name: "HAIER", logo: "haier", ratio: 3.22, scale: 0.82 },
  { name: "REVOLUT", logo: "revolut", ratio: 4.53, scale: 0.82 },
  { name: "NORDVPN", logo: "nordvpn", ratio: 4.61 },
  { name: "SURFSHARK", logo: "surfshark", ratio: 4.31 },
  { name: "ODOO", logo: "odoo", ratio: 3.14, scale: 0.82 },
  { name: "FINOM", logo: "finom", ratio: 3.42, scale: 0.82 },
  { name: "HIGGSFIELD", logo: "higgsfield", ratio: 4.89 },
  { name: "JACK DANIEL'S", logo: "jack-daniels", ratio: 2.94 },
];
