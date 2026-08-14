import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Copy, Check, RotateCcw, Download, ListFilter, Trash2 } from 'lucide-react';

export const RemoveDuplicateLinesTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [input, setInput] = useState<string>(
    `apple\nbanana\norange\napple\ngrape\nbanana\nwatermelon\norange\npineapple\napple`
  );
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState<boolean>(true);
  const [sortAlphabetical, setSortAlphabetical] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const { output, originalCount, uniqueCount, removedCount } = React.useMemo(() => {
    if (!input) {
      return { output: '', originalCount: 0, uniqueCount: 0, removedCount: 0 };
    }

    const lines = input.split('\n');
    const originalCount = lines.length;

    let processedLines = lines.map((l) => (trimWhitespace ? l.trim() : l));

    if (removeEmptyLines) {
      processedLines = processedLines.filter((l) => l.length > 0);
    }

    const seen = new Set<string>();
    const uniqueLines: string[] = [];

    for (const line of processedLines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniqueLines.push(line);
      }
    }

    if (sortAlphabetical) {
      uniqueLines.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    }

    const output = uniqueLines.join('\n');
    const uniqueCount = uniqueLines.length;
    const removedCount = originalCount - uniqueCount;

    return { output, originalCount, uniqueCount, removedCount };
  }, [input, caseSensitive, trimWhitespace, removeEmptyLines, sortAlphabetical]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unique-lines.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Stats Summary Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-center">
          <div className="text-2xl font-black text-slate-700 dark:text-slate-200">{originalCount}</div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">{isAr ? 'الأسطر الأصلية' : 'Original Lines'}</div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 text-center">
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{uniqueCount}</div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">{isAr ? 'الأسطر الفريدة' : 'Unique Lines'}</div>
        </div>

        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 text-center">
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{removedCount}</div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">{isAr ? 'الأسطر المكررة المحذوفة' : 'Duplicates Removed'}</div>
        </div>
      </div>

      {/* Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-sm border-slate-300 focus:ring-amber-500"
            />
            {isAr ? 'مراعاة حالة الأحرف (Case Sensitive)' : 'Case Sensitive'}
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(e) => setTrimWhitespace(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-sm border-slate-300 focus:ring-amber-500"
            />
            {isAr ? 'إزالة المسافات من الأطراف' : 'Trim Whitespace'}
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={removeEmptyLines}
              onChange={(e) => setRemoveEmptyLines(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-sm border-slate-300 focus:ring-amber-500"
            />
            {isAr ? 'حذف الأسطر الفارغة' : 'Remove Empty Lines'}
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={sortAlphabetical}
              onChange={(e) => setSortAlphabetical(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-sm border-slate-300 focus:ring-amber-500"
            />
            {isAr ? 'ترتيب أبجدي' : 'Sort A-Z'}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setInput('')}
            className="flex items-center gap-1 px-3 py-1.5 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isAr ? 'مسح' : 'Clear'}
          </button>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="flex items-center gap-1.5 px-3 py-1.5 font-semibold bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ القائمة الفريدة' : 'Copy Unique List'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!output}
            className="flex items-center gap-1.5 px-3 py-1.5 font-semibold bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {isAr ? 'تحميل .txt' : 'Download .txt'}
          </button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ListFilter className="w-4 h-4 text-amber-500" />
            {isAr ? 'القائمة الأصلية (مع التكرارات)' : 'Original List (with duplicates)'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isAr ? 'الصق قائمة الأسطر هنا...' : 'Paste your list of lines here...'}
            className="w-full h-80 p-4 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            {isAr ? 'النتيجة بعد حذف التكرار' : 'Deduplicated Output'}
          </label>
          <textarea
            readOnly
            value={output}
            placeholder={isAr ? 'ستظهر القائمة المنقحة هنا...' : 'Cleaned unique lines will appear here...'}
            className="w-full h-80 p-4 font-mono text-xs bg-slate-900 text-emerald-300 border border-slate-800 rounded-xl focus:outline-none resize-none selection:bg-emerald-800 selection:text-white"
          />
        </div>
      </div>
    </div>
  );
};
