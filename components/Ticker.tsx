import { logoSize, type Partner } from "@/lib/partners";

/**
 * Nastro scorrevole dei marchi con cui abbiamo collaborato.
 * Dove esiste il logo lo mostra, altrimenti scrive il nome.
 * In home i partner hanno invece la griglia dedicata (PartnerGrid).
 */
export default function Ticker({ items }: { items: Partner[] }) {
  const run = items.flatMap((p) => [p, null as Partner | null]); // null = separatore
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {[...run, ...run, ...run].map((p, i) => {
          if (p === null) return <span key={i} className="ticker__dot">•</span>;
          if (!p.logo) return <span key={i}>{p.name}</span>;
          const { h, w } = logoSize("nastro", p.ratio, p.scale);
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
