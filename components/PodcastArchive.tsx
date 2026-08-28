"use client";

import { useMemo, useState } from "react";
import type { PodcastEpisode } from "@/lib/podcast";

const PAGE_SIZE = 24;

/** Normalizza per la ricerca: minuscolo, senza accenti e punteggiatura. */
function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function PodcastArchive({
  episodes,
  years,
}: {
  episodes: PodcastEpisode[];
  years: number[];
}) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [limit, setLimit] = useState(PAGE_SIZE);

  // Indice di ricerca precalcolato: titolo + descrizione
  const indexed = useMemo(
    () => episodes.map((e) => ({ ep: e, hay: norm(`${e.title} ${e.excerpt}`) })),
    [episodes]
  );

  const filtered = useMemo(() => {
    const terms = norm(query).split(" ").filter(Boolean);
    return indexed
      .filter(({ ep, hay }) => {
        if (year && ep.year !== year) return false;
        return terms.every((t) => hay.includes(t));
      })
      .map((x) => x.ep);
  }, [indexed, query, year]);

  const visible = filtered.slice(0, limit);
  const hasFilters = query.trim() !== "" || year !== null;

  const reset = () => {
    setQuery("");
    setYear(null);
    setLimit(PAGE_SIZE);
  };

  return (
    <>
      <div className="pod-controls">
        <div className="pod-search">
          <span className="pod-search__icon" aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE_SIZE);
            }}
            placeholder="Cerca un brand o una puntata — es. Nike, Lego, Ferrari…"
            aria-label="Cerca tra le puntate"
          />
        </div>

        <div className="pod-years" role="group" aria-label="Filtra per anno">
          <button
            type="button"
            className={`pod-year${year === null ? " is-sel" : ""}`}
            onClick={() => {
              setYear(null);
              setLimit(PAGE_SIZE);
            }}
          >
            Tutti
          </button>
          {years.map((y) => (
            <button
              key={y}
              type="button"
              className={`pod-year${year === y ? " is-sel" : ""}`}
              onClick={() => {
                setYear(year === y ? null : y);
                setLimit(PAGE_SIZE);
              }}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <p className="pod-count">
        {filtered.length} puntat{filtered.length === 1 ? "a" : "e"}
        {hasFilters && (
          <button type="button" className="pod-reset" onClick={reset}>
            ✕ Azzera
          </button>
        )}
      </p>

      {filtered.length === 0 ? (
        <p className="pod-empty">
          Nessuna puntata trovata. Prova con un altro nome — per esempio{" "}
          <button type="button" className="pod-suggest" onClick={() => setQuery("Nike")}>
            Nike
          </button>{" "}
          o{" "}
          <button type="button" className="pod-suggest" onClick={() => setQuery("Lego")}>
            Lego
          </button>
          .
        </p>
      ) : (
        <ul className="pod-list">
          {visible.map((ep) => {
            const isOpen = playing === ep.id;
            return (
              <li key={ep.id} className={`pod-item${isOpen ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="pod-item__main"
                  onClick={() => setPlaying(isOpen ? null : ep.id)}
                  aria-expanded={isOpen}
                >
                  <span className="pod-item__cover">
                    {ep.image && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={ep.image} alt="" loading="lazy" width={112} height={112} />
                    )}
                    <span className="pod-item__play" aria-hidden="true">
                      {isOpen ? "❙❙" : "▶"}
                    </span>
                  </span>
                  <span className="pod-item__body">
                    {/* Serie e numero di parte sono già nel titolo: qui basta data e durata */}
                    <span className="pod-item__meta">
                      {ep.dateLabel}
                      {ep.duration && ` · ${ep.duration}`}
                    </span>
                    <span className="pod-item__title">{ep.title}</span>
                    {ep.excerpt && <span className="pod-item__excerpt">{ep.excerpt}</span>}
                  </span>
                </button>

                {isOpen && (
                  <div className="pod-item__player">
                    <iframe
                      src={`https://playlist.megaphone.fm?e=${ep.id}`}
                      width="100%"
                      height="200"
                      frameBorder="0"
                      scrolling="no"
                      allow="autoplay"
                      loading="lazy"
                      title={`Ascolta — ${ep.title}`}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {visible.length < filtered.length && (
        <div className="pod-more">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setLimit((l) => l + PAGE_SIZE)}
          >
            Mostra altre puntate ({filtered.length - visible.length})
          </button>
        </div>
      )}
    </>
  );
}
