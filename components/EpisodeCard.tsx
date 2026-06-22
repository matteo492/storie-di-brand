import Link from "next/link";
import type { Episode } from "@/lib/episodes";

export default function EpisodeCard({
  episode,
  feature = false,
}: {
  episode: Episode;
  feature?: boolean;
}) {
  return (
    <article className={`ep-card${feature ? " ep-card--feature" : ""}`}>
      <Link
        href={`/episodi/${episode.slug}`}
        className="ep-card__art"
        style={{ ["--c" as string]: episode.coverColor }}
        aria-label={episode.title}
      >
        <span className="ep-card__brand">{episode.brand}</span>
      </Link>
      <div className="ep-card__body">
        {feature && <span className="tag">In evidenza</span>}
        <h3>
          <Link href={`/episodi/${episode.slug}`}>{episode.title}</Link>
        </h3>
        {feature && <p>{episode.excerpt}</p>}
        <div className="ep-card__meta">
          <span>{episode.brand}</span>
          <span>•</span>
          <span>{episode.sector}</span>
          {episode.duration && (
            <>
              <span>•</span>
              <span>{episode.duration}</span>
            </>
          )}
        </div>
        {feature && (
          <Link href={`/episodi/${episode.slug}`} className="btn btn--primary btn--small">
            Leggi la storia
          </Link>
        )}
      </div>
    </article>
  );
}
