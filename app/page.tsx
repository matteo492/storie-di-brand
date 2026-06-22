import Link from "next/link";
import { getAllEpisodes } from "@/lib/episodes";
import EpisodeCard from "@/components/EpisodeCard";
import BrandyGame from "@/components/BrandyGame";

const YT_VIDEOS = [
  {
    id: "F06RtRjXrCU",
    title: "Che fine ha fatto A-STYLE? Il simbolo più trasgressivo degli anni 2000",
    main: true,
  },
  { id: "QRc5dydzwqo", title: "L'incredibile storia della Multipla: l'auto più brutta di sempre" },
  { id: "ihcYNgSVsTY", title: "L'oscura scomparsa della Standa" },
  { id: "vWYFH5Slkjs", title: "Kodak: come il re della fotografia ha inventato il digitale e ne è morto" },
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
          <p className="eyebrow">Le storie dei marchi, ogni giorno: video, podcast e live</p>
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

      {/* PODCAST BRANDY — gioco di ricerca episodi */}
      <section className="podcast" id="podcast">
        <BrandyGame />
      </section>

      {/* LIVE */}
      <section className="live" id="live">
        <div className="live__inner">
          <div className="live__text">
            <p className="eyebrow">Eventi dal vivo</p>
            <h2 className="live__title">
              Storie di Brand <span className="hl">sul palco</span>
            </h2>
            <p className="live__sub">
              Portiamo il racconto dei marchi fuori dallo schermo: keynote, talk e
              show dal vivo per aziende, conferenze ed eventi. Lo stesso storytelling
              che appassiona oltre 1 milione di persone, davanti al tuo pubblico.
            </p>
            <a href="mailto:info@storiedibrand.it?subject=Richiesta%20evento%20live" className="btn btn--primary">
              Richiedi una live
            </a>
          </div>
          <div className="live__video">
            <iframe
              src="https://drive.google.com/file/d/1Ugd7L9E8_DlksNjSWqUHpYKOXNsSLtky/preview"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Storie di Brand — Live"
            />
          </div>
        </div>
      </section>

      {/* LIBRO */}
      <section className="book" id="libro">
        <div className="book__inner">
          <a
            href="https://www.amazon.it/Persone-che-pensano-grande-raccontato-ebook/dp/B0CG9FT3DJ/"
            target="_blank"
            rel="noopener"
            className="book__cover"
            aria-label="Persone che pensano in grande — acquista su Amazon"
          >
            <span className="book__cover-label">Persone che pensano in grande</span>
            <span className="book__cover-author">Max Corona</span>
          </a>
          <div className="book__text">
            <p className="eyebrow">Il libro di Max Corona</p>
            <h2 className="book__title">Persone che pensano in grande</h2>
            <p className="book__sub">
              Le storie e le intuizioni delle menti che hanno cambiato il modo di fare
              impresa, raccontate dalla voce di Storie di Brand. Un viaggio tra coraggio,
              visione e idee fuori dagli schemi.
            </p>
            <a
              href="https://www.amazon.it/Persone-che-pensano-grande-raccontato-ebook/dp/B0CG9FT3DJ/"
              target="_blank"
              rel="noopener"
              className="btn btn--primary"
            >
              Acquista su Amazon
            </a>
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
