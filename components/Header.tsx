"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MarchioSdb from "./MarchioSdb";

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
      {/* Due firme: il marchio vero e proprio — lo stesso del footer — e la
          sigla, che prende il suo posto quando lo spazio si stringe, perché
          tre righe di testo dentro a una barra alta 60px non si leggono.
          Sono entrambi disegni, non testo: la sigla scritta a mano che stava
          qui prima non era mai davvero uguale al marchio.
          Sono entrambe nel documento e a scambiarle è il CSS, così il cambio
          è immediato al ridimensionamento e il nome per i lettori di schermo
          resta uno solo, sull'aria-label del collegamento. */}
      <Link
        href="/"
        className="nav__logo"
        aria-label="Storie di Brand"
        // Col menu aperto la firma porta in home: lasciare il pannello
        // aperto sopra alla pagina appena arrivata non avrebbe senso.
        onClick={() => setOpen(false)}
      >
        <MarchioSdb className="nav__logo__marchio" />
        <img
          className="nav__logo__sigla"
          src="/sdb-sigla.svg"
          alt=""
          width={1080}
          height={1080}
        />
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
        {/* Sotto i 900px il pulsante rosso qui sotto sparisce: senza questa
            voce, dal menu non si arriverebbe più al form. Sopra i 900px la
            nasconde il CSS, per non averla due volte nella stessa barra. */}
        <Link
          href="/#collabora"
          className="nav__links__cta"
          onClick={(e) => handleNav(e, "/#collabora")}
        >
          Collabora
        </Link>
      </nav>
      <Link
        href="/#collabora"
        className="btn btn--small btn--red"
        onClick={(e) => handleNav(e, "/#collabora")}
      >
        Collabora
      </Link>
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
