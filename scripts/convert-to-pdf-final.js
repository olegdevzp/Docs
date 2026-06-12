const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { marked } = require('marked');

const REPO_ROOT = path.join(__dirname, '..');

function resolveFromRepo(p) {
  return path.isAbsolute(p) ? p : path.resolve(REPO_ROOT, p);
}

// Configure marked for better HTML output with internal links
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true, // Enable header IDs for internal links
  mangle: false
});

/**
 * Convert PDF to PDF with images preserved (re-renders each page as image).
 * Uses pdf-to-img to extract pages as PNG, then Puppeteer to create output PDF.
 */
async function convertPdfToPDF(inputFile, options = {}) {
  const { scale = 2 } = options;
  const { pdf } = await import('pdf-to-img');

  try {
    let pdfPath;
    if (path.isAbsolute(inputFile)) {
      pdfPath = inputFile;
    } else {
      pdfPath = resolveFromRepo(inputFile);
    }

    if (!fs.existsSync(pdfPath)) {
      console.error(`❌ Error: File not found: ${pdfPath}`);
      process.exit(1);
    }

    const fileName = path.basename(pdfPath, '.pdf');
    const fileTitle = fileName.replace(/-/g, ' ').replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    const outputDir = path.dirname(pdfPath);
    const outputPdfPath = path.join(outputDir, `${fileName}-converted.pdf`);

    console.log(`📄 Converting PDF (${path.basename(pdfPath)}) with images...`);

    const document = await pdf(pdfPath, { scale });
    const pageImages = [];
    let pageNum = 1;

    for await (const imageBuffer of document) {
      const base64 = imageBuffer.toString('base64');
      pageImages.push(`data:image/png;base64,${base64}`);
      console.log(`  Page ${pageNum} rendered`);
      pageNum++;
    }

    const pageHtml = pageImages
      .map(
        (dataUrl) =>
          `<div class="pdf-page"><img src="${dataUrl}" alt="Page" /></div>`
      )
      .join('\n');

    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${fileTitle}</title>
  <style>
    body { margin: 0; padding: 0; background: white; }
    .pdf-page {
      page-break-after: always;
      page-break-inside: avoid;
    }
    .pdf-page:last-child { page-break-after: auto; }
    .pdf-page img {
      width: 100%;
      height: auto;
      display: block;
    }
  </style>
</head>
<body>${pageHtml}</body>
</html>`;

    const tempHtmlPath = path.join(__dirname, 'temp-pdf.html');
    fs.writeFileSync(tempHtmlPath, fullHtml);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    await page.goto(`file://${tempHtmlPath}`, {
      waitUntil: 'load',
      timeout: 60000
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await page.pdf({
      path: outputPdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0.25in', right: '0.25in', bottom: '0.25in', left: '0.25in' }
    });

    await browser.close();
    fs.unlinkSync(tempHtmlPath);

    console.log(`✅ PDF converted successfully: ${path.basename(outputPdfPath)}`);
    console.log(`📁 Output location: ${outputPdfPath}`);
    console.log(`📄 ${pageImages.length} page(s) with images preserved`);
  } catch (error) {
    console.error('❌ Error converting PDF:', error);
    process.exit(1);
  }
}

