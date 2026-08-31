/**
 * I case study delle collaborazioni: cosa abbiamo fatto insieme a un marchio,
 * con il video, il dietro le quinte e i numeri che ha portato.
 *
 * Come si accende un case study:
 *  1. aggiungi qui una voce con `slug` e `partner` (il `partner` deve essere
 *     identico al `name` in lib/partners.ts — è il legame fra i due elenchi);
 *  2. il marchio nel nastro della home diventa automaticamente cliccabile e
 *     porta a /case-study/<slug>.
 * Finché la voce non c'è, il logo resta nel nastro ma non è un link: meglio
 * nessun clic che un clic verso una pagina vuota.
 */
export interface CaseStudy {
  slug: string;
  /** Deve corrispondere a Partner.name in lib/partners.ts */
  partner: string;
  /** Che tipo di progetto: es. "Episodio branded", "Serie in 3 puntate" */
  formato: string;
  titolo: string;
  /** Un paragrafo: l'obiettivo del brand e come l'abbiamo raccontato. */
  intro: string;
  /** ID dei video YouTube realizzati insieme (il primo fa da copertina). */
  video?: string[];
  /**
   * Quanti riquadri vuoti disegnare al posto dei video che ancora non ci
   * sono. Serve a impaginare un case study prima di avere i materiali:
   * l'ingombro è già quello definitivo, quindi sostituendo i segnaposto con
   * gli ID veri non si sposta niente.
   */
  videoAttesi?: number;
  /** I numeri del progetto: etichetta + valore. */
  risultati?: { label: string; value: string }[];
  /** Cosa chiedeva il brand e come l'abbiamo risolta. */
  sfida?: string;
  soluzione?: string;
  /** Immagini di backstage in /public/case-studies/<slug>/ */
  backstage?: { src: string; alt: string }[];
  /** Riquadri vuoti al posto delle fotografie mancanti, come `videoAttesi`. */
  backstageAttese?: number;
  /** Il racconto lungo, in paragrafi. */
  corpo?: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "juventus",
    partner: "JUVENTUS",
    formato: "Episodio branded · YouTube",
    titolo: "Juventus: la storia di un simbolo che divide",
    intro:
      "SEGNAPOSTO — Un paragrafo che dice, in tre righe, cosa chiedeva la Juventus e cosa abbiamo consegnato. È la prima cosa che legge chi arriva qui da un altro brand: deve capire subito il tipo di progetto e la sua portata.",
    videoAttesi: 1,
    risultati: [
      { value: "000.000", label: "Visualizzazioni" },
      { value: "00:00", label: "Tempo medio di visione" },
      { value: "0.000", label: "Commenti" },
      { value: "0", label: "Episodi" },
    ],
    sfida:
      "SEGNAPOSTO — La domanda che il brand si portava dietro. Due o tre frasi: il contesto, cosa non funzionava, cosa voleva ottenere. Qui va scritto dal punto di vista della Juventus, non dal nostro.",
    soluzione:
      "SEGNAPOSTO — Cosa abbiamo proposto e perché. Due o tre frasi: il taglio del racconto, il formato scelto, la ragione per cui era quello giusto per questa storia e per questo pubblico.",
    backstageAttese: 3,
    corpo: [
      "SEGNAPOSTO — Il racconto lungo, primo paragrafo. Qui si entra nel merito: come è nata l'idea, quali materiali d'archivio abbiamo cercato, quali persone abbiamo intervistato.",
      "SEGNAPOSTO — Secondo paragrafo. La lavorazione: le riprese, il montaggio, le scelte narrative che hanno fatto la differenza.",
      "SEGNAPOSTO — Terzo paragrafo. Cosa è successo dopo la pubblicazione: come ha reagito il pubblico, che conversazione ha aperto.",
    ],
  },
];

export function getCaseStudy(slug: string) {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

/** Mappa nome del partner -> percorso del suo case study, se esiste. */
export function caseStudyHref(partner: string) {
  const cs = CASE_STUDIES.find((c) => c.partner === partner);
  return cs ? `/case-study/${cs.slug}` : undefined;
}
