import React, { useState } from 'react';
import { Files, AlertCircle, Plus } from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { FileList } from '../components/FileList';
import { ProcessingState } from '../components/ProcessingState';
import { ResultCard } from '../components/ResultCard';
import { mergePdfFiles, MergePdfProgress } from '../lib/pdfMerge';

export const MergePdfTool: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<MergePdfProgress | null>(null);
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

  const handleClearAll = () => {
    setFiles([]);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress({ current: 0, total: files.length, message: 'Reading PDF documents...' });

    try {
      const { blob, pageCount } = await mergePdfFiles(files, (p) => {
        setProgress(p);
      });

      const url = URL.createObjectURL(blob);
      setResult({
        blob,
        filename: 'merged-document.pdf',
        url,
        pages: pageCount,
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to merge PDF files.');
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
          Merge PDF
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Merge multiple PDF files into one PDF document quickly and easily with Tindry.
        </p>
      </div>

      {isProcessing && (
        <ProcessingState
          title="Merging PDF Files..."
          message={progress?.message || 'Combining pages into new document...'}
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
          actionLabel="Download Merged PDF"
          detailsText={`${result.pages} total pages`}
        />
      )}

      {!isProcessing && !result && (
        <div className="space-y-6">
          {files.length === 0 ? (
            <FileUploader
              acceptedFormats={['.pdf']}
              multiple={true}
              maxFiles={30}
              onFilesSelected={handleFilesSelected}
              title="Drop your PDF files here"
              subtitle="or choose 2 or more PDF documents to combine"
            />
          ) : (
            <div className="space-y-4">
              <FileList
                files={files}
                onRemove={handleRemove}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onClearAll={handleClearAll}
                showOrderControls={true}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <label className="flex items-center justify-center gap-2 py-2.5 px-4 border border-neutral-300 hover:border-black text-black font-medium text-xs rounded-md cursor-pointer transition-colors bg-white">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add More PDFs</span>
                  <input
                    type="file"
                    accept=".pdf"
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
                  onClick={handleMerge}
                  disabled={files.length < 2}
                  className="flex-1 py-3 px-5 bg-black hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none text-white font-medium text-xs tracking-wide rounded-md transition-colors"
                >
                  <span>Merge {files.length} PDFs</span>
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
            <p className="font-semibold text-black">Merge Notice</p>
            <p className="text-neutral-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Helpful On-Page Content & Guide */}
      <section className="pt-6 border-t border-neutral-200 space-y-4 text-xs text-neutral-600">
        <h2 className="text-sm font-bold text-black">How to merge PDF documents online</h2>
        <ol className="list-decimal list-inside space-y-1.5 text-neutral-600 pl-1">
          <li>Upload two or more PDF files using the file dropzone.</li>
          <li>Reorder your files using the up and down arrows to arrange documents in your desired page sequence.</li>
          <li>Click <strong className="text-black font-semibold">Merge PDFs</strong> to combine them into a single file.</li>
          <li>Save the newly consolidated PDF document directly to your device.</li>
        </ol>
        <p className="text-[11px] text-neutral-500 leading-relaxed">
          PDF combining is performed locally in your browser using pure JavaScript. None of your confidential documents or records are sent to third-party cloud servers.
        </p>
      </section>
    </div>
  );
};
