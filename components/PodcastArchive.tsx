"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PodcastEpisode } from "@/lib/podcast";
import { brandLabel } from "@/lib/podcast-brand";
import PodcastPlayerMini from "./PodcastPlayerMini";
import Dropdown from "./Dropdown";
import { ORDINE_SETTORI, ORDINE_EPOCHE } from "@/lib/podcast-settori";

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

/**
 * Ordine di ascolto di una serie: prima le parti numerate, poi gli EXTRA —
 * che sono approfondimenti e vanno sentiti dopo aver finito la storia.
 */
function sortParts(a: PodcastEpisode, b: PodcastEpisode) {
  if (a.isExtra !== b.isExtra) return a.isExtra ? 1 : -1;
  return (a.part ?? 0) - (b.part ?? 0) || +new Date(a.date) - +new Date(b.date);
}

/** Una casella della griglia: una puntata singola o un brand con più parti. */
type GridItem =
  | { kind: "single"; key: string; ep: PodcastEpisode }
  | { kind: "series"; key: string; name: string; parts: PodcastEpisode[] };

/**
 * Raggruppa le puntate per brand mantenendo l'ordine cronologico: un brand
 * compare dove sta la sua puntata più recente. Le serie con una sola puntata
 * restano caselle singole.
 */
function groupByBrand(episodes: PodcastEpisode[]): GridItem[] {
  const bySeries = new Map<string, PodcastEpisode[]>();
  for (const ep of episodes) {
    if (!ep.series) continue;
    const list = bySeries.get(ep.series);
    if (list) list.push(ep);
    else bySeries.set(ep.series, [ep]);
  }

  const items: GridItem[] = [];
  const done = new Set<string>();
  for (const ep of episodes) {
    const parts = ep.series ? bySeries.get(ep.series) : undefined;
    if (parts && parts.length > 1) {
      if (done.has(ep.series!)) continue;
      done.add(ep.series!);
      // parti in ordine di ascolto (Pt 1, 2, 3…)
      const ordered = [...parts].sort(sortParts);
      items.push({ kind: "series", key: ep.series!, name: ep.series!, parts: ordered });
    } else {
      items.push({ kind: "single", key: ep.id, ep });
    }
  }
  return items;
}

