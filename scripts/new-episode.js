#!/usr/bin/env node

/**
 * Scaffolder di bozze articolo.
 *
 * Crea un file Markdown precompilato in content/episodes/ a partire da un
 * episodio del feed podcast (public/podcast-episodes.json). Automatizza la
 * parte meccanica — frontmatter, slug, durata, data, fonti, ossatura dei
 * paragrafi — così resta da scrivere solo il racconto (che è ciò che conta
 * per la SEO).
 *
 * Uso:
 *   node scripts/new-episode.js <id-episodio>      # per id esatto del feed
 *   node scripts/new-episode.js "kfc"              # cerca per titolo (substring)
 *   node scripts/new-episode.js --list [filtro]    # elenca gli episodi del feed
 *   node scripts/new-episode.js "kfc" --force      # sovrascrive se esiste già
 *
 * ⚠️  L'unico campo che il feed podcast NON contiene è il link YouTube: va
 *     incollato a mano in `youtubeUrl` (serve anche per la copertina della card).
 */

const fs = require("fs");
const path = require("path");

const FEED = path.join(__dirname, "..", "public", "podcast-episodes.json");
const EPISODES_DIR = path.join(__dirname, "..", "content", "episodes");

// --- Utility -------------------------------------------------------------

// Nome brand: la parte prima del primo "|", senza marcatori di parte finali.
function brandFromTitle(title) {
  let t = title.split("|")[0].trim();
  t = t.replace(/\s*\(?\s*P\.?\s*T\.?\s*\.?\s*\d.*$/i, "").trim();
  return t;
}

// Slug: minuscolo, senza accenti, alfanumerico-trattino, con suffisso "-storia".
function slugify(str) {
  return (
    str
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") + "-storia"
  );
}

// Data RSS ("Fri, 26 Jun 2026 10:05:00 -0000") → "2026-06-26". Fallback: oggi.
function isoDate(rssDate) {
  const d = new Date(rssDate);
  return isNaN(d) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
}

// Escape minimale per una stringa in un valore YAML tra virgolette doppie.
function yaml(str) {
  return String(str || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').trim();
}

function loadFeed() {
  if (!fs.existsSync(FEED)) {
    console.error(`❌ Feed non trovato: ${FEED}\n   Esegui prima: node scripts/update-podcast-episodes.js`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(FEED, "utf8"));
}

// --- Comandi -------------------------------------------------------------

function list(filter) {
  const feed = loadFeed();
  const rows = feed
    .filter((e) => !filter || e.title.toLowerCase().includes(filter.toLowerCase()))
    .slice(0, 40);
  if (rows.length === 0) {
    console.log("Nessun episodio corrisponde al filtro.");
    return;
  }
  for (const e of rows) {
    console.log(`${e.id.padEnd(20)}  ${isoDate(e.date)}  ${e.title.trim()}`);
  }
  console.log(`\n${rows.length} episodi mostrati. Crea la bozza con: node scripts/new-episode.js <id>`);
}

function findEpisode(query) {
  const feed = loadFeed();
  // 1) match per id esatto
  const byId = feed.find((e) => e.id === query);
  if (byId) return byId;
  // 2) ricerca per titolo (substring)
  const matches = feed.filter((e) => e.title.toLowerCase().includes(query.toLowerCase()));
  if (matches.length === 0) {
    console.error(`❌ Nessun episodio trovato per "${query}".`);
    console.error(`   Prova: node scripts/new-episode.js --list ${query}`);
    process.exit(1);
  }
  if (matches.length > 1) {
    console.error(`⚠️  "${query}" corrisponde a ${matches.length} episodi — scegline uno per id:\n`);
    for (const e of matches.slice(0, 15)) {
      console.error(`   ${e.id.padEnd(20)}  ${e.title.trim()}`);
    }
    process.exit(1);
  }
  return matches[0];
}

function create(query, force) {
  const ep = findEpisode(query);
  const brand = brandFromTitle(ep.title);
  const slug = slugify(brand);
  const file = path.join(EPISODES_DIR, `${slug}.md`);

  if (fs.existsSync(file) && !force) {
    console.error(`⚠️  Esiste già una bozza/articolo per "${brand}":`);
    console.error(`   ${path.relative(process.cwd(), file)}`);
    console.error(`   (È normale per le serie in più parti — l'articolo del brand è unico.)`);
    console.error(`   Usa --force per sovrascrivere.`);
    process.exit(1);
  }

  const md = `---
title: "${yaml(brand)}: DA COMPLETARE — scrivi qui il titolo dell'articolo"
slug: "${slug}"
publishedAt: "${new Date().toISOString().slice(0, 10)}"
brand: "${yaml(brand)}"
sector: "DA DEFINIRE"
era: "DA DEFINIRE"
youtubeUrl: ""
duration: "${yaml(ep.duration)}"
excerpt: "${yaml(ep.excerpt)}"
coverColor: "#ff5757"
featured: false
sources:
  - label: "Storie di Brand — episodio del podcast"
  - label: "${yaml(brand)} — storia dell'azienda"
relatedSlugs: []
---

<!--
  BOZZA generata da: ${ep.title.trim()} (id ${ep.id}, ${isoDate(ep.date)})
  DA FARE prima di pubblicare:
    1. youtubeUrl  → incolla il link YouTube (serve anche per la copertina della card)
    2. title       → un titolo editoriale accattivante
    3. sector, era → settore e decade di riferimento
    4. excerpt     → rifinisci la sintesi (meta description, ~160 caratteri)
    5. corpo       → scrivi il racconto sostituendo l'ossatura qui sotto
-->

Paragrafo di apertura: l'aggancio. Perché questa storia merita di essere raccontata?
Poni la domanda a cui l'articolo risponde.

## Le origini

Come e dove nasce ${brand}. Il contesto, i protagonisti, la prima intuizione.

## La svolta

Il momento che cambia tutto: il prodotto, la scelta, l'errore o il colpo di fortuna.

## L'eredità

Cosa resta oggi di ${brand} e perché continua a raccontarci qualcosa.
`;

  fs.mkdirSync(EPISODES_DIR, { recursive: true });
  fs.writeFileSync(file, md);

  console.log(`✅ Bozza creata: ${path.relative(process.cwd(), file)}`);
  console.log(`   Brand: ${brand}  ·  durata: ${ep.duration || "—"}`);
  console.log(`\n👉 Da completare a mano: youtubeUrl, title, sector, era, excerpt, corpo.`);
  console.log(`   Appena salvi, l'articolo compare in cima a "Ultimi Episodi".`);
}

// --- Entry point ---------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    console.log(
      [
        "Scaffolder di bozze articolo.",
        "",
        "  node scripts/new-episode.js <id-episodio>      crea la bozza da un id del feed",
        '  node scripts/new-episode.js "kfc"              cerca per titolo e crea la bozza',
        "  node scripts/new-episode.js --list [filtro]    elenca gli episodi del feed",
        '  node scripts/new-episode.js "kfc" --force      sovrascrive se la bozza esiste',
      ].join("\n")
    );
    return;
  }

  const force = args.includes("--force");
  if (args[0] === "--list") {
    list(args[1]);
    return;
  }
  create(args[0], force);
}

main();
