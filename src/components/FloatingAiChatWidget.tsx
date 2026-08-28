import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
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
  Minimize2,
  Maximize2,
  ShieldCheck,
  Code2,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  codeSnippet?: string;
  quickAction?: {
    label: string;
    sectionId: string;
    icon?: 'zap' | 'terminal' | 'vault' | 'shield' | 'code';
  };
}

interface FloatingAiChatWidgetProps {
  onNavigate: (sectionId: string) => void;
}

const STARTER_PROMPTS = [
  {
    label: '⚡ What free tools & scripts are available?',
    prompt: 'What free tools, scripts, and downloads does SolPump Store provide?',
  },
  {
    label: '💰 How does the Solana Fee Estimator work?',
    prompt: 'Explain how the Solana Gas & Priority Fee Estimator calculates fees and compute units.',
  },
  {
    label: '📦 What is inside the Free Digital Vault?',
    prompt: 'What downloadable assets and ZIP templates are in the Digital Vault?',
  },
  {
    label: '🤖 How to use the Telegram Mini-App template?',
    prompt: 'How do I set up and run the Telegram Mini-App and Clicker Game template?',
  },
  {
    label: '🛡️ Is SolPump Store safe and non-custodial?',
    prompt: 'Is my private key safe when using SolPump tools?',
  },
];

