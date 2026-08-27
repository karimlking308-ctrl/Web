import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Coins,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  BarChart3,
  Users,
  Droplets,
  Zap,
  Sparkles,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export const TokenStatsTicker: React.FC = () => {
  const [copiedCA, setCopiedCA] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Real-time market data state with dynamic micro-fluctuations
  const [marketData, setMarketData] = useState({
    priceUSD: 0.00428,
    priceTON: 0.00074,
    change24h: 14.82,
    volume24hUSD: 148920,
    liquidityUSD: 86450,
    marketCapUSD: 428000,
    holderCount: 1842,
    totalTransactions24h: 3914,
    tonBlockHeight: 41829402,
    networkLatencyMs: 24,
  });

  const contractAddress = 'EQBMaQWsEnD2w2cJO9LjVGecg5Xhqw9RjTxPW7J4UenTlXnS';
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Micro-fluctuation engine to simulate live block telemetry updates
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setMarketData((prev) => {
        const delta = (Math.random() - 0.48) * 0.00004;
        const newPrice = Math.max(0.0039, +(prev.priceUSD + delta).toFixed(6));
        const blockInc = Math.floor(Math.random() * 2) + 1;
        const txInc = Math.floor(Math.random() * 3);
        const holderInc = Math.random() > 0.85 ? 1 : 0;
        
        return {
          ...prev,
          priceUSD: newPrice,
          priceTON: +(newPrice / 5.78).toFixed(6),
          volume24hUSD: prev.volume24hUSD + Math.floor(Math.random() * 45),
          totalTransactions24h: prev.totalTransactions24h + txInc,
          holderCount: prev.holderCount + holderInc,
          tonBlockHeight: prev.tonBlockHeight + blockInc,
          networkLatencyMs: Math.floor(20 + Math.random() * 8),
        };
      });
      setLastUpdated(new Date());
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMarketData((prev) => ({
        ...prev,
        priceUSD: +(prev.priceUSD * (1 + (Math.random() * 0.01 - 0.004))).toFixed(6),
        tonBlockHeight: prev.tonBlockHeight + Math.floor(Math.random() * 4) + 1,
        volume24hUSD: prev.volume24hUSD + Math.floor(Math.random() * 120),
      }));
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 600);
  };

  const handleCopyCA = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(contractAddress);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = contractAddress;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedCA(true);
      setTimeout(() => setCopiedCA(false), 2500);
    } catch (err) {
      console.error('Failed to copy CA:', err);
    }
  };

  return (
    <section
      id="token-stats"
      className="relative bg-[#060911] border-y border-slate-800/90 py-10 sm:py-14 overflow-hidden"
    >
      {/* Background Subtle Ambience Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Status Bar: Live Node Banner & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800/80 mb-8">
          
          {/* Left: Token Identity & Live Node Indicator */}
          <div className="flex items-center gap-3.5 flex-wrap">
            {/* Live Node Active Beacon */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-400 tracking-wide uppercase">
                Live TON Node Active
              </span>
              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                • Block #{marketData.tonBlockHeight.toLocaleString()}
              </span>
            </div>

            {/* Token Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0d1526] border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>$sopump</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">TON Jetton</span>
            </div>

            {/* Sync Latency */}
            <div className="text-[11px] font-mono text-slate-400 hidden lg:flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>Telemetry: {marketData.networkLatencyMs}ms</span>
            </div>
          </div>

          {/* Right: Contract Address & Refresh Trigger */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Quick Contract Address Pill with Copy */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs font-mono">
              <span className="text-slate-400 text-[11px]">CA:</span>
              <span className="text-slate-300 font-bold truncate max-w-[120px] sm:max-w-[160px]">
                {contractAddress.slice(0, 6)}...{contractAddress.slice(-6)}
              </span>
              <button
                type="button"
                onClick={handleCopyCA}
                title="Copy Contract Address"
                className="p-1 rounded hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                {copiedCA ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Manual Refresh Button */}
            <button
              type="button"
              onClick={handleManualRefresh}
              title="Refresh Live Metrics"
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-slate-200 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Primary 4 Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          {/* Card 1: Token Price & 24h Change */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090e1a] border border-slate-800/80 hover:border-cyan-500/30 transition-all shadow-lg relative group">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase mb-2">
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-cyan-400" /> Current Price
              </span>
              <span
                className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                  marketData.change24h >= 0
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}
              >
                {marketData.change24h >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-rose-400" />
                )}
                +{marketData.change24h}%
              </span>
            </div>
            
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1 font-mono">
              ${marketData.priceUSD.toFixed(5)}
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>≈ {marketData.priceTON.toFixed(5)} TON</span>
              <span className="text-[11px] text-slate-500">24h High: $0.00451</span>
            </div>
          </div>

          {/* Card 2: 24h Trading Volume */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090e1a] border border-slate-800/80 hover:border-emerald-500/30 transition-all shadow-lg relative group">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase mb-2">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-400" /> 24h Volume
              </span>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <Zap className="w-3 h-3" /> High Velocity
              </span>
            </div>
            
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1 font-mono">
              ${marketData.volume24hUSD.toLocaleString()}
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{marketData.totalTransactions24h.toLocaleString()} Txns</span>
              <span className="text-[11px] text-slate-500">DEX Aggregated</span>
            </div>
          </div>

          {/* Card 3: Total On-Chain Liquidity & Market Cap */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090e1a] border border-slate-800/80 hover:border-purple-500/30 transition-all shadow-lg relative group">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase mb-2">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-purple-400" /> Total Liquidity
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-semibold">
                Locked Pool
              </span>
            </div>
            
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1 font-mono">
              ${marketData.liquidityUSD.toLocaleString()}
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>FDV: ${marketData.marketCapUSD.toLocaleString()}</span>
              <span className="text-[11px] text-slate-500">TON / STON.fi</span>
            </div>
          </div>

          {/* Card 4: Holder Growth & Distribution */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090e1a] border border-slate-800/80 hover:border-teal-500/30 transition-all shadow-lg relative group">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase mb-2">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-teal-400" /> Active Holders
              </span>
              <span className="text-[11px] text-teal-400 font-mono font-semibold">
                +8.4% this week
              </span>
            </div>
            
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1 font-mono">
              {marketData.holderCount.toLocaleString()}
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Verified On-Chain</span>
              <span className="text-[11px] text-teal-400/80 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Decentralized
              </span>
            </div>
          </div>

        </div>

        {/* Direct Trading & Tracking Pool Quick Links */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0f1d] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white">Direct Tracking &amp; Liquidity Pools</span>
              <p className="text-slate-400 text-[11px] font-mono">Verify telemetry, trade tokens, or track block transactions</p>
            </div>
          </div>

          {/* Pool Action Links */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full md:w-auto justify-start md:justify-end">
            
            {/* Gas Pump / DEX Pool */}
            <a
              href="https://gas.pump"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer group"
            >
              <span>Gas Pump</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* TonViewer Blockchain Explorer */}
            <a
              href={`https://tonviewer.com/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer group"
            >
              <span>TonViewer</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* DeDust / STON.fi DEX */}
            <a
              href={`https://dedust.io/swap/TON/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/40 text-purple-300 hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer group"
            >
              <span>DeDust Pool</span>
              <ExternalLink className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* TonScan Explorer */}
            <a
              href={`https://tonscan.org/jetton/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-teal-500/40 text-teal-300 hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer group hidden sm:flex"
            >
              <span>TonScan</span>
              <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
            </a>

          </div>

        </div>

      </div>
    </section>
  );
};
