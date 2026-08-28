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
}

export const TEAM: TeamMember[] = [
  { name: "Max Corona", role: "SDB Founder e Host", photo: "/team/max-corona.jpg" },
  { name: "Francesco Marchi", role: "Autore e Voci", photo: "/team/francesco-marchi.jpg" },
  { name: "Antonio Mezzadra", role: "Sound designer", photo: "/team/antonio-mezzadra.jpg" },
  { name: "Matteo Vitelli", role: "Videomaker & Motion Designer", photo: "/team/matteo-vitelli.jpg" },
  { name: "Agnese Evangelista", role: "Content Specialist", photo: "/team/agnese-evangelista.jpg" },
  { name: "Andrea Maltagliati", role: "Responsabile Produzione", photo: "/team/andrea-maltagliati.jpg" },
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
