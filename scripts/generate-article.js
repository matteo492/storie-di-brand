#!/usr/bin/env node

/**
 * Generatore di articoli dal copione del video (canale YouTube).
 *
 * Legge il copione che scrivi tu per il video e produce una BOZZA di articolo
 * long-form in italiano (stile "Storie di Brand"), pronta per la revisione.
 * L'articolo viene scritto con `draft: true`, quindi NON compare sul sito
 * (né in "Ultimi Episodi", né in archivio/sitemap/ricerca) finché non lo
 * approvi con `npm run publish:episode`.
 *
 * Uso:
 *   node scripts/generate-article.js content/scripts/nike.md --brand "Nike" --youtube https://youtu.be/XXXXXXXXXXX
 *   node scripts/generate-article.js content/scripts/nike.md            # brand dedotto dal nome file
 *   ... --force                                                         # sovrascrive una bozza esistente
 *
 * Richiede:
 *   - il pacchetto @anthropic-ai/sdk  (npm install)
 *   - la variabile d'ambiente ANTHROPIC_API_KEY
 */

const fs = require("fs");
const path = require("path");

const EPISODES_DIR = path.join(__dirname, "..", "content", "episodes");

// --- Utility (allineate a new-episode.js) --------------------------------

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

function yaml(str) {
  return String(str || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').trim();
}

function titleCaseFromFilename(file) {
  return path
    .basename(file)
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseArgs(argv) {
  const out = { _: [], force: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--force") out.force = true;
    else if (a === "--brand") out.brand = argv[++i];
    else if (a === "--youtube") out.youtube = argv[++i];
    else out._.push(a);
  }
  return out;
}

// --- Schema dell'output (structured outputs) -----------------------------

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "excerpt", "sector", "era", "sources", "body"],
  properties: {
    title: { type: "string" },
    excerpt: { type: "string" },
    sector: { type: "string" },
    era: { type: "string" },
    sources: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "url"],
        properties: {
          label: { type: "string" },
          url: { type: "string" },
        },
      },
    },
    body: { type: "string" },
  },
};

const SYSTEM = `Sei il copywriter di "Storie di Brand", un progetto che racconta la storia dei marchi con taglio narrativo e curato.

Scrivi un ARTICOLO long-form in italiano basandoti ESCLUSIVAMENTE sul copione del video fornito dall'utente. Regole:
- Non inventare fatti, date, nomi o cifre che non siano nel copione. Se un dettaglio non c'è, non lo scrivere.
- Tono: giornalistico-narrativo, coinvolgente, adatto alla SEO (chiaro, scorrevole, senza gergo da marketing).
- Struttura: un paragrafo di apretura che aggancia il lettore (la domanda a cui l'articolo risponde), poi sezioni con intestazioni "## Titolo". Usa **grassetto** per i concetti chiave e "> citazione" dove serve.
- NON includere un titolo H1 nel corpo: il titolo sta nei metadati.
- Lunghezza: circa 1000-1800 parole.
- "title": un titolo editoriale accattivante (non generico).
- "excerpt": UNA frase di sintesi (~160 caratteri) per meta description e card.
- "sector": il settore merceologico del brand (es. "Sneaker", "Beverage", "Automotive").
- "era": la decade/epoca di riferimento (es. "Anni 1960").
- "sources": fonti citabili menzionate o implicite nel copione; includi sempre come prima voce {"label":"Storie di Brand — episodio su YouTube","url": <url youtube se fornito, altrimenti stringa vuota>}. Se non ci sono altre fonti, lascia solo questa.
Rispondi solo con l'oggetto JSON secondo lo schema.`;

