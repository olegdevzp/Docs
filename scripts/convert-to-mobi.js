#!/usr/bin/env node
/**
 * Convert Markdown (.md), plain text (.txt), or PDF (.pdf) to Kindle MOBI (Calibre
 * ebook-convert) or, if Calibre is missing, Markdown/text can fall back to EPUB
 * via Pandoc (not PDF). PDF input requires Calibre. Markdown headings get
 * GitHub-style id attributes so [links](#slug) resolve in the ebook.
 *
 * Requires Node.js >= 22.22.0 (see package.json "engines").
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

function assertNodeAtLeast(wantMajor, wantMinor, wantPatch) {
  const [maj, min, pat] = process.versions.node.split('.').map((n) => parseInt(n, 10));
  const fail = () => {
    console.error(
      `❌ Error: Node.js >= ${wantMajor}.${wantMinor}.${wantPatch} required (you have ${process.version}).`
    );
    process.exit(1);
  };
  if (maj < wantMajor) fail();
  if (maj > wantMajor) return;
  if (min < wantMinor) fail();
  if (min > wantMinor) return;
  if (pat < wantPatch) fail();
}

assertNodeAtLeast(22, 22, 0);

/**
 * Calibre’s MOBI/KF8 pipeline rescales text from this baseline (pt). Body CSS
 * font-size is often ignored or re-mapped; these flags are what actually change
 * perceived size on Kindle. Raise if text is too small; lower if still large.
 */
const CALIBRE_KINDLE_BASE_FONT_PT = 7;
/** Mappings for xx-small → huge (8 values). Kept low so headings stay compact. */
const CALIBRE_KINDLE_FONT_SIZE_MAPPING = '6,7,8,9,10,12,14,18';

/**
 * Calibre’s default page margins are 5pt per side — that ignores body CSS and
 * explains “nothing changed”. Values below zero tell ebook-convert to use the
 * document’s margins (--help: margin-left / margin-right).
 */
const CALIBRE_MARGIN_PRESERVE_DOCUMENT = '-1';

/**
 * Appended by Calibre after source CSS; use !important so layout survives
 * flattening. Keep in sync with {@link mdToHtmlDocument}.
 */
const CALIBRE_KINDLE_EXTRA_CSS = `
html, body {
  margin: 0 !important;
  padding: 0 !important;
  max-width: none !important;
}
`.trim();

/** Pandoc EPUB fallback never loads {@link mdToHtmlDocument}; embed this via --css. */
const PANDOC_EPUB_CSS = `
html, body { margin: 0 !important; padding: 0 !important; max-width: none !important; }
body { font-size: 87.5%; line-height: 1.5; }
pre, code { font-size: 0.92em; }
`.trim();

function calibreKindleEbookConvertArgs() {
  return [
    '--base-font-size',
    String(CALIBRE_KINDLE_BASE_FONT_PT),
    '--font-size-mapping',
    CALIBRE_KINDLE_FONT_SIZE_MAPPING,
    '--margin-left',
    CALIBRE_MARGIN_PRESERVE_DOCUMENT,
    '--margin-right',
    CALIBRE_MARGIN_PRESERVE_DOCUMENT,
    '--margin-top',
    CALIBRE_MARGIN_PRESERVE_DOCUMENT,
    '--margin-bottom',
    CALIBRE_MARGIN_PRESERVE_DOCUMENT,
    '--mobi-file-type',
    'both',
    '--extra-css',
    CALIBRE_KINDLE_EXTRA_CSS,
  ];
}

function firstExisting(paths) {
  for (const p of paths) {
    if (p && fs.existsSync(p)) return p;
  }
  return null;
}

/** Homebrew Cask installs versions under Caskroom/calibre/<version>/calibre.app */
function findEbookConvertInHomebrewCask() {
  const roots = [
    '/opt/homebrew/Caskroom/calibre',
    '/usr/local/Caskroom/calibre',
  ];
  for (const root of roots) {
    try {
      const versions = fs.readdirSync(root, { withFileTypes: true });
      const dirs = versions.filter((d) => d.isDirectory()).map((d) => d.name);
      dirs.sort();
      for (let i = dirs.length - 1; i >= 0; i--) {
        const bin = path.join(root, dirs[i], 'calibre.app', 'Contents', 'MacOS', 'ebook-convert');
        if (fs.existsSync(bin)) return bin;
      }
    } catch {
      /* missing dir */
    }
  }
  return null;
}

