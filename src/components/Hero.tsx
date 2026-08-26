import React from 'react';
import { ArrowRight, Sparkles, Terminal, ShieldCheck, Zap, Layers, Copy, Check } from 'lucide-react';

interface HeroProps {
  onExploreTools: () => void;
  onOpenStore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreTools, onOpenStore }) => {
  const [copied, setCopied] = React.useState(false);

  const sampleSnippet = `// SolPump Store AI Agent Blueprint
import { createAgentRunner } from '@solpump/ai-core';

const agent = createAgentRunner({
  model: 'gemini-2.5-flash',
  capabilities: ['web3_decode', 'prompt_optimize'],
  securityLevel: 'zero_retention',
});

await agent.execute('Analyze Solana program log & generate types');`;

  const copyCode = () => {
    navigator.clipboard.writeText(sampleSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="home" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-[#03070d]">
      {/* Deep Dark-Teal Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030a10] via-[#04151e] to-[#03070d] pointer-events-none" />
      
      {/* High-Tech Glowing Network Sphere & Circuit Traces SVG */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center">
        <svg
          className="w-full h-full min-w-[1000px] min-h-[650px] opacity-75 object-cover select-none"
          viewBox="0 0 1440 850"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Core Glow Filter */}
            <filter id="hero-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="16" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Deep Soft Blur for Sphere Core */}
            <filter id="deep-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="60" />
            </filter>

            <filter id="soft-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" />
            </filter>

            {/* Radial Gradients */}
            <radialGradient id="sphere-core-grad" cx="50%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.35" />
              <stop offset="45%" stopColor="#083344" stopOpacity="0.25" />
              <stop offset="85%" stopColor="#03070d" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="pulse-node-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="1" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="trace-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="trace-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="bus-stream-grad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#042f2e" stopOpacity="0" />
              <stop offset="30%" stopColor="#0d9488" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#2dd4bf" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#042f2e" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Large Soft-Focused Abstract Network Sphere Backdrop */}
          <circle cx="720" cy="360" r="280" fill="url(#sphere-core-grad)" filter="url(#deep-blur)" />
          <circle cx="720" cy="360" r="180" fill="#042f2e" fillOpacity="0.4" filter="url(#deep-blur)" />
          <circle cx="560" cy="280" r="120" fill="#0891b2" fillOpacity="0.18" filter="url(#deep-blur)" />
          <circle cx="880" cy="400" r="140" fill="#059669" fillOpacity="0.16" filter="url(#deep-blur)" />

          {/* Network Sphere Orbits, Latitude/Longitude Rings & Intersecting Arcs */}
          <g opacity="0.4" stroke="url(#trace-grad-1)" strokeWidth="1">
            {/* Concentric / Tilted Elliptical Network Shells */}
            <ellipse cx="720" cy="360" rx="340" ry="140" strokeDasharray="8 6" transform="rotate(-15 720 360)" />
            <ellipse cx="720" cy="360" rx="320" ry="160" strokeDasharray="4 4" transform="rotate(25 720 360)" stroke="url(#trace-grad-2)" />
            <ellipse cx="720" cy="360" rx="260" ry="260" strokeDasharray="2 6" strokeOpacity="0.6" />
            <ellipse cx="720" cy="360" rx="220" ry="90" transform="rotate(-40 720 360)" strokeOpacity="0.5" />
            <ellipse cx="720" cy="360" rx="180" ry="180" strokeOpacity="0.3" />
            
            {/* Sphere Wireframe Matrix Curves */}
            <path d="M 460 360 Q 720 200 980 360" stroke="url(#trace-grad-1)" strokeWidth="1.5" fill="none" />
            <path d="M 460 360 Q 720 520 980 360" stroke="url(#trace-grad-1)" strokeWidth="1.5" fill="none" />
            <path d="M 720 100 Q 560 360 720 620" stroke="url(#trace-grad-2)" strokeWidth="1.2" fill="none" />
            <path d="M 720 100 Q 880 360 720 620" stroke="url(#trace-grad-2)" strokeWidth="1.2" fill="none" />
            <path d="M 520 220 C 620 280, 820 440, 920 500" stroke="#0d9488" strokeWidth="1" strokeDasharray="6 4" fill="none" strokeOpacity="0.6" />
            <path d="M 520 500 C 640 420, 800 300, 920 220" stroke="#06b6d4" strokeWidth="1" strokeDasharray="6 4" fill="none" strokeOpacity="0.6" />
          </g>

          {/* Glowing Digital Circuit Board Traces - Left Side */}
          <g opacity="0.55" stroke="url(#trace-grad-1)" strokeWidth="1.5" fill="none">
            {/* Trace 1 */}
            <path d="M 40 180 L 220 180 L 280 240 L 440 240 L 490 290 L 580 290" />
            <circle cx="40" cy="180" r="3" fill="#14b8a6" />
            <circle cx="280" cy="240" r="2.5" fill="#06b6d4" />
            <circle cx="580" cy="290" r="4" fill="#34d399" filter="url(#soft-glow)" />

            {/* Trace 2 */}
            <path d="M 80 320 L 200 320 L 260 380 L 390 380 L 450 440 L 540 440" stroke="url(#trace-grad-2)" />
            <circle cx="80" cy="320" r="2.5" fill="#06b6d4" />
            <circle cx="260" cy="380" r="3" fill="#14b8a6" />
            <circle cx="540" cy="440" r="3.5" fill="#22d3ee" />

            {/* Trace 3 */}
            <path d="M 120 490 L 240 490 L 300 430 L 420 430 L 480 370 L 560 370" />
            <circle cx="120" cy="490" r="3" fill="#10b981" />
            <circle cx="420" cy="430" r="2.5" fill="#14b8a6" />

            {/* Bus Branching Vias */}
            <path d="M 220 180 L 220 130 L 310 130" strokeDasharray="3 3" strokeOpacity="0.4" />
            <circle cx="310" cy="130" r="2" fill="#06b6d4" />
            <path d="M 390 380 L 390 480 L 460 480" strokeDasharray="3 3" strokeOpacity="0.4" />
            <circle cx="460" cy="480" r="2" fill="#34d399" />
          </g>

          {/* Glowing Digital Circuit Board Traces - Right Side */}
          <g opacity="0.55" stroke="url(#trace-grad-2)" strokeWidth="1.5" fill="none">
            {/* Trace 4 */}
            <path d="M 1400 200 L 1220 200 L 1160 260 L 1000 260 L 950 310 L 860 310" />
            <circle cx="1400" cy="200" r="3" fill="#3b82f6" />
            <circle cx="1160" cy="260" r="2.5" fill="#06b6d4" />
            <circle cx="860" cy="310" r="4" fill="#34d399" filter="url(#soft-glow)" />

            {/* Trace 5 */}
            <path d="M 1360 360 L 1240 360 L 1180 420 L 1050 420 L 990 470 L 900 470" stroke="url(#trace-grad-1)" />
            <circle cx="1360" cy="360" r="2.5" fill="#06b6d4" />
            <circle cx="1180" cy="420" r="3" fill="#14b8a6" />
            <circle cx="900" cy="470" r="3.5" fill="#10b981" />

            {/* Trace 6 */}
            <path d="M 1320 520 L 1200 520 L 1140 460 L 1020 460 L 960 400 L 880 400" />
            <circle cx="1320" cy="520" r="3" fill="#2dd4bf" />
            <circle cx="1020" cy="460" r="2.5" fill="#06b6d4" />

            {/* Bus Branching Vias */}
            <path d="M 1220 200 L 1220 140 L 1130 140" strokeDasharray="3 3" strokeOpacity="0.4" />
            <circle cx="1130" cy="140" r="2" fill="#34d399" />
            <path d="M 1050 420 L 1050 510 L 980 510" strokeDasharray="3 3" strokeOpacity="0.4" />
            <circle cx="980" cy="510" r="2" fill="#06b6d4" />
          </g>

          {/* Luminous Node Constellation & Data Stream Points */}
          <g filter="url(#hero-glow)">
            {/* Center Core Nodes */}
            <circle cx="720" cy="360" r="5" fill="#34d399" />
            <circle cx="640" cy="310" r="4" fill="#22d3ee" />
            <circle cx="800" cy="410" r="4" fill="#2dd4bf" />
            <circle cx="780" cy="280" r="3.5" fill="#38bdf8" />
            <circle cx="660" cy="440" r="3.5" fill="#34d399" />
            <circle cx="580" cy="360" r="4" fill="#06b6d4" />
            <circle cx="860" cy="360" r="4" fill="#10b981" />

            {/* Floating Data Pulses */}
            <circle cx="510" cy="240" r="3" fill="#67e8f9" />
            <circle cx="930" cy="480" r="3" fill="#a7f3d0" />
            <circle cx="720" cy="190" r="3.5" fill="#34d399" />
            <circle cx="720" cy="530" r="3.5" fill="#22d3ee" />
          </g>

          {/* Micro Data Stream Dashes */}
          <line x1="420" y1="360" x2="1020" y2="360" stroke="url(#bus-stream-grad)" strokeWidth="1" strokeDasharray="12 18" opacity="0.4" />
          <line x1="520" y1="260" x2="920" y2="460" stroke="url(#bus-stream-grad)" strokeWidth="1" strokeDasharray="10 14" opacity="0.3" />
        </svg>
      </div>

      {/* Radial Vignette & Contrast Shading to ensure total legibility */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#03070d_85%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03070d] via-transparent to-[#03070d]/60 pointer-events-none z-0" />

      {/* Background Grid Pattern Overlay with soft opacity */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d94880a_1px,transparent_1px),linear-gradient(to_bottom,#0d94880a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mb-6 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-medium">The Official Digital Creator Hub</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono-code text-emerald-400 text-[11px]">sol-pump.store</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">AI Utilities</span> &amp; Modern Digital Creator Tools
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Accelerate your engineering and creative workflows with production-grade AI prompt vaults, verified developer micro-utilities, and high-performance Web3 solutions.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14">
            <button
              onClick={onExploreTools}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-[#080b12] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all duration-150 cursor-pointer"
            >
              <span>Explore Tools &amp; Vaults</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenStore}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 active:scale-[0.98] text-slate-200 hover:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Browse Digital Store</span>
            </button>
          </div>

          {/* Key Value Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 border-t border-slate-800/60 text-left">
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/30">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-slate-200">Zero Latency</p>
                <p className="text-[11px] text-slate-400">Instant browser tools</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/30">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-slate-200">100% Private</p>
                <p className="text-[11px] text-slate-400">Zero data retention</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/30">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-slate-200">Verified Prompts</p>
                <p className="text-[11px] text-slate-400">Tested across models</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/30">
              <Terminal className="w-4 h-4 text-teal-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-slate-200">Web3 Ready</p>
                <p className="text-[11px] text-slate-400">Solana &amp; EVM tooling</p>
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
                  solpump-store-runtime.ts
                </span>
              </div>

              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] font-mono-code text-slate-300 transition-colors"
                title="Copy snippet"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Terminal Content */}
            <div className="p-5 font-mono-code text-xs text-slate-300 overflow-x-auto leading-relaxed">
              <pre className="text-slate-300">
                <span className="text-slate-500">// SolPump Store AI Agent Blueprint</span>{'\n'}
                <span className="text-indigo-400">import</span> {'{ createAgentRunner }'} <span className="text-indigo-400">from</span> <span className="text-emerald-400">'@solpump/ai-core'</span>;{'\n\n'}
                <span className="text-indigo-400">const</span> agent = <span className="text-blue-400">createAgentRunner</span>({'{'}{'\n'}
                {'  '}model: <span className="text-emerald-400">'gemini-2.5-flash'</span>,{'\n'}
                {'  '}capabilities: [<span className="text-emerald-400">'web3_decode'</span>, <span className="text-emerald-400">'prompt_optimize'</span>],{'\n'}
                {'  '}securityLevel: <span className="text-emerald-400">'zero_retention'</span>,{'\n'}
                {'}'});{'\n\n'}
                <span className="text-indigo-400">await</span> agent.<span className="text-blue-400">execute</span>(<span className="text-emerald-400">'Analyze Solana program log & generate types'</span>);
              </pre>
            </div>

            {/* Status Footer */}
            <div className="px-4 py-2.5 bg-[#080b13] border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono-code text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Execution Status: OK (12ms)
              </span>
              <span className="text-slate-500">sol-pump.store core engine</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
