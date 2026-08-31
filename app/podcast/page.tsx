import type { Metadata } from "next";
import { getPodcastEpisodes, getPodcastStats } from "@/lib/podcast";
import { classificaMarchi } from "@/lib/podcast-classifica";
import PodcastArchive from "@/components/PodcastArchive";
import LinkPiattaforme from "@/components/LinkPiattaforme";

export const metadata: Metadata = {
  title: "Il podcast — tutte le puntate",
  description:
    "L'archivio completo del podcast Storie di Brand: tutte le puntate, dalla prima all'ultima. Cerca un marchio, filtra per settore o epoca e ascolta direttamente dal sito.",
  alternates: { canonical: "/podcast" },
};

export default function PodcastPage() {
  const episodes = getPodcastEpisodes();
  const { settori, epoche } = classificaMarchi(episodes);
  const stats = getPodcastStats(episodes);

  return (
    <main className="pod-page">
      <header className="page-head pod-head">
        <p className="eyebrow">Il podcast originale</p>
        <h1>Tutte le puntate</h1>
        <p>
          Ogni marchio che conosci ha un inizio che non immagini. Cerca un
          brand, scegli un anno e ascolta direttamente da qui.
        </p>

        <dl className="pod-stats">
          <div>
            <dt>Numero di puntate</dt>
            <dd>{stats.total}</dd>
          </div>
          <div>
            <dt>Ore di racconto</dt>
            <dd>{stats.hours}</dd>
          </div>
          {stats.firstYear && (
            <div>
              <dt>Anno di nascita</dt>
              <dd>{stats.firstYear}</dd>
            </div>
          )}
        </dl>
      </header>

      <section className="pod-archive">
        <PodcastArchive episodes={episodes} settori={settori} epoche={epoche} />

        <div className="pod-platforms">
          <p className="pod-platforms__label">Ascolta anche su</p>
          <div className="pod-platforms__links">
            <LinkPiattaforme />
          </div>
        </div>
      </section>
    </main>
  );
}
