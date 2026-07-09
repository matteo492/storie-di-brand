#!/usr/bin/env node

/**
 * Genera public/brand-timeline.json per il gioco "Timeline dei Brand".
 *
 * Per ogni brand raccontato nel podcast principale (public/podcast-episodes.json)
 * associa l'ANNO DI FONDAZIONE (mappa curata qui sotto) e sceglie l'episodio
 * rappresentativo da far ascoltare (di norma la Pt 1 / il più vecchio per data).
 *
 * ⚠️  Gli anni di fondazione sono curati a mano da conoscenza generale: verificali
 *     e correggi liberamente la mappa FOUNDING qui sotto. La chiave è il brand
 *     normalizzato (vedi funzione key()), il valore { name, year }.
 */

const fs = require("fs");
const path = require("path");

const INPUT = path.join(__dirname, "..", "public", "podcast-episodes.json");
const OUTPUT = path.join(__dirname, "..", "public", "brand-timeline.json");

// Normalizza il titolo nella "chiave brand": maiuscolo, parte prima di "|",
// senza marcatori di parte (Pt 1, Pt. 2, (pt 1)…) e senza code dopo ":".
function key(title) {
  let t = title.toUpperCase().split("|")[0];
  t = t.replace(/\s*\(?\s*P\.?\s*T\.?\s*\.?\s*\d.*$/, "");
  t = t.replace(/\s*PT\.?\s*\d.*$/, "");
  t = t.replace(/:.*$/, "");
  t = t.replace(/\bE IL\b.*$/, "").replace(/\bE L.*$/, "");
  return t
    .replace(/[^A-Z0-9À-Ü &'.\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Mappa curata: chiave normalizzata → { name (come mostrato), year (fondazione) }.
// Gli speciali (SCELTE, SPECIALE, STORIE DI BRAND, ecc.) sono volutamente esclusi.
const FOUNDING = {
  "SCHWEPPES": { name: "Schweppes", year: 1783 },
  "GUINNESS": { name: "Guinness", year: 1759 },
  "LEVIS": { name: "Levi's", year: 1853 },
  "LOUIS VUITTON": { name: "Louis Vuitton", year: 1854 },
  "STABILO": { name: "Stabilo", year: 1855 },
  "NOKIA": { name: "Nokia", year: 1865 },
  "JACK DANIEL'S": { name: "Jack Daniel's", year: 1866 },
  "FERRINO": { name: "Ferrino", year: 1870 },
  "YAMAHA": { name: "Yamaha", year: 1887 },
  "KODAK": { name: "Kodak", year: 1888 },
  "NINTENDO": { name: "Nintendo", year: 1889 },
  "BISCOTTI GENTILINI": { name: "Gentilini", year: 1890 },
  "PEPSI": { name: "Pepsi", year: 1893 },
  "MELEGATTI": { name: "Melegatti", year: 1894 },
  "DOLOMITE": { name: "Dolomite", year: 1897 },
  "I SEGRETI DI FIAT": { name: "Fiat", year: 1899 },
  "ASPIRINA": { name: "Aspirina", year: 1899 },
  "HARLEY-DAVIDSON": { name: "Harley-Davidson", year: 1903 },
  "KELLOGG'S": { name: "Kellogg's", year: 1906 },
  "NEW BALANCE": { name: "New Balance", year: 1906 },
  "PERUGINA": { name: "Perugina", year: 1907 },
  "OLIVETTI": { name: "Olivetti", year: 1908 },
  "CHANEL": { name: "Chanel", year: 1910 },
  "MARS": { name: "Mars", year: 1911 },
  "NIVEA": { name: "Nivea", year: 1911 },
  "SUPERGA": { name: "Superga", year: 1911 },
  "MASERATI": { name: "Maserati", year: 1914 },
  "BIALETTI": { name: "Bialetti", year: 1919 },
  "GUCCI": { name: "Gucci", year: 1921 },
  "BMW MOTORRAD": { name: "BMW Motorrad", year: 1923 },
  "COLMAR": { name: "Colmar", year: 1923 },
  "I SEGRETI DI WALT DISNEY": { name: "Disney", year: 1923 },
  "WARNER BROS.": { name: "Warner Bros.", year: 1923 },
  "I SEGRETI DI COCA-COLA": { name: "Coca-Cola", year: 1886 },
  "LA SPORTIVA": { name: "La Sportiva", year: 1928 },
  "LOONEY TUNES": { name: "Looney Tunes", year: 1930 },
  "LEGO": { name: "LEGO", year: 1932 },
  "LACOSTE": { name: "Lacoste", year: 1933 },
  "DC COMICS": { name: "DC Comics", year: 1934 },
  "SALEWA": { name: "Salewa", year: 1935 },
  "MONOPOLY": { name: "Monopoly", year: 1935 },
  "POLAROID": { name: "Polaroid", year: 1937 },
  "SCARPA": { name: "Scarpa", year: 1938 },
  "MARVEL": { name: "Marvel", year: 1939 },
  "FANTA": { name: "Fanta", year: 1940 },
  "MCDONALD'S": { name: "McDonald's", year: 1940 },
  "IKEA": { name: "IKEA", year: 1943 },
  "ALGIDA": { name: "Algida", year: 1945 },
  "BIC": { name: "Bic", year: 1945 },
  "DIOR": { name: "Dior", year: 1946 },
  "FERRERO": { name: "Ferrero", year: 1946 },
  "TUPPERWARE": { name: "Tupperware", year: 1946 },
  "FERRARI": { name: "Ferrari", year: 1947 },
  "PUMA SUEDE": { name: "Puma", year: 1948 },
  "ADIDAS VS PUMA": { name: "Adidas", year: 1949 },
  "HEAD": { name: "Head", year: 1950 },
  "KFC": { name: "KFC", year: 1952 },
  "PLAYBOY": { name: "Playboy", year: 1953 },
  "GUINNESS WORLD RECORD": { name: "Guinness World Records", year: 1955 },
  "GUIDO BERLUCCHI": { name: "Guido Berlucchi", year: 1955 },
  "MINI": { name: "Mini", year: 1959 },
  "BARBIE": { name: "Barbie", year: 1959 },
  "YVES SAINT LAURENT": { name: "Yves Saint Laurent", year: 1961 },
  "LAMBORGHINI": { name: "Lamborghini", year: 1963 },
  "GARMONT": { name: "Garmont", year: 1964 },
  "NIKE": { name: "Nike", year: 1964 },
  "GATORADE": { name: "Gatorade", year: 1965 },
  "K-WAY": { name: "K-Way", year: 1965 },
  "KAPPA": { name: "Kappa", year: 1967 },
  "THE NORTH FACE": { name: "The North Face", year: 1968 },
  "STARBUCKS": { name: "Starbucks", year: 1971 },
  "DOLOMITI SUPERSKI": { name: "Dolomiti Superski", year: 1974 },
  "ARMANI": { name: "Armani", year: 1975 },
  "DELOREAN": { name: "DeLorean", year: 1975 },
  "APPLE": { name: "Apple", year: 1976 },
  "L'ERBOLARIO": { name: "L'Erbolario", year: 1978 },
  "POST-IT": { name: "Post-it", year: 1980 },
  "AIR JORDAN": { name: "Air Jordan", year: 1984 },
  "BLACKBERRY": { name: "BlackBerry", year: 1984 },
  "RYANAIR": { name: "Ryanair", year: 1984 },
  "TETRIS": { name: "Tetris", year: 1984 },
  "L'INSPIEGABILE CADUTA DI BLOCKBUSTER": { name: "Blockbuster", year: 1985 },
  "PIXAR": { name: "Pixar", year: 1986 },
  "RED BULL": { name: "Red Bull", year: 1987 },
  "POKÉMON": { name: "Pokémon", year: 1996 },
  "HARRY POTTER": { name: "Harry Potter", year: 1997 },
  "NETFLIX": { name: "Netflix", year: 1997 },
  "GOOGLE": { name: "Google", year: 1998 },
  "WIKIPEDIA": { name: "Wikipedia", year: 2001 },
  "GO PRO": { name: "GoPro", year: 2002 },
  "YOUTUBE": { name: "YouTube", year: 2005 },
  "SPOTIFY": { name: "Spotify", year: 2006 },
  "TWITTER": { name: "Twitter", year: 2006 },
  "AIR BNB": { name: "Airbnb", year: 2008 },
  "UBER": { name: "Uber", year: 2009 },
  "WHATSAPP": { name: "WhatsApp", year: 2009 },
  "INSTAGRAM": { name: "Instagram", year: 2010 },
  "TREEDOM": { name: "Treedom", year: 2010 },
  "ZOOM": { name: "Zoom", year: 2011 },
  "TINDER": { name: "Tinder", year: 2012 },
  "TELEGRAM": { name: "Telegram", year: 2013 },
};

// Rileva se un titolo è la "parte 1" di una serie.
function isPartOne(title) {
  return /\bP\.?\s*T\.?\s*\.?\s*1\b/i.test(title) || /\(\s*PT\.?\s*1/i.test(title);
}

// Estrae il numero di parte dal titolo (Pt 2, Pt. 3, (pt 4)…), null se assente.
function partNumber(title) {
  const m = title.match(/\bP\.?\s*T\.?\s*\.?\s*(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}

function main() {
  const episodes = JSON.parse(fs.readFileSync(INPUT, "utf8"));

  // Raggruppa per chiave brand
  const groups = {};
  for (const e of episodes) {
    const k = key(e.title);
    (groups[k] = groups[k] || []).push(e);
  }

  const out = [];
  const missing = [];
  for (const [k, meta] of Object.entries(FOUNDING)) {
    const list = groups[k];
    if (!list || list.length === 0) {
      missing.push(k);
      continue;
    }
    // Episodio rappresentativo: la Pt 1 esplicita, altrimenti il più vecchio per data.
    const sorted = [...list].sort((a, b) => new Date(a.date) - new Date(b.date));
    const rep = sorted.find((e) => isPartOne(e.title)) || sorted[0];

    // Tutti gli episodi del brand, deduplicati per titolo (le ripubblicazioni
    // hanno lo stesso titolo ma id diverso) e ordinati per numero di parte
    // quando c'è (Pt 1, Pt 2…), altrimenti per data di pubblicazione.
    const seen = new Set();
    const all = sorted.filter((e) => {
      const t = e.title.trim().toUpperCase().replace(/\s+/g, " ");
      if (seen.has(t)) return false;
      seen.add(t);
      return true;
    });
    all.sort((a, b) => {
      const pa = partNumber(a.title);
      const pb = partNumber(b.title);
      if (pa != null && pb != null) return pa - pb;
      if (pa != null) return -1;
      if (pb != null) return 1;
      return new Date(a.date) - new Date(b.date);
    });

    out.push({
      brand: meta.name,
      year: meta.year,
      id: rep.id,
      title: rep.title.trim(),
      image: rep.image || "",
      parts: all.length,
      episodes: all.map((e) => ({ id: e.id, title: e.title.trim() })),
    });
  }

  out.sort((a, b) => a.year - b.year || a.brand.localeCompare(b.brand));

  fs.writeFileSync(OUTPUT, JSON.stringify(out, null, 2));
  console.log(`✅ ${out.length} brand sulla timeline → ${OUTPUT}`);
  console.log(`   Range: ${out[0].year} – ${out[out.length - 1].year}`);
  if (missing.length) {
    console.log(`⚠️  ${missing.length} chiavi non trovate nel feed:`, missing.join(", "));
  }
}

main();
