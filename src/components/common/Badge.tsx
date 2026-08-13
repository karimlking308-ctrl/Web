import React from 'react';
import { Category } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'category' | 'live' | 'breaking' | 'neutral' | 'ai' | 'bullish' | 'bearish';
  category?: Category;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  category,
  className = '',
  size = 'sm',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  let colorClasses = 'bg-slate-100 text-slate-700 border border-slate-200';

  if (category) {
    switch (category) {
      case 'crypto':
        colorClasses = 'bg-amber-50 text-amber-700 border border-amber-200';
        break;
      case 'stocks':
        colorClasses = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
        break;
      case 'economy':
        colorClasses = 'bg-blue-50 text-blue-700 border border-blue-200';
        break;
      case 'technology':
        colorClasses = 'bg-cyan-50 text-cyan-700 border border-cyan-200';
        break;
      case 'analysis':
        colorClasses = 'bg-indigo-50 text-indigo-700 border border-indigo-200';
        break;
      case 'trending':
        colorClasses = 'bg-rose-50 text-rose-700 border border-rose-200';
        break;
      case 'markets':
      default:
        colorClasses = 'bg-blue-50 text-blue-700 border border-blue-200';
        break;
    }
  } else {
    switch (variant) {
      case 'live':
        colorClasses = 'bg-red-50 text-red-700 border border-red-200 animate-pulse';
        break;
      case 'breaking':
        colorClasses = 'bg-red-600 text-white font-bold tracking-wider uppercase';
        break;
      case 'ai':
        colorClasses = 'bg-indigo-50 text-indigo-700 border border-indigo-200';
        break;
      case 'bullish':
        colorClasses = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
        break;
      case 'bearish':
        colorClasses = 'bg-rose-50 text-rose-700 border border-rose-200';
        break;
      case 'neutral':
      default:
        colorClasses = 'bg-slate-100 text-slate-700 border border-slate-200';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono uppercase tracking-wider font-semibold rounded ${sizeClasses} ${colorClasses} ${className}`}
    >
      {children}
    </span>
  );
};
