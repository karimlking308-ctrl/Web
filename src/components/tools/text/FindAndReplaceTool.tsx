import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Copy, Check, RotateCcw, Download, Search, Replace } from 'lucide-react';

export const FindAndReplaceTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [text, setText] = useState<string>(
    `The QuickKit suite makes online utilities fast. QuickKit is 100% free and QuickKit protects your personal privacy.`
  );
  const [findStr, setFindStr] = useState<string>('QuickKit');
  const [replaceStr, setReplaceStr] = useState<string>('QuickKit Pro');
  const [matchCase, setMatchCase] = useState<boolean>(false);
  const [wholeWord, setWholeWord] = useState<boolean>(false);
  const [useRegex, setUseRegex] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const matchCount = React.useMemo(() => {
    if (!findStr || !text) return 0;
    try {
      let flags = 'g';
      if (!matchCase) flags += 'i';

      let pattern = findStr;
      if (!useRegex) {
        // escape regex special characters
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }

      if (wholeWord && !useRegex) {
        pattern = `\\b${pattern}\\b`;
      }

      const regex = new RegExp(pattern, flags);
      const matches = text.match(regex);
      return matches ? matches.length : 0;
    } catch {
      return 0;
    }
  }, [text, findStr, matchCase, wholeWord, useRegex]);

  const handleReplaceAll = () => {
    if (!findStr || !text) return;
    try {
      let flags = 'g';
      if (!matchCase) flags += 'i';

      let pattern = findStr;
      if (!useRegex) {
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }

      if (wholeWord && !useRegex) {
        pattern = `\\b${pattern}\\b`;
      }

      const regex = new RegExp(pattern, flags);
      setText(text.replace(regex, replaceStr));
    } catch (e) {
      console.error('Regex error', e);
    }
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Replace Controls */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-amber-500" />
                {isAr ? 'البحث عن:' : 'Find:'}
              </span>
              <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                {matchCount} {isAr ? 'تطابق' : 'matches'}
              </span>
            </label>
            <input
              type="text"
              value={findStr}
              onChange={(e) => setFindStr(e.target.value)}
              placeholder={isAr ? 'الكلمة أو العبارة للبحث عنها...' : 'Text to find...'}
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Replace className="w-3.5 h-3.5 text-amber-500" />
              {isAr ? 'استبدال بـ:' : 'Replace with:'}
            </label>
            <input
              type="text"
              value={replaceStr}
              onChange={(e) => setReplaceStr(e.target.value)}
              placeholder={isAr ? 'النص البديل الجديد...' : 'Replacement text...'}
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Options & Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={matchCase}
                onChange={(e) => setMatchCase(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded-sm border-slate-300 focus:ring-amber-500"
              />
              {isAr ? 'مراعاة حالة الأحرف (Case Sensitive)' : 'Match Case'}
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={wholeWord}
                onChange={(e) => setWholeWord(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded-sm border-slate-300 focus:ring-amber-500"
              />
              {isAr ? 'كلمة كاملة فقط' : 'Whole Word'}
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={useRegex}
                onChange={(e) => setUseRegex(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded-sm border-slate-300 focus:ring-amber-500"
              />
              {isAr ? 'استخدام Regex' : 'Regular Expression (RegEx)'}
            </label>
          </div>

          <button
            onClick={handleReplaceAll}
            disabled={!findStr || matchCount === 0}
            className="flex items-center gap-2 px-4 py-2 font-bold bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Replace className="w-4 h-4" />
            {isAr ? 'استبدال الكل' : 'Replace All'} ({matchCount})
          </button>
        </div>
      </div>

      {/* Editor Box */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {isAr ? 'محتوى النص' : 'Document Content'}
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setText('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
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
          placeholder={isAr ? 'اكتب أو الصق نصك هنا...' : 'Type or paste document text here...'}
          className="w-full h-80 p-4 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none resize-y text-slate-800 dark:text-slate-100 leading-relaxed"
        />
      </div>
    </div>
  );
};
