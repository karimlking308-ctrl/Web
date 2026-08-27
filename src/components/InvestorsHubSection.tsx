import React, { useState } from 'react';
import {
  Building2,
  Briefcase,
  ShieldCheck,
  Sparkles,
  Zap,
  Layers,
  Scale,
  FileText,
  Copy,
  Check,
  ArrowRight,
  Mail,
  Lock,
  Globe2,
  Terminal,
  Cpu,
  Coins,
  Share2,
} from 'lucide-react';
import { TelegramIcon } from './SocialLinks';

export const InvestorsHubSection: React.FC = () => {
  const [copiedCA, setCopiedCA] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [inquiryType, setInquiryType] = useState<'licensing' | 'vc' | 'partnership'>('partnership');

  const tokenCA = 'EQBMaQWsEnD2w2cJO9LjVGecg5Xhqw9RjTxPW7J4UenTlXnS';
  const contactEmail = 'contact@sol-pump.store';

  const handleCopyCA = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(tokenCA);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = tokenCA;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedCA(true);
      setTimeout(() => setCopiedCA(false), 2500);
    } catch (err) {
      console.error('Failed to copy CA:', err);
    }
  };

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(contactEmail);
      }
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <section
      id="investors-hub"
      className="relative py-20 md:py-28 bg-[#060910] text-slate-100 border-t border-slate-800/90 overflow-hidden"
    >
      {/* Background Ambience & Grid */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-cyan-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[500px] bg-purple-500/5 blur-[170px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Executive Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider mb-5 shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Institutional &amp; IP Briefing</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            sol-pump.store:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              Proprietary Developer &amp; Web3 Utility Ecosystem
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto font-light">
            Investor &amp; Intellectual Property Overview: A technical briefing on our decentralized micro-tooling architecture, multi-chain expansion (TON &amp; Solana), and enterprise IP licensing framework.
          </p>
        </div>

        {/* Executive Quick Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          <div className="p-5 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase mb-2">
              <Globe2 className="w-4 h-4" /> Multi-Chain
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">TON &amp; Solana</div>
            <p className="text-xs text-slate-400">High-throughput execution ecosystems</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase mb-2">
              <Cpu className="w-4 h-4" /> Architecture
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">Client-Side Engine</div>
            <p className="text-xs text-slate-400">Zero-latency, zero-leak privacy stack</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 hover:border-purple-500/30 transition-all">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-semibold uppercase mb-2">
              <Coins className="w-4 h-4" /> Ecosystem Token
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">$sopump</div>
            <p className="text-xs text-slate-400">TON Jetton utility &amp; governance</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 hover:border-teal-500/30 transition-all">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-mono font-semibold uppercase mb-2">
              <Scale className="w-4 h-4" /> IP &amp; Licensing
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">Modular SDK</div>
            <p className="text-xs text-slate-400">Turnkey enterprise integration</p>
          </div>
        </div>

        {/* 3 Core Pillar Deep-Dives */}
        <div className="space-y-12 mb-20">
          
          {/* 1. Vision & Core Innovation */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#090d18] border border-slate-800/90 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              <div className="lg:w-1/3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 shadow-inner">
                  <Zap className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Section 01</span>
                <h3 className="text-2xl font-bold text-white mt-1 mb-3">Vision &amp; Core Innovation</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  Bridging decentralized micro-utilities, automation pipelines, and high-velocity liquidity networks across TON and Solana.
                </p>
              </div>

              <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-[#0b101f] border border-slate-800/80">
                  <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    High-Velocity Web3 Micro-Tooling
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Rather than building heavy, slow-loading monolithic platforms, sol-pump.store provides ultra-lean, instantaneous browser-based developer utilities, cryptographic solvers, and token telemetry scanners.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0b101f] border border-slate-800/80">
                  <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    Cross-Chain Ecosystem Convergence
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Strategically leveraging Telegram's 900M+ user distribution via TON Jetton integration alongside Solana's sub-second transaction finality for trading automation workflows.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0b101f] border border-slate-800/80 sm:col-span-2">
                  <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Democratized Open-Access Model
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    By removing paywalls and login friction for standard utilities and open-source automation scripts, sol-pump.store drives organic developer adoption while capturing sustainable ecosystem value.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Proprietary Technology & UVP */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#090d18] border border-slate-800/90 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              <div className="lg:w-1/3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 shadow-inner">
                  <Layers className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Section 02</span>
                <h3 className="text-2xl font-bold text-white mt-1 mb-3">Proprietary Tech &amp; UVP</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  Key technological differentiators that isolate risk, eliminate custody liabilities, and integrate tokenized ecosystem value.
                </p>
              </div>

              <div className="lg:w-2/3 space-y-5">
                {/* Tech Feature 1 */}
                <div className="p-5 rounded-2xl bg-[#0b101f] border border-slate-800/80 flex flex-col sm:flex-row gap-4 items-start">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Zero-Friction Direct Backer Engine</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Non-custodial, permissionless grant support architecture that eliminates complex smart-contract vulnerabilities and wallet connection friction, featuring real-time generated multi-network QR scanning.
                    </p>
                  </div>
                </div>

                {/* Tech Feature 2 */}
                <div className="p-5 rounded-2xl bg-[#0b101f] border border-slate-800/80 flex flex-col sm:flex-row gap-4 items-start">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Autonomous Micro-Tooling Engine</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      100% client-side cryptographic hashing, Solana CU gas fee computations, and token metadata decoders executing entirely within the browser sandbox with zero external server dependencies.
                    </p>
                  </div>
                </div>

                {/* Tech Feature 3: $sopump Token Utility */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0c1626] border border-emerald-500/40">
                  <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      $sopump Ecosystem Token Utility Integration
                    </h4>
                    <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      TON Blockchain Jetton
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    The native community token underpinning platform governance, developer grant allocations, and prioritized feature unlocks across the sol-pump.store roadmap.
                  </p>

                  <div className="p-3 rounded-xl bg-slate-950/90 border border-emerald-500/30 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">Official Contract Address (CA):</div>
                      <div className="text-xs font-mono text-slate-200 truncate select-all">{tokenCA}</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyCA}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    >
                      {copiedCA ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied CA</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy CA</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Intellectual Property & Licensing Potential */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#090d18] border border-slate-800/90 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              <div className="lg:w-1/3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5 shadow-inner">
                  <Scale className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">Section 03</span>
                <h3 className="text-2xl font-bold text-white mt-1 mb-3">IP &amp; Licensing Framework</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  Modular asset catalog designed for strategic acquisition, enterprise white-labeling, and ecosystem syndication.
                </p>
              </div>

              <div className="lg:w-2/3 grid sm:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-[#0b101f] border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-3">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1.5">Modular SDK &amp; Widgets</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Embeddable React / TypeScript micro-tool modules (gas estimators, contract inspectors) ready for B2B portal integrations.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-purple-300">
                    White-Label Ready
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0b101f] border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-3">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1.5">Automation Blueprints</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Proprietary n8n workflows and Python liquidity sniper templates structured for enterprise automated execution.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-cyan-300">
                    Turnkey Workflows
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0b101f] border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1.5">Syndication Engine</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Monetization-compatible distribution pipelines capable of scaling traffic via programmatic SEO and Telegram channels.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-300">
                    High Growth Funnels
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Professional Call-to-Action (CTA) Portal */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-[#0c1424] via-[#090f1d] to-[#070b14] border border-cyan-500/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/15 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/15 blur-[100px] rounded-full pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Strategic Inquiries</span>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Initiate Partnership, Licensing, or VC Discussion
          </h3>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8 font-light">
            We welcome inquiries from venture funds, Web3 accelerators, institutional liquidity partners, and technology companies interested in IP licensing or co-development.
          </p>

          {/* Contact Methods */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
            {/* Direct Email Action */}
            <a
              href={`mailto:${contactEmail}?subject=Investor%20%26%20IP%20Inquiry%20-%20sol-pump.store`}
              className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-left transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase font-semibold">Institutional Email</div>
                  <div className="text-xs font-mono text-white font-bold truncate">{contactEmail}</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0" />
            </a>

            {/* Telegram Leadership Channel */}
            <a
              href="https://t.me/solpump_store"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-400 text-left transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <TelegramIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase font-semibold">Telegram Hub</div>
                  <div className="text-xs font-mono text-white font-bold">@solpump_store</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
            </a>
          </div>

          {/* Quick Copy Email Button */}
          <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
            <span>Direct Desk: <strong className="text-slate-200 font-mono">{contactEmail}</strong></span>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="p-1 px-2 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