/** macOS Spotlight — finds Calibre wherever the .app was installed */
function findEbookConvertViaSpotlight() {
  if (process.platform !== 'darwin') return null;
  const q = "kMDItemCFBundleIdentifier == 'net.kovidgoyal.calibre'";
  const r = spawnSync('mdfind', [q], { encoding: 'utf8' });
  if (r.status !== 0 || !r.stdout) return null;
  const lines = r.stdout
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  for (const appPath of lines) {
    if (appPath.endsWith('.app')) {
      const bin = path.join(appPath, 'Contents', 'MacOS', 'ebook-convert');
      if (fs.existsSync(bin)) return bin;
    }
  }
  return null;
}

/**
 * IDE / non-login shells often omit Homebrew or custom PATH; a login shell
 * picks up ~/.zprofile etc. where ebook-convert may be added.
 */
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

function findPandoc() {
  const isWin = process.platform === 'win32';
  const lookup = spawnSync(isWin ? 'where' : 'which', ['pandoc'], {
    encoding: 'utf8',
    shell: isWin,
  });
  if (lookup.status === 0 && lookup.stdout) {
    const first = lookup.stdout.trim().split(/\r?\n/)[0];
    if (first && fs.existsSync(first)) return first;
  }
  return findBinaryViaLoginShell('pandoc');
}

function findEbookConvert() {
  const envPath = process.env.CALIBRE_EBOOK_CONVERT;
  if (envPath && fs.existsSync(envPath)) return envPath;

  const isWin = process.platform === 'win32';
  const lookup = spawnSync(isWin ? 'where' : 'which', ['ebook-convert'], {
    encoding: 'utf8',
    shell: isWin,
  });
  if (lookup.status === 0 && lookup.stdout) {
    const first = lookup.stdout.trim().split(/\r?\n/)[0];
    if (first && fs.existsSync(first)) return first;
  }
  if (!isWin) {
    const viaShell = findBinaryViaLoginShell('ebook-convert');
    if (viaShell) return viaShell;
  }
  if (process.platform === 'darwin') {
    const fromPath = firstExisting([
      '/Applications/calibre.app/Contents/MacOS/ebook-convert',
      path.join(os.homedir(), 'Applications/calibre.app/Contents/MacOS/ebook-convert'),
    ]);
    if (fromPath) return fromPath;
    const fromBrew = findEbookConvertInHomebrewCask();
    if (fromBrew) return fromBrew;
    const fromSpotlight = findEbookConvertViaSpotlight();
    if (fromSpotlight) return fromSpotlight;
  }
  if (isWin) {
    const candidates = [
      path.join(process.env['ProgramFiles'] || 'C:\\Program Files', 'Calibre2', 'ebook-convert.exe'),
      path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Calibre2', 'ebook-convert.exe'),
    ];
    for (const p of candidates) {
      if (p && fs.existsSync(p)) return p;
    }
  }
  return null;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function htmlDocumentShell(title, body) {
  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(title)}</title>
<style>
body { font-family: Georgia, "Times New Roman", serif; margin: 0.75em 0; padding: 0; line-height: 1.5; max-width: none; }
pre, code { font-family: ui-monospace, Consolas, monospace; font-size: 0.95em; }
pre { padding: 0.75em; background: #f5f5f5; white-space: pre-wrap; word-wrap: break-word; }
img { max-width: 100%; height: auto; }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

async function mdToHtmlDocument(marked, markdown, title) {
  const body = await Promise.resolve(marked.parse(markdown));
  return htmlDocumentShell(title, body);
}

function txtToHtmlDocument(text, title) {
  const body = text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split('\n').map((line) => escapeHtml(line));
      return `<p>${lines.join('<br/>\n')}</p>`;
    })
    .join('\n');
  return htmlDocumentShell(title, body);
}

