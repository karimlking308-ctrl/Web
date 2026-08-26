import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, ExternalLink, ArrowRight, Tag, Check, Eye } from 'lucide-react';
import { FEATURED_TOOLS, ToolItem } from '../data/toolsData';

interface ToolCatalogProps {
  onSelectTool: (tool: ToolItem) => void;
  selectedCategoryFilter: string;
  onFilterChange: (filter: string) => void;
}

export const ToolCatalog: React.FC<ToolCatalogProps> = ({
  onSelectTool,
  selectedCategoryFilter,
  onFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    return FEATURED_TOOLS.filter((tool) => {
      const matchesCategory =
        selectedCategoryFilter === 'all' || tool.category === selectedCategoryFilter;
      const matchesSearch =
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategoryFilter, searchQuery]);

  return (
    <section id="tools" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Store &amp; Tool Directory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Verified Tools &amp; Blueprints
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl">
            Browse our curated catalog of AI prompt templates, real-time developer micro-services, and Web3 tools.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategoryFilter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Utilities
          </button>
          <button
            onClick={() => onFilterChange('ai')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategoryFilter === 'ai'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Vault
          </button>
          <button
            onClick={() => onFilterChange('dev')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategoryFilter === 'dev'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Developer
          </button>
          <button
            onClick={() => onFilterChange('web3')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategoryFilter === 'web3'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Web3
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by keyword, model, or protocol (e.g. 'Solana', 'Zod', 'Prompt Engine', 'GPT-4o')..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const isAi = tool.category === 'ai';
            const isDev = tool.category === 'dev';
            const isWeb3 = tool.category === 'web3';

            return (
              <div
                key={tool.id}
                className="rounded-xl bg-[#0b0f19] border border-slate-800/90 hover:border-slate-700 p-5 flex flex-col justify-between transition-all duration-150 hover:shadow-lg hover:shadow-black/40 group"
              >
                <div>
                  {/* Category & Badge Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[11px] font-mono-code font-semibold px-2 py-0.5 rounded-full ${
                        isAi
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isDev
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}
                    >
                      {tool.categoryLabel}
                    </span>

                    <span className="text-[11px] font-mono-code text-slate-400">
                      {tool.version}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                    {tool.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {tool.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono-code text-slate-400">
                    {tool.pricing}
                  </span>

                  <button
                    onClick={() => onSelectTool(tool)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View Tool</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <p className="text-slate-300 font-semibold mb-1">No tools match your query</p>
          <p className="text-xs text-slate-500 mb-4">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              onFilterChange('all');
            }}
            className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
