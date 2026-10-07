import { PDFDocument } from 'pdf-lib';

export interface JpgToPdfProgress {
  current: number;
  total: number;
  message: string;
}

export type PageOrientation = 'auto' | 'portrait' | 'landscape';
export type PageMargin = 'none' | 'small' | 'standard';

export interface JpgToPdfOptions {
  margin?: PageMargin;
  orientation?: PageOrientation;
}

/**
 * Converts multiple JPG/JPEG (or PNG) files into a single ordered PDF document.
 */
export async function convertJpgToPdf(
  files: File[],
  options: JpgToPdfOptions = {},
  onProgress?: (progress: JpgToPdfProgress) => void
): Promise<{ blob: Blob; pageCount: number }> {
  if (files.length === 0) {
    throw new Error('Please select at least one JPG image to convert.');
  }

  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.({
      current: i + 1,
      total: files.length,
      message: `Embedding image "${file.name}" (${i + 1}/${files.length})...`,
    });

    try {
      const arrayBuffer = await file.arrayBuffer();
      let embeddedImage;

      if (file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) {
        embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
      } else if (file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
        embeddedImage = await pdfDoc.embedPng(arrayBuffer);
      } else {
        // Fallback: decode via HTMLImageElement canvas to JPEG bytes
        embeddedImage = await embedViaCanvas(file, pdfDoc);
      }

      const imgDims = embeddedImage.scale(1);
      
      // Standard A4 dimensions in points: 595.28 x 841.89
      // If auto orientation, match image aspect ratio
      let pageWidth = 595.28;
      let pageHeight = 841.89;

      if (options.orientation === 'landscape' || (options.orientation === 'auto' && imgDims.width > imgDims.height)) {
        pageWidth = 841.89;
        pageHeight = 595.28;
      }

      let marginPx = 20;
      if (options.margin === 'none') marginPx = 0;
      if (options.margin === 'standard') marginPx = 36;

      const availableWidth = pageWidth - marginPx * 2;
      const availableHeight = pageHeight - marginPx * 2;

      // Fit within available page area preserving aspect ratio
      const scaleX = availableWidth / imgDims.width;
      const scaleY = availableHeight / imgDims.height;
      const scale = Math.min(scaleX, scaleY);

      const renderWidth = imgDims.width * scale;
      const renderHeight = imgDims.height * scale;

      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      // Centered on page
      const posX = (pageWidth - renderWidth) / 2;
      const posY = (pageHeight - renderHeight) / 2;

      page.drawImage(embeddedImage, {
        x: posX,
        y: posY,
        width: renderWidth,
        height: renderHeight,
      });
    } catch (err: any) {
      throw new Error(`Failed to process image "${file.name}": ${err?.message || 'Unsupported format'}`);
    }
  }

  onProgress?.({
    current: files.length,
    total: files.length,
    message: 'Compiling PDF...',
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return { blob, pageCount: files.length };
}

async function embedViaCanvas(file: File, pdfDoc: PDFDocument) {
  return new Promise<any>((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = async () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context unavailable'));
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(async (blob) => {
        if (!blob) return reject(new Error('Canvas export failed'));
        const buf = await blob.arrayBuffer();
        try {
          const embedded = await pdfDoc.embedJpg(buf);
          resolve(embedded);
        } catch (e) {
          reject(e);
        }
      }, 'image/jpeg', 0.95);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not load image ${file.name}`));
    };
    img.src = url;
  });
}
