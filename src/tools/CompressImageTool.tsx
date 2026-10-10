import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { ProcessingState } from '../components/ProcessingState';
import { ResultCard } from '../components/ResultCard';
import { compressImage, CompressResult } from '../lib/imageCompressor';
import { formatBytes } from '../lib/utils';

export const CompressImageTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0.75);
  const [maxDimension, setMaxDimension] = useState<number | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      const selected = files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setResult(null);
      setError(null);
    }
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const res = await compressImage(file, {
        quality,
        maxWidth: maxDimension,
        maxHeight: maxDimension,
        format: 'image/jpeg',
      });

      setResult(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to compress image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  const getOutputFilename = () => {
    if (!file) return 'compressed-image.jpg';
    const base = file.name.replace(/\.[^/.]+$/, '');
    return `${base}-compressed.jpg`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
          Compress Image
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Compress images online and reduce file size while maintaining good image quality with Tindry.
        </p>
      </div>

      {isProcessing && (
        <ProcessingState
          title="Compressing Image..."
          message="Optimizing image payload..."
        />
      )}

      {!isProcessing && result && (
        <ResultCard
          filename={getOutputFilename()}
          filesize={result.compressedSize}
          downloadUrl={result.dataUrl}
          onReset={handleReset}
          actionLabel="Download Compressed Image"
          savingsInfo={{
            originalSize: result.originalSize,
            compressedSize: result.compressedSize,
            savingsPercent: result.savingsPercent,
          }}
          detailsText={`${result.width}×${result.height}px`}
        />
      )}

      {!isProcessing && !result && (
        <div className="space-y-6">
          {!file ? (
            <FileUploader
              acceptedFormats={['.jpg', '.jpeg', '.png', '.webp']}
              multiple={false}
              maxSizeMB={50}
              onFilesSelected={handleFilesSelected}
              title="Drop your image here"
              subtitle="or choose a JPG, PNG, or WebP file to compress"
            />
          ) : (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6">
              {/* Image preview & info */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg border border-neutral-200 bg-neutral-50/50">
                {previewUrl && (
                  <div className="w-16 h-16 rounded overflow-hidden border border-neutral-200 bg-white flex-shrink-0 flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <p className="text-xs font-semibold text-black truncate">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Original size: <strong className="text-black">{formatBytes(file.size)}</strong>
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-neutral-500 hover:text-black font-medium px-2 py-1"
                >
                  Remove
                </button>
              </div>

              {/* Slider for quality */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    Quality Level
                  </span>
                  <span className="font-mono text-xs text-black">
                    {Math.round(quality * 100)}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0.1"
                  max="0.95"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-neutral-400">
                  <span>Smallest file size</span>
                  <span>Balanced</span>
                  <span>Highest quality</span>
                </div>
              </div>

              {/* Optional dimension resize */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  Optional Resize Limit
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { val: undefined, label: 'Original' },
                    { val: 2560, label: '2560px' },
                    { val: 1920, label: '1920px' },
                    { val: 1280, label: '1280px' },
                  ].map((dim) => (
                    <button
                      key={String(dim.val)}
                      type="button"
                      onClick={() => setMaxDimension(dim.val)}
                      className={`p-2 rounded-md border text-xs font-medium text-center transition-colors ${
                        maxDimension === dim.val
                          ? 'border-black bg-black text-white'
                          : 'border-neutral-200 text-black hover:border-neutral-400 bg-white'
                      }`}
                    >
                      {dim.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={handleCompress}
                className="w-full py-3 px-4 bg-black hover:bg-neutral-800 text-white font-medium text-xs tracking-wide rounded-md transition-colors"
              >
                <span>Compress Image</span>
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-lg border border-neutral-300 bg-neutral-50 text-black text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-black mt-0.5" />
          <div>
            <p className="font-semibold text-black">Compression Notice</p>
            <p className="text-neutral-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Helpful On-Page Content & Guide */}
      <section className="pt-6 border-t border-neutral-200 space-y-4 text-xs text-neutral-600">
        <h2 className="text-sm font-bold text-black">How to compress images online</h2>
        <ol className="list-decimal list-inside space-y-1.5 text-neutral-600 pl-1">
          <li>Upload your JPG, PNG, or WebP image into the compression area above.</li>
          <li>Adjust the compression quality percentage slider to balance file size and visual clarity.</li>
          <li>Optionally specify maximum width or height to scale down large camera dimensions.</li>
          <li>Click <strong className="text-black font-semibold">Compress Image</strong> and download your lightweight compressed file with verified byte savings.</li>
        </ol>
        <p className="text-[11px] text-neutral-500 leading-relaxed">
          All image transformations take place directly in your browser using HTML5 Canvas compression algorithms. No photos are ever uploaded to cloud servers.
        </p>
      </section>
    </div>
  );
};
