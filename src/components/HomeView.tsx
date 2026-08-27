import React from 'react';
import { Hero } from './Hero';
import { TokenStatsTicker } from './TokenStatsTicker';
import { FeatureGrid } from './FeatureGrid';
import {
  ArrowRight,
  Terminal,
  Wrench,
  Sparkles,
  Zap,
  FolderArchive,
  BookOpen,
  ShieldCheck,
  Coins,
  Building2,
  Code2,
  Lock,
  Layers,
  CheckCircle2,
  Cpu,
  ArrowUpRight,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (sectionId: string) => void;
  onOpenLogin: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const handleSelectCategoryFromGrid = (categoryType: 'ai' | 'dev' | 'web3') => {
    onNavigate('utility-tools');
  };

  const portalCards = [
    {
      id: 'developer-scripts',
      icon: <Terminal className="w-5 h-5 text-emerald-400" />,
      badge: 'Open Source Python/Node/Rust',
      badgeColor: 'emerald',
      title: 'Developer Scripts Vault',
      description:
        'Battle-tested automation scripts for Solana bulk airdrops, Jito MEV frontrunning protection, Telegram broadcast engines, and AI content batching.',
      features: ['Solana Airdrop Engine', 'Jito MEV Sniper', 'Telegram Clicker Bot', 'Instant Source Copy'],
      actionText: 'Enter Scripts Vault',
      borderHover: 'hover:border-emerald-500/50',
    },
    {
      id: 'utility-tools',
      icon: <Wrench className="w-5 h-5 text-indigo-400" />,
      badge: 'Interactive Micro-Tools',
      badgeColor: 'indigo',
      title: 'Interactive Web3 & AI Tools',
      description:
        'Client-side developer utilities designed for instant API payload formatting, AI agent prompt optimization, secret key obfuscation, and SPL token inspection.',
      features: ['AI Prompt Optimizer', 'JSON Payload Formatter', 'Key Obfuscator', 'SPL Inspector'],
      actionText: 'Explore Micro-Tools',
      borderHover: 'hover:border-indigo-500/50',
    },
    {
      id: 'gas-calculator',
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      badge: 'Live Solana Estimator',
      badgeColor: 'cyan',
      title: 'Solana Gas & Priority Fee Suite',
      description:
        'Real-time compute unit pricing, priority fee multiplier, and lamport-to-USD calculator. Guarantee high-speed transaction landing during network congestion.',
      features: ['Real-time CU Pricing', 'Priority Multipliers', 'Lamport to USD', 'Dynamic Sliders'],
      actionText: 'Launch Fee Calculator',
      borderHover: 'hover:border-cyan-500/50',
    },
    {
      id: 'vault',
      icon: <FolderArchive className="w-5 h-5 text-purple-400" />,
      badge: '100% Free ZIP Downloads',
      badgeColor: 'purple',
      title: 'VIP Digital Asset Vault',
      description:
        'Instant 1-click client-side ZIP bundle generators for n8n AI agent workflows, WhatsApp lead bots, Telegram mini-apps, and 1,500+ master system prompts.',
      features: ['n8n AI Workflows', 'Telegram Mini-Apps', 'Prompt Databases', 'SHA-256 Verified'],
      actionText: 'Open Digital Vault',
      borderHover: 'hover:border-purple-500/50',
    },
    {
      id: 'store',
      icon: <Cpu className="w-5 h-5 text-amber-400" />,
      badge: 'Lifetime Licenses',
      badgeColor: 'amber',
      title: 'Pro & Enterprise Store',
      description:
        'Transparent lifetime licensing with decentralized multi-crypto checkout in TON, SOL, or $sopump token. Includes automated TxID bot verification & key dispenser.',
      features: ['Pro License ($49)', 'Enterprise IP ($299)', 'Multi-Crypto Web3', 'Automated Dispenser'],
      actionText: 'View Licensing Plans',
      borderHover: 'hover:border-amber-500/50',
    },
    {
      id: 'dev-docs',
      icon: <BookOpen className="w-5 h-5 text-cyan-400" />,
      badge: 'Interactive REST API',
      badgeColor: 'cyan',
      title: 'Developer Docs & API Hub',
      description:
        'Live interactive REST endpoints (GET /api/v1/tools, GET /api/v1/token/sopump, GET /api/v1/rates/solana, POST /api/v1/license/verify) and client SDK reference.',
      features: ['Interactive API Console', 'cURL Code Generator', 'TypeScript/Python SDKs', 'Microservices Spec'],
      actionText: 'Open Docs & API Hub',
      borderHover: 'hover:border-cyan-500/50',
    },
    {
      id: 'backers-hub',
      icon: <Coins className="w-5 h-5 text-emerald-400" />,
      badge: 'TON Mainnet Jetton',
      badgeColor: 'emerald',
      title: 'Backers & $sopump Token Hub',
      description:
        'Explore the verified TON Jetton contract (TEP-74), DeDust DEX liquidity pool reserves, staking rewards, and backer governance privileges.',
      features: ['Verified TEP-74 Jetton', 'DeDust DEX Pools', 'Staking Rewards', 'Backer Desk'],
      actionText: 'Explore Token Hub',
      borderHover: 'hover:border-emerald-500/50',
    },
    {
      id: 'investors-hub',
      icon: <Building2 className="w-5 h-5 text-purple-400" />,
      badge: 'Institutional IP Asset',
      badgeColor: 'purple',
      title: 'Investors & IP Acquisition',
      description:
        'Institutional IP licensing, proprietary codebase valuation, modular infrastructure portfolio, and direct strategic partnership contact desk.',
      features: ['Codebase IP Valuation', 'Full Commercial Rights', 'Modular Tech Stack', 'Institutional Inquiries'],
      actionText: 'View Investor Hub',
      borderHover: 'hover:border-purple-500/50',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#080b12] animate-in fade-in duration-300">
      {/* 1. Hero Section */}
      <Hero
        onExploreTools={() => onNavigate('vault')}
        onOpenStore={() => onNavigate('store')}
      />

      {/* 2. Live Token & Market Stats Ticker ($sopump • TON Network) */}
      <TokenStatsTicker />

      {/* 3. The 3 Core Architectural Pillars */}
      <FeatureGrid onSelectCategory={handleSelectCategoryFromGrid} />

      {/* 4. Dedicated Standalone Workspaces & Hub Portals */}
      <section className="py-16 bg-[#060913] border-t border-b border-slate-800/80 relative">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-500/5 via-purple-500/5 to-transparent blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dedicated Standalone Workspaces</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Modular Developer Ecosystem
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Each hub is an isolated, high-performance workspace designed for speed, clarity, and zero-clutter execution. Select any portal below to enter.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                8 Standalone Views Available
              </span>
              <button
                type="button"
                onClick={() => onNavigate('developer-scripts')}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#080b12] text-xs font-mono font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Browse All Scripts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Grid of Dedicated Workspace Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {portalCards.map((card) => (
              <div
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className={`p-6 rounded-3xl bg-[#0b0f1a]/80 hover:bg-[#0e1424] border border-slate-800/90 ${card.borderHover} transition-all duration-200 cursor-pointer group flex flex-col justify-between shadow-lg shadow-black/40 relative overflow-hidden`}
              >
                {/* Top Corner Glow on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {card.icon}
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                    {card.description}
                  </p>

                  {/* Bullet Feature highlights */}
                  <div className="space-y-1.5 mb-6">
                    {card.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1.5">
                    <span>{card.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trust & Open Source Commitment Banner */}
      <section className="py-14 bg-[#080b12] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0b1020] via-[#0d1428] to-[#0b1020] border border-slate-800/80 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Audited &amp; Non-Custodial Architecture</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                100% Client-Side Execution &amp; MIT Licensed
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                All micro-tools run entirely in your local browser sandbox. Private keys, prompt payloads, and secrets never touch external servers or third-party databases.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('trust-legal-hub')}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Inspect Audit &amp; Legal Hub</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('dev-docs')}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-[#080b12] text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Code2 className="w-4 h-4" />
                <span>View API Documentation</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
