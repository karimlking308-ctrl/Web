import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { allToolsData, categoriesData } from '../data/toolsData';
import { ToolRenderer } from '../components/tools/ToolRenderer';
import { ToolIcon } from '../components/common/ToolIcon';
import {
  Heart,
  Share2,
  Check,
  ChevronRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ToolDetailPageProps {
  toolSlug: string;
}

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({ toolSlug }) => {
  const { lang, t, navigate, isFavorite, toggleFavorite } = useApp();
  const isAr = lang === 'ar';

  const tool = allToolsData.find((t) => t.slug === toolSlug || t.id === toolSlug);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {isAr ? 'الأداة غير موجودة' : 'Tool Not Found'}
        </h1>
        <p className="text-slate-500">
          {isAr
            ? 'عذراً، الأداة التي تبحث عنها غير متوفرة أو تم تغيير رابطها.'
            : 'Sorry, the tool you are looking for does not exist or has been moved.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-xs"
        >
          {t('backToHome')}
        </button>
      </div>
    );
  }

  const category = categoriesData.find((c) => c.id === tool.category);
  const favorite = isFavorite(tool.id);

  const relatedTools = allToolsData
    .filter((t) => t.id !== tool.id && (tool.relatedToolIds.includes(t.id) || t.category === tool.category))
    .slice(0, 4);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${tool.name} - QuickKit`,
        text: tool.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const features = isAr && tool.featuresAr?.length ? tool.featuresAr : tool.features;
  const howToUse = isAr && tool.howToUseAr?.length ? tool.howToUseAr : tool.howToUse;
  const faqs = isAr && tool.faqsAr?.length ? tool.faqsAr : tool.faqs;

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
        {category && (
          <>
            <button
              onClick={() => navigate(`/category/${category.id}`)}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
            >
              {isAr ? category.nameAr : category.name}
            </button>
            <ChevronRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
          </>
        )}
        <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">
          {isAr ? tool.nameAr : tool.name}
        </span>
      </nav>

      {/* Tool Header Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-xs">
              <ToolIcon name={tool.icon} className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {category ? (isAr ? category.nameAr : category.name) : tool.category}
                </span>
                {tool.isPopular && (
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {isAr ? 'شائع جداً' : 'Popular'}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {isAr ? tool.nameAr : tool.name}
              </h1>

              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                {isAr ? tool.descriptionAr : tool.description}
              </p>
            </div>
          </div>

          {/* Action buttons (Favorite + Share) */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
            <button
              onClick={() => toggleFavorite(tool.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-xs ${
                favorite
                  ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              title={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{favorite ? (isAr ? 'في المفضلة' : 'Saved') : isAr ? 'إضافة للمفضلة' : 'Favorite'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-xs"
              title="Share tool"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'مشاركة' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Security & Speed Tag */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>{isAr ? 'معالجة محلية داخل المتصفح 100% (أمان تام)' : '100% Private Browser Execution'}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>{isAr ? 'بدون انتظار رفع أو حدود للاستخدام' : 'Instant Zero-Upload Speed'}</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Tool Container */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <ToolRenderer toolId={tool.id} />
      </section>

      {/* Key Features */}
      {features && features.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            {t('features')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3.5 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How To Use Steps */}
      {howToUse && howToUse.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            {t('howToUseTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {howToUse.map((step) => (
              <div
                key={step.step}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 relative flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center mb-3 shadow-sm">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{step.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            {t('faqTitle')}
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer font-bold text-sm text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('relatedTools')}</h2>
            {category && (
              <button
                onClick={() => navigate(`/category/${category.id}`)}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isAr ? 'عرض الكل' : 'View all'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((rTool) => (
              <div
                key={rTool.id}
                onClick={() => navigate(`/tool/${rTool.slug}`)}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 rounded-2xl transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ToolIcon name={rTool.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {isAr ? rTool.nameAr : rTool.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {isAr ? rTool.descriptionAr : rTool.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
