import React, { useState } from 'react';
import { AlertCircle, Plus } from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { FileList } from '../components/FileList';
import { ProcessingState } from '../components/ProcessingState';
import { ResultCard } from '../components/ResultCard';
import { convertJpgToPdf, JpgToPdfProgress } from '../lib/jpgToPdf';

export const JpgToPdfTool: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [margin, setMargin] = useState<'none' | 'small' | 'standard'>('small');
  const [orientation, setOrientation] = useState<'auto' | 'portrait' | 'landscape'>('auto');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<JpgToPdfProgress | null>(null);
  const [result, setResult] = useState<{ blob: Blob; filename: string; url: string; pages: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setError(null);
    setResult(null);
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setProgress({ current: 0, total: files.length, message: 'Creating PDF...' });

    try {
      const { blob, pageCount } = await convertJpgToPdf(
        files,
        { margin, orientation },
        (p) => setProgress(p)
      );

      const url = URL.createObjectURL(blob);
      setResult({
        blob,
        filename: 'images-converted.pdf',
        url,
        pages: pageCount,
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to convert JPG images to PDF.');
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const handleReset = () => {
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }
    setFiles([]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
          JPG to PDF Converter
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Convert JPG and JPEG images into PDF files quickly with Tindry's online JPG to PDF converter.
        </p>
      </div>

      {isProcessing && (
        <ProcessingState
          title="Converting Images to PDF..."
          message={progress?.message || 'Assembling pages...'}
          percent={
            progress && progress.total > 0
              ? (progress.current / progress.total) * 100
              : undefined
          }
        />
      )}

      {!isProcessing && result && (
        <ResultCard
          filename={result.filename}
          filesize={result.blob.size}
          downloadUrl={result.url}
          onReset={handleReset}
          actionLabel="Download PDF"
          detailsText={`${result.pages} pages created`}
        />
      )}

      {!isProcessing && !result && (
        <div className="space-y-6">
          {files.length === 0 ? (
            <FileUploader
              acceptedFormats={['.jpg', '.jpeg', '.png']}
              multiple={true}
              maxFiles={50}
              onFilesSelected={handleFilesSelected}
              title="Drop your images here"
              subtitle="or choose JPG or JPEG files to assemble into a PDF"
            />
          ) : (
            <div className="space-y-4">
              <FileList
                files={files}
                onRemove={handleRemove}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onClearAll={() => setFiles([])}
                showOrderControls={true}
              />

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl bg-white border border-neutral-200">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                    Margin
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['none', 'small', 'standard'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMargin(m)}
                        className={`py-2 px-3 text-xs font-medium rounded-md border capitalize transition-colors ${
                          margin === m
                            ? 'border-black bg-black text-white'
                            : 'border-neutral-200 text-black hover:border-neutral-400 bg-white'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                    Page Orientation
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['auto', 'portrait', 'landscape'] as const).map((o) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setOrientation(o)}
                        className={`py-2 px-3 text-xs font-medium rounded-md border capitalize transition-colors ${
                          orientation === o
                            ? 'border-black bg-black text-white'
                            : 'border-neutral-200 text-black hover:border-neutral-400 bg-white'
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="flex items-center justify-center gap-2 py-2.5 px-4 border border-neutral-300 hover:border-black text-black font-medium text-xs rounded-md cursor-pointer transition-colors bg-white">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add More Images</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFilesSelected(Array.from(e.target.files));
                        e.target.value = '';
                      }
                    }}
                  />
                </label>

                <button
                  onClick={handleConvert}
                  className="flex-1 py-3 px-5 bg-black hover:bg-neutral-800 text-white font-medium text-xs tracking-wide rounded-md transition-colors"
                >
                  <span>Convert {files.length} Image{files.length > 1 ? 's' : ''} to PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-lg border border-neutral-300 bg-neutral-50 text-black text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-black mt-0.5" />
          <div>
            <p className="font-semibold text-black">Conversion Notice</p>
            <p className="text-neutral-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Helpful On-Page Content & Guide */}
      <section className="pt-6 border-t border-neutral-200 space-y-4 text-xs text-neutral-600">
        <h2 className="text-sm font-bold text-black">How to convert JPG and JPEG images to PDF</h2>
        <ol className="list-decimal list-inside space-y-1.5 text-neutral-600 pl-1">
          <li>Upload your JPG or JPEG image files into the upload box.</li>
          <li>Arrange your images in the desired sequence and configure orientation (Auto, Portrait, Landscape) and margins (None, Small, Standard).</li>
          <li>Click <strong className="text-black font-semibold">Convert to PDF</strong> to generate the PDF document.</li>
          <li>Download your compiled PDF instantly to your computer or mobile device.</li>
        </ol>
        <p className="text-[11px] text-neutral-500 leading-relaxed">
          Tindry creates standard PDF documents directly in client memory without uploading photos to external servers. High-resolution photos are retained accurately.
        </p>
      </section>
    </div>
  );
};
