"use client";

import { useEffect, useMemo, useState } from "react";

type Episode = { id: string; t: string; d: string; date: string };

// Domande di esempio (cliccabili) — tutte con un match reale nel catalogo
const SUGGESTIONS = [
  "Cosa sta succedendo a Zara?",
  "Come ha fatto Nokia a fallire?",
  "Chi ha inventato il divano letto?",
  "Il disastro della Pepsi blu",
];

// Stopword italiane: parole troppo comuni che non aiutano il match
const STOP = new Set(
  "il lo la i gli le un uno una di a da in con su per tra fra e o ma se che chi cosa come quando dove perche perché sono ha hanno del della dei delle al alla ai alle nel nella sul sui sta succedendo si no non mi ti ci vi piu più molto tutto tutti questo quello suo sua loro essere fare quale quali qual".split(
    /\s+/
  )
);

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Ritorna gli episodi più pertinenti a una domanda, ordinati per punteggio. */
function rank(query: string, eps: Episode[], limit: number): Episode[] {
  const terms = normalize(query)
    .split(" ")
    .filter((t) => t.length > 2 && !STOP.has(t));
  if (terms.length === 0) return [];

  const scored = eps
    .map((e) => {
      const titleWords = normalize(e.t).split(" ");
      const descWords = normalize(e.d).split(" ");
      let score = 0;
      let matched = 0;
      for (const t of terms) {
        // Parola intera pesa di più del prefisso; nessun match "in mezzo"
        // (così "zara" non matcha "zanzara", ma "ferrari" matcha "ferrarista")
        const inTitle = titleWords.includes(t)
          ? 6
          : titleWords.some((w) => w.startsWith(t))
            ? 2
            : 0;
        const inDesc = descWords.includes(t)
          ? 3
          : descWords.some((w) => w.startsWith(t))
            ? 1
            : 0;
        if (inTitle || inDesc) matched++;
        score += inTitle + inDesc;
      }
      // Bonus se la domanda è coperta da tutti i suoi termini
      if (matched === terms.length) score += 3;
      return { e, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  // Dedup per titolo: alcune puntate sono ripubblicate con id diverso ma
  // stesso titolo — teniamo solo la più pertinente (la prima dopo il sort).
  const seenTitles = new Set<string>();
  const unique: Episode[] = [];
  for (const { e } of scored) {
    const key = normalize(e.t);
    if (seenTitles.has(key)) continue;
    seenTitles.add(key);
    unique.push(e);
    if (unique.length >= limit) break;
  }
  return unique;
}

export default function BrandyGame() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState<Episode | null>(null);
  const [alternatives, setAlternatives] = useState<Episode[]>([]);
  const [searched, setSearched] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  // Carica il catalogo e propone un episodio a caso a ogni apertura della pagina
  useEffect(() => {
    let active = true;
    fetch("/brandy-episodes.json")
      .then((r) => r.json())
      .then((data: Episode[]) => {
        if (!active) return;
        // Scarta episodi senza id: non sono riproducibili nell'embed
        const playable = data.filter((e) => e.id);
        setEpisodes(playable);
        setCurrent(playable[Math.floor(Math.random() * playable.length)] ?? null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const embedSrc = useMemo(
    () => (current ? `https://playlist.megaphone.fm/?e=${current.id}` : null),
    [current]
  );

  function runSearch(q: string) {
    const question = q.trim();
    if (!question || episodes.length === 0) return;
    setQuery(question);
    // Limite generoso: vogliamo che TUTTI gli episodi che citano la keyword
    // emergano, non solo il più pertinente.
    const results = rank(question, episodes, 12);
    if (results.length === 0) {
      // Nessun match: mostra il messaggio e ripiega su un episodio a caso
      setNoResult(true);
      setSearched(false);
      setAlternatives([]);
      setCurrent(episodes[Math.floor(Math.random() * episodes.length)] ?? null);
      return;
    }
    setNoResult(false);
    setSearched(true);
    setDescExpanded(false);
    setCurrent(results[0]);
    setAlternatives(results.slice(1));
  }

  function surprise() {
    if (episodes.length === 0) return;
    setSearched(false);
    setNoResult(false);
    setAlternatives([]);
    setQuery("");
    setDescExpanded(false);
    setCurrent(episodes[Math.floor(Math.random() * episodes.length)] ?? null);
  }

  return (
    <div className="brandy">
      <div className="brandy__head">
        <p className="eyebrow">Il podcast quotidiano · 1000+ episodi</p>
        <h2 className="podcast__title">
          Chiedi a <span className="hl">Brandy</span>
        </h2>
        <p className="podcast__sub">
          Fai una domanda sul mondo dei brand, del marketing o del business:
          cercheremo tra <strong>oltre mille episodi</strong> del podcast quello
          giusto per te.
        </p>
      </div>

      <form
        className="brandy__search"
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(query);
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Es: cosa sta succedendo a Zara?"
          aria-label="Fai una domanda a Brandy"
        />
        <button type="submit" className="btn btn--primary">
          Cerca
        </button>
      </form>

      <div className="brandy__suggest">
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" onClick={() => runSearch(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="brandy__result">
        {current && (
          <p className="brandy__label">
            {searched ? "L'episodio più pertinente" : "Episodio a caso per te"}
            {" · "}
            <button type="button" className="brandy__shuffle" onClick={surprise}>
              🎲 Sorprendimi
            </button>
          </p>
        )}

        {noResult && (
          <p className="brandy__noresult">
            Nessun episodio trovato per «{query}». Prova con il nome di un brand
            o un argomento (es: <em>Ferrari</em>, <em>Nutella</em>,{" "}
            <em>pubblicità</em>).
          </p>
        )}

        {current && (
          <>
<div className="brandy__embed">
              {embedSrc && (
                <iframe
                  key={current.id}
                  src={embedSrc}
                  width="100%"
                  height="200"
                  frameBorder="0"
                  scrolling="no"
                  allow="autoplay"
                  loading="lazy"
                  title={`BRANDY — ${current.t}`}
                />
              )}
            </div>
          </>
        )}

        {alternatives.length > 0 && (
          <div className="brandy__alts">
            <span>Altri episodi pertinenti:</span>
            {alternatives.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  setCurrent(a);
                  setAlternatives((prev) => prev.filter((x) => x.id !== a.id));
                }}
              >
                {a.t}
              </button>
            ))}
          </div>
        )}
      </div>

      <a
        href="https://open.spotify.com/show/6aRhnsN2n7a3XvdR9XNgAC"
        target="_blank"
        rel="noopener"
        className="brandy__full"
      >
        Ascolta tutto il podcast su Spotify →
      </a>
    </div>
  );
}
