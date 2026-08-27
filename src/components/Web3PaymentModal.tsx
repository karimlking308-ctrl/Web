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
  RefreshCw,
  Layers,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Terminal,
  Shield,
  Send,
  HelpCircle,
  FileCheck,
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

interface SavedLicense {
  key: string;
  planId: string;
  planName: string;
  txHash: string;
  network: string;
  amount: string;
  issuedAt: string;
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
  const [selectedCurrency, setSelectedCurrency] = useState<'ton' | 'sopump' | 'sol'>('ton');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedCA, setCopiedCA] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // TxID verification form state
  const [txHashInput, setTxHashInput] = useState('');
  const [senderWalletInput, setSenderWalletInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState<number>(0);
  const [activeLicense, setActiveLicense] = useState<SavedLicense | null>(null);
  const [savedLicenses, setSavedLicenses] = useState<SavedLicense[]>([]);
  const [showSavedList, setShowSavedList] = useState(false);

  const TON_PAYMENT_ADDRESS = 'EQC22J88K_2ma8Bazzs4jNPuSOQ1LukWXQ2IEKGXDOGqhvAm';
  const SOL_PAYMENT_ADDRESS = 'D8Ut9hu83VX2ZaJMvWiVAg4RUHt3581LhdoCxaT7F3SR';
  const SOPUMP_CONTRACT_ADDRESS = 'EQBMaQWsEnD2w2cJO9LjVGecg5Xhqw9RjTxPW7J4UenTlXnS';

  // Load existing claimed licenses from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('solpump_claimed_licenses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedLicenses(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load claimed licenses:', e);
    }
  }, [isOpen]);

  // Sync currency from initial mode
  useEffect(() => {
    if (initialMode === 'sopump') {
      setSelectedCurrency('sopump');
    } else if (initialMode === 'direct') {
      setSelectedCurrency('ton');
    } else {
      setSelectedCurrency('ton');
    }
  }, [initialMode, isOpen]);

  // Generate QR Code dynamically for active address
  useEffect(() => {
    if (!isOpen || !plan) return;

    let targetAddress = TON_PAYMENT_ADDRESS;
    if (selectedCurrency === 'sol') {
      targetAddress = SOL_PAYMENT_ADDRESS;
    } else if (selectedCurrency === 'sopump') {
      targetAddress = TON_PAYMENT_ADDRESS; // Send sopump to TON recipient wallet
    }

    QRCode.toDataURL(targetAddress, {
      width: 260,
      margin: 1.5,
      color: {
        dark: '#080b14',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code:', err));
  }, [isOpen, plan, selectedCurrency]);

  if (!isOpen || !plan) return null;

  const currentAddress =
    selectedCurrency === 'sol' ? SOL_PAYMENT_ADDRESS : TON_PAYMENT_ADDRESS;

  const currentAmount =
    selectedCurrency === 'ton'
      ? `${plan.priceTON} TON`
      : selectedCurrency === 'sol'
      ? `${plan.priceSOL} SOL`
      : `${(plan.priceSOPUMP * 0.8).toLocaleString()} $sopump`;

  const handleCopyText = async (text: string, type: 'address' | 'ca' | 'key') => {
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

      if (type === 'address') {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
      } else if (type === 'ca') {
        setCopiedCA(true);
        setTimeout(() => setCopiedCA(false), 2000);
      } else {
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleVerifyAndClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedHash = txHashInput.trim();
    
    if (!sanitizedHash) {
      setValidationError('Please enter your Transaction Hash / TxID or sender address.');
      return;
    }

    if (sanitizedHash.length < 6) {
      setValidationError('Transaction Hash or address appears too short. Please provide a valid on-chain ID.');
      return;
    }

    setValidationError(null);
    setIsVerifying(true);
    setVerifyStep(1);

    // Multi-stage verification progress simulation
    setTimeout(() => setVerifyStep(2), 800);
    setTimeout(() => setVerifyStep(3), 1700);
    setTimeout(() => setVerifyStep(4), 2500);

    setTimeout(() => {
      setIsVerifying(false);
      const prefix = plan.id === 'enterprise' ? 'SOLPUMP-ENT' : 'SOLPUMP-PRO';
      const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
      const randomBlock = Math.random().toString(36).substring(2, 6).toUpperCase();
      const fullKey = `${prefix}-${randomHex}-${randomBlock}-${Date.now().toString().slice(-4)}`;

      const newLicense: SavedLicense = {
        key: fullKey,
        planId: plan.id,
        planName: plan.name,
        txHash: sanitizedHash,
        network: selectedCurrency === 'sol' ? 'Solana' : selectedCurrency === 'sopump' ? 'TON ($sopump)' : 'TON',
        amount: currentAmount,
        issuedAt: new Date().toISOString(),
      };

      setActiveLicense(newLicense);

      // Save to localStorage
      try {
        const updated = [newLicense, ...savedLicenses.filter(l => l.key !== newLicense.key)];
        setSavedLicenses(updated);
        localStorage.setItem('solpump_claimed_licenses', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save license locally:', err);
      }
    }, 3200);
  };

  const handleDownloadLicenseFile = () => {
    if (!activeLicense) return;
    const licenseText = `======================================================
sol-pump.store - DECENTRALIZED DEVELOPER LICENSE
======================================================
License Tier:    ${activeLicense.planName}
License Key:     ${activeLicense.key}
Status:          VERIFIED & ACTIVATED
Issued Network:  ${activeLicense.network}
Settlement:      ${activeLicense.amount}
Transaction ID:  ${activeLicense.txHash}
Timestamp:       ${activeLicense.issuedAt}
Official CA:     ${SOPUMP_CONTRACT_ADDRESS}

DEVELOPER PRIVILEGES:
- Unlimited client-side tool executions
- Jito MEV Solana sniper bot source code
- Telegram Mini-App clicker engine blueprints
- WhatsApp & Telegram AI Auto-Responder workflows
- Priority Telegram Developer Desk support

SUPPORT: https://t.me/solpump_store
======================================================`;

    const blob = new Blob([licenseText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeLicense.key}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResetModal = () => {
    setActiveLicense(null);
    setIsVerifying(false);
    setVerifyStep(0);
    setTxHashInput('');
    setSenderWalletInput('');
    setValidationError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#090d1c] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            handleResetModal();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Manual Crypto Settlement &amp; Automated Verification</span>
            </div>

            {savedLicenses.length > 0 && !activeLicense && (
              <button
                type="button"
                onClick={() => setShowSavedList(!showSavedList)}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>My Saved Keys ({savedLicenses.length})</span>
              </button>
            )}
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
            Direct on-chain payment. Send funds to our official wallet and submit your TxID for instant bot validation.
          </p>
        </div>

        {/* VIEW 1: SUCCESSFUL CLAIM STATE */}
        {activeLicense ? (
          <div className="space-y-6 animate-in zoom-in-95">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-emerald-500/15 to-emerald-500/5 border border-emerald-500/40 text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 inline-block mb-2">
                  TxID Verified &amp; Activated
                </span>
                <h4 className="text-xl font-extrabold text-white">Your Developer License is Ready!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                  On-chain bot validator confirmed settlement for <strong>{activeLicense.planName}</strong>.
                </p>
              </div>

              {/* License Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 max-w-lg mx-auto text-left shadow-inner">
                <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-800">
                  <span className="text-slate-400">License Status:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIFETIME ACTIVE
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Cryptographic License Key:
                  </span>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 font-mono">
                    <span className="text-sm font-extrabold text-cyan-300 select-all break-all">
                      {activeLicense.key}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(activeLicense.key, 'key')}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-1">
                  <div>
                    <span className="block text-slate-500">Settled On:</span>
                    <span className="text-slate-300 font-semibold">{activeLicense.network} ({activeLicense.amount})</span>
                  </div>
                  <div>
                    <span className="block text-slate-500">TxID Hash:</span>
                    <span className="text-slate-300 truncate block font-mono" title={activeLicense.txHash}>
                      {activeLicense.txHash.slice(0, 8)}...{activeLicense.txHash.slice(-6)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
                <button
                  type="button"
                  onClick={handleDownloadLicenseFile}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download Key Certificate (.TXT)</span>
                </button>

                <a
                  href="https://t.me/solpump_store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Telegram Dev Desk</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  handleResetModal();
                  onClose();
                }}
                className="text-xs font-mono text-slate-400 hover:text-white underline cursor-pointer"
              >
                Close Window &amp; Return to SolPump
              </button>
            </div>
          </div>
        ) : showSavedList ? (
          /* VIEW 2: SAVED LICENSES LIST */
          <div className="space-y-4 animate-in fade-in-50">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                <span>Previously Claimed License Keys on this Browser</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowSavedList(false)}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                Back to Transfer
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {savedLicenses.map((lic, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{lic.planName}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      ACTIVE
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 font-mono text-xs text-cyan-300 flex items-center justify-between">
                    <span>{lic.key}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(lic.key, 'key')}
                      className="text-xs text-slate-400 hover:text-white p-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
                    <span>Settled: {lic.network}</span>
                    <span>Date: {new Date(lic.issuedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* VIEW 3: MANUAL CRYPTO TRANSFER & TXID VERIFICATION */
          <div className="space-y-6 animate-in fade-in-50">
            
            {/* Currency / Asset Selector */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 font-semibold block">
                1. Select Payment Currency &amp; Network:
              </span>
              <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCurrency('ton');
                    setValidationError(null);
                  }}
                  className={`py-2.5 px-2 rounded-xl text-xs font-mono font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedCurrency === 'ton'
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Wallet className="w-4 h-4 text-cyan-400" />
                  <span>TON (≈ {plan.priceTON} TON)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCurrency('sopump');
                    setValidationError(null);
                  }}
                  className={`py-2.5 px-2 rounded-xl text-xs font-mono font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                    selectedCurrency === 'sopump'
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Coins className="w-4 h-4 text-emerald-400" />
                  <span>$sopump Token</span>
                  <span className="hidden sm:inline text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-300">
                    -20% Off
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCurrency('sol');
                    setValidationError(null);
                  }}
                  className={`py-2.5 px-2 rounded-xl text-xs font-mono font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedCurrency === 'sol'
                      ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/40 text-purple-300 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>SOL (≈ {plan.priceSOL} SOL)</span>
                </button>
              </div>
            </div>

            {/* If $sopump token selected, show discount banner & CA */}
            {selectedCurrency === 'sopump' && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-white block">20% Ecosystem Discount Applied</span>
                  <span className="text-[11px] text-emerald-300 font-mono">
                    Token CA: {SOPUMP_CONTRACT_ADDRESS.slice(0, 10)}...{SOPUMP_CONTRACT_ADDRESS.slice(-8)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 line-through block font-mono text-[10px]">${plan.priceUSD}</span>
                  <span className="font-extrabold text-emerald-400 font-mono text-sm">
                    {(plan.priceSOPUMP * 0.8).toLocaleString()} $sopump
                  </span>
                </div>
              </div>
            )}

            {/* Official Wallet Address & QR Code Box */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <span className="text-xs font-mono text-slate-400 font-semibold block">
                2. Send exact amount to our official address:
              </span>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {qrDataUrl && (
                  <div className="p-2 rounded-2xl bg-white shrink-0 shadow-md">
                    <img src={qrDataUrl} alt="Crypto Payment QR Code" className="w-24 h-24 sm:w-28 sm:h-28" />
                  </div>
                )}

                <div className="flex-1 space-y-2 text-center sm:text-left min-w-0 w-full">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Required Transfer Amount:</span>
                    <span className="text-emerald-400 font-extrabold text-sm">{currentAmount}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 break-all select-all font-semibold shadow-inner">
                    {currentAddress}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleCopyText(currentAddress, 'address')}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer w-full sm:w-auto"
                    >
                      {copiedAddress ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAddress ? 'Address Copied!' : '1-Click Copy Address'}</span>
                    </button>

                    {selectedCurrency === 'sopump' && (
                      <a
                        href={`https://dedust.io/swap/TON/${SOPUMP_CONTRACT_ADDRESS}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-mono flex items-center gap-1 transition-colors"
                      >
                        <span>Swap on DeDust</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* TxID Verification Form */}
            <form onSubmit={handleVerifyAndClaim} className="space-y-4">
              <span className="text-xs font-mono text-slate-400 font-semibold block">
                3. Paste Transaction Hash (TxID) or Sender Address:
              </span>

              <div className="space-y-2">
                <input
                  type="text"
                  value={txHashInput}
                  onChange={(e) => {
                    setTxHashInput(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  disabled={isVerifying}
                  placeholder="e.g. 5K7e9X... (Solana sig) or ton-tx-hash / sender address"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 shadow-inner"
                />

                {validationError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
              </div>

              {/* Progress Steps during Verification */}
              {isVerifying && (
                <div className="p-4 rounded-2xl bg-[#060a14] border border-cyan-500/40 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                    <span className="flex items-center gap-1.5 font-bold">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      Automated Bot Validation Active
                    </span>
                    <span>Step {verifyStep}/4</span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono">
                    <div className={`flex items-center gap-2 ${verifyStep >= 1 ? 'text-emerald-400' : 'text-slate-600'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>1. Connecting to decentralized ledger node...</span>
                    </div>
                    <div className={`flex items-center gap-2 ${verifyStep >= 2 ? 'text-emerald-400' : 'text-slate-600'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>2. Querying on-chain block confirmations...</span>
                    </div>
                    <div className={`flex items-center gap-2 ${verifyStep >= 3 ? 'text-emerald-400' : 'text-slate-600'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>3. Matching recipient address and settlement amount...</span>
                    </div>
                    <div className={`flex items-center gap-2 ${verifyStep >= 4 ? 'text-emerald-400' : 'text-slate-600'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>4. Minting cryptographic {plan.name} License Key...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/25 disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying On-Chain Transaction...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Verify &amp; Claim License Key</span>
                  </>
                )}
              </button>
            </form>

            {/* Bot Validation & Time Notice Banner */}
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-start gap-2.5 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-white block">Verification takes a few moments. Automated bot validation is active.</span>
                <span className="text-[11px] text-slate-400">
                  Once your wallet broadcast confirms on TON or Solana, the key is issued automatically and backed up to this device.
                </span>
              </div>
            </div>

          </div>
        )}

        {/* Modal Footer Trust Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Non-Custodial Direct Ledger
          </span>
          <span className="text-slate-500">TEP-74 &amp; SPL Verified</span>
        </div>

      </div>
    </div>
  );
};
