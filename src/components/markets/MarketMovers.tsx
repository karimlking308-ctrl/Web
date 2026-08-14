import React, { useState, useEffect } from 'react';
import { MarketMoversData } from '../../types';
import { marketService } from '../../services/marketService';
import { MarketCard } from './MarketCard';
import { ArrowUpRight, ArrowDownRight, Zap, Info } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';

export const MarketMovers: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [movers, setMovers] = useState<MarketMoversData | null>(null);
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers' | 'mostActive'>('gainers');
  const [loading, setLoading] = useState(true);
  const { navigate } = useRouter();

  useEffect(() => {
    let isMounted = true;
    marketService
      .getMarketMovers()
      .then((data) => {
        if (isMounted) {
          setMovers(data);
        }
      })
      .catch((err) => {
        console.warn('[MarketMovers] Load error:', err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  const tabs = [
    { id: 'gainers', label: 'Top Gainers', icon: ArrowUpRight, color: 'text-emerald-400' },
    { id: 'losers', label: 'Top Losers', icon: ArrowDownRight, color: 'text-rose-400' },
    { id: 'mostActive', label: 'Most Active', icon: Zap, color: 'text-sky-400' },
  ] as const;

  const currentList = movers ? movers[activeTab] : [];

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-3.5 bg-blue-600 rounded-xs" />
            <h3 className="font-bold text-[#0f172a] tracking-tight text-base md:text-lg">
              Market Movers
            </h3>
            <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
              Overview
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time equity and cryptocurrency market movement indicators
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notice regarding Phase 1 placeholder states */}
      <div className="my-3 py-2 px-3 rounded bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="text-[11px]">Real-time price & 24h volume indicators updated continuously from live crypto & equity market streams.</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold uppercase">Live Data</span>
      </div>

      {/* Grid of Market Assets */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 bg-slate-100 rounded-lg border border-slate-200 animate-shimmer h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {currentList.map((asset) => (
            <MarketCard
              key={asset.symbol}
              asset={asset}
              onClick={() => navigate('/markets')}
            />
          ))}
        </div>
      )}
    </div>
  );
};
