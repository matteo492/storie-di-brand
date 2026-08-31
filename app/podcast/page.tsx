import type { Metadata } from "next";
import { getPodcastEpisodes, getPodcastYears, getPodcastStats } from "@/lib/podcast";
import PodcastArchive from "@/components/PodcastArchive";
import { PIATTAFORME } from "@/lib/piattaforme";

export const metadata: Metadata = {
  title: "Il podcast — tutte le puntate",
  description:
    "L'archivio completo del podcast Storie di Brand: tutte le puntate, dalla prima all'ultima. Cerca un marchio, filtra per anno e ascolta direttamente dal sito.",
  alternates: { canonical: "/podcast" },
};

export default function PodcastPage() {
  const episodes = getPodcastEpisodes();
  const years = getPodcastYears(episodes);
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
        <PodcastArchive episodes={episodes} years={years} />

        <div className="pod-platforms">
          <p className="pod-platforms__label">Ascolta anche su</p>
          <div className="pod-platforms__links">
            {PIATTAFORME.map((p) => (
              <a
                key={p.nome}
                href={p.href}
                target="_blank"
                rel="noopener"
                className="btn btn--ghost pod-platforms__link"
                /* Su mobile resta solo il marchio: il nome serve comunque a
                   chi naviga con uno screen reader. */
                aria-label={p.nome}
              >
                <span className="pod-platforms__marchio">{p.icona}</span>
                <span className="pod-platforms__nome">{p.nome}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
