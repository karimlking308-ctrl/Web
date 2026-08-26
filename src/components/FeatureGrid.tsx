import React from 'react';
import { Sparkles, Code2, Cpu, ArrowRight, CheckCircle2, Star, Zap } from 'lucide-react';
import { CATEGORIES } from '../data/toolsData';

interface FeatureGridProps {
  onSelectCategory: (categoryType: 'ai' | 'dev' | 'web3') => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ onSelectCategory }) => {
  return (
    <section id="features" className="py-16 md:py-24 bg-[#0a0e17]/80 border-y border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Engineered for Creators, Engineers &amp; Builders
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Three core pillars designed to eliminate boilerplate, optimize token costs, and streamline your Web3 and AI workflows.
          </p>
        </div>

        {/* 3 Main Clean Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {CATEGORIES.map((cat) => {
            const isAi = cat.type === 'ai';
            const isDev = cat.type === 'dev';
            const isWeb3 = cat.type === 'web3';

            return (
              <div
                key={cat.id}
                className="group relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0c101c] border border-slate-800/90 hover:border-slate-700/90 p-6 lg:p-7 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                        isAi
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : isDev
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                          : 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                      }`}
                    >
                      {isAi && <Sparkles className="w-6 h-6" />}
                      {isDev && <Code2 className="w-6 h-6" />}
                      {isWeb3 && <Cpu className="w-6 h-6" />}
                    </div>

                    <span className="font-mono-code text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50">
                      {cat.stats}
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {cat.shortDesc}
                  </p>

                  {/* Feature Highlights List */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-800/80 mb-8">
                    <p className="text-[11px] uppercase tracking-wider font-mono-code text-slate-400 font-semibold mb-2">
                      Included Modules
                    </p>
                    {cat.featuredTools.map((tool, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isAi
                              ? 'text-emerald-400'
                              : isDev
                              ? 'text-indigo-400'
                              : 'text-purple-400'
                          }`}
                        />
                        <span className="leading-tight">{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <button
                  onClick={() => onSelectCategory(cat.type)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all duration-150 cursor-pointer ${
                    isAi
                      ? 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-[#080b12] border-emerald-500/30'
                      : isDev
                      ? 'bg-indigo-500/10 hover:bg-indigo-500 text-indigo-300 hover:text-white border-indigo-500/30'
                      : 'bg-purple-500/10 hover:bg-purple-500 text-purple-300 hover:text-white border-purple-500/30'
                  }`}
                >
                  <span>Explore {cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
