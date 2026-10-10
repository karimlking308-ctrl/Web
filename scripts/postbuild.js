import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const routes = [
  'tools',
  'tools/mp4-to-mp3',
  'tools/merge-pdf',
  'tools/jpg-to-pdf',
  'tools/pdf-to-jpg',
  'tools/compress-image',
  'mp4-to-mp3',
  'merge-pdf',
  'jpg-to-pdf',
  'pdf-to-jpg',
  'compress-image',
  'faq',
  'contact',
  'privacy',
  'terms'
];

if (fs.existsSync(distDir)) {
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    for (const route of routes) {
      const targetDir = path.join(distDir, route);
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, 'index.html'), indexHtml);
    }
    console.log(`[postbuild] Generated static entry points for ${routes.length} routes in dist/`);
  }
}
