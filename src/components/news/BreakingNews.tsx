import React, { useState, useEffect } from 'react';
import { Article } from '../../types';
import { newsService } from '../../services/newsService';
import { Radio, ArrowRight, ExternalLink } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useRouter } from '../../context/RouterContext';

export const BreakingNews: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [breaking, setBreaking] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const { navigate } = useRouter();

  useEffect(() => {
    let mounted = true;
    newsService
      .getBreakingNews()
      .then((data) => {
        if (mounted) {
          setBreaking(data);
        }
      })
      .catch((err) => {
        console.warn('[BreakingNews] Failed to fetch breaking news:', err);
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className={`w-full bg-red-50/60 border-b border-red-100 py-2 px-4 ${className}`}>
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-16 h-4 bg-red-200 rounded animate-pulse" />
          <div className="w-1/2 h-3.5 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!breaking) return null;

  return (
    <div className={`w-full bg-red-50/80 border-b border-red-100 py-2 px-3 sm:px-6 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
              Breaking
            </span>
          </div>

          <div
            onClick={() => navigate(`/article/${breaking.slug}`)}
            className="flex items-center gap-2 text-xs text-slate-800 hover:text-blue-600 cursor-pointer transition-colors truncate group"
          >
            <span className="font-semibold tracking-tight truncate">
              {breaking.title}
            </span>
            <span className="hidden md:inline-block text-[11px] font-mono text-slate-500 shrink-0">
              — {breaking.source} ({breaking.publishedAt})
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/article/${breaking.slug}`)}
          className="self-end sm:self-auto inline-flex items-center gap-1 text-[11px] font-mono font-bold text-red-600 hover:text-red-700 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <span>Read Story</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
