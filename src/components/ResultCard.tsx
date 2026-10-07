import React from 'react';
import { Download, Check, RotateCcw, FileText, Music, Image as ImageIcon } from 'lucide-react';
import { formatBytes, triggerDownload } from '../lib/utils';

interface ResultCardProps {
  filename: string;
  filesize: number;
  downloadUrl: string;
  onReset: () => void;
  savingsInfo?: {
    originalSize: number;
    compressedSize: number;
    savingsPercent: number;
  };
  detailsText?: string;
  actionLabel?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  filename,
  filesize,
  downloadUrl,
  onReset,
  savingsInfo,
  detailsText,
  actionLabel,
}) => {
  const handleDownload = () => {
    triggerDownload(downloadUrl, filename);
  };

  const getFileIcon = () => {
    if (filename.endsWith('.mp3')) return <Music className="w-5 h-5 text-black" />;
    if (filename.endsWith('.pdf')) return <FileText className="w-5 h-5 text-black" />;
    return <ImageIcon className="w-5 h-5 text-black" />;
  };

  return (
    <div className="w-full bg-white border border-neutral-200 rounded-xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-200">
        <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-black">
          <Check className="w-4 h-4 text-black stroke-[2.5]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-black uppercase tracking-wider">
            Conversion Complete
          </h3>
          <p className="text-xs text-neutral-500">
            Your file is ready to download.
          </p>
        </div>
      </div>

      {savingsInfo && (
        <div className="grid grid-cols-3 gap-3 p-4 rounded-lg border border-neutral-200 bg-neutral-50 mb-6 text-center">
          <div>
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Original</div>
            <div className="text-xs font-semibold text-black mt-0.5">
              {formatBytes(savingsInfo.originalSize)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Compressed</div>
            <div className="text-xs font-bold text-black mt-0.5">
              {formatBytes(savingsInfo.compressedSize)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Saved</div>
            <div className="text-xs font-bold text-black mt-0.5">
              -{savingsInfo.savingsPercent}%
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 bg-neutral-50/50 mb-6">
        <div className="flex items-center gap-3 min-w-0 pr-3">
          <div className="w-10 h-10 rounded border border-neutral-200 bg-white flex items-center justify-center flex-shrink-0">
            {getFileIcon()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-black truncate">
              {filename}
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              {formatBytes(filesize)} {detailsText && `• ${detailsText}`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-black hover:bg-neutral-800 text-white font-medium text-xs tracking-wide rounded-md transition-colors"
        >
          <Download className="w-4 h-4 text-white" />
          <span>{actionLabel || `Download ${filename}`}</span>
        </button>

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 py-3 px-4 border border-neutral-300 hover:border-black text-black font-medium text-xs rounded-md transition-colors bg-white"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Process Another</span>
        </button>
      </div>
    </div>
  );
};
