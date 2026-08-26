import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Zap,
  ArrowRight,
  Sparkles,
  TrendingDown,
  Clock,
  ShieldCheck,
  Cpu,
  Layers,
  Copy,
  Check,
  RefreshCw,
  Coins,
  Bot,
  Flame,
  HelpCircle,
} from 'lucide-react';

interface SolanaFeeEstimatorProps {
  onOpenStore: () => void;
  onOpenVault?: () => void;
}

interface TxTypeOption {
  id: string;
  name: string;
  category: 'transfer' | 'dex' | 'bot' | 'dev';
  icon: string;
  baseLamports: number; // base signature
  avgComputeUnits: number;
  rentSol: number; // one-time rent if applicable
  description: string;
  ethEquivalentUsd: number; // for comparison
}

const TX_TYPES: TxTypeOption[] = [
  {
    id: 'sol-transfer',
    name: 'SOL Native Transfer',
    category: 'transfer',
    icon: '💸',
    baseLamports: 5000,
    avgComputeUnits: 300,
    rentSol: 0,
    description: 'Standard peer-to-peer Ed25519 SOL transfer on Solana L1.',
    ethEquivalentUsd: 1.85,
  },
  {
    id: 'spl-transfer',
    name: 'SPL Token / USDC Transfer',
    category: 'transfer',
    icon: '🪙',
    baseLamports: 5000,
    avgComputeUnits: 4500,
    rentSol: 0,
    description: 'Transfer SPL tokens (USDC, BONK, WIF) between initialized accounts.',
    ethEquivalentUsd: 4.50,
  },
  {
    id: 'dex-swap',
    name: 'Raydium / Pump.fun DEX Swap',
    category: 'dex',
    icon: '🔄',
    baseLamports: 5000,
    avgComputeUnits: 95000,
    rentSol: 0,
    description: 'AMM pool swap route across Raydium CPMM, Pump.fun or Meteora DLMM.',
    ethEquivalentUsd: 14.20,
  },
  {
    id: 'create-ata',
    name: 'Associated Token Account (ATA)',
    category: 'transfer',
    icon: '📦',
    baseLamports: 5000,
    avgComputeUnits: 25000,
    rentSol: 0.00203928,
    description: 'One-time on-chain rent exemption to initialize a new token wallet account.',
    ethEquivalentUsd: 8.50,
  },
  {
    id: 'token-mint-launch',
    name: 'Token Mint + Metadata Creation',
    category: 'dev',
    icon: '🚀',
    baseLamports: 10000,
    avgComputeUnits: 150000,
    rentSol: 0.0145,
    description: 'Deploy new SPL Token-2022 mint, supply allocation, and Metaplex metadata.',
    ethEquivalentUsd: 65.00,
  },
  {
    id: 'sniper-jito',
    name: 'MEV Sniper Bot (Jito Bundle)',
    category: 'bot',
    icon: '🎯',
    baseLamports: 5000,
    avgComputeUnits: 220000,
    rentSol: 0,
    description: 'Sub-second mempool snipe with Jito validator tip for guaranteed inclusion.',
    ethEquivalentUsd: 48.00,
  },
  {
    id: 'smart-contract-deploy',
    name: 'Anchor Program Deployment',
    category: 'dev',
    icon: '📜',
    baseLamports: 25000,
    avgComputeUnits: 800000,
    rentSol: 1.85,
    description: 'Deploy compiled Rust/Anchor smart contract bytecode to Solana mainnet.',
    ethEquivalentUsd: 380.00,
  },
];

type PrioritySpeed = 'standard' | 'fast' | 'turbo' | 'jito';

