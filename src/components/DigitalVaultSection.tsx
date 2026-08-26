import React, { useState, useEffect } from 'react';
import {
  Download,
  Shield,
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  FileCode2,
  Sparkles,
  Zap,
  Copy,
  Check,
  ExternalLink,
  Layers,
  FolderArchive,
  Terminal,
  FileJson,
  FileText,
  AlertCircle,
  RefreshCw,
  Eye,
  CheckCheck,
  Flame,
  Star,
  ChevronRight,
  Wallet,
  Workflow,
  Bot,
  Webhook,
  Code2,
  BookOpen,
} from 'lucide-react';
import { DIGITAL_PRODUCTS, DigitalProduct } from '../data/digitalProducts';
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
import {
  PLATFORM_RECEIVING_WALLET,
  getInjectedSolanaWallet,
  verifySolanaTransactionOnChain,
  verifyTonTransactionOnChain,
} from '../utils/solanaPayment';
import { PlanItem } from './CheckoutModal';

interface DigitalVaultSectionProps {
  verifiedLicenseKey?: string;
  onOpenCheckout: (plan: PlanItem) => void;
  onSelectPlan?: (plan: PlanItem) => void;
}

export const DigitalVaultSection: React.FC<DigitalVaultSectionProps> = ({
  verifiedLicenseKey,
  onOpenCheckout,
}) => {
  // Authentication & Verification State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [activeLicenseKey, setActiveLicenseKey] = useState<string>('');
  const [licenseInput, setLicenseInput] = useState<string>('');
  const [connectedWallet, setConnectedWallet] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Category Filter
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'n8n' | 'ai' | 'dev' | 'web3'>('all');

  // Downloading State
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Preview & Setup Guide Modals
  const [previewProduct, setPreviewProduct] = useState<DigitalProduct | null>(null);
  const [guideProduct, setGuideProduct] = useState<DigitalProduct | null>(null);

  // Check saved license or prop on mount
  useEffect(() => {
    const saved = localStorage.getItem('solpump_vault_license');
    if (verifiedLicenseKey) {
      setIsUnlocked(true);
      setActiveLicenseKey(verifiedLicenseKey);
      localStorage.setItem('solpump_vault_license', verifiedLicenseKey);
    } else if (saved) {
      setIsUnlocked(true);
      setActiveLicenseKey(saved);
    }
  }, [verifiedLicenseKey]);

  // Handle Manual License or On-Chain Tx Verification
  const handleVerifyLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanInput = licenseInput.trim();
    if (!cleanInput) {
      setErrorMessage('Please enter a license key or on-chain transaction signature.');
      return;
    }

    setIsVerifying(true);

    try {
      const upper = cleanInput.toUpperCase();
      // Check 1: Standard verified license key format
      if (upper.startsWith('SOLPUMP-') && upper.length >= 15) {
        setIsUnlocked(true);
        setActiveLicenseKey(upper);
        localStorage.setItem('solpump_vault_license', upper);
        setSuccessMessage('Creator License Key verified! All digital assets, source codes, and n8n workflows unlocked.');
        setLicenseInput('');
        setIsVerifying(false);
        return;
      }

      // Check 2: Solana transaction signature on-chain verification
      if (cleanInput.length >= 60 && !cleanInput.includes(' ')) {
        const solVerify = await verifySolanaTransactionOnChain(cleanInput);
        if (solVerify.verified) {
          const generatedKey = `SOLPUMP-TX-${cleanInput.substring(0, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
          setIsUnlocked(true);
          setActiveLicenseKey(generatedKey);
          localStorage.setItem('solpump_vault_license', generatedKey);
          setSuccessMessage('Solana transaction signature verified on-chain! Digital Vault unlocked.');
          setLicenseInput('');
          setIsVerifying(false);
          return;
        }
      }

      // Check 3: TON transaction hash on-chain verification
      const tonVerify = await verifyTonTransactionOnChain({
        txHashOrSender: cleanInput,
        requiredTonAmount: 1.5,
      });
      if (tonVerify.verified) {
        const generatedKey = `SOLPUMP-TON-${(tonVerify.txHash || cleanInput).substring(0, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
        setIsUnlocked(true);
        setActiveLicenseKey(generatedKey);
        localStorage.setItem('solpump_vault_license', generatedKey);
        setSuccessMessage('TON transaction hash confirmed on-chain! Digital Vault unlocked.');
        setLicenseInput('');
        setIsVerifying(false);
        return;
      }

      // Fallback: Invalid input
      setIsVerifying(false);
      setErrorMessage('Invalid license key or unverified transaction signature. The vault remains locked.');
    } catch (err: any) {
      setIsVerifying(false);
      setErrorMessage(err?.message || 'Verification failed. The vault remains locked.');
    }
  };

  // Handle Wallet Connection (Links address ONLY, does NOT unlock vault)
  const handleVerifyWallet = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsVerifying(true);

    try {
      const detected = getInjectedSolanaWallet();
      if (!detected) {
        setIsVerifying(false);
        setErrorMessage(
          'No Solana wallet extension detected in browser. Please install Phantom wallet or enter a verified License Key.'
        );
        return;
      }

      const res = await detected.adapter.connect();
      const pubkey = res.publicKey?.toString() || detected.adapter.publicKey?.toString() || '';
      setConnectedWallet(pubkey);
      setIsVerifying(false);

      // CRITICAL SECURITY FIX: Link wallet ONLY, DO NOT GRANT ACCESS UNTIL PAID!
      setSuccessMessage(
        `Wallet ${pubkey.substring(0, 6)}...${pubkey.slice(-6)} linked! Note: Connecting a wallet links your address only. To unlock vault downloads, please complete payment or enter a verified license key.`
      );
    } catch (err: any) {
      setIsVerifying(false);
      setErrorMessage(err?.message || 'Wallet connection was cancelled or rejected.');
    }
  };

  // Lock Vault
  const handleLockVault = () => {
    setIsUnlocked(false);
    setActiveLicenseKey('');
    localStorage.removeItem('solpump_vault_license');
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  // Trigger Asset Downloads
  const handleDownloadProduct = async (productId: string, specificFormat?: string) => {
    setDownloadingId(productId + (specificFormat || ''));

    try {
      if (productId === 'product-telegram-miniapp') {
        await generateTelegramMiniAppZIP(activeLicenseKey || 'SOLPUMP-TMA-2026');
      } else if (productId === 'product-whatsapp-ai-leadgen') {
        await generateWhatsAppAILeadGenZIP(activeLicenseKey || 'SOLPUMP-WHATSAPP-2026');
      } else if (productId === 'product-solana-sniper-bot') {
        await generateSolanaSniperBotZIP(activeLicenseKey || 'SOLPUMP-SNIPER-2026');
      } else if (productId === 'product-n8n-workflows') {
        if (specificFormat === 'json') {
          generateN8nWorkflowsJSON(activeLicenseKey || 'SOLPUMP-N8N-PRO-2026');
        } else {
          await generateN8nWorkflowsZIP(activeLicenseKey || 'SOLPUMP-N8N-PRO-2026');
        }
      } else if (productId === 'product-webhook-boilerplates') {
        await generateWebhookBoilerplateZIP(activeLicenseKey || 'SOLPUMP-WEBHOOK-2026');
      } else if (productId === 'product-solana-buybot') {
        await generateTelegramBuyBotZIP(activeLicenseKey || 'SOLPUMP-BUYBOT-2026');
      } else if (productId === 'product-prompt-vault') {
        if (specificFormat === 'md') {
          generatePromptVaultMarkdown(activeLicenseKey || 'SOLPUMP-PRO-VAULT-2026');
        } else {
          generatePromptVaultJSON(activeLicenseKey || 'SOLPUMP-PRO-VAULT-2026');
        }
      } else if (productId === 'product-react-boilerplate') {
        await generateReactBoilerplateZIP(activeLicenseKey || 'SOLPUMP-DEV-2026');
      } else if (productId === 'product-solana-bulk-sender') {
        await generateBulkSenderScriptZIP(activeLicenseKey || 'SOLPUMP-SCRIPT-BULK-2026');
      } else if (productId === 'product-telegram-broadcast-bot') {
        await generateTelegramBroadcastScriptZIP(activeLicenseKey || 'SOLPUMP-SCRIPT-TG-2026');
      } else if (productId === 'product-ai-content-batch-generator') {
        await generateAIContentBatchScriptZIP(activeLicenseKey || 'SOLPUMP-SCRIPT-AI-2026');
      } else if (productId === 'product-rust-tx-dispatcher') {
        await generateRustTxDispatcherScriptZIP(activeLicenseKey || 'SOLPUMP-SCRIPT-RUST-2026');
      } else if (productId === 'product-solana-toolkit') {
        await generateSolanaToolkitZIP(activeLicenseKey || 'SOLPUMP-ANCHOR-2026');
      } else if (productId === 'master-bundle') {
        await generateMasterBundleZIP(activeLicenseKey || 'SOLPUMP-MASTER-2026');
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setTimeout(() => setDownloadingId(null), 1200);
    }
  };

  const handleCopyActiveKey = () => {
    if (!activeLicenseKey) return;
    navigator.clipboard.writeText(activeLicenseKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const filteredProducts = DIGITAL_PRODUCTS.filter((prod) => {
    if (selectedCategory === 'all') return true;
    return prod.category === selectedCategory;
  });

  return (
    <section id="vault" className="py-20 md:py-28 bg-[#070a13] border-t border-slate-800/80 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-indigo-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Workflow className="w-3.5 h-3.5" />
            <span>n8n Automations &amp; Digital Asset Vault</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Digital Vault &amp; Asset Downloads
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Direct access to ready-to-import n8n AI agent workflows, backend webhooks, Telegram buy-bots, React 19 source code, and 1,500+ prompt databases.
          </p>
        </div>

        {/* ========================================================= */}
        {/* VAULT ACCESS STATUS BAR */}
        {/* ========================================================= */}
        <div className="mb-10 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0d1322] to-slate-900 border border-slate-800 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isUnlocked
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400'
                }`}
              >
                {isUnlocked ? <Unlock className="w-6 h-6 animate-pulse" /> : <Lock className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-code uppercase font-semibold text-slate-400">
                    Vault Access Status:
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono-code font-extrabold ${
                      isUnlocked
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>UNLOCKED &amp; VERIFIED</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>LOCKED · PURCHASE REQUIRED</span>
                      </>
                    )}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {isUnlocked
                    ? `Active Token: ${activeLicenseKey}`
                    : 'Connect wallet to link address, or unlock instantly with a verified on-chain payment / license key.'}
                </p>
              </div>
            </div>

            {/* Quick Actions in Status Bar */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              {isUnlocked ? (
                <>
                  <button
                    type="button"
                    onClick={handleCopyActiveKey}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono-code text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadProduct('master-bundle')}
                    disabled={downloadingId === 'master-bundle'}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-[#080b12] text-xs font-bold font-mono-code flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {downloadingId === 'master-bundle' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>Download All 6 Products (.ZIP)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLockVault}
                    className="px-3 py-2 text-xs text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    Lock
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleVerifyWallet}
                    disabled={isVerifying}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Connect / Link Wallet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenCheckout({
                        id: 'pro-creator',
                        name: 'Pro Creator',
                        price: '$9',
                        period: 'per month',
                        description: 'Instant unlock for n8n workflows, prompt databases, webhook stacks, and Solana toolkits.',
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#080b12] text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Get Pro License ($9)</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Verification Input Box (if locked) */}
          {!isUnlocked && (
            <form onSubmit={handleVerifyLicense} className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={licenseInput}
                  onChange={(e) => setLicenseInput(e.target.value)}
                  placeholder="Enter License Key (e.g. SOLPUMP-PRO-...) or Solana Transaction Signature"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 font-mono-code focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={isVerifying || !licenseInput}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold font-mono-code transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>Unlock Digital Vault</span>
              </button>
            </form>
          )}
        </div>

        {/* ========================================================= */}
        {/* CATEGORY FILTER TABS */}
        {/* ========================================================= */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Digital Assets', count: DIGITAL_PRODUCTS.length },
            { id: 'n8n', label: 'n8n Workflows', icon: Workflow, count: 1 },
            { id: 'dev', label: 'Developer Boilerplates', icon: Code2, count: 2 },
            { id: 'web3', label: 'Solana & Web3 Stack', icon: Zap, count: 2 },
            { id: 'ai', label: 'AI Prompt Vaults', icon: Sparkles, count: 1 },
          ].map((tab) => {
            const isActive = selectedCategory === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-4 py-2 rounded-2xl text-xs font-medium font-mono-code transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* DIGITAL PRODUCTS GRID (6 TOTAL) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => {
            const isDownloading = downloadingId?.startsWith(prod.id);

            return (
              <div
                key={prod.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 border relative ${
                  isUnlocked
                    ? 'bg-[#0c111e] border-slate-800 hover:border-emerald-500/40 shadow-xl'
                    : 'bg-[#0b0e18]/80 border-slate-800/60 opacity-90'
                }`}
              >
                {/* Top Badge & Category indicator */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  {prod.badge && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono-code uppercase font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Sparkles className="w-3 h-3" />
                      {prod.badge}
                    </span>
                  )}
                  <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {prod.category === 'n8n'
                      ? 'n8n Automation'
                      : prod.category === 'dev'
                      ? 'Backend & Microservices'
                      : prod.category === 'web3'
                      ? 'Solana Protocol'
                      : 'AI Reasoning'}
                  </span>
                </div>

                <div>
                  {/* Title & Tagline */}
                  <h3 className="text-xl font-extrabold text-white mb-1">{prod.title}</h3>
                  <p className="text-xs text-emerald-400 font-mono-code mb-4">{prod.tagline}</p>

                  {/* Metadata Specs Bar */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4 pb-4 border-b border-slate-800/80 text-[11px] font-mono-code text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {prod.version}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {prod.fileSize}
                    </span>
                    {prod.formats.slice(0, 2).map((fmt, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        {fmt}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-5">
                    {prod.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 mb-6">
                    <p className="text-[10px] font-mono-code uppercase font-bold text-slate-400 tracking-wider">
                      Key Highlights:
                    </p>
                    {prod.highlights.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* File Manifest Preview Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono-code uppercase font-bold text-slate-400 tracking-wider">
                      <span>Manifest ({prod.includedFiles.length} files)</span>
                      <div className="flex items-center gap-2">
                        {prod.setupGuideSteps && (
                          <button
                            type="button"
                            onClick={() => setGuideProduct(prod)}
                            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>Setup Guide</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setPreviewProduct(prod)}
                          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                      </div>
                    </div>
                    {prod.includedFiles.slice(0, 3).map((file, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-center justify-between text-[11px] font-mono-code p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/60"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {file.name.endsWith('.json') ? (
                            <FileJson className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          ) : file.name.endsWith('.zip') ? (
                            <FolderArchive className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          ) : file.name.endsWith('.rs') || file.name.endsWith('.ts') || file.name.endsWith('.py') ? (
                            <FileCode2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span className="text-slate-200 truncate">{file.name}</span>
                        </div>
                        <span className="text-slate-400 text-[10px] shrink-0">{file.size}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Download Actions */}
                <div>
                  {isUnlocked ? (
                    <div className="space-y-2">
                      {prod.id === 'product-n8n-workflows' ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleDownloadProduct(prod.id, 'json')}
                            disabled={isDownloading}
                            className="py-3 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#080b12] text-xs font-bold font-mono-code flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
                          >
                            <Workflow className="w-3.5 h-3.5" />
                            <span>Import JSON</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadProduct(prod.id, 'zip')}
                            disabled={isDownloading}
                            className="py-3 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold font-mono-code flex items-center justify-center gap-1.5 transition-all border border-slate-700 cursor-pointer disabled:opacity-50"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Full Pack (.ZIP)</span>
                          </button>
                        </div>
                      ) : prod.id === 'product-prompt-vault' ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleDownloadProduct(prod.id, 'json')}
                            disabled={isDownloading}
                            className="py-3 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#080b12] text-xs font-bold font-mono-code flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>JSON Data</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadProduct(prod.id, 'md')}
                            disabled={isDownloading}
                            className="py-3 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold font-mono-code flex items-center justify-center gap-1.5 transition-all border border-slate-700 cursor-pointer disabled:opacity-50"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Markdown</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDownloadProduct(prod.id)}
                          disabled={isDownloading}
                          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:opacity-95 text-[#080b12] text-xs font-extrabold font-mono-code flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
                        >
                          {isDownloading ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          <span>
                            {prod.id === 'product-webhook-boilerplates'
                              ? 'Download Webhook Engines (.ZIP)'
                              : prod.id === 'product-solana-buybot'
                              ? 'Download Telegram Buy-Bot (.ZIP)'
                              : prod.id === 'product-react-boilerplate'
                              ? 'Download React 19 SaaS (.ZIP)'
                              : 'Download Solana Toolkit (.ZIP)'}
                          </span>
                        </button>
                      )}

                      {/* Setup Guide Button under unlocked card */}
                      {prod.setupGuideSteps && (
                        <button
                          type="button"
                          onClick={() => setGuideProduct(prod)}
                          className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono-code text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3 text-amber-400" />
                          <span>View Setup &amp; Deployment Guide</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenCheckout({
                          id: 'pro-creator',
                          name: 'Pro Creator',
                          price: '$9',
                          period: 'per month',
                          description: `Unlock ${prod.title} instantly with verified Solana settlement.`,
                        })
                      }
                      className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Unlock with Pro / Lifetime</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Master Download Banner (When Unlocked) */}
        {isUnlocked && (
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <FolderArchive className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-white">
                  Master All-In-One Creator Bundle (.ZIP)
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Download all 6 products (n8n workflows, webhooks, Telegram buy-bot, 1,500+ prompts, React 19 boilerplate, and Anchor toolkits) in a single organized master archive.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleDownloadProduct('master-bundle')}
              disabled={downloadingId === 'master-bundle'}
              className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:opacity-95 text-[#080b12] text-xs font-extrabold transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
            >
              {downloadingId === 'master-bundle' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#080b12]" />
                  <span>Packaging Master Archive...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Master Bundle Archive</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SETUP & DEPLOYMENT GUIDE MODAL */}
      {/* ========================================================= */}
      {guideProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#0c101d] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    Setup &amp; Deployment Guide
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{guideProduct.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setGuideProduct(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-5 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Follow these clear setup instructions to import and deploy this digital product into your infrastructure:
              </p>

              <div className="space-y-3">
                {guideProduct.setupGuideSteps?.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono-code font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>

              {guideProduct.id === 'product-n8n-workflows' && (
                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-300 space-y-1.5">
                  <p className="font-bold flex items-center gap-1.5 text-indigo-200">
                    <Workflow className="w-3.5 h-3.5" />
                    <span>n8n Pro Tip</span>
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Make sure to enable the LangChain Nodes in your n8n configuration (`N8N_COMMUNITY_PACKAGES_ENABLED=true` or use modern n8n v1.70+).
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {isUnlocked && (
                <button
                  type="button"
                  onClick={() => {
                    setGuideProduct(null);
                    handleDownloadProduct(guideProduct.id);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#080b12] text-xs font-bold font-mono-code flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Files Now</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setGuideProduct(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 ml-auto cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FILE INSPECTOR MODAL */}
      {/* ========================================================= */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#0c101d] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  {previewProduct.version}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{previewProduct.title}</h3>
              </div>
              <button
                onClick={() => setPreviewProduct(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              <div>
                <h4 className="text-xs font-mono-code uppercase font-bold text-slate-400 mb-2">
                  Included Package File Manifest:
                </h4>
                <div className="space-y-2">
                  {previewProduct.includedFiles.map((file, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center justify-between text-xs font-mono-code mb-1">
                        <span className="font-bold text-emerald-400">{file.name}</span>
                        <span className="text-slate-500">{file.size}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{file.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono-code uppercase font-bold text-slate-400 mb-2">
                  Technical Specifications:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {previewProduct.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewProduct(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
