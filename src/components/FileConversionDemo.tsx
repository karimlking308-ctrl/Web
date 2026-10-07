import React, { useState, useEffect } from 'react';
import { ArrowRight, Film, Music, FileText, Image as ImageIcon, Minimize2 } from 'lucide-react';

interface ConversionDemo {
  fromLabel: string;
  fromExt: string;
  fromIcon: React.ReactNode;
  toLabel: string;
  toExt: string;
  toIcon: React.ReactNode;
  sampleName: string;
  badge: string;
}

const DEMOS: ConversionDemo[] = [
  {
    fromLabel: 'Video File',
    fromExt: 'MP4',
    fromIcon: <Film className="w-3.5 h-3.5" strokeWidth={1.8} />,
    toLabel: 'Audio Track',
    toExt: 'MP3',
    toIcon: <Music className="w-3.5 h-3.5" strokeWidth={1.8} />,
    sampleName: 'presentation-recording',
    badge: 'Audio Transcode',
  },
  {
    fromLabel: 'Vector Document',
    fromExt: 'PDF',
    fromIcon: <FileText className="w-3.5 h-3.5" strokeWidth={1.8} />,
    toLabel: 'Image Pages',
    toExt: 'JPG',
    toIcon: <ImageIcon className="w-3.5 h-3.5" strokeWidth={1.8} />,
    sampleName: 'quarterly-report',
    badge: 'Page Extraction',
  },
  {
    fromLabel: 'Camera Photos',
    fromExt: 'JPG',
    fromIcon: <ImageIcon className="w-3.5 h-3.5" strokeWidth={1.8} />,
    toLabel: 'Merged Document',
    toExt: 'PDF',
    toIcon: <FileText className="w-3.5 h-3.5" strokeWidth={1.8} />,
    sampleName: 'scanned-receipts',
    badge: 'Document Assembly',
  },
  {
    fromLabel: 'Original Photo (2.4 MB)',
    fromExt: 'IMG',
    fromIcon: <ImageIcon className="w-3.5 h-3.5" strokeWidth={1.8} />,
    toLabel: 'Compressed (540 KB)',
    toExt: '-77%',
    toIcon: <Minimize2 className="w-3.5 h-3.5" strokeWidth={1.8} />,
    sampleName: 'banner-highres',
    badge: 'Byte Optimization',
  },
];

export const FileConversionDemo: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % DEMOS.length);
        setIsFading(false);
      }, 300);
    }, 3800);

    return () => clearInterval(timer);
  }, []);

  const demo = DEMOS[currentIndex];

  return (
    <div className="w-full max-w-lg mx-auto sm:mx-0 select-none">
      <div className="border border-neutral-200 bg-white rounded-xl p-4 sm:p-5 transition-all">
        {/* Top meta indicator */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100 text-[11px]">
          <div className="flex items-center gap-1.5 font-mono text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
            <span>{demo.badge}</span>
          </div>
          <div className="flex gap-1">
            {DEMOS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsFading(true);
                  setTimeout(() => {
                    setCurrentIndex(i);
                    setIsFading(false);
                  }, 150);
                }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-5 bg-black' : 'w-2 bg-neutral-200 hover:bg-neutral-400'
                }`}
                aria-label={`Demo item ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Animated conversion stream */}
        <div
          className={`flex items-center justify-between gap-3 sm:gap-4 transition-opacity duration-300 ${
            isFading ? 'opacity-20' : 'opacity-100'
          }`}
        >
          {/* Source node */}
          <div className="flex-1 p-3 rounded-lg border border-neutral-200 bg-neutral-50/60 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded border border-neutral-200 bg-white flex items-center justify-center text-black flex-shrink-0">
                {demo.fromIcon}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-black font-semibold">
                {demo.fromExt}
              </span>
            </div>
            <p className="text-xs font-medium text-black truncate">
              {demo.sampleName}.{demo.fromExt.toLowerCase()}
            </p>
            <p className="text-[10px] text-neutral-400 truncate mt-0.5">
              {demo.fromLabel}
            </p>
          </div>

          {/* Animated middle transform arrow */}
          <div className="flex flex-col items-center justify-center flex-shrink-0 px-1">
            <div className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-black bg-white shadow-xs">
              <ArrowRight className="w-3.5 h-3.5 text-black animate-pulse" />
            </div>
          </div>

          {/* Destination node */}
          <div className="flex-1 p-3 rounded-lg border border-black bg-white min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded bg-black flex items-center justify-center text-white flex-shrink-0">
                {demo.toIcon}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-black font-semibold">
                {demo.toExt}
              </span>
            </div>
            <p className="text-xs font-medium text-black truncate">
              {demo.sampleName}.{demo.toExt.startsWith('-') ? 'jpg' : demo.toExt.toLowerCase()}
            </p>
            <p className="text-[10px] text-neutral-500 truncate mt-0.5">
              {demo.toLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
