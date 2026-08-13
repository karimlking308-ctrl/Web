import React from 'react';
import { AdSlotProps } from '../../types';

export const AdSlot: React.FC<AdSlotProps> = ({
  variant,
  className = '',
  id,
}) => {
  let containerStyles = 'w-full my-4 border border-dashed border-slate-300 bg-slate-50/80 rounded-xl flex flex-col items-center justify-center text-center transition-colors';
  let sizeStyles = 'min-h-[100px] p-4';
  let labelText = 'Advertisement';
  let subText = 'Sponsor space reserved for Phase 6';

  switch (variant) {
    case 'banner':
      sizeStyles = 'min-h-[90px] md:min-h-[110px] max-w-5xl mx-auto p-3';
      subText = 'Leaderboard placement (728x90 / 970x90 ready)';
      break;
    case 'sidebar':
      sizeStyles = 'min-h-[250px] md:min-h-[300px] w-full p-4';
      subText = 'Sidebar Medium Rectangle (300x250 / 300x600 ready)';
      break;
    case 'inline':
      sizeStyles = 'min-h-[120px] p-4 my-6';
      subText = 'In-article native sponsored placement';
      break;
    case 'native':
      sizeStyles = 'min-h-[160px] p-4';
      subText = 'Editorial native recommendation slot';
      break;
  }

  return (
    <aside
      id={id || `ad-slot-${variant}`}
      aria-label="Advertisement Placeholder"
      className={`${containerStyles} ${sizeStyles} ${className}`}
    >
      <div className="flex flex-col items-center justify-center gap-1">
        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold px-2 py-0.5 rounded bg-white border border-slate-200 shadow-xs">
          {labelText}
        </span>
        <p className="text-xs text-slate-500 font-mono mt-1">
          {subText}
        </p>
      </div>
    </aside>
  );
};
