import React, { useState, useEffect } from 'react';
import { getActiveReferrer, recordReferredPurchase } from '../utils/affiliateStorage';
import {
  X,
  Check,
  Shield,
  Zap,
  Lock,
  Coins,
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
  Terminal,
  Send,
} from 'lucide-react';
import {
  PLATFORM_RECEIVING_WALLET,
  PLATFORM_TON_RECEIVING_WALLET,
  fetchSolPriceUSD,
  fetchTonPriceUSD,
  calculateSolAmount,
  calculateTonAmount,
  getInjectedSolanaWallet,
  sendSolanaPayment,
  verifySolanaTransactionOnChain,
  verifyTonTransactionOnChain,
  WalletAdapter,
} from '../utils/solanaPayment';
import {
  generateTelegramMiniAppZIP,
  generateWhatsAppAILeadGenZIP,
  generateSolanaSniperBotZIP,
  generateBulkSenderScriptZIP,
  generateTelegramBroadcastScriptZIP,
  generateAIContentBatchScriptZIP,
  generateRustTxDispatcherScriptZIP,
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
  const [paymentMethod, setPaymentMethod] = useState<'solana' | 'ton'>('solana');
  const [tonTxInput, setTonTxInput] = useState('');

  // SOL & TON pricing state
  const [solPrice, setSolPrice] = useState<number>(175);
  const [tonPrice, setTonPrice] = useState<number>(5.50);
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
  const [copiedTonWallet, setCopiedTonWallet] = useState(false);
  const [copiedTonAmount, setCopiedTonAmount] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);

  // Download feedback
  const [activeDownload, setActiveDownload] = useState<string | null>(null);

  // Fetch live SOL and TON prices when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoadingPrice(true);
      Promise.all([
        fetchSolPriceUSD().then((price) => setSolPrice(price)).catch(() => {}),
        fetchTonPriceUSD().then((price) => setTonPrice(price)).catch(() => {}),
      ]).finally(() => {
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

  const { tonAmountFormatted, tonAmount } = calculateTonAmount(
    plan.price,
    tonPrice
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
          setIsProcessingTx(false);
          setTxError(
            'No Solana Web3 wallet (e.g. Phantom, Solflare) detected in your browser. Please install Phantom wallet extension to complete the on-chain transfer.'
          );
          return;
        }
      }

      setTxStepMessage('Verifying transaction signature on Solana RPC...');
      const verifyRes = await verifySolanaTransactionOnChain(finalSignature);
      if (!verifyRes.verified) {
        throw new Error(verifyRes.error || 'Transaction signature could not be verified on Solana RPC network. Vault remains locked.');
      }

      // Generate key & save ONLY after on-chain RPC confirmation!
      const newLicense = `SOLPUMP-${plan.id.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      
      // Track and credit affiliate commission if referrer exists
      const activeRef = getActiveReferrer();
      if (activeRef) {
        const numericUsd = parseFloat(plan.price.replace(/[^0-9.]/g, '')) || 9;
        recordReferredPurchase(activeRef, plan.id, plan.name, numericUsd, solPrice);
      }

      setTxSignature(finalSignature);
      setConfirmedSolPaid(`${solAmountFormatted} SOL`);
      setGeneratedLicense(newLicense);
      setIsProcessingTx(false);
      setIsSuccess(true);
      localStorage.setItem('solpump_vault_license', newLicense);
      if (onSuccessUnlock) onSuccessUnlock(newLicense);
    } catch (err: any) {
      console.error('Solana payment error:', err);
      setIsProcessingTx(false);
      const msg = err?.message || '';
      if (msg.includes('User rejected') || msg.includes('rejected')) {
        setTxError('Transaction was rejected in your wallet. The vault remains locked.');
      } else if (msg.includes('insufficient') || msg.includes('Attempt to debit')) {
        setTxError('Transaction failed: Insufficient SOL balance to cover transfer amount and network fee. The vault remains locked.');
      } else {
        setTxError(msg || 'Transaction failed. The vault remains locked.');
      }
    }
  };

  // Handle TON Coin Payment & Verification
  const handleTonPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxError(null);
    setIsProcessingTx(true);
    setTxStepMessage('Initiating TON payment verification...');

    try {
      let hashToVerify = tonTxInput.trim();

      // Check if injected TON Web3 wallet is available
      const win = window as any;
      const tonWallet = win.ton || win.tonkeeper || win.okxwallet?.ton;

      if (!hashToVerify && tonWallet && typeof tonWallet.send === 'function') {
        try {
          setTxStepMessage('Requesting TON transaction in wallet extension...');
          const txResult = await tonWallet.send('ton_sendTransaction', [
            {
              to: PLATFORM_TON_RECEIVING_WALLET,
              value: Math.round(tonAmount * 1e9).toString(),
              data: `SolPump ${plan.name} License`,
            },
          ]);
          if (txResult && txResult.boc) {
            hashToVerify = txResult.boc;
          }
        } catch (tonErr: any) {
          throw new Error('TON transaction was rejected or cancelled in your wallet. Vault remains locked.');
        }
      }

      if (!hashToVerify) {
        setIsProcessingTx(false);
        setTxError('Please enter your TON Transaction Hash or Sender Wallet Address to verify payment on-chain.');
        return;
      }

      setTxStepMessage('Verifying TON transaction on blockchain ledger...');
      const verifyRes = await verifyTonTransactionOnChain({
        txHashOrSender: hashToVerify,
        requiredTonAmount: tonAmount,
      });

      if (!verifyRes.verified) {
        throw new Error(verifyRes.error || 'Transaction not found or unconfirmed on TON ledger. Vault remains locked.');
      }

      const confirmedHash = verifyRes.txHash || hashToVerify;
      const newLicense = `SOLPUMP-${plan.id.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      
      const activeRef = getActiveReferrer();
      if (activeRef) {
        const numericUsd = parseFloat(plan.price.replace(/[^0-9.]/g, '')) || 9;
        recordReferredPurchase(activeRef, plan.id, plan.name, numericUsd, solPrice);
      }

      setIsProcessingTx(false);
      setIsSuccess(true);
      setTxSignature(confirmedHash);
      setConfirmedSolPaid(`${tonAmountFormatted} TON`);
      setGeneratedLicense(newLicense);
      localStorage.setItem('solpump_vault_license', newLicense);
      if (onSuccessUnlock) onSuccessUnlock(newLicense);
    } catch (err: any) {
      console.error('TON payment error:', err);
      setIsProcessingTx(false);
      const msg = err?.message || '';
      if (msg.includes('rejected') || msg.includes('cancelled')) {
        setTxError('Transaction was cancelled or rejected. The vault remains locked.');
      } else {
        setTxError(msg || 'Verification failed. Please ensure exact TON payment was sent.');
      }
    }
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

  const handleCopyTonWallet = () => {
    navigator.clipboard.writeText(PLATFORM_TON_RECEIVING_WALLET);
    setCopiedTonWallet(true);
    setTimeout(() => setCopiedTonWallet(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(solAmountFormatted);
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleCopyTonAmount = () => {
    navigator.clipboard.writeText(tonAmountFormatted);
    setCopiedTonAmount(true);
    setTimeout(() => setCopiedTonAmount(false), 2000);
  };

  const handleCopyTx = () => {
    navigator.clipboard.writeText(txSignature);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  // Asset downloads from success modal
  const handleTriggerDownload = async (
    type: 'script-bulk-zip' | 'script-tg-zip' | 'script-ai-zip' | 'script-rust-zip' | 'telegram-zip' | 'whatsapp-zip' | 'sniper-zip' | 'n8n-json' | 'n8n-zip' | 'webhooks-zip' | 'buybot-zip' | 'prompts-json' | 'prompts-md' | 'react-zip' | 'anchor-zip' | 'all'
  ) => {
    setActiveDownload(type);
    try {
      if (type === 'script-bulk-zip') {
        await generateBulkSenderScriptZIP(generatedLicense || 'SOLPUMP-SCRIPT-BULK-2026');
      } else if (type === 'script-tg-zip') {
        await generateTelegramBroadcastScriptZIP(generatedLicense || 'SOLPUMP-SCRIPT-TG-2026');
      } else if (type === 'script-ai-zip') {
        await generateAIContentBatchScriptZIP(generatedLicense || 'SOLPUMP-SCRIPT-AI-2026');
      } else if (type === 'script-rust-zip') {
        await generateRustTxDispatcherScriptZIP(generatedLicense || 'SOLPUMP-SCRIPT-RUST-2026');
      } else if (type === 'telegram-zip') {
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
    setTonTxInput('');
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
                <span>
                  {confirmedSolPaid.includes('TON')
                    ? 'TON Blockchain Payment Verified'
                    : 'Solana Blockchain Payment Verified'}
                </span>
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
                  {confirmedSolPaid.includes('SOL') || confirmedSolPaid.includes('TON')
                    ? `${confirmedSolPaid} (~${plan.price} USD)`
                    : `${confirmedSolPaid} SOL (~${plan.price} USD)`}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-mono-code">Platform Recipient:</span>
                <span className="font-mono-code text-[11px] text-slate-300">
                  {confirmedSolPaid.includes('TON')
                    ? `${PLATFORM_TON_RECEIVING_WALLET.substring(0, 6)}...${PLATFORM_TON_RECEIVING_WALLET.slice(-6)}`
                    : `${PLATFORM_RECEIVING_WALLET.substring(0, 6)}...${PLATFORM_RECEIVING_WALLET.slice(-6)}`}
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
                    {txSignature.length > 10 && (
                      <a
                        href={
                          confirmedSolPaid.includes('TON')
                            ? `https://tonviewer.eu/`
                            : `https://solscan.io/tx/${txSignature}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
                      >
                        <span>{confirmedSolPaid.includes('TON') ? 'Tonviewer' : 'Solscan'}</span>
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
                {/* Script: Bulk Token Sender */}
                <button
                  type="button"
                  onClick={() => handleTriggerDownload('script-bulk-zip')}
                  disabled={!!activeDownload}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left transition-all flex flex-col justify-between cursor-pointer disabled:opacity-50 group"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      Solana Bulk Sender
                    </p>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono-code font-bold">
                      Python CLI
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-code text-slate-400 mt-2 flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-amber-400" />
                    <span>Airdrop Engine (.ZIP)</span>
                  </span>
                </button>

                {/* Script: Telegram Broadcast Bot */}
                <button
                  type="button"
                  onClick={() => handleTriggerDownload('script-tg-zip')}
                  disabled={!!activeDownload}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left transition-all flex flex-col justify-between cursor-pointer disabled:opacity-50 group"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Telegram Broadcaster
                    </p>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono-code font-bold">
                      Node.js
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-code text-slate-400 mt-2 flex items-center gap-1">
                    <Bot className="w-3 h-3 text-emerald-400" />
                    <span>Anti-Flood Bot (.ZIP)</span>
                  </span>
                </button>

                {/* Script: AI Content Generator */}
                <button
                  type="button"
                  onClick={() => handleTriggerDownload('script-ai-zip')}
                  disabled={!!activeDownload}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left transition-all flex flex-col justify-between cursor-pointer disabled:opacity-50 group"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                      AI Batch Content
                    </p>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono-code font-bold">
                      Python AI
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-code text-slate-400 mt-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Markdown Bot (.ZIP)</span>
                  </span>
                </button>

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

            {/* Plan & Converted Rate Summary */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0e1424] to-slate-900 border border-slate-800 mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">{plan.name}</p>
                <p className="text-[11px] text-slate-400 font-mono-code">{plan.period}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono-code mt-1">
                  {paymentMethod === 'solana' ? (
                    <span>1 SOL ≈ ${solPrice.toFixed(2)} USD</span>
                  ) : (
                    <span>1 TON ≈ ${tonPrice.toFixed(2)} USD</span>
                  )}
                  {isLoadingPrice && <RefreshCw className="w-2.5 h-2.5 animate-spin" />}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-white font-mono-code">
                  {paymentMethod === 'solana' ? (
                    <>
                      {solAmountFormatted} <span className="text-emerald-400 text-lg">SOL</span>
                    </>
                  ) : (
                    <>
                      {tonAmountFormatted} <span className="text-cyan-400 text-lg">TON</span>
                    </>
                  )}
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
                onClick={() => setPaymentMethod('ton')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'ton'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Coins className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pay with TON (TON)</span>
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
              /* TON COIN PAYMENT FLOW */
              <form onSubmit={handleTonPayment} className="space-y-4">
                {/* Instructions banner */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-950 border border-cyan-500/30 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-cyan-300">
                    <Coins className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Pay with TON Coin (The Open Network)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Send exact TON amount from any wallet (Tonkeeper, MyTonWallet, Telegram @wallet) to the platform receiving address below.
                  </p>
                </div>

                {/* Platform TON Wallet Address Card */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400">
                    <span className="text-cyan-400 font-semibold">Official Platform TON Receiving Wallet:</span>
                    <button
                      type="button"
                      onClick={handleCopyTonWallet}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      {copiedTonWallet ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedTonWallet ? 'Copied' : 'Copy Address'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                    <span className="font-mono-code text-xs text-white select-all break-all font-semibold">
                      {PLATFORM_TON_RECEIVING_WALLET}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400 pt-1">
                    <span>Required TON Transfer:</span>
                    <button
                      type="button"
                      onClick={handleCopyTonAmount}
                      className="text-white hover:text-cyan-400 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <span>{tonAmountFormatted} TON</span>
                      {copiedTonAmount ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Transaction Verification Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono-code">
                    TON Transaction Hash / Sender Address (For Verification):
                  </label>
                  <input
                    type="text"
                    value={tonTxInput}
                    onChange={(e) => setTonTxInput(e.target.value)}
                    placeholder="e.g. 5aef8c... or your TON Wallet Address"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono-code placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <p className="text-[10px] text-slate-500 mt-1 font-mono-code">
                    Enter transaction hash or sender wallet to accelerate automated on-chain verification.
                  </p>
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={isProcessingTx}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 hover:opacity-95 active:scale-[0.98] text-slate-950 text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingTx ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>{txStepMessage || 'Verifying TON Payment...'}</span>
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4" />
                      <span>Confirm TON Transfer &amp; Unlock Vault</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono-code">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-cyan-400" />
                    Non-Custodial TON Settlement
                  </span>
                  <span>Instant Access Delivery</span>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