function parseArgs(argv) {
  const out = {
    inputs: [],
    output: null,
    outDir: null,
    title: null,
    author: null,
    recursive: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-o' || a === '--output') {
      out.output = argv[++i];
      continue;
    }
    if (a === '--out-dir') {
      out.outDir = argv[++i];
      continue;
    }
    if (a === '--title') {
      out.title = argv[++i];
      continue;
    }
    if (a === '--author') {
      out.author = argv[++i];
      continue;
    }
    if (a === '-r' || a === '--recursive') {
      out.recursive = true;
      continue;
    }
    if (!a.startsWith('-')) {
      out.inputs.push(a);
    }
  }
  return out;
}

const EBOOK_INPUT_EXTS = new Set(['.md', '.markdown', '.txt', '.pdf']);

function collectEbookInputsInDir(dir, recursive) {
  const results = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) {
        if (recursive) walk(full);
      } else {
        const ext = path.extname(e.name).toLowerCase();
        if (EBOOK_INPUT_EXTS.has(ext)) results.push(full);
      }
    }
  };
  walk(dir);
  return results.sort();
}

/** Resolve CLI path: absolute as-is, else relative to cwd */
function resolveUserPath(p) {
  return path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
}

function expandToInputFiles(rawInputs, recursive) {
  const files = [];
  for (const raw of rawInputs) {
    const resolved = resolveUserPath(raw);
    if (!fs.existsSync(resolved)) {
      console.error(`❌ Error: Path not found: ${resolved}`);
      process.exit(1);
    }
    const stat = fs.statSync(resolved);
    if (stat.isFile()) {
      const ext = path.extname(resolved).toLowerCase();
      if (!EBOOK_INPUT_EXTS.has(ext)) {
        console.error(
          `❌ Error: Expected .md, .markdown, .txt, or .pdf, got "${ext}" for ${resolved}`
        );
        process.exit(1);
      }
      files.push(resolved);
    } else {
      files.push(...collectEbookInputsInDir(resolved, recursive));
    }
  }
  return [...new Set(files)].sort();
}

function getConverter() {
  const ebookConvert = findEbookConvert();
  if (ebookConvert) return { kind: 'calibre', path: ebookConvert };
  const pandocPath = findPandoc();
  if (pandocPath) return { kind: 'pandoc', path: pandocPath };

  console.error('❌ Error: Neither ebook-convert (Calibre) nor pandoc was found.');
  if (process.platform === 'darwin') {
    console.error('   For MOBI:  brew install --cask calibre');
    console.error('   For EPUB (Kindle-compatible):  brew install pandoc');
    console.error('   Or set CALIBRE_EBOOK_CONVERT=/path/to/ebook-convert');
  } else {
    console.error('   Install Calibre: https://calibre-ebook.com/download');
    console.error('   Or install Pandoc for EPUB output: https://pandoc.org/installing.html');
  }
  process.exit(1);
}

function mobiPathToEpubPath(mobiPath) {
  if (/\.mobi$/i.test(mobiPath)) return mobiPath.replace(/\.mobi$/i, '.epub');
  return `${mobiPath}.epub`;
}