// --- Main ----------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args._.length === 0) {
    console.log(
      [
        "Genera una bozza di articolo dal copione del video.",
        "",
        '  node scripts/generate-article.js <file-copione> [--brand "Nome"] [--youtube <url>] [--force]',
        "",
        "Esempio:",
        '  node scripts/generate-article.js content/scripts/nike.md --brand "Nike" --youtube https://youtu.be/abc123XYZ00',
      ].join("\n")
    );
    return;
  }

  const scriptPath = args._[0];
  if (!fs.existsSync(scriptPath)) {
    console.error(`❌ Copione non trovato: ${scriptPath}`);
    process.exit(1);
  }
  const scriptText = fs.readFileSync(scriptPath, "utf8").trim();
  if (scriptText.length < 200) {
    console.error("❌ Il copione sembra troppo corto per scriverci un articolo.");
    process.exit(1);
  }

  const brand = args.brand || titleCaseFromFilename(scriptPath);
  const slug = slugify(brand);
  const file = path.join(EPISODES_DIR, `${slug}.md`);
  const youtube = args.youtube || "";

  if (fs.existsSync(file) && !args.force) {
    console.error(`⚠️  Esiste già un articolo/bozza per "${brand}": ${path.relative(process.cwd(), file)}`);
    console.error("   Usa --force per sovrascrivere.");
    process.exit(1);
  }

  let Anthropic;
  try {
    Anthropic = require("@anthropic-ai/sdk");
  } catch {
    console.error("❌ Manca il pacchetto @anthropic-ai/sdk. Installa con: npm install");
    process.exit(1);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ Manca ANTHROPIC_API_KEY. Impostala: export ANTHROPIC_API_KEY=sk-ant-...");
    process.exit(1);
  }

  const client = new Anthropic();

  console.log(`✍️  Scrivo la bozza per "${brand}" con Claude (claude-opus-4-8)…`);

  const stream = client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "high",
      format: { type: "json_schema", name: "articolo", schema: SCHEMA },
    },
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `Brand: ${brand}\nLink YouTube: ${youtube || "(non fornito)"}\n\nCopione del video:\n"""\n${scriptText}\n"""`,
      },
    ],
  });

  const message = await stream.finalMessage();
  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock) {
    console.error("❌ Nessun testo nella risposta del modello.");
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(textBlock.text);
  } catch (e) {
    console.error("❌ La risposta non è JSON valido:", e.message);
    process.exit(1);
  }

  const sources = Array.isArray(data.sources) ? data.sources : [];
  const sourcesYaml = sources
    .map((s) => {
      const label = `  - label: "${yaml(s.label)}"`;
      return s.url ? `${label}\n    url: "${yaml(s.url)}"` : label;
    })
    .join("\n");

  const md = `---
title: "${yaml(data.title)}"
slug: "${slug}"
publishedAt: "${new Date().toISOString().slice(0, 10)}"
brand: "${yaml(brand)}"
sector: "${yaml(data.sector)}"
era: "${yaml(data.era)}"
youtubeUrl: "${yaml(youtube)}"
duration: ""
excerpt: "${yaml(data.excerpt)}"
coverColor: "#ff5757"
featured: false
draft: true
sources:
${sourcesYaml || '  - label: "Storie di Brand — episodio su YouTube"'}
relatedSlugs: []
---

${String(data.body).trim()}
`;

  fs.mkdirSync(EPISODES_DIR, { recursive: true });
  fs.writeFileSync(file, md);

  console.log(`\n✅ Bozza creata: ${path.relative(process.cwd(), file)}`);
  console.log(`   Titolo: ${data.title}`);
  console.log(`   Settore: ${data.sector}  ·  epoca: ${data.era}`);
  if (!youtube) {
    console.log("   ⚠️  Nessun link YouTube: la card non avrà copertina. Aggiungi youtubeUrl a mano o rilancia con --youtube.");
  }
  console.log(`\n👉 Rivedila in anteprima su:  /episodi/${slug}`);
  console.log(`   Quando sei soddisfatto, pubblicala con:  npm run publish:episode -- ${slug}`);
}

main().catch((e) => {
  console.error("❌ Errore:", e.message || e);
  process.exit(1);
});
