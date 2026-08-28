import type { Metadata } from "next";
import { getAllEpisodes, getFacets, sectorGroup, eraGroup } from "@/lib/episodes";
import { YT_VIDEOS, getYoutubeStats } from "@/lib/youtube";
import ArchiveExplorer, { type ArchiveItem } from "@/components/ArchiveExplorer";

export const metadata: Metadata = {
  title: "YouTube — le storie in video",
  description:
    "Il meglio del canale YouTube di Storie di Brand: i video più visti e l'archivio completo delle storie dei marchi, filtrabile per settore ed epoca.",
  alternates: { canonical: "/youtube" },
};

export default function YouTubePage() {
  const episodes = getAllEpisodes();
  const facets = getFacets();
  const ytStats = getYoutubeStats();

  const items: ArchiveItem[] = episodes.map((e) => ({
    slug: e.slug,
    title: e.title,
    brand: e.brand,
    sector: e.sector,
    era: e.era,
    sectorGroup: sectorGroup(e.sector),
    eraGroup: eraGroup(e.era),
    coverColor: e.coverColor ?? "#ff5757",
    thumbnail: e.youtubeId
      ? `https://i.ytimg.com/vi/${e.youtubeId}/maxresdefault.jpg`
      : null,
  }));

  return (
    <main>
      <header className="page-head">
        <p className="eyebrow">Il canale YouTube</p>
        <h1>Le nostre storie in video</h1>
        <p>
          Ogni marchio ha un inizio, un errore, una svolta. Guarda i video più visti
          e sfoglia l&apos;archivio completo delle storie, filtrando per settore o epoca.
        </p>
      </header>

      {/* Video in evidenza */}
      <section className="yt-page-highlights">
        <div className="section-head reveal">
          <div>
            <p className="eyebrow">Top videos</p>
            <h2 className="section-title">Da non perdere</h2>
          </div>
          <a
            href="https://www.youtube.com/@StoriediBrand"
            target="_blank"
            rel="noopener"
            className="link-arrow"
          >
            @StoriediBrand →
          </a>
        </div>
        <div className="episodes__grid">
          {YT_VIDEOS.map((v, i) => (
            <a
              key={v.id}
              href={`https://youtu.be/${v.id}`}
              target="_blank"
              rel="noopener"
              className={`ep-card reveal${v.main ? " ep-card--feature" : ""}`}
              data-reveal-delay={i * 90}
            >
              <div
                className="ep-card__art"
                style={{
                  backgroundImage: `url(https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg)`,
                }}
              />
              <div className="ep-card__body">
                <h3>{v.title}</h3>
                <div className="ep-card__meta">
                  {ytStats[v.id] && <span>{ytStats[v.id]} visualizzazioni</span>}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Archivio completo con filtri */}
      <section className="archive">
        <div className="section-head reveal">
          <div>
            <p className="eyebrow">L&apos;archivio</p>
            <h2 className="section-title">Tutte le storie</h2>
          </div>
        </div>
        <ArchiveExplorer episodes={items} facets={facets} />
      </section>
    </main>
  );
}