function convertMdToEpubWithPandoc(pandocPath, inputPath, epubPath, title, author) {
  const inputDir = path.dirname(inputPath);
  const cssDir = fs.mkdtempSync(path.join(os.tmpdir(), 'md2epub-css-'));
  const cssPath = path.join(cssDir, 'kindle-compat.css');
  fs.writeFileSync(cssPath, `${PANDOC_EPUB_CSS}\n`, 'utf8');

  const args = [
    inputPath,
    '-o',
    epubPath,
    '-t',
    'epub2',
    '--standalone',
    '--toc',
    '--toc-depth',
    '3',
    '-M',
    `title=${title}`,
    '-M',
    'lang=en',
    '--resource-path',
    inputDir,
    '--epub-chapter-level',
    '2',
    '--css',
    cssPath,
  ];
  if (author) args.push('-M', `author=${author}`);

  const kind = /\.txt$/i.test(inputPath) ? 'Text' : 'Markdown';
  console.log(`📖 Calibre not found — converting ${kind} → EPUB (Pandoc, EPUB 2)…`);
  console.log(`   ${path.basename(inputPath)} → ${path.basename(epubPath)}`);

  const result = spawnSync(pandocPath, args, {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  });

  try {
    fs.rmSync(cssDir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }

  if (result.status !== 0) {
    console.error('❌ pandoc failed:');
    if (result.stderr) console.error(result.stderr);
    if (result.stdout) console.error(result.stdout);
    process.exit(result.status || 1);
  }

  console.log(`✅ EPUB written: ${epubPath}`);
  console.log(`
ℹ️  If the book does not show up on your Kindle:
   • Prefer Amazon’s Send to Kindle (app, web, or email). Many devices convert EPUB there; USB sideloading often hides EPUBs or needs newer firmware.
   • On older Kindles, EPUB may not appear in the library when copied over USB — install Calibre and re-run this script to get .mobi (USB-friendly):
     brew install --cask calibre
`);
}

async function convertMdToMobi(marked, inputPath, options, converter) {
  const ext = path.extname(inputPath).toLowerCase();
  const baseName = path.basename(inputPath, ext);
  const outputDir = path.dirname(inputPath);

  let outputPath;
  if (options.output) {
    outputPath = resolveUserPath(options.output);
  } else if (options.outDir) {
    const od = resolveUserPath(options.outDir);
    fs.mkdirSync(od, { recursive: true });
    outputPath = path.join(od, `${baseName}.mobi`);
  } else {
    outputPath = path.join(outputDir, `${baseName}.mobi`);
  }

  const title = options.batch ? baseName : options.title || baseName;
  const author = options.author;

  if (converter.kind === 'pandoc') {
    const epubPath = mobiPathToEpubPath(outputPath);
    convertMdToEpubWithPandoc(converter.path, inputPath, epubPath, title, author);
    return;
  }

  const isTxt = ext === '.txt';
  const source = fs.readFileSync(inputPath, 'utf8');
  const html = isTxt
    ? txtToHtmlDocument(source, title)
    : await mdToHtmlDocument(marked, source, title);

  const tmpHtml = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), 'md2mobi-')),
    'content.html'
  );
  fs.writeFileSync(tmpHtml, html, 'utf8');

  const args = [
    tmpHtml,
    outputPath,
    '--title',
    title,
    '--output-profile',
    'kindle',
    ...calibreKindleEbookConvertArgs(),
  ];
  if (author) {
    args.push('--authors', author);
  }

  console.log(`📖 Converting ${isTxt ? 'Text' : 'Markdown'} → MOBI…`);
  console.log(`   ${path.basename(inputPath)} → ${path.basename(outputPath)}`);

  const result = spawnSync(converter.path, args, {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  });

  try {
    fs.rmSync(path.dirname(tmpHtml), { recursive: true, force: true });
  } catch {
    /* ignore */
  }

  if (result.status !== 0) {
    console.error('❌ ebook-convert failed:');
    if (result.stderr) console.error(result.stderr);
    if (result.stdout) console.error(result.stdout);
    process.exit(result.status || 1);
  }

  console.log(`✅ MOBI written: ${outputPath}`);
}

function convertPdfToMobi(inputPath, options, converter) {
  if (converter.kind !== 'calibre') {
    console.error('❌ Error: Converting PDF → MOBI requires Calibre (ebook-convert).');
    console.error('   Pandoc is not used for PDF input. Install Calibre:');
    if (process.platform === 'darwin') {
      console.error('   brew install --cask calibre');
    } else {
      console.error('   https://calibre-ebook.com/download');
    }
    process.exit(1);
  }

  const ext = path.extname(inputPath).toLowerCase();
  const baseName = path.basename(inputPath, ext);
  const outputDir = path.dirname(inputPath);

  let outputPath;
  if (options.output) {
    outputPath = resolveUserPath(options.output);
  } else if (options.outDir) {
    const od = resolveUserPath(options.outDir);
    fs.mkdirSync(od, { recursive: true });
    outputPath = path.join(od, `${baseName}.mobi`);
  } else {
    outputPath = path.join(outputDir, `${baseName}.mobi`);
  }

  const title = options.batch ? baseName : options.title || baseName;
  const author = options.author;

  const args = [
    inputPath,
    outputPath,
    '--output-profile',
    'kindle',
    ...calibreKindleEbookConvertArgs(),
  ];
  if (title) {
    args.push('--title', title);
  }
  if (author) {
    args.push('--authors', author);
  }

  console.log(`📄 Converting PDF → MOBI…`);
  console.log(`   ${path.basename(inputPath)} → ${path.basename(outputPath)}`);

  const result = spawnSync(converter.path, args, {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  });

  if (result.status !== 0) {
    console.error('❌ ebook-convert failed:');
    if (result.stderr) console.error(result.stderr);
    if (result.stdout) console.error(result.stdout);
    process.exit(result.status || 1);
  }

  console.log(`✅ MOBI written: ${outputPath}`);
}

