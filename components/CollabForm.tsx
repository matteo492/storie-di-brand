"use client";

import { useState } from "react";

export default function CollabForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("https://formspree.io/f/maqgeokq", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("done");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="collab-form__done">
        <p>Messaggio ricevuto! Ti risponderemo presto.</p>
      </div>
    );
  }

  return (
    <form className="collab-form" onSubmit={handleSubmit}>
      <div className="collab-form__row">
        <input
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
        type="text"
        name="azienda"
        placeholder="Azienda / Brand"
        aria-label="Azienda"
      />
      <textarea
        name="messaggio"
        placeholder="Raccontaci il tuo progetto…"
        rows={4}
        required
        aria-label="Messaggio"
      />
      <button
        type="submit"
        className="btn btn--primary btn--big"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Invio…" : "Invia la richiesta"}
      </button>
      {status === "error" && (
        <p className="collab-form__err">Qualcosa è andato storto. Riprova o scrivici a info@storiedibrand.it</p>
      )}
    </form>
  );
}
