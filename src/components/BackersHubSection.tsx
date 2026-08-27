import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, ShieldCheck, Heart, Sparkles, Zap, Coins, X, QrCode, ArrowUpRight } from 'lucide-react';
import QRCode from 'qrcode';

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
  scanHint: string;
}

interface ToastState {
  label: string;
  address: string;
  network: string;
}

export const BackersHubSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [activeQrId, setActiveQrId] = useState<string | null>(null);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      scanHint: 'Scan with Tonkeeper, Telegram Wallet, or MyTonWallet',
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
      scanHint: 'Scan with Phantom, Solflare, or Backpack wallet',
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
      scanHint: 'Scan contract to view on DeDust, STON.fi, or TonViewer',
    },
  ];

  // Pre-generate crisp QR codes on mount for each address
  useEffect(() => {
    backerItems.forEach((item) => {
      QRCode.toDataURL(item.address, {
        width: 320,
        margin: 1.5,
        color: {
          dark: '#080b12',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      })
        .then((url) => {
          setQrCodes((prev) => ({ ...prev, [item.id]: url }));
        })
        .catch((err) => {
          console.error(`Failed to generate QR code for ${item.id}:`, err);
        });
    });
  }, []);

  const handleCopy = async (id: string, address: string, label: string, network: string) => {
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
      setToast({ label, address, network });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopiedId(null);
        setToast(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const toggleQr = (id: string) => {
    setActiveQrId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
        
        {/* Subtle Animated 'Copied!' Toast Notification */}
        {toast && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-toast-in max-w-md w-[calc(100vw-32px)] sm:w-auto"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl bg-[#0d1424]/95 border border-emerald-500/40 text-slate-100 shadow-2xl shadow-emerald-500/15 backdrop-blur-xl ring-1 ring-emerald-400/20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Check className="w-4 h-4 text-emerald-400 animate-copied-pop" />
                </div>
                <div className="text-left truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 font-mono tracking-wide">
                      Copied to Clipboard!
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono hidden sm:inline">
                      {toast.network}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 truncate max-w-[220px] sm:max-w-[320px]">
                    {toast.address.slice(0, 10)}...{toast.address.slice(-10)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setToast(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors shrink-0 cursor-pointer"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
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
            Support the ongoing open-source development of scripts, n8n automations, and developer tools directly via official network addresses or scan the QR code.{' '}
            <span className="text-emerald-400 font-medium">No wallet connection or permissions required.</span>
          </p>
        </div>

        {/* Responsive Grid (3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* 1. TON Network Card */}
          <div
            className={`rounded-3xl p-6 sm:p-7 bg-[#0b0f19] border transition-all duration-300 shadow-xl flex flex-col justify-between relative group ${
              copiedId === 'ton-wallet'
                ? 'border-cyan-400/60 shadow-cyan-500/10 ring-1 ring-cyan-400/30'
                : 'border-slate-800/90 hover:border-cyan-500/40 hover:shadow-cyan-500/5'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-inner">
                  <Coins className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleQr('ton-wallet')}
                    title={activeQrId === 'ton-wallet' ? 'Hide QR Code' : 'Show QR Code'}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                      activeQrId === 'ton-wallet'
                        ? 'bg-cyan-500 text-[#080b12] border-cyan-400 font-bold'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border-slate-700/80 hover:border-cyan-500/40'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{activeQrId === 'ton-wallet' ? 'Hide QR' : 'QR Code'}</span>
                  </button>
                  <span className="text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    TON / sopump
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-1.5 flex items-center gap-2">
                <span>The Open Network</span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-normal">TON</span>
              </h3>
              
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Direct community contributions &amp; development grant wallet on the TON Blockchain.
              </p>

              {/* Expandable QR Code Container */}
              {activeQrId === 'ton-wallet' && (
                <div className="mb-6 p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/40 animate-toast-in text-center flex flex-col items-center">
                  <div className="p-3 bg-white rounded-xl shadow-md inline-block mb-3">
                    {qrCodes['ton-wallet'] ? (
                      <img
                        src={qrCodes['ton-wallet']}
                        alt="TON Wallet QR Code"
                        className="w-44 h-44 object-contain"
                      />
                    ) : (
                      <div className="w-44 h-44 flex items-center justify-center text-slate-400 text-xs font-mono">
                        Generating QR...
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-cyan-300 font-mono flex items-center gap-1 justify-center">
                    <Zap className="w-3 h-3" />
                    <span>Scan with Tonkeeper or Telegram Wallet</span>
                  </p>
                </div>
              )}

              {/* Address Box with Quick Click-to-Copy */}
              <div
                onClick={() =>
                  handleCopy('ton-wallet', 'EQC22J88K_2ma8Bazzs4jNPuSOQ1LukWXQ2IEKGXDOGqhvAm', 'TON Address', 'TON Network')
                }
                title="Click to copy TON address"
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 mb-6 group/box cursor-pointer hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase font-semibold mb-2">
                  <span>Official TON Address:</span>
                  <span className="text-cyan-400 flex items-center gap-1 text-[10px]">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-200 break-all select-all leading-relaxed p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2 group-hover/box:bg-slate-900 transition-colors">
                  <span className="select-all">EQC22J88K_2ma8Bazzs4jNPuSOQ1LukWXQ2IEKGXDOGqhvAm</span>
                  <span className="shrink-0 text-slate-500 group-hover/box:text-cyan-400 transition-colors">
                    {copiedId === 'ton-wallet' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 animate-copied-pop" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons (Copy & QR Toggle) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleCopy('ton-wallet', 'EQC22J88K_2ma8Bazzs4jNPuSOQ1LukWXQ2IEKGXDOGqhvAm', 'TON Address', 'TON Network')
                }
                className={`flex-1 py-3.5 px-4 rounded-xl border text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] ${
                  copiedId === 'ton-wallet'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-2 ring-emerald-500/20 animate-copied-pop shadow-lg shadow-emerald-500/10'
                    : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border-cyan-500/30'
                }`}
              >
                {copiedId === 'ton-wallet' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 animate-copied-pop" />
                    <span className="text-emerald-300">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>Copy TON Address</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleQr('ton-wallet')}
                title="Toggle QR Code"
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeQrId === 'ton-wallet'
                    ? 'bg-cyan-500 text-[#080b12] border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border-slate-700/80 hover:border-cyan-500/40'
                }`}
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. Solana Network Card */}
          <div
            className={`rounded-3xl p-6 sm:p-7 bg-[#0b0f19] border transition-all duration-300 shadow-xl flex flex-col justify-between relative group ${
              copiedId === 'sol-wallet'
                ? 'border-purple-400/60 shadow-purple-500/10 ring-1 ring-purple-400/30'
                : 'border-slate-800/90 hover:border-purple-500/40 hover:shadow-purple-500/5'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-inner">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleQr('sol-wallet')}
                    title={activeQrId === 'sol-wallet' ? 'Hide QR Code' : 'Show QR Code'}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                      activeQrId === 'sol-wallet'
                        ? 'bg-purple-500 text-white border-purple-400 font-bold'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-purple-300 border-slate-700/80 hover:border-purple-500/40'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{activeQrId === 'sol-wallet' ? 'Hide QR' : 'QR Code'}</span>
                  </button>
                  <span className="text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                    SOL / USDC
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-1.5 flex items-center gap-2">
                <span>Solana Network</span>
                <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-normal">SOL</span>
              </h3>
              
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Direct on-chain development support and tool maintenance via SOL or SPL USDC.
              </p>

              {/* Expandable QR Code Container */}
              {activeQrId === 'sol-wallet' && (
                <div className="mb-6 p-4 rounded-2xl bg-slate-950/90 border border-purple-500/40 animate-toast-in text-center flex flex-col items-center">
                  <div className="p-3 bg-white rounded-xl shadow-md inline-block mb-3">
                    {qrCodes['sol-wallet'] ? (
                      <img
                        src={qrCodes['sol-wallet']}
                        alt="Solana Wallet QR Code"
                        className="w-44 h-44 object-contain"
                      />
                    ) : (
                      <div className="w-44 h-44 flex items-center justify-center text-slate-400 text-xs font-mono">
                        Generating QR...
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-purple-300 font-mono flex items-center gap-1 justify-center">
                    <Zap className="w-3 h-3" />
                    <span>Scan with Phantom, Solflare, or Backpack</span>
                  </p>
                </div>
              )}

              {/* Address Box with Quick Click-to-Copy */}
              <div
                onClick={() =>
                  handleCopy('sol-wallet', 'D8Ut9hu83VX2ZaJMvWiVAg4RUHt3581LhdoCxaT7F3SR', 'Solana Address', 'Solana Network')
                }
                title="Click to copy Solana address"
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 mb-6 group/box cursor-pointer hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase font-semibold mb-2">
                  <span>Official Solana Address:</span>
                  <span className="text-purple-400 flex items-center gap-1 text-[10px]">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-200 break-all select-all leading-relaxed p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2 group-hover/box:bg-slate-900 transition-colors">
                  <span className="select-all">D8Ut9hu83VX2ZaJMvWiVAg4RUHt3581LhdoCxaT7F3SR</span>
                  <span className="shrink-0 text-slate-500 group-hover/box:text-purple-400 transition-colors">
                    {copiedId === 'sol-wallet' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 animate-copied-pop" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons (Copy & QR Toggle) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleCopy('sol-wallet', 'D8Ut9hu83VX2ZaJMvWiVAg4RUHt3581LhdoCxaT7F3SR', 'Solana Address', 'Solana Network')
                }
                className={`flex-1 py-3.5 px-4 rounded-xl border text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] ${
                  copiedId === 'sol-wallet'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-2 ring-emerald-500/20 animate-copied-pop shadow-lg shadow-emerald-500/10'
                    : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-white border-purple-500/30'
                }`}
              >
                {copiedId === 'sol-wallet' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 animate-copied-pop" />
                    <span className="text-emerald-300">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span>Copy Solana Address</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleQr('sol-wallet')}
                title="Toggle QR Code"
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeQrId === 'sol-wallet'
                    ? 'bg-purple-500 text-white border-purple-400 shadow-md shadow-purple-500/20'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-purple-400 border-slate-700/80 hover:border-purple-500/40'
                }`}
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3. Official $sopump Token Card (Highlighted) */}
          <div
            className={`rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#0e1726] to-[#0a101d] border transition-all duration-300 shadow-2xl flex flex-col justify-between relative group md:col-span-2 lg:col-span-1 ${
              copiedId === 'sopump-token'
                ? 'border-emerald-400 shadow-emerald-500/20 ring-1 ring-emerald-400/50'
                : 'border-emerald-500/40 hover:border-emerald-400/70 hover:shadow-emerald-500/10'
            }`}
          >
            {/* Top Tag */}
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-emerald-500 text-[#080b12] text-[10px] font-mono font-extrabold uppercase tracking-wider shadow-lg shadow-emerald-500/30">
              Official Project Token
            </div>

            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-inner">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleQr('sopump-token')}
                    title={activeQrId === 'sopump-token' ? 'Hide QR Code' : 'Show QR Code'}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                      activeQrId === 'sopump-token'
                        ? 'bg-emerald-400 text-[#080b12] border-emerald-300 font-bold'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-emerald-300 border-emerald-500/30 hover:border-emerald-400/60'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{activeQrId === 'sopump-token' ? 'Hide QR' : 'QR Code'}</span>
                  </button>
                  <span className="text-[11px] font-mono font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    $sopump • TON
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-1.5 flex items-center gap-2">
                <span>$sopump Token</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-mono font-semibold">TON Jetton</span>
              </h3>
              
              <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                The official community utility and governance token on the TON blockchain ecosystem.
              </p>

              {/* Expandable QR Code Container */}
              {activeQrId === 'sopump-token' && (
                <div className="mb-6 p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/40 animate-toast-in text-center flex flex-col items-center">
                  <div className="p-3 bg-white rounded-xl shadow-md inline-block mb-3">
                    {qrCodes['sopump-token'] ? (
                      <img
                        src={qrCodes['sopump-token']}
                        alt="$sopump Contract Address QR Code"
                        className="w-44 h-44 object-contain"
                      />
                    ) : (
                      <div className="w-44 h-44 flex items-center justify-center text-slate-400 text-xs font-mono">
                        Generating QR...
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-300 font-mono flex items-center gap-1 justify-center">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Scan to verify on TonViewer or DEX</span>
                  </p>
                </div>
              )}

              {/* Address Box with Quick Click-to-Copy */}
              <div
                onClick={() =>
                  handleCopy('sopump-token', 'EQBMaQWsEnD2w2cJO9LjVGecg5Xhqw9RjTxPW7J4UenTlXnS', '$sopump Contract Address', 'TON Jetton')
                }
                title="Click to copy $sopump Contract Address"
                className="p-3.5 rounded-2xl bg-slate-950/90 border border-emerald-500/30 mb-6 group/box cursor-pointer hover:border-emerald-400/60 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 uppercase font-semibold mb-2">
                  <span>Contract Address (CA):</span>
                  <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                    <ShieldCheck className="w-3 h-3" /> Verified CA
                  </span>
                </div>
                <div className="font-mono text-xs text-emerald-200 break-all select-all leading-relaxed p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/20 flex items-center justify-between gap-2 group-hover/box:bg-slate-900 transition-colors">
                  <span className="select-all">EQBMaQWsEnD2w2cJO9LjVGecg5Xhqw9RjTxPW7J4UenTlXnS</span>
                  <span className="shrink-0 text-emerald-500/70 group-hover/box:text-emerald-300 transition-colors">
                    {copiedId === 'sopump-token' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 animate-copied-pop" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons (Copy & QR Toggle) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleCopy('sopump-token', 'EQBMaQWsEnD2w2cJO9LjVGecg5Xhqw9RjTxPW7J4UenTlXnS', '$sopump Contract Address', 'TON Jetton')
                }
                className={`flex-1 py-3.5 px-4 rounded-xl border text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] ${
                  copiedId === 'sopump-token'
                    ? 'bg-emerald-400 text-[#080b12] border-emerald-300 shadow-xl shadow-emerald-500/30 animate-copied-pop'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-[#080b12] border-transparent shadow-lg shadow-emerald-500/20'
                }`}
              >
                {copiedId === 'sopump-token' ? (
                  <>
                    <Check className="w-4 h-4 text-[#080b12] animate-copied-pop" />
                    <span className="text-[#080b12] font-black">Copied Contract Address!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#080b12] group-hover:scale-110 transition-transform" />
                    <span>Copy Contract Address (CA)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleQr('sopump-token')}
                title="Toggle QR Code"
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeQrId === 'sopump-token'
                    ? 'bg-emerald-400 text-[#080b12] border-emerald-300 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border-emerald-500/30 hover:border-emerald-400/60'
                }`}
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
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
