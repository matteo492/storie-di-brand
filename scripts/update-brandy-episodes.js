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

async function parseFeed(xml) {
  const parsed = await parseStringPromise(xml);
  const items = parsed.rss.channel[0].item || [];

  return items.map((item) => {
    const link = item.link?.[0] || "";
    // Estrai l'ID Megaphone dall'URL (es: https://podcast.megaphone.fm/?e=XXXXX)
    const match = link.match(/[?&]e=([^&]+)/);
    const id = match ? match[1] : link.split("/").pop() || "";

    const title = item.title?.[0] || "";
    const description = (item.description?.[0] || "").replace(/<[^>]*>/g, "");
    const pubDate = item.pubDate?.[0] || "";

    return {
      id,
      t: title,
      d: description.slice(0, 200), // Limit 200 chars
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

    // Mergia: evita duplicati basati su ID
    const idSet = new Set(allEpisodes.map((ep) => ep.id));
    const toAdd = newEpisodes.filter((ep) => !idSet.has(ep.id));

    allEpisodes.unshift(...toAdd); // Aggiungi i nuovi in cima
    allEpisodes.sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordina per data decrescente

    // Rimuovi duplicati (nel caso ce ne fossero)
    const seenIds = new Set();
    allEpisodes = allEpisodes.filter((ep) => {
      if (seenIds.has(ep.id)) return false;
      seenIds.add(ep.id);
      return true;
    });

    if (toAdd.length > 0) {
      console.log(`✨ Added ${toAdd.length} new episodes`);
    } else {
      console.log("🆗 No new episodes");
    }

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
