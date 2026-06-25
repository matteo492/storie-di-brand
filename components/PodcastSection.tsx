import fs from "fs";
import path from "path";

type PodcastEp = {
  id: string;
  title: string;
  excerpt: string;
  duration: string;
  date: string;
  image: string;
};

function formatDate(raw: string) {
  try {
    return new Date(raw).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return raw;
  }
}

export default function PodcastSection() {
  let episodes: PodcastEp[] = [];
  try {
    const jsonPath = path.join(process.cwd(), "public", "podcast-episodes.json");
    episodes = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  } catch {
    episodes = [];
  }

  const latest = episodes[0] ?? null;
  const rest = episodes.slice(1, 6);

  return (
    <section className="sdb-podcast" id="podcast-originale">
      <div className="sdb-podcast__inner">

        {/* — info column — */}
        <div className="sdb-podcast__info">
          <p className="eyebrow">Il podcast originale</p>
          <h2 className="sdb-podcast__title">Storie di Brand</h2>
          <p className="sdb-podcast__sub">
            Ogni episodio, una storia che non ti aspetti. Fallimenti clamorosi,
            intuizioni geniali e visioni di lungo periodo. Il podcast che ha
            cambiato il modo di raccontare il business in Italia.
          </p>

          {latest && (
            <a
              className="sdb-podcast__latest"
              href={`https://playlist.megaphone.fm?e=${latest.id}`}
              target="_blank"
              rel="noopener"
            >
              {latest.image && (
                <img
                  className="sdb-podcast__latest-img"
                  src={latest.image}
                  alt=""
                  width={64}
                  height={64}
                />
              )}
              <div className="sdb-podcast__latest-body">
                <span className="sdb-podcast__latest-label">Ultima puntata</span>
                <strong className="sdb-podcast__latest-title">{latest.title}</strong>
                <span className="sdb-podcast__latest-meta">
                  {latest.duration && `${latest.duration} · `}
                  {formatDate(latest.date)}
                </span>
              </div>
            </a>
          )}

          {rest.length > 0 && (
            <ul className="sdb-podcast__list">
              {rest.map((ep) => (
                <li key={ep.id}>
                  <a
                    href={`https://playlist.megaphone.fm?e=${ep.id}`}
                    target="_blank"
                    rel="noopener"
                  >
                    <span className="sdb-podcast__ep-title">{ep.title}</span>
                    <span className="sdb-podcast__ep-meta">
                      {ep.duration && `${ep.duration} · `}
                      {formatDate(ep.date)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          <a
            href="https://open.spotify.com/show/1HeVZSRqmiKzpBYp7k8utS"
            target="_blank"
            rel="noopener"
            className="sdb-podcast__all"
          >
            Tutti gli episodi <span className="sdb-podcast__all-arrow">→</span>
          </a>

          <div className="sdb-podcast__platforms">
            <a
              href="https://open.spotify.com/show/1HeVZSRqmiKzpBYp7k8utS"
              target="_blank"
              rel="noopener"
              className="btn btn--ghost"
            >
              Spotify
            </a>
            <a
              href="https://music.amazon.it/podcasts/97a19029-9d86-4e82-81a1-85ee641b02b0/storie-di-brand"
              target="_blank"
              rel="noopener"
              className="btn btn--ghost"
            >
              Amazon Music
            </a>
            <a
              href="https://podcasts.apple.com/it/podcast/storie-di-brand/id1483404084"
              target="_blank"
              rel="noopener"
              className="btn btn--ghost"
            >
              Apple Podcasts
            </a>
          </div>
        </div>

        {/* — player column — */}
        <div className="sdb-podcast__player">
          <iframe
            src="https://open.spotify.com/embed/show/1HeVZSRqmiKzpBYp7k8utS?utm_source=generator&theme=0"
            width="100%"
            height="450"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Storie di Brand su Spotify"
          />
        </div>

      </div>
    </section>
  );
}
