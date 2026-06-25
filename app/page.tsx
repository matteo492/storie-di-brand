import Link from "next/link";
import { getAllEpisodes } from "@/lib/episodes";
import EpisodeSlider from "@/components/EpisodeSlider";
import BrandyGame from "@/components/BrandyGame";
import NewsletterForm from "@/components/NewsletterForm";
import PodcastSection from "@/components/PodcastSection";

const YT_VIDEOS = [
  {
    id: "F06RtRjXrCU",
    title: "Che fine ha fatto A-STYLE? Il simbolo più trasgressivo degli anni 2000",
    views: "124.765",
    main: true,
  },
  { id: "QRc5dydzwqo", title: "L'incredibile storia della Multipla: l'auto più brutta di sempre", views: "543.908" },
  { id: "ihcYNgSVsTY", title: "L'oscura scomparsa della Standa", views: "871.987" },
  { id: "BAZKEGwyKlw", title: "Legami: come delle penne carine sono diventate una mania da 100 milioni", views: "110.180" },
];

export default function Home() {
  const episodes = getAllEpisodes();

  return (
    <>
      {/* HERO */}
      <section className="hero" id="ascolta">
        <div className="hero__inner">
          <p className="eyebrow">Ogni giorno: video, podcast e live</p>
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
            <a href="mailto:info@storiedibrand.it" className="btn btn--primary">
              Contattaci
            </a>
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
              <strong>Top 20</strong>
              <span>podcast più ascoltati in Italia</span>
            </div>
            <div className="stat">
              <strong>4,8★</strong>
              <span>su 3.135 recensioni</span>
            </div>
          </div>
        </div>
      </section>

      {/* PODCAST PRINCIPALE — Storie di Brand */}
      <PodcastSection />

      {/* YOUTUBE */}
      <section
        id="youtube"
        style={{ padding: "7rem 0", background: "var(--ink)" }}
      >
        <div className="section-head" style={{ marginBottom: "2.5rem" }}>
          <div>
            <p className="eyebrow">Anche su YouTube</p>
            <h2 className="section-title">Le nostre storie in video</h2>
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
                }}
              />
              <div className="ep-card__body">
                <h3>{v.title}</h3>
                <div className="ep-card__meta">
                  <span>{v.views} visualizzazioni</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ULTIMI EPISODI */}
      <section className="episodes" id="episodi">
        <div className="section-head">
          <div>
            <p className="eyebrow">Da non perdere</p>
            <h2 className="section-title">Ultimi episodi</h2>
          </div>
          <Link href="/episodi" className="link-arrow">
            Esplora →
          </Link>
        </div>

        <EpisodeSlider episodes={episodes.slice(0, 9)} />
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
            <video controls preload="metadata">
              <source src="/live-trailer.mp4" type="video/mp4" />
            </video>
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
            <img src="/libro-cover.png" alt="Copertina del libro Persone che pensano in grande di Max Corona" />
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

      {/* NEWSLETTER */}
      <section className="newsletter" id="newsletter">
        <div className="newsletter__inner">
          <p className="eyebrow">La newsletter settimanale</p>
          <h2 className="newsletter__title">
            Il meglio della settimana,<br />
            <span className="hl">ogni venerdì</span>
          </h2>
          <p className="newsletter__sub">
            Il meglio di Storie di Brand, raccolto in una mail. Niente spam, solo
            marketing e business raccontati come piace a te.
          </p>
          <NewsletterForm />
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
