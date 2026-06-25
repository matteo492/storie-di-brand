"use client";

import { useState } from "react";

type PodcastEp = {
  id: string;
  title: string;
  excerpt: string;
  duration: string;
  date: string;
  image: string;
};

function formatDate(raw: string) {
  try {
    return new Date(raw).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return raw;
  }
}

export default function PodcastPlayer({ episodes }: { episodes: PodcastEp[] }) {
  const [selectedId, setSelectedId] = useState(episodes[0]?.id ?? "");
  const [expanded, setExpanded] = useState(false);

  const latest = episodes[0] ?? null;
  const first5 = episodes.slice(1, 6);
  const next5 = episodes.slice(6, 11);

  return (
    <>
      {/* Player embed */}
      <div className="sdb-podcast__player">
        <iframe
          key={selectedId}
          src={`https://playlist.megaphone.fm?e=${selectedId}`}
          width="100%"
          height="240"
          scrolling="no"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Player podcast"
          style={{ overflow: "hidden" }}
        />
      </div>

      {/* Ultima puntata */}
      {latest && (
        <button
          className={`sdb-podcast__latest${selectedId === latest.id ? " active" : ""}`}
          onClick={() => setSelectedId(latest.id)}
        >
          {latest.image && (
            <img
              className="sdb-podcast__latest-img"
              src={latest.image}
              alt=""
              width={64}
              height={64}
            />
          )}
          <div className="sdb-podcast__latest-body">
            <span className="sdb-podcast__latest-label">Ultima puntata</span>
            <strong className="sdb-podcast__latest-title">{latest.title}</strong>
            <span className="sdb-podcast__latest-meta">
              {latest.duration && `${latest.duration} · `}
              {formatDate(latest.date)}
            </span>
          </div>
        </button>
      )}

      {/* Lista episodi — sempre visibili */}
      <ul className="sdb-podcast__list">
        {first5.map((ep) => (
          <li key={ep.id}>
            <button
              className={selectedId === ep.id ? "active" : ""}
              onClick={() => setSelectedId(ep.id)}
            >
              <span className="sdb-podcast__ep-title">{ep.title}</span>
              <span className="sdb-podcast__ep-meta">
                {ep.duration && `${ep.duration} · `}
                {formatDate(ep.date)}
              </span>
            </button>
          </li>
        ))}

        {/* Episodi extra — animati */}
        <div className={`sdb-podcast__more${expanded ? " open" : ""}`}>
          {next5.map((ep) => (
            <li key={ep.id}>
              <button
                className={selectedId === ep.id ? "active" : ""}
                onClick={() => setSelectedId(ep.id)}
              >
                <span className="sdb-podcast__ep-title">{ep.title}</span>
                <span className="sdb-podcast__ep-meta">
                  {ep.duration && `${ep.duration} · `}
                  {formatDate(ep.date)}
                </span>
              </button>
            </li>
          ))}
        </div>
      </ul>

      {/* CTA espandi / scopri altro + bottone collapse */}
      <div className="sdb-podcast__cta-row">
        {!expanded ? (
          <button
            className="link-arrow sdb-podcast__expand-btn"
            onClick={() => setExpanded(true)}
          >
            Scopri di più ↓
          </button>
        ) : (
          <>
            <a
              href="https://open.spotify.com/show/1HeVZSRqmiKzpBYp7k8utS"
              target="_blank"
              rel="noopener"
              className="link-arrow"
            >
              Scopri le altre storie →
            </a>
            <button
              className="sdb-podcast__collapse-btn"
              aria-label="Chiudi lista"
              onClick={() => setExpanded(false)}
            >
              ↑
            </button>
          </>
        )}
      </div>

      {/* Piattaforme */}
      <div className="sdb-podcast__platforms">
        <a
          href="https://open.spotify.com/show/1HeVZSRqmiKzpBYp7k8utS"
          target="_blank"
          rel="noopener"
          className="btn btn--ghost"
        >
          Spotify
        </a>
        <a
          href="https://music.amazon.it/podcasts/97a19029-9d86-4e82-81a1-85ee641b02b0/storie-di-brand"
          target="_blank"
          rel="noopener"
          className="btn btn--ghost"
        >
          Amazon Music
        </a>
        <a
          href="https://podcasts.apple.com/it/podcast/storie-di-brand/id1483404084"
          target="_blank"
          rel="noopener"
          className="btn btn--ghost"
        >
          Apple Podcasts
        </a>
      </div>
    </>
  );
}
