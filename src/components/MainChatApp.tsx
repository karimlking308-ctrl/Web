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
  Mic,
  MicOff,
  AlertCircle,
  Database,
  Search,
  Hash,
  Braces,
  Layers,
  Workflow,
  KeyRound,
  CheckCircle2,
  Globe,
  RefreshCw,
  FileText,
  Binary,
  Boxes,
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
  interactiveWidget?:
    | 'solana-fee'
    | 'bitcoin-calc'
    | 'json-validator'
    | 'key-masker'
    | 'vault-download'
    | 'mock-generator'
    | 'regex-builder'
    | 'sql-builder'
    | 'web3-contract'
    | 'crypto-utilities';
  quickAction?: {
    label: string;
    sectionId: string;
    icon?: 'zap' | 'terminal' | 'vault' | 'shield' | 'code' | 'coins' | 'store' | 'database' | 'hash';
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
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
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

  // 1. API & JSON Mock Generator state
  const [mockType, setMockType] = useState<'users' | 'orders' | 'crypto-tx' | 'saas'>('crypto-tx');
  const [mockCount, setMockCount] = useState<number>(3);
  const [mockCopied, setMockCopied] = useState(false);

  // 2. Regex Builder & Tester state
  const [regexPattern, setRegexPattern] = useState('^0x[a-fA-F0-9]{40}$');
  const [regexFlags, setRegexFlags] = useState('i');
  const [regexTestText, setRegexTestText] = useState('0x71C8fb86633665c789053802a730417614e610d4');

  // 3. SQL Query Builder state
  const [sqlDialect, setSqlDialect] = useState<'postgresql' | 'mysql' | 'sqlite'>('postgresql');
  const [sqlTemplate, setSqlTemplate] = useState<'cte-volume' | 'paginated-window' | 'upsert-conflict' | 'indexing'>('cte-volume');

  // 4. Web3 / Smart Contract Snippets state
  const [web3Tab, setWeb3Tab] = useState<'jupiter' | 'raydium' | 'anchor' | 'ton-connect' | 'ton-jetton'>('jupiter');

  // 5. Base64, JWT, & Hash Utilities state
  const [cryptoTab, setCryptoTab] = useState<'base64' | 'jwt' | 'hasher'>('base64');
  const [base64Input, setBase64Input] = useState('Hello SolPump Store Web3 Developer!');
  const [base64Mode, setBase64Mode] = useState<'encode' | 'decode'>('encode');
  const [jwtInput, setJwtInput] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNvbFB1bXAgRGV2Iiwicm9sZSI6InZpcF9idWlsZGVyIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE4MDAwMDAwMDB9.dz48yZ5sUqjW1-sample-signature-only');
  const [hashInput, setHashInput] = useState('sol-pump.store-free-open-source-2026');
  const [hashAlgo, setHashAlgo] = useState<'SHA-256' | 'SHA-512'>('SHA-256');
  const [calculatedHash, setCalculatedHash] = useState<string>('');

  // Live hash calculator effect
  useEffect(() => {
    let isCancelled = false;
    async function updateHash() {
      if (!hashInput) {
        setCalculatedHash('');
        return;
      }
      try {
        const msgUint8 = new TextEncoder().encode(hashInput);
        const hashBuffer = await crypto.subtle.digest(hashAlgo, msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        if (!isCancelled) {
          setCalculatedHash(hashHex);
        }
      } catch (err) {
        if (!isCancelled) {
          setCalculatedHash('Hashing error');
        }
      }
    }
    updateHash();
    return () => {
      isCancelled = true;
    };
  }, [hashInput, hashAlgo]);

  // Current active messages
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages: ChatMessage[] = activeSession ? activeSession.messages : [];

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

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
    const q = query.toLowerCase().trim();

    // === 1. CASUAL CONVERSATION & GREETINGS ===
    const isGreeting =
      /^(hi|hello|hey|gm|gn|good\s+morning|good\s+afternoon|good\s+evening|howdy|sup|what'?s\s+up|yo|salut|hola|aloha)[\s!.,?]*$/i.test(q) ||
      q === 'hi' || q === 'hello' || q === 'hey' || q === 'gm';

    if (isGreeting) {
      return {
        content: `Hello there! 👋 Welcome to **sol-pump.store**.

I'm your AI assistant, ready to chat casually, answer general knowledge questions, explore ideas, or help you with engineering tools and Web3 utilities whenever you'd like.

How can I help you today?`,
      };
    }

    // Status / "How are you"
    if (q.includes('how are you') || q.includes("how's it going") || q.includes('how do you do') || q.includes('how are you doing') || q.includes('how is your day')) {
      return {
        content: `I'm doing great, thank you for asking! 😊 

I'm here and ready to help — whether you want to have a friendly conversation, brainstorm a new concept, learn about technology, or build something technical. 

What's on your mind today?`,
      };
    }

    // Identity / Capabilities
    if (q.includes('who are you') || q.includes('what are you') || q.includes('what can you do') || q.includes('introduce yourself') || q.includes('tell me about yourself') || q.includes('what is this website') || q.includes('what is sol-pump')) {
      return {
        content: `I am **SolPump AI**, the versatile assistant powering **sol-pump.store**! 🚀

Here is what I can do for you:
- 💬 **Friendly Conversation**: Chat with me about general topics, ask life or tech questions, or brainstorm ideas.
- ⚡ **Web3 & Blockchain Engineering**: Calculate Solana priority fees, explore Bitcoin vByte transactions, and examine smart contracts for Solana and TON.
- 📊 **Developer Tools**: Generate realistic mock datasets (JSON), construct production SQL CTE queries, test regex patterns, and inspect JWT/hashes.
- 📦 **Open Source Automation Vault**: Provide free downloadable templates for Telegram Mini-Apps, WhatsApp auto-responders, and Solana sniper bots.

Feel free to ask me anything or tell me what you'd like to work on!`,
      };
    }

    // Gratitude & Appreciation
    if (q.includes('thank') || q.includes('thanks') || q.includes('appreciate it') || q.includes('good job') || q.includes('awesome') || q.includes('great work') || q.includes('nice work')) {
      return {
        content: `You're very welcome! I'm glad I could help. 😊

Feel free to ask another question anytime, whether it's for work, study, or just a quick chat!`,
      };
    }

    // Humor / Jokes
    if (q.includes('joke') || q.includes('funny') || q.includes('make me laugh')) {
      return {
        content: `Here's one for you: 😄

**Why do programmers prefer dark mode?**  
*Because light attracts bugs!* 🐛✨

Want another one, or is there a topic you'd like to talk about?`,
      };
    }

    // General Educational: What is Blockchain / Crypto / Web3
    if ((q.includes('what is blockchain') || q.includes('explain blockchain') || q.includes('how does blockchain work')) && !q.includes('code') && !q.includes('fee')) {
      return {
        content: `### 🌐 Understanding Blockchain in Simple Terms

A **blockchain** is essentially a digital ledger of transactions that is duplicated and distributed across an entire network of computer systems.

#### Key Principles:
1. **Decentralization**: No single entity or central server controls the data. Every validator node keeps an identical copy of the record.
2. **Immutability**: Once a block of transactions is verified and added, it cannot be altered without changing all subsequent blocks across the whole network.
3. **Transparency & Security**: Cryptographic algorithms (like SHA-256 and public-key cryptography) guarantee that only legitimate account owners can sign transactions.

Whether you're interested in fast networks like **Solana**, foundational chains like **Bitcoin**, or smart contract ecosystems like **Ethereum**, blockchain provides verifiable trust without intermediaries.

Would you like to explore how smart contracts work, or discuss a specific use case?`,
      };
    }

    // === 2. TECHNICAL TOOLS & ENGINE MODULES ===

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

    // 7. API & JSON Mock Generator
    if (q.includes('mock') || q.includes('faker') || q.includes('dataset') || q.includes('dummy data') || q.includes('mock api') || q.includes('sample json')) {
      return {
        content: `### ⚡ Instant API & JSON Mock Dataset Generator

Create production-ready mock datasets and endpoint handlers on the fly for frontend prototypes, load tests, and Web3 apps.

- **Realistic Schemas**: Includes UUIDs, Solana Base58 addresses, ISO timestamps, and nested items.
- **Runnable Endpoint**: Includes ready-to-use Express/TypeScript mock router code.

Configure and generate mock records live below:`,
        interactiveWidget: 'mock-generator',
        codeSnippet: {
          language: 'typescript',
          title: 'Express.js Mock API Route with Pagination',
          code: `import express, { Request, Response } from 'express';

const router = express.Router();

// GET /api/v1/mock/transactions
router.get('/transactions', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

  const mockData = Array.from({ length: limit }, (_, i) => ({
    id: \`tx_\${Date.now()}_\${i}\`,
    slot: 289410290 + i * 4,
    type: i % 2 === 0 ? 'JUPITER_SWAP' : 'SPL_TRANSFER',
    tokenSymbol: i % 2 === 0 ? 'SOL' : 'USDC',
    amount: parseFloat((Math.random() * 15 + 0.1).toFixed(4)),
    feeLamports: 5000 + Math.floor(Math.random() * 10000),
    status: 'CONFIRMED',
    timestamp: new Date(Date.now() - i * 120000).toISOString(),
  }));

  res.json({
    page,
    limit,
    total: 250,
    hasMore: page * limit < 250,
    data: mockData,
  });
});

export default router;`,
        },
      };
    }

    // 8. Regex & SQL Query Builder
    if (q.includes('regex') || q.includes('regexp') || q.includes('pattern') || q.includes('sql') || q.includes('postgres') || q.includes('cte') || q.includes('query')) {
      if (q.includes('sql') || q.includes('postgres') || q.includes('sqlite') || q.includes('mysql') || q.includes('cte') || q.includes('window function')) {
        return {
          content: `### 📊 Production SQL Query & CTE Builder

Generate battle-tested SQL queries optimized with Common Table Expressions (CTEs), window functions, and proper indexing for high performance.

- **Rolling Volume Analytics**: Uses \`SUM(...) OVER (ORDER BY date ROWS BETWEEN...)\`.
- **Deduplication & Window Ranking**: Uses \`ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)\`.
- **High Concurrency Upserts**: \`INSERT ... ON CONFLICT (...) DO UPDATE\`.

Select dialect and inspect queries below:`,
          interactiveWidget: 'sql-builder',
          codeSnippet: {
            language: 'sql',
            title: 'PostgreSQL 7-Day Rolling Volume & Moving Average CTE',
            code: `-- Compute 7-day rolling volume & moving average for Web3 swaps
WITH daily_metrics AS (
  SELECT
    DATE_TRUNC('day', block_time) AS trade_date,
    token_symbol,
    COUNT(tx_id) AS total_swaps,
    SUM(volume_usd) AS daily_volume_usd
  FROM dex_swaps
  WHERE block_time >= NOW() - INTERVAL '60 days'
  GROUP BY 1, 2
)
SELECT
  trade_date,
  token_symbol,
  daily_volume_usd,
  -- 7-Day Rolling Volume Window Function
  SUM(daily_volume_usd) OVER (
    PARTITION BY token_symbol
    ORDER BY trade_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS rolling_7d_volume_usd,
  -- 7-Day Moving Average
  AVG(daily_volume_usd) OVER (
    PARTITION BY token_symbol
    ORDER BY trade_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS moving_avg_7d_usd
FROM daily_metrics
ORDER BY token_symbol, trade_date DESC;`,
          },
        };
      }

      return {
        content: `### 🔍 Production Regular Expression (Regex) Builder & Tester

Convert natural language requests into production-grade regular expressions with test match assertions and edge-case handling.

- **Web3 Address Matching**: Matches Ethereum \`0x\` (40 hex chars) and Solana Base58 (32-44 base58 chars).
- **Security Validation**: JWT tokens, UUIDv4, strict email formats, and URL slugs.

Test your pattern live against arbitrary strings below:`,
        interactiveWidget: 'regex-builder',
        codeSnippet: {
          language: 'typescript',
          title: 'TypeScript Web3 Address & Signature Validator',
          code: `// Production Regular Expressions for Web3 Strings
export const REGEX_PATTERNS = {
  // Ethereum 0x Address (40 Hex characters)
  ETHEREUM_ADDRESS: /^0x[a-fA-F0-9]{40}$/,

  // Solana Base58 Public Key (32-44 characters, no 0, O, I, l)
  SOLANA_ADDRESS: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,

  // Solana 64-byte Transaction Signature (Base58, 87-88 chars)
  SOLANA_TX_SIGNATURE: /^[1-9A-HJ-NP-Za-km-z]{87,88}$/,

  // JWT Token Format (3 base64url segments)
  JWT_TOKEN: /^[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_.+/=]*$/,

  // UUID v4
  UUID_V4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
};

export function isValidSolanaAddress(addr: string): boolean {
  return REGEX_PATTERNS.SOLANA_ADDRESS.test(addr.trim());
}`,
        },
      };
    }

    // 9. Web3 & Solana / TON Smart Contract Snippets
    if (q.includes('ton') || q.includes('tact') || q.includes('jetton') || q.includes('func') || q.includes('jupiter') || q.includes('raydium') || q.includes('swap') || q.includes('anchor') || q.includes('smart contract') || q.includes('contract')) {
      return {
        content: `### 🪐 Web3 & Solana / TON Smart Contract & Swap Engine

Battle-tested code snippets for Solana DEX Swaps, Priority Fees, Anchor 0.30+ programs, and TON Connect / Tact Jetton transfers.

- **Jupiter Swap API v6**: Quote API + serialized swap transaction with dynamic priority fees.
- **Raydium AMM**: SDK v2 pool swap instructions and slip limits.
- **TON Tact / FunC**: Jetton transfer messages and TON Connect 2.0 wallet payloads.

Switch between contract templates and copy runnable code below:`,
        interactiveWidget: 'web3-contract',
        codeSnippet: {
          language: 'typescript',
          title: 'Jupiter Swap API v6 Integration (TypeScript)',
          code: `import { Connection, Keypair, VersionedTransaction } from '@solana/web3.js';

export async function executeJupiterSwap(
  connection: Connection,
  wallet: Keypair,
  inputMint: string, // e.g. SOL mint: So11111111111111111111111111111111111111112
  outputMint: string, // e.g. USDC mint: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
  amountLamports: number,
  slippageBps: number = 50 // 0.5%
) {
  // 1. Get Quote
  const quoteUrl = \`https://quote-api.jup.ag/v6/quote?inputMint=\${inputMint}&outputMint=\${outputMint}&amount=\${amountLamports}&slippageBps=\${slippageBps}&maxAccounts=64\`;
  const quoteRes = await fetch(quoteUrl);
  const quoteResponse = await quoteRes.json();

  // 2. Get Serialized Swap Transaction with dynamic priority fee
  const swapRes = await fetch('https://quote-api.jup.ag/v6/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey: wallet.publicKey.toBase58(),
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: 'auto', // Dynamic priority pricing
    }),
  });
  const { swapTransaction } = await swapRes.json();

  // 3. Deserialize & Sign
  const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
  const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
  transaction.sign([wallet]);

  // 4. Execute on Solana
  const txid = await connection.sendRawTransaction(transaction.serialize(), {
    skipPreflight: false,
    maxRetries: 3,
  });

  return txid;
}`,
        },
      };
    }

    // 10. Base64, JWT, & Hash Utilities
    if (q.includes('base64') || q.includes('jwt') || q.includes('hash') || q.includes('sha256') || q.includes('sha512') || q.includes('md5') || q.includes('encode') || q.includes('decode') || q.includes('crypto')) {
      return {
        content: `### 🔐 Base64, JWT, & Cryptographic Hash Suite

Perform live encoding, decoding, token payload inspection, and cryptographic hashing client-side without sending private data to any remote server.

- **Base64 Encoder/Decoder**: Safe UTF-8 text conversion.
- **JWT Inspector**: Formats JSON Header & Payload, displays signature algo, and verifies token expiration countdown.
- **Cryptographic Hasher**: Calculates SHA-256 and SHA-512 hashes using browser-native Web Crypto API.

Use the live interactive suite below:`,
        interactiveWidget: 'crypto-utilities',
        codeSnippet: {
          language: 'typescript',
          title: 'Browser & Node.js SHA-256 Hash Function',
          code: `// Universal Cryptographic SHA-256 Hasher
export async function sha256(message: string): Promise<string> {
  // Browser Web Crypto API
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Node.js fallback
  const crypto = await import('crypto');
  return crypto.createHash('sha256').update(message).digest('hex');
}`,
        },
      };
    }

    // General conversational fallback for arbitrary queries
    return {
      content: `I'd be happy to help you with that! 😊

Whether you're exploring a new concept, working through a technical problem, or just looking to brainstorm ideas, I'm here for you.

Could you tell me a bit more about what you're working on? Or if you need a specific tool (such as mock JSON data, SQL CTE queries, regex patterns, or smart contracts), feel free to ask!`,
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

  const toggleSpeechRecognition = () => {
    const isSpeechSupported =
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    if (!isSpeechSupported) {
      setSpeechError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      setTimeout(() => setSpeechError(null), 5000);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      const baseText = inputValue;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }

        if (transcript) {
          const updated = baseText ? `${baseText.trim()} ${transcript.trim()}` : transcript;
          setInputValue(updated);
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission was denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          // No speech detected, keep listening or gracefully let user know
        } else if (event.error === 'audio-capture') {
          setSpeechError('No microphone detected or audio capture failed.');
        } else {
          setSpeechError(`Voice input error: ${event.error}`);
        }
        setIsListening(false);
        setTimeout(() => setSpeechError(null), 5000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to initialize speech recognition:', err);
      setSpeechError('Could not access microphone. Please check browser permissions.');
      setIsListening(false);
      setTimeout(() => setSpeechError(null), 5000);
    }
  };

  const handleSendMessage = async (customPrompt?: string) => {
    // If voice recognition is active, stop it when sending
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }

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

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: dynamicMeta.content,
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
              <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-16 space-y-4 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    What can I help you build today?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Ask for code snippets, calculations, smart contracts, mock datasets, or Web3 utilities.
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
                        {(() => {
                          const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
                          const parts: React.ReactNode[] = [];
                          let lastIndex = 0;
                          let match;
                          let blockIndex = 0;

                          const renderParagraphs = (text: string) => {
                            return text.split('\n\n').map((paragraph, pIdx) => {
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
                            });
                          };

                          while ((match = codeBlockRegex.exec(msg.content)) !== null) {
                            if (match.index > lastIndex) {
                              const textChunk = msg.content.slice(lastIndex, match.index);
                              parts.push(
                                <div key={`text-${blockIndex}`} className="space-y-2">
                                  {renderParagraphs(textChunk)}
                                </div>
                              );
                            }

                            const language = match[1] || 'code';
                            const codeSnippet = match[2].trim();
                            const codeId = `${msg.id}-block-${blockIndex}`;

                            parts.push(
                              <div
                                key={`code-${blockIndex}`}
                                className="rounded-2xl bg-[#05070d] border border-slate-800 p-3 sm:p-4 font-mono text-xs text-slate-300 relative group overflow-hidden my-3"
                              >
                                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800/80 text-[11px] text-slate-400">
                                  <span className="font-bold text-white flex items-center gap-1.5">
                                    <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                                    <span className="uppercase text-[10px] tracking-wider text-cyan-300 font-mono">{language}</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyCode(codeSnippet, codeId)}
                                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[11px]"
                                  >
                                    {copiedCodeId === codeId ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        <span className="text-emerald-400 font-mono">Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span className="font-mono">Copy</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <pre className="text-slate-300 overflow-x-auto whitespace-pre leading-relaxed text-[11px] sm:text-xs">
                                  {codeSnippet}
                                </pre>
                              </div>
                            );

                            lastIndex = match.index + match[0].length;
                            blockIndex++;
                          }

                          if (lastIndex < msg.content.length) {
                            const remainingText = msg.content.slice(lastIndex);
                            parts.push(
                              <div key="text-final" className="space-y-2">
                                {renderParagraphs(remainingText)}
                              </div>
                            );
                          }

                          return parts;
                        })()}
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

                      {/* 1. IN-STREAM INTERACTIVE WIDGET: API & JSON Mock Generator */}
                      {msg.interactiveWidget === 'mock-generator' && (() => {
                        const getMockData = () => {
                          if (mockType === 'users') {
                            return Array.from({ length: mockCount }, (_, i) => ({
                              id: `usr_${1000 + i}`,
                              username: ['sol_whale', 'cyber_dev', 'phantom_trader', 'tact_builder', 'defi_architect'][i % 5] + `_${i + 1}`,
                              email: `builder${i + 1}@sol-pump.store`,
                              role: i === 0 ? 'ADMIN' : 'DEVELOPER',
                              walletAddress: i % 2 === 0 ? '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU' : '0x71C8fb86633665c789053802a730417614e610d4',
                              tier: 'VIP_UNLOCKED',
                              balanceSol: parseFloat((Math.random() * 25 + 1.5).toFixed(3)),
                              createdAt: new Date(Date.now() - i * 86400000).toISOString(),
                            }));
                          }
                          if (mockType === 'orders') {
                            return Array.from({ length: mockCount }, (_, i) => ({
                              orderId: `ord_${Date.now()}_${i + 1}`,
                              customer: `sol_user_${i + 1}`,
                              items: [
                                { sku: 'SKU-VIP-VAULT', title: 'Solana Sniper Bot Template', qty: 1, priceSol: 0.05 },
                                { sku: 'SKU-TG-MINIAPP', title: 'Telegram Clicker Mini-App', qty: 1, priceSol: 0.0 },
                              ],
                              totalSol: 0.05,
                              totalUsd: 9.75,
                              status: ['COMPLETED', 'CONFIRMED', 'PENDING'][i % 3],
                              txSignature: '5mN9a' + Math.random().toString(36).substring(2, 15) + '...sol',
                              timestamp: new Date().toISOString(),
                            }));
                          }
                          if (mockType === 'saas') {
                            return Array.from({ length: mockCount }, (_, i) => ({
                              tenantId: `org_${2000 + i}`,
                              plan: ['DEVELOPER_PRO', 'ENTERPRISE_NODE', 'STARTER_DEV'][i % 3],
                              monthlyFeeUsd: [49, 199, 19][i % 3],
                              rateLimitRps: [100, 500, 25][i % 3],
                              apiKeysActive: 2 + i,
                              webhooksConfigured: ['https://api.myclient.app/webhooks/solana'],
                              renewalStatus: 'ACTIVE_AUTO_RENEW',
                            }));
                          }
                          // Default: crypto-tx
                          return Array.from({ length: mockCount }, (_, i) => ({
                            txHash: '5xZ' + Math.random().toString(36).substring(2, 10) + '9kQ' + Math.random().toString(36).substring(2, 8),
                            slot: 289410200 + i * 12,
                            protocol: i % 2 === 0 ? 'JUPITER_V6' : 'RAYDIUM_AMM',
                            inputToken: { symbol: 'SOL', amount: parseFloat((1.25 * (i + 1)).toFixed(3)) },
                            outputToken: { symbol: 'USDC', amount: parseFloat((243.5 * (i + 1)).toFixed(2)) },
                            priorityFeeLamports: 15000 + i * 5000,
                            computeUnitsUsed: 184200 + i * 12000,
                            status: 'CONFIRMED',
                            blockTime: new Date(Date.now() - i * 45000).toISOString(),
                          }));
                        };

                        const mockDataObj = getMockData();
                        const mockJsonString = JSON.stringify(mockDataObj, null, 2);

                        const downloadJsonFile = () => {
                          const blob = new Blob([mockJsonString], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `mock_${mockType}_dataset.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        };

                        return (
                          <div className="p-4 rounded-2xl bg-[#080a10] border border-cyan-500/30 space-y-3.5 my-3 text-xs">
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                                <Database className="w-4 h-4" />
                                <span>API & JSON Mock Dataset Generator</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={downloadJsonFile}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-mono text-[10px] border border-slate-700 transition-colors cursor-pointer"
                                  title="Download .json file"
                                >
                                  <Download className="w-3 h-3 text-cyan-400" />
                                  <span>Download .json</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(mockJsonString);
                                    setMockCopied(true);
                                    setTimeout(() => setMockCopied(false), 1500);
                                  }}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-[10px] transition-colors cursor-pointer"
                                >
                                  {mockCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>{mockCopied ? 'Copied!' : 'Copy JSON'}</span>
                                </button>
                              </div>
                            </div>

                            {/* Controls */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-400 font-mono">Dataset Schema:</label>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {[
                                    { id: 'crypto-tx', label: 'Crypto Swaps' },
                                    { id: 'users', label: 'Users & Wallets' },
                                    { id: 'orders', label: 'Store Orders' },
                                    { id: 'saas', label: 'SaaS Tenants' },
                                  ].map((tab) => (
                                    <button
                                      key={tab.id}
                                      type="button"
                                      onClick={() => setMockType(tab.id as any)}
                                      className={`px-2 py-1.5 rounded-lg text-[11px] font-mono text-center transition-all cursor-pointer ${
                                        mockType === tab.id
                                          ? 'bg-cyan-500 text-[#080b12] font-bold shadow'
                                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                      }`}
                                    >
                                      {tab.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                                  <span>Record Count:</span>
                                  <span className="font-bold text-cyan-400">{mockCount} Items</span>
                                </div>
                                <input
                                  type="range"
                                  min={1}
                                  max={8}
                                  value={mockCount}
                                  onChange={(e) => setMockCount(Number(e.target.value))}
                                  className="w-full accent-cyan-400 cursor-pointer mt-2"
                                />
                              </div>
                            </div>

                            {/* Live JSON Preview */}
                            <div className="rounded-xl bg-[#04060a] border border-slate-800/80 p-3 max-h-56 overflow-y-auto font-mono text-[11px] text-slate-300">
                              <pre className="whitespace-pre">{mockJsonString}</pre>
                            </div>
                          </div>
                        );
                      })()}

                      {/* 2. IN-STREAM INTERACTIVE WIDGET: Regex Builder & Tester */}
                      {msg.interactiveWidget === 'regex-builder' && (() => {
                        let isRegexValid = true;
                        let matchCount = 0;
                        let matchesList: string[] = [];

                        try {
                          const rx = new RegExp(regexPattern, regexFlags);
                          if (regexFlags.includes('g')) {
                            const found = regexTestText.match(rx);
                            if (found) {
                              matchCount = found.length;
                              matchesList = found;
                            }
                          } else {
                            const found = rx.exec(regexTestText);
                            if (found) {
                              matchCount = 1;
                              matchesList = [found[0]];
                            }
                          }
                        } catch (err) {
                          isRegexValid = false;
                        }

                        const presets = [
                          { label: 'Solana Base58', pattern: '^[1-9A-HJ-NP-Za-km-z]{32,44}$', flags: '', sample: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU' },
                          { label: 'Ethereum 0x', pattern: '^0x[a-fA-F0-9]{40}$', flags: 'i', sample: '0x71C8fb86633665c789053802a730417614e610d4' },
                          { label: 'JWT Token', pattern: '^[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_.+/=]*$', flags: '', sample: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature' },
                          { label: 'UUID v4', pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$', flags: 'i', sample: '123e4567-e89b-12d3-a456-426614174000' },
                          { label: 'Email Format', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', flags: 'i', sample: 'developer@sol-pump.store' },
                        ];

                        return (
                          <div className="p-4 rounded-2xl bg-[#080a10] border border-cyan-500/30 space-y-3.5 my-3 text-xs">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                                <Search className="w-4 h-4" />
                                <span>Live Regular Expression (Regex) Tester</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400">Real-Time Match Engine</span>
                            </div>

                            {/* Preset Buttons */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-slate-400">Presets:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {presets.map((p) => (
                                  <button
                                    key={p.label}
                                    type="button"
                                    onClick={() => {
                                      setRegexPattern(p.pattern);
                                      setRegexFlags(p.flags);
                                      setRegexTestText(p.sample);
                                    }}
                                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 font-mono text-[10px] transition-colors cursor-pointer"
                                  >
                                    {p.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Regex Input & Flags */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                              <div className="sm:col-span-3 space-y-1">
                                <label className="text-[11px] text-slate-400 font-mono">Regex Pattern:</label>
                                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 focus-within:border-cyan-400">
                                  <span className="text-slate-400 font-mono text-xs pr-1">/</span>
                                  <input
                                    type="text"
                                    value={regexPattern}
                                    onChange={(e) => setRegexPattern(e.target.value)}
                                    className="w-full bg-transparent font-mono text-xs text-white focus:outline-none"
                                    placeholder="e.g. ^0x[a-fA-F0-9]{40}$"
                                  />
                                  <span className="text-slate-400 font-mono text-xs pl-1">/</span>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-400 font-mono">Flags (g,i,m):</label>
                                <input
                                  type="text"
                                  value={regexFlags}
                                  onChange={(e) => setRegexFlags(e.target.value)}
                                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-white focus:outline-none focus:border-cyan-400"
                                  placeholder="e.g. i"
                                />
                              </div>
                            </div>

                            {/* Test String */}
                            <div className="space-y-1">
                              <label className="text-[11px] text-slate-400 font-mono">Test String Input:</label>
                              <textarea
                                value={regexTestText}
                                onChange={(e) => setRegexTestText(e.target.value)}
                                rows={2}
                                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                                placeholder="Paste test string to evaluate..."
                              />
                            </div>

                            {/* Match Result Banner */}
                            {!isRegexValid ? (
                              <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 font-mono text-[11px]">
                                ⚠️ Invalid Regular Expression Syntax
                              </div>
                            ) : (
                              <div className={`p-3 rounded-xl border font-mono text-xs flex items-center justify-between ${
                                matchCount > 0
                                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-400'
                              }`}>
                                <div className="flex items-center gap-2">
                                  {matchCount > 0 ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <AlertCircle className="w-4 h-4 text-slate-400" />
                                  )}
                                  <span>{matchCount > 0 ? `Match Found (${matchCount} occurrence${matchCount > 1 ? 's' : ''})` : 'No Match'}</span>
                                </div>
                                {matchCount > 0 && (
                                  <div className="flex gap-1 overflow-x-auto max-w-[200px]">
                                    {matchesList.slice(0, 3).map((m, idx) => (
                                      <span key={idx} className="px-1.5 py-0.5 rounded bg-emerald-900/60 border border-emerald-700 text-[10px] truncate">
                                        {m}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* 3. IN-STREAM INTERACTIVE WIDGET: SQL Query Builder */}
                      {msg.interactiveWidget === 'sql-builder' && (() => {
                        const getSqlText = () => {
                          if (sqlTemplate === 'cte-volume') {
                            if (sqlDialect === 'sqlite') {
                              return `-- SQLite 7-Day Rolling Volume Aggregate
WITH daily_agg AS (
  SELECT
    strftime('%Y-%m-%d', timestamp) AS trade_day,
    token_pair,
    SUM(amount_usd) AS daily_vol
  FROM swaps
  GROUP BY 1, 2
)
SELECT
  trade_day,
  token_pair,
  daily_vol,
  SUM(daily_vol) OVER (PARTITION BY token_pair ORDER BY trade_day ROWS 6 PRECEDING) AS rolling_7d_volume
FROM daily_agg;`;
                            }
                            return `-- ${sqlDialect === 'postgresql' ? 'PostgreSQL' : 'MySQL 8.0+'} 7-Day Rolling Volume CTE
WITH daily_swaps AS (
  SELECT
    DATE_TRUNC('day', block_time) AS trade_date,
    token_symbol,
    COUNT(tx_id) AS total_swaps,
    SUM(volume_usd) AS daily_volume_usd
  FROM dex_swaps
  WHERE block_time >= NOW() - INTERVAL '30 days'
  GROUP BY 1, 2
)
SELECT
  trade_date,
  token_symbol,
  daily_volume_usd,
  SUM(daily_volume_usd) OVER (
    PARTITION BY token_symbol
    ORDER BY trade_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS rolling_7d_volume_usd,
  AVG(daily_volume_usd) OVER (
    PARTITION BY token_symbol
    ORDER BY trade_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS moving_avg_7d_usd
FROM daily_swaps
ORDER BY token_symbol, trade_date DESC;`;
                          }
                          if (sqlTemplate === 'paginated-window') {
                            return `-- Cursor Pagination with Window Ranking & Total Count
WITH ranked_transactions AS (
  SELECT
    tx_signature,
    block_slot,
    from_wallet,
    amount_sol,
    created_at,
    ROW_NUMBER() OVER (ORDER BY created_at DESC) AS row_num,
    COUNT(*) OVER () AS total_matching_records
  FROM solana_transactions
  WHERE from_wallet = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
)
SELECT *
FROM ranked_transactions
WHERE row_num BETWEEN 1 AND 25;`;
                          }
                          if (sqlTemplate === 'upsert-conflict') {
                            if (sqlDialect === 'mysql') {
                              return `-- MySQL 8.0+ Insert with ON DUPLICATE KEY UPDATE
INSERT INTO token_accounts (wallet_address, mint_address, balance_raw, updated_at)
VALUES ('7xKXtg2CW87...', 'EPjFWdd5Aufq...', 5000000, NOW())
ON DUPLICATE KEY UPDATE
  balance_raw = VALUES(balance_raw),
  updated_at = NOW();`;
                            }
                            return `-- PostgreSQL 14+ / SQLite UPSERT with ON CONFLICT
INSERT INTO token_accounts (wallet_address, mint_address, balance_raw, updated_at)
VALUES ('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 5000000, NOW())
ON CONFLICT (wallet_address, mint_address)
DO UPDATE SET
  balance_raw = EXCLUDED.balance_raw,
  updated_at = NOW();`;
                          }
                          // Default: indexing
                          return `-- High-Performance B-Tree & Partial Indexes for Web3 Analytics
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dex_swaps_token_date
ON dex_swaps (token_symbol, block_time DESC);

-- Partial Index for high-value priority fee transactions
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_high_priority_fees
ON dex_swaps (priority_fee_lamports)
WHERE priority_fee_lamports > 50000;`;
                        };

                        const currentSql = getSqlText();

                        return (
                          <div className="p-4 rounded-2xl bg-[#080a10] border border-cyan-500/30 space-y-3.5 my-3 text-xs">
                            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                                <Database className="w-4 h-4" />
                                <span>SQL Query & Architecture Builder</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(currentSql);
                                  setCopiedCodeId('sql-builder');
                                  setTimeout(() => setCopiedCodeId(null), 1500);
                                }}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-[10px] border border-cyan-500/40 cursor-pointer"
                              >
                                {copiedCodeId === 'sql-builder' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedCodeId === 'sql-builder' ? 'Copied' : 'Copy SQL'}</span>
                              </button>
                            </div>

                            {/* Selectors */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-400 font-mono">SQL Dialect:</label>
                                <div className="grid grid-cols-3 gap-1.5">
                                  {(['postgresql', 'mysql', 'sqlite'] as const).map((d) => (
                                    <button
                                      key={d}
                                      type="button"
                                      onClick={() => setSqlDialect(d)}
                                      className={`px-2 py-1.5 rounded-lg text-[10px] font-mono text-center uppercase transition-all cursor-pointer ${
                                        sqlDialect === d
                                          ? 'bg-cyan-500 text-[#080b12] font-bold'
                                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                      }`}
                                    >
                                      {d}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] text-slate-400 font-mono">Pattern / Query Goal:</label>
                                <select
                                  value={sqlTemplate}
                                  onChange={(e) => setSqlTemplate(e.target.value as any)}
                                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                                >
                                  <option value="cte-volume">7-Day Rolling Volume CTE</option>
                                  <option value="paginated-window">Cursor Window Ranking & Count</option>
                                  <option value="upsert-conflict">UPSERT (ON CONFLICT / DUP KEY)</option>
                                  <option value="indexing">B-Tree & Partial Composite Indexing</option>
                                </select>
                              </div>
                            </div>

                            {/* SQL Preview Box */}
                            <div className="rounded-xl bg-[#04060a] border border-slate-800 p-3 font-mono text-[11px] text-slate-300 overflow-x-auto">
                              <pre className="whitespace-pre leading-relaxed">{currentSql}</pre>
                            </div>
                          </div>
                        );
                      })()}

                      {/* 4. IN-STREAM INTERACTIVE WIDGET: Web3 & Smart Contract Snippets */}
                      {msg.interactiveWidget === 'web3-contract' && (() => {
                        const web3Snippets: Record<string, { title: string; lang: string; code: string }> = {
                          jupiter: {
                            title: 'Jupiter Swap API v6 (TypeScript)',
                            lang: 'typescript',
                            code: `import { Connection, Keypair, VersionedTransaction } from '@solana/web3.js';

export async function executeJupiterSwap(connection: Connection, wallet: Keypair) {
  // 1. Fetch Best Route Quote
  const quoteUrl = 'https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000000&slippageBps=50';
  const quoteRes = await fetch(quoteUrl);
  const quoteData = await quoteRes.json();

  // 2. Request serialized transaction with auto-priority fee
  const swapRes = await fetch('https://quote-api.jup.ag/v6/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quoteResponse: quoteData,
      userPublicKey: wallet.publicKey.toBase58(),
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: 'auto',
    }),
  });
  const { swapTransaction } = await swapRes.json();

  // 3. Deserialize, Sign, & Broadcast
  const tx = VersionedTransaction.deserialize(Buffer.from(swapTransaction, 'base64'));
  tx.sign([wallet]);
  return await connection.sendRawTransaction(tx.serialize());
}`,
                          },
                          raydium: {
                            title: 'Raydium AMM Pool Swap Instruction (TypeScript)',
                            lang: 'typescript',
                            code: `import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Liquidity, Token, TokenAmount, Percent } from '@raydium-io/raydium-sdk';

export async function buildRaydiumSwapTx(
  connection: Connection,
  poolKeys: any,
  userOwner: PublicKey,
  amountInLamports: number,
  slippagePercent: number = 1
) {
  const slippage = new Percent(slippagePercent, 100);
  const inputAmount = new TokenAmount(poolKeys.baseMint, amountInLamports);

  const { minAmountOut } = Liquidity.computeAmountOut({
    poolKeys,
    poolInfo: await Liquidity.fetchInfo({ connection, poolKeys }),
    amountIn: inputAmount,
    currencyOut: poolKeys.quoteMint,
    slippage,
  });

  const { innerTransactions } = await Liquidity.makeSwapInstructionSimple({
    connection,
    poolKeys,
    userKeys: { owner: userOwner, payer: userOwner },
    amountIn: inputAmount,
    amountOut: minAmountOut,
    fixedSide: 'in',
  });

  return innerTransactions;
}`,
                          },
                          anchor: {
                            title: 'Solana Anchor 0.30 Counter Program (Rust)',
                            lang: 'rust',
                            code: `use anchor_lang::prelude::*;

declare_id!("8uXm3Fv7B9Wk5L...sol");

#[program]
pub mod sol_pump_counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        counter.authority = *ctx.accounts.authority.key;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = counter.count.checked_add(1).ok_or(ErrorCode::Overflow)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 8 + 32)]
    pub counter: Account<'info, CounterAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct CounterAccount {
    pub count: u64,
    pub authority: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Numerical Overflow Occurred")]
    Overflow,
}`,
                          },
                          'ton-connect': {
                            title: 'TON Connect 2.0 Jetton Transfer Message',
                            lang: 'typescript',
                            code: `import { TonConnectUI } from '@tonconnect/ui';
import { beginCell, toNano, Address } from '@ton/core';

export async function sendTonJettonTransfer(
  tonConnectUI: TonConnectUI,
  jettonWalletAddress: string,
  recipientAddress: string,
  jettonAmountNano: bigint,
  queryId: number = 0
) {
  // Build standard TEP-74 Jetton transfer body
  const body = beginCell()
    .storeUint(0xf8a7cd5, 32) // op::transfer
    .storeUint(queryId, 64)   // query_id
    .storeCoins(jettonAmountNano) // jetton amount
    .storeAddress(Address.parse(recipientAddress)) // to_address
    .storeAddress(Address.parse(tonConnectUI.account!.address)) // response_destination
    .storeBit(0) // custom_payload (none)
    .storeCoins(toNano('0.01')) // forward_ton_amount
    .storeBit(0) // forward_payload (none)
    .endCell();

  const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
      {
        address: jettonWalletAddress,
        amount: toNano('0.05').toString(), // attached gas fee in TON
        payload: body.toBoc().toString('base64'),
      },
    ],
  };

  return await tonConnectUI.sendTransaction(transaction);
}`,
                          },
                          'ton-jetton': {
                            title: 'TON Tact Contract: Jetton Transfer Hook',
                            lang: 'tact',
                            code: `import "@stdlib/deploy";

message JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    response_destination: Address;
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

contract JettonVault with Deployable {
    owner: Address;
    totalLocked: Int as coins;

    init(owner: Address) {
        self.owner = owner;
        self.totalLocked = 0;
    }

    receive(msg: JettonTransfer) {
        let ctx: Context = context();
        require(ctx.value >= ton("0.05"), "Insufficient gas attached");
        self.totalLocked = self.totalLocked + msg.amount;
    }

    get fun getLockedBalance(): Int {
        return self.totalLocked;
    }
}`,
                          },
                        };

                        const activeSnippet = web3Snippets[web3Tab] || web3Snippets.jupiter;

                        return (
                          <div className="p-4 rounded-2xl bg-[#080a10] border border-cyan-500/30 space-y-3.5 my-3 text-xs">
                            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                                <Workflow className="w-4 h-4" />
                                <span>Web3, Solana & TON Smart Contracts</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(activeSnippet.code);
                                  setCopiedCodeId('web3-contract');
                                  setTimeout(() => setCopiedCodeId(null), 1500);
                                }}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-[10px] border border-cyan-500/40 cursor-pointer"
                              >
                                {copiedCodeId === 'web3-contract' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedCodeId === 'web3-contract' ? 'Copied' : 'Copy Code'}</span>
                              </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { id: 'jupiter', label: 'Jupiter v6 API' },
                                { id: 'raydium', label: 'Raydium AMM' },
                                { id: 'anchor', label: 'Anchor 0.30' },
                                { id: 'ton-connect', label: 'TON Connect 2.0' },
                                { id: 'ton-jetton', label: 'TON Tact Contract' },
                              ].map((t) => (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => setWeb3Tab(t.id as any)}
                                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                                    web3Tab === t.id
                                      ? 'bg-cyan-500 text-[#080b12] font-bold shadow'
                                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                  }`}
                                >
                                  {t.label}
                                </button>
                              ))}
                            </div>

                            {/* Code Container */}
                            <div className="rounded-xl bg-[#04060a] border border-slate-800 p-3 font-mono text-[11px] text-slate-300 max-h-64 overflow-y-auto">
                              <div className="text-[10px] text-cyan-400 font-bold mb-2 pb-1 border-b border-slate-800/80">
                                // {activeSnippet.title}
                              </div>
                              <pre className="whitespace-pre leading-relaxed">{activeSnippet.code}</pre>
                            </div>
                          </div>
                        );
                      })()}

                      {/* 5. IN-STREAM INTERACTIVE WIDGET: Base64, JWT, & Hash Utilities */}
                      {msg.interactiveWidget === 'crypto-utilities' && (() => {
                        let base64Result = '';
                        let base64Error = false;
                        if (base64Mode === 'encode') {
                          try {
                            base64Result = btoa(unescape(encodeURIComponent(base64Input)));
                          } catch {
                            base64Error = true;
                          }
                        } else {
                          try {
                            base64Result = decodeURIComponent(escape(atob(base64Input)));
                          } catch {
                            base64Error = true;
                          }
                        }

                        // JWT Parser
                        let jwtHeaderObj: any = null;
                        let jwtPayloadObj: any = null;
                        let jwtExpiryDate: string | null = null;
                        let jwtIsExpired = false;
                        let jwtError = false;

                        try {
                          const parts = jwtInput.trim().split('.');
                          if (parts.length >= 2) {
                            jwtHeaderObj = JSON.parse(decodeURIComponent(escape(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')))));
                            jwtPayloadObj = JSON.parse(decodeURIComponent(escape(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))));
                            if (jwtPayloadObj && jwtPayloadObj.exp) {
                              const expMs = jwtPayloadObj.exp * 1000;
                              jwtExpiryDate = new Date(expMs).toLocaleString();
                              jwtIsExpired = Date.now() > expMs;
                            }
                          } else {
                            jwtError = true;
                          }
                        } catch {
                          jwtError = true;
                        }

                        return (
                          <div className="p-4 rounded-2xl bg-[#080a10] border border-cyan-500/30 space-y-3.5 my-3 text-xs">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                                <KeyRound className="w-4 h-4" />
                                <span>Base64, JWT & Cryptographic Hasher</span>
                              </div>
                              <span className="text-[10px] font-mono text-emerald-400">100% Client-Side Sandbox</span>
                            </div>

                            {/* Utility Selector */}
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'base64', label: 'Base64 Tool' },
                                { id: 'jwt', label: 'JWT Inspector' },
                                { id: 'hasher', label: 'Hash Digest' },
                              ].map((tab) => (
                                <button
                                  key={tab.id}
                                  type="button"
                                  onClick={() => setCryptoTab(tab.id as any)}
                                  className={`px-2 py-1.5 rounded-lg text-[11px] font-mono text-center transition-all cursor-pointer ${
                                    cryptoTab === tab.id
                                      ? 'bg-cyan-500 text-[#080b12] font-bold shadow'
                                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                  }`}
                                >
                                  {tab.label}
                                </button>
                              ))}
                            </div>

                            {/* Tab 1: Base64 */}
                            {cryptoTab === 'base64' && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-mono text-slate-400">Mode:</span>
                                  <div className="flex rounded-lg overflow-hidden border border-slate-800">
                                    <button
                                      type="button"
                                      onClick={() => setBase64Mode('encode')}
                                      className={`px-2.5 py-1 text-[10px] font-mono cursor-pointer ${
                                        base64Mode === 'encode' ? 'bg-cyan-500 text-black font-bold' : 'bg-slate-900 text-slate-400'
                                      }`}
                                    >
                                      Encode UTF-8
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setBase64Mode('decode')}
                                      className={`px-2.5 py-1 text-[10px] font-mono cursor-pointer ${
                                        base64Mode === 'decode' ? 'bg-cyan-500 text-black font-bold' : 'bg-slate-900 text-slate-400'
                                      }`}
                                    >
                                      Decode
                                    </button>
                                  </div>
                                </div>

                                <textarea
                                  value={base64Input}
                                  onChange={(e) => setBase64Input(e.target.value)}
                                  rows={2}
                                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-white focus:outline-none focus:border-cyan-400"
                                  placeholder={base64Mode === 'encode' ? 'Text to encode...' : 'Base64 string to decode...'}
                                />

                                <div className="p-3 rounded-xl bg-[#04060a] border border-slate-800 flex items-center justify-between gap-2 font-mono text-xs">
                                  <span className="text-cyan-300 break-all">
                                    {base64Error ? '⚠️ Invalid Base64 String' : base64Result || '(Output empty)'}
                                  </span>
                                  {!base64Error && base64Result && (
                                    <button
                                      type="button"
                                      onClick={() => navigator.clipboard.writeText(base64Result)}
                                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer shrink-0"
                                      title="Copy Result"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Tab 2: JWT Inspector */}
                            {cryptoTab === 'jwt' && (
                              <div className="space-y-3">
                                <textarea
                                  value={jwtInput}
                                  onChange={(e) => setJwtInput(e.target.value)}
                                  rows={2}
                                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-cyan-400"
                                  placeholder="Paste JWT Token (header.payload.signature)..."
                                />

                                {jwtError ? (
                                  <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-[11px] font-mono">
                                    ⚠️ Invalid JWT Format. Must have at least header and payload segments separated by dots.
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {jwtExpiryDate && (
                                      <div className={`p-2 rounded-lg border text-[11px] font-mono flex items-center justify-between ${
                                        jwtIsExpired ? 'bg-rose-950/40 border-rose-800 text-rose-300' : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                                      }`}>
                                        <span>Expiration Status:</span>
                                        <span className="font-bold">{jwtIsExpired ? `Expired (${jwtExpiryDate})` : `Valid until ${jwtExpiryDate}`}</span>
                                      </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <div className="p-2.5 rounded-xl bg-[#04060a] border border-slate-800 space-y-1">
                                        <span className="text-[10px] text-slate-400 font-mono font-bold">HEADER</span>
                                        <pre className="font-mono text-[10px] text-cyan-300 overflow-x-auto">
                                          {JSON.stringify(jwtHeaderObj, null, 2)}
                                        </pre>
                                      </div>

                                      <div className="p-2.5 rounded-xl bg-[#04060a] border border-slate-800 space-y-1">
                                        <span className="text-[10px] text-slate-400 font-mono font-bold">PAYLOAD</span>
                                        <pre className="font-mono text-[10px] text-emerald-300 overflow-x-auto">
                                          {JSON.stringify(jwtPayloadObj, null, 2)}
                                        </pre>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Tab 3: Cryptographic Hasher */}
                            {cryptoTab === 'hasher' && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-mono text-slate-400">Algorithm:</span>
                                  <div className="flex gap-1">
                                    {(['SHA-256', 'SHA-512'] as const).map((algo) => (
                                      <button
                                        key={algo}
                                        type="button"
                                        onClick={() => setHashAlgo(algo)}
                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono cursor-pointer ${
                                          hashAlgo === algo
                                            ? 'bg-cyan-500 text-black font-bold'
                                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                                        }`}
                                      >
                                        {algo}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <textarea
                                  value={hashInput}
                                  onChange={(e) => setHashInput(e.target.value)}
                                  rows={2}
                                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-white focus:outline-none focus:border-cyan-400"
                                  placeholder="Enter text to hash..."
                                />

                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                                    <span>{hashAlgo} Hex Digest:</span>
                                    <button
                                      type="button"
                                      onClick={() => navigator.clipboard.writeText(calculatedHash)}
                                      className="flex items-center gap-1 text-cyan-400 hover:text-white cursor-pointer"
                                    >
                                      <Copy className="w-3 h-3" />
                                      <span>Copy Digest</span>
                                    </button>
                                  </div>
                                  <div className="p-2.5 rounded-xl bg-[#04060a] border border-slate-800 font-mono text-[11px] text-cyan-300 break-all">
                                    {calculatedHash || '(Computing...)'}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}

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
            {/* Speech recognition error notice banner */}
            {speechError && (
              <div className="mb-2 p-2.5 rounded-xl bg-rose-950/90 border border-rose-800 text-rose-300 text-xs flex items-center justify-between gap-2 shadow-lg backdrop-blur-xs animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 min-w-0">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span className="truncate">{speechError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSpeechError(null)}
                  className="text-rose-400 hover:text-white text-[11px] font-mono px-2 py-0.5 rounded bg-rose-900/50 hover:bg-rose-900 cursor-pointer transition-colors shrink-0"
                >
                  Dismiss
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className={`relative flex flex-col bg-[#0f121d] border ${
                isListening
                  ? 'border-rose-500/70 ring-1 ring-rose-500/30'
                  : 'border-slate-800 focus-within:border-cyan-500/70'
              } rounded-2xl shadow-2xl shadow-black/80 transition-all overflow-hidden`}
            >
              {/* Active Speech Recognition Indicator Bar */}
              {isListening && (
                <div className="px-3.5 py-1.5 bg-rose-500/10 border-b border-rose-500/20 flex items-center justify-between text-xs text-rose-300 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                    <span className="font-bold tracking-wide">Listening...</span>
                    <span className="text-[11px] text-rose-400/80 hidden sm:inline">(Transcribing voice in real-time)</span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className="text-[11px] text-rose-400 hover:text-rose-200 underline font-semibold cursor-pointer"
                  >
                    Done speaking
                  </button>
                </div>
              )}

              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  isListening
                    ? 'Listening... Speak clearly into your microphone'
                    : 'Ask for a tool, script, or Bitcoin / Solana calculations...'
                }
                rows={1}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none resize-none min-h-[52px] max-h-[160px] py-4 px-4 font-sans leading-relaxed"
              />

              <div className="flex items-center justify-between px-3.5 py-2 border-t border-slate-800/60 bg-slate-950/40 text-xs">
                <span className="text-[11px] font-mono text-slate-400">
                  Press Enter to send
                </span>

                <div className="flex items-center gap-2">
                  {/* Microphone Voice-to-Text Button */}
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                      isListening
                        ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30 border border-rose-400 animate-pulse'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 hover:border-slate-700'
                    }`}
                    title={isListening ? 'Stop voice recording' : 'Voice-to-text (Speech Recognition)'}
                    aria-label={isListening ? 'Stop voice recording' : 'Start voice-to-text recording'}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5 text-white" />
                        <span className="text-[11px]">Recording</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="hidden sm:inline text-[11px]">Voice</span>
                      </>
                    )}
                  </button>

                  {/* Send or Stop generating button */}
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
