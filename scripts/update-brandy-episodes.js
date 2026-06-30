#!/usr/bin/env node

const https = require("https");
const fs = require("fs");
const path = require("path");
const { parseStringPromise } = require("xml2js");

const FEED_URL = "https://feeds.megaphone.fm/brandy";
const OUTPUT_PATH = path.join(__dirname, "..", "public", "brandy-episodes.json");

async function fetchFeed() {
  return new Promise((resolve, reject) => {
    https.get(FEED_URL, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

// Pulisce la descrizione: rimuove HTML e taglia la coda pubblicitaria/standard
// (sponsorizzazioni, boilerplate Megaphone) che genererebbe falsi match in ricerca.
function cleanDescription(raw) {
  let d = (raw || "").replace(/<[^>]*>/g, " ");
  // Taglia al primo marcatore di coda promozionale/standard.
  d = d.split(
    /Vuoi far crescere|Prova SHOPIFY|Learn more about your ad choices|Visit megaphone|Privacy Policy|Entra nel canale|Iscriviti al canale|Sostieni il progetto|SPONSOR che sostengono|Sconti e prove|🚀|Scopri Qonto|Scopri NordVPN|Scopri Surfshark|Scopri Revolut|https?:\/\//iu
  )[0];
  return d.replace(/\s+/g, " ").trim().slice(0, 600);
}

async function parseFeed(xml) {
  const parsed = await parseStringPromise(xml);
  const items = parsed.rss.channel[0].item || [];

  return items.map((item) => {
    // L'ID Megaphone (es: MNTHA6659022875) è nell'URL della enclosure
    // URL: https://pdst.fm/e/prfx.byspotify.com/e/pscrb.fm/rss/p/traffic.megaphone.fm/MNTHA6659022875.mp3
    const enclosure = item.enclosure?.[0];
    const enclosureUrl = enclosure?.$.url || "";
    // Nota: l'URL può avere una query dopo .mp3 (es: ".mp3?updated=…"),
    // quindi niente ancora di fine stringa.
    const idMatch = enclosureUrl.match(/\/([A-Z0-9]+)\.mp3/);
    const id = idMatch ? idMatch[1] : "";

    const title = item.title?.[0] || "";
    const pubDate = item.pubDate?.[0] || "";

    return {
      id,
      t: title,
      d: cleanDescription(item.description?.[0]),
      date: pubDate,
    };
  });
}

async function main() {
  try {
    console.log("📡 Fetching feed:", FEED_URL);
    const xml = await fetchFeed();

    console.log("⏳ Parsing episodes...");
    const newEpisodes = await parseFeed(xml);
    console.log(`✅ Found ${newEpisodes.length} new episodes in feed`);

    // Carica il catalogo storico
    let allEpisodes = [];
    if (fs.existsSync(OUTPUT_PATH)) {
      const existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf8"));
      console.log(`📚 Loaded ${existing.length} episodes from history`);
      allEpisodes = existing;
    }

    // Mergia per ID: aggiorna titolo/descrizione degli episodi già presenti
    // (così le descrizioni vecchie troncate vengono rinfrescate) e aggiunge i nuovi.
    const byId = new Map(allEpisodes.filter((ep) => ep.id).map((ep) => [ep.id, ep]));
    let added = 0;
    let updated = 0;
    for (const ep of newEpisodes) {
      if (!ep.id) continue;
      const existing = byId.get(ep.id);
      if (existing) {
        if (existing.t !== ep.t || existing.d !== ep.d) updated++;
        existing.t = ep.t;
        existing.d = ep.d;
        existing.date = ep.date;
      } else {
        byId.set(ep.id, ep);
        added++;
      }
    }

    // Ricostruisce la lista da byId (scarta episodi senza id) e ordina per data
    allEpisodes = Array.from(byId.values()).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    console.log(`✨ Added ${added} new episodes · 🔄 Updated ${updated}`);

    console.log(`📊 Total: ${allEpisodes.length} episodes`);

    // Salva JSON
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allEpisodes, null, 2));
    console.log(`💾 Saved to ${OUTPUT_PATH}`);

  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

main();
