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
    bodyHtml: marked.parse(content, { async: false }) as string,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    youtubeId: youtubeIdFromUrl(fm.youtubeUrl),
  };
}

/** Tutti gli episodi, dal più recente al più vecchio. */
export function getAllEpisodes(): Episode[] {
  return readMarkdownFiles()
    .map(({ slug, raw }) => toEpisode(raw, slug))
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
 * Episodi correlati: prima quelli indicati a mano, poi quelli che
 * condividono marchio, settore o epoca con l'episodio corrente.
 */
export function getRelatedEpisodes(episode: Episode, limit = 3): Episode[] {
  const all = getAllEpisodes().filter((e) => e.slug !== episode.slug);
  const scored = all.map((e) => {
    let score = 0;
    if (episode.relatedSlugs?.includes(e.slug)) score += 100;
    if (e.brand === episode.brand) score += 5;
    if (e.sector === episode.sector) score += 3;
    if (e.era === episode.era) score += 2;
    return { e, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.e);
}

/** Valori unici per i filtri dell'archivio. */
export function getFacets() {
  const all = getAllEpisodes();
  const uniq = (arr: string[]) => Array.from(new Set(arr)).sort();
  return {
    brands: uniq(all.map((e) => e.brand)),
    sectors: uniq(all.map((e) => e.sector)),
    eras: uniq(all.map((e) => e.era)),
  };
}
