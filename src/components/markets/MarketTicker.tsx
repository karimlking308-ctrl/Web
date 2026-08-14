import React, { useEffect, useState } from 'react';
import { MarketAsset } from '../../types';
import { marketService } from '../../services/marketService';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';

export const MarketTicker: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [assets, setAssets] = useState<MarketAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const { navigate } = useRouter();

  useEffect(() => {
    let mounted = true;
    marketService.getTickerAssets().then(data => {
      if (mounted) {
        setAssets(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className={`w-full bg-white border-b border-slate-200 overflow-hidden select-none py-1.5 text-[10px] font-mono shadow-xs ${className}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-3">
        {/* Ticker Indicator */}
        <div className="flex items-center gap-2 shrink-0 border-r border-slate-200 pr-3">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="font-mono text-[10px] font-bold text-slate-800 uppercase tracking-wider hidden sm:inline">
            Markets
          </span>
          <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
            Live Stream
          </span>
        </div>

        {/* Scrollable / Marquee Ticker Track */}
        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center space-x-6 py-0.5 scroll-smooth">
          {loading ? (
            <div className="flex items-center gap-4 py-0.5 text-slate-400 font-mono text-xs">
              <Clock className="w-3.5 h-3.5 animate-spin text-slate-400" />
              <span>Loading market ticker channels...</span>
            </div>
          ) : (
            assets.map((asset) => (
              <div
                key={asset.symbol}
                onClick={() => navigate('/markets')}
                className="flex items-center space-x-2 shrink-0 hover:bg-slate-50 px-2 py-0.5 rounded transition-colors cursor-pointer group"
                title={`${asset.name} - Real-time market quote`}
              >
                <span className="font-bold text-slate-600 group-hover:text-blue-600 uppercase transition-colors">
                  {asset.symbol}
                </span>

                {asset.price !== null ? (
                  <div className="flex items-center space-x-1.5 font-mono">
                    <span className="text-slate-800 font-semibold">
                      ${asset.price.toLocaleString()}
                    </span>
                    <span className={`text-[10px] font-bold flex items-center ${asset.change && asset.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {asset.change && asset.change >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                      {asset.changePercent && asset.changePercent >= 0 ? `+${asset.changePercent}%` : `${asset.changePercent}%`}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    [00.0] 0.00%
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Quick link */}
        <div className="shrink-0 pl-2 hidden md:block border-l border-slate-200">
          <button
            onClick={() => navigate('/markets')}
            className="text-[10px] font-mono text-blue-600 hover:text-blue-700 transition-colors uppercase font-bold pl-2 cursor-pointer"
          >
            All Markets →
          </button>
        </div>
      </div>
    </div>
  );
};
