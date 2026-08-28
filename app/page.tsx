import Link from "next/link";
import { getAllEpisodes } from "@/lib/episodes";
import { PARTNERS } from "@/lib/partners";
import Ticker from "@/components/Ticker";
import EpisodeSlider from "@/components/EpisodeSlider";
import BrandyGame from "@/components/BrandyGame";
import NewsletterForm from "@/components/NewsletterForm";
import PodcastSection from "@/components/PodcastSection";
import Typewriter from "@/components/Typewriter";
import CollabForm from "@/components/CollabForm";

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
            sono nati i brand che vivi ogni giorno.
          </p>
          <div className="hero__cta">
            <a href="#collabora" className="btn btn--primary">
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
              <strong><Typewriter text="1M+" delay={700} speed={90} /></strong>
              <span>visualizzazioni</span>
            </div>
            <div className="stat">
              <strong><Typewriter text="Top 20" delay={850} speed={75} /></strong>
              <span>podcast più ascoltati in Italia</span>
            </div>
            <div className="stat">
              <strong><Typewriter text="4,8★" delay={1000} speed={90} /></strong>
              <span>su 3.135 recensioni</span>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER — loghi grandi subito sotto l'hero (decisione call Max).
          Fa anche da sfumatura fra il nero dell'hero e il rosso del podcast. */}
      <section className="partners-band" aria-label="Brand con cui abbiamo collaborato">
        <p className="partners-band__label">Hanno scelto Storie di Brand</p>
        <Ticker items={PARTNERS} size="lg" plain />
      </section>

      {/* PODCAST PRINCIPALE — Storie di Brand + timeline */}
      <PodcastSection />

      {/* YOUTUBE */}
      <section className="episodes" id="youtube">
        <div className="section-head reveal">
          <div>
            <p className="eyebrow">Anche su YouTube</p>
            <h2 className="section-title">Le nostre storie in video</h2>
          </div>
          <Link href="/youtube" className="link-arrow">
            Tutti i video →
          </Link>
        </div>

        <EpisodeSlider episodes={episodes.slice(0, 9)} />
      </section>

      {/* GIOCHINO BRANDY — gioco di ricerca episodi */}
      <section className="podcast" id="brandy">
        <BrandyGame />
      </section>

      {/* LIVE */}
      <section className="live" id="live">
        <div className="live__inner">
          <div className="live__text reveal">
            <p className="eyebrow">Eventi dal vivo</p>
            <h2 className="live__title">
              Storie di Brand <span className="hl">sul palco</span>
            </h2>
            <p className="live__sub">
              Portiamo il racconto dei marchi fuori dallo schermo: keynote, talk e
              show dal vivo per aziende, conferenze ed eventi. Lo stesso storytelling
              che appassiona oltre 1 milione di persone, davanti al tuo pubblico.
            </p>
            <a href="#collabora" className="btn btn--primary">
              Richiedi una live
            </a>
          </div>
          <div className="live__video reveal" data-reveal-delay={120}>
            <video controls preload="metadata">
              <source src="/live-trailer.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter" id="newsletter">
        <div className="newsletter__inner reveal">
          <p className="eyebrow">La newsletter settimanale</p>
          <h2 className="newsletter__title">
            Il meglio della settimana,<br />
            <span className="hl">ogni venerdì</span>
          </h2>
          <p className="newsletter__sub">
            Il meglio di Storie di Brand, raccolto in una mail: marketing e business
            raccontati come piace a te, niente spam. Ogni iscrizione ci dà la forza di
            realizzare nuove storie, contenuti e video — sei tu a tenere in vita questo progetto.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* COLLABORA */}
      <section className="collab" id="collabora">
        <div className="collab__inner reveal">
          <p className="eyebrow">Per i brand</p>
          <h2 className="collab__title">
            Vuoi raccontare la tua storia
            <br />a oltre 1 milione di persone?
          </h2>
          <p className="collab__sub">
            Sponsorship, episodi branded e progetti su misura. Raccontaci la tua idea.
          </p>
          <CollabForm />
        </div>
      </section>
    </>
  );
}
