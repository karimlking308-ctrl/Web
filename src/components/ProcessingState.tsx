import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingStateProps {
  title?: string;
  message?: string;
  percent?: number;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({
  title = 'Processing...',
  message = 'Please wait while your file is being processed.',
  percent,
}) => {
  return (
    <div className="w-full bg-white border border-neutral-200 rounded-xl p-10 sm:p-14 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-lg border border-neutral-200 flex items-center justify-center mb-5 text-black">
        <Loader2 className="w-5 h-5 animate-spin text-black" />
      </div>

      <h3 className="text-base font-bold text-black mb-1">
        {title}
      </h3>

      <p className="text-xs text-neutral-500 max-w-sm mb-6 leading-relaxed">
        {message}
      </p>

      {typeof percent === 'number' && (
        <div className="w-full max-w-xs">
          <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-black h-1.5 rounded-full transition-all duration-150"
              style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-mono text-neutral-500 mt-2">
            <span>Progress</span>
            <span>{Math.round(percent)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
