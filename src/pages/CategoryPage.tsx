import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { allToolsData, categoriesData } from '../data/toolsData';
import { ToolCategory } from '../types';
import { ToolIcon } from '../components/common/ToolIcon';
import {
  Search,
  Sparkles,
  Heart,
  ChevronRight,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface CategoryPageProps {
  categoryId: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId }) => {
  const { lang, t, navigate, isFavorite, toggleFavorite } = useApp();
  const isAr = lang === 'ar';

  const category = categoriesData.find((c) => c.id === categoryId);
  const [filterQuery, setFilterQuery] = useState('');

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {isAr ? 'القسم غير موجود' : 'Category Not Found'}
        </h1>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-xs"
        >
          {t('backToHome')}
        </button>
      </div>
    );
  }

  const allCategoryTools = allToolsData.filter((t) => t.category === category.id);
  const filteredTools = allCategoryTools.filter((t) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.nameAr.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.descriptionAr.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <button
          onClick={() => navigate('/')}
          className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
        >
          {isAr ? 'الرئيسية' : 'Home'}
        </button>
        <ChevronRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
        <span className="text-slate-800 dark:text-slate-200 font-semibold">
          {isAr ? category.nameAr : category.name}
        </span>
      </nav>

      {/* Category Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${category.iconBg} shadow-xs`}>
              <ToolIcon name={category.icon} className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                <span>{allCategoryTools.length} {isAr ? 'أدوات متاحة' : 'Tools Available'}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {isAr ? category.nameAr : category.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                {isAr ? category.descriptionAr : category.description}
              </p>
            </div>
          </div>

          {/* Quick filter within this category */}
          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder={isAr ? 'تصفية الأدوات...' : 'Filter tools...'}
              className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {isAr ? `جميع أدوات ${category.nameAr}` : `All ${category.name}`} ({filteredTools.length})
          </h2>
        </div>

        {filteredTools.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
            <p className="text-slate-500 text-sm">
              {isAr ? 'لم يتم العثور على أدوات تطابق بحثك.' : 'No tools matched your search.'}
            </p>
            <button
              onClick={() => setFilterQuery('')}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {t('clearSearch')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => {
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
                          title="Favorite"
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
                    <span>{isAr ? 'استخدام الأداة' : 'Open Tool'}</span>
                    <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
