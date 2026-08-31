"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/podcast", label: "Podcast" },
  { href: "/youtube", label: "YouTube" },
  { href: "/#live", label: "Live" },
  { href: "/#newsletter", label: "Newsletter" },
  { href: "/team", label: "Team" },
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

  /**
   * La voce resta sottolineata quando sei sulla sua pagina. Vale solo per le
   * voci che portano a una pagina vera: quelle che puntano a una sezione della
   * home (/#live, /#newsletter…) non hanno una pagina da segnalare, e
   * sottolinearle a fondo pagina sarebbe una bugia.
   *
   * Il confronto è per prefisso, così le pagine figlie tengono acceso il
   * genitore: /episodi/qualcosa illumina comunque la sua voce.
   */
  const attiva = (href: string) =>
    !href.includes("#") &&
    (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      {/* Due scritture della stessa firma: il nome per esteso e la sigla, che
          da sola resta leggibile quando lo spazio si stringe. Sono entrambe
          nel documento e a scambiarle è il CSS, così il cambio è immediato al
          ridimensionamento e il nome per i lettori di schermo resta uno solo. */}
      <Link href="/" className="nav__logo" aria-label="Storie di Brand">
        <span className="nav__logo__esteso" aria-hidden="true">
          STORIE<em>DI</em>BRAND
        </span>
        <span className="nav__logo__sigla" aria-hidden="true">
          S<em>D</em>B
        </span>
      </Link>
      <nav className={`nav__links${open ? " open" : ""}`}>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={attiva(l.href) ? "page" : undefined}
            onClick={(e) => handleNav(e, l.href)}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <a href="/#collabora" className="btn btn--small btn--red" onClick={(e) => { if (typeof window !== 'undefined' && window.location.pathname === '/') { e.preventDefault(); document.getElementById('collabora')?.scrollIntoView({ behavior: 'smooth' }); } }}>
        Collabora
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
