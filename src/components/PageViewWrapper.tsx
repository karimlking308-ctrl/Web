import React from 'react';
import { ChevronRight, ArrowLeft, Home, Sparkles, Layers, ArrowUpRight } from 'lucide-react';
import { ContextAwareBackground } from './backgrounds/ContextAwareBackground';

export interface PageViewWrapperProps {
  pageId: string;
  badge: string;
  badgeIcon?: React.ReactNode;
  badgeColor?: 'emerald' | 'cyan' | 'purple' | 'indigo' | 'amber';
  title: string;
  titleGradient?: string;
  description: string;
  onNavigate: (sectionId: string) => void;
  children: React.ReactNode;
  quickJumps?: { id: string; label: string; icon?: React.ReactNode }[];
}

export const PageViewWrapper: React.FC<PageViewWrapperProps> = ({
  pageId,
  badge,
  badgeIcon,
  badgeColor = 'cyan',
  title,
  titleGradient,
  description,
  onNavigate,
  children,
  quickJumps,
}) => {
  const getBadgeClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'purple':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'indigo':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      case 'amber':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      default:
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
    }
  };

  const defaultQuickJumps = [
    { id: 'utility-tools', label: 'Micro-Tools' },
    { id: 'gas-calculator', label: 'Fee Estimator' },
    { id: 'developer-scripts', label: 'Scripts Vault' },
    { id: 'vault', label: 'VIP Vault (Free)' },
    { id: 'store', label: 'Pricing & Pro' },
    { id: 'dev-docs', label: 'Docs & API' },
    { id: 'backers-hub', label: 'Backers & Token' },
    { id: 'trust-legal-hub', label: 'Trust & Legal' },
  ].filter((j) => j.id !== pageId);

  const activeJumps = quickJumps || defaultQuickJumps.slice(0, 5);

  return (
    <div className="flex-1 flex flex-col bg-[#080b12] text-slate-100 relative overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Context-Aware Dynamic 60FPS Page Background Animation */}
      <ContextAwareBackground pageId={pageId} />

      {/* Background Ambient Lighting Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-cyan-500/10 via-emerald-500/5 to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-purple-500/5 blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-emerald-500/5 blur-[160px] pointer-events-none z-0" />

      {/* Persistent Page Header Bar & Breadcrumb Navigation */}
      <div className="border-b border-slate-800/80 bg-[#060913]/90 backdrop-blur-md pt-8 pb-10 sm:pt-10 sm:pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Row */}
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer text-slate-400"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-cyan-300 font-semibold">{title}</span>
            </nav>

            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Page Hero Title & Description */}
          <div className="max-w-3xl space-y-3">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono font-bold uppercase tracking-wider shadow-sm ${getBadgeClasses(
                badgeColor
              )}`}
            >
              {badgeIcon || <Sparkles className="w-3.5 h-3.5" />}
              <span>{badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {titleGradient ? (
                <span>
                  {title}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                    {titleGradient}
                  </span>
                </span>
              ) : (
                title
              )}
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

        </div>
      </div>

      {/* Main Page View Component Slot */}
      <div className="flex-1 relative z-10">
        {children}
      </div>

      {/* Quick Jump Ecosystem Bar at Bottom of every page */}
      <div className="border-t border-slate-800/80 bg-[#060913] py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Explore other SolPump Hubs:</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              {activeJumps.map((jump) => (
                <button
                  key={jump.id}
                  type="button"
                  onClick={() => onNavigate(jump.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{jump.label}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
