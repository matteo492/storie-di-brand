"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

export interface ArchiveItem {
  slug: string;
  title: string;
  brand: string;
  sector: string;
  era: string;
  coverColor: string;
  thumbnail: string | null;
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
        style={{
          ["--c" as string]: ep.coverColor,
          backgroundImage: ep.thumbnail ? `url(${ep.thumbnail})` : undefined,
        }}
        aria-label={ep.title}
      />
      <div className="ep-card__body">
        <h3>
          <Link href={`/episodi/${ep.slug}`}>{ep.title}</Link>
        </h3>
        <div className="ep-card__meta">
          <span>{ep.brand}</span>
          <span>•</span>
          <span>{ep.sector}</span>
        </div>
      </div>
    </article>
  );
}

function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | null;
  options: string[];
  onChange: (v: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <button
        className={`dropdown__btn${value ? " dropdown__btn--active" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="dropdown__label">{label}</span>
        <span className="dropdown__value">{value ?? "Tutti"}</span>
        <span className="dropdown__caret" aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div className="dropdown__panel" role="listbox">
          <button
            className={`dropdown__opt${!value ? " is-sel" : ""}`}
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
          >
            Tutti
          </button>
          {options.map((o) => (
            <button
              key={o}
              className={`dropdown__opt${value === o ? " is-sel" : ""}`}
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
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

  const set = (key: FilterKey, value: string | null) =>
    setActive((prev) => ({ ...prev, [key]: value }));

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

  const hasFilters = active.brand || active.sector || active.era;

  return (
    <>
      <div className="filter-bar">
        <Dropdown
          label="Marchio"
          value={active.brand}
          options={facets.brands}
          onChange={(v) => set("brand", v)}
        />
        <Dropdown
          label="Settore"
          value={active.sector}
          options={facets.sectors}
          onChange={(v) => set("sector", v)}
        />
        <Dropdown
          label="Epoca"
          value={active.era}
          options={facets.eras}
          onChange={(v) => set("era", v)}
        />
        {hasFilters && (
          <button
            className="filter-reset"
            onClick={() => setActive({ brand: null, sector: null, era: null })}
          >
            ✕ Azzera
          </button>
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
