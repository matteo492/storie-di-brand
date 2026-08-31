import Link from "next/link";
import HSlider from "@/components/HSlider";

/**
 * "L'universo espanso": la sezione che dice cosa sia Storie di Brand prima di
 * mostrare qualunque contenuto. Nasce dal punto più basso del form interno
 * ("non si capisce cos'è il progetto") e dalla frammentazione fra podcast,
 * video e live emersa nella call: qui i formati stanno tutti insieme, dichiarati.
 */
type Pianeta = {
  nome: string;
  tag: string;
  testo: string;
  href: string;
  cta: string;
  esterno?: boolean;
  /* Segno grafico che riempie la parte bassa della scheda: si usa finché non
     c'è una fotografia. */
  segno: React.ReactNode;
  /* Fotografia di sfondo in /public/universo/. Quando c'è prende il posto del
     segno e riempie tutta la scheda. */
  foto?: string;
};

const PIANETI: Pianeta[] = [
  {
    nome: "Il podcast",
    tag: "190 puntate · 4,8★",
    testo:
      "Storie di uomini e donne, di fallimenti e di sogni. Serie a puntate scritte e interpretate da Max Corona, con sound design e voci originali.",
    href: "/podcast",
    cta: "Tutte le puntate",
    foto: "podcast.jpg",
    segno: (
      <>
        <rect x="26" y="6" width="20" height="34" rx="10" />
        <path d="M14 32a22 22 0 0 0 44 0" />
        <path d="M36 54v12" />
      </>
    ),
  },
  {
    nome: "YouTube",
    tag: "20 milioni di visualizzazioni",
    testo:
      "Le storie dei marchi girate come mini-documentari, con ricerca, archivio e messa in scena. Due milioni di ore guardate, 172mila iscritti.",
    href: "/youtube",
    cta: "Guarda i video",
    foto: "youtube.jpg",
    segno: (
      <>
        <rect x="4" y="14" width="64" height="44" rx="12" />
        <path d="M30 26l18 10-18 10z" />
      </>
    ),
  },
  {
    nome: "Le live",
    tag: "Sul palco",
    testo:
      "Anche la tua azienda ha una storia che non ha mai raccontato. La scriviamo e la portiamo sul palco, davanti ai tuoi clienti o al tuo team.",
    href: "/#live",
    cta: "Portala sul palco",
    foto: "live.jpg",
    segno: (
      <>
        <circle cx="36" cy="36" r="8" />
        <path d="M20 20a22 22 0 0 0 0 32M52 20a22 22 0 0 1 0 32" />
        <path d="M8 10a36 36 0 0 0 0 52M64 10a36 36 0 0 1 0 52" />
      </>
    ),
  },
  {
    nome: "Brandy",
    tag: "Dal lunedì al venerdì",
    testo:
      "Il daily show di Max Corona: dieci minuti al giorno di fatti curiosi dal mondo del marketing e del business.",
    href: "https://open.spotify.com/show/6aRhnsN2n7a3XvdR9XNgAC",
    cta: "Ascoltalo",
    esterno: true,
    foto: "brandy.jpg",
    segno: (
      <>
        <circle cx="31" cy="31" r="21" />
        <path d="M46 46l18 18" />
      </>
    ),
  },
  {
    nome: "La newsletter",
    tag: "Ogni venerdì",
    testo:
      "Il meglio della settimana raccolto in una mail: marketing e business raccontati come piace a te.",
    href: "/#newsletter",
    cta: "Iscriviti",
    foto: "newsletter.jpg",
    segno: (
      <>
        <rect x="4" y="14" width="64" height="44" rx="8" />
        <path d="M6 20l30 20 30-20" />
      </>
    ),
  },
  {
    nome: "Il libro",
    tag: "Persone che pensano in grande",
    testo:
      "Le storie di chi ha costruito imprese partendo da un'intuizione, raccontate da Max Corona.",
    href: "https://www.amazon.it/Persone-che-pensano-grande-raccontato-ebook/dp/B0CG9FT3DJ/",
    cta: "Scoprilo",
    esterno: true,
    foto: "libro.jpg",
    segno: (
      <>
        <path d="M36 18C30 12 18 10 8 12v42c10-2 22 0 28 6 6-6 18-8 28-6V12c-10-2-22 0-28 6z" />
        <path d="M36 18v42" />
      </>
    ),
  },
];

export default function Universe() {
  return (
    <section className="universo" id="progetto">
      <div className="universo__head reveal">
        <p className="eyebrow">Il progetto</p>
        <h2 className="universo__title">
          Un universo, <span className="hl">tanti modi</span> di raccontarlo
        </h2>
        <p className="universo__sub">
          Storie di Brand racconta come sono nati i marchi che usi ogni giorno: gli
          errori, le intuizioni e le persone dietro le aziende più famose del mondo.
          Una sola redazione, tanti formati — ognuno con il suo modo di raccontare.
        </p>
      </div>

      <HSlider etichette={{ prev: "Formati precedenti", next: "Formati successivi" }}>
        {PIANETI.map((p) => {
          const corpo = (
            <>
              {/* Prima di tutto il resto: così testo e "+" ci restano sopra. */}
              {p.foto && (
                <span
                  className="universo__foto"
                  style={{ backgroundImage: `url(/universo/${p.foto})` }}
                />
              )}
              <span className="universo__tag">{p.tag}</span>
              <h3 className="universo__nome">{p.nome}</h3>
              <p className="universo__testo">{p.testo}</p>
              {!p.foto && (
              <svg
                className="universo__segno"
                viewBox="0 0 72 72"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {p.segno}
              </svg>
              )}
              {/* Il "+" fa da invito ad aprire: la scheda è tutta un link,
                  quindi qui basta il segno, senza ripetere la scritta. */}
              <span className="universo__plus" aria-hidden="true">
                +
              </span>
              <span className="sr-only">{p.cta}</span>
            </>
          );

          // Una sola classe per entrambi i rami: la scheda con la foto ha
          // bisogno del modificatore anche quando il link è esterno, altrimenti
          // l'immagine resta sopra al testo e lo copre.
          const classe = `universo__card${p.foto ? " universo__card--foto" : ""}`;

          return p.esterno ? (
            <a
              key={p.nome}
              href={p.href}
              target="_blank"
              rel="noopener"
              className={classe}
            >
              {corpo}
            </a>
          ) : (
            <Link key={p.nome} href={p.href} className={classe}>
              {corpo}
            </Link>
          );
        })}
      </HSlider>
    </section>
  );
}
