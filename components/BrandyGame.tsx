"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PodcastPlayerMini from "./PodcastPlayerMini";
import { QUIZ, type Quiz } from "@/lib/brandy-quiz";

type Episode = { id: string; t: string; d: string; date: string };

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

/** Le descrizioni del feed si trascinano dietro la coda promozionale: qui
 *  resta solo il racconto. */
function soloRacconto(d: string): string {
  return d
    .split(/💰|📫|Ascolta il podcast|Ascolta la storia|Entra nel Canale|Learn more|Prova BREVO|Scopri altre storie|ISCRIVITI|Vinci le Olimpiadi|Inizia il tuo|Leggi l'articolo|https?:\/\//)[0]
    .replace(/\s+/g, " ")
    .trim();
}

/** "Thu, 27 Aug 2026 04:00:00 -0000" → "27 agosto 2026" */
function dataLeggibile(d: string): string {
  const t = new Date(d);
  if (Number.isNaN(t.getTime())) return "";
  return t.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Mescola le tre risposte: nei dati la prima è sempre quella giusta. */
function mescola(r: readonly string[]): string[] {
  const a = [...r];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function BrandyGame() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [opzioni, setOpzioni] = useState<string[]>([]);
  const [scelta, setScelta] = useState<string | null>(null);
  // Quando si sceglie una puntata correlata è questa a suonare, al posto di
  // quella collegata al quiz: si resta nel player, senza andarsene dal sito.
  const [inAscolto, setInAscolto] = useState<string | null>(null);
  const esitoRef = useRef<HTMLDivElement>(null);

  // Carica il catalogo: serve per il player e per le puntate correlate.
  useEffect(() => {
    let active = true;
    fetch("/brandy-episodes.json")
      .then((r) => r.json())
      .then((data: Episode[]) => {
        if (active) setEpisodes(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Un quiz diverso a ogni visita. L'ultimo visto resta segnato nel browser,
  // così non ricapita subito uguale a chi torna.
  function pescaQuiz(escludi?: number) {
    const indici = QUIZ.map((_, i) => i).filter((i) => i !== escludi);
    const i = indici[Math.floor(Math.random() * indici.length)];
    try {
      window.localStorage.setItem("brandy-quiz", String(i));
    } catch {
      // navigazione privata o memoria negata: pazienza, si ripesca a caso
    }
    const q = QUIZ[i];
    setQuiz(q);
    setOpzioni(mescola(q.risposte));
    setScelta(null);
    setInAscolto(null);
  }

  useEffect(() => {
    let ultimo: number | undefined;
    try {
      const v = window.localStorage.getItem("brandy-quiz");
      if (v !== null) ultimo = Number(v);
    } catch {
      // vedi sopra
    }
    pescaQuiz(ultimo);
  }, []);

  // Scegliendo un episodio correlato la pagina si ricentra sul blocco — player
  // e pulsanti insieme — ma solo se è quasi fuori dallo schermo: se si vede già
  // bene non si muove niente, altrimenti a ogni clic la pagina sobbalzerebbe.
  useEffect(() => {
    if (!inAscolto) return;
    const el = esitoRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const testa = 72; // intestazione fissa
    const margine = 16;
    const spazio = window.innerHeight - testa;

    // Blocco più alto dello schermo: non può stare tutto in quadro, basta che
    // parta appena sotto l'intestazione.
    if (r.height > spazio) {
      if (r.top >= testa - 8 && r.top <= testa + 120) return;
      window.scrollTo({
        top: Math.max(0, window.scrollY + r.top - testa - margine),
        behavior: "smooth",
      });
      return;
    }

    // Altrimenti si sta fermi solo se si vede per intero, margini compresi:
    // basta un bordo tagliato — il titolo sotto la barra, i pulsanti oltre il
    // fondo — perché valga la pena ricentrare.
    const interoInQuadro =
      r.top >= testa + margine && r.bottom <= window.innerHeight - margine;
    if (interoInQuadro) return;

    const scarto = testa + (spazio - r.height) / 2;
    window.scrollTo({
      top: Math.max(0, window.scrollY + r.top - scarto),
      behavior: "smooth",
    });
  }, [inAscolto]);

  const risposto = scelta !== null;
  const giusta = quiz?.risposte[0];
  const idPuntata = inAscolto ?? quiz?.episodio ?? null;
  const puntata = useMemo(
    () => (idPuntata ? episodes.find((e) => e.id === idPuntata) ?? null : null),
    [idPuntata, episodes]
  );
  // Correlati a cascata: prima la parola chiave del quiz, poi — se non basta —
  // le parole della puntata stessa, e in ultimo le puntate più recenti. Su temi
  // di nicchia (le bustine di tè, la prima webcam) la sola parola chiave non
  // trovava niente e il blocco spariva.
  const correlate = useMemo(() => {
    if (!quiz || episodes.length === 0) return [];
    const scelti: Episode[] = [];
    const aggiungi = (lista: Episode[]) => {
      for (const e of lista) {
        if (scelti.length >= 4) return;
        if (e.id === quiz.episodio) continue;
        if (scelti.some((x) => x.id === e.id)) continue;
        scelti.push(e);
      }
    };

    aggiungi(rank(quiz.cerca, episodes, 8));
    if (scelti.length < 4) {
      const ep = episodes.find((e) => e.id === quiz.episodio);
      if (ep) aggiungi(rank(`${ep.t} ${ep.d.slice(0, 160)}`, episodes, 12));
    }
    if (scelti.length < 4) aggiungi(episodes.slice(0, 8));
    return scelti;
  }, [quiz, episodes]);
  const audioSrc = idPuntata
    ? `https://traffic.megaphone.fm/${idPuntata}.mp3`
    : null;

  return (
    <div className="brandy">
      <div className="brandy__head">
        <p className="eyebrow">Il quiz · +1000 episodi</p>
        <h2 className="podcast__title">
          <span className="hl">Brandy</span> ti sfida
        </h2>
        <p className="podcast__sub">
          Tre risposte. Una sola è vera. Il resto è nel podcast.
        </p>
      </div>

      {quiz && (
        <div className="quiz">
          <p className="quiz__domanda">{quiz.domanda}</p>

          <div className="quiz__opzioni">
            {opzioni.map((o) => {
              const stato = !risposto
                ? ""
                : o === giusta
                  ? " is-giusta"
                  : o === scelta
                    ? " is-sbagliata"
                    : " is-spenta";
              return (
                <button
                  key={o}
                  type="button"
                  className={`quiz__opzione${stato}`}
                  onClick={() => !risposto && setScelta(o)}
                  disabled={risposto}
                >
                  {o}
                </button>
              );
            })}
          </div>

          {risposto && (
            <div className="quiz__esito" ref={esitoRef}>
              <p className="quiz__verdetto">
                {scelta === giusta ? "Esatto." : "Eh no."}{" "}
                <span>{quiz.spiegazione}</span>
              </p>

              {audioSrc && (
                /* Stesso blocco della timeline e della pagina Podcast:
                   copertina a sinistra, testo e player a destra. Le puntate di
                   Brandy non hanno una copertina propria (solo 38 su 1.201),
                   quindi si usa quella dello show. */
                <div className="pod-hero quiz-hero">
                  <div className="pod-hero__cover">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brandy-cover.jpg" alt="" width={600} height={600} />
                  </div>
                  <div className="pod-hero__body">
                    <div className="pod-hero__text">
                      <p className="pod-hero__label">Ascolta com&apos;è andata</p>
                      <h3 className="pod-hero__title">{puntata?.t ?? "Brandy"}</h3>
                      {puntata && (
                        <p className="pod-hero__meta">{dataLeggibile(puntata.date)}</p>
                      )}
                      {puntata && (
                        <p className="pod-hero__excerpt">{soloRacconto(puntata.d)}</p>
                      )}
                    </div>
                    <div className="pod-hero__player">
                      <PodcastPlayerMini
                        key={audioSrc}
                        src={audioSrc}
                        title={puntata?.t ?? quiz.domanda}
                      />
                    </div>
                  </div>
                </div>
              )}

              {correlate.length > 0 && (
                <div className="brandy__alts">
                  <span>Episodi correlati</span>
                  {correlate.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={c.id === idPuntata ? "is-sel" : undefined}
                      onClick={() => setInAscolto(c.id)}
                    >
                      {c.t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