async function convertMarkdownToPDF(inputFile) {
  try {
    // Determine the markdown file path
    let markdownPath;
    if (path.isAbsolute(inputFile)) {
      markdownPath = inputFile;
    } else {
      markdownPath = resolveFromRepo(inputFile);
    }
    
    // Check if file exists
    if (!fs.existsSync(markdownPath)) {
      console.error(`❌ Error: File not found: ${markdownPath}`);
      process.exit(1);
    }
    
    // Read the markdown file
    const markdownContent = fs.readFileSync(markdownPath, 'utf8');
    
    // Extract filename for title and output PDF name
    const fileName = path.basename(markdownPath, '.md');
    const fileTitle = fileName.replace(/-/g, ' ').replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Generate output PDF path
    const outputDir = path.dirname(markdownPath);
    const outputPdfPath = path.join(outputDir, `${fileName}.pdf`);
    
    // Convert markdown to HTML
    let htmlContent = marked(markdownContent);
    
    // Fix internal links by ensuring headers have proper IDs
    htmlContent = htmlContent.replace(/<h([1-6])[^>]*>([^<]+)<\/h[1-6]>/g, (match, level, text) => {
      // Create ID from text content
      const id = text.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
      
      return `<h${level} id="${id}">${text}</h${level}>`;
    });
    
    // Create a complete HTML document with large fonts and proper internal linking
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileTitle}</title>
    <style>
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            font-size: 26px; /* Large base font size */
            line-height: 1.8;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 10px;
            background: white;
        }
        
        h1 {
            font-size: 40px;
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 20px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        h2 {
            font-size: 32px;
            color: #34495e;
            margin-top: 40px;
            margin-bottom: 20px;
            border-left: 5px solid #3498db;
            padding-left: 15px;
        }
        
        h3 {
            font-size: 28px;
            color: #2c3e50;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        
        h4 {
            font-size: 24px;
            color: #34495e;
            margin-top: 25px;
            margin-bottom: 12px;
        }
        
        h5 {
            font-size: 22px;
            color: #2c3e50;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        
        h6 {
            font-size: 20px;
            color: #34495e;
            margin-top: 15px;
            margin-bottom: 8px;
        }
        
        p {
            margin-bottom: 15px;
            text-align: justify;
        }
        
        ul, ol {
            margin-bottom: 20px;
            padding-left: 30px;
        }
        
        li {
            margin-bottom: 8px;
            font-size: 26px;
        }
        
        code {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 2px 6px;
            font-family: 'Courier New', monospace;
            font-size: 20px;
            color: #e83e8c;
        }
        
        pre {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 15px;
            margin: 15px 0;
            overflow-x: auto;
            overflow-wrap: break-word;
            word-wrap: break-word;
            white-space: pre-wrap;
            font-family: 'Courier New', monospace;
            font-size: 20px;
            line-height: 1.6;
        }
        
        pre code {
            background: none;
            border: none;
            padding: 0;
            font-size: 20px;
            color: #333;
        }
        
        blockquote {
            border-left: 4px solid #3498db;
            margin: 20px 0;
            padding: 10px 20px;
            background-color: #f8f9fa;
            font-style: italic;
            font-size: 26px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 26px;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        
        a {
            color: #3498db;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        /* Internal link styling for better visibility */
        a[href^="#"] {
            color: #2980b9;
            font-weight: 500;
            border-bottom: 1px dotted #3498db;
        }
        
        a[href^="#"]:hover {
            background-color: #ecf0f1;
            padding: 2px 4px;
            border-radius: 3px;
        }
        
        .toc {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .toc h2 {
            margin-top: 0;
            color: #2c3e50;
        }
        
        .toc ul {
            margin: 0;
        }
        
        .toc li {
            margin-bottom: 5px;
        }
        
        .toc a {
            color: #34495e;
            font-weight: 500;
        }
        
        /* Page break styles for PDF */
        @media print {
            body {
                font-size: 24px;
            }
            
            h1 {
                font-size: 36px;
            }
            
            h2 {
                font-size: 28px;
            }
            
            h3 {
                font-size: 24px;
            }
            
            h4 {
                font-size: 22px;
            }
            
            h5 {
                font-size: 20px;
            }
            
            h6 {
                font-size: 18px;
            }
            
            code {
                font-size: 18px;
            }
            
            pre {
                font-size: 18px;
            }
            
            li {
                font-size: 24px;
            }
            
            table {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

    // Write HTML to temporary file
    const tempHtmlPath = path.join(__dirname, 'temp.html');
    fs.writeFileSync(tempHtmlPath, fullHtml);
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Load the HTML file
    await page.goto(`file://${tempHtmlPath}`, {
      waitUntil: 'networkidle0'
    });
    
    // Wait for all content to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test internal links before generating PDF
    const linkTest = await page.evaluate(() => {
      const internalLinks = document.querySelectorAll('a[href^="#"]');
      const results = [];
      
      for (let i = 0; i < Math.min(5, internalLinks.length); i++) {
        const link = internalLinks[i];
        const href = link.getAttribute('href');
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        results.push({
          href: href,
          targetExists: !!targetElement,
          targetId: targetId
        });
      }
      
      return {
        totalLinks: internalLinks.length,
        testResults: results
      };
    });
    
    console.log('Link test results:', linkTest);
    
    // Generate PDF with large font settings and internal links enabled
    const pdf = await page.pdf({
      path: outputPdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.4in',
        bottom: '0.5in',
        left: '0.4in'
      },
      displayHeaderFooter: true,
      headerTemplate: `<div style="font-size: 10px; text-align: center; width: 100%; color: #666;">${fileTitle}</div>`,
      footerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; color: #666;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
      preferCSSPageSize: false,
      tagged: true, // Enable accessibility features including internal links
      outline: true // Enable PDF outline/bookmarks
    });
    
    await browser.close();
    
    // Clean up temporary file
    fs.unlinkSync(tempHtmlPath);
    
    console.log(`✅ PDF generated successfully: ${path.basename(outputPdfPath)}`);
    console.log(`📁 Output location: ${outputPdfPath}`);
    console.log('📄 The PDF has been created with large, readable fonts and working internal links');
    console.log('🔗 Internal links should now work in PDF viewers that support them');
    
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  }
}

// Parse CLI args: support --scale N for PDF quality
const argv = process.argv.slice(2);
let scale = 2;
let inputFile = 'docs/js/frontend-interview-javascript-questions.pdf';

for (let i = 0; i < argv.length; i++) {
  if ((argv[i] === '--scale' || argv[i] === '-s') && argv[i + 1]) {
    scale = parseFloat(argv[i + 1]) || 2;
    i++; // skip the scale value
  } else if (!argv[i].startsWith('-')) {
    const isScaleValue = i > 0 && (argv[i - 1] === '--scale' || argv[i - 1] === '-s');
    if (!isScaleValue) {
      inputFile = argv[i];
    }
  }
}

// Display usage information if --help is provided
if (argv.includes('--help') || argv.includes('-h')) {
  console.log(`
📝 Markdown & PDF to PDF Converter

Usage:
  node scripts/convert-to-pdf-final.js [options] [input-file]

Arguments:
  input-file    Path to the markdown (.md) or PDF (.pdf) file (relative to repo root or absolute)
                Default: docs/js/frontend-interview-javascript-questions.pdf

Options (PDF only):
  -s, --scale N  Image scale for PDF pages (default: 2). Use 3 for higher quality.

Supported formats:
  .md   Markdown → PDF (with large fonts, internal links, tables)
  .pdf  PDF → PDF (preserves images, re-renders each page)

Examples:
  node scripts/convert-to-pdf-final.js docs/books/atomic-habits-chapters.md
  node scripts/convert-to-pdf-final.js docs/books/learning-how-to-learn-chapters.md
  node scripts/convert-to-pdf-final.js docs/first-aid/_First_AID.pdf
  node scripts/convert-to-pdf-final.js --scale 3 document.pdf
  node scripts/convert-to-pdf-final.js /absolute/path/to/file.md

Output:
  - Markdown: same directory, same name with .pdf extension
  - PDF: same directory, same name with -converted.pdf suffix
`);
  process.exit(0);
}

async function convertToPDF(inputFile) {
  try {
    let resolvedPath;
    if (path.isAbsolute(inputFile)) {
      resolvedPath = inputFile;
    } else {
      resolvedPath = resolveFromRepo(inputFile);
    }

    if (!fs.existsSync(resolvedPath)) {
      console.error(`❌ Error: File not found: ${resolvedPath}`);
      process.exit(1);
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    if (ext === '.pdf') {
      await convertPdfToPDF(inputFile, { scale });
    } else if (ext === '.md') {
      await convertMarkdownToPDF(inputFile);
    } else {
      console.error(`❌ Error: Unsupported format "${ext}". Use .md or .pdf files.`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

console.log(`📄 Converting: ${inputFile}`);
console.log('⏳ Processing...\n');

// Run the conversion
convertToPDF(inputFile);



