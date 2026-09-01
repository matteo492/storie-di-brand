import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * L'icona del sito è /sdb-sigla.svg, quindi /favicon.ico non esiste più.
   * Chi lo chiede lo stesso — vecchi segnalibri, lettori di feed, qualche
   * crawler — non deve prendersi un 404: lo mandiamo sull'icona vera.
   */
  async redirects() {
    return [{ source: "/favicon.ico", destination: "/sdb-sigla.svg", permanent: true }];
  },
};

export default nextConfig;
