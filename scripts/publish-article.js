#!/usr/bin/env node

/**
 * Approva (pubblica) una bozza di articolo.
 *
 * Cambia `draft: true` → `draft: false` nel file dell'articolo: da quel momento
 * compare in "Ultimi Episodi", archivio, sitemap e viene indicizzato.
 * È l'approvazione "con un click" della bozza generata da generate-article.js.
 *
 * Uso:
 *   node scripts/publish-article.js <slug>      # es. nike-storia (anche con .md)
 *   node scripts/publish-article.js --list      # elenca le bozze in attesa
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const EPISODES_DIR = path.join(__dirname, "..", "content", "episodes");

function readAll() {
  if (!fs.existsSync(EPISODES_DIR)) return [];
  return fs
    .readdirSync(EPISODES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const full = path.join(EPISODES_DIR, f);
      const { data } = matter(fs.readFileSync(full, "utf8"));
      return { slug: f.replace(/\.md$/, ""), file: full, fm: data };
    });
}

function listDrafts() {
  const drafts = readAll().filter((e) => e.fm.draft === true);
  if (drafts.length === 0) {
    console.log("Nessuna bozza in attesa. Tutto pubblicato ✅");
    return;
  }
  console.log(`${drafts.length} bozza/e in attesa di approvazione:\n`);
  for (const d of drafts) {
    console.log(`  ${d.slug.padEnd(28)}  ${d.fm.title || ""}`);
  }
  console.log(`\nPubblicane una con: node scripts/publish-article.js <slug>`);
}

function publish(slugArg) {
  const slug = slugArg.replace(/\.md$/, "");
  const file = path.join(EPISODES_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) {
    console.error(`❌ Articolo non trovato: ${path.relative(process.cwd(), file)}`);
    console.error("   Vedi le bozze in attesa con: node scripts/publish-article.js --list");
    process.exit(1);
  }

  const raw = fs.readFileSync(file, "utf8");
  const { data } = matter(raw);

  if (data.draft !== true) {
    console.log(`ℹ️  "${slug}" è già pubblicato (draft non è true). Niente da fare.`);
    return;
  }

  // Sostituzione mirata della riga draft, per non riformattare il resto del file.
  let updated;
  if (/^draft:\s*true\s*$/m.test(raw)) {
    updated = raw.replace(/^draft:\s*true\s*$/m, "draft: false");
  } else {
    console.error("⚠️  Non trovo la riga `draft: true` nel frontmatter. Modificala a mano in `draft: false`.");
    process.exit(1);
  }

  fs.writeFileSync(file, updated);
  console.log(`✅ Pubblicato: "${data.title || slug}"`);
  console.log(`   Ora compare in "Ultimi Episodi" (in cima, per data) e in archivio.`);
  console.log("   Ricorda di committare la modifica da GitHub Desktop.");
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    console.log(
      [
        "Approva (pubblica) una bozza di articolo.",
        "",
        "  node scripts/publish-article.js <slug>     pubblica la bozza",
        "  node scripts/publish-article.js --list     elenca le bozze in attesa",
      ].join("\n")
    );
    return;
  }
  if (args[0] === "--list") {
    listDrafts();
    return;
  }
  publish(args[0]);
}

main();
