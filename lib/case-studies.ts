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
  /** I numeri del progetto: etichetta + valore. */
  risultati?: { label: string; value: string }[];
  /** Immagini di backstage in /public/case-studies/<slug>/ */
  backstage?: { src: string; alt: string }[];
  /** Il racconto lungo, in paragrafi. */
  corpo?: string[];
}

export const CASE_STUDIES: CaseStudy[] = [];

export function getCaseStudy(slug: string) {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

/** Mappa nome del partner -> percorso del suo case study, se esiste. */
export function caseStudyHref(partner: string) {
  const cs = CASE_STUDIES.find((c) => c.partner === partner);
  return cs ? `/case-study/${cs.slug}` : undefined;
}
