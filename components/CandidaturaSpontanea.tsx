"use client";

import { useRef, useState } from "react";

/**
 * La candidatura spontanea, dove la persona già si trova.
 *
 * Prima qui c'era l'indirizzo di Max scritto per esteso, che è la forma che i
 * raccoglitori di indirizzi cercano per prima. Mandare invece al modulo in
 * home non funzionava: quella sezione è intestata "Per i brand" e parla di
 * sponsorship, quindi un candidato ci sarebbe atterrato in mezzo alle
 * proposte commerciali.
 *
 * Il modulo sta chiuso finché non serve — quando ci sono posizioni aperte
 * questo è un invito di riserva e non deve rubare la scena alle offerte vere —
 * e si apre crescendo in altezza, così il resto della pagina scivola giù
 * invece di saltare. La frase d'invito resta sopra e fa da titolo al modulo.
 *
 * Va allo stesso indirizzo del modulo per i brand, con un campo che dice di
 * che tipo di messaggio si tratta: una casella sola da guardare, e chi legge
 * capisce subito cos'è.
 */
const DESTINAZIONE = "https://formspree.io/f/maqgeokq";

export default function CandidaturaSpontanea({ invito }: { invito: string }) {
  const [aperto, setAperto] = useState(false);
  const [stato, setStato] = useState<"fermo" | "invio" | "fatto" | "errore">(
    "fermo"
  );
  // Per portare il fuoco sul primo campo quando il modulo si apre: con la
  // tastiera, altrimenti, si resta appesi sul pulsante che è appena sparito.
  const primoCampo = useRef<HTMLInputElement>(null);

  async function invia(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStato("invio");
    const modulo = e.currentTarget;
    try {
      const risposta = await fetch(DESTINAZIONE, {
        method: "POST",
        body: new FormData(modulo),
        headers: { Accept: "application/json" },
      });
      if (risposta.ok) {
        setStato("fatto");
        modulo.reset();
      } else {
        setStato("errore");
      }
    } catch {
      setStato("errore");
    }
  }

  if (stato === "fatto") {
    return (
      <p className="jobs__note jobs__note--esito">
        Candidatura ricevuta. La leggiamo e ti rispondiamo — grazie.
      </p>
    );
  }

  return (
    <>
      <p className="jobs__note">
        {invito}{" "}
        {!aperto && (
          <button
            type="button"
            className="jobs__apri"
            onClick={() => {
              setAperto(true);
              // Senza `preventScroll` il browser porterebbe il campo in vista
              // a metà apertura, litigando con l'animazione dell'altezza.
              requestAnimationFrame(() =>
                primoCampo.current?.focus({ preventScroll: true })
              );
            }}
          >
            Mandaci una candidatura spontanea
          </button>
        )}
      </p>

      {/* Il modulo c'è sempre nel documento e si apre crescendo, così quello
          che sta sotto scivola invece di saltare. `inert` mentre è chiuso:
          l'altezza zero non basta a togliere i campi dal giro del tabulatore. */}
      <div className="jobs__rivela" data-aperto={aperto ? "si" : "no"} inert={!aperto}>
        <div className="jobs__rivela__interno">
          <form className="collab-form jobs__modulo" onSubmit={invia}>
            <div className="collab-form__row">
              <input
                ref={primoCampo}
                type="text"
                name="nome"
                placeholder="Il tuo nome"
                required
                aria-label="Nome"
              />
              <input
                type="email"
                name="email"
                placeholder="La tua email"
                required
                aria-label="Email"
              />
            </div>
            <input
              type="url"
              name="profilo"
              placeholder="LinkedIn, portfolio o sito (facoltativo)"
              aria-label="Profilo o portfolio"
            />
            <textarea
              name="messaggio"
              placeholder="Raccontaci chi sei e cosa sai fare…"
              rows={4}
              required
              aria-label="Messaggio"
            />
            {/* Distingue queste dalle richieste dei brand nella stessa casella. */}
            <input type="hidden" name="tipo" value="Candidatura spontanea" />
            <button
              type="submit"
              className="btn btn--primary btn--big"
              disabled={stato === "invio"}
            >
              {stato === "invio" ? "Invio…" : "Invia la candidatura"}
            </button>
            {stato === "errore" && (
              <p className="collab-form__err">
                Qualcosa è andato storto. Riprova fra poco, oppure scrivici su
                LinkedIn.
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
