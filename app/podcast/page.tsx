import type { Metadata } from "next";
import { getPodcastEpisodes, getPodcastYears } from "@/lib/podcast";
import PodcastArchive from "@/components/PodcastArchive";

export const metadata: Metadata = {
  title: "Il podcast — tutte le puntate",
  description:
    "L'archivio completo del podcast Storie di Brand: tutte le puntate, dalla prima all'ultima. Cerca un marchio, filtra per anno e ascolta direttamente dal sito.",
  alternates: { canonical: "/podcast" },
};

const PLATFORMS = [
  { label: "Spotify", href: "https://open.spotify.com/show/1HeVZSRqmiKzpBYp7k8utS" },
  {
    label: "Amazon Music",
    href: "https://music.amazon.it/podcasts/97a19029-9d86-4e82-81a1-85ee641b02b0/storie-di-brand",
  },
  { label: "Apple Podcasts", href: "https://podcasts.apple.com/it/podcast/storie-di-brand/id1483404084" },
];

export default function PodcastPage() {
  const episodes = getPodcastEpisodes();
  const years = getPodcastYears(episodes);

  return (
    <main>
      <header className="page-head">
        <p className="eyebrow">Il podcast originale</p>
        <h1>Tutte le puntate</h1>
        <p>
          L&apos;archivio completo di Storie di Brand: {episodes.length} puntate, dal 2019 a
          oggi. Cerca un marchio, filtra per anno e ascolta direttamente da qui.
        </p>
      </header>

      <section className="pod-archive">
        <PodcastArchive episodes={episodes} years={years} />

        <div className="pod-platforms">
          <p className="pod-platforms__label">Ascolta anche su</p>
          <div className="pod-platforms__links">
            {PLATFORMS.map((p) => (
              <a
                key={p.label}
                href={p.href}
                target="_blank"
                rel="noopener"
                className="btn btn--ghost"
              >
                {p.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
