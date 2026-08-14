#!/usr/bin/env node
/**
 * Convert PDF (.pdf) to Word (.docx).
 *
 * Strategy:
 *  1. LibreOffice (soffice) when available — best layout fidelity.
 *  2. Node.js fallback — text extraction (@opendocsg/pdf2md or OCR) + docx package.
 *
 * Run from the repository root so relative paths resolve correctly.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');

function resolveFromRepo(p) {
  return path.isAbsolute(p) ? p : path.resolve(REPO_ROOT, p);
}

function findBinaryViaLoginShell(binaryName) {
  if (process.platform === 'win32') return null;
  const shell = process.env.SHELL || '/bin/zsh';
  const r = spawnSync(shell, ['-lc', `command -v ${binaryName}`], {
    encoding: 'utf8',
  });
  if (r.status !== 0 || !r.stdout) return null;
  const p = r.stdout.trim().split(/\r?\n/)[0];
  return p && fs.existsSync(p) ? p : null;
}

function findLibreOffice() {
  const envPath = process.env.LIBREOFFICE_PATH || process.env.SOFFICE_PATH;
  if (envPath && fs.existsSync(envPath)) return envPath;

  const isWin = process.platform === 'win32';
  for (const name of ['soffice', 'libreoffice']) {
    const lookup = spawnSync(isWin ? 'where' : 'which', [name], {
      encoding: 'utf8',
      shell: isWin,
    });
    if (lookup.status === 0 && lookup.stdout) {
      const first = lookup.stdout.trim().split(/\r?\n/)[0];
      if (first && fs.existsSync(first)) return first;
    }
    if (!isWin) {
      const viaShell = findBinaryViaLoginShell(name);
      if (viaShell) return viaShell;
    }
  }

  if (process.platform === 'darwin') {
    const macPaths = [
      '/Applications/LibreOffice.app/Contents/MacOS/soffice',
      '/Applications/OpenOffice.app/Contents/MacOS/soffice',
    ];
    for (const p of macPaths) {
      if (fs.existsSync(p)) return p;
    }
  }

  return null;
}

function convertWithLibreOffice(sofficePath, inputPath, outputDir) {
  const args = [
    '--headless',
    '--norestore',
    '--convert-to',
    'docx',
    '--outdir',
    outputDir,
    inputPath,
  ];

  const result = spawnSync(sofficePath, args, {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  });

  if (result.status !== 0) {
    console.error('❌ LibreOffice conversion failed:');
    if (result.stderr) console.error(result.stderr);
    if (result.stdout) console.error(result.stdout);
    return false;
  }

  return true;
}

/**
 * Try to extract text from a PDF using pdf2md.
 * Returns null if the PDF is image-only (scanned).
 */
async function tryTextPdfExtract(inputPath) {
  const script = `
    const pdf2md = require('@opendocsg/pdf2md');
    const fs = require('fs');
    pdf2md(fs.readFileSync(process.argv[1]))
      .then(t => { process.stdout.write(t); process.exit(0); })
      .catch(() => process.exit(1));
  `;
  const result = spawnSync(
    process.execPath,
    ['-e', script, inputPath],
    { maxBuffer: 200 * 1024 * 1024, cwd: REPO_ROOT, encoding: 'utf8' }
  );
  if (result.status !== 0 || !result.stdout) return null;
  const textContent = result.stdout.replace(/<!--\s*PAGE_BREAK\s*-->/g, '\n\n---\n\n').trim();
  return textContent.length > 20 ? textContent : null;
}

async function ocrPdfExtract(inputPath) {
  const { pdf } = await import('pdf-to-img');
  const { createWorker } = require('tesseract.js');

  const document = await pdf(inputPath, { scale: 2 });
  const worker = await createWorker('eng');

  const pages = [];
  let pageNum = 1;

  for await (const imageBuffer of document) {
    process.stdout.write(`\r  OCR page ${pageNum}...   `);
    const {
      data: { text },
    } = await worker.recognize(imageBuffer);
    pages.push(text.trim());
    pageNum++;
  }

  process.stdout.write('\n');
  await worker.terminate();

  return pages.join('\n\n---\n\n');
}

async function extractPdfText(inputPath, { forceOcr = false } = {}) {
  if (!forceOcr) {
    console.log('  Trying text extraction...');
    const textResult = await tryTextPdfExtract(inputPath);
    if (textResult) {
      console.log('  Text-based PDF detected.');
      return textResult;
    }
  }

  console.log('  Scanned/image PDF detected — running OCR (this may take a while)...');
  return ocrPdfExtract(inputPath);
}

