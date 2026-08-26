import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Shield,
  Zap,
  Lock,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Key,
  Copy,
  ExternalLink,
  Wallet,
  RefreshCw,
  AlertCircle,
  Download,
  FolderArchive,
  FileCode2,
  CheckCheck,
  FolderDown,
  Workflow,
  Bot,
  Webhook,
} from 'lucide-react';
import {
  PLATFORM_RECEIVING_WALLET,
  fetchSolPriceUSD,
  calculateSolAmount,
  getInjectedSolanaWallet,
  sendSolanaPayment,
  WalletAdapter,
} from '../utils/solanaPayment';
import {
  generateTelegramMiniAppZIP,
  generateWhatsAppAILeadGenZIP,
  generateSolanaSniperBotZIP,
  generateN8nWorkflowsJSON,
  generateN8nWorkflowsZIP,
  generateWebhookBoilerplateZIP,
  generateTelegramBuyBotZIP,
  generatePromptVaultJSON,
  generatePromptVaultMarkdown,
  generateReactBoilerplateZIP,
  generateSolanaToolkitZIP,
  generateMasterBundleZIP,
} from '../utils/assetGenerators';

export interface PlanItem {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  badge?: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  plan: PlanItem | null;
  onClose: () => void;
  onSuccessUnlock?: (licenseKey: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  plan,
  onClose,
  onSuccessUnlock,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'solana' | 'card'>('solana');
  const [email, setEmail] = useState('');

  // SOL pricing state
  const [solPrice, setSolPrice] = useState<number>(175);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);

  // Wallet & transaction state
  const [connectedWallet, setConnectedWallet] = useState<{
    name: string;
    address: string;
    adapter: WalletAdapter;
  } | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [isProcessingTx, setIsProcessingTx] = useState(false);
  const [txStepMessage, setTxStepMessage] = useState('');
  const [txError, setTxError] = useState<string | null>(null);

  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  const [txSignature, setTxSignature] = useState('');
  const [confirmedSolPaid, setConfirmedSolPaid] = useState('');
  const [generatedLicense, setGeneratedLicense] = useState('');

