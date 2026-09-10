"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { scorriAllaSezione } from "@/lib/scorrimento";

/**
 * Collegamento a una sezione della home, da qualunque pagina.
 *
 * Da un'altra pagina naviga e basta: allo scorrimento ci pensa PageTransition
 * quando la home è caricata. Dalla home invece il collegamento non avrebbe
 * niente da navigare e il browser si limiterebbe a saltare all'ancora: qui
 * lo si intercetta e si scorre.
 */
export default function LinkSezione({
  id,
  className,
  children,
}: {
  /** L'ancora senza cancelletto, es. "collabora". */
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={`/#${id}`}
      className={className}
      onClick={(e) => {
        if (pathname === "/" && scorriAllaSezione(id)) e.preventDefault();
      }}
    >
      {children}
    </Link>
  );
}
