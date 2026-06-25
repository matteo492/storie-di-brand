"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/#podcast-originale", label: "Podcast" },
  { href: "/episodi", label: "Episodi" },
  { href: "/#live", label: "Live" },
  { href: "/#libro", label: "Libro" },
  { href: "/#newsletter", label: "Newsletter" },
  { href: "/#collabora", label: "Collabora" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <Link href="/" className="nav__logo">
        STORIE<span>DI</span>BRAND
      </Link>
      <nav className={`nav__links${open ? " open" : ""}`}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
      </nav>
      <a href="mailto:info@storiedibrand.it" className="btn btn--small btn--red">
        Contattaci
      </a>
      <button
        className="nav__burger"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}
