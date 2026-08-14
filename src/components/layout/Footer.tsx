import React from 'react';
import { useApp } from '../../context/AppContext';
import { categoriesData, allToolsData } from '../../data/toolsData';
import { ToolIcon } from '../common/ToolIcon';
import { Wrench, ShieldCheck, Heart, Github, Twitter, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, t, navigate } = useApp();
  const isAr = lang === 'ar';

  const popularTools = allToolsData.filter((t) => t.isPopular).slice(0, 6);

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1: Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {isAr ? 'كويك كيت' : 'QuickKit'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
              {t('footerDesc')}
            </p>

            <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                {isAr
                  ? 'معالجة محلية داخل المتصفح 100%. بدون رفع ملفات.'
                  : '100% Client-Side Processing. No files uploaded.'}
              </span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              {t('categories')}
            </h3>
            <ul className="space-y-2">
              {categoriesData.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate(`/category/${cat.id}`)}
                    className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    {isAr ? cat.nameAr : cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Popular Tools */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              {t('popularTools')}
            </h3>
            <ul className="space-y-2">
              {popularTools.map((tool) => (
                <li key={tool.id}>
                  <button
                    onClick={() => navigate(`/tool/${tool.slug}`)}
                    className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    {isAr ? tool.nameAr : tool.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Legal & Support */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              {t('support')} & {t('about')}
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t('aboutUs')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/privacy')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t('privacyPolicy')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t('termsOfUse')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t('contactUs')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} QuickKit. {t('allRightsReserved')}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/privacy')}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              {t('privacyPolicy')}
            </button>
            <span>•</span>
            <button
              onClick={() => navigate('/terms')}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              {t('termsOfUse')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
