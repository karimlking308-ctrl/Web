import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const rootDir = path.resolve(__dirname, '..');

// Clean root URLs with https://tindry.com prefix
const pageConfigs = {
  'mp4-to-mp3': {
    title: 'MP4 to MP3 - Extract Audio in Seconds Offline | Tindry',
    description: 'Free MP4 to MP3 converter. Extract audio in seconds. 100% private, no uploads, works offline in your browser.',
    canonical: 'https://tindry.com/mp4-to-mp3',
    noindex: false,
  },
  'webm-to-mp4': {
    title: 'WebM to MP4 Converter - Fast Video Conversion | Tindry',
    description: 'Convert WebM to MP4 free. Fast video conversion in browser. No uploads, 100% offline and private.',
    canonical: 'https://tindry.com/webm-to-mp4',
    noindex: false,
  },
  'merge-pdf': {
    title: 'Merge PDF - Combine PDF Files Easily Free | Tindry',
    description: 'Free Merge PDF tool. Combine multiple PDF files easily. 100% private, no file upload, offline processing.',
    canonical: 'https://tindry.com/merge-pdf',
    noindex: false,
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF Converter - Free & Offline | Tindry',
    description: 'Convert JPG to PDF free. Turn images to PDF online, no upload, 100% private, offline converter.',
    canonical: 'https://tindry.com/jpg-to-pdf',
    noindex: false,
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG Converter - Extract Images Free | Tindry',
    description: 'Convert PDF to JPG free. Extract images from PDF online, no upload, private & offline.',
    canonical: 'https://tindry.com/pdf-to-jpg',
    noindex: false,
  },
  'compress-image': {
    title: 'Compress Image - Reduce Size No Quality Loss | Tindry',
    description: 'Compress images online free. Reduce size with no quality loss. 100% private, no uploads, files stay in browser.',
    canonical: 'https://tindry.com/compress-image',
    noindex: false,
  },
  'screen-record': {
    title: 'Screen Record - Directly in Your Browser | Tindry',
    description: 'Free screen recorder directly in browser. No download needed. 100% private, offline, secure screen recording.',
    canonical: 'https://tindry.com/screen-record',
    noindex: false,
  },
  'contact': {
    title: 'Contact Tindry',
    description: 'Get in touch with the Tindry team for questions, feedback, or technical inquiries.',
    canonical: 'https://tindry.com/contact',
    noindex: false,
  },
  'faq': {
    title: 'Tindry FAQ - Frequently Asked Questions',
    description: "Find answers to common questions about Tindry's online file conversion and compression tools.",
    canonical: 'https://tindry.com/faq',
    noindex: false,
  },
  'privacy': {
    title: 'Privacy Policy | Tindry',
    description: 'Read the Tindry Privacy Policy. Learn how we prioritize user privacy with client-side, zero-upload file operations.',
    canonical: 'https://tindry.com/privacy',
    noindex: false,
  },
  'terms': {
    title: 'Terms of Service | Tindry',
    description: 'Read the Terms of Service for using Tindry online file conversion and compression tools.',
    canonical: 'https://tindry.com/terms',
    noindex: false,
  },
};

const standaloneHtmlTools = [
  'background-remover.html',
  'heic-to-jpg.html',
  'image-upscaler.html',
  'png-to-jpg.html',
  'webp-to-jpg.html',
  'image-resizer.html',
  'qr-generator.html',
  'color-palette.html',
  'word-counter.html'
];

if (fs.existsSync(distDir)) {
  // Remove old legacy /tools folder in dist if present
  const oldToolsDir = path.join(distDir, 'tools');
  if (fs.existsSync(oldToolsDir)) {
    fs.rmSync(oldToolsDir, { recursive: true, force: true });
    console.log('[postbuild] Cleaned up legacy dist/tools/ directory');
  }

  // Copy all 9 standalone HTML files into dist/ and create root-level folder aliases
  for (const fileName of standaloneHtmlTools) {
    const srcPath = path.join(rootDir, fileName);
    if (fs.existsSync(srcPath)) {
      const destPath = path.join(distDir, fileName);
      fs.copyFileSync(srcPath, destPath);

      // Create folder alias (e.g. dist/background-remover/index.html)
      const baseName = fileName.replace(/\.html$/, '');
      const folderPath = path.join(distDir, baseName);
      fs.mkdirSync(folderPath, { recursive: true });
      fs.copyFileSync(srcPath, path.join(folderPath, 'index.html'));
    }
  }

  // Copy record.html to dist/record.html and dist/screen-record/index.html
  const recordSrc = path.join(rootDir, 'record.html');
  if (fs.existsSync(recordSrc)) {
    fs.copyFileSync(recordSrc, path.join(distDir, 'record.html'));
    const screenRecFolder = path.join(distDir, 'screen-record');
    fs.mkdirSync(screenRecFolder, { recursive: true });
    fs.copyFileSync(recordSrc, path.join(screenRecFolder, 'index.html'));
  }

  const indexHtmlPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

    for (const [route, config] of Object.entries(pageConfigs)) {
      const targetDir = path.join(distDir, route);
      fs.mkdirSync(targetDir, { recursive: true });

      let customizedHtml = baseHtml;

      // Replace title
      customizedHtml = customizedHtml.replace(
        /<title>.*?<\/title>/i,
        `<title>${config.title}</title>`
      );

      // Replace meta description
      customizedHtml = customizedHtml.replace(
        /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
        `<meta name="description" content="${config.description}" />`
      );

      // Replace canonical link
      customizedHtml = customizedHtml.replace(
        /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
        `<link rel="canonical" href="${config.canonical}" />`
      );

      // Update og:url, og:title, og:description
      customizedHtml = customizedHtml.replace(
        /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
        `<meta property="og:url" content="${config.canonical}" />`
      );
      customizedHtml = customizedHtml.replace(
        /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
        `<meta property="og:title" content="${config.title}" />`
      );
      customizedHtml = customizedHtml.replace(
        /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
        `<meta property="og:description" content="${config.description}" />`
      );

      // Update robots tag: always index, follow for production build
      customizedHtml = customizedHtml.replace(
        /<meta\s+name="robots"\s+content=".*?"\s*\/?>/i,
        '<meta name="robots" content="index, follow" />'
      );

      fs.writeFileSync(path.join(targetDir, 'index.html'), customizedHtml);
    }

    console.log(`[postbuild] Generated static entry points and 9 standalone HTML tools in dist/`);
  }
}
