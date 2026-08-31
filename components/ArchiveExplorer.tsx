"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Dropdown from "./Dropdown";

export interface ArchiveItem {
  slug: string;
  title: string;
  brand: string;
  sector: string;
  era: string;
  sectorGroup: string;
  eraGroup: string;
  coverColor: string;
  thumbnail: string | null;
}

interface Facets {
  brands: string[];
  sectors: string[];
  eras: string[];
}

type FilterKey = "brand" | "sector" | "era";

const PAGE_SIZE = 15;

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
  const [limit, setLimit] = useState(PAGE_SIZE);
  // Indice da cui partono le schede appena caricate: solo quelle si animano.
  const shownBefore = useRef(PAGE_SIZE);

  // Cambiando filtro si riparte dall'inizio e rientrano tutte le schede
  const set = (key: FilterKey, value: string | null) => {
    shownBefore.current = 0;
    setLimit(PAGE_SIZE);
    setActive((prev) => ({ ...prev, [key]: value }));
  };

  const filtered = useMemo(
    () =>
      episodes.filter(
        (e) =>
          (!active.brand || e.brand === active.brand) &&
          (!active.sector || e.sectorGroup === active.sector) &&
          (!active.era || e.eraGroup === active.era)
      ),
    [episodes, active]
  );

  const visible = filtered.slice(0, limit);
  const hasFilters = active.brand || active.sector || active.era;
  // La chiave cambia coi filtri: React rimonta la griglia e l'animazione riparte
  const gridKey = `${active.brand ?? ""}|${active.sector ?? ""}|${active.era ?? ""}`;

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
            onClick={() => {
              shownBefore.current = 0;
              setLimit(PAGE_SIZE);
              setActive({ brand: null, sector: null, era: null });
            }}
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
        <div className="archive__grid" key={gridKey}>
          {visible.map((ep, i) => {
            const isNew = i >= shownBefore.current;
            return (
              <div
                key={ep.slug}
                className={isNew ? "is-new" : undefined}
                style={
                  isNew
                    ? { animationDelay: `${Math.min(i - shownBefore.current, 12) * 54}ms` }
                    : undefined
                }
              >
                <Card ep={ep} />
              </div>
            );
          })}
        </div>
      )}

      {visible.length < filtered.length && (
        <div className="archive__more">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              shownBefore.current = limit;
              setLimit((l) => l + PAGE_SIZE);
            }}
          >
            Mostra altri episodi ({filtered.length - visible.length})
          </button>
        </div>
      )}
    </>
  );
}