const argv = process.argv.slice(2);

if (argv.includes('--help') || argv.includes('-h')) {
  console.log(`
📱 Markdown, text, or PDF → MOBI (Kindle)

Primary: Calibre’s ebook-convert (MOBI) for .md, .markdown, .txt, and .pdf.
If Calibre is missing, Markdown/text can fall back to Pandoc and EPUB (not PDF; PDF needs Calibre).
USB sideloading of EPUB often fails on older Kindles; Send to Kindle or Calibre → .mobi usually works.

  MOBI:  brew install --cask calibre
  EPUB fallback (Markdown/text only):  brew install pandoc
  Override: CALIBRE_EBOOK_CONVERT=/path/to/ebook-convert node scripts/convert-to-mobi.js …

Usage:
  node scripts/convert-to-mobi.js <path...> [options]

  path: one or more .md / .markdown / .txt / .pdf files, and/or directories (matching files inside are converted)

Options:
  -o, --output <file>   Output file (single input only), or an existing directory when using multiple inputs
  --out-dir <dir>       Write all .mobi files under this directory (created if missing)
  -r, --recursive       When input is a directory, include subfolders
  --title <string>      Book title (single input only; batch uses each file’s basename)
  --author <string>     Author metadata for the ebook(s)

Examples:
  node scripts/convert-to-mobi.js manual.md
  node scripts/convert-to-mobi.js manual.md -o dist/manual.mobi
  node scripts/convert-to-mobi.js docs/books/chapter.md --out-dir dist
  node scripts/convert-to-mobi.js a.md b.md --out-dir dist
  node scripts/convert-to-mobi.js docs/chapters --recursive --out-dir build
  node scripts/convert-to-mobi.js docs/first-aid/_First_AID.md --title "First Aid Manual"
  node scripts/convert-to-mobi.js report.pdf -o dist/report.mobi
`);
  process.exit(0);
}

const parsed = parseArgs(argv);
if (parsed.inputs.length === 0) {
  console.error('❌ Error: No input path(s) specified. Use --help for usage.');
  process.exit(1);
}

const files = expandToInputFiles(parsed.inputs, parsed.recursive);
if (files.length === 0) {
  console.error('❌ Error: No .md, .markdown, .txt, or .pdf files found.');
  process.exit(1);
}

let output = parsed.output;
let outDir = parsed.outDir;
const batch = files.length > 1;

if (batch && parsed.title) {
  console.warn('⚠️  --title is ignored in batch mode; each file uses its own basename.');
}

if (batch && output) {
  const outp = resolveUserPath(output);
  if (fs.existsSync(outp) && fs.statSync(outp).isDirectory()) {
    outDir = outp;
    output = null;
  } else {
    console.error('❌ Error: With multiple inputs, use --out-dir <directory> (or -o on an existing directory).');
    process.exit(1);
  }
}

(async () => {
  const needsMarked = files.some((f) => {
    const ext = path.extname(f).toLowerCase();
    return ext !== '.pdf' && ext !== '.txt';
  });
  let marked;
  if (needsMarked) {
    const { marked: m } = await import('marked');
    const { gfmHeadingId } = await import('marked-gfm-heading-id');
    m.use(gfmHeadingId());
    marked = m;
  }
  const converter = getConverter();
  if (converter.kind === 'calibre') {
    console.log(`🔧 Converter: Calibre ebook-convert\n   ${converter.path}\n`);
  } else {
    console.log(
      `🔧 Converter: Pandoc only (outputs .epub, not .mobi — Calibre not found)\n   ${converter.path}\n`
    );
  }
  for (const inputPath of files) {
    const isPdf = path.extname(inputPath).toLowerCase() === '.pdf';
    const opts = {
      output: batch ? null : output,
      outDir,
      title: parsed.title,
      author: parsed.author,
      batch,
    };
    if (isPdf) {
      convertPdfToMobi(inputPath, opts, converter);
    } else {
      await convertMdToMobi(marked, inputPath, opts, converter);
    }
  }
})().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
