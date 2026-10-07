export interface CompressOptions {
  quality: number; // 0.1 to 1.0 (default 0.75)
  maxWidth?: number; // optional resize
  maxHeight?: number;
  format?: 'image/jpeg' | 'image/webp';
}

export interface CompressResult {
  blob: Blob;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  savingsBytes: number;
  savingsPercent: number;
  width: number;
  height: number;
}

export async function compressImage(
  file: File,
  options: CompressOptions
): Promise<CompressResult> {
  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let targetWidth = img.naturalWidth;
      let targetHeight = img.naturalHeight;

      if (options.maxWidth && targetWidth > options.maxWidth) {
        targetHeight = Math.round((targetHeight * options.maxWidth) / targetWidth);
        targetWidth = options.maxWidth;
      }

      if (options.maxHeight && targetHeight > options.maxHeight) {
        targetWidth = Math.round((targetWidth * options.maxHeight) / targetHeight);
        targetHeight = options.maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Canvas 2D context is not supported in your browser.'));
      }

      // Smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fill white background in case source is transparent PNG
      const targetFormat = options.format || 'image/jpeg';
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error('Failed to encode compressed image'));
          }

          const compressedSize = blob.size;
          const savingsBytes = Math.max(0, originalSize - compressedSize);
          const savingsPercent = originalSize > 0 
            ? ((savingsBytes / originalSize) * 100) 
            : 0;

          const dataUrl = canvas.toDataURL(targetFormat, options.quality);

          resolve({
            blob,
            dataUrl,
            originalSize,
            compressedSize,
            savingsBytes,
            savingsPercent: Math.round(savingsPercent * 10) / 10,
            width: targetWidth,
            height: targetHeight,
          });
        },
        targetFormat,
        options.quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image "${file.name}". Ensure it is a valid JPG, PNG, or WebP file.`));
    };

    img.src = objectUrl;
  });
}
