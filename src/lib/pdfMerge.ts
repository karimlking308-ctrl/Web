import { PDFDocument } from 'pdf-lib';

export interface MergePdfProgress {
  current: number;
  total: number;
  message: string;
}

/**
 * Merges multiple PDF files in the order provided into a single PDF blob.
 */
export async function mergePdfFiles(
  files: File[],
  onProgress?: (progress: MergePdfProgress) => void
): Promise<{ blob: Blob; pageCount: number }> {
  if (files.length === 0) {
    throw new Error('Please select at least one PDF file to merge.');
  }

  const mergedPdf = await PDFDocument.create();
  let totalPages = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.({
      current: i + 1,
      total: files.length,
      message: `Reading "${file.name}" (${i + 1}/${files.length})...`,
    });

    try {
      const arrayBuffer = await file.arrayBuffer();
      // Load the document (ignore encryption issues gracefully if password protected)
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
        totalPages++;
      });
    } catch (err: any) {
      if (err?.message?.includes('password') || err?.message?.includes('encrypt')) {
        throw new Error(`"${file.name}" is password-protected or encrypted. Please remove password protection first.`);
      }
      throw new Error(`Failed to parse "${file.name}": ${err?.message || 'File may be corrupted or invalid PDF'}`);
    }
  }

  onProgress?.({
    current: files.length,
    total: files.length,
    message: 'Finalizing merged document...',
  });

  const pdfBytes = await mergedPdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return { blob, pageCount: totalPages };
}
