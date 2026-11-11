# Prépa PC — Annales

Archive and study app for the Tunisian *Concours National d'Entrée aux Cycles de Formation d'Ingénieurs*, section Physique-Chimie (PC).

- **Archives**: every paper from 2020 to 2023 (Mathématiques, Physique, Chimie, Informatique, STA, Français, Anglais), to read in the app or download.
- **Analyse des chapitres**: for each subject, which chapters appeared in which year, checked against the papers.
- **Révision**: chapter status (Non commencé / En cours / Maîtrisé), Fait / À refaire per paper, notes, and an exam timer.
- Works offline once installed; data stays in the browser (export / import in Paramètres).

## Run

```bash
npm install
npm run dev
```

Build: `npm run build` (output in `dist/`, ready for Vercel).

## Data

- `public/exams/<année>/` — the PDFs
- `src/data/exams.json` — the papers
- `src/data/*-chapters.json` — chapter lists per subject
- `src/data/chapter-appearances.json` — which chapter appears in which paper
