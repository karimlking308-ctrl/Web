import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Copy, Check, RotateCcw, Download, ArrowUpDown, Shuffle, ArrowDownAZ, ArrowUpAZ } from 'lucide-react';

export const TextSorterTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [input, setInput] = useState<string>(
    `Zebra\nApple\nMango\nBanana\nOrange\n100\n20\n5\nElephant`
  );
  const [copied, setCopied] = useState<boolean>(false);

  const sortLines = (type: 'az' | 'za' | 'num-asc' | 'num-desc' | 'length-asc' | 'length-desc' | 'reverse' | 'shuffle') => {
    if (!input.trim()) return;

    let lines = input.split('\n');

    switch (type) {
      case 'az':
        lines.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
        break;
      case 'za':
        lines.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }));
        break;
      case 'num-asc':
        lines.sort((a, b) => {
          const numA = parseFloat(a) || 0;
          const numB = parseFloat(b) || 0;
          return numA - numB;
        });
        break;
      case 'num-desc':
        lines.sort((a, b) => {
          const numA = parseFloat(a) || 0;
          const numB = parseFloat(b) || 0;
          return numB - numA;
        });
        break;
      case 'length-asc':
        lines.sort((a, b) => a.length - b.length);
        break;
      case 'length-desc':
        lines.sort((a, b) => b.length - a.length);
        break;
      case 'reverse':
        lines.reverse();
        break;
      case 'shuffle':
        lines = [...lines].sort(() => Math.random() - 0.5);
        break;
    }

    setInput(lines.join('\n'));
  };

  const handleCopy = () => {
    if (!input) return;
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!input) return;
    const blob = new Blob([input], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sorted-list.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Sort Buttons Bar */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <ArrowUpDown className="w-4 h-4 text-amber-500" />
          {isAr ? 'اختر طريقة الترتيب والفرز:' : 'Select Sorting Method:'}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <button
            onClick={() => sortLines('az')}
            className="flex items-center justify-center gap-2 p-2.5 bg-white dark:bg-slate-800 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
          >
            <ArrowDownAZ className="w-4 h-4" />
            {isAr ? 'أبجدي (A-Z / أ-ي)' : 'Alphabetical (A to Z)'}
          </button>

          <button
            onClick={() => sortLines('za')}
            className="flex items-center justify-center gap-2 p-2.5 bg-white dark:bg-slate-800 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
          >
            <ArrowUpAZ className="w-4 h-4" />
            {isAr ? 'أبجدي عكسي (Z-A)' : 'Alphabetical (Z to A)'}
          </button>

          <button
            onClick={() => sortLines('num-asc')}
            className="flex items-center justify-center gap-2 p-2.5 bg-white dark:bg-slate-800 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
          >
            <span>1→9</span>
            {isAr ? 'رقمي تصاعدي' : 'Numeric (Low to High)'}
          </button>

          <button
            onClick={() => sortLines('num-desc')}
            className="flex items-center justify-center gap-2 p-2.5 bg-white dark:bg-slate-800 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
          >
            <span>9→1</span>
            {isAr ? 'رقمي تنازلي' : 'Numeric (High to Low)'}
          </button>

          <button
            onClick={() => sortLines('length-asc')}
            className="flex items-center justify-center gap-2 p-2.5 bg-white dark:bg-slate-800 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
          >
            {isAr ? 'حسب الطول (من الأقصر)' : 'Length (Shortest first)'}
          </button>

          <button
            onClick={() => sortLines('length-desc')}
            className="flex items-center justify-center gap-2 p-2.5 bg-white dark:bg-slate-800 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
          >
            {isAr ? 'حسب الطول (من الأطول)' : 'Length (Longest first)'}
          </button>

          <button
            onClick={() => sortLines('reverse')}
            className="flex items-center justify-center gap-2 p-2.5 bg-white dark:bg-slate-800 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
          >
            <ArrowUpDown className="w-4 h-4" />
            {isAr ? 'عكس الترتيب' : 'Reverse Order'}
          </button>

          <button
            onClick={() => sortLines('shuffle')}
            className="flex items-center justify-center gap-2 p-2.5 bg-white dark:bg-slate-800 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
          >
            <Shuffle className="w-4 h-4" />
            {isAr ? 'خلط عشوائي (Shuffle)' : 'Random Shuffle'}
          </button>
        </div>
      </div>

      {/* Editor Box */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {isAr ? 'قائمة الأسطر المراد فرزها' : 'List of Lines'} ({input.split('\n').filter(Boolean).length} {isAr ? 'أسطر' : 'lines'})
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInput('')}
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
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {isAr ? 'تحميل' : 'Download'}
            </button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isAr ? 'اكتب أو الصق الأسطر هنا ثم اختر طريقة الفرز أعلاه...' : 'Paste or type lines here and click any sort option above...'}
          className="w-full h-80 p-4 font-mono text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none resize-y text-slate-800 dark:text-slate-100"
        />
      </div>
    </div>
  );
};
