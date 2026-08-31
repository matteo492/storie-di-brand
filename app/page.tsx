import Link from "next/link";
import { getAllEpisodes } from "@/lib/episodes";
import AncoraDolce from "@/components/AncoraDolce";
import LiveBanner from "@/components/LiveBanner";
import PartnerSlider from "@/components/PartnerSlider";
import Universe from "@/components/Universe";
import EpisodeSlider from "@/components/EpisodeSlider";
import BrandyGame from "@/components/BrandyGame";
import NewsletterForm from "@/components/NewsletterForm";
import PodcastSection from "@/components/PodcastSection";
import Typewriter from "@/components/Typewriter";
import CollabForm from "@/components/CollabForm";

export default function Home() {
  const episodes = getAllEpisodes();

  return (
    <div className="home-page">
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
            <AncoraDolce href="#collabora" className="btn btn--primary">
              Contattaci
            </AncoraDolce>
            {/* Porta alla sezione che spiega il progetto invece di mandare
                fuori dal sito alla prima schermata. */}
            <AncoraDolce href="#progetto" className="btn btn--ghost">
              Scopri di più
            </AncoraDolce>
          </div>
          <div className="hero__stats">
            <div className="stat">
              <strong><Typewriter text="26M+" delay={700} speed={90} /></strong>
              <span>ascolti e visualizzazioni</span>
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

      {/* L'UNIVERSO — cosa è Storie di Brand e su quali piattaforme vive */}
      <Universe />

      {/* PARTNER — la vetrina B2B: i marchi con cui abbiamo lavorato, ognuno
          porta al proprio case study. */}
      <section className="partners" id="collaborazioni">
        <div className="partners__head">
          <p className="eyebrow">Le collaborazioni</p>
          <h2 className="partners__title">Hanno scelto Storie di Brand</h2>
          <p className="partners__sub">
            Dietro ogni brand, c&apos;è un progetto costruito insieme: in video, in
            podcast o dal vivo. Ogni marchio ha la sua storia. Scoprila ora.
          </p>
        </div>
        <PartnerSlider />
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
        <LiveBanner />
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter" id="newsletter">
        <div className="newsletter__inner reveal">
          <p className="eyebrow">La newsletter</p>
          <h2 className="newsletter__title">
            Il meglio della settimana,<br />
            <span className="hl">ogni venerdì</span>
          </h2>
          <p className="newsletter__sub">
            Ogni venerdì ci ritroviamo in una mail: le storie che nel podcast
            non entrano e quelle che stiamo preparando. Sei dei nostri?
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
            <br />a oltre 2 milioni di persone?
          </h2>
          <p className="collab__sub">
            Sponsorship, episodi branded e progetti su misura. Raccontaci la tua idea.
          </p>
          <CollabForm />
        </div>
      </section>
    </div>
  );
}
