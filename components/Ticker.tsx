import type { Partner } from "@/lib/partners";

/** Area di riferimento: dà a ogni logo lo stesso peso ottico. */
const AREA = 2400;
const H_MIN = 20;
const H_MAX = 40;

/** Altezza e larghezza di un logo a parità di "inchiostro" percepito. */
function misura(ratio = 3.4, scale = 1) {
  const h = Math.min(H_MAX, Math.max(H_MIN, Math.sqrt(AREA / ratio))) * scale;
  return { h: Math.round(h), w: Math.round(h * ratio) };
}

/**
 * Nastro scorrevole dei marchi con cui abbiamo collaborato.
 * Dove esiste il logo lo mostra, altrimenti scrive il nome.
 */
export default function Ticker({ items }: { items: Partner[] }) {
  const run = items.flatMap((p) => [p, null as Partner | null]); // null = separatore
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {[...run, ...run, ...run].map((p, i) => {
          if (p === null) return <span key={i} className="ticker__dot">•</span>;
          if (!p.logo) return <span key={i}>{p.name}</span>;
          const { h, w } = misura(p.ratio, p.scale);
          return (
            <span key={i} className="ticker__logo">
              {/* La maschera colora il logo col colore del testo: tutti uguali */}
              <span
                role="img"
                aria-label={p.name}
                style={{
                  ["--logo" as string]: `url(/partners/${p.logo}.svg)`,
                  width: `${w}px`,
                  height: `${h}px`,
                }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}