export default function PodcastArchive({
  episodes,
  settori,
  epoche,
}: {
  episodes: PodcastEpisode[];
  /** marchio (come su copertina) → settore, e → epoca di fondazione. */
  settori: Record<string, string>;
  epoche: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  // La ricerca sta chiusa dietro a una lente: la barra a tutta larghezza
  // pesava più dei filtri, che sono il primo modo di sfogliare l'archivio.
  const [cercaAperta, setCercaAperta] = useState(false);
  const campoCerca = useRef<HTMLInputElement>(null);
  const cercaRef = useRef<HTMLDivElement>(null);
  const [settore, setSettore] = useState<string | null>(null);
  const [epoca, setEpoca] = useState<string | null>(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  // Indice da cui partono le caselle appena caricate: solo quelle si animano.
  const shownBefore = useRef(PAGE_SIZE);
  const [featuredId, setFeaturedId] = useState<string | null>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  /**
   * Toccare fuori chiude la barra, come ci si aspetta da qualcosa che si è
   * aperto sopra al resto.
   *
   * Solo a campo vuoto, però: con una ricerca scritta chiuderla vorrebbe dire
   * o buttare via quello che si è digitato, o lasciare i risultati filtrati
   * senza più niente che lo spieghi. In quel caso la barra resta, e a chiuderla
   * è la lente — che il testo lo cancella apposta.
   *
   * `pointerdown` e non `click`: si chiude appena il dito tocca, senza
   * aspettare che il tocco finisca.
   */
  useEffect(() => {
    if (!cercaAperta || query) return;
    const fuori = (e: PointerEvent) => {
      if (!cercaRef.current?.contains(e.target as Node)) setCercaAperta(false);
    };
    document.addEventListener("pointerdown", fuori);
    return () => document.removeEventListener("pointerdown", fuori);
  }, [cercaAperta, query]);

  const indexed = useMemo(
    () =>
      episodes.map((e) => {
        const marchio = brandLabel(e);
        return {
          ep: e,
          hay: norm(`${e.title} ${e.excerpt}`),
          settore: settori[marchio] ?? null,
          epoca: epoche[marchio] ?? null,
        };
      }),
    [episodes, settori, epoche]
  );

  const filtered = useMemo(() => {
    const terms = norm(query).split(" ").filter(Boolean);
    return indexed
      .filter((x) => {
        if (settore && x.settore !== settore) return false;
        if (epoca && x.epoca !== epoca) return false;
        return terms.every((t) => x.hay.includes(t));
      })
      .map((x) => x.ep);
  }, [indexed, query, settore, epoca]);

  // Nelle tendine finiscono solo le voci che hanno davvero delle puntate.
  const settoriPresenti = useMemo(() => {
    const presenti = new Set(indexed.map((x) => x.settore).filter(Boolean));
    return ORDINE_SETTORI.filter((s) => presenti.has(s));
  }, [indexed]);
  const epochePresenti = useMemo(() => {
    const presenti = new Set(indexed.map((x) => x.epoca).filter(Boolean));
    return ORDINE_EPOCHE.filter((e) => presenti.has(e));
  }, [indexed]);

  const items = useMemo(() => groupByBrand(filtered), [filtered]);

  /**
   * All'apertura mostriamo l'ultima puntata pubblicata, ma se fa parte di una
   * serie si comincia dalla Parte 1: come per ogni brand, la storia va
   * ascoltata dall'inizio.
   */
  const defaultFeatured = useMemo(() => {
    const latest = episodes[0];
    if (!latest?.series) return latest ?? null;
    const parts = episodes.filter((e) => e.series === latest.series);
    if (parts.length <= 1) return latest;
    return parts.sort(
      (a, b) => (a.part ?? 0) - (b.part ?? 0) || +new Date(a.date) - +new Date(b.date)
    )[0];
  }, [episodes]);

  const featured = episodes.find((e) => e.id === featuredId) ?? defaultFeatured;
  // Se la puntata in ascolto fa parte di una serie, mostriamo le altre parti.
  const featuredParts = useMemo(() => {
    if (!featured?.series) return [];
    const parts = episodes.filter((e) => e.series === featured.series);
    return parts.length > 1 ? parts.sort(sortParts) : [];
  }, [episodes, featured]);

  const visible = items.slice(0, limit);
  const hasFilters = query.trim() !== "" || settore !== null || epoca !== null;

  const reset = () => {
    setQuery("");
    setCercaAperta(false);
    setSettore(null);
    setEpoca(null);
    shownBefore.current = 0; // rientrano tutte
    setLimit(PAGE_SIZE);
  };

  const play = (ep: PodcastEpisode, scroll = true) => {
    setFeaturedId(ep.id);
    if (scroll) featuredRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      {featured && (
        <div className="pod-hero" ref={featuredRef}>
          <div className="pod-hero__cover">
            {featured.image && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={featured.id} src={featured.image} alt="" width={420} height={420} />
            )}
          </div>
          <div className="pod-hero__body">
            {/* La chiave cambia a ogni puntata: React rimonta il blocco e
                l'animazione di entrata riparte. */}
            <div className="pod-hero__text" key={featured.id}>
              <p className="pod-hero__label">
                {featuredId ? "In ascolto" : "Ultima puntata"}
              </p>
              <h2 className="pod-hero__title">{featured.title}</h2>
              <p className="pod-hero__meta">
                {featured.dateLabel}
                {featured.duration && ` · ${featured.duration}`}
              </p>
              {featured.excerpt && <p className="pod-hero__excerpt">{featured.excerpt}</p>}
            </div>

            {/* La riga c'è sempre, anche vuota: senza, il player si spostava
                passando da una puntata singola a una serie in più parti. */}
            <div className="pod-parts" role="group" aria-label="Parti della serie">
              {featuredParts.length > 0 &&
                featuredParts.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`pod-part${p.id === featured.id ? " is-sel" : ""}`}
                    onClick={() => play(p, false)}
                  >
                    {p.isExtra ? "Extra" : `Parte ${p.part ?? i + 1}`}
                  </button>
                ))}
            </div>

            {/* Player essenziale: solo play e avanzamento. Quello di Megaphone
                ripeteva copertina e titolo, già presenti qui sopra. */}
            <div className="pod-hero__player">
              <PodcastPlayerMini
                key={featured.id}
                src={featured.audio}
                title={featured.title}
              />
            </div>
          </div>
        </div>
      )}

      <div className="pod-controls">
        {/* Settore ed epoca di fondazione del marchio: l'anno di pubblicazione
            non dice niente a chi cerca una storia da ascoltare. */}
        <div className="pod-filtri">
          <div
            ref={cercaRef}
            className={`pod-cerca${cercaAperta ? " is-aperta" : ""}`}
          >
            <button
              type="button"
              className="pod-cerca__lente"
              aria-expanded={cercaAperta}
              aria-label={cercaAperta ? "Chiudi la ricerca" : "Cerca un brand o una puntata"}
              onClick={() => {
                const apri = !cercaAperta;
                setCercaAperta(apri);
                if (apri) {
                  // Il fuoco dopo il fotogramma: l'input è largo zero finché
                  // l'animazione non parte, e il browser non ci porta sopra.
                  requestAnimationFrame(() => campoCerca.current?.focus());
                } else if (query) {
                  // Chiudere una ricerca lasciandola attiva nasconde il motivo
                  // per cui i risultati sono pochi.
                  setQuery("");
                  shownBefore.current = 0;
                  setLimit(PAGE_SIZE);
                }
              }}
            >
              ⌕
            </button>
            <input
              ref={campoCerca}
              type="search"
              value={query}
              tabIndex={cercaAperta ? undefined : -1}
              onChange={(e) => {
                setQuery(e.target.value);
                shownBefore.current = PAGE_SIZE;
                setLimit(PAGE_SIZE);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setQuery("");
                  setCercaAperta(false);
                }
              }}
              placeholder="Cerca — es. Nike, Lego, Ferrari…"
              aria-label="Cerca tra le puntate"
            />
          </div>
          <Dropdown
            label="Settore"
            value={settore}
            options={settoriPresenti}
            onChange={(v) => {
              setSettore(v);
              shownBefore.current = 0; // rientrano tutte
              setLimit(PAGE_SIZE);
            }}
          />
          <Dropdown
            label="Epoca"
            value={epoca}
            options={epochePresenti}
            onChange={(v) => {
              setEpoca(v);
              shownBefore.current = 0;
              setLimit(PAGE_SIZE);
            }}
          />
        </div>
      </div>

      <p className="pod-count">
        {items.length} brand · {filtered.length} puntat{filtered.length === 1 ? "a" : "e"}
        {hasFilters && (
          <button type="button" className="pod-reset" onClick={reset}>
            ✕ Azzera
          </button>
        )}
      </p>

      {items.length === 0 ? (
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
        // La chiave cambia con l'anno: React rimonta la griglia e l'animazione
        // di entrata riparte su tutte le caselle.
        <ul className="pod-grid" key={`${settore ?? "tutti"}-${epoca ?? "tutte"}`}>
          {visible.map((item, i) => {
            const isNew = i >= shownBefore.current;
            const lead = item.kind === "series" ? item.parts[0] : item.ep;
            // Copertina della prima parte: cliccando si comincia da lì
            const cover = item.kind === "series" ? item.parts[0].image : item.ep.image;
            const attiva =
              item.kind === "series"
                ? item.parts.some((p) => p.id === featured?.id)
                : item.ep.id === featured?.id;
            return (
              <li
                key={item.key}
                className={isNew ? "is-new" : undefined}
                style={
                  isNew
                    ? { animationDelay: `${Math.min(i - shownBefore.current, 12) * 54}ms` }
                    : undefined
                }
              >
                <button
                  type="button"
                  className={`pod-tile${attiva ? " is-playing" : ""}`}
                  onClick={() => play(lead)}
                >
                  <span className="pod-tile__cover">
                    {cover && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={cover} alt="" loading="lazy" width={300} height={300} />
                    )}
                    <span className="pod-tile__play" aria-hidden="true">
                      ▶
                    </span>
                  </span>
                  {/* Sulle copertine solo il nome dell'azienda, in maiuscolo */}
                  <span className="pod-tile__title">
                    {item.kind === "series" ? brandLabel(item.parts[0]) : brandLabel(item.ep)}
                  </span>
                  <span className="pod-tile__meta">
                    {/* Le puntate di una serie si contano qui: sulla copertina
                        l'etichetta finiva sopra il titolo dell'artwork. */}
                    {item.kind === "series"
                      ? `${item.parts[item.parts.length - 1].dateLabel} · ${item.parts.length} puntate`
                      : `${item.ep.dateLabel}${item.ep.duration ? ` · ${item.ep.duration}` : ""}`}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {visible.length < items.length && (
        <div className="pod-more">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              shownBefore.current = limit;
              setLimit((l) => l + PAGE_SIZE);
            }}
          >
            Mostra altri brand ({items.length - visible.length})
          </button>
        </div>
      )}
    </>
  );
}
