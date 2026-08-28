/**
 * Posizioni aperte mostrate in fondo alla pagina Team.
 *
 * Per aprire una posizione: aggiungi un oggetto a OPEN_POSITIONS.
 * Per chiuderla: togli l'oggetto (o svuota la lista) — la pagina mostra da sola
 * il messaggio "nessuna posizione aperta" con l'invito a scrivere.
 */
export interface JobPosting {
  title: string;
  /** Dove si lavora, in breve: es. "Roma · Ibrido". */
  location: string;
  /** Tipo di contratto: es. "Full-time · Tempo determinato". */
  contract: string;
  /** Fascia di retribuzione, se pubblica. Vuoto = non mostrata. */
  salary?: string;
  /** Stessa fascia in numeri: serve ai dati strutturati per Google Lavoro. */
  salaryMin?: number;
  salaryMax?: number;
  /** Due righe che raccontano il ruolo. */
  summary: string;
  /** Pagina con la descrizione completa e il form di candidatura. */
  url: string;
  /** Data di pubblicazione (ISO). Usata nei dati strutturati per Google Lavoro. */
  postedAt: string;
}

export const OPEN_POSITIONS: JobPosting[] = [
  {
    title: "Podcast & YouTube Producer",
    location: "Roma · Ibrido",
    contract: "Full-time · Tempo determinato",
    salary: "RAL 26.000€ – 29.000€",
    salaryMin: 26000,
    salaryMax: 29000,
    summary:
      "La figura che cerchiamo avrà un ruolo centrale nella gestione e nello sviluppo dei progetti di Storie di Brand, dall'idea alla pubblicazione, lavorando a stretto contatto con Max Corona e con creators, autori, sound designer e brand partner.",
    url: "https://vois.notion.site/Podcast-YouTube-Producer-Storie-di-Brand-66fdc3c3e4aa8201b64c01741d9c5c05",
    postedAt: "2026-08-28",
  },
];
