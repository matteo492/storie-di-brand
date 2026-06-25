#!/usr/bin/env node
// Fetches view counts from YouTube Data API v3 and saves to public/youtube-stats.json
// Requires env: YOUTUBE_API_KEY

const fs = require("fs");
const path = require("path");

const VIDEO_IDS = [
  "F06RtRjXrCU",
  "QRc5dydzwqo",
  "ihcYNgSVsTY",
  "BAZKEGwyKlw",
];

function formatViews(n) {
  return Number(n).toLocaleString("it-IT").replace(/\./g, ".");
}

async function main() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    console.error("Missing YOUTUBE_API_KEY");
    process.exit(1);
  }

  const ids = VIDEO_IDS.join(",");
  const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${key}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
  const data = await res.json();

  const stats = {};
  for (const item of data.items) {
    stats[item.id] = formatViews(item.statistics.viewCount);
  }

  const outPath = path.join(__dirname, "..", "public", "youtube-stats.json");
  fs.writeFileSync(outPath, JSON.stringify(stats, null, 2));
  console.log("youtube-stats.json updated:", stats);
}

main().catch((e) => { console.error(e); process.exit(1); });
