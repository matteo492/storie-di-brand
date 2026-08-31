import fs from "fs";
import path from "path";
import BrandTimeline from "./BrandTimeline";
import LinkPiattaforme from "./LinkPiattaforme";

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
          <LinkPiattaforme />
        </div>
      </div>
    </section>
  );
}
