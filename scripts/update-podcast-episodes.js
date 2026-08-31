#!/usr/bin/env node

const https = require("https");
const fs = require("fs");
const path = require("path");
const { parseStringPromise } = require("xml2js");
const { pulisciCoda } = require("./lib/pulisci-coda.js");

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

/**
 * Corregge i refusi ricorrenti nei testi del feed (scritti a mano su Megaphone).
 * Volutamente conservativo: solo parole in cui l'accento o l'apostrofo non sono
 * ambigui. La correzione vera andrebbe fatta su Megaphone; qui evitiamo che
 * l'errore finisca in pagina nel frattempo.
 */
const ACCENTI = {
  eredita: "eredità", citta: "città", societa: "società", realta: "realtà",
  qualita: "qualità", attivita: "attività", verita: "verità", novita: "novità",
  liberta: "libertà", identita: "identità", universita: "università",
  pubblicita: "pubblicità", felicita: "felicità", difficolta: "difficoltà",
  possibilita: "possibilità", capacita: "capacità", curiosita: "curiosità",
  celebrita: "celebrità", perche: "perché", poiche: "poiché", finche: "finché",
  benche: "benché", cioe: "cioè", piu: "più", puo: "può", cosi: "così",
};
// Nomi femminili che dopo "un" vogliono l'apostrofo
const FEMMINILI = "auto|idea|azienda|epoca|impresa|era|ora|isola|opera|arma|ombra|altra|americana|italiana";

function fixTypos(text) {
  let out = text;
  for (const [sbagliato, giusto] of Object.entries(ACCENTI)) {
    out = out.replace(new RegExp(`\\b${sbagliato}\\b`, "g"), giusto);
    out = out.replace(
      new RegExp(`\\b${sbagliato[0].toUpperCase()}${sbagliato.slice(1)}\\b`, "g"),
      giusto[0].toUpperCase() + giusto.slice(1)
    );
  }
  return out
    .replace(new RegExp(`\\b([Uu])n (${FEMMINILI})\\b`, "g"), "$1n'$2")
    .replace(/\bma d dove\b/gi, "ma da dove")
    .replace(/\s{2,}/g, " ");
}

/**
 * Ripulisce la descrizione dal feed: via HTML, blocchi sponsor e righe con link,
 * così l'anteprima mostra il racconto e non la promo di turno.
 */
function cleanDescription(raw) {
  const text = raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/⁠/g, ""); // word-joiner usato nei link del feed

  const isPromo = (line) =>
    !line ||
    /^[\s\p{Extended_Pictographic}]*(prova|scopri|vai su|usa il codice|sponsor|iscriviti|segui)/iu.test(line) ||
    /\b(finom|surfshark|nordvpn|brevo|brandy|brnady|codice sconto)\b/i.test(line) ||
    // boilerplate della piattaforma
    /learn more about your ad choices|adchoices/i.test(line) ||
    // crediti di produzione: non raccontano la puntata
    /^(copertina|cover|sound design|supporto autoriale|voci|voce|montaggio|musiche|musica|scritto da|prodotto da|produzione|regia|editing|grafica|illustrazioni|si ringrazia|un podcast di)\b/i.test(
      line
    );

  // I link vanno tolti, non fanno scartare la riga: a volte la descrizione è
  // incollata all'URL senza spazio (…?t=123TVincenzo Lancia è…) e buttare via
  // la riga intera significherebbe perdere il racconto. Il confine dell'URL lo
  // troviamo sullo spazio o sulla prima parola con l'iniziale maiuscola.
  const noLinks = text.replace(/https?:\/\/\S*?(?=[A-Z][a-z]{2,}|\s|$)/g, " ");

  const body = noLinks
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => !isPromo(l))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  // Se dopo la pulizia non resta nulla di raccontato, meglio nessuna anteprima
  // che rimettere in pagina la promo o i crediti.
  // Via anche l'invito rimasto monco dopo il taglio dell'indirizzo.
  return pulisciCoda(fixTypos(body).slice(0, 320).trim());
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
    const excerpt = cleanDescription(rawDesc);
    const pubDate = item.pubDate?.[0] || "";
    const duration = parseDuration(item["itunes:duration"]?.[0] || "");
    const image =
      item["itunes:image"]?.[0]?.$.href ||
      item["itunes:image"]?.[0] ||
      "";

    // L'URL dell'enclosure è lo stesso che usano Spotify e Apple: mantiene
    // il conteggio degli ascolti e l'inserimento pubblicitario di Megaphone.
    return { id, title, excerpt, duration, date: pubDate, image, audio: enclosureUrl };
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

    // Gli episodi ancora presenti nel feed vengono riallineati (titolo, descrizione,
    // durata, copertina): così le correzioni fatte su Megaphone arrivano sul sito.
    // Quelli usciti dal feed restano nello storico così come sono.
    const fresh = new Map(newEpisodes.filter((ep) => ep.id).map((ep) => [ep.id, ep]));
    let refreshed = 0;
    allEpisodes = allEpisodes.map((ep) => {
      const f = fresh.get(ep.id);
      if (!f) return ep;
      if (f.excerpt !== ep.excerpt || f.title !== ep.title || f.duration !== ep.duration) refreshed++;
      return { ...ep, ...f };
    });
    if (refreshed > 0) console.log(`♻️  Refreshed ${refreshed} existing episodes`);

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
