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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(ep)) }}
      />

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
            {ep.duration && (
              <div className="fact">
                <span>Durata</span>
                <strong>{ep.duration}</strong>
              </div>
            )}
            <div className="fact">
              <span>Pubblicato</span>
              <strong>{publishedLabel}</strong>
            </div>
          </div>
        </header>

        {ep.youtubeId && (
          <div className="episode__video">
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

        {ep.sources && ep.sources.length > 0 && (
          <section className="sources">
            <h2>Fonti e crediti</h2>
            <ol>
              {ep.sources.map((s, i) => (
                <li key={i}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener">
                      {s.label}
                    </a>
                  ) : (
                    s.label
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}
      </article>

      {related.length > 0 && (
        <section className="related">
          <div className="section-head">
            <div>
              <p className="eyebrow">Continua a esplorare</p>
              <h2 className="section-title">Episodi correlati</h2>
            </div>
          </div>
          <div className="episodes__grid">
            {related.map((r) => (
              <EpisodeCard key={r.slug} episode={r} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
