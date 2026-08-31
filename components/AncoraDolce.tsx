"use client";

/**
 * Collegamento a una sezione della stessa pagina, con scorrimento morbido.
 * Serve perché il foglio di stile non attiva `scroll-behavior: smooth` in
 * modo globale: lo farebbe scattare anche a ogni cambio di pagina.
 */
export default function AncoraDolce({
  href,
  className,
  children,
}: {
  /** Ancora della sezione, es. "#progetto". */
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        const el = document.querySelector(href);
        if (!el) return; // sezione assente: lascia fare al salto normale
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
      }}
    >
      {children}
    </a>
  );
}
