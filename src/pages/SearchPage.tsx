import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { allToolsData, categoriesData } from '../data/toolsData';
import { ToolCategory } from '../types';
import { ToolIcon } from '../components/common/ToolIcon';
import {
  Search,
  Heart,
  ChevronRight,
  ArrowRight,
  Sparkles,
  X,
  Filter,
} from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { lang, t, navigate, isFavorite, toggleFavorite, searchTerm, setSearchTerm } = useApp();
  const isAr = lang === 'ar';

  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');

  // Parse query from URL if not already in state
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q && q !== searchTerm) {
      setSearchTerm(q);
    }
  }, []);

  const results = allToolsData.filter((tool) => {
    if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
      return false;
    }
    if (!searchTerm.trim()) return true;

    const q = searchTerm.toLowerCase().trim();
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.nameAr.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.descriptionAr.toLowerCase().includes(q) ||
      tool.keywords.some((k) => k.toLowerCase().includes(q)) ||
      (tool.keywordsAr && tool.keywordsAr.some((k) => k.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <button
          onClick={() => navigate('/')}
          className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
        >
          {isAr ? 'الرئيسية' : 'Home'}
        </button>
        <ChevronRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
        <span className="text-slate-800 dark:text-slate-200 font-semibold">
          {isAr ? 'نتائج البحث' : 'Search Results'}
        </span>
      </nav>

      {/* Search Bar Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-12 pr-12 rtl:pl-12 rtl:pr-12 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm sm:text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            {isAr ? 'تصفية:' : 'Filter:'}
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {t('allTools')} ({allToolsData.length})
          </button>
          {categoriesData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {isAr ? cat.nameAr : cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          {results.length} {t('toolsFound')} {searchTerm ? `for "${searchTerm}"` : ''}
        </h1>
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 max-w-md mx-auto">
          <p className="text-slate-500 text-sm">{t('noToolsFound')}</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
          >
            {t('clearSearch')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((tool) => {
            const fav = isFavorite(tool.id);
            return (
              <div
                key={tool.id}
                onClick={() => navigate(`/tool/${tool.slug}`)}
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md rounded-2xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <ToolIcon name={tool.icon} className="w-6 h-6" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {tool.isPopular && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300">
                          {isAr ? 'شائع' : 'Popular'}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(tool.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${fav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {isAr ? tool.nameAr : tool.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {isAr ? tool.descriptionAr : tool.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-bold">
                  <span>{isAr ? 'فتح الأداة' : 'Launch Tool'}</span>
                  <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