// Offline / instantaneous Web3 knowledge base matcher
function getInstantWeb3Response(query: string): { content: string; codeSnippet?: string; quickAction?: ChatMessage['quickAction'] } {
  const q = query.toLowerCase();

  if (q.includes('fee') || q.includes('gas') || q.includes('compute unit') || q.includes('lamport') || q.includes('priority')) {
    return {
      content: `### ⚡ Solana Priority & Gas Fee Suite

The **Solana Gas & Priority Fee Estimator** calculates real-time transaction costs based on compute unit limits and priority multipliers.

- **Base Network Fee**: Standard 5,000 lamports (0.000005 SOL) per signature.
- **Compute Unit Limit**: Standard transactions consume ~200,000 CU; complex DEX swaps consume 400,000–600,000 CU.
- **Priority Fee Multiplier**: Calculated in **Micro-Lamports per Compute Unit**.

To guarantee high-speed landing during network congestion, use our dynamic sliders to estimate exact SOL & USD costs.`,
      codeSnippet: `// Example Solana Web3.js Compute Budget Instruction:
import { ComputeBudgetProgram, Transaction } from '@solana/web3.js';

const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({ 
  units: 300_000 
});

const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({ 
  microLamports: 50_000 // 50k micro-lamports per CU
});

const transaction = new Transaction()
  .add(modifyComputeUnits)
  .add(addPriorityFee);`,
      quickAction: {
        label: 'Launch Solana Fee Estimator',
        sectionId: 'gas-calculator',
        icon: 'zap',
      },
    };
  }

  if (q.includes('vault') || q.includes('download') || q.includes('zip') || q.includes('asset') || q.includes('workflow') || q.includes('prompt')) {
    return {
      content: `### 📦 VIP Digital Asset Vault (100% Free Downloads)

The Digital Vault contains 5 complete, ready-to-use production packages generated dynamically in-browser:

1. **Telegram Mini-App & Clicker Game**: Full React + Vite + Telegram WebApp SDK template with tap-to-earn mechanics.
2. **WhatsApp AI Auto-Responder Lead Bot**: Node.js automated assistant with QR code auth and sentiment routing.
3. **Solana Token Sniper & Liquidity Watcher**: Python async script monitoring Raydium / Pump.fun liquidity pools.
4. **n8n Automation Workflows (.JSON)**: 1-click importable JSON pipelines for Discord alerts and CRM sync.
5. **1,500+ Curated AI Master Prompt Vaults**: Markdown & CSV prompt libraries for copywriting, trading strategy, and coding.`,
      quickAction: {
        label: 'Open Free Digital Vault',
        sectionId: 'vault',
        icon: 'vault',
      },
    };
  }

  if (q.includes('script') || q.includes('airdrop') || q.includes('jito') || q.includes('mev') || q.includes('bot') || q.includes('python') || q.includes('rust')) {
    return {
      content: `### 🛠️ Developer Scripts Vault

We provide open-source, battle-tested automation code for Solana and Web3 developers:

- **Solana Bulk Airdrop Engine**: Distribute SPL tokens or native SOL to 1,000+ wallets with automated chunking, exponential backoff retries, and priority fee optimization.
- **Jito MEV Frontrunning Protection**: Rust & Python scripts for submitting zero-slippage MEV bundles directly to Jito Block Engine validators.
- **Telegram Automated Broadcast Engine**: Node.js multi-channel broadcast bot with MarkdownV2 formatting.
- **AI Content Batch Generator**: Automated prompt pipeline for generating daily social media assets.`,
      codeSnippet: `// Quick snippet: Chunking Solana Airdrop Recipients
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Chunks recipients into max 10 transfers per transaction
const recipientBatches = chunkArray(walletList, 10);`,
      quickAction: {
        label: 'Explore Developer Scripts',
        sectionId: 'developer-scripts',
        icon: 'terminal',
      },
    };
  }

  if (q.includes('telegram') || q.includes('clicker') || q.includes('mini-app')) {
    return {
      content: `### 📱 Telegram Mini-App & Clicker Game Template

Our Telegram WebApp template includes:
- **Framework**: React 18 + Vite + Tailwind CSS
- **Telegram SDK**: Seamless @twa-dev/sdk integration with haptic feedback, theme synchronization, and cloud storage.
- **Core Game Loop**: Tap counter with local state persistence, passive energy regen, multiplier upgrades, and TON/Solana wallet connect stubs.
- **Deployment**: 1-click Vercel / Cloudflare Pages ready.`,
      codeSnippet: `# Quick Setup Guide:
1. Download the ZIP package from our Digital Vault.
2. Unzip and run: npm install
3. Create a bot with @BotFather on Telegram and configure WebApp URL.
4. Run locally with: npm run dev`,
      quickAction: {
        label: 'Download Telegram Mini-App Template',
        sectionId: 'vault',
        icon: 'vault',
      },
    };
  }

  if (q.includes('safe') || q.includes('security') || q.includes('key') || q.includes('custodial') || q.includes('audit')) {
    return {
      content: `### 🛡️ Non-Custodial Architecture & Trust

**SolPump Store is 100% client-side and non-custodial.**

- **Zero Server Storage**: Private keys, prompts, JSON payloads, and wallet addresses run entirely in your local browser sandbox.
- **No Tracking**: We do not store, log, or transmit your sensitive credentials to any external server.
- **MIT Licensed**: All scripts and templates are open-source and can be inspected before execution.`,
      quickAction: {
        label: 'View Trust & Legal Hub',
        sectionId: 'trust-legal-hub',
        icon: 'shield',
      },
    };
  }

  if (q.includes('tool') || q.includes('micro') || q.includes('formatter') || q.includes('obfuscator') || q.includes('inspector')) {
    return {
      content: `### 🔧 Interactive Web3 Micro-Tools

SolPump Store features 4 live client-side micro-utilities:

1. **AI Prompt Optimizer**: Formats and sharpens system instructions with few-shot context framing.
2. **JSON Payload Formatter**: Formats, minifies, and syntax-validates Web3 RPC calls and Solana instructions.
3. **Secret Key Obfuscator**: Client-side byte-masking tool for sanitizing API keys and Base58 keys before sharing logs.
4. **SPL Token Inspector**: Decodes decimals, freeze authorities, and token supply parameters instantly.`,
      quickAction: {
        label: 'Open Interactive Micro-Tools',
        sectionId: 'utility-tools',
        icon: 'code',
      },
    };
  }

  // General helpful fallback
  return {
    content: `### SolPump Web3 Assistant

I can help you with:
- **Developer Scripts**: Solana Airdrops, Jito MEV protection, Telegram bots.
- **Digital Vault**: 1-click free ZIP templates (Telegram Mini-App, WhatsApp AI bot, n8n workflows).
- **Solana Gas & Fees**: Real-time compute unit pricing & priority fee calculation.
- **Micro-Tools**: Prompt optimization, JSON validation, key masking, and token inspection.

Feel free to ask a specific question or choose one of the quick options below!`,
    quickAction: {
      label: 'Explore All Tools & Scripts',
      sectionId: 'utility-tools',
      icon: 'code',
    },
  };
}

export const FloatingAiChatWidget: React.FC<FloatingAiChatWidgetProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! 👋 I am **SolPump AI**, your Web3 and Solana automation assistant.

I can guide you through our **open-source developer scripts**, **free ZIP downloads**, **Solana fee calculations**, and **browser-based micro-tools**.

