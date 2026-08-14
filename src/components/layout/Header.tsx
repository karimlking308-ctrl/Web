import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { categoriesData, allToolsData } from '../../data/toolsData';
import { ToolIcon } from '../common/ToolIcon';
import { BrandLogo } from '../common/BrandLogo';
import {
  Search,
  Heart,
  Moon,
  Sun,
  Globe,
  Menu,
  X,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    lang,
    setLang,
    theme,
    toggleTheme,
    favorites,
    navigate,
    currentPath,
    t,
    searchTerm,
    setSearchTerm,
  } = useApp();

  const isAr = lang === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  const filteredQuickTools = quickQuery.trim()
    ? allToolsData.filter(
        (tool) =>
          tool.name.toLowerCase().includes(quickQuery.toLowerCase()) ||
          tool.nameAr.toLowerCase().includes(quickQuery.toLowerCase()) ||
          tool.keywords.some((k) => k.toLowerCase().includes(quickQuery.toLowerCase()))
      ).slice(0, 6)
    : [];

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      setSearchTerm(quickQuery.trim());
      navigate(`/search?q=${encodeURIComponent(quickQuery.trim())}`);
      setSearchModalOpen(false);
      setQuickQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-18 gap-3">
          {/* 1. Brand Logo */}
          <div
            onClick={() => navigate('/')}
            className="cursor-pointer shrink-0"
          >
            <BrandLogo isArabic={isAr} />
          </div>

          {/* 2. Desktop Navigation Categories */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {categoriesData.map((cat) => {
              const isActive = currentPath === `/category/${cat.id}`;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/category/${cat.id}`)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 font-black'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ToolIcon name={cat.icon} className="w-3.5 h-3.5" />
                  <span>{isAr ? cat.nameAr : cat.name}</span>
                </button>
              );
            })}
          </nav>

          {/* 3. Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Quick Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              title="Search tools"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline text-slate-400 text-[11px]">
                {isAr ? 'بحث سريع...' : 'Quick search...'}
              </span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-400">
                /
              </kbd>
            </button>

            {/* Favorites Icon */}
            <button
              onClick={() => navigate('/favorites')}
              className={`relative p-2 rounded-xl border transition-colors cursor-pointer ${
                currentPath === '/favorites'
                  ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              title="Favorites"
            >
              <Heart className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Change language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'en' ? 'عربي' : 'EN'}</span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
            {t('categories')}
          </div>
          {categoriesData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                navigate(`/category/${cat.id}`);
                setMobileMenuOpen(false);
              }}
              className="w-full px-3 py-2.5 rounded-xl text-left rtl:text-right text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <ToolIcon name={cat.icon} className="w-4 h-4 text-amber-500" />
                <span>{isAr ? cat.nameAr : cat.name}</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                {allToolsData.filter((t) => t.category === cat.id).length}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
            <form onSubmit={handleQuickSearchSubmit} className="p-4 border-b border-slate-200 dark:border-slate-800 relative">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-amber-500 shrink-0" />
                <input
                  type="text"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  autoFocus
                  className="w-full bg-transparent text-slate-900 dark:text-white font-medium text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>

            {filteredQuickTools.length > 0 ? (
              <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800">
                {filteredQuickTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      navigate(`/tool/${tool.slug}`);
                      setSearchModalOpen(false);
                      setQuickQuery('');
                    }}
                    className="w-full p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl text-left rtl:text-right transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <ToolIcon name={tool.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                          {isAr ? tool.nameAr : tool.name}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">
                          {isAr ? tool.descriptionAr : tool.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : quickQuery ? (
              <div className="p-8 text-center text-xs text-slate-400">
                {t('noToolsFound')}
              </div>
            ) : (
              <div className="p-4 text-center text-[11px] text-slate-400">
                {isAr ? 'ابدأ بكتابة اسم الأداة أو الكلمات المفتاحية...' : 'Type tool name or keywords...'}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