export const SolanaFeeEstimator: React.FC<SolanaFeeEstimatorProps> = ({
  onOpenStore,
  onOpenVault,
}) => {
  const [selectedTxId, setSelectedTxId] = useState<string>('dex-swap');
  const [prioritySpeed, setPrioritySpeed] = useState<PrioritySpeed>('fast');
  const [txCount, setTxCount] = useState<number>(10);
  const [solPriceUsd, setSolPriceUsd] = useState<number>(195);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedLatency, setSimulatedLatency] = useState<number | null>(382);
  const [copiedBreakdown, setCopiedBreakdown] = useState<boolean>(false);

  const activeTx = useMemo(() => {
    return TX_TYPES.find((t) => t.id === selectedTxId) || TX_TYPES[0];
  }, [selectedTxId]);

  // Priority fee in SOL per transaction
  const priorityFeePerTxSol = useMemo(() => {
    switch (prioritySpeed) {
      case 'standard':
        return 0.000001; // ~1,000 micro-lamports
      case 'fast':
        return 0.00005; // 50,000 micro-lamports (Fast priority)
      case 'turbo':
        return 0.0008; // 800,000 micro-lamports (Turbo priority)
      case 'jito':
        return 0.0045; // Jito MEV validator bundle tip
      default:
        return 0.00005;
    }
  }, [prioritySpeed]);

  // Calculations
  const baseFeePerTxSol = activeTx.baseLamports / 1_000_000_000;
  const rentPerTxSol = activeTx.rentSol;
  const singleTxTotalSol = baseFeePerTxSol + priorityFeePerTxSol + rentPerTxSol;
  const grandTotalSol = singleTxTotalSol * txCount;
  const grandTotalUsd = grandTotalSol * solPriceUsd;

  // Comparison with Ethereum Mainnet
  const totalEthEquivalentUsd = activeTx.ethEquivalentUsd * txCount;
  const totalSavedUsd = Math.max(0, totalEthEquivalentUsd - grandTotalUsd);
  const savingsPercent = totalEthEquivalentUsd > 0
    ? (((totalEthEquivalentUsd - grandTotalUsd) / totalEthEquivalentUsd) * 100).toFixed(1)
    : '99.8';

  const handleSimulateRPC = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setSimulatedLatency(Math.floor(340 + Math.random() * 95));
      setIsSimulating(false);
    }, 450);
  };

  const handleCopyBreakdown = () => {
    const summary = `SolPump Solana Gas & Fee Estimate:
- Transaction: ${activeTx.name} (x${txCount})
- Priority Tier: ${prioritySpeed.toUpperCase()}
- Total Network Fee: ${grandTotalSol.toFixed(6)} SOL ($${grandTotalUsd.toFixed(4)} USD)
- Total Savings vs Ethereum: $${totalSavedUsd.toFixed(2)} (${savingsPercent}% Cheaper)
- Estimated Confirmation: ~${simulatedLatency || 380}ms
Generated on https://sol-pump.store`;
    navigator.clipboard.writeText(summary);
    setCopiedBreakdown(true);
    setTimeout(() => setCopiedBreakdown(false), 2000);
  };

  return (
    <section
      id="gas-calculator"
      className="py-16 md:py-24 bg-[#070a11] border-b border-slate-800/80 relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-indigo-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Free Lead-Magnet Utility</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Solana Gas &amp; Fee Estimator
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Real-time interactive fee, rent exemption, and priority MEV calculator for Solana traders, bot operators, and Web3 developers.
          </p>
        </div>

        {/* Main Interactive Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          {/* Left Column: Interactive Inputs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 bg-[#0c101c] border border-slate-800/90 rounded-2xl p-6 sm:p-7 shadow-xl shadow-black/50">
            {/* Step 1: Transaction Type Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-mono-code">
                    1
                  </span>
                  <span>Select Operation Type:</span>
                </label>
                <span className="text-[11px] font-mono-code text-slate-400">
                  {TX_TYPES.length} On-Chain Profiles
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TX_TYPES.map((tx) => {
                  const isSelected = tx.id === selectedTxId;
                  return (
                    <button
                      key={tx.id}
                      type="button"
                      onClick={() => setSelectedTxId(tx.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-sm shadow-emerald-500/10'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className="text-xl shrink-0 mt-0.5">{tx.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{tx.name}</p>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {tx.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Priority Fee Tier */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-mono-code">
                    2
                  </span>
                  <span>Priority Fee &amp; MEV Acceleration:</span>
                </label>
                <span className="text-[11px] font-mono-code text-slate-400">
                  CU Rate: +{(priorityFeePerTxSol * 1_000_000_000).toLocaleString()} Lamports
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'standard', label: 'Standard', sub: '0.000001 SOL', tag: 'Low Congestion', color: 'slate' },
                  { id: 'fast', label: 'Fast Priority', sub: '0.00005 SOL', tag: 'Recommended', color: 'emerald' },
                  { id: 'turbo', label: 'Turbo Ramping', sub: '0.00080 SOL', tag: 'High Volume', color: 'amber' },
                  { id: 'jito', label: 'Jito MEV Tip', sub: '0.00450 SOL', tag: 'Sniper Bot', color: 'teal' },
                ].map((tier) => {
                  const isSelected = prioritySpeed === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setPrioritySpeed(tier.id as PrioritySpeed)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 border-emerald-400 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-100">{tier.label}</p>
                      <p className="text-[10px] font-mono-code text-slate-400 mt-0.5">{tier.sub}</p>
                      <span className="inline-block text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-slate-950/80 text-emerald-400 border border-slate-800 mt-1.5 font-semibold">
                        {tier.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Transaction Batch Multiplier & SOL Price Slider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-800/80">
              {/* Batch Tx Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300">
                    Execution Batch Count:
                  </label>
                  <span className="text-xs font-mono-code font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    {txCount.toLocaleString()} {txCount === 1 ? 'Tx' : 'Txs'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  step="1"
                  value={txCount}
                  onChange={(e) => setTxCount(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] font-mono-code text-slate-400 mt-1.5">
                  <button type="button" onClick={() => setTxCount(1)} className="hover:text-white">1 Tx</button>
                  <button type="button" onClick={() => setTxCount(10)} className="hover:text-white">10 Txs</button>
                  <button type="button" onClick={() => setTxCount(100)} className="hover:text-white">100 Txs</button>
                  <button type="button" onClick={() => setTxCount(500)} className="hover:text-white">500 Txs</button>
                  <button type="button" onClick={() => setTxCount(1000)} className="hover:text-white">1,000 Txs</button>
                </div>
              </div>

              {/* SOL Price USD Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300">
                    SOL Price Reference (USD):
                  </label>
                  <span className="text-xs font-mono-code font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    ${solPriceUsd} USD
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="350"
                  step="5"
                  value={solPriceUsd}
                  onChange={(e) => setSolPriceUsd(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] font-mono-code text-slate-400 mt-1.5">
                  <button type="button" onClick={() => setSolPriceUsd(150)} className="hover:text-white">$150</button>
                  <button type="button" onClick={() => setSolPriceUsd(195)} className="hover:text-white">$195 (Live)</button>
                  <button type="button" onClick={() => setSolPriceUsd(250)} className="hover:text-white">$250</button>
                  <button type="button" onClick={() => setSolPriceUsd(300)} className="hover:text-white">$300</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Real-Time Results & Cost Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Primary Output Display Card */}
            <div className="rounded-2xl bg-gradient-to-b from-[#0e1424] to-[#0a0e19] border border-emerald-500/30 p-6 shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Estimated Cost Summary</h3>
                    <p className="text-[10px] font-mono-code text-slate-400">
                      {txCount}x {activeTx.name}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                  ESTIMATE
                </span>
              </div>

              {/* Big Price Stat */}
              <div className="my-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <p className="text-[11px] font-mono-code text-slate-400 mb-1 flex items-center justify-between">
                  <span>TOTAL ESTIMATED NETWORK FEE:</span>
                  <span className="text-emerald-400">@ ${solPriceUsd}/SOL</span>
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-emerald-300 font-mono-code">
                    ${grandTotalUsd < 0.01 ? grandTotalUsd.toFixed(5) : grandTotalUsd.toFixed(3)}
                  </span>
                  <span className="text-xs font-mono-code text-slate-400">USD</span>
                </div>
                <div className="text-xs font-mono-code text-emerald-400 mt-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>
                    {grandTotalSol < 0.0001 ? grandTotalSol.toFixed(7) : grandTotalSol.toFixed(5)} SOL
                  </span>
                  <span className="text-slate-400">
                    ({(grandTotalSol * 1_000_000_000).toLocaleString()} Lamports)
                  </span>
                </div>
              </div>

              {/* Detailed Itemized Breakdown */}
              <div className="space-y-2 text-xs font-mono-code text-slate-300 mb-5">
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span>Base Signature Fee:</span>
                  </span>
                  <span className="text-slate-200">
                    {(baseFeePerTxSol * txCount).toFixed(6)} SOL
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Priority Fee / CU Budget:</span>
                  <span className="text-emerald-400">
                    +{(priorityFeePerTxSol * txCount).toFixed(6)} SOL
                  </span>
                </div>

                {rentPerTxSol > 0 && (
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Rent Exemption Deposit:</span>
                    <span className="text-amber-300">
                      +{(rentPerTxSol * txCount).toFixed(6)} SOL
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Est. Compute Units (CU):</span>
                  <span className="text-slate-300">
                    ~{(activeTx.avgComputeUnits * txCount).toLocaleString()} CU
                  </span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Slot Latency / Block Time:</span>
                  <span className="text-emerald-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>~{simulatedLatency}ms (~1 slot)</span>
                  </span>
                </div>
              </div>

              {/* Ethereum Comparison Metric Box */}
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-indigo-300 font-bold flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                    <span>Cost vs. Ethereum Mainnet:</span>
                  </span>
                  <span className="text-emerald-400 font-mono-code font-bold">
                    {savingsPercent}% Cheaper
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  The same {txCount} operations on Ethereum L1 would cost approx{' '}
                  <span className="font-bold text-rose-300 font-mono-code">
                    ${totalEthEquivalentUsd.toFixed(2)} USD
                  </span>
                  . You save{' '}
                  <span className="font-bold text-emerald-300 font-mono-code">
                    ${totalSavedUsd.toFixed(2)} USD
                  </span>{' '}
                  on Solana!
                </p>
              </div>

              {/* Utility Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSimulateRPC}
                  disabled={isSimulating}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-emerald-400' : ''}`} />
                  <span>{isSimulating ? 'Pinging RPC...' : 'Simulate Ping'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyBreakdown}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedBreakdown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBreakdown ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* High-Converting Promotional Lead-Magnet Conversion Banner */}
        <div className="relative rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-indigo-950/50 border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl shadow-emerald-500/10 overflow-hidden">
          {/* Subtle Cyber Pattern Backdrop */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono-code font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>BUILD &amp; AUTOMATE SOLANA APPS</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Unlock the full source code and advanced Solana/Telegram kits in our Digital Vault
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                Get turnkey access to our <strong className="text-emerald-300">Solana Token Sniper Bot</strong>, <strong className="text-white">Telegram Clicker Game</strong>, <strong className="text-emerald-300">WhatsApp AI Lead Gen</strong>, and <strong className="text-white">n8n Automation Workflows</strong> with perpetual source code rights.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={onOpenStore}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-[#080b12] text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 cursor-pointer group"
              >
                <span>Unlock Digital Vault</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {onOpenVault && (
                <button
                  type="button"
                  onClick={onOpenVault}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer font-mono-code"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Preview 9 Products</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
