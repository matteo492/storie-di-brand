# Copioni video → articoli automatici

Questa cartella contiene i **copioni dei video** del canale YouTube. Da qui l'AI
genera in automatico l'articolo per la sezione **"Ultimi Episodi"** del sito.

I file qui dentro sono solo **materiale di partenza**: non vengono pubblicati e
non compaiono sul sito. Vengono usati solo per scrivere l'articolo.

## Setup (una volta sola)

```bash
npm install @anthropic-ai/sdk        # libreria per parlare con Claude
export ANTHROPIC_API_KEY=sk-ant-...  # la tua chiave API (mettila in un file .env, è già in .gitignore)
```

## A ogni nuovo video

1. **Salva il copione** del video in un file qui dentro, es. `content/scripts/nike.md`.
   (Va bene testo semplice: è il testo che hai già scritto per il video.)

2. **Genera la bozza** con l'AI:

   ```bash
   npm run generate:article -- content/scripts/nike.md --brand "Nike" --youtube https://youtu.be/XXXXXXXXXXX
   ```

   - `--brand` è opzionale (altrimenti viene dedotto dal nome del file).
   - `--youtube` è consigliato: serve per la **copertina** della card e come fonte.

   L'articolo viene creato in `content/episodes/<slug>.md` con `draft: true`.

3. **Rivedi la bozza** aprendo l'anteprima su `/episodi/<slug>`.
   La bozza mostra un banner "Bozza · non pubblicata", non è indicizzata e **non**
   compare in homepage, archivio o sitemap: la vedi solo tu, tramite il link.

4. **Approva (pubblica)** con un comando:

   ```bash
   npm run publish:episode -- nike-storia
   ```

   Da quel momento l'articolo compare **in cima a "Ultimi Episodi"** (ordinato per data)
   e in archivio. Ricordati di committare da GitHub Desktop.

   Per vedere le bozze in attesa: `npm run publish:episode -- --list`

## Cosa fa e non fa l'AI

- ✅ Scrive l'articolo **solo** in base al copione che le dai (non inventa fatti).
- ✅ Compila titolo, sintesi, settore, epoca, fonti e corpo in stile "Storie di Brand".
- ✍️ Tu controlli e approvi: niente va online senza il tuo ok.

> Nota: podcast "Storie di Brand" e canale YouTube sono progetti separati. Questa
> pipeline riguarda **solo** i video YouTube → "Ultimi Episodi". La timeline del
> podcast si aggiorna da sola dal feed (vedi il workflow in `.github/workflows/`).
