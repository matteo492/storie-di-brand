"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/#podcast-originale", label: "Podcast" },
  { href: "/episodi", label: "Episodi" },
  { href: "/#live", label: "Live" },
  { href: "/#newsletter", label: "Newsletter" },
  { href: "/#collabora", label: "Collabora" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Smooth-scroll mirato per le ancore della pagina corrente (la home).
  // Per le ancore di un'altra pagina lasciamo navigare Next: ci pensa
  // PageTransition a scrollare con smooth a destinazione caricata.
  const handleNav = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setOpen(false);
    if (href.startsWith("/#") && pathname === "/") {
      const el = document.getElementById(href.slice(2));
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <Link href="/" className="nav__logo">
        STORIE<span>DI</span>BRAND
      </Link>
      <nav className={`nav__links${open ? " open" : ""}`}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={(e) => handleNav(e, l.href)}>
            {l.label}
          </Link>
        ))}
      </nav>
      <a href="/#collabora" className="btn btn--small btn--red" onClick={(e) => { if (typeof window !== 'undefined' && window.location.pathname === '/') { e.preventDefault(); document.getElementById('collabora')?.scrollIntoView({ behavior: 'smooth' }); } }}>
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
