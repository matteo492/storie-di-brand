import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/**
 * Modello dati di un episodio.
 * I campi marcati come opzionali hanno un default sensato in `loadEpisode`.
 */
export interface EpisodeSource {
  label: string;
  url?: string;
}

export interface EpisodeFrontmatter {
  title: string;
  slug: string;
  publishedAt: string; // ISO date, es. "2026-06-10"
  brand: string; // marchio protagonista
  sector: string; // settore (es. "Beverage")
  era: string; // epoca/decade di riferimento (es. "Anni 1880")
  youtubeUrl: string;
  duration?: string; // es. "52 min"
  excerpt: string; // sintesi breve per meta description e card
  coverColor?: string; // colore accento della card
  featured?: boolean;
  sources?: EpisodeSource[];
  relatedSlugs?: string[]; // correlati forzati a mano (opzionale)
  draft?: boolean; // se true resta fuori da liste/sitemap/indicizzazione finché non approvato
}

export interface Episode extends EpisodeFrontmatter {
  bodyHtml: string; // articolo long-form già convertito in HTML
  readingMinutes: number;
  youtubeId: string | null;
}

const EPISODES_DIR = path.join(process.cwd(), "content", "episodes");

/** Estrae l'ID video da un URL YouTube (youtu.be/ID, watch?v=ID, embed/ID). */
export function youtubeIdFromUrl(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([\w-]{11})/,
    /[?&]v=([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function readMarkdownFiles(): { slug: string; raw: string }[] {
  if (!fs.existsSync(EPISODES_DIR)) return [];
  return fs
    .readdirSync(EPISODES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => ({
      slug: file.replace(/\.md$/, ""),
      raw: fs.readFileSync(path.join(EPISODES_DIR, file), "utf8"),
    }));
}

function toEpisode(raw: string, fallbackSlug: string): Episode {
  const { data, content } = matter(raw);
  const fm = data as EpisodeFrontmatter;
  const words = content.trim().split(/\s+/).filter(Boolean).length;

  return {
    ...fm,
    slug: fm.slug || fallbackSlug,
    duration: fm.duration ?? "",
    coverColor: fm.coverColor ?? "#ff5757",
    featured: fm.featured ?? false,
    sources: fm.sources ?? [],
    relatedSlugs: fm.relatedSlugs ?? [],
    draft: fm.draft ?? false,
    bodyHtml: marked.parse(content, { async: false }) as string,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    youtubeId: youtubeIdFromUrl(fm.youtubeUrl),
  };
}

/**
 * Tutti gli episodi PUBBLICATI, dal più recente al più vecchio.
 * Le bozze (`draft: true`) sono escluse: non compaiono in homepage,
 * archivio, correlati, filtri o sitemap finché non vengono approvate.
 */
export function getAllEpisodes(): Episode[] {
  return readMarkdownFiles()
    .map(({ slug, raw }) => toEpisode(raw, slug))
    .filter((e) => !e.draft)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getEpisode(slug: string): Episode | null {
  const all = readMarkdownFiles().find((f) => f.slug === slug);
  return all ? toEpisode(all.raw, all.slug) : null;
}

export function getAllSlugs(): string[] {
  return readMarkdownFiles().map((f) => f.slug);
}

/**
 * Macro-categorie di settore: accorpano i tanti settori puntuali in pochi
 * gruppi leggibili, usati dai filtri dell'archivio e dagli episodi correlati.
 * L'ordine delle chiavi è anche l'ordine mostrato nella tendina.
 */
const SECTOR_GROUPS: Record<string, string[]> = {
  "Moda & Lusso": ["Moda", "Sneaker", "Calzature", "Lusso"],
  "Bellezza & Salute": ["Cosmetica", "Farmaceutica", "Detergenti"],
  "Cibo & Bevande": ["Dolciumi", "Bevande", "Ristorazione"],
  Tecnologia: ["Tecnologia", "Elettrodomestici"],
  "Casa & Design": ["Arredamento", "Design"],
  "Motori & Trasporti": ["Automotive", "Trasporti"],
  "Giochi & Intrattenimento": ["Giocattoli", "Giochi", "Intrattenimento"],
  "Media & Retail": ["Editoria", "Cartoleria", "Retail"],
};
const SECTOR_TO_GROUP: Record<string, string> = Object.fromEntries(
  Object.entries(SECTOR_GROUPS).flatMap(([g, list]) => list.map((s) => [s, g]))
);

/** Settore puntuale → macro-categoria (fallback: il settore stesso). */
export function sectorGroup(sector: string): string {
  return SECTOR_TO_GROUP[sector] ?? sector;
}

// Periodi storici accorpati (in ordine cronologico = ordine nella tendina).
const ERA_GROUPS = [
  { label: "Le origini (prima del 1900)", max: 1900 },
  { label: "Primo Novecento (1900–1949)", max: 1950 },
  { label: "Secondo dopoguerra (1950–1979)", max: 1980 },
  { label: "Anni '80 e '90", max: 2000 },
  { label: "Anni 2000", max: Infinity },
];

/** "Anni 1930" → periodo storico accorpato (fallback: il valore originale). */
export function eraGroup(era: string): string {
  const m = era.match(/(\d{4})/);
  if (!m) return era;
  const year = parseInt(m[1], 10);
  return (ERA_GROUPS.find((g) => year < g.max) ?? ERA_GROUPS[ERA_GROUPS.length - 1]).label;
}

/**
 * Episodi correlati: prima quelli indicati a mano, poi quelli che condividono
 * marchio, macro-settore o periodo con l'episodio corrente. Se non bastano,
 * completa con i più recenti — così ogni episodio ha sempre dei correlati.
 */
export function getRelatedEpisodes(episode: Episode, limit = 3): Episode[] {
  const all = getAllEpisodes().filter((e) => e.slug !== episode.slug);
  const scored = all.map((e) => {
    let score = 0;
    if (episode.relatedSlugs?.includes(e.slug)) score += 100;
    if (e.brand === episode.brand) score += 5;
    if (sectorGroup(e.sector) === sectorGroup(episode.sector)) score += 3;
    if (eraGroup(e.era) === eraGroup(episode.era)) score += 2;
    return { e, score };
  });
  const ranked = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.e);

  // Completa con i più recenti se i correlati "veri" sono meno del limite.
  if (ranked.length < limit) {
    const have = new Set(ranked.map((e) => e.slug));
    for (const e of all) {
      if (ranked.length >= limit) break;
      if (!have.has(e.slug)) {
        ranked.push(e);
        have.add(e.slug);
      }
    }
  }
  return ranked.slice(0, limit);
}

/** Valori per i filtri dell'archivio (settori ed epoche accorpati). */
export function getFacets() {
  const all = getAllEpisodes();
  const presentSectors = new Set(all.map((e) => sectorGroup(e.sector)));
  const presentEras = new Set(all.map((e) => eraGroup(e.era)));
  return {
    brands: Array.from(new Set(all.map((e) => e.brand))).sort(),
    sectors: Object.keys(SECTOR_GROUPS).filter((g) => presentSectors.has(g)),
    eras: ERA_GROUPS.map((g) => g.label).filter((l) => presentEras.has(l)),
  };
}
