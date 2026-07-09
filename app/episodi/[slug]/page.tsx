import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllSlugs,
  getEpisode,
  getRelatedEpisodes,
  type Episode,
} from "@/lib/episodes";
import { SITE_URL } from "@/lib/site";
import EpisodeCard from "@/components/EpisodeCard";

type Params = { slug: string };

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ep = getEpisode(slug);
  if (!ep) return {};
  const url = `/episodi/${ep.slug}`;
  const ogImage = ep.youtubeId
    ? `https://i.ytimg.com/vi/${ep.youtubeId}/maxresdefault.jpg`
    : undefined;

  return {
    title: ep.title,
    description: ep.excerpt,
    alternates: { canonical: url },
    // Le bozze non vanno indicizzate: restano visibili solo a chi ha il link diretto (per la revisione).
    robots: ep.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title: ep.title,
      description: ep.excerpt,
      url,
      publishedTime: ep.publishedAt,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: ep.title,
      description: ep.excerpt,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

function jsonLd(ep: Episode) {
  const url = `${SITE_URL}/episodi/${ep.slug}`;
  const thumb = ep.youtubeId
    ? `https://i.ytimg.com/vi/${ep.youtubeId}/maxresdefault.jpg`
    : undefined;

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ep.title,
    description: ep.excerpt,
    datePublished: ep.publishedAt,
    inLanguage: "it-IT",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "Storie di Brand" },
    publisher: {
      "@type": "Organization",
      name: "Storie di Brand",
      url: SITE_URL,
    },
    about: ep.brand,
    articleSection: ep.sector,
    image: thumb ? [thumb] : undefined,
  };

  const video = ep.youtubeId
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: ep.title,
        description: ep.excerpt,
        uploadDate: ep.publishedAt,
        thumbnailUrl: thumb ? [thumb] : undefined,
        contentUrl: ep.youtubeUrl,
        embedUrl: `https://www.youtube.com/embed/${ep.youtubeId}`,
      }
    : null;

  return [article, video].filter(Boolean);
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const ep = getEpisode(slug);
  if (!ep) notFound();

  const related = getRelatedEpisodes(ep);
  const publishedLabel = new Date(ep.publishedAt).toLocaleDateString("it-IT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="episode">
      {/* JSON-LD solo per gli articoli pubblicati: niente structured data sulle bozze. */}
      {!ep.draft && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(ep)) }}
        />
      )}

      {ep.draft && (
        <div className="episode__draft-banner">
          Bozza · non pubblicata — visibile solo a te. Approva per pubblicarla.
        </div>
      )}

      <article>
        <header className="episode__hero">
          <div className="episode__meta-top">
            <Link href="/episodi" className="link-arrow">
              ← Archivio
            </Link>
            <span className="tag">{ep.sector}</span>
          </div>
          <h1 className="episode__title">{ep.title}</h1>
          <p className="episode__excerpt">{ep.excerpt}</p>

          <div className="episode__factbar">
            <div className="fact">
              <span>Marchio</span>
              <strong>{ep.brand}</strong>
            </div>
            <div className="fact">
              <span>Settore</span>
              <strong>{ep.sector}</strong>
            </div>
            <div className="fact">
              <span>Epoca</span>
              <strong>{ep.era}</strong>
            </div>
            <div className="fact">
              <span>Pubblicato</span>
              <strong>{publishedLabel}</strong>
            </div>
          </div>
        </header>

        {ep.youtubeId && (
          <div className="episode__video reveal">
            <div className="video-embed">
              <iframe
                src={`https://www.youtube.com/embed/${ep.youtubeId}`}
                title={ep.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        )}

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: ep.bodyHtml }}
        />
      </article>

      {related.length > 0 && (
        <section className="related">
          <div className="section-head reveal">
            <div>
              <p className="eyebrow">Continua a esplorare</p>
              <h2 className="section-title">Episodi correlati</h2>
            </div>
          </div>
          <div className="episodes__grid">
            {related.map((r, i) => (
              <EpisodeCard
                key={r.slug}
                episode={r}
                className="reveal"
                revealDelay={i * 90}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
