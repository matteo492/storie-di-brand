import fs from "fs";
import path from "path";
import BrandTimeline from "./BrandTimeline";

type BrandPoint = {
  brand: string;
  year: number;
  id: string;
  title: string;
  image: string;
  parts: number;
};

export default function PodcastSection() {
  let brands: BrandPoint[] = [];
  try {
    const jsonPath = path.join(process.cwd(), "public", "brand-timeline.json");
    brands = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  } catch {
    brands = [];
  }

  return (
    <section className="sdb-podcast" id="podcast-originale">
      <div className="sdb-podcast__inner">
        <div className="sdb-podcast__header reveal">
          <p className="eyebrow">Il podcast originale</p>
          <h2 className="sdb-podcast__title">Storie di Brand</h2>
          <p className="sdb-podcast__sub">
            Ogni episodio, una storia che non ti aspetti.<br className="sdb-podcast__br" />{" "}
            Fallimenti clamorosi, intuizioni geniali e visioni di lungo periodo.<br className="sdb-podcast__br" />{" "}
            Il podcast che ha cambiato il modo di raccontare il business in Italia.
          </p>
        </div>

        <p className="sdb-podcast__bridge">
          <span className="sdb-podcast__bridge-tag">Il gioco</span>
          Scorri la linea del tempo e scopri da che anno arriva ogni brand.
        </p>

        {brands.length > 0 && <BrandTimeline brands={brands} />}

        {/* Piattaforme */}
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
    </section>
  );
}
