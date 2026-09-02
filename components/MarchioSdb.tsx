/**
 * Il marchio "Storie di Brand" in due pezzi: la barra rossa e la parola.
 *
 * Separati perché al passaggio del mouse si muovono uno indipendentemente
 * dall'altro — la barra si disegna, la parola scorre. Nel file vettoriale la
 * barra è un semplice rettangolo, quindi qui la ridisegna il CSS, che sa
 * animarla; /logo-sdb-testo.svg è lo stesso logo meno quel rettangolo, con la
 * stessa griglia, così le due parti combaciano.
 *
 * A riposo la parola sta spostata a sinistra e la barra non c'è. Sotto il
 * mouse la parola torna dov'è disegnata e la barra compare: la forma che si
 * vede in quel momento è esattamente /logo-sdb.svg.
 */
export default function MarchioSdb({ className }: { className?: string }) {
  return (
    <span
      className={`marchio-sdb${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <span className="marchio-sdb__riga" />
      <img
        className="marchio-sdb__testo"
        src="/logo-sdb-testo.svg"
        alt=""
        width={1024}
        height={1024}
      />
    </span>
  );
}
