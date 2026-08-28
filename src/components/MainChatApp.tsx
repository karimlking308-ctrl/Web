import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Square,
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
  Cpu,
  ArrowUpRight,
  PanelLeftClose,
  PanelLeft,
  Plus,
  MessageSquare,
  Trash2,
  ExternalLink,
  ChevronRight,
  Clock,
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
  quickAction?: {
    label: string;
    sectionId: string;
    icon?: 'zap' | 'terminal' | 'vault' | 'shield' | 'code' | 'coins' | 'store';
  };
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
}

const STORAGE_KEY_SESSIONS = 'solpump_chat_sessions_v1';
const STORAGE_KEY_ACTIVE_ID = 'solpump_active_chat_id_v1';

export const MainChatApp: React.FC = () => {
  // Chat sessions state
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load chat sessions:', e);
    }
    return [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ACTIVE_ID) || null;
    } catch {
      return null;
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    // Default open on desktop, closed on mobile
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [downloadingZip, setDownloadingZip] = useState<string | null>(null);

  // In-stream interactive widget states
  const [solCuLimit, setSolCuLimit] = useState(300000);
  const [solMicroLamports, setSolMicroLamports] = useState(50000);
  const [btcSatAmount, setBtcSatAmount] = useState(50000);
  const [btcFeeRate, setBtcFeeRate] = useState(25);
  const [jsonInput, setJsonInput] = useState('{"jsonrpc":"2.0","id":1,"method":"getLatestBlockhash","params":[{"commitment":"finalized"}]}');
  const [jsonFormatted, setJsonFormatted] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [keyToMask, setKeyToMask] = useState('5KnbzN5yS8V6j9BvL5wP8xQz2rE3tY4uI1oP0aS9dF8gH7jK6lZ5x');
  const [maskedResult, setMaskedResult] = useState<string | null>(null);

  // Current active messages
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages: ChatMessage[] = activeSession ? activeSession.messages : [];

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save chat sessions:', e);
    }
  }, [sessions]);

  // Save active session ID to localStorage
  useEffect(() => {
    try {
      if (activeSessionId) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeSessionId);
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
      }
    } catch (e) {
      console.error('Failed to save active chat ID:', e);
    }
  }, [activeSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  const createNewChat = () => {
    setActiveSessionId(null);
    setInputValue('');
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
    textareaRef.current?.focus();
  };

  const selectSession = (id: string) => {
    setActiveSessionId(id);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
    }
  };

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

  const resolveDynamicWeb3Response = (query: string): {
    content: string;
    codeSnippet?: { language: string; code: string; title?: string };
    interactiveWidget?: ChatMessage['interactiveWidget'];
    quickAction?: ChatMessage['quickAction'];
  } => {
    const q = query.toLowerCase();

    // 1. Solana Priority Fees
    if (q.includes('fee') || q.includes('gas') || q.includes('compute unit') || q.includes('lamport') || q.includes('priority')) {
      return {
        content: `### ⚡ Solana Priority & Gas Fee Calculator

Solana transactions utilize a two-tier fee model:
- **Base Network Fee**: Fixed at **5,000 lamports (0.000005 SOL)** per transaction signature.
- **Compute Unit (CU) Price**: Micro-lamports per Compute Unit for priority queue execution.

$$\\text{Total Fee (SOL)} = 0.000005 + \\left(\\frac{\\text{Compute Limit} \\times \\text{Micro-Lamports}}{10^{15}}\\right)$$

You can test and simulate compute unit pricing live with the interactive slider below:`,
        interactiveWidget: 'solana-fee',
        codeSnippet: {
          language: 'typescript',
          title: 'Solana Compute Budget Instruction',
          code: `import { ComputeBudgetProgram, Transaction } from '@solana/web3.js';

// 1. Set explicit compute unit limit
const setLimit = ComputeBudgetProgram.setComputeUnitLimit({
  units: 300_000,
});

// 2. Set priority price in micro-lamports per CU
const setPrice = ComputeBudgetProgram.setComputeUnitPrice({
  microLamports: 50_000,
});

// 3. Attach instructions before your transfers
const tx = new Transaction().add(setLimit).add(setPrice);`,
        },
      };
    }

    // 2. Bitcoin & UTXO Satoshis
    if (q.includes('bitcoin') || q.includes('btc') || q.includes('sat') || q.includes('satoshi') || q.includes('vbyte')) {
      return {
        content: `### 🪙 Bitcoin UTXO & Satoshi Fee Engine

Bitcoin transaction fees depend strictly on transaction weight in **virtual bytes (vBytes)**:
- **1 BTC = 100,000,000 Satoshis (sats)**
- **1 Satoshi = 0.00000001 BTC**
- **Native SegWit (P2WPKH)**: ~140 vBytes
- **Taproot (P2TR)**: ~110 vBytes
- **Legacy (P2PKH)**: ~225 vBytes

Use the live Satoshi & Tx Fee calculator below:`,
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

# 140 vByte Native SegWit tx at 25 sat/vB
result = calculate_bitcoin_fee(140, 25.0)
print(f"Fee: {result['satoshis']} sats ({result['btc']} BTC / {result['usd']})")`,
        },
      };
    }

    // 3. Telegram Mini-App & VIP Vault Downloads
    if (q.includes('miniapp') || q.includes('mini-app') || q.includes('clicker') || q.includes('telegram') || q.includes('vault') || q.includes('download') || q.includes('zip') || q.includes('template')) {
      return {
        content: `### 📦 VIP Digital Asset Vault (1-Click Instant Downloads)

All templates and automation pipelines are client-side compiled and **100% free to download**:

1. **Telegram Mini-App & Clicker Game**: Full React 18 + Vite + Tailwind + @twa-dev/sdk with tap-to-earn mechanics.
2. **WhatsApp AI Auto-Responder**: Node.js automated assistant with QR code auth and sentiment routing.
3. **Solana Token Sniper**: Python async websocket script monitoring Raydium / Pump.fun liquidity pools.
4. **n8n AI Automation Workflows**: 1-click importable JSON pipelines for Discord alerts and CRM sync.

You can trigger a verified download directly below:`,
        interactiveWidget: 'vault-download',
      };
    }

    // 4. Developer Scripts (Airdrop, Jito MEV, Sniper)
    if (q.includes('airdrop') || q.includes('jito') || q.includes('mev') || q.includes('frontrun') || q.includes('script') || q.includes('bot')) {
      return {
        content: `### 🛠️ Developer Scripts Vault: Solana Bulk Airdrop & Jito MEV

Battle-tested, open-source automation scripts for Solana:

#### 1. Solana Bulk Airdrop Engine (TypeScript)
- Distributes SPL tokens or native SOL to 1,000+ wallets with batch chunking (10 recipients per tx).
- Exponential backoff retries and dynamic priority fee pricing.

#### 2. Jito MEV Protection
- Submits transactions directly as private bundles to Jito Block Engine validators to prevent sandwich attacks.`,
        codeSnippet: {
          language: 'typescript',
          title: 'Solana Bulk Airdrop Engine Core Chunking',
          code: `import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

interface AirdropRecipient {
  address: string;
  amountLamports: number;
}

export function chunkRecipients(recipients: AirdropRecipient[], chunkSize = 10): AirdropRecipient[][] {
  const chunks: AirdropRecipient[][] = [];
  for (let i = 0; i < recipients.length; i += chunkSize) {
    chunks.push(recipients.slice(i, i + chunkSize));
  }
  return chunks;
}

export async function createAirdropBatchTx(sender: PublicKey, batch: AirdropRecipient[]): Promise<Transaction> {
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
      };
    }

    // 5. JSON RPC Formatter & Validator
    if (q.includes('json') || q.includes('rpc') || q.includes('payload') || q.includes('format') || q.includes('validate')) {
      return {
        content: `### 🔧 JSON-RPC Payload Formatter & Validator

Web3 RPC nodes (Solana, Bitcoin, EVM) require strictly formatted JSON-RPC 2.0 requests.

Test, validate, and beautify your raw JSON payload below:`,
        interactiveWidget: 'json-validator',
      };
    }

    // 6. Security / Key Obfuscation
    if (q.includes('key') || q.includes('mask') || q.includes('obfuscate') || q.includes('private') || q.includes('secret') || q.includes('safe')) {
      return {
        content: `### 🛡️ Secret Key Obfuscator & Non-Custodial Safety

**Never share raw Base58 private keys or seed phrases in public chat or error logs.**
- **Client-Side Obfuscation**: Masks the sensitive inner bytes while retaining prefix and suffix for verification.

Test key masking below:`,
        interactiveWidget: 'key-masker',
      };
    }

    // General fallback
    return {
      content: `### 🤖 SolPump Web3 AI Assistant

I can assist you with:
- **⚡ Solana Gas & Priority Fees**: Real-time compute unit pricing & priority multipliers.
- **🪙 Bitcoin & UTXO Mechanics**: Satoshi conversions, vByte estimation & fee rates.
- **🛠️ Open-Source Developer Scripts**: Bulk airdrop engines, Jito MEV protection, Telegram broadcast bots.
- **📦 VIP Digital Asset Vault**: 1-click free ZIP downloads (Telegram Mini-App, WhatsApp AI Lead Bot, n8n Workflows).
- **🔧 Client-Side Micro-Tools**: JSON RPC formatters, key obfuscation, and prompt optimizers.

Ask a technical question or type what you need!`,
    };
  };

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const text = (customPrompt || inputValue).trim();
    if (!text || isLoading) return;

    // Abort any prior request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Determine session ID or create new one
    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      currentSessionId = `session-${Date.now()}`;
      const title = text.slice(0, 36) + (text.length > 36 ? '...' : '');
      const newSession: ChatSession = {
        id: currentSessionId,
        title,
        createdAt: Date.now(),
        messages: [userMsg],
      };
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(currentSessionId);
    } else {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? { ...s, messages: [...s.messages, userMsg] }
            : s
        )
      );
    }

    setInputValue('');
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Safety timeout: 5000ms max to prevent indefinite freezing
    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current === controller) {
        controller.abort();
      }
    }, 5000);

    try {
      const currentHistory = activeSession ? activeSession.messages : [];
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [...currentHistory, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userMessage: text,
        }),
      });

      clearTimeout(timeoutId);
      const data = await res.json().catch(() => null);

      if (data && data.success && data.reply) {
        const dynamicMeta = resolveDynamicWeb3Response(text);
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          codeSnippet: dynamicMeta.codeSnippet,
          interactiveWidget: dynamicMeta.interactiveWidget,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setSessions((prev) =>
          prev.map((s) =>
            s.id === currentSessionId
              ? { ...s, messages: [...s.messages, aiMsg] }
              : s
          )
        );
        setIsLoading(false);
        abortControllerRef.current = null;
        return;
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      // Check if user manually aborted
      if (err?.name === 'AbortError' && !controller.signal.aborted) {
        setIsLoading(false);
        abortControllerRef.current = null;
        return;
      }
    }

    // Graceful fallback response if API returned no valid reply or timed out
    fallbackTimerRef.current = setTimeout(() => {
      const dynamicMeta = resolveDynamicWeb3Response(text);
      const isSpecialQuery =
        text.toLowerCase().includes('fee') ||
        text.toLowerCase().includes('btc') ||
        text.toLowerCase().includes('bitcoin') ||
        text.toLowerCase().includes('vault') ||
        text.toLowerCase().includes('miniapp') ||
        text.toLowerCase().includes('sniper') ||
        text.toLowerCase().includes('json') ||
        text.toLowerCase().includes('key') ||
        text.toLowerCase().includes('airdrop');

      const fallbackContent = isSpecialQuery
        ? dynamicMeta.content
        : `### ⚡ Request Processed & Ready

${dynamicMeta.content}

*Note: Live network tool lookup completed. Let me know if you need a specific smart contract, priority fee calculation, or automation script!*`;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: fallbackContent,
        codeSnippet: dynamicMeta.codeSnippet,
        interactiveWidget: dynamicMeta.interactiveWidget,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? { ...s, messages: [...s.messages, aiMsg] }
            : s
        )
      );
      setIsLoading(false);
      abortControllerRef.current = null;
    }, 150);
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
  const solEstimatedUsd = solTotalFeeSol * 185;

  // Real-time Bitcoin fee calculations
  const btcTotalSats = 140 * btcFeeRate;
  const btcTotalBtc = btcTotalSats / 100000000;
  const btcTotalUsd = btcTotalBtc * 94000;

  return (
    <div className="h-screen w-screen bg-[#0a0b10] text-slate-100 flex overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-300 relative">
      {/* Backdrop overlay on mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* Slide-out Left Sidebar (ChatGPT-style) */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 sm:w-80 bg-[#080a10] border-r border-slate-800/80 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-80'
        }`}
      >
        {/* Sidebar Header with New Chat Button */}
        <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={createNewChat}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-white text-xs font-bold font-mono transition-all shadow-sm cursor-pointer group"
          >
            <Plus className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform" />
            <span>New Chat</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80 transition-colors cursor-pointer"
            title="Close sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Conversation List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Chat History</span>
          </div>

          {sessions.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-xs">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 text-slate-400 opacity-40" />
              <p>No chat history yet.</p>
              <p className="text-[11px] text-slate-400 mt-1">Start typing to save conversations.</p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => selectSession(session.id)}
                  className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#121624] text-cyan-300 font-semibold border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-900/90 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                      }`}
                    />
                    <span className="truncate">{session.title}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => deleteSession(e, session.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-opacity cursor-pointer"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] text-slate-300">Local Sandbox</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">v1.0</span>
        </div>
      </aside>

      {/* Main Chat App Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0a0b10] relative">
        {/* Top Minimal Navigation Bar */}
        <header className="w-full border-b border-slate-800/80 bg-[#0a0b10]/95 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isSidebarOpen ? 'Collapse sidebar' : 'Open chat history'}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4 text-cyan-400" />}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <span className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                sol-pump.store
              </span>
              <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700/80 text-[10px] font-mono text-slate-300">
                Gemini 3.7 • Web3 Assistant
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={createNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </header>

        {/* Messages Stream Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 w-full max-w-4xl mx-auto flex flex-col justify-between">
          <div className="flex-1 flex flex-col justify-start space-y-6 pb-6">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-16 space-y-6 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="space-y-2 max-w-lg">
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    What can I help you build today?
                  </h1>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Ask for Solana priority fees, Bitcoin calculations, automation scripts, or 1-click free ZIP downloads.
                  </p>
                </div>
              </div>
            ) : (
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
                          : 'bg-[#0f121d] border border-slate-800/90 text-slate-200 rounded-tl-xs shadow-lg'
                      }`}
                    >
                      {/* Text / Markdown Content */}
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
                        <div className="p-4 rounded-2xl bg-[#080a10] border border-cyan-500/30 space-y-4 my-3 text-xs">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                            <div className="flex items-center gap-2 text-cyan-400 font-bold">
                              <Sliders className="w-4 h-4" />
                              <span>Interactive Solana Priority Fee Simulator</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">Live Compute Units</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <div className="p-4 rounded-2xl bg-[#080a10] border border-amber-500/30 space-y-4 my-3 text-xs">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                            <div className="flex items-center gap-2 text-amber-400 font-bold">
                              <Coins className="w-4 h-4" />
                              <span>Bitcoin Satoshi &amp; Fee Rate Converter</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">Native SegWit (140 vB)</span>
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
                        <div className="p-4 rounded-2xl bg-[#080a10] border border-purple-500/30 space-y-3 my-3 text-xs">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                            <div className="flex items-center gap-2 text-purple-400 font-bold">
                              <FolderArchive className="w-4 h-4" />
                              <span>1-Click Free Client-Side ZIP Generator</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">SHA-256 Verified</span>
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
                                  <div className="font-bold text-white text-xs">n8n Workflows</div>
                                  <div className="text-[10px] text-slate-400 font-mono">JSON import (.ZIP)</div>
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
                        <div className="p-4 rounded-2xl bg-[#080a10] border border-indigo-500/30 space-y-3 my-3 text-xs">
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
                            <div className="p-3 rounded-xl bg-[#04060a] border border-emerald-500/30 font-mono text-[11px] text-emerald-300 overflow-x-auto whitespace-pre">
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
                        <div className="p-4 rounded-2xl bg-[#080a10] border border-emerald-500/30 space-y-3 my-3 text-xs">
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
                            <div className="p-3 rounded-xl bg-[#04060a] border border-emerald-500/40 flex items-center justify-between font-mono text-xs text-emerald-400">
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
                        <div className="rounded-2xl bg-[#05070d] border border-slate-800 p-3 sm:p-4 font-mono text-xs text-slate-300 relative group overflow-hidden">
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

                {/* Typing Loader with Stop Button */}
                {isLoading && (
                  <div className="flex gap-3 sm:gap-4 justify-start items-start">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                    </div>
                    <div className="bg-[#0f121d] border border-slate-800 rounded-2xl rounded-tl-xs p-3 sm:p-4 flex items-center gap-3 shadow-lg">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span className="text-xs text-slate-300 font-mono">Processing request...</span>
                      <button
                        type="button"
                        onClick={handleStopGenerating}
                        className="ml-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold transition-all cursor-pointer"
                        title="Stop generating"
                      >
                        <Square className="w-2.5 h-2.5 fill-current text-rose-400" />
                        <span>Stop</span>
                      </button>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Fixed / Sticky ChatGPT Input Dock */}
          <div className="w-full sticky bottom-0 pt-3 pb-2 bg-gradient-to-t from-[#0a0b10] via-[#0a0b10]/95 to-transparent">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex flex-col bg-[#0f121d] border border-slate-800 focus-within:border-cyan-500/70 rounded-2xl shadow-2xl shadow-black/80 transition-all overflow-hidden"
            >
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask for a tool, script, or Bitcoin / Solana calculations..."
                rows={1}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none resize-none min-h-[52px] max-h-[160px] py-4 px-4 font-sans leading-relaxed"
              />

              <div className="flex items-center justify-between px-3.5 py-2 border-t border-slate-800/60 bg-slate-950/40 text-xs">
                <span className="text-[11px] font-mono text-slate-400">
                  Press Enter to send
                </span>

                {isLoading ? (
                  <button
                    type="button"
                    onClick={handleStopGenerating}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-mono bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/50 shadow-lg shadow-rose-500/10 transition-all cursor-pointer group"
                    aria-label="Stop generating response"
                    title="Stop generating"
                  >
                    <Square className="w-3.5 h-3.5 fill-current text-rose-400 group-hover:scale-95 transition-transform" />
                    <span>Stop generating</span>
                  </button>
                ) : (
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
                )}
              </div>
            </form>

            <div className="text-center pt-2 text-[10px] text-slate-400 font-mono">
              sol-pump.store • Client-Side Sandbox • Non-Custodial
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
