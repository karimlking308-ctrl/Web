import React from 'react';
import { ArrowRight, Sparkles, Terminal, ShieldCheck, Zap, Send, Copy, Check, CheckCircle2 } from 'lucide-react';
import { HeroInteractiveCanvas } from './HeroInteractiveCanvas';

interface HeroProps {
  onExploreTools: () => void;
  onOpenStore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreTools }) => {
  const [copied, setCopied] = React.useState(false);

  const sampleSnippet = `// SolPump Store 100% Open Access Resource Hub
import { downloadOpenVaultPackage } from '@solpump/open-hub';

// 1-Click Instant Direct Download - No Paywalls or License Keys Required
await downloadOpenVaultPackage({
  packageId: 'master-creator-bundle',
  format: 'ZIP',
  accessLevel: '100% FREE COMMUNITY ACCESS',
});`;

  const copyCode = () => {
    navigator.clipboard.writeText(sampleSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="home" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-[#03070d]">
      {/* Deep Dark-Teal Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030a10] via-[#04151e] to-[#03070d] pointer-events-none" />
      
      {/* High-Performance 60FPS Interactive Neural / Blockchain Ledger Canvas */}
      <HeroInteractiveCanvas />

      {/* Layered Subtle PCB Circuit Board Traces Behind Network */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center">
        <svg
          className="w-full h-full min-w-[1000px] min-h-[650px] opacity-40 object-cover select-none"
          viewBox="0 0 1440 850"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="trace-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="trace-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Glowing Digital Circuit Board Traces - Left Side */}
          <g opacity="0.6" stroke="url(#trace-grad-1)" strokeWidth="1.2" fill="none">
            <path d="M 40 180 L 220 180 L 280 240 L 440 240 L 490 290 L 580 290" />
            <circle cx="40" cy="180" r="3" fill="#14b8a6" />
            <circle cx="280" cy="240" r="2.5" fill="#06b6d4" />
            <circle cx="580" cy="290" r="4" fill="#34d399" />

            <path d="M 80 320 L 200 320 L 260 380 L 390 380 L 450 440 L 540 440" stroke="url(#trace-grad-2)" />
            <circle cx="80" cy="320" r="2.5" fill="#06b6d4" />
            <circle cx="260" cy="380" r="3" fill="#14b8a6" />
            <circle cx="540" cy="440" r="3.5" fill="#22d3ee" />

            <path d="M 120 490 L 240 490 L 300 430 L 420 430 L 480 370 L 560 370" />
            <circle cx="120" cy="490" r="3" fill="#10b981" />
            <circle cx="420" cy="430" r="2.5" fill="#14b8a6" />
          </g>

          {/* Glowing Digital Circuit Board Traces - Right Side */}
          <g opacity="0.6" stroke="url(#trace-grad-2)" strokeWidth="1.2" fill="none">
            <path d="M 1400 200 L 1220 200 L 1160 260 L 1000 260 L 950 310 L 860 310" />
            <circle cx="1400" cy="200" r="3" fill="#3b82f6" />
            <circle cx="1160" cy="260" r="2.5" fill="#06b6d4" />
            <circle cx="860" cy="310" r="4" fill="#34d399" />

            <path d="M 1360 360 L 1240 360 L 1180 420 L 1050 420 L 990 470 L 900 470" stroke="url(#trace-grad-1)" />
            <circle cx="1360" cy="360" r="2.5" fill="#06b6d4" />
            <circle cx="1180" cy="420" r="3" fill="#14b8a6" />
            <circle cx="900" cy="470" r="3.5" fill="#10b981" />

            <path d="M 1320 520 L 1200 520 L 1140 460 L 1020 460 L 960 400 L 880 400" />
            <circle cx="1320" cy="520" r="3" fill="#2dd4bf" />
            <circle cx="1020" cy="460" r="2.5" fill="#06b6d4" />
          </g>
        </svg>
      </div>

      {/* Radial Vignette & Contrast Shading to ensure complete foreground legibility */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,#03070d_88%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03070d] via-transparent to-[#03070d]/50 pointer-events-none z-0" />

      {/* Background Grid Pattern Overlay with soft opacity */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d94880a_1px,transparent_1px),linear-gradient(to_bottom,#0d94880a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs text-slate-300 mb-6 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-medium text-emerald-300">100% Free &amp; Open Access Resource Hub</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono-code text-emerald-400 text-[11px]">sol-pump.store</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">AI Utilities</span> &amp; Free Open-Source Developer Tools
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10">
            Accelerate your engineering and creative workflows with production-grade n8n AI agent workflows, executable Python/Node.js/Rust scripts, and 1,500+ curated prompt vaults — 100% free with 1-click access.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14">
            <button
              onClick={onExploreTools}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-[#080b12] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all duration-150 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#080b12]" />
              <span>Open Vault (1-Click Downloads)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://t.me/solpump_store"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer"
            >
              <Send className="w-4 h-4 text-cyan-400" />
              <span>Join Telegram Community</span>
            </a>
          </div>

          {/* Key Value Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 border-t border-slate-800/60 text-left">
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/30 border border-slate-800/50">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-slate-200">100% Free</p>
                <p className="text-[11px] text-slate-400">Zero subscriptions</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/30 border border-slate-800/50">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-slate-200">Zero Locks</p>
                <p className="text-[11px] text-slate-400">1-click ZIP downloads</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/30 border border-slate-800/50">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-slate-200">Open Source</p>
                <p className="text-[11px] text-slate-400">n8n, Python &amp; Rust</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/30 border border-slate-800/50">
              <Terminal className="w-4 h-4 text-teal-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-slate-200">Dev Community</p>
                <p className="text-[11px] text-slate-400">Active Telegram hub</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Interactive Code Preview Box */}
        <div className="mt-14 max-w-3xl mx-auto">
          <div className="rounded-2xl bg-[#0d121f] border border-slate-800 shadow-2xl shadow-black/80 overflow-hidden text-left">
            {/* Terminal Window Header */}
            <div className="px-4 py-3 bg-[#0a0e18] border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono-code text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  solpump-store-open-hub.ts
                </span>
              </div>

              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] font-mono-code text-slate-300 transition-colors cursor-pointer"
                title="Copy snippet"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Terminal Content */}
            <div className="p-5 font-mono-code text-xs text-slate-300 overflow-x-auto leading-relaxed">
              <pre className="text-slate-300">
                <span className="text-slate-500">// SolPump Store 100% Open Access Resource Hub</span>{'\n'}
                <span className="text-indigo-400">import</span> {'{ downloadOpenVaultPackage }'} <span className="text-indigo-400">from</span> <span className="text-emerald-400">'@solpump/open-hub'</span>;{'\n\n'}
                <span className="text-indigo-400">await</span> <span className="text-blue-400">downloadOpenVaultPackage</span>({'{'}{'\n'}
                {'  '}packageId: <span className="text-emerald-400">'master-creator-bundle'</span>,{'\n'}
                {'  '}format: <span className="text-emerald-400">'ZIP'</span>,{'\n'}
                {'  '}accessLevel: <span className="text-emerald-400">'100% FREE COMMUNITY ACCESS'</span>,{'\n'}
                {'}'});
              </pre>
            </div>

            {/* Status Footer */}
            <div className="px-4 py-2.5 bg-[#080b13] border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono-code text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Access Level: 100% Unlocked (0ms)
              </span>
              <span className="text-slate-500">sol-pump.store open hub</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
