/**
 * Le persone che fanno Storie di Brand.
 *
 * ⚠️ BOZZA DA CORREGGERE: nomi e ruoli sono una prima passata, ricavati dai
 * crediti delle puntate e dal modulo di feedback interno. Correggili pure —
 * per aggiungere o togliere una persona basta modificare questa lista.
 * Le foto arriveranno più avanti: per ora ogni riquadro mostra le iniziali.
 */
export interface TeamMember {
  name: string;
  role: string;
  /** Foto (in /public). Vuoto = riquadro con iniziali. */
  photo?: string;
}

export const TEAM: TeamMember[] = [
  { name: "Max Corona", role: "Voce e autore" },
  { name: "Matteo Vitelli", role: "Produzione e sito" },
  { name: "Francesco Marchi", role: "Supporto autoriale" },
  { name: "Antonio Mezzadra", role: "Sound design" },
  { name: "Damiano Stingone", role: "Artwork e copertine" },
  { name: "Laura Moretti", role: "Voce" },
  { name: "Lucrezia", role: "Sales" },
  { name: "Andrea", role: "Produzione" },
  { name: "Eleonora", role: "A&R" },
  { name: "Ari", role: "Marketing" },
];

/** Iniziali per il riquadro segnaposto: "Max Corona" → "MC". */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
