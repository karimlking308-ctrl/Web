import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Copy, Check, RotateCcw, Hash, Twitter, MessageSquare, Globe } from 'lucide-react';

export const CharacterCounterTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [text, setText] = useState<string>(
    'Explore Sol Tools — The lightning-fast suite of free online utilities for images, PDF, code, text, math and unit conversions.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    const totalChars = text.length;
    const noSpaces = text.replace(/\s/g, '').length;
    const letters = (text.match(/[a-zA-Z\u0600-\u06FF]/g) || []).length;
    const digits = (text.match(/[0-9]/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const special = totalChars - letters - digits - spaces;
    const bytesUtf8 = new Blob([text]).size;

    return {
      totalChars,
      noSpaces,
      letters,
      digits,
      spaces,
      special,
      bytesUtf8,
    };
  }, [text]);

  const limits = [
    { name: 'X / Twitter Post', limit: 280, icon: Twitter, color: 'bg-sky-500' },
    { name: 'SMS Text Message (1 Part)', limit: 160, icon: MessageSquare, color: 'bg-emerald-500' },
    { name: 'SEO Meta Title (Google)', limit: 60, icon: Globe, color: 'bg-amber-500' },
    { name: 'SEO Meta Description', limit: 160, icon: Globe, color: 'bg-purple-500' },
  ];

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Quick Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {stats.totalChars.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
            {isAr ? 'إجمالي الأحرف والمسافات' : 'Total Characters'}
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
            {stats.noSpaces.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
            {isAr ? 'بدون مسافات' : 'Without Spaces'}
          </div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.letters.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
            {isAr ? 'عدد الحروف الهجائية' : 'Alphabetic Letters'}
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
            {stats.bytesUtf8.toLocaleString()} B
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
            {isAr ? 'الحجم بالبايت (UTF-8)' : 'Byte Size (UTF-8)'}
          </div>
        </div>
      </div>

      {/* Input Text Box */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-amber-500" />
            {isAr ? 'مساحة النص' : 'Input Text'}
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setText('')}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {isAr ? 'مسح' : 'Clear'}
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ' : 'Copy'}
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isAr ? 'اكتب أو الصق النص هنا لمعاينة العداد وحدود النشر...' : 'Type or paste text here to see limits & metrics...'}
          className="w-full h-48 sm:h-60 p-4 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none resize-y text-slate-800 dark:text-slate-100 leading-relaxed"
        />
      </div>

      {/* Social Media Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {limits.map((item) => {
          const used = stats.totalChars;
          const pct = Math.min(100, Math.round((used / item.limit) * 100));
          const isOver = used > item.limit;
          const remaining = item.limit - used;

          return (
            <div
              key={item.name}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <item.icon className="w-4 h-4 text-slate-500" />
                  {item.name}
                </span>
                <span
                  className={`text-xs font-mono font-bold ${
                    isOver ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {used} / {item.limit} ({isOver ? `${Math.abs(remaining)} over` : `${remaining} left`})
                </span>
              </div>

              {/* Bar */}
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isOver ? 'bg-red-500' : pct > 85 ? 'bg-amber-500' : item.color
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
