import Link from "next/link";
import { getAllEpisodes } from "@/lib/episodes";
import EpisodeCard from "@/components/EpisodeCard";

const YT_VIDEOS = [
  {
    id: "F06RtRjXrCU",
    title: "Che fine ha fatto A-STYLE? Il simbolo più trasgressivo degli anni 2000",
    main: true,
  },
  { id: "QRc5dydzwqo", title: "L'incredibile storia della Multipla: l'auto più brutta di sempre" },
  { id: "ihcYNgSVsTY", title: "L'oscura scomparsa della Standa" },
];

export default function Home() {
  const episodes = getAllEpisodes();
  const [feature, ...rest] = episodes;
  const latest = rest.slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="hero" id="ascolta">
        <div className="hero__inner">
          <p className="eyebrow">La docu-serie sulle storie dei brand</p>
          <h1 className="hero__title">
            Le incredibili storie
            <br />
            dietro i <span className="hl">marchi</span>
            <br />
            più famosi del mondo.
          </h1>
          <p className="hero__sub">
            Errori clamorosi, intuizioni geniali e colpi di fortuna. Riviviamo come
            sono nati i brand che usi ogni giorno.
          </p>
          <div className="hero__cta">
            <Link href="/episodi" className="btn btn--primary">
              Esplora gli episodi
            </Link>
            <a
              href="https://www.youtube.com/@StoriediBrand"
              target="_blank"
              rel="noopener"
              className="btn btn--ghost"
            >
              ▶ Guarda su YouTube
            </a>
          </div>
          <div className="hero__stats">
            <div className="stat">
              <strong>1M+</strong>
              <span>visualizzazioni</span>
            </div>
            <div className="stat">
              <strong>{episodes.length}</strong>
              <span>episodi</span>
            </div>
            <div className="stat">
              <strong>4.9★</strong>
              <span>su 300+ recensioni</span>
            </div>
          </div>
        </div>
      </section>

      {/* ULTIMI EPISODI */}
      <section className="episodes" id="episodi">
        <div className="section-head">
          <div>
            <p className="eyebrow">Gli ultimi</p>
            <h2 className="section-title">Episodi recenti</h2>
          </div>
          <Link href="/episodi" className="link-arrow">
            Tutto l&apos;archivio →
          </Link>
        </div>

        <div className="episodes__grid">
          {feature && <EpisodeCard episode={feature} feature />}
          {latest.map((ep) => (
            <EpisodeCard key={ep.slug} episode={ep} />
          ))}
        </div>
      </section>

      {/* YOUTUBE */}
      <section
        id="youtube"
        style={{ padding: "7rem 0", background: "var(--ink)" }}
      >
        <div className="section-head" style={{ marginBottom: "2.5rem" }}>
          <div>
            <p className="eyebrow">Anche su YouTube</p>
            <h2 className="section-title">Guardaci su YouTube</h2>
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
          {YT_VIDEOS.map((v) => (
            <a
              key={v.id}
              href={`https://youtu.be/${v.id}`}
              target="_blank"
              rel="noopener"
              className={`ep-card${v.main ? " ep-card--feature" : ""}`}
            >
              <div
                className="ep-card__art"
                style={{
                  backgroundImage: `url(https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  minHeight: v.main ? 320 : 200,
                }}
              />
              <div className="ep-card__body">
                <h3>{v.title}</h3>
                <div className="ep-card__meta">
                  <span>Guarda su YouTube</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* PODCAST BRANDY */}
      <section className="podcast" id="podcast">
        <div className="podcast__inner">
          <div>
            <p className="eyebrow">Il podcast quotidiano</p>
            <h2 className="podcast__title">
              <span className="hl">Brandy</span>
            </h2>
            <p className="podcast__sub">
              Il podcast di Storie di Brand: ogni giorno, <strong>dal lunedì al venerdì</strong>, un distillato di fatti curiosi
              dal magico mondo del marketing e del business.
            </p>
            <ul className="podcast__list">
              <li>Chi ha inventato il divano letto?</li>
              <li>Quali sono le campagne pubblicitarie più famose della storia?</li>
              <li>Perché in Thailandia tutti odiano la Pepsi?</li>
              <li>Questo e molto altro nel tuo bicchiere di Brandy quotidiano.</li>
            </ul>
            <a
              href="https://open.spotify.com/show/6aRhnsN2n7a3XvdR9XNgAC"
              target="_blank"
              rel="noopener"
              className="btn btn--primary"
            >
              Ascolta il podcast
            </a>
          </div>
          <div className="podcast__embed">
            <iframe
              src="https://open.spotify.com/embed/show/6aRhnsN2n7a3XvdR9XNgAC?utm_source=generator&theme=0"
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="BRANDY — il podcast di Storie di Brand su Spotify"
            />
          </div>
        </div>
      </section>

      {/* COLLABORA */}
      <section className="collab" id="collabora">
        <div className="collab__inner">
          <p className="eyebrow">Per i brand</p>
          <h2 className="collab__title">
            Vuoi raccontare la tua storia
            <br />a oltre 1 milione di persone?
          </h2>
          <p className="collab__sub">
            Collabora con Storie di Brand: sponsorship, episodi branded e progetti su misura.
          </p>
          <a href="mailto:info@storiedibrand.it" className="btn btn--primary btn--big">
            Collabora con noi
          </a>
        </div>
      </section>
    </>
  );
}
