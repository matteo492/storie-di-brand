"use client";

import { useEffect, useState } from "react";

export default function BookBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("book-banner-dismissed")) return;

    const onScroll = () => {
      if (window.scrollY > 80) {
        setVisible(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function dismiss() {
    setDismissed(true);
    sessionStorage.setItem("book-banner-dismissed", "1");
  }

  if (dismissed) return null;

  return (
    <div className={`book-banner${visible ? " is-visible" : ""}`} role="complementary" aria-label="Il libro di Max Corona">
      <img src="/libro-cover.png" alt="Copertina Persone che pensano in grande" className="book-banner__cover" />
      <div className="book-banner__text">
        <p className="book-banner__title">Persone che pensano in grande</p>
        <p className="book-banner__sub">Il libro di Max Corona</p>
      </div>
      <a
        href="https://www.amazon.it/Persone-che-pensano-grande-raccontato-ebook/dp/B0CG9FT3DJ/"
        target="_blank"
        rel="noopener"
        className="btn btn--primary book-banner__cta"
      >
        Acquista su Amazon
      </a>
      <button className="book-banner__close" onClick={dismiss} aria-label="Chiudi">✕</button>
    </div>
  );
}
