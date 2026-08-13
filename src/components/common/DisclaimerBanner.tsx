import React from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';

interface DisclaimerBannerProps {
  type?: 'financial' | 'ai';
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  type = 'financial',
  className = '',
}) => {
  if (type === 'ai') {
    return (
      <div className={`flex items-start gap-2.5 p-3 rounded-lg bg-blue-50/80 border border-blue-200 text-blue-900 text-xs ${className}`}>
        <Sparkles className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-bold text-blue-950">AI Notice: </strong>
          AI-generated analysis is for informational purposes only and is not financial advice. PULSE models synthesize verified factual reporting without predicting future performance.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-2.5 p-3 rounded-lg bg-slate-100/90 border border-slate-200 text-slate-600 text-xs ${className}`}>
      <AlertCircle className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
      <p className="leading-relaxed">
        <strong className="font-bold text-slate-800">Financial Disclaimer: </strong>
        Market data, articles, and analysis published on PULSE are strictly for informational and educational purposes. Nothing herein constitutes investment advice, trading recommendation, or solicitation to buy or sell securities, commodities, or digital assets.
      </p>
    </div>
  );
};
