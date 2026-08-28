"use client";

import { useEffect, useRef, useState } from "react";

/** mm:ss (o h:mm:ss se supera l'ora). */
function fmt(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const mm = h ? String(m).padStart(2, "0") : String(m);
  return `${h ? `${h}:` : ""}${mm}:${String(s).padStart(2, "0")}`;
}

/**
 * Player essenziale: tasto play e barra di avanzamento, nient'altro.
 * Riproduce l'MP3 del feed — lo stesso indirizzo usato da Spotify e Apple,
 * quindi ascolti e pubblicità restano tracciati da Megaphone.
 */
export default function PodcastPlayerMini({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [total, setTotal] = useState(0);
  const [ready, setReady] = useState(false);

  // Cambiando puntata si riparte da fermi
  useEffect(() => {
    setPlaying(false);
    setTime(0);
    setTotal(0);
    setReady(false);
  }, [src]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = ref.current;
    if (!el || !total) return;
    const t = (Number(e.target.value) / 1000) * total;
    el.currentTime = t;
    setTime(t);
  };

  const progress = total ? (time / total) * 1000 : 0;

  return (
    <div className="mini">
      <button
        type="button"
        className="mini__play"
        onClick={toggle}
        aria-label={playing ? `Metti in pausa ${title}` : `Ascolta ${title}`}
      >
        {/* SVG e non caratteri: "▶" ha spaziatura asimmetrica e appare
            sempre decentrato dentro il cerchio. */}
        {playing ? (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <rect x="6" y="4" width="4.5" height="16" rx="1.2" fill="currentColor" />
            <rect x="13.5" y="4" width="4.5" height="16" rx="1.2" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <path d="M8 5.2v13.6a1 1 0 0 0 1.53.85l10.2-6.8a1 1 0 0 0 0-1.7L9.53 4.35A1 1 0 0 0 8 5.2z" fill="currentColor" />
          </svg>
        )}
      </button>

      <div className="mini__bar">
        <input
          type="range"
          min={0}
          max={1000}
          value={progress}
          onChange={seek}
          disabled={!ready}
          aria-label="Avanzamento"
          style={{ ["--p" as string]: `${progress / 10}%` }}
        />
        <div className="mini__times">
          <span>{fmt(time)}</span>
          <span>{ready ? fmt(total) : "—"}</span>
        </div>
      </div>

      <audio
        ref={ref}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          setTotal(e.currentTarget.duration);
          setReady(true);
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
    </div>
  );
}
