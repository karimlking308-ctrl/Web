import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

interface AdNativeBannerProps {
  className?: string;
}

export const AdNativeBanner: React.FC<AdNativeBannerProps> = ({ className = '' }) => {
  const { lang } = useApp();
  const isAr = lang === 'ar';
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if script has already been injected in this container
    const existingScript = containerRef.current.querySelector('script');
    if (existingScript) return;

    try {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl30820511.effectivecpmnetwork.com/7d1b21c3290c5c6928aafb76977bb062/invoke.js';
      containerRef.current.appendChild(script);
    } catch {
      // Graceful fallback if DOM append fails
    }
  }, []);

  return (
    <div className={`w-full max-w-5xl mx-auto my-6 ${className}`}>
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 text-center mb-1.5 select-none">
        {isAr ? 'إعلان مُموّل' : 'Advertisement'}
      </div>
      <div
        ref={containerRef}
        className="min-h-[90px] w-full flex items-center justify-center bg-slate-50/60 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-2 sm:p-4 overflow-hidden"
      >
        <div id="container-7d1b21c3290c5c6928aafb76977bb062" className="w-full text-center" />
      </div>
    </div>
  );
};
