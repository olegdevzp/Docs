# Conversion scripts

Run from the **repository root** so relative paths resolve correctly.

| Script | Command | Purpose |
|--------|---------|---------|
| Markdown | `npm run convert:md -- <file>` | PDF, HTML, DOCX, TXT → `.md` |
| PDF | `npm run convert:pdf -- <file>` | Markdown or PDF → styled PDF |
| Kindle | `npm run convert:mobi -- <paths...>` | Markdown, text, or PDF → MOBI (Calibre) |

`eng.traineddata` is the Tesseract English model (used by OCR in `convert-to-md.js` when needed).

Examples:

```bash
npm run convert:md -- docs/first-aid/_First_AID.pdf
npm run convert:pdf -- docs/react.js/documentation-react.md
npm run convert:mobi -- docs/books/learning-how-to-learn-chapters.md --out-dir dist
```
