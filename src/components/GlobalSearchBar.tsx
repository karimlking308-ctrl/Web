import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  Code2,
  Terminal,
  Wrench,
  BookOpen,
  FolderArchive,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Zap,
  CornerDownLeft,
  Command,
  FileCode,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { SEARCH_INDEX, SearchResultItem, SearchCategory } from '../data/searchData';

interface GlobalSearchBarProps {
  onNavigate: (sectionId: string) => void;
  variant?: 'navbar' | 'compact';
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({ onNavigate, variant = 'navbar' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K or "/"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea outside this search bar
      const isInput =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === '/' && !isInput && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setActiveCategory('all');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filtered search results
  const filteredResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    return SEARCH_INDEX.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      if (!trimmed) {
        // When query is empty, show curated highlights
        return true;
      }

      const matchTitle = item.title.toLowerCase().includes(trimmed);
      const matchTagline = item.tagline.toLowerCase().includes(trimmed);
      const matchCategory = item.categoryLabel.toLowerCase().includes(trimmed);
      const matchTags = item.tags.some((tag) => tag.toLowerCase().includes(trimmed));
      const matchMeta = item.meta?.toLowerCase().includes(trimmed);

      return matchTitle || matchTagline || matchCategory || matchTags || matchMeta;
    });
  }, [query, activeCategory]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults.length, activeCategory]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Handle keyboard navigation within results
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelectItem(filteredResults[selectedIndex]);
      }
    }
  };

  const handleSelectItem = (item: SearchResultItem) => {
    onNavigate(item.sectionId);
    setIsOpen(false);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'scripts':
        return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 'tools':
        return <Wrench className="w-4 h-4 text-indigo-400" />;
      case 'docs':
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
      case 'vault':
        return <FolderArchive className="w-4 h-4 text-purple-400" />;
      default:
        return <Code2 className="w-4 h-4 text-slate-400" />;
    }
  };

  const getBadgeStyle = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'cyan':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'purple':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'indigo':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      case 'amber':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const quickPills = [
    { label: 'Solana Airdrop', query: 'Solana' },
    { label: 'Jito MEV Sniper', query: 'Jito' },
    { label: 'Telegram Clicker', query: 'Telegram' },
    { label: 'Fee Estimator', query: 'Gas' },
    { label: 'REST API', query: 'API' },
    { label: 'Smart Contract Audit', query: 'Audit' },
  ];

  return (
    <>
      {/* Search Input Trigger in Navbar */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all duration-150 cursor-pointer shadow-inner group"
        title="Search Developer Scripts, Tools, and Docs (⌘K or /)"
      >
        <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-mono hidden xl:inline">Search scripts, tools, APIs...</span>
        <span className="text-xs font-mono hidden sm:inline xl:hidden">Search hub...</span>
        <span className="text-xs font-mono inline sm:hidden">Search</span>

        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400 group-hover:text-cyan-300">
          <span className="text-[11px]">⌘</span>K
        </kbd>
      </button>

      {/* Global Search Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          {/* Backdrop Click */}
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

          <div
            ref={dropdownRef}
            className="relative w-full max-w-2xl bg-[#090d1a] border border-slate-700/80 rounded-3xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[80vh] z-10 animate-in zoom-in-95 duration-150"
          >
            {/* Top Search Input Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0c1224] flex items-center gap-3">
              <Search className="w-5 h-5 text-cyan-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search Developer Scripts, Micro-Tools, REST APIs, Documentation..."
                className="w-full bg-transparent text-sm sm:text-base font-mono text-white placeholder:text-slate-500 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-semibold transition-colors cursor-pointer shrink-0"
              >
                ESC
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="px-4 py-2.5 bg-[#090d1a] border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(
                [
                  { id: 'all', label: 'All Items' },
                  { id: 'scripts', label: 'Scripts Vault' },
                  { id: 'tools', label: 'Micro-Tools' },
                  { id: 'docs', label: 'Docs & API' },
                  { id: 'vault', label: 'VIP Vault & Hubs' },
                ] as { id: SearchCategory; label: string }[]
              ).map((cat) => {
                const isSelected = activeCategory === cat.id;
                const count =
                  cat.id === 'all'
                    ? SEARCH_INDEX.length
                    : SEARCH_INDEX.filter((i) => i.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-[10px] opacity-70 px-1 py-0.2 rounded bg-slate-950/80">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Keyword Suggestions if Query is Empty */}
            {!query && (
              <div className="px-4 py-3 bg-[#070a14] border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-mono text-slate-400">
                <span className="text-slate-500 flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Popular:
                </span>
                {quickPills.map((pill, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuery(pill.query)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 text-[11px] whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            )}

            {/* Search Results List */}
            <div
              ref={resultsContainerRef}
              className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[50vh] divide-y divide-slate-800/40"
            >
              {filteredResults.length > 0 ? (
                filteredResults.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      data-index={idx}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-start justify-between gap-3 group ${
                        isSelected
                          ? 'bg-slate-800/80 border border-cyan-500/40 shadow-md'
                          : 'bg-[#0b1021]/50 hover:bg-slate-900/80 border border-transparent hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          {getCategoryIcon(item.category)}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {item.title}
                            </span>
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle(
                                item.badgeColor
                              )}`}
                            >
                              {item.badge}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {item.tagline}
                          </p>

                          {item.meta && (
                            <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2 pt-0.5">
                              <span>{item.categoryLabel}</span>
                              <span>•</span>
                              <span className="text-cyan-400/80">{item.meta}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5 self-center">
                        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition-colors">
                          <span>{item.actionText}</span>
                          <ArrowRight className="w-3 h-3 text-cyan-400" />
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500 sm:hidden" />
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Empty Results State */
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-mono">
                    No results found for "{query}"
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try searching for keywords like <span className="text-cyan-300">Solana</span>,{' '}
                    <span className="text-emerald-300">Python</span>,{' '}
                    <span className="text-purple-300">Gas Calculator</span>, or{' '}
                    <span className="text-indigo-300">REST API</span>.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Keyboard Navigation Hints Bar */}
            <div className="px-4 py-3 bg-[#060914] border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                    ↓
                  </kbd>{' '}
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                    ↵
                  </kbd>{' '}
                  Select
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                    ESC
                  </kbd>{' '}
                  Close
                </span>
              </div>

              <span className="text-slate-400">
                {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} available
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
