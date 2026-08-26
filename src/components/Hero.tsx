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
    <section id="home" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none" />
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

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
