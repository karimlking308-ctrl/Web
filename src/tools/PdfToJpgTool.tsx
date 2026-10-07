import React, { useState } from 'react';
import { AlertCircle, Download, Archive } from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { ProcessingState } from '../components/ProcessingState';
import { convertPdfToJpg, PdfToJpgProgress, RenderedPage } from '../lib/pdfToJpg';
import { formatBytes, triggerDownload } from '../lib/utils';

export const PdfToJpgTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(0.92);
  const [scale, setScale] = useState<number>(2.0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<PdfToJpgProgress | null>(null);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setError(null);
      setPages([]);
      setZipBlob(null);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setProgress({ current: 0, total: 1, message: 'Loading PDF document...' });

    try {
      const res = await convertPdfToJpg(file, quality, scale, (p) => {
        setProgress(p);
      });

      setPages(res.pages);
      if (res.zipBlob) {
        setZipBlob(res.zipBlob);
        setZipUrl(URL.createObjectURL(res.zipBlob));
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to render PDF pages into JPG images.');
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const handleDownloadSingle = (page: RenderedPage) => {
    const baseName = file?.name.replace(/\.pdf$/i, '') || 'page';
    const padded = String(page.pageNumber).padStart(2, '0');
    triggerDownload(page.dataUrl, `${baseName}-page-${padded}.jpg`);
  };

  const handleDownloadZip = () => {
    if (!zipUrl || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    triggerDownload(zipUrl, `${baseName}-jpg-pages.zip`);
  };

  const handleReset = () => {
    if (zipUrl) {
      URL.revokeObjectURL(zipUrl);
    }
    setFile(null);
    setPages([]);
    setZipBlob(null);
    setZipUrl(null);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
          PDF to JPG
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Extract every page of your PDF into high-quality JPG images.
        </p>
      </div>

      {isProcessing && (
        <ProcessingState
          title="Rendering PDF to JPG..."
          message={progress?.message || 'Extracting pages...'}
          percent={
            progress && progress.total > 0
              ? (progress.current / progress.total) * 100
              : undefined
          }
        />
      )}

      {!isProcessing && pages.length > 0 && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-white border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-black text-xs uppercase tracking-wider">
                Converted {pages.length} Page{pages.length > 1 ? 's' : ''}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Total size: {formatBytes(pages.reduce((a, b) => a + b.sizeBytes, 0))}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {zipBlob && (
                <button
                  onClick={handleDownloadZip}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2.5 px-4 bg-black hover:bg-neutral-800 text-white font-medium text-xs tracking-wide rounded-md transition-colors"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Download ZIP ({formatBytes(zipBlob.size)})</span>
                </button>
              )}
              <button
                onClick={handleReset}
                className="py-2.5 px-3 border border-neutral-300 hover:border-black text-black font-medium text-xs rounded-md transition-colors bg-white"
              >
                Convert Another
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((p) => (
              <div
                key={p.pageNumber}
                className="bg-white border border-neutral-200 rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] bg-neutral-50 flex items-center justify-center p-3 border-b border-neutral-200">
                  <img
                    src={p.dataUrl}
                    alt={`Page ${p.pageNumber}`}
                    className="max-h-full max-w-full object-contain border border-neutral-200 bg-white"
                  />
                  <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                    Page {p.pageNumber}
                  </span>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-neutral-500">
                    {formatBytes(p.sizeBytes)}
                  </div>
                  <button
                    onClick={() => handleDownloadSingle(p)}
                    className="flex items-center gap-1.5 py-1.5 px-2.5 bg-black hover:bg-neutral-800 text-white text-[11px] font-medium rounded transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isProcessing && pages.length === 0 && (
        <div className="space-y-6">
          {!file ? (
            <FileUploader
              acceptedFormats={['.pdf']}
              multiple={false}
              maxSizeMB={200}
              onFilesSelected={handleFilesSelected}
              title="Drop your PDF here"
              subtitle="or choose a PDF file to extract all pages as JPG images"
            />
          ) : (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 bg-neutral-50/50">
                <div className="min-w-0 pr-3">
                  <p className="text-xs font-semibold text-black truncate">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {formatBytes(file.size)}
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="text-xs text-neutral-500 hover:text-black font-medium px-2 py-1"
                >
                  Remove
                </button>
              </div>

              {/* Quality Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                    Resolution (DPI)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { scaleVal: 1.5, label: '150 DPI' },
                      { scaleVal: 2.0, label: '300 DPI' },
                    ].map((item) => (
                      <button
                        key={item.scaleVal}
                        type="button"
                        onClick={() => setScale(item.scaleVal)}
                        className={`p-2.5 rounded-md border text-xs font-medium transition-colors ${
                          scale === item.scaleVal
                            ? 'border-black bg-black text-white'
                            : 'border-neutral-200 text-black hover:border-neutral-400 bg-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                    Image Quality
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { q: 0.85, label: 'Standard (85%)' },
                      { q: 0.95, label: 'Maximum (95%)' },
                    ].map((item) => (
                      <button
                        key={item.q}
                        type="button"
                        onClick={() => setQuality(item.q)}
                        className={`p-2.5 rounded-md border text-xs font-medium transition-colors ${
                          quality === item.q
                            ? 'border-black bg-black text-white'
                            : 'border-neutral-200 text-black hover:border-neutral-400 bg-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleConvert}
                className="w-full py-3 px-4 bg-black hover:bg-neutral-800 text-white font-medium text-xs tracking-wide rounded-md transition-colors"
              >
                <span>Convert to JPG</span>
              </button>
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
    </div>
  );
};
