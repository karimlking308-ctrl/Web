import React, { useState, useEffect } from 'react';
import { AIAnalysis } from '../../types';
import { aiService } from '../../services/aiService';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, Compass, Info } from 'lucide-react';
import { DisclaimerBanner } from '../common/DisclaimerBanner';

interface AIAnalysisCardProps {
  articleId?: string;
  className?: string;
  isStandalone?: boolean;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({
  articleId,
  className = '',
  isStandalone = true,
}) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    aiService.getAnalysisForArticle(articleId).then((data) => {
      if (mounted) {
        setAnalysis(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [articleId]);

  if (loading) {
    return (
      <div className={`p-6 rounded-xl bg-blue-50/50 border border-blue-100 animate-pulse ${className}`}>
        <div className="h-6 bg-blue-200 w-1/3 rounded mb-4" />
        <div className="h-4 bg-slate-200 w-full rounded mb-2" />
        <div className="h-4 bg-slate-200 w-3/4 rounded" />
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className={`bg-[#f8fafc] border border-blue-200/80 rounded-xl p-5 md:p-6 shadow-xs relative overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-100 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-blue-950 tracking-tight text-base md:text-lg">
                PULSE AI Analysis
              </h3>
              <span className="text-[10px] font-mono uppercase bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200">
                Phase 4 Architecture
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured multi-factor financial synthesis and institutional context
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-500 self-start sm:self-auto font-semibold">
          Status: Ready for Gemini 2.5
        </span>
      </div>

      {/* Notice Banner */}
      <div className="my-4 p-3 rounded-lg bg-white border border-blue-200 flex items-start gap-2.5 text-xs text-slate-600 shadow-xs">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          AI analysis will appear here once the AI data service is connected in Phase 4. Below is the live structural layout displaying the 7 evaluation vectors.
        </p>
      </div>

      {/* Analysis Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5 relative z-10">
        {/* 1. What Happened */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>1. What Happened</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {analysis.summary}
          </p>
        </div>

        {/* 2. Why It Matters */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <span>2. Why It Matters</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
            {analysis.whyItMatters.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>

        {/* 3. Market Impact */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>3. Market Impact</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-2">
            {analysis.marketImpact.overview}
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="text-slate-500">Impact Level:</span>
            <span className="text-amber-600 font-bold uppercase">{analysis.marketImpact.level}</span>
          </div>
        </div>

        {/* 4. Bullish & Bearish Factors */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>4. Bullish Factors</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              {analysis.bullishFactors.slice(0, 2).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-600 uppercase tracking-wider mb-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>5. Bearish Factors</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              {analysis.bearishFactors.slice(0, 2).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 6. Key Risks */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 uppercase tracking-wider mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>6. Key Risks</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
            {analysis.keyRisks.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>

        {/* 7. Market Context */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>7. Relevant Market Context</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {analysis.marketContext}
          </p>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <DisclaimerBanner type="ai" className="mt-4" />
    </div>
  );
};
