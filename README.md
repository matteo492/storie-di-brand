# Storie di Brand — sito

Sito della docu-serie **Storie di Brand**, costruito con Next.js (App Router).
Obiettivo: SEO/GEO (essere trovati su Google e citati dai motori AI) + vetrina per gli sponsor.

## Come far girare il sito in locale

```bash
npm install      # solo la prima volta
npm run dev      # avvia il sito su http://localhost:3000
```

Per la versione di produzione (quella che gira su Vercel):

```bash
npm run build
npm start
```

## Come aggiungere un episodio

1. Crea un file nuovo in `content/episodes/`, es. `nintendo-da-carte-a-console.md`
2. Copia l'intestazione (frontmatter) da un episodio esistente e compilala:

```markdown
---
title: "Titolo dell'episodio"
slug: "nintendo-da-carte-a-console"   # deve combaciare col nome del file
episodeNumber: 143
publishedAt: "2026-07-01"             # AAAA-MM-GG
brand: "Nintendo"
sector: "Videogiochi"
era: "Anni 1880"
youtubeUrl: "https://youtu.be/XXXXXXXXXXX"
duration: "44 min"
excerpt: "Sintesi breve: appare nelle card e come descrizione SEO."
coverColor: "#ff5757"                  # #ff5757 (rosso) o #faf9d2 (crema)
featured: false                        # true = episodio in evidenza in home
sources:
  - label: "Nome della fonte"
    url: "https://..."
---

Qui sotto scrivi l'articolo normalmente, in markdown.
## Sottotitoli con ##, **grassetto**, > citazioni, elenchi puntati.
```

3. Salva. L'episodio appare in automatico in home, nell'archivio, nella sitemap e
   negli "episodi correlati" (collegati per marchio / settore / epoca).

## Struttura del progetto

- `content/episodes/` — gli episodi (un file markdown ciascuno)
- `lib/episodes.ts` — modello dati e lettura degli episodi
- `app/` — le pagine: home, `/episodi` (archivio), `/episodi/[slug]` (episodio)
- `components/` — header con ticker, card episodio, footer, filtri archivio
- `app/globals.css` — design system (colori, font, stili)
- `public/fonts/` — il font Gothic CG No1
- `legacy/` — il vecchio sito statico, conservato come riferimento

## Note

- Font: **Gothic CG No1** (display) + Oswald (fallback). Colori: crema `#faf9d2`,
  rosso `#ff5757`, nero `#000`.
- SEO: ogni episodio ha meta tag, Open Graph e dati strutturati schema.org
  (Article + VideoObject). Sitemap e robots sono generati in automatico.
- Deploy: collegare la cartella a Vercel e premere deploy — nessuna configurazione extra.
