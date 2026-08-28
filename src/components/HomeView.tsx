import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  RotateCcw,
  Copy,
  Check,
  Zap,
  Terminal,
  FolderArchive,
  ArrowRight,
  ShieldCheck,
  Code2,
  Download,
  Coins,
  FileCode2,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Cpu,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import {
  generateTelegramMiniAppZIP,
  generateWhatsAppAILeadGenZIP,
  generateSolanaSniperBotZIP,
  generateBulkSenderScriptZIP,
  generateN8nWorkflowsZIP,
  generatePromptVaultMarkdown,
} from '../utils/assetGenerators';

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  codeSnippet?: {
    language: string;
    code: string;
    title?: string;
  };
  interactiveWidget?: 'solana-fee' | 'bitcoin-calc' | 'json-validator' | 'key-masker' | 'vault-download';
  widgetData?: any;
  quickAction?: {
    label: string;
    sectionId: string;
    icon?: 'zap' | 'terminal' | 'vault' | 'shield' | 'code' | 'coins' | 'store';
  };
}

interface HomeViewProps {
  onNavigate: (sectionId: string) => void;
  onOpenLogin?: () => void;
}

const CAPABILITY_CHIPS = [
  {
    icon: <Zap className="w-4 h-4 text-cyan-400" />,
    title: 'Solana Priority Fees',
    desc: 'Estimate compute units & micro-lamports',
    prompt: 'Calculate Solana priority fee and compute units for a fast DEX swap transaction.',
  },
  {
    icon: <FolderArchive className="w-4 h-4 text-purple-400" />,
    title: 'Telegram Mini-App ZIP',
    desc: '1-click tap-to-earn game template',
    prompt: 'Give me the Telegram Mini-App and Clicker Game template with 1-click ZIP download.',
  },
  {
    icon: <Terminal className="w-4 h-4 text-emerald-400" />,
    title: 'Solana Airdrop Script',
    desc: 'Batch distribution engine source code',
    prompt: 'Show me the open-source Solana Bulk Airdrop Engine TypeScript script.',
  },
  {
    icon: <Coins className="w-4 h-4 text-amber-400" />,
    title: 'Bitcoin Sats & Fees',
    desc: 'Convert satoshis, vBytes & mempool rates',
    prompt: 'Convert 50,000 satoshis to BTC and calculate Bitcoin tx fee at 25 sat/vB for a SegWit transaction.',
  },
  {
    icon: <Code2 className="w-4 h-4 text-indigo-400" />,
    title: 'JSON RPC Formatter',
    desc: 'Validate Solana & Bitcoin RPC payloads',
    prompt: 'Help me format and validate a Solana getLatestBlockhash JSON-RPC payload.',
  },
  {
    icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
    title: 'Jito MEV Protection',
    desc: 'Anti-frontrun bundle script',
    prompt: 'How do I protect Solana transactions from sandwich attacks and frontrunning using Jito MEV bundles?',
  },
];

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [downloadingZip, setDownloadingZip] = useState<string | null>(null);

  // In-stream interactive widget local states
  const [solCuLimit, setSolCuLimit] = useState(300000);
  const [solMicroLamports, setSolMicroLamports] = useState(50000);
  const [btcSatAmount, setBtcSatAmount] = useState(50000);
  const [btcFeeRate, setBtcFeeRate] = useState(25);
  const [jsonInput, setJsonInput] = useState('{"jsonrpc":"2.0","id":1,"method":"getLatestBlockhash","params":[{"commitment":"finalized"}]}');
  const [jsonFormatted, setJsonFormatted] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [keyToMask, setKeyToMask] = useState('5KnbzN5yS8V6j9BvL5wP8xQz2rE3tY4uI1oP0aS9dF8gH7jK6lZ5x');
  const [maskedResult, setMaskedResult] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Adjust textarea height dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  // 1-Click ZIP generator directly in the chat stream
  const handleDownloadAsset = async (assetType: string) => {
    setDownloadingZip(assetType);
    try {
      if (assetType === 'miniapp') {
        await generateTelegramMiniAppZIP('FREE-DEV-SOLPUMP-2026');
      } else if (assetType === 'whatsapp') {
        await generateWhatsAppAILeadGenZIP('FREE-DEV-SOLPUMP-2026');
      } else if (assetType === 'sniper') {
        await generateSolanaSniperBotZIP('FREE-DEV-SOLPUMP-2026');
      } else if (assetType === 'airdrop') {
        await generateBulkSenderScriptZIP('FREE-DEV-SOLPUMP-2026');
      } else if (assetType === 'n8n') {
        await generateN8nWorkflowsZIP('FREE-DEV-SOLPUMP-2026');
      } else if (assetType === 'prompts') {
        await generatePromptVaultMarkdown('FREE-DEV-SOLPUMP-2026');
      }
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setTimeout(() => setDownloadingZip(null), 1200);
    }
  };

  // Dynamic intent solver & fallbacks for instant Web3 responses
  const resolveDynamicWeb3Response = (query: string): {
    content: string;
    codeSnippet?: { language: string; code: string; title?: string };
    interactiveWidget?: ChatMessage['interactiveWidget'];
    quickAction?: ChatMessage['quickAction'];
  } => {
    const q = query.toLowerCase();

    // 1. Solana Priority Fees & Gas Suite
    if (q.includes('fee') || q.includes('gas') || q.includes('compute unit') || q.includes('lamport') || q.includes('priority')) {
      return {
        content: `### ⚡ Solana Priority & Gas Fee Suite

Solana transactions utilize a two-tier fee structure:
1. **Base Network Fee**: Fixed at **5,000 lamports (0.000005 SOL)** per transaction signature.
2. **Compute Unit (CU) Price**: An optional prioritization fee measured in **Micro-Lamports per Compute Unit**.

Total fee formula:
$$\\text{Total Fee (SOL)} = 0.000005 + \\left(\\frac{\\text{Compute Limit} \\times \\text{Micro-Lamports}}{10^{15}}\\right)$$

You can test and adjust live parameters directly in the interactive widget below:`,
        interactiveWidget: 'solana-fee',
        codeSnippet: {
          language: 'typescript',
          title: 'Solana Compute Budget Instruction',
          code: `import { ComputeBudgetProgram, Transaction, Keypair } from '@solana/web3.js';

// 1. Set explicit compute unit limit
const setLimit = ComputeBudgetProgram.setComputeUnitLimit({
  units: 300_000, // Standard DEX swap consumes ~300k CU
});

// 2. Set priority price in micro-lamports per CU
const setPrice = ComputeBudgetProgram.setComputeUnitPrice({
  microLamports: 50_000, // 50,000 micro-lamports per CU
});

// 3. Attach instructions BEFORE your transfers/swaps
const tx = new Transaction()
  .add(setLimit)
  .add(setPrice);`,
        },
        quickAction: {
          label: 'Launch Full Fee Estimator Workspace',
          sectionId: 'gas-calculator',
          icon: 'zap',
        },
      };
    }

    // 2. Bitcoin & UTXO Fee Calculator
    if (q.includes('bitcoin') || q.includes('btc') || q.includes('sat') || q.includes('satoshi') || q.includes('vbyte')) {
      return {
        content: `### 🪙 Bitcoin UTXO & Satoshi Fee Engine

Bitcoin transaction fees are calculated purely on transaction size in **virtual bytes (vBytes)** rather than the amount of BTC transferred.

Key conversions:
- **$1\\text{ BTC} = 100,000,000\\text{ Satoshis (sats)}$**
- **$1\\text{ Satoshi} = 0.00000001\\text{ BTC}$**
- **Native SegWit (P2WPKH)**: ~140 vBytes
- **Taproot (P2TR)**: ~110 vBytes
- **Legacy (P2PKH)**: ~225 vBytes

Use the live Satoshi & Fee calculator below:`,
        interactiveWidget: 'bitcoin-calc',
        codeSnippet: {
          language: 'python',
          title: 'Bitcoin Tx Fee Estimation in Python',
          code: `def calculate_bitcoin_fee(tx_vbytes: int, sat_per_vbyte: float, btc_usd_price: float = 94000.0):
    total_satoshis = int(tx_vbytes * sat_per_vbyte)
    total_btc = total_satoshis / 100_000_000
    total_usd = total_btc * btc_usd_price
    
    return {
        "satoshis": total_satoshis,
        "btc": f"{total_btc:.8f}",
        "usd": f"\${total_usd:.4f}"
    }

# Estimate for a 140 vByte Native SegWit tx at 25 sat/vB
result = calculate_bitcoin_fee(140, 25.0)
print(f"Fee: {result['satoshis']} sats ({result['btc']} BTC / {result['usd']})")`,
        },
        quickAction: {
          label: 'Open Web3 Developer Micro-Tools',
          sectionId: 'utility-tools',
          icon: 'code',
        },
      };
    }

    // 3. Telegram Mini-App & VIP Vault Downloads
    if (q.includes('miniapp') || q.includes('mini-app') || q.includes('clicker') || q.includes('telegram') || q.includes('vault') || q.includes('download') || q.includes('zip')) {
      return {
        content: `### 📦 VIP Digital Asset Vault (1-Click Instant Downloads)

All templates and automation pipelines are client-side compiled and **100% free to download**:

1. **Telegram Mini-App & Clicker Game**: Full React 18 + Vite + Tailwind + @twa-dev/sdk with tap-to-earn mechanics, local state, and TON wallet integration stubs.
2. **WhatsApp AI Auto-Responder**: Node.js automated assistant with QR code auth and sentiment routing.
3. **Solana Token Sniper**: Python async websocket script monitoring Raydium / Pump.fun liquidity pools.
4. **n8n AI Automation Workflows**: 1-click importable JSON pipelines for Discord alerts and CRM sync.
5. **1,500+ Curated AI Master Prompts**: Markdown & CSV prompt libraries for trading, coding, and copywriting.

You can trigger a verified download immediately below:`,
        interactiveWidget: 'vault-download',
        quickAction: {
          label: 'Open Full Digital Asset Vault',
          sectionId: 'vault',
          icon: 'vault',
        },
      };
    }

    // 4. Developer Scripts (Airdrop, Jito MEV, Sniper)
    if (q.includes('airdrop') || q.includes('jito') || q.includes('mev') || q.includes('frontrun') || q.includes('script') || q.includes('bot')) {
      return {
        content: `### 🛠️ Developer Scripts Vault: Solana Bulk Airdrop & Jito MEV

We provide battle-tested, open-source automation scripts for Solana:

#### 1. Solana Bulk Airdrop Engine (TypeScript)
- Distributes SPL tokens or native SOL to 1,000+ wallets.
- Automated chunking (10 recipients per transaction) to prevent exceeding max transaction size.
- Exponential backoff retries and dynamic priority fee pricing.

#### 2. Jito MEV Protection
- Submits transactions directly as private bundles to Jito Block Engine validators.
- Eliminates public mempool visibility to prevent sandwich attacks.`,
        codeSnippet: {
          language: 'typescript',
          title: 'Solana Bulk Airdrop Engine Core Chunking',
          code: `import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

interface AirdropRecipient {
  address: string;
  amountLamports: number;
}

// 1. Chunk array into max 10 transfers per transaction
export function chunkRecipients(recipients: AirdropRecipient[], chunkSize = 10): AirdropRecipient[][] {
  const chunks: AirdropRecipient[][] = [];
  for (let i = 0; i < recipients.length; i += chunkSize) {
    chunks.push(recipients.slice(i, i + chunkSize));
  }
  return chunks;
}

// 2. Build and dispatch batch transaction
export async function createAirdropBatchTx(
  sender: PublicKey,
  batch: AirdropRecipient[]
): Promise<Transaction> {
  const tx = new Transaction();
  for (const item of batch) {
    tx.add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: new PublicKey(item.address),
        lamports: item.amountLamports,
      })
    );
  }
  return tx;
}`,
        },
        quickAction: {
          label: 'Explore All Developer Scripts',
          sectionId: 'developer-scripts',
          icon: 'terminal',
        },
      };
    }

    // 5. JSON RPC Formatter & Validator
    if (q.includes('json') || q.includes('rpc') || q.includes('payload') || q.includes('format') || q.includes('validate')) {
      return {
        content: `### 🔧 JSON-RPC Payload Formatter & Validator

Web3 RPC nodes (Solana, Bitcoin, EVM) require strictly formatted JSON-RPC 2.0 requests.

Standard Solana RPC format:
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getLatestBlockhash",
  "params": [{ "commitment": "finalized" }]
}
\`\`\`

Test, validate, and beautify your raw JSON payload below:`,
        interactiveWidget: 'json-validator',
        quickAction: {
          label: 'Open Interactive Micro-Tools',
          sectionId: 'utility-tools',
          icon: 'code',
        },
      };
    }

    // 6. Security / Key Obfuscation
    if (q.includes('key') || q.includes('mask') || q.includes('obfuscate') || q.includes('private') || q.includes('secret') || q.includes('safe')) {
      return {
        content: `### 🛡️ Secret Key Obfuscator & Non-Custodial Safety

**Never share raw Base58 private keys or seed phrases in public chat or error logs.**

- **SolPump Store operates with 100% client-side execution**: Private keys, prompts, and payloads are processed entirely in browser memory.
- **Client-Side Obfuscation**: Masks the sensitive inner bytes while retaining the prefix and suffix for verification.

Test key masking below:`,
        interactiveWidget: 'key-masker',
        quickAction: {
          label: 'View Trust & Security Hub',
          sectionId: 'trust-legal-hub',
          icon: 'shield',
        },
      };
    }

    // General fallback
    return {
      content: `### 🤖 SolPump Web3 AI Copilot

I can dynamically assist you with:
- **⚡ Solana Gas & Priority Fees**: Real-time compute unit pricing & priority multipliers.
- **🪙 Bitcoin & UTXO Mechanics**: Satoshi conversions, vByte estimation & fee rates.
- **🛠️ Open-Source Developer Scripts**: Bulk airdrop engines, Jito MEV protection, Telegram broadcast bots.
- **📦 VIP Digital Asset Vault**: 1-click free ZIP downloads (Telegram Mini-App, WhatsApp AI Lead Bot, n8n Workflows).
- **🔧 Client-Side Micro-Tools**: JSON RPC formatters, key obfuscation, and prompt optimizers.

Feel free to ask a specific technical question or select an option below!`,
      quickAction: {
        label: 'Explore Complete Developer Ecosystem',
        sectionId: 'utility-tools',
        icon: 'code',
      },
    };
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const text = (customPrompt || inputValue).trim();
    if (!text || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // 1. Query server-side Gemini AI endpoint
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userMessage: text,
        }),
      });

      const data = await res.json().catch(() => null);

      if (data && data.success && data.reply) {
        const dynamicMeta = resolveDynamicWeb3Response(text);
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          codeSnippet: dynamicMeta.codeSnippet,
          interactiveWidget: dynamicMeta.interactiveWidget,
          quickAction: dynamicMeta.quickAction,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsLoading(false);
        return;
      }
    } catch {
      // Fallback cleanly on server errors
    }

    // 2. High-speed client knowledge fallback
    setTimeout(() => {
      const dynamicMeta = resolveDynamicWeb3Response(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: dynamicMeta.content,
        codeSnippet: dynamicMeta.codeSnippet,
        interactiveWidget: dynamicMeta.interactiveWidget,
        quickAction: dynamicMeta.quickAction,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonFormatted(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON format');
      setJsonFormatted(null);
    }
  };

  const handleMaskKey = () => {
    if (!keyToMask || keyToMask.length < 10) {
      setMaskedResult('Key too short to obfuscate safely');
      return;
    }
    const prefix = keyToMask.slice(0, 4);
    const suffix = keyToMask.slice(-4);
    const middle = '•'.repeat(Math.max(12, keyToMask.length - 8));
    setMaskedResult(`${prefix}${middle}${suffix}`);
  };

  // Real-time Solana fee calculations
  const solBaseFeeSol = 0.000005;
  const solPriorityFeeSol = (solCuLimit * solMicroLamports) / 1000000000000000;
  const solTotalFeeSol = solBaseFeeSol + solPriorityFeeSol;
  const solEstimatedUsd = solTotalFeeSol * 185; // ~$185 SOL

  // Real-time Bitcoin fee calculations
  const btcTotalSats = 140 * btcFeeRate; // 140 vBytes native segwit
  const btcTotalBtc = btcTotalSats / 100000000;
  const btcTotalUsd = btcTotalBtc * 94000; // ~$94k BTC

  return (
    <div className="flex-1 flex flex-col items-center justify-between min-h-[calc(100vh-4.5rem)] px-4 py-6 sm:px-6 relative z-10 w-full max-w-5xl mx-auto">
      {/* Top Header / AI Status Bar */}
      <div className="w-full flex items-center justify-between py-2 mb-4 border-b border-slate-800/60 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-900 border border-slate-700/80">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span className="font-bold text-white tracking-tight">SolPump AI Studio</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-[10px] font-mono-code text-slate-300">
            Gemini 3.7 • Web3 Engine
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono-code hidden sm:inline text-slate-300">Client Sandbox Ready</span>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => setMessages([])}
              className="ml-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-3 h-3" />
              <span>New Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Conversation Stream or Welcoming Zero-State */}
      <div className="flex-1 w-full flex flex-col justify-start overflow-y-auto space-y-6 pb-6">
        {messages.length === 0 ? (
          /* Zero-State: Sleek, Centered ChatGPT / AI Studio Welcome */
          <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-10 space-y-8 animate-in fade-in duration-300">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono-code uppercase font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Web3 &amp; Solana Intelligence</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                What Web3 tools or scripts do you need?
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Ask for live Solana fee estimates, Bitcoin calculations, open-source automation scripts, or 1-click downloadable ZIP templates.
              </p>
            </div>

            {/* Capability Starter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full max-w-4xl pt-2">
              {CAPABILITY_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(chip.prompt)}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-[#0a0b10] hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 text-left transition-all duration-200 group cursor-pointer shadow-lg shadow-black/40 relative overflow-hidden"
                >
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-105 transition-transform shrink-0">
                    {chip.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {chip.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                      {chip.desc}
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Active Chat Stream */
          <div className="w-full space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-1 shadow-inner">
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </div>
                )}

                <div
                  className={`w-full max-w-3xl rounded-2xl p-4 sm:p-5 leading-relaxed space-y-3.5 ${
                    msg.role === 'user'
                      ? 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tr-xs shadow-md ml-auto'
                      : 'bg-[#0a0b10] border border-slate-800/90 text-slate-200 rounded-tl-xs shadow-lg'
                  }`}
                >
                  {/* Markdown / Text Content */}
                  <div className="space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {msg.content.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h3 key={pIdx} className="text-sm sm:text-base font-bold text-white pt-1">
                            {paragraph.replace('### ', '')}
                          </h3>
                        );
                      }
                      if (paragraph.startsWith('#### ')) {
                        return (
                          <h4 key={pIdx} className="text-xs sm:text-sm font-bold text-cyan-300 pt-1">
                            {paragraph.replace('#### ', '')}
                          </h4>
                        );
                      }
                      return (
                        <p key={pIdx} className="whitespace-pre-line">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>

                  {/* IN-STREAM INTERACTIVE WIDGET: Solana Fee Calculator */}
                  {msg.interactiveWidget === 'solana-fee' && (
                    <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-4 my-3 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2 text-cyan-400 font-bold">
                          <Sliders className="w-4 h-4" />
                          <span>Interactive Solana Priority Fee Simulator</span>
                        </div>
                        <span className="text-[10px] font-mono-code text-slate-400">Live Compute Units</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Compute Units Slider */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-slate-400 text-[11px]">
                            <span>Compute Unit Limit:</span>
                            <span className="font-mono text-white">{solCuLimit.toLocaleString()} CU</span>
                          </div>
                          <input
                            type="range"
                            min={50000}
                            max={1400000}
                            step={50000}
                            value={solCuLimit}
                            onChange={(e) => setSolCuLimit(Number(e.target.value))}
                            className="w-full accent-cyan-400 cursor-pointer"
                          />
                        </div>

                        {/* Priority Price Slider */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-slate-400 text-[11px]">
                            <span>Priority Multiplier:</span>
                            <span className="font-mono text-cyan-400">
                              {solMicroLamports.toLocaleString()} micro-lamports
                            </span>
                          </div>
                          <input
                            type="range"
                            min={1000}
                            max={500000}
                            step={5000}
                            value={solMicroLamports}
                            onChange={(e) => setSolMicroLamports(Number(e.target.value))}
                            className="w-full accent-cyan-400 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Live Calculation Output Card */}
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-mono">Estimated Total Fee</div>
                          <div className="text-sm font-bold font-mono text-emerald-400">
                            {solTotalFeeSol.toFixed(6)} SOL
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 uppercase font-mono">USD Approx (@ $185)</div>
                          <div className="text-sm font-bold font-mono text-white">
                            ${solEstimatedUsd.toFixed(4)} USD
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* IN-STREAM INTERACTIVE WIDGET: Bitcoin Calculator */}
                  {msg.interactiveWidget === 'bitcoin-calc' && (
                    <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-4 my-3 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2 text-amber-400 font-bold">
                          <Coins className="w-4 h-4" />
                          <span>Bitcoin Satoshi &amp; Fee Rate Converter</span>
                        </div>
                        <span className="text-[10px] font-mono-code text-slate-400">Native SegWit (140 vB)</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] text-slate-400">Amount in Satoshis:</label>
                          <input
                            type="number"
                            value={btcSatAmount}
                            onChange={(e) => setBtcSatAmount(Number(e.target.value))}
                            className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-slate-400">Mempool Fee Rate (sat/vB):</label>
                          <input
                            type="number"
                            value={btcFeeRate}
                            onChange={(e) => setBtcFeeRate(Number(e.target.value))}
                            className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-amber-400 text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-2 gap-2 text-center">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-mono">Converted BTC</div>
                          <div className="text-xs sm:text-sm font-bold font-mono text-white">
                            {(btcSatAmount / 100000000).toFixed(8)} BTC
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-mono">140 vB Tx Fee</div>
                          <div className="text-xs sm:text-sm font-bold font-mono text-amber-400">
                            {btcTotalSats} sats (${btcTotalUsd.toFixed(3)})
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* IN-STREAM INTERACTIVE WIDGET: 1-Click Vault Downloads */}
                  {msg.interactiveWidget === 'vault-download' && (
                    <div className="p-4 rounded-2xl bg-slate-950/90 border border-purple-500/30 space-y-3 my-3 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2 text-purple-400 font-bold">
                          <FolderArchive className="w-4 h-4" />
                          <span>1-Click Free Client-Side ZIP Generator</span>
                        </div>
                        <span className="text-[10px] font-mono-code text-slate-400">SHA-256 Verified</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleDownloadAsset('miniapp')}
                          disabled={downloadingZip !== null}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-left transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <Download className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                            <div>
                              <div className="font-bold text-white text-xs">Telegram Mini-App</div>
                              <div className="text-[10px] text-slate-400 font-mono">React + Vite + SDK (.ZIP)</div>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-mono font-bold">
                            {downloadingZip === 'miniapp' ? 'Generating...' : 'FREE'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadAsset('whatsapp')}
                          disabled={downloadingZip !== null}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-left transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <Download className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                            <div>
                              <div className="font-bold text-white text-xs">WhatsApp AI Lead Bot</div>
                              <div className="text-[10px] text-slate-400 font-mono">Node.js + Baileys (.ZIP)</div>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono font-bold">
                            {downloadingZip === 'whatsapp' ? 'Generating...' : 'FREE'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadAsset('sniper')}
                          disabled={downloadingZip !== null}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-left transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <Download className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                            <div>
                              <div className="font-bold text-white text-xs">Solana Token Sniper</div>
                              <div className="text-[10px] text-slate-400 font-mono">Python Websocket (.ZIP)</div>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono font-bold">
                            {downloadingZip === 'sniper' ? 'Generating...' : 'FREE'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadAsset('n8n')}
                          disabled={downloadingZip !== null}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <Download className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                            <div>
                              <div className="font-bold text-white text-xs">n8n Automation Workflows</div>
                              <div className="text-[10px] text-slate-400 font-mono">1-Click JSON import (.ZIP)</div>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono font-bold">
                            {downloadingZip === 'n8n' ? 'Generating...' : 'FREE'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* IN-STREAM INTERACTIVE WIDGET: JSON Formatter */}
                  {msg.interactiveWidget === 'json-validator' && (
                    <div className="p-4 rounded-2xl bg-slate-950/90 border border-indigo-500/30 space-y-3 my-3 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2 text-indigo-400 font-bold">
                          <Code2 className="w-4 h-4" />
                          <span>Interactive JSON-RPC Formatter</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleFormatJson}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-[10px] transition-colors cursor-pointer"
                        >
                          Validate &amp; Format
                        </button>
                      </div>

                      <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        rows={3}
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-slate-300 text-xs focus:outline-none focus:border-indigo-400"
                        placeholder="Paste raw JSON RPC payload here..."
                      />

                      {jsonFormatted && (
                        <div className="p-3 rounded-xl bg-[#07090e] border border-emerald-500/30 font-mono text-[11px] text-emerald-300 overflow-x-auto whitespace-pre">
                          {jsonFormatted}
                        </div>
                      )}

                      {jsonError && (
                        <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-400 text-xs">
                          {jsonError}
                        </div>
                      )}
                    </div>
                  )}

                  {/* IN-STREAM INTERACTIVE WIDGET: Key Obfuscator */}
                  {msg.interactiveWidget === 'key-masker' && (
                    <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-3 my-3 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Secret Key Sanitizer</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleMaskKey}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-[10px] transition-colors cursor-pointer"
                        >
                          Mask Bytes
                        </button>
                      </div>

                      <input
                        type="text"
                        value={keyToMask}
                        onChange={(e) => setKeyToMask(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-slate-300 text-xs focus:outline-none focus:border-emerald-400"
                        placeholder="Enter Base58 key to mask..."
                      />

                      {maskedResult && (
                        <div className="p-3 rounded-xl bg-[#07090e] border border-emerald-500/40 flex items-center justify-between font-mono text-xs text-emerald-400">
                          <span>{maskedResult}</span>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(maskedResult)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* IN-STREAM CODE SNIPPET BLOCK */}
                  {msg.codeSnippet && (
                    <div className="rounded-2xl bg-[#06080e] border border-slate-800 p-3 sm:p-4 font-mono text-xs text-slate-300 relative group overflow-hidden">
                      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800/80 text-[11px] text-slate-400">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{msg.codeSnippet.title || 'Code Snippet'}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {msg.codeSnippet.language}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(msg.codeSnippet!.code, msg.id)}
                            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[11px]"
                          >
                            {copiedCodeId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <pre className="text-slate-300 overflow-x-auto whitespace-pre leading-relaxed text-[11px] sm:text-xs">
                        {msg.codeSnippet.code}
                      </pre>
                    </div>
                  )}

                  {/* IN-STREAM QUICK ACTION NAVIGATION BUTTON */}
                  {msg.quickAction && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => onNavigate(msg.quickAction!.sectionId)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-white transition-all cursor-pointer shadow-sm hover:border-cyan-500/40"
                      >
                        {msg.quickAction.icon === 'zap' && <Zap className="w-3.5 h-3.5 text-cyan-400" />}
                        {msg.quickAction.icon === 'terminal' && (
                          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        {msg.quickAction.icon === 'vault' && (
                          <FolderArchive className="w-3.5 h-3.5 text-purple-400" />
                        )}
                        {msg.quickAction.icon === 'shield' && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        {msg.quickAction.icon === 'code' && <Code2 className="w-3.5 h-3.5 text-indigo-400" />}
                        {msg.quickAction.icon === 'coins' && <Coins className="w-3.5 h-3.5 text-amber-400" />}
                        {msg.quickAction.icon === 'store' && <Cpu className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{msg.quickAction.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 text-right pt-1 font-mono">
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-1 shadow-inner">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Loader */}
            {isLoading && (
              <div className="flex gap-3 sm:gap-4 justify-start">
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                </div>
                <div className="bg-[#0a0b10] border border-slate-800 rounded-2xl rounded-tl-xs p-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-slate-400 pl-2 font-mono-code">Synthesizing Web3 solution...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Sticky/Fixed Centered Bottom Input Dock (ChatGPT & Google AI Studio Style) */}
      <div className="w-full sticky bottom-0 pt-3 pb-1 bg-gradient-to-t from-[#080b12] via-[#080b12]/95 to-transparent">
        {/* Quick Suggestion Pills */}
        {messages.length > 0 && !isLoading && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-[11px]">
            <span className="text-slate-400 font-mono-code shrink-0">Quick ask:</span>
            {CAPABILITY_CHIPS.slice(0, 4).map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip.prompt)}
                className="shrink-0 px-3 py-1 rounded-full bg-[#0a0b10] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {chip.title}
              </button>
            ))}
          </div>
        )}

        {/* Input Form Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex flex-col bg-[#0a0b10] border border-slate-800/90 focus-within:border-cyan-500/70 rounded-2xl shadow-2xl shadow-black/80 transition-all overflow-hidden"
        >
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask SolPump AI anything about Solana scripts, Bitcoin fees, or free ZIP templates..."
            rows={1}
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none resize-none min-h-[48px] max-h-[160px] py-3.5 px-4 font-sans leading-relaxed"
          />

          <div className="flex items-center justify-between px-3 py-2 border-t border-slate-800/60 bg-slate-950/40 text-xs">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono-code">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="hidden sm:inline">Non-Custodial Sandbox</span>
              <span className="hidden md:inline">• Enter to send</span>
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                inputValue.trim() && !isLoading
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-[#080b12] shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
              }`}
              aria-label="Send message"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <div className="text-center pt-2 text-[10px] text-slate-400 font-mono-code">
          SolPump AI v2.5 • Non-Custodial Architecture • Private keys and payloads never leave your browser
        </div>
      </div>
    </div>
  );
};
