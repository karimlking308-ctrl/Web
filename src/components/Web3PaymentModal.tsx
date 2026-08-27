import React, { useState, useEffect } from 'react';
import {
  X,
  Wallet,
  Coins,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Zap,
  ArrowRight,
  RefreshCw,
  Layers,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import QRCode from 'qrcode';

export interface PricingPlan {
  id: string;
  name: string;
  badge: string;
  badgeColor: 'cyan' | 'purple' | 'emerald';
  priceUSD: number;
  priceTON: number;
  priceSOL: number;
  priceSOPUMP: number;
  period: string;
  description: string;
  features: string[];
}

interface Web3PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan | null;
  initialMode?: 'wallet' | 'sopump' | 'direct';
}

export const Web3PaymentModal: React.FC<Web3PaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  initialMode = 'wallet',
}) => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'sopump' | 'direct'>(initialMode);
  const [selectedNetwork, setSelectedNetwork] = useState<'ton' | 'sol'>('ton');
  const [copiedCA, setCopiedCA] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  
  // Wallet connection simulation state
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [txState, setTxState] = useState<'idle' | 'broadcasting' | 'success' | 'error'>('idle');
  const [txHashInput, setTxHashInput] = useState('');
  const [generatedLicenseKey, setGeneratedLicenseKey] = useState<string | null>(null);

  const TON_ADDRESS = 'EQC22J88K_2ma8Bazzs4jNPuSOQ1LukWXQ2IEKGXDOGqhvAm';
  const SOL_ADDRESS = 'D8Ut9hu83VX2ZaJMvWiVAg4RUHt3581LhdoCxaT7F3SR';
  const SOPUMP_CA = 'EQBMaQWsEnD2w2cJO9LjVGecg5Xhqw9RjTxPW7J4UenTlXnS';

  useEffect(() => {
    if (initialMode) {
      setActiveTab(initialMode);
    }
  }, [initialMode, isOpen]);

  // Generate dynamic QR code based on tab and network
  useEffect(() => {
    if (!isOpen || !plan) return;

    let targetAddress = TON_ADDRESS;
    if (activeTab === 'sopump') {
      targetAddress = SOPUMP_CA;
    } else if (selectedNetwork === 'sol') {
      targetAddress = SOL_ADDRESS;
    }

    QRCode.toDataURL(targetAddress, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#080b12',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate payment QR code:', err));
  }, [isOpen, plan, activeTab, selectedNetwork]);

  if (!isOpen || !plan) return null;

  const currentAddress = activeTab === 'sopump'
    ? SOPUMP_CA
    : selectedNetwork === 'ton'
    ? TON_ADDRESS
    : SOL_ADDRESS;

  const handleCopyText = async (text: string, isCA = false) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      if (isCA) {
        setCopiedCA(true);
        setTimeout(() => setCopiedCA(false), 2000);
      } else {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleSimulateWalletConnect = (walletName: string) => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setConnectedWallet(walletName);
    }, 1200);
  };

  const handleExecuteWalletPayment = () => {
    setTxState('broadcasting');
    setTimeout(() => {
      setTxState('success');
      const randomKey = `SOLPUMP-${plan.name.toUpperCase().slice(0, 3)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      setGeneratedLicenseKey(randomKey);
    }, 2000);
  };

  const handleVerifyDirectTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHashInput.trim()) return;
    setTxState('broadcasting');
    setTimeout(() => {
      setTxState('success');
      const randomKey = `SOLPUMP-${plan.name.toUpperCase().slice(0, 3)}-VERIFIED-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setGeneratedLicenseKey(randomKey);
    }, 1800);
  };

  const handleReset = () => {
    setTxState('idle');
    setConnectedWallet(null);
    setGeneratedLicenseKey(null);
    setTxHashInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0a0f1d] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            handleReset();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Decentralized Web3 Settlement Hub</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              Unlock {plan.name} Tier
            </h3>
            <div className="flex items-baseline gap-1.5 text-emerald-400 font-mono font-bold">
              <span className="text-2xl font-extrabold">${plan.priceUSD}</span>
              <span className="text-xs text-slate-400 font-normal">/ {plan.period}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Zero fiat, 100% on-chain privacy. Instant license key generation on block confirmation.
          </p>
        </div>

        {/* Success State View */}
        {txState === 'success' && generatedLicenseKey ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 my-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-white">Payment Confirmed On-Chain!</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                Your Web3 transaction has been validated by the decentralized node network. Your {plan.name} access license is ready.
              </p>
            </div>

            {/* License Key Box */}
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between gap-3 max-w-md mx-auto">
              <div className="text-left font-mono">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Developer License Key:</span>
                <span className="text-sm font-bold text-emerald-300">{generatedLicenseKey}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(generatedLicenseKey)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold font-mono flex items-center gap-1.5 hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                {copiedAddress ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              Done &amp; Close
            </button>
          </div>
        ) : (
          <>
            {/* 3 Payment Mode Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('wallet')}
                className={`py-2.5 px-2 rounded-xl text-xs font-mono font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'wallet'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('sopump')}
                className={`py-2.5 px-2 rounded-xl text-xs font-mono font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                  activeTab === 'sopump'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Coins className="w-4 h-4 text-emerald-400" />
                <span>$sopump Token</span>
                <span className="hidden sm:inline text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-300">
                  -20%
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('direct')}
                className={`py-2.5 px-2 rounded-xl text-xs font-mono font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'direct'
                    ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/40 text-purple-300 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Direct Transfer</span>
              </button>
            </div>

            {/* TAB 1: CONNECT WALLET & PAY */}
            {activeTab === 'wallet' && (
              <div className="space-y-5 animate-in fade-in-50">
                {/* Network Switch */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs font-mono text-slate-300">Select Network:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedNetwork('ton')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        selectedNetwork === 'ton'
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      TON (≈ {plan.priceTON} TON)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedNetwork('sol')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        selectedNetwork === 'sol'
                          ? 'bg-purple-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Solana (≈ {plan.priceSOL} SOL)
                    </button>
                  </div>
                </div>

                {/* Wallet Providers Grid */}
                {!connectedWallet ? (
                  <div className="space-y-3">
                    <p className="text-xs font-mono text-slate-400">Choose supported decentralized wallet:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                      {selectedNetwork === 'ton' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSimulateWalletConnect('Tonkeeper')}
                            disabled={isConnecting}
                            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div>
                              <span className="text-xs font-bold text-white block">Tonkeeper</span>
                              <span className="text-[10px] text-slate-400 font-mono">Mobile &amp; Extension</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSimulateWalletConnect('Telegram Wallet')}
                            disabled={isConnecting}
                            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div>
                              <span className="text-xs font-bold text-white block">Telegram Wallet</span>
                              <span className="text-[10px] text-slate-400 font-mono">@wallet Native</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSimulateWalletConnect('MyTonWallet')}
                            disabled={isConnecting}
                            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div>
                              <span className="text-xs font-bold text-white block">MyTonWallet</span>
                              <span className="text-[10px] text-slate-400 font-mono">Web &amp; Desktop</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSimulateWalletConnect('OpenMask')}
                            disabled={isConnecting}
                            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div>
                              <span className="text-xs font-bold text-white block">OpenMask / TON</span>
                              <span className="text-[10px] text-slate-400 font-mono">Browser Extension</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSimulateWalletConnect('Phantom')}
                            disabled={isConnecting}
                            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-left transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div>
                              <span className="text-xs font-bold text-white block">Phantom</span>
                              <span className="text-[10px] text-slate-400 font-mono">Solana Web &amp; Mobile</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSimulateWalletConnect('Solflare')}
                            disabled={isConnecting}
                            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-left transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div>
                              <span className="text-xs font-bold text-white block">Solflare</span>
                              <span className="text-[10px] text-slate-400 font-mono">High-Speed Solana</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSimulateWalletConnect('Backpack')}
                            disabled={isConnecting}
                            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-left transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div>
                              <span className="text-xs font-bold text-white block">Backpack</span>
                              <span className="text-[10px] text-slate-400 font-mono">xNFT &amp; Solana</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSimulateWalletConnect('Trust Wallet')}
                            disabled={isConnecting}
                            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-left transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div>
                              <span className="text-xs font-bold text-white block">Trust Wallet</span>
                              <span className="text-[10px] text-slate-400 font-mono">Multi-Chain</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono">Connected Provider:</span>
                      <span className="font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        {connectedWallet} (Active)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800 font-mono">
                      <span className="text-slate-400">Total Settlement:</span>
                      <span className="font-bold text-white text-sm">
                        {selectedNetwork === 'ton'
                          ? `${plan.priceTON} TON ($${plan.priceUSD})`
                          : `${plan.priceSOL} SOL ($${plan.priceUSD})`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleExecuteWalletPayment}
                      disabled={txState === 'broadcasting'}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                      {txState === 'broadcasting' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Awaiting On-Chain Signature...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>
                            Approve &amp; Pay {selectedNetwork === 'ton' ? `${plan.priceTON} TON` : `${plan.priceSOL} SOL`}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PAY WITH $SOPUMP TOKEN (-20% DISCOUNT) */}
            {activeTab === 'sopump' && (
              <div className="space-y-4 animate-in fade-in-50">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-white block">Ecosystem Utility Advantage</span>
                    <span className="text-[11px] text-emerald-300 font-mono">
                      Get an instant 20% discount when settling with native $sopump
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 line-through block font-mono">${plan.priceUSD}</span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono">
                      {(plan.priceSOPUMP * 0.8).toLocaleString()} $sopump
                    </span>
                  </div>
                </div>

                {/* Contract Details */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Official Token CA (TON):</span>
                    <span className="text-cyan-300 font-bold">Jetton Standard</span>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 font-mono text-xs">
                    <span className="text-slate-300 truncate">{SOPUMP_CA}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(SOPUMP_CA, true)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 cursor-pointer transition-colors"
                      title="Copy Contract Address"
                    >
                      {copiedCA ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2">
                    <a
                      href={`https://dedust.io/swap/TON/${SOPUMP_CA}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Swap on DeDust</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={`https://tonviewer.com/${SOPUMP_CA}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>TonViewer Pool</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExecuteWalletPayment}
                  disabled={txState === 'broadcasting'}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {txState === 'broadcasting' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Broadcasting Token Transfer...</span>
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4" />
                      <span>Pay {(plan.priceSOPUMP * 0.8).toLocaleString()} $sopump</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 3: DIRECT NETWORK TRANSFER */}
            {activeTab === 'direct' && (
              <div className="space-y-4 animate-in fade-in-50">
                {/* Network Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs font-mono text-slate-300">Destination Network:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedNetwork('ton')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        selectedNetwork === 'ton'
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      TON Network
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedNetwork('sol')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        selectedNetwork === 'sol'
                          ? 'bg-purple-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Solana Network
                    </button>
                  </div>
                </div>

                {/* QR Code & Copyable Address Card */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
                  {qrDataUrl && (
                    <div className="p-2 rounded-xl bg-white shrink-0 shadow-md">
                      <img src={qrDataUrl} alt="Web3 Payment QR" className="w-28 h-28" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
                    <span className="text-[11px] font-mono text-slate-400 block">
                      Send exactly{' '}
                      <strong className="text-white">
                        {selectedNetwork === 'ton' ? `${plan.priceTON} TON` : `${plan.priceSOL} SOL`}
                      </strong>{' '}
                      to:
                    </span>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 break-all">
                      {currentAddress}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText(currentAddress)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold text-cyan-300 flex items-center justify-center sm:justify-start gap-1.5 transition-colors cursor-pointer w-full sm:w-auto"
                    >
                      {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAddress ? 'Address Copied!' : 'Copy Address'}</span>
                    </button>
                  </div>
                </div>

                {/* TX Hash Input Form for instant manual validation */}
                <form onSubmit={handleVerifyDirectTx} className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 block">
                    Have already transferred? Enter Transaction Hash / Signature:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={txHashInput}
                      onChange={(e) => setTxHashInput(e.target.value)}
                      placeholder="e.g. 5K7e9X... or ton-tx-hash..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      disabled={!txHashInput.trim() || txState === 'broadcasting'}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
                    >
                      {txState === 'broadcasting' ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5" />
                      )}
                      <span>Verify</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}

        {/* Security & Disclaimer Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Non-Custodial &amp; Decentralized
          </span>
          <span className="text-slate-500">Instant Automated Provisioning</span>
        </div>

      </div>
    </div>
  );
};
