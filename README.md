# 🏒 Puck Tracker — Setup Guide

## Struttura file

```
puck-tracker/
├── index.html          ← App principale
├── manifest.json       ← Rende l'app installabile
├── sw.js               ← Service Worker (funziona offline)
├── icons/
│   ├── icon-192.png    ← Icona app (da creare)
│   └── icon-512.png    ← Icona app grande (da creare)
└── tfjs_model/         ← Cartella del modello (da Colab)
    ├── model.json
    ├── metadata.json
    └── group1-shard1of1.bin
```

---

## Step 1 — Training del modello (Google Colab)

1. Apri `puck_tracker_training.ipynb` su Google Colab
2. Vai su `Runtime → Change runtime type → T4 GPU`
3. Incolla la tua API Key Roboflow
4. `Runtime → Run All`
5. Scarica `puck_model_tfjs.zip` al termine
6. Estrai e metti la cartella `tfjs_model/` qui dentro

---

## Step 2 — Deploy su Cloudflare Pages (GRATIS)

1. Crea account su https://cloudflare.com
2. Dashboard → Pages → Create a project
3. Carica questa cartella (upload diretto o collega GitHub)
4. Cloudflare genera automaticamente un URL tipo `puck-tracker.pages.dev`
5. Puoi collegare il tuo dominio custom

**Alternativa: Vercel**
```bash
npm i -g vercel
vercel deploy
```

---

## Step 3 — Installazione su iPhone/Android

### iPhone (Safari):
1. Apri l'URL dell'app in Safari
2. Premi il bottone "Condividi" (□↑)
3. Scorri → "Aggiungi a schermata Home"
4. L'app si installa come app nativa

### Android (Chrome):
1. Apri l'URL in Chrome
2. Menu (⋮) → "Aggiungi a schermata Home"
   oppure banner automatico "Installa app"

---

## Step 4 — Icone (necessarie per l'installazione)

Crea la cartella `icons/` con:
- `icon-192.png` — 192×192px
- `icon-512.png` — 512×512px

Tool gratuiti:
- https://realfavicongenerator.net
- https://canva.com (crea logo → esporta PNG)

---

## Modalità fallback (senza modello)

Se la cartella `tfjs_model/` non esiste, l'app usa
automaticamente il rilevamento CV classico basato su:
- Pixel analysis per oggetti scuri circolari (puck nero)
- Color masking HSV per puck colorati (street hockey)

Funziona subito, meno preciso del modello custom.

---

## Aggiornare il modello

1. Ri-allena su Colab con nuovi dati
2. Sostituisci i file in `tfjs_model/`
3. Aggiorna `CACHE_NAME` in `sw.js` (es: `puck-tracker-v2`)
4. Re-deploy su Cloudflare Pages (automatico se usi GitHub)

---

## Costi operativi

| Voce | Costo |
|------|-------|
| Hosting Cloudflare Pages | 0€ |
| Dominio .app | ~15€/anno |
| Inferenza AI | 0€ (on-device) |
| Aggiornamenti app | 0€ |
| **Totale** | **~15€/anno** |
