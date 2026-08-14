import React from 'react';
import { useApp } from '../context/AppContext';
import { allToolsData } from '../data/toolsData';
import { ToolIcon } from '../components/common/ToolIcon';
import { Heart, ArrowRight, Trash2, Sparkles, ChevronRight } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { lang, t, navigate, favorites, toggleFavorite } = useApp();
  const isAr = lang === 'ar';

  const favoriteTools = allToolsData.filter((t) => favorites.includes(t.id));

  return (
    <div className="space-y-10 pb-16">
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
          {isAr ? 'أدواتي المفضلة' : 'Favorite Tools'}
        </span>
      </nav>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20 shadow-xs">
              <Heart className="w-8 h-8 fill-rose-500 text-rose-500" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-[11px] font-bold text-rose-600 dark:text-rose-400 mb-1.5">
                <span>{favoriteTools.length} {isAr ? 'أداة محفوظة' : 'Saved Tools'}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {isAr ? 'الأدوات المفضلة' : 'Your Favorite Tools'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                {isAr
                  ? 'وصول سريع وسلس لأدواتك الأكثر استخداماً بدون الحاجة للبحث عنها في كل مرة.'
                  : 'Quick 1-click access to your most frequently used tools.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      {favoriteTools.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
            {t('noFavoritesYet')}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t('browseAllPrompt')}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
          >
            {isAr ? 'استكشف جميع الأدوات' : 'Explore Tools'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoriteTools.map((tool) => (
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

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(tool.id);
                    }}
                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
          ))}
        </div>
      )}
    </div>
  );
};
