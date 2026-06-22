import type { Metadata } from "next";
import { getAllEpisodes, getFacets } from "@/lib/episodes";
import ArchiveExplorer, { type ArchiveItem } from "@/components/ArchiveExplorer";

export const metadata: Metadata = {
  title: "Archivio episodi",
  description:
    "Tutti gli episodi di Storie di Brand: filtra le storie dei marchi per brand, settore o epoca storica.",
  alternates: { canonical: "/episodi" },
};

export default function ArchivePage() {
  const episodes = getAllEpisodes();
  const facets = getFacets();

  // Versione leggera per il client: solo i campi che servono alle card/filtri
  const items: ArchiveItem[] = episodes.map((e) => ({
    slug: e.slug,
    title: e.title,
    brand: e.brand,
    sector: e.sector,
    era: e.era,
    duration: e.duration ?? "",
    excerpt: e.excerpt,
    coverColor: e.coverColor ?? "#ff5757",
  }));

  return (
    <main>
      <header className="page-head">
        <p className="eyebrow">L&apos;archivio</p>
        <h1>Tutte le storie</h1>
        <p>
          Ogni marchio ha un inizio, un errore, una svolta. Sfoglia l&apos;archivio
          completo e filtra per marchio, settore o epoca storica.
        </p>
      </header>

      <section className="archive">
        <ArchiveExplorer episodes={items} facets={facets} />
      </section>
    </main>
  );
}
