import { PIATTAFORME } from "@/lib/piattaforme";

/**
 * I tre link "ascolta anche su". Su desktop portano il nome della
 * piattaforma, sotto i 768px solo il marchio, per non occupare tre righe
 * di schermo con dei bottoni di servizio.
 *
 * Rende solo i link, senza contenitore: i tre punti in cui compaiono hanno
 * impaginazioni diverse e ognuno tiene il suo.
 */
export default function LinkPiattaforme() {
  return (
    <>
      {PIATTAFORME.map((p) => (
        <a
          key={p.nome}
          href={p.href}
          target="_blank"
          rel="noopener"
          className="btn btn--ghost pod-platforms__link"
          // Il nome sparisce su mobile ma deve restare per chi usa uno
          // screen reader.
          aria-label={p.nome}
        >
          <span className="pod-platforms__marchio">{p.icona}</span>
          <span className="pod-platforms__nome">{p.nome}</span>
        </a>
      ))}
    </>
  );
}
