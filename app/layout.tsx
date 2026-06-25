import type { Metadata } from "next";
import localFont from "next/font/local";
import { Oswald } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Ticker from "@/components/Ticker";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";
import BookBanner from "@/components/BookBanner";
import { SITE_URL } from "@/lib/site";

// Font brand reale (file in /public/fonts) + fallback Oswald
const gothic = localFont({
  src: "../public/fonts/GothicCGNo1-Regular.otf",
  variable: "--font-gothic",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const TICKER_BRANDS = [
  "YAKULT", "UNIVERSITÀ CATTOLICA", "KORO", "SCALABLE CAPITAL",
  "STARTUP GEEKS", "EDEN VIAGGI", "SUPERPROF", "LIFE",
  "NORDVPN", "HAIER", "HUMAMY", "REVOLUT", "WWF",
  "MASERATI", "GENTILINI", "FIORENTINA", "TREEDOM",
  "FINOM", "ODOO", "SURFSHARK", "PLAUD.AI", "EDENRED", "HIGGSFIELD",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Storie di Brand — Le storie dietro i marchi più famosi",
    template: "%s — Storie di Brand",
  },
  description:
    "La docu-serie che racconta storia, errori e intuizioni geniali dietro i brand più famosi del mondo. Condotta da Max Corona.",
  keywords: ["storie di brand", "storia dei marchi", "branding", "marketing", "Max Corona"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Storie di Brand",
    title: "Storie di Brand — Le storie dietro i marchi più famosi",
    description:
      "La docu-serie che racconta storia, errori e intuizioni geniali dietro i brand più famosi del mondo.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Storie di Brand",
    description: "Le incredibili storie dietro i marchi più famosi del mondo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${gothic.variable} ${oswald.variable}`}>
      <body>
        <Header />
        <ScrollReveal />
        <PageTransition>{children}</PageTransition>
        <div className="hero__marquee">
          <Ticker items={TICKER_BRANDS} />
        </div>
        <Footer />
        <BookBanner />
      </body>
    </html>
  );
}
