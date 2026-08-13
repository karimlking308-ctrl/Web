import React from 'react';
import { MarketAsset } from '../../types';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface MarketCardProps {
  asset: MarketAsset;
  onClick?: () => void;
  compact?: boolean;
}

export const MarketCard: React.FC<MarketCardProps> = ({ asset, onClick, compact = false }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200 hover:border-blue-300 rounded-lg p-3.5 transition-all hover:shadow-xs flex flex-col justify-between gap-2.5 cursor-pointer shadow-xs ${compact ? 'p-2.5' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-slate-900 text-sm">{asset.symbol}</span>
            <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
              {asset.type}
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate max-w-[140px] mt-0.5">{asset.name}</p>
        </div>

        <div className="p-1 rounded bg-slate-100 text-slate-500">
          <Activity className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
        {asset.price !== null ? (
          <>
            <span className="font-mono font-bold text-slate-900 text-sm">
              ${asset.price.toLocaleString()}
            </span>
            <span
              className={`text-xs font-mono font-bold flex items-center gap-0.5 ${
                asset.change && asset.change >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {asset.change && asset.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {asset.changePercent ? `${asset.changePercent > 0 ? '+' : ''}${asset.changePercent}%` : '0.00%'}
            </span>
          </>
        ) : (
          <div className="w-full flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 italic">
              Live Feed
            </span>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 font-semibold">
              Phase 3 API
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
