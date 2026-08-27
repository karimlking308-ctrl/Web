import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Zap,
  Check,
  Download,
  FolderArchive,
  Code2,
  Shield,
  Layers,
  Wallet,
  Coins,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Lock,
  ExternalLink,
  Flame,
  Award,
} from 'lucide-react';
import { generateMasterBundleZIP } from '../utils/assetGenerators';
import { triggerMonetagDirectLink } from '../utils/monetag';
import { Web3PaymentModal, PricingPlan } from './Web3PaymentModal';

interface PricingSectionProps {
  onSelectPlan?: (plan: PricingPlan) => void;
  onExploreFree: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onExploreFree }) => {
  const [downloading, setDownloading] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<PricingPlan | null>(null);
  const [paymentMode, setPaymentMode] = useState<'wallet' | 'sopump' | 'direct'>('wallet');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleDownloadAllFree = async () => {
    triggerMonetagDirectLink();
    setDownloading(true);
    try {
      await generateMasterBundleZIP('SOLPUMP-FREE-OPEN-ACCESS');
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const proDeveloperPlan: PricingPlan = {
    id: 'pro-developer',
    name: 'Pro Developer',
    badge: 'Most Popular • Web3 Devs',
    badgeColor: 'cyan',
    priceUSD: 49,
    priceTON: 8.5,
    priceSOL: 0.28,
    priceSOPUMP: 11500,
    period: 'One-Time Lifetime',
    description: 'High-speed source code kits, Jito MEV sniper bot, custom Telegram lead gen workflows, and priority developer desk.',
    features: [
      'Jito MEV Solana Sniper & Token Launch Bot (Full Source)',
      'Telegram Mini-App & TON Clicker Game Production Boilerplate',
      'WhatsApp AI Lead-Gen & Auto-Responder System (n8n + Node)',
      'Private Webhook & High-Throughput Microservice Scripts',
      'Advanced n8n AI Content & CRM Automation Blueprints',
      'Priority Developer Telegram Support Desk (Private Channel)',
      'Commercial Deployment Rights for All Client Projects',
      'Lifetime Access to Future Code & Bot Updates',
    ],
  };

  const enterprisePlan: PricingPlan = {
    id: 'enterprise-ip',
    name: 'Enterprise / IP Licensing',
    badge: 'Institutional & IP Rights',
    badgeColor: 'purple',
    priceUSD: 299,
    priceTON: 52,
    priceSOL: 1.75,
    priceSOPUMP: 70000,
    period: 'Full IP & Commercial Rights',
    description: 'Full white-label licensing, custom smart contract development support, and unrestricted IP distribution rights.',
    features: [
      'Full White-Label Rights for All Micro-Apps & Mini-Apps',
      'Custom Smart Contract & n8n Architecture Consultation',
      'Dedicated 1-on-1 Engineering Support Channel (24/7 SLA)',
      'Unrestricted Commercial IP Redistribution & Resale Rights',
      'Multi-Chain High-Speed RPC Node Configurations',
      'Custom Tokenomics & Telegram Clicker Bot Customization',
      'Direct Source Code Repository Access & Private Git Forks',
      'Signed Institutional Web3 Commercial License Agreement',
    ],
  };

  const handleOpenPayment = (plan: PricingPlan, mode: 'wallet' | 'sopump' | 'direct') => {
    setSelectedPlanForPayment(plan);
    setPaymentMode(mode);
    setIsPaymentModalOpen(true);
  };

  return (
    <section
      id="store"
      className="py-20 md:py-28 bg-[#080c18] border-y border-slate-800/80 relative overflow-hidden"
    >
      {/* Background Ambience Glows */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[650px] h-[350px] bg-cyan-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-purple-500/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-[400px] h-[300px] bg-emerald-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Decentralized Payments • Zero Fiat Gateways</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Pro &amp; Enterprise Pricing Hub
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Transparent, non-custodial pricing for developers, founders, and Web3 builders. Settle directly with TON, Solana, or get an exclusive 20% discount using native <strong className="text-emerald-400 font-mono">$sopump</strong>.
          </p>
        </div>

        {/* 3 Tiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* TIER 1: COMMUNITY FREE */}
          <div className="rounded-3xl p-7 flex flex-col justify-between bg-[#0b1020] border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl relative group">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FolderArchive className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  100% Free Open Access
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-1">Community Free</h3>
              <p className="text-xs text-emerald-400 font-mono mb-4">Zero Cost • Open For Everyone</p>

              <div className="mb-6 pb-6 border-b border-slate-800/80 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white tracking-tight">$0</span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">Free Forever</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Instant access to ready-to-run codebases, n8n workflows, prompt databases, and developer utilities with zero sign-ups or paywalls.
              </p>

              <div className="space-y-3 mb-8">
                <p className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                  Included Community Features:
                </p>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Free Digital Asset &amp; Workflow Vault (.ZIP)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>9+ Client-Side Developer &amp; Web3 Micro-Tools</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Solana Fee &amp; Gas Interactive Estimator</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>1,500+ Curated AI Prompt Vaults (JSON/MD)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Official Telegram Builder Community Access</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Personal &amp; Non-Commercial License</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Free Tier Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={handleDownloadAllFree}
                disabled={downloading}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-[#080b12] text-xs font-extrabold font-mono flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Bundling Assets...' : 'Download Free Vault (.ZIP)'}</span>
              </button>

              <button
                type="button"
                onClick={onExploreFree}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-800"
              >
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Explore Free Scripts</span>
              </button>
            </div>
          </div>

          {/* TIER 2: PRO DEVELOPER (FEATURED) */}
          <div className="rounded-3xl p-7 flex flex-col justify-between bg-gradient-to-b from-[#0c1429] to-[#090e1e] border-2 border-cyan-500/50 hover:border-cyan-400 transition-all shadow-2xl relative group transform lg:-translate-y-2">
            
            {/* Top Glow & Popular Ribbon */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 text-[10px] font-mono font-extrabold uppercase tracking-wider shadow-md shadow-cyan-500/30 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-slate-950" />
              <span>Most Popular Choice</span>
            </div>

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-4 mt-1">
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {proDeveloperPlan.badge}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-1">Pro Developer</h3>
              <p className="text-xs text-cyan-400 font-mono mb-4">Complete Production Suite</p>

              <div className="mb-6 pb-6 border-b border-slate-800/80 flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">${proDeveloperPlan.priceUSD}</span>
                  <span className="text-xs font-mono text-cyan-300 font-semibold">One-Time / Lifetime</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span>≈ {proDeveloperPlan.priceTON} TON</span>
                  <span>•</span>
                  <span>≈ {proDeveloperPlan.priceSOL} SOL</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">
                    {(proDeveloperPlan.priceSOPUMP * 0.8).toLocaleString()} $sopump (-20%)
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Full production codebases for Solana sniper bots, Telegram Mini-Apps, WhatsApp AI agents, plus priority developer desk.
              </p>

              <div className="space-y-3 mb-8">
                <p className="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-wider">
                  Pro Developer Privileges:
                </p>
                <div className="space-y-2 text-xs text-slate-200">
                  {proDeveloperPlan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pro Tier Web3 Payment Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-slate-800/80">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold text-center mb-1">
                Select Decentralized Payment Method:
              </span>

              {/* Action 1: Connect Wallet & Pay (TON/Solana) */}
              <button
                type="button"
                onClick={() => handleOpenPayment(proDeveloperPlan, 'wallet')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-xs font-extrabold font-mono flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet &amp; Pay (TON / Solana)</span>
              </button>

              {/* Action 2: Pay with $sopump Token (-20% Discount) */}
              <button
                type="button"
                onClick={() => handleOpenPayment(proDeveloperPlan, 'sopump')}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pay with $sopump Token (-20% Off)</span>
              </button>

              {/* Action 3: Direct Network Transfer */}
              <button
                type="button"
                onClick={() => handleOpenPayment(proDeveloperPlan, 'direct')}
                className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-purple-400" />
                <span>Direct Network Transfer (QR / On-Chain)</span>
              </button>
            </div>
          </div>

          {/* TIER 3: ENTERPRISE & IP LICENSING */}
          <div className="rounded-3xl p-7 flex flex-col justify-between bg-[#0c0f1e] border border-purple-500/30 hover:border-purple-500/60 transition-all shadow-xl relative group">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Award className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  {enterprisePlan.badge}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-1">Enterprise &amp; IP</h3>
              <p className="text-xs text-purple-400 font-mono mb-4">Commercial IP &amp; Architecture</p>

              <div className="mb-6 pb-6 border-b border-slate-800/80 flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">${enterprisePlan.priceUSD}</span>
                  <span className="text-xs font-mono text-purple-300 font-semibold">Institutional License</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span>≈ {enterprisePlan.priceTON} TON</span>
                  <span>•</span>
                  <span>≈ {enterprisePlan.priceSOL} SOL</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">
                    {(enterprisePlan.priceSOPUMP * 0.8).toLocaleString()} $sopump (-20%)
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Full white-label redistribution rights, custom smart contracts, private Git repository access, and 1-on-1 dedicated engineering desk.
              </p>

              <div className="space-y-3 mb-8">
                <p className="text-[10px] font-mono uppercase font-bold text-purple-400 tracking-wider">
                  Enterprise Privileges:
                </p>
                <div className="space-y-2 text-xs text-slate-200">
                  {enterprisePlan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enterprise Tier Web3 Payment Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-slate-800/80">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold text-center mb-1">
                Select Decentralized Payment Method:
              </span>

              {/* Action 1: Connect Wallet & Pay (TON/Solana) */}
              <button
                type="button"
                onClick={() => handleOpenPayment(enterprisePlan, 'wallet')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold font-mono flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/25 cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet &amp; Pay (TON / Solana)</span>
              </button>

              {/* Action 2: Pay with $sopump Token (-20% Discount) */}
              <button
                type="button"
                onClick={() => handleOpenPayment(enterprisePlan, 'sopump')}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pay with $sopump Token (-20% Off)</span>
              </button>

              {/* Action 3: Direct Network Transfer */}
              <button
                type="button"
                onClick={() => handleOpenPayment(enterprisePlan, 'direct')}
                className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>Direct Network Transfer (QR / On-Chain)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Security & Decentralized Assurance Guarantee */}
        <div className="mt-14 p-6 rounded-2xl bg-[#0a0f1d] border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Non-Custodial &amp; On-Chain Verifiable</h4>
              <p className="text-xs text-slate-400 font-mono">
                No credit cards, no KYC, no recurring subscription locks. Instant automated license provisioning on block confirmation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>TON Mainnet</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-purple-300">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span>Solana Mainnet</span>
            </div>
          </div>
        </div>

      </div>

      {/* Web3 Decentralized Payment Modal */}
      <Web3PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedPlanForPayment(null);
        }}
        plan={selectedPlanForPayment}
        initialMode={paymentMode}
      />
    </section>
  );
};