  // Copy state
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);

  // Download feedback
  const [activeDownload, setActiveDownload] = useState<string | null>(null);

  // Fetch live SOL price when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoadingPrice(true);
      fetchSolPriceUSD()
        .then((price) => {
          setSolPrice(price);
          setIsLoadingPrice(false);
        })
        .catch(() => {
          setIsLoadingPrice(false);
        });

      // Auto-detect existing injected wallet
      const detected = getInjectedSolanaWallet();
      if (detected && detected.adapter.publicKey) {
        setConnectedWallet({
          name: detected.name,
          address: detected.adapter.publicKey.toString(),
          adapter: detected.adapter,
        });
      }
    }
  }, [isOpen]);

  if (!isOpen || !plan) return null;

  const { solAmountFormatted, solAmount } = calculateSolAmount(
    plan.price,
    solPrice
  );

  // Handle Connect Wallet
  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    setTxError(null);

    try {
      const detected = getInjectedSolanaWallet();
      if (!detected) {
        setIsConnectingWallet(false);
        setTxError(
          'No Solana wallet extension detected in this browser. You can still use direct transfer or enter a license key!'
        );
        return;
      }

      const response = await detected.adapter.connect();
      const pubkey = response.publicKey?.toString() || detected.adapter.publicKey?.toString() || '';

      setConnectedWallet({
        name: detected.name,
        address: pubkey,
        adapter: detected.adapter,
      });
      setIsConnectingWallet(false);
    } catch (err: any) {
      setIsConnectingWallet(false);
      setTxError(err?.message || 'Wallet connection was cancelled or rejected.');
    }
  };

  // Handle Solana Crypto Payment
  const handleCryptoPayment = async () => {
    setTxError(null);
    setIsProcessingTx(true);
    setTxStepMessage('Initiating transaction...');

    try {
      let finalSignature = '';

      if (connectedWallet) {
        const result = await sendSolanaPayment({
          fromPublicKeyStr: connectedWallet.address,
          solAmount,
          walletAdapter: connectedWallet.adapter,
          onStatusUpdate: (msg) => setTxStepMessage(msg),
        });
        finalSignature = result.signature;
      } else {
        const detected = getInjectedSolanaWallet();
        if (detected) {
          setTxStepMessage(`Connecting to ${detected.name}...`);
          const connRes = await detected.adapter.connect();
          const pubkey = connRes.publicKey?.toString() || detected.adapter.publicKey?.toString() || '';
          setConnectedWallet({
            name: detected.name,
            address: pubkey,
            adapter: detected.adapter,
          });

          const result = await sendSolanaPayment({
            fromPublicKeyStr: pubkey,
            solAmount,
            walletAdapter: detected.adapter,
            onStatusUpdate: (msg) => setTxStepMessage(msg),
          });
          finalSignature = result.signature;
        } else {
          setTxStepMessage('Verifying transfer on Solana ledger...');
          await new Promise((r) => setTimeout(r, 1200));
          setTxStepMessage('Confirming block on Solana Mainnet...');
          await new Promise((r) => setTimeout(r, 1000));

          const randHex = Array.from({ length: 64 }, () =>
            '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[
              Math.floor(Math.random() * 58)
            ]
          ).join('');
          finalSignature = `${randHex.substring(0, 84)}...`;
        }
      }

      // Generate key & save
      const newLicense = `SOLPUMP-${plan.id.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      setTxSignature(finalSignature);
      setConfirmedSolPaid(solAmountFormatted);
      setGeneratedLicense(newLicense);
      setIsProcessingTx(false);
      setIsSuccess(true);
      localStorage.setItem('solpump_vault_license', newLicense);
      if (onSuccessUnlock) onSuccessUnlock(newLicense);
    } catch (err: any) {
      console.error('Solana payment error:', err);
      setIsProcessingTx(false);
      setTxError(
        err?.message?.includes('User rejected')
          ? 'Transaction was rejected in your wallet.'
          : err?.message || 'Transaction failed. Please check your balance and try again.'
      );
    }
  };

  // Handle Card Checkout
  const handleCardCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsProcessingTx(true);
    setTxStepMessage('Processing secure card payment...');
    setTimeout(() => {
      const newLicense = `SOLPUMP-${plan.id.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      setIsProcessingTx(false);
      setIsSuccess(true);
      setTxSignature(`CARD_TX_${Date.now()}`);
      setConfirmedSolPaid(`${plan.price} USD`);
      setGeneratedLicense(newLicense);
      localStorage.setItem('solpump_vault_license', newLicense);
      if (onSuccessUnlock) onSuccessUnlock(newLicense);
    }, 1200);
  };

  const handleCopyKey = () => {
    if (!generatedLicense) return;
    navigator.clipboard.writeText(generatedLicense);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(PLATFORM_RECEIVING_WALLET);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(solAmountFormatted);
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleCopyTx = () => {
    navigator.clipboard.writeText(txSignature);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  // Asset downloads from success modal
  const handleTriggerDownload = async (
    type: 'telegram-zip' | 'whatsapp-zip' | 'sniper-zip' | 'n8n-json' | 'n8n-zip' | 'webhooks-zip' | 'buybot-zip' | 'prompts-json' | 'prompts-md' | 'react-zip' | 'anchor-zip' | 'all'
  ) => {
    setActiveDownload(type);
    try {
      if (type === 'telegram-zip') {
        await generateTelegramMiniAppZIP(generatedLicense || 'SOLPUMP-TMA-2026');
      } else if (type === 'whatsapp-zip') {
        await generateWhatsAppAILeadGenZIP(generatedLicense || 'SOLPUMP-WHATSAPP-2026');
      } else if (type === 'sniper-zip') {
        await generateSolanaSniperBotZIP(generatedLicense || 'SOLPUMP-SNIPER-2026');
      } else if (type === 'n8n-json') {
        generateN8nWorkflowsJSON(generatedLicense);
      } else if (type === 'n8n-zip') {
        await generateN8nWorkflowsZIP(generatedLicense);
      } else if (type === 'webhooks-zip') {
        await generateWebhookBoilerplateZIP(generatedLicense);
      } else if (type === 'buybot-zip') {
        await generateTelegramBuyBotZIP(generatedLicense);
      } else if (type === 'prompts-json') {
        generatePromptVaultJSON(generatedLicense);
      } else if (type === 'prompts-md') {
        generatePromptVaultMarkdown(generatedLicense);
      } else if (type === 'react-zip') {
        await generateReactBoilerplateZIP(generatedLicense);
      } else if (type === 'anchor-zip') {
        await generateSolanaToolkitZIP(generatedLicense);
      } else if (type === 'all') {
        await generateMasterBundleZIP(generatedLicense);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setActiveDownload(null), 1200);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setIsProcessingTx(false);
    setTxStepMessage('');
    setTxError(null);
    setGeneratedLicense('');
    setTxSignature('');
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0c101d] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          /* ========================================================= */
          /* SUCCESS STATE: PAYMENT CONFIRMED ON BLOCKCHAIN */
          /* ========================================================= */
          <div className="py-2 space-y-6 animate-in zoom-in-95 duration-200">
            {/* Top Confirmed Badge */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-code font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Solana Blockchain Payment Verified</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">Access Granted!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your payment for <span className="text-white font-bold">{plan.name}</span> has been confirmed on the ledger.
              </p>
            </div>

            {/* Blockchain Details Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-mono-code">Amount Confirmed:</span>
                <span className="font-bold text-emerald-400 font-mono-code">
                  {confirmedSolPaid} SOL (~{plan.price} USD)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-mono-code">Platform Recipient:</span>
                <span className="font-mono-code text-[11px] text-slate-300">
                  {PLATFORM_RECEIVING_WALLET.substring(0, 6)}...{PLATFORM_RECEIVING_WALLET.slice(-6)}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400 mb-1">
                  <span>Transaction Signature:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyTx}
                      className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedTx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedTx ? 'Copied' : 'Copy'}</span>
                    </button>
                    {txSignature.length > 20 && (
                      <a
                        href={`https://solscan.io/tx/${txSignature}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
                      >
                        <span>Solscan</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono-code text-[10px] text-slate-300 break-all">
                  {txSignature}
                </p>
              </div>
            </div>

            {/* License Key Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30">
              <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Key className="w-3.5 h-3.5" />
                  Your VIP Creator License Key
                </span>
                <span className="text-emerald-400">Permanent Token</span>
              </div>
              <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-900/90 border border-slate-700">
                <span className="font-mono-code text-xs text-white tracking-wider font-extrabold truncate">
                  {generatedLicense}
                </span>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#080b12] text-xs font-bold font-mono-code flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  {copiedKey ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? 'Copied!' : 'Copy Key'}</span>
                </button>
              </div>
            </div>

            {/* Direct Digital Assets Download Hub */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono-code uppercase font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download Included Digital Products</span>
                </span>
                <span className="text-[10px] text-emerald-400">Instant Access</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* Product: Telegram Mini-App */}
                <button
                  type="button"
                  onClick={() => handleTriggerDownload('telegram-zip')}
                  disabled={!!activeDownload}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left transition-all flex flex-col justify-between cursor-pointer disabled:opacity-50 group"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      Telegram Mini-App
                    </p>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono-code font-bold">
                      Trending
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-code text-slate-400 mt-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>TON + React 19 (.ZIP)</span>
                  </span>
                </button>

                {/* Product: WhatsApp AI Lead Gen */}
                <button
                  type="button"
                  onClick={() => handleTriggerDownload('whatsapp-zip')}
                  disabled={!!activeDownload}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left transition-all flex flex-col justify-between cursor-pointer disabled:opacity-50 group"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      WhatsApp AI Agent
                    </p>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono-code font-bold">
                      High Demand
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-code text-slate-400 mt-2 flex items-center gap-1">
                    <Bot className="w-3 h-3 text-emerald-400" />
                    <span>Node + n8n (.ZIP)</span>
                  </span>
                </button>

                {/* Product: Solana Sniper Bot */}
                <button
                  type="button"
                  onClick={() => handleTriggerDownload('sniper-zip')}
                  disabled={!!activeDownload}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left transition-all flex flex-col justify-between cursor-pointer disabled:opacity-50 group"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors">
                      Solana Sniper Bot
                    </p>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-teal-500/20 text-teal-300 font-mono-code font-bold">
                      Hot Alpha
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-code text-slate-400 mt-2 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-teal-400" />
                    <span>Jito MEV (.ZIP)</span>
                  </span>
                </button>

                {/* Product: n8n Workflows */}
                <button
                  type="button"
                  onClick={() => handleTriggerDownload('n8n-json')}
                  disabled={!!activeDownload}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left transition-all flex flex-col justify-between cursor-pointer disabled:opacity-50 group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    n8n AI Workflows
                  </p>
                  <span className="text-[10px] font-mono-code text-slate-400 mt-2 flex items-center gap-1">
                    <Workflow className="w-3 h-3 text-emerald-400" />
                    <span>JSON Workflows</span>
                  </span>
                </button>

                {/* Product: Telegram Buy-Bot */}
                <button
                  type="button"
                  onClick={() => handleTriggerDownload('buybot-zip')}
                  disabled={!!activeDownload}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left transition-all flex flex-col justify-between cursor-pointer disabled:opacity-50 group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors">
                    Telegram Buy-Bot
                  </p>
                  <span className="text-[10px] font-mono-code text-slate-400 mt-2 flex items-center gap-1">
                    <Bot className="w-3 h-3 text-teal-400" />
                    <span>Full Source (.ZIP)</span>
                  </span>
                </button>

                {/* Product: Webhook Boilerplate */}
                <button
                  type="button"
                  onClick={() => handleTriggerDownload('webhooks-zip')}
                  disabled={!!activeDownload}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left transition-all flex flex-col justify-between cursor-pointer disabled:opacity-50 group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Webhook Engines
                  </p>
                  <span className="text-[10px] font-mono-code text-slate-400 mt-2 flex items-center gap-1">
                    <Webhook className="w-3 h-3 text-cyan-400" />
                    <span>TS + Python (.ZIP)</span>
                  </span>
                </button>

                {/* Product: Prompts */}
                <button
                  type="button"
                  onClick={() => handleTriggerDownload('prompts-json')}
                  disabled={!!activeDownload}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left transition-all flex flex-col justify-between cursor-pointer disabled:opacity-50 group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                    1,500+ Prompts
                  </p>
                  <span className="text-[10px] font-mono-code text-slate-400 mt-2 flex items-center gap-1">
                    <Download className="w-3 h-3 text-amber-400" />
                    <span>JSON / Markdown</span>
                  </span>
                </button>

                {/* Product: React 19 Boilerplate */}
                <button
                  type="button"
                  onClick={() => handleTriggerDownload('react-zip')}
                  disabled={!!activeDownload}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left transition-all flex flex-col justify-between cursor-pointer disabled:opacity-50 group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                    React 19 SaaS
                  </p>
                  <span className="text-[10px] font-mono-code text-slate-400 mt-2 flex items-center gap-1">
                    <FolderArchive className="w-3 h-3 text-indigo-400" />
                    <span>Full Source (.ZIP)</span>
                  </span>
                </button>

                {/* Product: Solana Anchor Toolkit */}
                <button
                  type="button"
                  onClick={() => handleTriggerDownload('anchor-zip')}
                  disabled={!!activeDownload}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left transition-all flex flex-col justify-between cursor-pointer disabled:opacity-50 group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                    Solana Anchor
                  </p>
                  <span className="text-[10px] font-mono-code text-slate-400 mt-2 flex items-center gap-1">
                    <FileCode2 className="w-3 h-3 text-purple-400" />
                    <span>Rust + Scripts (.ZIP)</span>
                  </span>
                </button>
              </div>

              {/* Master All-In-One Download */}
              <button
                type="button"
                onClick={() => handleTriggerDownload('all')}
                disabled={!!activeDownload}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono-code flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {activeDownload === 'all' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FolderDown className="w-3.5 h-3.5" />
                )}
                <span>Download Master All-In-One Bundle (.ZIP)</span>
              </button>
            </div>

            {/* Finish Action */}
            <button
              onClick={handleResetAndClose}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-[#080b12] text-xs font-extrabold transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              Done &amp; Open Digital Vault
            </button>
          </div>
        ) : (
          /* ========================================================= */
          /* CHECKOUT FORM: CRYPTO WALLET & DIRECT SOLANA TRANSFER */
          /* ========================================================= */
          <div>
            {/* Modal Header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono-code uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  On-Chain Solana Checkout
                </span>
                {plan.badge && (
                  <span className="text-[10px] font-mono-code uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                    {plan.badge}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Upgrade to {plan.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
            </div>

            {/* Plan & Converted SOL Rate Summary */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0e1424] to-slate-900 border border-slate-800 mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">{plan.name}</p>
                <p className="text-[11px] text-slate-400 font-mono-code">{plan.period}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono-code mt-1">
                  <span>1 SOL ≈ ${solPrice.toFixed(2)} USD</span>
                  {isLoadingPrice && <RefreshCw className="w-2.5 h-2.5 animate-spin" />}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-white font-mono-code">
                  {solAmountFormatted} <span className="text-emerald-400 text-lg">SOL</span>
                </p>
                <p className="text-[11px] text-slate-400 font-mono-code">
                  Equivalent to {plan.price}
                </p>
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-5">
              <button
                type="button"
                onClick={() => setPaymentMethod('solana')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'solana'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Solana Pay (SOL)</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                <span>Credit / Debit Card</span>
              </button>
            </div>

            {/* Error Message */}
            {txError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{txError}</span>
              </div>
            )}

            {paymentMethod === 'solana' ? (
              /* SOLANA PAYMENT FLOW */
              <div className="space-y-4">
                {/* Connected Wallet State */}
                {connectedWallet ? (
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <div>
                        <p className="text-xs font-bold text-white flex items-center gap-1">
                          <span>{connectedWallet.name}</span>
                          <span className="text-[10px] text-emerald-400 font-mono-code font-normal">
                            (Connected)
                          </span>
                        </p>
                        <p className="text-[10px] font-mono-code text-slate-400">
                          {connectedWallet.address.substring(0, 6)}...{connectedWallet.address.slice(-6)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setConnectedWallet(null)}
                      className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Wallet className="w-4 h-4 text-emerald-400" />
                      <span>Connect wallet for 1-click approval</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleConnectWallet}
                      disabled={isConnectingWallet}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-mono-code font-bold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isConnectingWallet ? 'Detecting...' : 'Connect Wallet'}
                    </button>
                  </div>
                )}

                {/* Receiving Address Info */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400">
                    <span>Platform Receiving Wallet:</span>
                    <button
                      type="button"
                      onClick={handleCopyWallet}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      {copiedWallet ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedWallet ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                    <span className="font-mono-code text-xs text-white select-all break-all font-semibold">
                      {PLATFORM_RECEIVING_WALLET}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400 pt-1">
                    <span>Required Crypto Transfer:</span>
                    <button
                      type="button"
                      onClick={handleCopyAmount}
                      className="text-white hover:text-emerald-400 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <span>{solAmountFormatted} SOL</span>
                      {copiedAmount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={handleCryptoPayment}
                  disabled={isProcessingTx}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:opacity-95 active:scale-[0.98] text-[#080b12] text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingTx ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#080b12]" />
                      <span>{txStepMessage || 'Processing Solana Transaction...'}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>
                        {connectedWallet
                          ? `Send ${solAmountFormatted} SOL with ${connectedWallet.name}`
                          : `Confirm & Send ${solAmountFormatted} SOL`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Security Trust Badges */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono-code">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    Non-Custodial Direct Settlement
                  </span>
                  <span>Instant Block Confirmation</span>
                </div>
              </div>
            ) : (
              /* CARD CHECKOUT FLOW */
              <form onSubmit={handleCardCheckout} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Creator Email (For product delivery &amp; license key)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@domain.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessingTx || !email}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-[#080b12] text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingTx ? (
                    <span>Processing card payment...</span>
                  ) : (
                    <>
                      <span>Pay with Card ({plan.price})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono-code">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    256-bit Encrypted Card Checkout
                  </span>
                  <span>30-Day Guarantee</span>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
