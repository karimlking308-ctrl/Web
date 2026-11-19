import React from 'react';
import { ShieldCheck, WifiOff, Award, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onNavigateHome: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateHome }) => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section - Same style as Blog page */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-[11px] font-mono text-neutral-600 mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-black" />
          <span>100% Private &middot; Built in Fes, Morocco</span>
        </div>

        <h1 className="font-['Playfair_Display',Georgia,serif] text-3xl sm:text-4xl font-bold tracking-tight text-black leading-tight mb-2">
          About Tindry
        </h1>

        <p className="text-base sm:text-lg font-medium text-neutral-700 mb-5">
          Built in Fes, Morocco. Used everywhere.
        </p>

        <div className="p-6 rounded-xl border border-neutral-200 bg-white max-w-3xl">
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
            Tindry was built by Abdo from Fes, Morocco. I was tired of tools that ask you to upload your private files to unknown servers. So I built tools that run 100% in your browser. Zero uploads. Zero tracking. No account. No watermark.
          </p>
        </div>
      </div>

      {/* 3 Pillars Grid - Matching existing Blog / Homepage cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        <div className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-['Playfair_Display',Georgia,serif] text-lg font-bold text-black mb-2">
              100% Private
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Your files never leave your device. Every conversion happens locally inside your browser with zero uploads and zero tracking.
            </p>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mb-4">
              <WifiOff className="w-5 h-5" />
            </div>
            <h2 className="font-['Playfair_Display',Georgia,serif] text-lg font-bold text-black mb-2">
              Works Offline
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Powered directly by your browser engine so tools continue working smoothly even without an active internet connection.
            </p>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="font-['Playfair_Display',Georgia,serif] text-lg font-bold text-black mb-2">
              Free Forever
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              No sign-up walls, no subscriptions, no daily caps, and no watermarks added to your exported documents or media.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Action */}
      <div className="pt-6 border-t border-neutral-200 flex items-center justify-center sm:justify-start">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome();
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white text-sm font-bold transition-colors"
        >
          <span>Try the tools</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
