"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export interface ArchiveItem {
  slug: string;
  title: string;
  brand: string;
  sector: string;
  era: string;
  duration: string;
  excerpt: string;
  coverColor: string;
}

interface Facets {
  brands: string[];
  sectors: string[];
  eras: string[];
}

type FilterKey = "brand" | "sector" | "era";

function Card({ ep }: { ep: ArchiveItem }) {
  return (
    <article className="ep-card">
      <Link
        href={`/episodi/${ep.slug}`}
        className="ep-card__art"
        style={{ ["--c" as string]: ep.coverColor }}
        aria-label={ep.title}
      >
        <span className="ep-card__brand">{ep.brand}</span>
      </Link>
      <div className="ep-card__body">
        <h3>
          <Link href={`/episodi/${ep.slug}`}>{ep.title}</Link>
        </h3>
        <div className="ep-card__meta">
          <span>{ep.brand}</span>
          <span>•</span>
          <span>{ep.sector}</span>
          {ep.duration && (
            <>
              <span>•</span>
              <span>{ep.duration}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ArchiveExplorer({
  episodes,
  facets,
}: {
  episodes: ArchiveItem[];
  facets: Facets;
}) {
  const [active, setActive] = useState<Record<FilterKey, string | null>>({
    brand: null,
    sector: null,
    era: null,
  });

  const toggle = (key: FilterKey, value: string) =>
    setActive((prev) => ({ ...prev, [key]: prev[key] === value ? null : value }));

  const filtered = useMemo(
    () =>
      episodes.filter(
        (e) =>
          (!active.brand || e.brand === active.brand) &&
          (!active.sector || e.sector === active.sector) &&
          (!active.era || e.era === active.era)
      ),
    [episodes, active]
  );

  const rows: { key: FilterKey; label: string; values: string[] }[] = [
    { key: "brand", label: "Marchio", values: facets.brands },
    { key: "sector", label: "Settore", values: facets.sectors },
    { key: "era", label: "Epoca", values: facets.eras },
  ];

  const hasFilters = active.brand || active.sector || active.era;

  return (
    <>
      <div className="filters">
        {rows.map((row) => (
          <div className="filters__row" key={row.key}>
            <span className="filters__label">{row.label}</span>
            {row.values.map((v) => (
              <button
                key={v}
                className={`chip${active[row.key] === v ? " chip--active" : ""}`}
                onClick={() => toggle(row.key, v)}
              >
                {v}
              </button>
            ))}
          </div>
        ))}
        {hasFilters && (
          <div className="filters__row">
            <button
              className="chip"
              onClick={() => setActive({ brand: null, sector: null, era: null })}
            >
              ✕ Azzera filtri
            </button>
          </div>
        )}
      </div>

      <p className="archive__count">
        {filtered.length} episod{filtered.length === 1 ? "io" : "i"}
      </p>

      {filtered.length === 0 ? (
        <p className="archive__empty">Nessun episodio con questi filtri.</p>
      ) : (
        <div className="archive__grid">
          {filtered.map((ep) => (
            <Card key={ep.slug} ep={ep} />
          ))}
        </div>
      )}
    </>
  );
}
