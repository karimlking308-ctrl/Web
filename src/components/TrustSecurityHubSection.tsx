import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Scale,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  FileCheck2,
  KeyRound,
  EyeOff,
  Coins,
  Cpu,
  Layers,
  ArrowUpRight,
  Sparkles,
  Shield,
  HelpCircle,
  FileText,
} from 'lucide-react';

interface TrustSecurityHubSectionProps {
  onOpenLegalDoc?: (type: 'privacy' | 'terms') => void;
}

export const TrustSecurityHubSection: React.FC<TrustSecurityHubSectionProps> = ({
  onOpenLegalDoc,
}) => {
  const [copiedContract, setCopiedContract] = useState(false);
  const [activeTab, setActiveTab] = useState<'security' | 'contract' | 'governance'>('security');

  const contractAddress = 'EQBMaQWsEnD2w2cJO9LjVGecg5Xhqw9RjTxPW7J4UenTlXnS';

  const handleCopyContract = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(contractAddress);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = contractAddress;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 2000);
    } catch (err) {
      console.error('Failed to copy contract address:', err);
    }
  };

  const securityPillars = [
    {
      icon: <FileCheck2 className="w-5 h-5 text-emerald-400" />,
      title: 'Smart Contract Audit Status',
      badge: 'Verified on TON Mainnet',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      description:
        'The $sopump utility Jetton contract adheres to the standard TEP-74 TON specification. Bytecode is publicly verified and indexed on TonViewer and TonScan with zero hidden mint or blacklist functions.',
      metrics: [
        { label: 'Contract Standard', value: 'TEP-74 Jetton' },
        { label: 'Bytecode Status', value: '100% Publicly Verified' },
        { label: 'Network', value: 'TON Mainnet' },
      ],
    },
    {
      icon: <Lock className="w-5 h-5 text-cyan-400" />,
      title: 'Non-Custodial Architecture',
      badge: 'Zero Private Key Access',
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      description:
        'We never store, request, or handle your private keys, seed phrases, or custodial wallet credentials. All interactions, cryptography, and ZIP package generations execute entirely client-side inside your browser sandbox.',
      metrics: [
        { label: 'Custody Model', value: '100% Non-Custodial' },
        { label: 'Client Sandbox', value: 'WASM & Pure JS' },
        { label: 'Database Logs', value: 'Zero Personal Logs' },
      ],
    },
    {
      icon: <Scale className="w-5 h-5 text-purple-400" />,
      title: 'Immutable Terms & Open Compliance',
      badge: 'Open-Source & Web3 Native',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      description:
        'Decentralized governance principles and MIT/Apache-2.0 open-source licensing apply to all community scripts, n8n workflows, and developer tools. No subscription entrapment or forced recurring renewals.',
      metrics: [
        { label: 'License Framework', value: 'MIT / Apache 2.0' },
        { label: 'Billing Mechanism', value: 'Direct On-Chain / Free' },
        { label: 'Tracking / Ad Pixels', value: 'None (Zero Spyware)' },
      ],
    },
  ];

  const complianceChecklist = [
    'Zero centralized database storage of user identities or wallets',
    'Direct P2P on-chain settlement without intermediary merchant processors',
    'Open auditability on decentralized explorers (TonViewer, DeDust, STON.fi)',
    'Client-side file compression and cryptographic hashing (SHA-256)',
    'Strict adherence to open-source software distribution standards',
    'No automated recurring charges or stealth subscription traps',
  ];

  return (
    <section
      id="trust-legal-hub"
      className="py-20 md:py-28 bg-[#060913] border-b border-slate-800/80 relative overflow-hidden"
    >
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[350px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[350px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Decentralized Trust &amp; Cryptographic Security</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Trust, Security &amp; Legal Hub
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Transparency and non-custodial integrity are foundational to sol-pump.store. Explore our on-chain verification, security standards, and decentralized legal disclosures.
          </p>
        </div>

        {/* Official Smart Contract Verification Banner */}
        <div className="mb-12 p-6 sm:p-7 rounded-3xl bg-[#090e1c] border border-cyan-500/30 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Verified On-Chain
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Official $sopump Contract Address (TON Mainnet)
                </span>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <div className="px-3.5 py-2 rounded-xl bg-slate-950/90 border border-slate-800 text-xs sm:text-sm font-mono text-cyan-300 break-all select-all font-semibold shadow-inner">
                  {contractAddress}
                </div>

                <button
                  type="button"
                  onClick={handleCopyContract}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy Official Contract Address"
                >
                  {copiedContract ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Copy CA</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Direct Verification Explorer Links */}
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={`https://tonviewer.com/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>TonViewer Audit</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://dedust.io/swap/TON/EQBMaQWsEnD2w2cJO9LjVGecg5Xhqw9RjTxPW7J4UenTlXnS"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>DeDust Liquidity</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* 3 Core Security & Legal Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {securityPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-3xl bg-[#090e1c] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {pillar.icon}
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${pillar.badgeColor}`}>
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight">
                  {pillar.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Pillar Metrics List */}
              <div className="pt-3 border-t border-slate-800/80 space-y-1.5 font-mono text-[11px]">
                {pillar.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">{m.label}:</span>
                    <span className="text-cyan-300 font-semibold">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Compliance & Disclaimers Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 7 Cols: Decentralized Compliance Guarantees */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#090e1c] border border-slate-800 space-y-5">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h4 className="text-base sm:text-lg font-bold text-white">
                Decentralized Compliance &amp; Privacy Architecture
              </h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Unlike traditional SaaS platforms that collect email databases, credit card tokens, and telemetry analytics, sol-pump.store functions as a stateless Web3 resource engine.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {complianceChecklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right 5 Cols: Legal Documentation Disclosures */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#090e1c] border border-slate-800 space-y-5">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-purple-400" />
              <h4 className="text-base sm:text-lg font-bold text-white">
                Disclaimers &amp; Documentation
              </h4>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 text-xs text-slate-400 leading-relaxed space-y-2">
              <p>
                <strong className="text-slate-300">No Financial Advice:</strong> $sopump is a decentralized utility token designed for ecosystem discounts, tooling access, and open source support. Nothing on this website constitutes financial or investment advice.
              </p>
              <p>
                <strong className="text-slate-300">Open-Source Code:</strong> Scripts, templates, and bots are provided "as-is" without warranty. Users are responsible for testing bots and API keys in secure environments.
              </p>
            </div>

            {/* Quick Link Buttons to Full Modals */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onOpenLegalDoc?.('privacy')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer text-center"
              >
                Privacy Disclosure
              </button>

              <button
                type="button"
                onClick={() => onOpenLegalDoc?.('terms')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer text-center"
              >
                Terms of Service
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
