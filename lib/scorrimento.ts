/**
 * Lo scorrimento morbido del sito, in un posto solo.
 *
 * Prima esisteva in due copie — dentro AncoraDolce e dentro l'header — e il
 * footer non ce l'aveva affatto: da lì i suoi link saltavano di colpo mentre
 * gli stessi link in alto scorrevano. Ora la regola sta qui e la usano tutti.
 *
 * L'andamento è quello nativo del browser, che è già un ease-in-out: parte
 * piano, prende velocità, rallenta all'arrivo. Preferito a un'animazione
 * scritta a mano perché su distanze lunghe — dal footer alla cima sono
 * seimila pixel — il browser regola da sé la durata, e soprattutto si ferma
 * se l'utente scorre nel frattempo, invece di litigare con lui.
 */

/** Chi ha chiesto meno animazioni arriva a destinazione, ma senza il viaggio. */
function andatura(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

/** Torna in cima alla pagina. */
export function scorriInCima() {
  window.scrollTo({ top: 0, behavior: andatura() });
}

/**
 * Porta alla sezione con quell'id.
 * Torna `false` se la sezione non è in questa pagina, così chi chiama può
 * lasciar fare al collegamento normale invece di bloccarlo per niente.
 */
export function scorriAllaSezione(id: string): boolean {
  const sezione = document.getElementById(id);
  if (!sezione) return false;
  sezione.scrollIntoView({ behavior: andatura() });
  return true;
}
