import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Zap,
  Check,
  Send,
  Workflow,
  Download,
  FolderArchive,
  Code2,
} from 'lucide-react';
import { generateMasterBundleZIP } from '../utils/assetGenerators';

interface PricingSectionProps {
  onSelectPlan?: (plan: any) => void;
  onExploreFree: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onExploreFree }) => {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownloadAll = async () => {
    setDownloading(true);
    try {
      await generateMasterBundleZIP('SOLPUMP-FREE-OPEN-ACCESS');
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const featurePillars = [
    {
      id: 'vault-hub',
      title: 'Digital Asset & Workflow Vault',
      price: '$0',
      period: 'Free Open Access',
      badge: '100% Free',
      tagline: 'Ready-to-Deploy Codebases & Workflows',
      description: 'Instant 1-click downloads for all n8n AI agent workflows, Telegram Mini-Apps, WhatsApp AI lead gens, and Solana sniper bot source codes.',
      icon: FolderArchive,
      color: 'emerald',
      features: [
        'Telegram Mini-App & TON Clicker Game (React 19)',
        'WhatsApp AI Auto-Responder System (Node + n8n)',
        'Solana Token Sniper & Launch Bot Kit (Jito MEV)',
        'Advanced n8n AI Workflows (Content & CRM)',
        'Solana Telegram Buy-Bot Source Code',
        'Webhook & API Microservice Boilerplates',
        'All 1,500+ Curated Prompt Vaults (JSON/MD)',
        'React 19 + Tailwind CSS SaaS Starter',
        'Solana Anchor 0.30 Smart Contract Kits',
      ],
      ctaText: 'Download Digital Vault (.ZIP)',
      ctaAction: handleDownloadAll,
    },
    {
      id: 'dev-scripts',
      title: 'Developer Scripts & Micro-Tools',
      price: '$0',
      period: 'Free Open Access',
      badge: 'Open Source',
      tagline: 'Python, Node.js, Rust & Shell',
      description: 'Zero-latency browser utilities and ready-to-run backend scripts for Solana, EVM, content generation, and transaction dispatching.',
      icon: Code2,
      color: 'cyan',
      features: [
        'Solana Bulk Token Sender Script (Python / Web3)',
        'Telegram Mass Broadcaster Engine (Node.js)',
        'AI Content Batch Generator (Gemini Flash)',
        'High-Speed Rust Solana Tx Dispatcher',
        'Interactive Solana Fee & Gas Estimator',
        'Base58 Address & Signature Verifiers',
        'JSON Schema & TypeScript Generator',
      ],
      ctaText: 'Explore Developer Scripts',
      ctaAction: onExploreFree,
    },
    {
      id: 'telegram-hub',
      title: 'Official Developer Community',
      price: '$0',
      period: 'Always Free',
      badge: 'Community First',
      tagline: '12,000+ Builders & Engineers',
      description: 'Join our official Telegram community to request custom n8n workflows, receive new free tool releases, and get dev support.',
      icon: Send,
      color: 'indigo',
      features: [
        'Weekly open-source code & script drops',
        'Direct developer discussion & support',
        'Custom bot & n8n workflow requests',
        'Early access to new micro-app releases',
        'Commercial open license for all projects',
        'Zero paywalls or hidden subscriptions',
      ],
      ctaText: 'Join Telegram Community',
      ctaAction: () => window.open('https://t.me/solpump_store', '_blank'),
    },
  ];

  return (
    <section id="store" className="py-20 md:py-28 bg-[#090d17] border-y border-slate-800/80 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-cyan-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Open Access &amp; Community Driven</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Free Community Resource Hub
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            No credit cards, no subscriptions, no paywalls. Every developer script, n8n workflow, Telegram bot, and AI prompt database is 100% free and open access.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featurePillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="rounded-3xl p-7 flex flex-col justify-between bg-[#0b101d] border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white mb-1">{pillar.title}</h3>
                  <p className="text-xs text-emerald-400 font-mono-code mb-4">{pillar.tagline}</p>

                  <div className="mb-5 pb-5 border-b border-slate-800/80 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-white tracking-tight">{pillar.price}</span>
                    <span className="text-xs font-mono-code text-emerald-400 font-semibold">{pillar.period}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {pillar.description}
                  </p>

                  <div className="space-y-2.5 mb-8">
                    <p className="text-[10px] font-mono-code uppercase font-bold text-slate-400 tracking-wider">
                      Included Open Features:
                    </p>
                    {pillar.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={pillar.ctaAction}
                  disabled={downloading}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-[#080b12] text-xs font-extrabold font-mono-code flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{pillar.ctaText}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
