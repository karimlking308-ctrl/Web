import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export interface RenderedPage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
  sizeBytes: number;
}

export interface PdfToJpgProgress {
  current: number;
  total: number;
  message: string;
}

export async function convertPdfToJpg(
  file: File,
  quality: number = 0.92,
  scale: number = 2.0,
  onProgress?: (progress: PdfToJpgProgress) => void
): Promise<{ pages: RenderedPage[]; zipBlob?: Blob }> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  if (numPages === 0) {
    throw new Error('This PDF contains no pages.');
  }

  const pages: RenderedPage[] = [];

  for (let i = 1; i <= numPages; i++) {
    onProgress?.({
      current: i,
      total: numPages,
      message: `Rendering page ${i} of ${numPages}...`,
    });

    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Unable to create canvas rendering context for page ' + i);
    }

    // Set white background behind transparent PDF content
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport: viewport,
    }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error(`Failed to export page ${i} as JPG`));
        },
        'image/jpeg',
        quality
      );
    });

    const dataUrl = canvas.toDataURL('image/jpeg', quality);

    pages.push({
      pageNumber: i,
      dataUrl,
      blob,
      sizeBytes: blob.size,
    });
  }

  // Create zip if multiple pages or requested
  let zipBlob: Blob | undefined;
  if (pages.length > 1) {
    onProgress?.({
      current: numPages,
      total: numPages,
      message: 'Packaging images into ZIP archive...',
    });

    const zip = new JSZip();
    const baseName = file.name.replace(/\.pdf$/i, '');
    pages.forEach((p) => {
      const paddedNum = String(p.pageNumber).padStart(2, '0');
      zip.file(`${baseName}-page-${paddedNum}.jpg`, p.blob);
    });

    zipBlob = await zip.generateAsync({ type: 'blob' });
  }

  return { pages, zipBlob };
}
