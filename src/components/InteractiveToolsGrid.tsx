import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Shield,
  Layers,
  Terminal,
  RefreshCw,
  Sliders,
  ExternalLink,
  Code2,
  KeyRound,
  Download,
  Lock,
  Search,
} from 'lucide-react';

interface InteractiveToolsGridProps {
  onOpenStore: () => void;
  onOpenLogin: () => void;
}

export const InteractiveToolsGrid: React.FC<InteractiveToolsGridProps> = ({
  onOpenStore,
  onOpenLogin,
}) => {
  // === Tool 1: Prompt Optimizer State ===
  const [inputPrompt, setInputPrompt] = useState('Create a high-converting Solana DeFi landing page copy');
  const [optimizerModel, setOptimizerModel] = useState<'agent' | 'reasoning' | 'json'>('agent');
  const [optimizedOutput, setOptimizedOutput] = useState<string>('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);

  const samplePrompts = [
    'Create a high-converting Solana DeFi landing page copy',
    'Write an Anchor smart contract with staking rewards',
    'Explain zero-knowledge rollups to a non-technical creator',
  ];

  const handleOptimizePrompt = (customInput?: string) => {
    const textToOptimize = customInput || inputPrompt;
    if (!textToOptimize.trim()) return;

    setIsOptimizing(true);
    setTimeout(() => {
      let result = '';
      if (optimizerModel === 'agent') {
        result = `### SYSTEM ROLE: Autonomous Financial & Web3 Specialist
**Objective:** Deliver an optimized, high-fidelity response for: "${textToOptimize.trim()}"

#### INSTRUCTIONS & CONSTRAINTS:
1. **Target Audience:** Sophisticated crypto builders and retail DeFi users.
2. **Tone & Style:** Authoritative, conversion-focused, precise, zero-fluff.
3. **Execution Steps:**
   - [Step 1] Outline core value proposition with quantitative metrics.
   - [Step 2] Address trust, non-custodial security, and Solana high-throughput advantages.
   - [Step 3] Structure clear visual call-to-actions (CTA).

#### OUTPUT SCHEMA:
- **Headline:** Punchy, high-impact (<= 8 words)
- **Subheadline:** Clear problem-solution statement (<= 25 words)
- **Feature Matrix:** 3 bullet points highlighting latency, audit verification, and tokenomics.
- **CTA:** Primary and secondary action triggers.`;
      } else if (optimizerModel === 'reasoning') {
        result = `[CHAIN-OF-THOUGHT BLUEPRINT]
<thinking>
1. Analyze the core requirements for: "${textToOptimize.trim()}".
2. Deconstruct state management, edge cases, and security boundaries.
3. Verify invariants: Prevent reentrancy, ensure arithmetic overflow checks, and validate token account ownership.
</thinking>

### OPTIMIZED REASONING PROMPT:
"You are a Principal Software Architect. For the task '${textToOptimize.trim()}', provide a step-by-step mathematical and algorithmic proof followed by production-grade, self-documenting implementation code. Highlight potential race conditions and specify automated unit test fixtures."`;
      } else {
        result = `{
  "$schema": "https://sol-pump.store/schemas/ai-task-v2.json",
  "task": "${textToOptimize.trim()}",
  "parameters": {
    "temperature": 0.2,
    "top_p": 0.95,
    "max_tokens": 2048,
    "enforce_json_schema": true
  },
  "system_directive": "Respond strictly in RFC 8259 JSON format. Do not prepend markdown ticks.",
  "expected_keys": ["status", "summary", "payload", "validation_checks"]
}`;
      }

      setOptimizedOutput(result);
      setIsOptimizing(false);
    }, 400);
  };

  const copyPromptOutput = () => {
    if (!optimizedOutput) return;
    navigator.clipboard.writeText(optimizedOutput);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  // === Tool 2: Solana Address Checker State ===
  const [solAddress, setSolAddress] = useState('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU');
  const [addressCopied, setAddressCopied] = useState(false);

  // Solana Base58 validation logic
  const validateSolanaAddress = (addr: string) => {
    const clean = addr.trim();
    if (!clean) return { status: 'idle', message: 'Enter a Solana address or choose a preset' };

    // Base58 characters only (no 0, O, I, l)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
    const isValidChars = base58Regex.test(clean);
    const length = clean.length;

    if (!isValidChars) {
      return {
        status: 'invalid',
        message: 'Invalid Base58 characters detected (contains forbidden 0, O, I, or l).',
        length,
        isBase58: false,
      };
    }

    if (length < 32 || length > 44) {
      return {
        status: 'invalid',
        message: `Invalid length (${length} chars). Solana addresses must be 32-44 Base58 characters.`,
        length,
        isBase58: true,
      };
    }

    // Special recognized addresses
    let typeName = 'Standard Ed25519 Public Key';
    if (clean === '11111111111111111111111111111111') typeName = 'Solana System Program';
    if (clean === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') typeName = 'SPL Token Program';
    if (clean.endsWith('pump')) typeName = 'Pump.fun Derived Curve Mint';

    return {
      status: 'valid',
      message: `Valid Solana Address (${typeName})`,
      length,
      isBase58: true,
      type: typeName,
    };
  };

  const addressValidation = validateSolanaAddress(solAddress);

  const sampleAddresses = [
    { label: 'Sample Wallet', val: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU' },
    { label: 'System Program', val: '11111111111111111111111111111111' },
    { label: 'Invalid Chars', val: '0x71C839509202029202930292020202020202020' },
  ];

  // === Tool 3: Digital Vault Access State ===
  const [selectedVaultTab, setSelectedVaultTab] = useState<'prompts' | 'solana' | 'ui'>('prompts');
  const [vaultUnlocked, setVaultUnlocked] = useState(false);

  const vaultItems = {
    prompts: [
      { name: '100+ Multi-Agent Reasoning Chains', count: '108 Prompts', format: 'JSON / Markdown' },
      { name: 'Financial & Tokenomics Meta-Synthesizer', count: '45 Blueprints', format: 'Claude & GPT-4o' },
      { name: 'Solana Error Code Auto-Resolver Prompts', count: '62 Templates', format: 'System Directives' },
    ],
    solana: [
      { name: 'Anchor Program Boilerplate Generator', count: '12 Crates', format: 'Rust 1.78+' },
      { name: 'RPC High-Throughput Load Balancer Hook', count: '8 Utilities', format: 'TypeScript / ESM' },
      { name: 'SPL Token 2022 Transfer Hook Kit', count: '5 Modules', format: 'Anchor v0.30' },
    ],
    ui: [
      { name: 'Cyberpunk Web3 Terminal Components', count: '28 Components', format: 'React 19 + Tailwind v4' },
      { name: 'Live Market Ticker & Candlestick Rig', count: '6 Widgets', format: 'HTML5 Canvas' },
      { name: 'Zero-Knowledge Wallet Connect Modal', count: '1 Framework', format: 'Wagmi / SolAdapter' },
    ],
  };

  return (
    <section id="utility-tools" className="py-16 md:py-24 bg-[#080b13] border-b border-slate-800/80 relative">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Tool Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Featured Utility Tools
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Test real-time AI prompt synthesis, validate Solana public keys, and preview exclusive digital creator vaults right from your browser.
          </p>
        </div>

        {/* 3 Interactive Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ========================================================= */}
          {/* CARD 1: Prompt Optimizer */}
          {/* ========================================================= */}
          <div className="rounded-2xl bg-[#0c101c] border border-slate-800 p-6 flex flex-col justify-between shadow-xl shadow-black/40 hover:border-slate-700 transition-all">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Prompt Optimizer</h3>
                    <p className="text-[11px] font-mono-code text-slate-400">AI Prompt Vault Engine</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  LIVE AI
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Transform basic prompts into structured, zero-hallucination meta-instructions with role parameters.
              </p>

              {/* Strategy Selector */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 mb-4 text-[11px]">
                <button
                  type="button"
                  onClick={() => setOptimizerModel('agent')}
                  className={`py-1.5 rounded-lg font-medium transition-all ${
                    optimizerModel === 'agent'
                      ? 'bg-slate-800 text-emerald-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Agent Role
                </button>
                <button
                  type="button"
                  onClick={() => setOptimizerModel('reasoning')}
                  className={`py-1.5 rounded-lg font-medium transition-all ${
                    optimizerModel === 'reasoning'
                      ? 'bg-slate-800 text-indigo-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Reasoning
                </button>
                <button
                  type="button"
                  onClick={() => setOptimizerModel('json')}
                  className={`py-1.5 rounded-lg font-medium transition-all ${
                    optimizerModel === 'json'
                      ? 'bg-slate-800 text-amber-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  JSON Schema
                </button>
              </div>

              {/* Input Area */}
              <div className="mb-3">
                <label className="block text-[11px] font-mono-code text-slate-400 mb-1.5">
                  Input Draft Prompt:
                </label>
                <textarea
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  rows={3}
                  placeholder="Type or paste any draft prompt here..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-200 text-xs placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none font-sans"
                />
              </div>

              {/* Presets Chips */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="text-[10px] text-slate-400 font-mono-code self-center mr-1">Presets:</span>
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputPrompt(p);
                      handleOptimizePrompt(p);
                    }}
                    className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    {idx === 0 ? 'DeFi Copy' : idx === 1 ? 'Anchor Contract' : 'ZK Explanation'}
                  </button>
                ))}
              </div>

              {/* Output Preview Box */}
              {optimizedOutput && (
                <div className="mb-4 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                  <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-mono-code text-emerald-400 flex items-center gap-1">
                      <Terminal className="w-3 h-3" />
                      Optimized Blueprint
                    </span>
                    <button
                      type="button"
                      onClick={copyPromptOutput}
                      className="text-[10px] font-mono-code flex items-center gap-1 text-slate-300 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700"
                    >
                      {promptCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{promptCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 text-[11px] font-mono-code text-slate-300 max-h-36 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                    {optimizedOutput}
                  </pre>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={() => handleOptimizePrompt()}
              disabled={isOptimizing || !inputPrompt.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-[#080b12] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Schema...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Optimize Prompt Now</span>
                </>
              )}
            </button>
          </div>

          {/* ========================================================= */}
          {/* CARD 2: Solana Address Checker */}
          {/* ========================================================= */}
          <div className="rounded-2xl bg-[#0c101c] border border-slate-800 p-6 flex flex-col justify-between shadow-xl shadow-black/40 hover:border-slate-700 transition-all">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Solana Address Checker</h3>
                    <p className="text-[11px] font-mono-code text-slate-400">Base58 Cryptographic Validator</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                  DEV TOOL
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Validate public keys, program accounts, and Base58 checksum rules with zero server latency.
              </p>

              {/* Address Input */}
              <div className="mb-3">
                <label className="block text-[11px] font-mono-code text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Solana Public Key (Base58):</span>
                  <span className="text-[10px] text-slate-400">{solAddress.length} chars</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={solAddress}
                    onChange={(e) => setSolAddress(e.target.value.trim())}
                    placeholder="e.g. 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-200 text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 font-mono-code"
                  />
                  {solAddress && (
                    <button
                      type="button"
                      onClick={() => setSolAddress('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Sample Presets */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="text-[10px] text-slate-400 font-mono-code self-center mr-1">Presets:</span>
                {sampleAddresses.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSolAddress(s.val)}
                    className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Status Diagnostic Card */}
              <div
                className={`p-3.5 rounded-xl border mb-4 text-xs transition-all ${
                  addressValidation.status === 'valid'
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                    : addressValidation.status === 'invalid'
                    ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {addressValidation.status === 'valid' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : addressValidation.status === 'invalid' ? (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className="font-bold font-mono-code text-[11px]">
                    {addressValidation.status === 'valid'
                      ? 'CHECKSUM VALID'
                      : addressValidation.status === 'invalid'
                      ? 'VALIDATION FAILED'
                      : 'AWAITING INPUT'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed mb-2 font-sans">
                  {addressValidation.message}
                </p>

                {addressValidation.status === 'valid' && (
                  <div className="pt-2 border-t border-emerald-500/20 grid grid-cols-2 gap-2 text-[10px] font-mono-code">
                    <div>
                      <span className="text-emerald-400">Encoding:</span> Base58 OK
                    </div>
                    <div>
                      <span className="text-emerald-400">Curve:</span> Ed25519
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action / Explorer Link */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(solAddress);
                  setAddressCopied(true);
                  setTimeout(() => setAddressCopied(false), 2000);
                }}
                disabled={!solAddress}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {addressCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{addressCopied ? 'Copied' : 'Copy Address'}</span>
              </button>

              <a
                href={
                  addressValidation.status === 'valid'
                    ? `https://solscan.io/account/${solAddress}`
                    : '#'
                }
                target="_blank"
                rel="noreferrer"
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  addressValidation.status === 'valid'
                    ? 'bg-indigo-500/10 hover:bg-indigo-500 text-indigo-300 hover:text-white border-indigo-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-500 pointer-events-none'
                }`}
              >
                <span>Solscan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CARD 3: Digital Vault Access */}
          {/* ========================================================= */}
          <div className="rounded-2xl bg-[#0c101c] border border-slate-800 p-6 flex flex-col justify-between shadow-xl shadow-black/40 hover:border-slate-700 transition-all">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Digital Vault Access</h3>
                    <p className="text-[11px] font-mono-code text-slate-400">sol-pump.store Bundles</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                  PREMIUM
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Direct access to high-value prompt repositories, Anchor Web3 contracts, and modular creator kits.
              </p>

              {/* Vault Category Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 mb-4 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedVaultTab('prompts')}
                  className={`py-1.5 rounded-lg font-medium transition-all ${
                    selectedVaultTab === 'prompts'
                      ? 'bg-slate-800 text-purple-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Prompt Packs
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedVaultTab('solana')}
                  className={`py-1.5 rounded-lg font-medium transition-all ${
                    selectedVaultTab === 'solana'
                      ? 'bg-slate-800 text-purple-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Anchor Kit
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedVaultTab('ui')}
                  className={`py-1.5 rounded-lg font-medium transition-all ${
                    selectedVaultTab === 'ui'
                      ? 'bg-slate-800 text-purple-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  UI Modules
                </button>
              </div>

              {/* Vault Items List */}
              <div className="space-y-2.5 mb-5">
                {vaultItems[selectedVaultTab].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      <span className="font-semibold text-slate-200">{item.name}</span>
                    </div>
                    <div className="text-right font-mono-code text-[10px] text-slate-400">
                      <span className="text-purple-300">{item.count}</span> · {item.format}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sample Blueprint Teaser */}
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-slate-300 mb-4">
                <div className="flex items-center justify-between mb-1 text-[11px] font-mono-code text-purple-300">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    Encrypted Creator Repository
                  </span>
                  <span>v3.2.0</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Includes complete JSON schemas, Claude meta-prompts, and Anchor tests ready for deployment.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={onOpenStore}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 cursor-pointer"
              >
                <span>Browse Digital Store Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={onOpenLogin}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Creator Portal Sign In</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
