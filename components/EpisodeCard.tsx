import Link from "next/link";
import type { Episode } from "@/lib/episodes";

export default function EpisodeCard({
  episode,
  feature = false,
  className = "",
  revealDelay,
}: {
  episode: Episode;
  feature?: boolean;
  className?: string;
  revealDelay?: number;
}) {
  const thumbnail = episode.youtubeId
    ? `https://i.ytimg.com/vi/${episode.youtubeId}/maxresdefault.jpg`
    : undefined;

  return (
    <article
      className={`ep-card${feature ? " ep-card--feature" : ""}${
        className ? ` ${className}` : ""
      }`}
      data-reveal-delay={revealDelay}
    >
      <Link
        href={`/episodi/${episode.slug}`}
        className="ep-card__art"
        style={{
          ["--c" as string]: episode.coverColor,
          backgroundImage: thumbnail ? `url(${thumbnail})` : undefined,
        }}
        aria-label={episode.title}
      />
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
