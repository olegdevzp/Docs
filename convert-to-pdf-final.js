const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { marked } = require('marked');

// Configure marked for better HTML output with internal links
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true, // Enable header IDs for internal links
  mangle: false
});

async function convertMarkdownToPDF(inputFile) {
  try {
    // Determine the markdown file path
    let markdownPath;
    if (path.isAbsolute(inputFile)) {
      markdownPath = inputFile;
    } else {
      markdownPath = path.join(__dirname, inputFile);
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
            font-size: 22px; /* Large base font size */
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
            font-size: 22px;
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
            font-size: 22px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 22px;
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
                font-size: 20px;
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
                font-size: 20px;
            }
            
            table {
                font-size: 20px;
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

// Get input file from command line arguments or use default
const inputFile = process.argv[2] || 'docs/frontend-interview-javascript-questions.md';

// Display usage information if --help is provided
if (process.argv[2] === '--help' || process.argv[2] === '-h') {
  console.log(`
📝 Markdown to PDF Converter

Usage:
  node convert-to-pdf-final.js [input-file]

Arguments:
  input-file    Path to the markdown file (relative or absolute)
                Default: docs/frontend-interview-javascript-questions.md

Examples:
  node convert-to-pdf-final.js docs/atomic-habits-chapters.md
  node convert-to-pdf-final.js docs/learning-how-to-learn-chapters.md
  node convert-to-pdf-final.js /absolute/path/to/file.md
  node convert-to-pdf-final.js                    (uses default file)

Output:
  The PDF will be generated in the same directory as the input file
  with the same name but .pdf extension.
`);
  process.exit(0);
}

console.log(`📄 Converting: ${inputFile}`);
console.log('⏳ Processing...\n');

// Run the conversion
convertMarkdownToPDF(inputFile);