function splitIntoBlocks(text) {
  return text
    .split(/\n\s*---\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function splitIntoParagraphs(block) {
  return block
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n+/g, ' ').trim())
    .filter(Boolean);
}

async function buildDocxFromText(text, outputPath, title) {
  const { Document, Packer, Paragraph, TextRun, PageBreak } = require('docx');

  const blocks = splitIntoBlocks(text);
  const children = [];

  blocks.forEach((block, blockIndex) => {
    if (blockIndex > 0) {
      children.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );
    }

    for (const paragraphText of splitIntoParagraphs(block)) {
      children.push(
        new Paragraph({
          children: [new TextRun(paragraphText)],
        })
      );
    }
  });

  if (children.length === 0) {
    children.push(
      new Paragraph({
        children: [new TextRun('(No extractable text found in PDF)')],
      })
    );
  }

  const doc = new Document({
    title,
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
}

async function convertPdfToDocx(inputFile, options = {}) {
  const { forceOcr = false, preferNode = false } = options;

  const inputPath = resolveFromRepo(inputFile);

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Error: File not found: ${inputPath}`);
    process.exit(1);
  }

  const ext = path.extname(inputPath).toLowerCase();
  if (ext !== '.pdf') {
    console.error(`❌ Error: Unsupported format "${ext}". Only .pdf is supported.`);
    process.exit(1);
  }

  const baseName = path.basename(inputPath, ext);
  const outputDir = path.dirname(inputPath);
  const outputPath = path.join(outputDir, `${baseName}.docx`);
  const title = baseName.replace(/[-_]/g, ' ');

  if (!preferNode) {
    const sofficePath = findLibreOffice();
    if (sofficePath) {
      console.log(`📄 Converting PDF with LibreOffice (${path.basename(sofficePath)})...`);
      const ok = convertWithLibreOffice(sofficePath, inputPath, outputDir);
      if (ok && fs.existsSync(outputPath)) {
        console.log(`✅ DOCX generated: ${path.basename(outputPath)}`);
        console.log(`📁 Output: ${outputPath}`);
        return;
      }
      console.log('  LibreOffice conversion unavailable — falling back to Node.js text extraction.');
    }
  }

  console.log('📄 Converting PDF to DOCX (text extraction)...');
  const text = await extractPdfText(inputPath, { forceOcr });
  await buildDocxFromText(text, outputPath, title);

  console.log(`✅ DOCX generated: ${path.basename(outputPath)}`);
  console.log(`📁 Output: ${outputPath}`);
  console.log('ℹ️  Text-only DOCX (formatting/images from the PDF are not preserved).');
  console.log('   Install LibreOffice for layout-preserving conversion.');
}

const argv = process.argv.slice(2);
let inputFile;
let forceOcr = false;
let preferNode = false;

for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  if (arg === '--ocr') {
    forceOcr = true;
  } else if (arg === '--node-only' || arg === '--no-libreoffice') {
    preferNode = true;
  } else if (!arg.startsWith('-')) {
    inputFile = arg;
  }
}

if (argv.includes('--help') || argv.includes('-h')) {
  console.log(`
📝 PDF to DOCX Converter

Usage:
  node scripts/convert-pdf-to-docx.js [options] <input-file.pdf>

Arguments:
  input-file    Path to the PDF file (relative to repo root or absolute)

Options:
  --ocr              Force OCR (for scanned/image PDFs)
  --node-only        Skip LibreOffice; use Node.js text extraction only
  --no-libreoffice   Alias for --node-only
  -h, --help         Show this help

Conversion:
  1. LibreOffice (soffice) when installed — preserves layout when possible
  2. Node.js fallback — pdf2md text extraction or OCR, written with docx

Environment:
  LIBREOFFICE_PATH or SOFFICE_PATH — path to soffice binary

Examples:
  npm run convert:docx -- docs/hr\\ Interview/cover-letter.pdf
  node scripts/convert-pdf-to-docx.js document.pdf
  node scripts/convert-pdf-to-docx.js --ocr scanned-document.pdf
  node scripts/convert-pdf-to-docx.js --node-only report.pdf

Output:
  Same directory as input, same name with .docx extension
`);
  process.exit(0);
}

if (!inputFile) {
  console.error('❌ Error: No input file specified. Use --help for usage.');
  process.exit(1);
}

convertPdfToDocx(inputFile, { forceOcr, preferNode }).catch((error) => {
  console.error('❌ Error:', error.message || error);
  process.exit(1);
});
