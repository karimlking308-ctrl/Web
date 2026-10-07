import React, { useState } from 'react';
import { Music, Play, AlertCircle } from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { ProcessingState } from '../components/ProcessingState';
import { ResultCard } from '../components/ResultCard';
import { convertMp4ToMp3, Mp4ToMp3Progress } from '../lib/mp4ToMp3';
import { formatBytes } from '../lib/utils';

export const Mp4ToMp3Tool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [bitrate, setBitrate] = useState<128 | 192 | 320>(192);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<Mp4ToMp3Progress | null>(null);
  const [result, setResult] = useState<{ blob: Blob; filename: string; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setProgress({ ratio: 0, message: 'Decoding audio stream...' });

    try {
      const output = await convertMp4ToMp3(file, bitrate, (p) => {
        setProgress(p);
      });

      const url = URL.createObjectURL(output.blob);
      setResult({
        blob: output.blob,
        filename: output.filename,
        url,
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to extract audio from video file.');
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const handleReset = () => {
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Tool Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
          MP4 to MP3
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Convert your MP4 video to MP3 audio.
        </p>
      </div>

      {isProcessing && (
        <ProcessingState
          title="Converting MP4 to MP3..."
          message={progress?.message || 'Processing audio stream...'}
          percent={progress && progress.ratio > 0 ? progress.ratio * 100 : undefined}
        />
      )}

      {!isProcessing && result && (
        <ResultCard
          filename={result.filename}
          filesize={result.blob.size}
          downloadUrl={result.url}
          onReset={handleReset}
          actionLabel="Download MP3"
          detailsText={`MP3 audio (${bitrate} kbps)`}
        />
      )}

      {!isProcessing && !result && (
        <div className="space-y-6">
          {!file ? (
            <FileUploader
              acceptedFormats={['.mp4']}
              multiple={false}
              maxSizeMB={500}
              onFilesSelected={handleFilesSelected}
              title="Drop your file here"
              subtitle="or choose an MP4 video file from your device"
            />
          ) : (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6">
              {/* File details */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 bg-neutral-50/50">
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <div className="w-9 h-9 rounded border border-neutral-200 bg-white flex items-center justify-center flex-shrink-0">
                    <Music className="w-4 h-4 text-black" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-black truncate">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="text-xs text-neutral-500 hover:text-black font-medium px-2 py-1"
                >
                  Remove
                </button>
              </div>

              {/* Bitrate selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  Audio Bitrate
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 128, label: '128 kbps', desc: 'Standard' },
                    { val: 192, label: '192 kbps', desc: 'High Quality' },
                    { val: 320, label: '320 kbps', desc: 'Maximum' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setBitrate(opt.val as any)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        bitrate === opt.val
                          ? 'border-black bg-black text-white'
                          : 'border-neutral-200 text-black hover:border-neutral-400 bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className={`text-[10px] mt-0.5 ${bitrate === opt.val ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {opt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={handleConvert}
                className="w-full py-3 px-4 bg-black hover:bg-neutral-800 text-white font-medium text-xs tracking-wide rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Convert to MP3</span>
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-lg border border-neutral-300 bg-neutral-50 text-black text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-black mt-0.5" />
          <div>
            <p className="font-semibold text-black">Conversion Error</p>
            <p className="text-neutral-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};
