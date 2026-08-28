import fs from "node:fs";
import path from "node:path";

/** Una puntata del podcast "Storie di Brand" (dal feed Megaphone). */
export interface PodcastEpisode {
  id: string;
  title: string;
  excerpt: string;
  duration: string;
  date: string; // formato RSS
  image: string;
  /** MP3 della puntata (stesso URL che usano Spotify e Apple). */
  audio: string;
  year: number;
  dateLabel: string; // "7 agosto 2026"
  /** Nome della serie quando il titolo è "BRAND | Pt 2 | …" (per raggruppare). */
  series: string | null;
  /** Numero di parte, se presente. */
  part: number | null;
  /** Puntata "EXTRA" di una serie: va in coda, dopo l'ultima parte. */
  isExtra: boolean;
}

const FILE = path.join(process.cwd(), "public", "podcast-episodes.json");

/** "BRAND | Pt 2 | Sottotitolo" → serie "BRAND", parte 2. */
function parseSeries(title: string): {
  series: string | null;
  part: number | null;
  isExtra: boolean;
} {
  const partMatch = title.match(/\bp\.?\s*t\.?\s*\.?\s*(\d+)/i);
  const part = partMatch ? parseInt(partMatch[1], 10) : null;
  const isExtra = /\bextra\b/i.test(title);

  if (!title.includes("|")) return { series: null, part, isExtra };

  // Testa del titolo, ripulita da sottotitoli e marcatori di parte.
  // Attenzione: si taglia dopo i due punti o dopo un trattino ISOLATO, mai
  // dentro una parola, altrimenti "COCA-COLA" diventerebbe "COCA".
  let head = title.split("|")[0].trim();
  head = head.replace(/:\s*.*$/, "").trim();
  head = head.replace(/\s+[–—-]\s+.*$/, "").trim();
  head = head.replace(/\s*\(?\s*p\.?\s*t\.?\s*\.?\s*\d+\s*\)?\s*$/i, "").trim();

  const letters = head.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (!letters) return { series: null, part, isExtra };

  // È una serie/brand solo se la testa è prevalentemente maiuscola (es. "LANCIA")
  const uppercase = (head.match(/[A-ZÀ-Ý]/g) || []).length;
  return {
    series: uppercase / letters.length >= 0.7 ? head : null,
    part,
    isExtra,
  };
}

const MONTHS = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

/** Tutte le puntate, dalla più recente. Legge il catalogo salvato dal feed. */
export function getPodcastEpisodes(): PodcastEpisode[] {
  let raw: Omit<
    PodcastEpisode,
    "year" | "dateLabel" | "series" | "part" | "isExtra"
  >[];
  try {
    raw = JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }

  return raw
    .filter((e) => e.id)
    .map((e) => {
      const title = e.title.trim();
      const d = new Date(e.date);
      const valid = !Number.isNaN(d.getTime());
      return {
        ...e,
        title,
        year: valid ? d.getFullYear() : 0,
        dateLabel: valid
          ? `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
          : "",
        ...parseSeries(title),
      };
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

/** Anni disponibili, dal più recente (per i filtri). */
export function getPodcastYears(episodes: PodcastEpisode[]): number[] {
  return Array.from(new Set(episodes.map((e) => e.year).filter(Boolean))).sort(
    (a, b) => b - a
  );
}

/** Numeri d'insieme del catalogo, per la testata della pagina. */
export function getPodcastStats(episodes: PodcastEpisode[]) {
  const minutes = episodes.reduce((sum, e) => {
    const m = /(\d+)\s*min/.exec(e.duration || "");
    return sum + (m ? parseInt(m[1], 10) : 0);
  }, 0);
  const years = episodes.map((e) => e.year).filter(Boolean);
  return {
    total: episodes.length,
    hours: Math.round(minutes / 60),
    firstYear: years.length ? Math.min(...years) : null,
  };
}

export { brandLabel } from "./podcast-brand";
