import { PIATTAFORME } from "@/lib/piattaforme";

/**
 * I tre link "ascolta anche su": il marchio è il pulsante, senza cornice
 * intorno. Sono loghi conosciuti e chiusi in una tessera, quindi si reggono
 * da soli — il nome scritto di fianco raddoppiava la stessa informazione.
 *
 * Rende solo i link, senza contenitore: i tre punti in cui compaiono hanno
 * impaginazioni diverse e ognuno tiene la sua.
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
          className="pod-platforms__link"
          // Senza testo scritto, il nome resta solo qui: è l'unica cosa che
          // legge chi usa uno screen reader.
          aria-label={p.nome}
        >
          {p.icona}
        </a>
      ))}
    </>
  );
}
