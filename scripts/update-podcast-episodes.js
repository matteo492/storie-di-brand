#!/usr/bin/env node

const https = require("https");
const fs = require("fs");
const path = require("path");
const { parseStringPromise } = require("xml2js");

const FEED_URL = "https://feeds.megaphone.fm/storiedibrand";
const OUTPUT_PATH = path.join(__dirname, "..", "public", "podcast-episodes.json");

function fetchFeed() {
  return new Promise((resolve, reject) => {
    https.get(FEED_URL, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

function parseDuration(raw) {
  if (!raw) return "";
  // HH:MM:SS o MM:SS o secondi interi
  const parts = raw.trim().split(":").map(Number);
  let totalSec;
  if (parts.length === 3) {
    totalSec = parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    totalSec = parts[0] * 60 + parts[1];
  } else {
    totalSec = parts[0];
  }
  const min = Math.round(totalSec / 60);
  return `${min} min`;
}

async function parseFeed(xml) {
  const parsed = await parseStringPromise(xml);
  const items = parsed.rss.channel[0].item || [];

  return items.map((item) => {
    const enclosure = item.enclosure?.[0];
    const enclosureUrl = enclosure?.$.url || "";
    const idMatch = enclosureUrl.match(/\/([A-Z0-9]+)\.mp3/);
    const id = idMatch ? idMatch[1] : "";

    const title = item.title?.[0] || "";
    const rawDesc = item.description?.[0] || item["itunes:summary"]?.[0] || "";
    const excerpt = rawDesc.replace(/<[^>]*>/g, "").slice(0, 180).trim();
    const pubDate = item.pubDate?.[0] || "";
    const duration = parseDuration(item["itunes:duration"]?.[0] || "");
    const image =
      item["itunes:image"]?.[0]?.$.href ||
      item["itunes:image"]?.[0] ||
      "";

    return { id, title, excerpt, duration, date: pubDate, image };
  });
}

async function main() {
  try {
    console.log("📡 Fetching feed:", FEED_URL);
    const xml = await fetchFeed();

    console.log("⏳ Parsing episodes...");
    const newEpisodes = await parseFeed(xml);
    console.log(`✅ Found ${newEpisodes.length} episodes in feed`);

    let allEpisodes = [];
    if (fs.existsSync(OUTPUT_PATH)) {
      const existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf8"));
      console.log(`📚 Loaded ${existing.length} episodes from history`);
      allEpisodes = existing;
    }

    const idSet = new Set(allEpisodes.map((ep) => ep.id));
    const toAdd = newEpisodes.filter((ep) => ep.id && !idSet.has(ep.id));

    allEpisodes.unshift(...toAdd);
    allEpisodes.sort((a, b) => new Date(b.date) - new Date(a.date));

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
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allEpisodes, null, 2));
    console.log(`💾 Saved to ${OUTPUT_PATH}`);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

main();
