import fs from "fs";
import path from "path";
import PodcastPlayer from "./PodcastPlayer";

type PodcastEp = {
  id: string;
  title: string;
  excerpt: string;
  duration: string;
  date: string;
  image: string;
};

export default function PodcastSection() {
  let episodes: PodcastEp[] = [];
  try {
    const jsonPath = path.join(process.cwd(), "public", "podcast-episodes.json");
    episodes = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  } catch {
    episodes = [];
  }

  return (
    <section className="sdb-podcast" id="podcast-originale">
      <div className="sdb-podcast__inner">
        <p className="eyebrow">Il podcast originale</p>
        <h2 className="sdb-podcast__title">Storie di Brand</h2>
        <p className="sdb-podcast__sub">
          Ogni episodio, una storia che non ti aspetti. Fallimenti clamorosi,
          intuizioni geniali e visioni di lungo periodo. Il podcast che ha
          cambiato il modo di raccontare il business in Italia.
        </p>
        <PodcastPlayer episodes={episodes} />
      </div>
    </section>
  );
}
