/**
 * Toglie dalla descrizione di una puntata la coda che rimanda a un link che
 * nel sito non c'è.
 *
 * Nel feed le descrizioni finiscono spesso con un invito seguito
 * dall'indirizzo — "Ascolta il podcast STORIE di BRAND - https://…". Tolto
 * l'indirizzo resta l'invito monco, con il trattino appeso e nessun posto
 * dove andare: "Ascolta IL CAFFETTINO -".
 *
 * Si interviene solo quando il testo finisce sospeso, e a scendere:
 *   1. si taglia all'ultimo richiamo all'azione;
 *   2. se non ce n'è uno, all'ultima fine di frase;
 *   3. in ultimo si toglie almeno la punteggiatura appesa.
 * Ogni taglio è accettato solo se lascia in piedi un testo leggibile (40
 * caratteri), altrimenti si passa al passo dopo: meglio una coda brutta che
 * una descrizione svuotata.
 */

const RICHIAMO =
  /(?:ascolta|riascolta|scopri|guarda|iscriviti|segui|vai su|clicca|trovi|leggi|entra|prova|inizia|vinci|partecipa|abbonati|registrati|episodi consigliati|link in|qui sotto)/gi;
const SOSPESA = /[\s\-–—:;,·•]+$/;
const MINIMO = 40;

function pulisciCoda(testo) {
  const d = (testo || "").replace(/\s+/g, " ").trim();
  if (!SOSPESA.test(d)) return d;

  const richiami = [...d.matchAll(RICHIAMO)];
  if (richiami.length > 0) {
    const testa = d.slice(0, richiami[richiami.length - 1].index).trim();
    if (testa.length >= MINIMO) return testa.replace(SOSPESA, "").trim();
  }

  const frasi = [...d.matchAll(/[.!?…]/g)];
  if (frasi.length > 0) {
    const testa = d.slice(0, frasi[frasi.length - 1].index + 1).trim();
    if (testa.length >= MINIMO) return testa;
  }

  return d.replace(SOSPESA, "").trim();
}

module.exports = { pulisciCoda };
