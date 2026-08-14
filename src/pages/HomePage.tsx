import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { allToolsData, categoriesData } from '../data/toolsData';
import { ToolIcon } from '../components/common/ToolIcon';
import { AdNativeBanner } from '../components/ads/AdNativeBanner';
import { AdBanner160x300 } from '../components/ads/AdBanner160x300';
import {
  Search,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Heart,
  HelpCircle,
  Mail,
  Flame,
  Check,
  ChevronRight,
  Star,
  ExternalLink,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { lang, t, navigate, isFavorite, toggleFavorite, searchTerm, setSearchTerm } = useApp();
  const isAr = lang === 'ar';

  const [localQuery, setLocalQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchTerm(localQuery.trim());
      navigate(`/search?q=${encodeURIComponent(localQuery.trim())}`);
    }
  };

  const popularTools = allToolsData.filter((t) => t.isPopular).slice(0, 8);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      try {
        await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: newsletterEmail }),
        });
      } catch {}
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative pt-6 sm:pt-10 pb-8 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/20 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAr ? 'أكثر من 39 أداة مجانية 100% فورية' : '39+ Free Instant Browser Tools'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {t('heroTitle')}{' '}
          <span className="text-amber-500 underline decoration-amber-400/40 decoration-wavy decoration-2">
            {t('heroHighlight')}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {t('heroSubtitle')}
        </p>

        {/* Hero Search Box */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative mt-6">
          <div className="relative flex items-center">
            <div className="absolute left-4 rtl:left-auto rtl:right-4 pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-12 pr-28 rtl:pl-28 rtl:pr-12 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-amber-500 dark:focus:border-amber-500 rounded-2xl text-sm sm:text-base text-slate-800 dark:text-slate-100 shadow-md focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-2.5 rtl:right-auto rtl:left-2.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              {t('searchButton')}
            </button>
          </div>
        </form>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-3xl mx-auto text-xs">
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{t('trustFreeTitle')}</span>
          </div>

          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{t('trustNoSignUpTitle')}</span>
          </div>

          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
            <span>{t('trustSecureTitle')}</span>
          </div>

          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
            <Star className="w-4 h-4 text-purple-500 shrink-0" />
            <span>{t('trustFastTitle')}</span>
          </div>
        </div>
      </section>

      {/* 2. Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('browseCategories')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {isAr ? 'استكشف الأدوات مقسمة حسب تخصصك واحتياجك' : 'Explore toolsets organized by workflow'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesData.map((cat) => {
            const count = allToolsData.filter((t) => t.category === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => navigate(`/category/${cat.id}`)}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md rounded-2xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${cat.iconBg} group-hover:scale-110 transition-transform`}>
                  <ToolIcon name={cat.icon} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {isAr ? cat.nameAr : cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {count} {isAr ? 'أدوات' : 'tools'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Most Popular Tools */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('mostPopularTools')}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{popularTools.length} {isAr ? 'أدوات شائعة' : 'tools'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.map((tool) => {
            const fav = isFavorite(tool.id);
            return (
              <div
                key={tool.id}
                onClick={() => navigate(`/tool/${tool.slug}`)}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md rounded-2xl transition-all cursor-pointer group relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <ToolIcon name={tool.icon} className="w-5 h-5" />
                    </div>
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

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {isAr ? tool.nameAr : tool.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {isAr ? tool.descriptionAr : tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-bold">
                  <span>{isAr ? 'فتح الأداة' : 'Launch Tool'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Adsterra Native Banner */}
      <AdNativeBanner />

      {/* 4. Category-by-Category Deep Showcase */}
      {categoriesData.map((cat) => {
        const catTools = allToolsData.filter((t) => t.category === cat.id).slice(0, 4);
        return (
          <section key={cat.id} className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.iconBg}`}>
                  <ToolIcon name={cat.icon} className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {isAr ? cat.nameAr : cat.name}
                  </h2>
                  <p className="text-xs text-slate-500 hidden sm:block">
                    {isAr ? cat.descriptionAr : cat.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/category/${cat.id}`)}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isAr ? 'عرض كل الأدوات' : 'View all'}</span>
                <ChevronRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {catTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => navigate(`/tool/${tool.slug}`)}
                  className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-amber-500 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                      <ToolIcon name={tool.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {isAr ? tool.nameAr : tool.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                        {isAr ? tool.descriptionAr : tool.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* 5. How It Works */}
      <section className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('howItWorks')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isAr
              ? 'ثلاث خطوات بسيطة ومباشرة لإنجاز مهامك فوراً بدون أي تعقيد'
              : 'Three effortless steps to complete your tasks instantly'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500 text-white font-black text-lg flex items-center justify-center shadow-sm">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t('step1Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t('step1Desc')}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500 text-white font-black text-lg flex items-center justify-center shadow-sm">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t('step2Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t('step2Desc')}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500 text-white font-black text-lg flex items-center justify-center shadow-sm">
              3
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t('step3Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t('step3Desc')}</p>
          </div>
        </div>
      </section>

      {/* 6. Newsletter Signup */}
      <section className="bg-linear-to-br from-amber-500/10 via-slate-100 to-slate-50 dark:from-amber-500/10 dark:via-slate-900 dark:to-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-10 text-center max-w-3xl mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md shadow-amber-500/30">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {t('stayUpdated')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          {t('stayUpdatedDesc')}
        </p>

        {subscribed ? (
          <div className="p-4 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-xl font-bold text-xs inline-flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{t('subscribedSuccess')}</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              {t('subscribe')}
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
