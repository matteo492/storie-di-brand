"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { scorriInCima } from "@/lib/scorrimento";

/**
 * La firma che riporta in home. Quando ci sei già, invece di non fare niente
 * — che è quello che succede a un collegamento verso la pagina corrente —
 * riporta in cima scorrendo.
 */
export default function LinkCasa({
  className,
  etichetta,
  alClick,
  children,
}: {
  className?: string;
  /** Il nome per chi usa uno screen reader. */
  etichetta: string;
  /** Da fare comunque, in home e non: serve all'header per chiudere il menu. */
  alClick?: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      className={className}
      aria-label={etichetta}
      onClick={(e) => {
        alClick?.();
        if (pathname === "/") {
          e.preventDefault();
          scorriInCima();
        }
      }}
    >
      {children}
    </Link>
  );
}
