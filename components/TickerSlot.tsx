"use client";

import { usePathname } from "next/navigation";

/**
 * Il nastro dei partner sta in fondo a tutte le pagine, ma NON in home:
 * lì i loghi hanno una fascia dedicata (più grandi) subito sotto l'hero,
 * come deciso nella call — averlo due volte sarebbe un doppione.
 */
export default function TickerSlot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <div className="hero__marquee">{children}</div>;
}
