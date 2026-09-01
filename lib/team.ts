/**
 * Le persone che fanno Storie di Brand, nell'ordine in cui compaiono nel
 * carosello. Per aggiungere o togliere qualcuno basta modificare questa lista.
 *
 * Le foto stanno in /public/team, ridotte a 800px per il web.
 */
export interface TeamMember {
  name: string;
  role: string;
  /** Foto in /public/team. Se manca, il riquadro mostra le iniziali. */
  photo?: string;
  /**
   * Punto della foto da tenere in vista quando viene ritagliata nel formato
   * della scheda (valore di `object-position`). Serve a chi non sta al centro
   * dello scatto: senza, il ritaglio centrato lo sposta di lato.
   */
  fuoco?: string;
}

export const TEAM: TeamMember[] = [
  { name: "Max Corona", role: "SDB Founder e Host", photo: "/team/max-corona.jpg" },
  {
    name: "Francesco Marchi",
    role: "Autore e Voci",
    photo: "/team/francesco-marchi.jpg",
    // Sta a sinistra nello scatto, con l'orso a destra: il ritaglio si sposta
    // per riportarlo al centro.
    fuoco: "38% center",
  },
  {
    name: "Antonio Mezzadra",
    role: "Sound designer",
    photo: "/team/antonio-mezzadra.jpg",
    fuoco: "42% center",
  },
  { name: "Matteo Vitelli", role: "Videomaker & Motion Designer", photo: "/team/matteo-vitelli.jpg" },
  { name: "Agnese Evangelista", role: "Content Specialist", photo: "/team/agnese-evangelista.jpg" },
  {
    name: "Andrea Maltagliati",
    role: "Responsabile Produzione",
    photo: "/team/andrea-maltagliati.jpg",
    fuoco: "62% center",
  },
  { name: "Viola Vicentini", role: "Producer", photo: "/team/viola-vicentini.jpg" },
  { name: "Damiano Stingone", role: "Artwork", photo: "/team/damiano-stingone.jpg" },
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
