#!/usr/bin/env node
/**
 * Convert various file formats to Markdown (.md)
 * Supports: PDF (text & scanned/image via OCR), HTML, DOCX, TXT
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');

function resolveFromRepo(p) {
  return path.isAbsolute(p) ? p : path.resolve(REPO_ROOT, p);
}

const SUPPORTED_EXTENSIONS = ['.pdf', '.html', '.htm', '.docx', '.txt'];

/**
 * Try to extract text from a PDF using pdf2md.
 * Runs in a child process to avoid pdfjs version conflicts with pdf-to-img.
 * Returns null if the PDF is image-only (scanned).
 */
async function tryTextPdfToMd(inputPath) {
  const { spawnSync } = require('child_process');
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
  const textContent = result.stdout.replace(/<!--\s*PAGE_BREAK\s*-->/g, '').trim();
  return textContent.length > 20 ? result.stdout : null;
}

/**
 * OCR-based PDF to Markdown.
 * Renders each page to PNG with pdf-to-img, then runs Tesseract OCR on each.
 */
async function ocrPdfToMd(inputPath) {
  const { pdf } = await import('pdf-to-img');
  const { createWorker } = require('tesseract.js');

  const document = await pdf(inputPath, { scale: 2 });
  const worker = await createWorker('eng');

  const pages = [];
  let pageNum = 1;

  for await (const imageBuffer of document) {
    process.stdout.write(`\r  OCR page ${pageNum}...   `);
    const { data: { text } } = await worker.recognize(imageBuffer);
    pages.push(text.trim());
    pageNum++;
  }

  process.stdout.write('\n');
  await worker.terminate();

  return pages.join('\n\n---\n\n');
}

async function convertPdfToMd(inputPath) {
  console.log('  Trying text extraction...');
  const textResult = await tryTextPdfToMd(inputPath);
  if (textResult) {
    console.log('  Text-based PDF detected.');
    return textResult;
  }
  console.log('  Scanned/image PDF detected — running OCR (this may take a while)...');
  return ocrPdfToMd(inputPath);
}

async function convertHtmlToMd(inputPath) {
  const { NodeHtmlMarkdown } = require('node-html-markdown');
  const html = fs.readFileSync(inputPath, 'utf8');
  return NodeHtmlMarkdown.translate(html);
}

async function convertDocxToMd(inputPath) {
  const mammoth = require('mammoth');
  const buffer = fs.readFileSync(inputPath);
  const result = await mammoth.convertToMarkdown({ buffer });
  return result.value;
}

function convertTxtToMd(inputPath) {
  return fs.readFileSync(inputPath, 'utf8');
}

async function convertToMarkdown(inputFile) {
  let inputPath;
  if (path.isAbsolute(inputFile)) {
    inputPath = inputFile;
  } else {
    inputPath = resolveFromRepo(inputFile);
  }

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Error: File not found: ${inputPath}`);
    process.exit(1);
  }

  const ext = path.extname(inputPath).toLowerCase();
  const baseName = path.basename(inputPath, ext);
  const outputDir = path.dirname(inputPath);
  const outputPath = path.join(outputDir, `${baseName}.md`);

  let markdown;
  try {
    switch (ext) {
      case '.pdf':
        console.log(`📄 Converting PDF to Markdown...`);
        markdown = await convertPdfToMd(inputPath);
        break;
      case '.html':
      case '.htm':
        console.log(`📄 Converting HTML to Markdown...`);
        markdown = await convertHtmlToMd(inputPath);
        break;
      case '.docx':
        console.log(`📄 Converting DOCX to Markdown...`);
        markdown = await convertDocxToMd(inputPath);
        break;
      case '.txt':
        console.log(`📄 Converting plain text to Markdown...`);
        markdown = convertTxtToMd(inputPath);
        break;
      default:
        console.error(`❌ Error: Unsupported format "${ext}".`);
        console.error(`   Supported: ${SUPPORTED_EXTENSIONS.join(', ')}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error converting file:`, error.message);
    process.exit(1);
  }

  fs.writeFileSync(outputPath, markdown, 'utf8');

  console.log(`✅ Markdown generated: ${path.basename(outputPath)}`);
  console.log(`📁 Output: ${outputPath}`);
}

// Parse CLI args
const argv = process.argv.slice(2);
const inputFile = argv.find((a) => !a.startsWith('-'));

if (argv.includes('--help') || argv.includes('-h')) {
  console.log(`
📝 Convert to Markdown

Usage:
  node scripts/convert-to-md.js <input-file>

Supported input formats:
  .pdf   PDF document
  .html  HTML file
  .htm   HTML file
  .docx  Microsoft Word document
  .txt   Plain text file

Output:
  Same directory as input, same name with .md extension

Examples:
  node scripts/convert-to-md.js document.pdf
  node scripts/convert-to-md.js docs/page.html
  node scripts/convert-to-md.js report.docx
  node scripts/convert-to-md.js notes.txt
`);
  process.exit(0);
}

if (!inputFile) {
  console.error('❌ Error: No input file specified. Use --help for usage.');
  process.exit(1);
}

convertToMarkdown(inputFile);
