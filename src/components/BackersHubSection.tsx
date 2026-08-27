import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Heart, Sparkles, Zap, Coins, ExternalLink } from 'lucide-react';

interface BackerItem {
  id: string;
  title: string;
  badge: string;
  badgeColor: 'cyan' | 'purple' | 'emerald';
  description: string;
  addressLabel: string;
  address: string;
  isToken?: boolean;
  network: string;
}

export const BackersHubSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const backerItems: BackerItem[] = [
    {
      id: 'ton-wallet',
      title: 'The Open Network (TON)',
      badge: 'TON / sopump',
      badgeColor: 'cyan',
      description: 'Direct community contributions & development grant wallet on the TON Blockchain.',
      addressLabel: 'Official TON Address:',
      address: 'EQC22J88K_2ma8Bazzs4jNPuSOQ1LukWXQ2IEKGXDOGqhvAm',
      network: 'TON Network',
    },
    {
      id: 'sol-wallet',
      title: 'Solana Network',
      badge: 'SOL / USDC',
      badgeColor: 'purple',
      description: 'Direct on-chain development support and developer tool maintenance via SOL or SPL USDC.',
      addressLabel: 'Official Solana Address:',
      address: 'D8Ut9hu83VX2ZaJMvWiVAg4RUHt3581LhdoCxaT7F3SR',
      network: 'Solana Network',
    },
    {
      id: 'sopump-token',
      title: '$sopump Project Token',
      badge: '$sopump • TON',
      badgeColor: 'emerald',
      description: 'Official community utility & ecosystem token contract on the TON blockchain.',
      addressLabel: 'Contract Address (CA):',
      address: 'EQBMaQWsEnD2w2cJO9LjVGecg5Xhqw9RjTxPW7J4UenTlXnS',
      isToken: true,
      network: 'TON Blockchain (Jetton)',
    },
  ];

  const handleCopy = async (id: string, address: string, label: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(address);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = address;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopiedId(id);
      setToastMessage(`Copied ${label} to clipboard!`);

      setTimeout(() => {
        setCopiedId(null);
      }, 2500);

      setTimeout(() => {
        setToastMessage(null);
      }, 3500);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <section
      id="backers-hub"
      className="relative py-16 md:py-24 bg-[#080b12] text-slate-100 border-t border-slate-800/80 overflow-hidden"
    >
      {/* Background Ambience / Glows */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-purple-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Floating Notification Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0e1626] border border-emerald-500/50 text-emerald-300 shadow-2xl shadow-emerald-500/20 backdrop-blur-xl animate-fade-in text-sm font-medium font-mono">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20 animate-pulse" />
            <span>Direct Community Support &amp; Token</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Direct Backers &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              Support Hub
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Support the ongoing open-source development of scripts, n8n automations, and developer tools directly via official network addresses.{' '}
            <span className="text-emerald-400 font-medium">No wallet connection or permissions required.</span>
          </p>
        </div>

        {/* Responsive Grid (3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* 1. TON Network Card */}
          <div className="rounded-3xl p-6 sm:p-7 bg-[#0b0f19] border border-slate-800/90 hover:border-cyan-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between relative group hover:shadow-cyan-500/5">
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-inner">
                  <Coins className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  TON / sopump
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1.5 flex items-center gap-2">
                <span>The Open Network</span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-normal">TON</span>
              </h3>
              
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Direct community contributions &amp; development grant wallet on the TON Blockchain.
              </p>

              {/* Address Box */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 mb-6">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase font-semibold mb-2">
                  <span>Official TON Address:</span>
                  <span className="text-cyan-400 flex items-center gap-1 text-[10px]">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-200 break-all select-all leading-relaxed p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  EQC22J88K_2ma8Bazzs4jNPuSOQ1LukWXQ2IEKGXDOGqhvAm
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={() =>
                handleCopy('ton-wallet', 'EQC22J88K_2ma8Bazzs4jNPuSOQ1LukWXQ2IEKGXDOGqhvAm', 'TON Address')
              }
              className={`w-full py-3.5 px-4 rounded-xl border text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] ${
                copiedId === 'ton-wallet'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-2 ring-emerald-500/20'
                  : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border-cyan-500/30'
              }`}
            >
              {copiedId === 'ton-wallet' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-cyan-400" />
                  <span>Copy TON Address</span>
                </>
              )}
            </button>
          </div>

          {/* 2. Solana Network Card */}
          <div className="rounded-3xl p-6 sm:p-7 bg-[#0b0f19] border border-slate-800/90 hover:border-purple-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between relative group hover:shadow-purple-500/5">
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-inner">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  SOL / USDC
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1.5 flex items-center gap-2">
                <span>Solana Network</span>
                <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-normal">SOL</span>
              </h3>
              
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Direct on-chain development support and tool maintenance via SOL or SPL USDC.
              </p>

              {/* Address Box */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 mb-6">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase font-semibold mb-2">
                  <span>Official Solana Address:</span>
                  <span className="text-purple-400 flex items-center gap-1 text-[10px]">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-200 break-all select-all leading-relaxed p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  D8Ut9hu83VX2ZaJMvWiVAg4RUHt3581LhdoCxaT7F3SR
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={() =>
                handleCopy('sol-wallet', 'D8Ut9hu83VX2ZaJMvWiVAg4RUHt3581LhdoCxaT7F3SR', 'Solana Address')
              }
              className={`w-full py-3.5 px-4 rounded-xl border text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] ${
                copiedId === 'sol-wallet'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-2 ring-emerald-500/20'
                  : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-white border-purple-500/30'
              }`}
            >
              {copiedId === 'sol-wallet' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-purple-400" />
                  <span>Copy Solana Address</span>
                </>
              )}
            </button>
          </div>

          {/* 3. Official $sopump Token Card (Highlighted) */}
          <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#0e1726] to-[#0a101d] border border-emerald-500/40 hover:border-emerald-400/70 transition-all duration-300 shadow-2xl flex flex-col justify-between relative group md:col-span-2 lg:col-span-1 hover:shadow-emerald-500/10">
            {/* Top Tag */}
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-emerald-500 text-[#080b12] text-[10px] font-mono font-extrabold uppercase tracking-wider shadow-lg shadow-emerald-500/30">
              Official Project Token
            </div>

            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-inner">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-[11px] font-mono font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  $sopump • TON
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1.5 flex items-center gap-2">
                <span>$sopump Token</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-mono font-semibold">TON Jetton</span>
              </h3>
              
              <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                The official community utility and governance token on the TON blockchain ecosystem.
              </p>

              {/* Address Box */}
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-emerald-500/30 mb-6">
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 uppercase font-semibold mb-2">
                  <span>Contract Address (CA):</span>
                  <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                    <ShieldCheck className="w-3 h-3" /> Verified CA
                  </span>
                </div>
                <div className="font-mono text-xs text-emerald-200 break-all select-all leading-relaxed p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/20">
                  EQBMaQWsEnD2w2cJO9LjVGecg5Xhqw9RjTxPW7J4UenTlXnS
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={() =>
                handleCopy('sopump-token', 'EQBMaQWsEnD2w2cJO9LjVGecg5Xhqw9RjTxPW7J4UenTlXnS', '$sopump Contract Address')
              }
              className={`w-full py-3.5 px-4 rounded-xl border text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] ${
                copiedId === 'sopump-token'
                  ? 'bg-emerald-500 text-[#080b12] border-emerald-400 shadow-lg shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-[#080b12] border-transparent shadow-lg shadow-emerald-500/20'
              }`}
            >
              {copiedId === 'sopump-token' ? (
                <>
                  <Check className="w-4 h-4 text-[#080b12]" />
                  <span>Copied Contract Address!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#080b12]" />
                  <span>Copy Contract Address (CA)</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Security & Verification Guarantee Footnote */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 max-w-3xl mx-auto flex items-start sm:items-center gap-3.5 text-xs text-slate-400">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed">
            <strong className="text-slate-200 font-semibold">Security Notice:</strong> Direct transfers only. We will never ask for private keys, secret recovery phrases, or permission approvals. Always verify the address before completing transactions.
          </p>
        </div>

      </div>
    </section>
  );
};
