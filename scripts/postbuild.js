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
    title: 'Merge PDF Free Online - No Sign Up, 100% Private',
    description: 'Merge PDF files for free online. No sign-up, no upload, 100% private. Combine multiple PDFs in seconds directly in your browser.',
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
  'blog': {
    title: 'Tindry Blog - Privacy & Offline Tools',
    description: 'Learn how to work 100% offline without risking your files. Practical guides, architecture breakdowns, and data privacy advice from the founder in Fes, Morocco.',
    canonical: 'https://tindry.com/blog',
    noindex: false,
  },
  'blog/how-to-compress-images-without-uploading': {
    title: 'Compress Images Without Uploading | Private Guide',
    description: 'Learn how to compress images 100% offline in your browser without uploading to cloud servers. Keep your private photos secure.',
    canonical: 'https://tindry.com/blog/how-to-compress-images-without-uploading',
    noindex: false,
  },
  'blog/why-offline-pdf-tools-are-safer': {
    title: 'Why Offline PDF Tools Are Safer | Complete Privacy',
    description: 'Discover why uploading sensitive PDFs to cloud converters is a security risk and how client-side processing keeps your documents private.',
    canonical: 'https://tindry.com/blog/why-offline-pdf-tools-are-safer',
    noindex: false,
  },
  'blog/create-invoices-offline': {
    title: 'Create Invoices Offline & Protect Client Data | Tindry',
    description: 'Protect confidential client rates and banking details by creating and editing invoices completely offline in your browser without cloud uploads.',
    canonical: 'https://tindry.com/blog/create-invoices-offline',
    noindex: false,
  },
  'blog/convert-mp4-to-mp3-offline-without-uploading': {
    title: 'Convert MP4 Video to MP3 Offline Without Uploading | Tindry',
    description: 'Extract crystal-clear MP3 audio from MP4 videos 100% offline in your browser. Zero uploads, complete privacy, and fast local WebAssembly conversion.',
    canonical: 'https://tindry.com/blog/convert-mp4-to-mp3-offline-without-uploading',
    noindex: false,
  },
  'blog/merge-multiple-pdf-files-into-one-offline': {
    title: 'Merge Multiple PDF Files Into One Offline | Tindry',
    description: 'Combine contracts, bank statements, and multi-page scans into one PDF 100% offline inside your browser without uploading files to external servers.',
    canonical: 'https://tindry.com/blog/merge-multiple-pdf-files-into-one-offline',
    noindex: false,
  },
  'blog/convert-jpg-images-to-pdf-offline-official-documents': {
    title: 'Convert JPG Images to PDF Offline for Official Documents | Tindry',
    description: 'Turn passport scans, ID photos, and receipts into clean official PDF documents 100% offline in your browser with zero server uploads.',
    canonical: 'https://tindry.com/blog/convert-jpg-images-to-pdf-offline-official-documents',
    noindex: false,
  },
  'blog/compress-image-without-losing-quality-offline': {
    title: 'Compress an Image Without Losing Quality Offline | Tindry',
    description: 'Reduce JPG, PNG, and WebP file sizes offline in your browser without losing sharp visual quality or leaking private EXIF metadata.',
    canonical: 'https://tindry.com/blog/compress-image-without-losing-quality-offline',
    noindex: false,
  },
  'blog/remove-background-from-photo-in-3-seconds-offline': {
    title: 'Remove Background From Any Photo in 3 Seconds Offline | Tindry',
    description: 'Erase photo backgrounds cleanly in 3 seconds directly in your browser. Zero cloud uploads, transparent PNG downloads, and full privacy.',
    canonical: 'https://tindry.com/blog/remove-background-from-photo-in-3-seconds-offline',
    noindex: false,
  },
  'blog/convert-iphone-heic-photos-to-jpg-offline': {
    title: 'Convert iPhone HEIC Photos to JPG Offline | Tindry',
    description: 'Convert Apple iPhone HEIC photos to standard JPG directly inside your browser without installing paid codecs or uploading your camera roll.',
    canonical: 'https://tindry.com/blog/convert-iphone-heic-photos-to-jpg-offline',
    noindex: false,
  },
  'blog/upscale-blurry-photo-to-hd-quality-offline': {
    title: 'Upscale a Blurry Photo to HD Quality Offline | Tindry',
    description: 'Enhance and upscale blurry low-resolution photos up to 4x HD locally in your browser without server uploads or subscriptions.',
    canonical: 'https://tindry.com/blog/upscale-blurry-photo-to-hd-quality-offline',
    noindex: false,
  },
  'blog/create-qr-code-offline-without-tracking': {
    title: 'Create a QR Code Offline Without Tracking | Tindry',
    description: 'Generate permanent static QR codes for links, Wi-Fi, and social profiles offline with zero redirect tracking or expiring paywalls.',
    canonical: 'https://tindry.com/blog/create-qr-code-offline-without-tracking',
    noindex: false,
  },
  'blog/extract-colors-from-image-offline-for-logo': {
    title: 'Extract Colors From Any Image Offline for Your Logo | Tindry',
    description: 'Extract exact HEX color palettes from logos and brand photos 100% offline in your browser without uploading client artwork.',
    canonical: 'https://tindry.com/blog/extract-colors-from-image-offline-for-logo',
    noindex: false,
  },
  'blog/count-words-and-fix-text-case-offline': {
    title: 'Count Words and Fix Text Case Offline | Tindry',
    description: 'Count words and characters and convert UPPERCASE, lowercase, and Title Case offline in your browser without pasting sensitive drafts online.',
    canonical: 'https://tindry.com/blog/count-words-and-fix-text-case-offline',
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
  'word-counter.html',
  'pdf-to-word.html'
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
