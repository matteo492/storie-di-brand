import Link from "next/link";
import HSlider from "@/components/HSlider";
import { caseStudyHref } from "@/lib/case-studies";
import { DESCRIZIONE_SEGNAPOSTO, logoSize, PARTNERS } from "@/lib/partners";

/**
 * Le collaborazioni: una scheda grande per marchio, con l'immagine del
 * progetto e sotto il racconto in due righe. Si scorre in orizzontale con le
 * frecce sotto, che si spengono quando si è a inizio o fine corsa.
 *
 * Finché non arrivano le immagini vere, la copertina è un pannello col logo
 * del marchio al centro (campo `immagine` in lib/partners.ts).
 */
export default function PartnerSlider() {
  return (
    <HSlider
      etichette={{
        prev: "Collaborazioni precedenti",
        next: "Collaborazioni successive",
      }}
    >
      {PARTNERS.map((p) => {
        const href = p.href ?? caseStudyHref(p.name);
        const { h, w } = logoSize("muro", p.ratio, p.scale);

        const copertina = (
          <div
            className={`pslider__art${
              p.immagine ? " pslider__art--foto" : " pslider__art--vuota"
            }`}
          >
            {/* L'immagine sta in un elemento a sé: così può ingrandirsi al
                passaggio del mouse dentro la cornice, che resta ferma. */}
            {p.immagine && (
              <span
                className="pslider__img"
                style={{
                  backgroundImage: `url(/collaborazioni/${p.immagine})`,
                  backgroundPosition: p.fuoco ?? "center",
                }}
              />
            )}
            {/* Il logo resta sempre, anche sopra la fotografia: è il marchio a
                dover essere riconosciuto per primo. La maschera lo colora col
                colore del testo. */}
            <span
              className="pslider__logo"
              role="img"
              aria-label={p.name}
              style={{
                ["--logo" as string]: `url(/partners/${p.logo}.svg)`,
                ["--w" as string]: `${w * 1.7}px`,
                aspectRatio: `${w} / ${h}`,
              }}
            />
            <span className="pslider__scopri">
              {href ? "Case study →" : "Case study in arrivo"}
            </span>
          </div>
        );

        const testo = (
          <div className="pslider__testo">
            <span className="pslider__nome">{p.name}</span>
            <span className="pslider__desc">
              {p.descrizione ?? DESCRIZIONE_SEGNAPOSTO}
            </span>
          </div>
        );

        return href ? (
          <Link key={p.name} href={href} className="pslider__card pslider__card--link">
            {copertina}
            {testo}
          </Link>
        ) : (
          <div key={p.name} className="pslider__card">
            {copertina}
            {testo}
          </div>
        );
      })}
    </HSlider>
  );
}
