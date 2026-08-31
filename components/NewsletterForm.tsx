"use client";

import { useState } from "react";

/**
 * Form iscrizione newsletter.
 * INTERIM: invia l'iscrizione via mailto a max@storiedibrand.it (Max riceve
 * le email e le aggiunge manualmente). Quando il provider (es. Beehiiv) sarà
 * pronto, basterà sostituire handleSubmit con la POST/iframe del provider.
 */
export default function NewsletterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setStatus("error");
      return;
    }
    const subject = encodeURIComponent("Iscrizione newsletter Storie di Brand");
    const body = encodeURIComponent(
      `Ciao, vorrei iscrivermi alla newsletter settimanale.\n\nNome: ${name || "—"}\nEmail: ${email}`
    );
    window.location.href = `mailto:max@storiedibrand.it?subject=${subject}&body=${body}`;
    setStatus("done");
  }

  if (status === "done") {
    return (
      <p className="newsletter__done">
        Ci siamo quasi: si è aperta la tua email, invia il messaggio e sei dei
        nostri. 📬
      </p>
    );
  }

  return (
    <form className="newsletter__form" onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        placeholder="Il tuo nome"
        aria-label="Il tuo nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        required
        placeholder="La tua email"
        aria-label="La tua email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        className={status === "error" ? "is-error" : ""}
      />
      {/* Risponde alla domanda del sottotitolo: "Sei dei nostri?" → "Entra". */}
      <button type="submit" className="btn btn--primary">
        Entra
      </button>
      {status === "error" && (
        <span className="newsletter__err">Inserisci un&apos;email valida.</span>
      )}
    </form>
  );
}
