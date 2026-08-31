"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * La tendina dei filtri, condivisa dall'archivio YouTube e da quello del
 * podcast. Si chiude cliccando fuori; su mobile il pannello diventa un foglio
 * ancorato in fondo allo schermo (vedi globals.css).
 */
export default function Dropdown({
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
  // Il pannello resta montato per la durata dell'uscita: smontarlo subito lo
  // farebbe sparire di colpo, senza l'animazione di chiusura.
  const [uscita, setUscita] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const chiudi = useCallback(() => {
    setOpen((aperto) => {
      if (!aperto) return false;
      // L'uscita animata esiste solo sul foglio mobile: altrove — e con
      // prefers-reduced-motion — il pannello si chiude subito, altrimenti
      // resterebbe lì 260ms senza motivo.
      const animato =
        window.matchMedia("(max-width: 768px)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!animato) return false;
      setUscita(true);
      window.setTimeout(() => {
        setOpen(false);
        setUscita(false);
      }, 260);
      return true;
    });
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) chiudi();
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [chiudi]);

  return (
    <div className="dropdown" ref={ref}>
      <button
        className={`dropdown__btn${value ? " dropdown__btn--active" : ""}`}
        onClick={() => (open ? chiudi() : setOpen(true))}
        aria-expanded={open}
      >
        <span className="dropdown__label">{label}</span>
        <span className="dropdown__value">{value ?? "Tutti"}</span>
        <span className="dropdown__caret" aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div className="dropdown__panel" role="listbox" data-uscita={uscita ? "si" : "no"}>
          <button
            className={`dropdown__opt${!value ? " is-sel" : ""}`}
            onClick={() => {
              onChange(null);
              chiudi();
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
                chiudi();
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