How can I help your project today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus textarea when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputValue).trim();
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

    try {
      // 1. Try server-side Gemini AI endpoint first
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
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickAction: getInstantWeb3Response(text).quickAction,
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsLoading(false);
        return;
      }
    } catch {
      // Ignore network errors and fallback cleanly
    }

    // 2. High-quality instant knowledge engine fallback
    setTimeout(() => {
      const instant = getInstantWeb3Response(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: instant.content,
        codeSnippet: instant.codeSnippet,
        quickAction: instant.quickAction,
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

  const handleCopyCode = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat session reset. ✨ How can I assist you with SolPump Store scripts, tools, or templates?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <button
          id="floating-ai-chat-trigger"
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0a0b10] hover:bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 shadow-2xl shadow-cyan-950/40 text-slate-200 transition-all duration-300 hover:scale-105 cursor-pointer"
          aria-label="Open SolPump AI Assistant"
        >
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 border border-slate-700 group-hover:border-cyan-400/60 transition-colors">
            <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-white tracking-tight">SolPump AI</span>
            <span className="text-[10px] text-slate-400 font-mono-code leading-none">Web3 Copilot</span>
          </div>
        </button>
      )}

      {/* Floating ChatGPT-Style Overlay Window */}
      {isOpen && (
        <div
          id="floating-ai-chat-widget"
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col bg-[#0a0b10] border border-slate-800 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-xl transition-all duration-200 overflow-hidden ${
            isExpanded
              ? 'w-[calc(100vw-2rem)] sm:w-[580px] h-[calc(100vh-3rem)] sm:h-[680px]'
              : 'w-[calc(100vw-2rem)] sm:w-[410px] h-[560px] max-h-[84vh]'
          }`}
          role="dialog"
          aria-labelledby="ai-chat-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800/80 bg-slate-950/60 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shadow-inner">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 id="ai-chat-title" className="text-xs font-bold text-white tracking-tight">
                    SolPump AI Copilot
                  </h3>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono-code">
                    v2.4
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Online • Web3 &amp; Solana Engine</span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={handleResetChat}
                title="Reset conversation"
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse' : 'Expand'}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed space-y-2 ${
                    msg.role === 'user'
                      ? 'bg-slate-800/90 border border-slate-700/70 text-slate-100 rounded-tr-xs shadow-md'
                      : 'bg-slate-900/60 border border-slate-800/80 text-slate-300 rounded-tl-xs shadow-sm'
                  }`}
                >
                  {/* Message formatted body */}
                  <div className="space-y-1.5 whitespace-pre-line text-slate-200 text-xs">
                    {msg.content.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h4 key={pIdx} className="text-xs font-bold text-white pt-1">
                            {paragraph.replace('### ', '')}
                          </h4>
                        );
                      }
                      return <p key={pIdx}>{paragraph}</p>;
                    })}
                  </div>

                  {/* Optional Embedded Code Snippet */}
                  {msg.codeSnippet && (
                    <div className="mt-2 rounded-xl bg-[#080b12] border border-slate-800 p-2.5 font-mono text-[11px] text-slate-300 relative group overflow-x-auto">
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80 text-[10px] text-slate-400">
                        <span>Code Reference</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(msg.codeSnippet!, msg.id)}
                          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[10px]"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-slate-300 overflow-x-auto whitespace-pre">
                        {msg.codeSnippet}
                      </pre>
                    </div>
                  )}

                  {/* Optional Quick Action Navigation Button */}
                  {msg.quickAction && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate(msg.quickAction!.sectionId);
                          // On mobile, minimize chat after navigation
                          if (window.innerWidth < 640) {
                            setIsOpen(false);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer"
                      >
                        {msg.quickAction.icon === 'zap' && <Zap className="w-3 h-3 text-cyan-400" />}
                        {msg.quickAction.icon === 'terminal' && <Terminal className="w-3 h-3 text-emerald-400" />}
                        {msg.quickAction.icon === 'vault' && <FolderArchive className="w-3 h-3 text-purple-400" />}
                        {msg.quickAction.icon === 'shield' && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                        {msg.quickAction.icon === 'code' && <Code2 className="w-3 h-3 text-indigo-400" />}
                        <span>{msg.quickAction.label}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  )}

                  <div className="text-[9px] text-slate-400 text-right pt-0.5 font-mono">
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3 h-3 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl rounded-tl-xs p-3.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] text-slate-400 pl-1 font-mono-code">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Suggestions */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-4 py-2 border-t border-slate-800/50 bg-slate-950/40">
              <div className="text-[10px] font-mono-code text-slate-400 mb-1.5 flex items-center gap-1">
                <span>Suggested questions:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {STARTER_PROMPTS.slice(0, 3).map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(item.prompt)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box Area */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2 bg-[#080b12] border border-slate-700/80 focus-within:border-cyan-500/80 rounded-xl p-2 transition-colors"
            >
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Web3 tools, fee math, or scripts..."
                rows={1}
                className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none resize-none max-h-24 py-1 px-1 font-sans"
              />

              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                  inputValue.trim() && !isLoading
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-[#080b12]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[9px] text-slate-400 px-1 pt-1.5">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span>100% Client-Safe</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
