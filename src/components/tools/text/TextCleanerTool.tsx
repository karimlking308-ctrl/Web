import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Copy, Check, RotateCcw, Download, Sparkles, Wand2 } from 'lucide-react';

export const TextCleanerTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [input, setInput] = useState<string>(
    `<div class="article-body">
  <p>  QuickKit provides   <b>essential</b> online tools.   </p>

  <p>All data stays    strictly   inside   your browser!  </p>


  <p>Fast, secure,   and 100% free forever.</p>
</div>`
  );

  const [stripHtml, setStripHtml] = useState<boolean>(true);
  const [removeExtraSpaces, setRemoveExtraSpaces] = useState<boolean>(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState<boolean>(true);
  const [removeLineBreaks, setRemoveLineBreaks] = useState<boolean>(false);
  const [trimLines, setTrimLines] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const cleanedText = React.useMemo(() => {
    if (!input) return '';

    let res = input;

    // 1. Strip HTML tags
    if (stripHtml) {
      res = res.replace(/<[^>]*>/g, ' ');
    }

    // 2. Remove line breaks (merge to single paragraph)
    if (removeLineBreaks) {
      res = res.replace(/[\r\n]+/g, ' ');
    } else {
      // 3. Trim lines
      if (trimLines) {
        res = res
          .split('\n')
          .map((l) => l.trim())
          .join('\n');
      }

      // 4. Remove empty lines
      if (removeEmptyLines) {
        res = res
          .split('\n')
          .filter((l) => l.trim().length > 0)
          .join('\n');
      }
    }

    // 5. Remove multiple consecutive spaces
    if (removeExtraSpaces) {
      res = res.replace(/[ \t]+/g, ' ');
    }

    return res.trim();
  }, [input, stripHtml, removeExtraSpaces, removeEmptyLines, removeLineBreaks, trimLines]);

  const handleCopy = () => {
    if (!cleanedText) return;
    navigator.clipboard.writeText(cleanedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!cleanedText) return;
    const blob = new Blob([cleanedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Options Panel */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <Wand2 className="w-4 h-4 text-amber-500" />
          {isAr ? 'قواعد تنظيف النص:' : 'Cleaning Options:'}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={stripHtml}
              onChange={(e) => setStripHtml(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-sm border-slate-300 focus:ring-amber-500"
            />
            {isAr ? 'حذف وسوم HTML' : 'Strip HTML Tags'}
          </label>

          <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={removeExtraSpaces}
              onChange={(e) => setRemoveExtraSpaces(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-sm border-slate-300 focus:ring-amber-500"
            />
            {isAr ? 'توحيد المسافات الزائدة' : 'Normalize Spaces'}
          </label>

          <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={removeEmptyLines}
              onChange={(e) => setRemoveEmptyLines(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-sm border-slate-300 focus:ring-amber-500"
            />
            {isAr ? 'حذف الأسطر الفارغة' : 'Remove Blank Lines'}
          </label>

          <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={trimLines}
              onChange={(e) => setTrimLines(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-sm border-slate-300 focus:ring-amber-500"
            />
            {isAr ? 'مسح الفراغات من أطراف الأسطر' : 'Trim Line Edges'}
          </label>

          <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none sm:col-span-2">
            <input
              type="checkbox"
              checked={removeLineBreaks}
              onChange={(e) => setRemoveLineBreaks(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-sm border-slate-300 focus:ring-amber-500"
            />
            {isAr ? 'دمج جميع الأسطر في فقرة واحدة متصلة' : 'Merge All into Single Paragraph'}
          </label>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              {isAr ? 'النص غير المنقح' : 'Raw Text'}
            </label>
            <button
              onClick={() => setInput('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {isAr ? 'مسح' : 'Clear'}
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isAr ? 'الصق النص المراد تنظيفه هنا...' : 'Paste messy text here...'}
            className="w-full h-80 p-4 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              {isAr ? 'النص المنظف' : 'Cleaned Text'}
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!cleanedText}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                disabled={!cleanedText}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                {isAr ? 'تحميل' : 'Download'}
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={cleanedText}
            placeholder={isAr ? 'سيظهر النص المنظف هنا...' : 'Cleaned text will appear here...'}
            className="w-full h-80 p-4 text-xs font-mono bg-slate-900 text-amber-200 border border-slate-800 rounded-xl focus:outline-none resize-none selection:bg-amber-800 selection:text-white"
          />
        </div>
      </div>
    </div>
  );
};
