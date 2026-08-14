import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Palette, Copy, Check, Trash2, Play } from 'lucide-react';

export const CssFormatterTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const sampleCss = `.btn{background-color:#6366f1;color:#fff;border-radius:12px;padding:10px 20px;font-weight:700}.btn:hover{background-color:#4f46e5}`;

  const [inputCode, setInputCode] = useState<string>(sampleCss);
  const [outputCode, setOutputCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const formatCss = (css: string) => {
    if (!css.trim()) {
      setOutputCode('');
      return;
    }
    // Normalize CSS
    let clean = css
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/\s*;\s*/g, ';\n  ')
      .replace(/\s*\}\s*/g, '\n}\n\n')
      .replace(/\n\s*\n\s*\}/g, '\n}')
      .replace(/\n\s*;/g, ';')
      .trim();

    setOutputCode(clean);
  };

  const handleCopy = () => {
    if (!outputCode && !inputCode) return;
    navigator.clipboard.writeText(outputCode || inputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {isAr ? 'منسق ومجمل كود CSS' : 'CSS Formatter & Beautifier'}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setInputCode(sampleCss);
              formatCss(sampleCss);
            }}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-purple-50 transition cursor-pointer"
          >
            {isAr ? 'نموذج للتجربة' : 'Sample CSS'}
          </button>
          <button
            type="button"
            onClick={() => {
              setInputCode('');
              setOutputCode('');
            }}
            className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 dark:border-rose-900/50 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isAr ? 'كود CSS المدخل' : 'Input CSS'}
            </span>
            <button
              type="button"
              onClick={() => formatCss(inputCode)}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer"
            >
              <Play className="w-3 h-3" /> {isAr ? 'تنسيق' : 'Format'}
            </button>
          </div>

          <textarea
            value={inputCode}
            onChange={(e) => {
              setInputCode(e.target.value);
              formatCss(e.target.value);
            }}
            placeholder="Paste CSS code here..."
            rows={12}
            className="w-full font-mono text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isAr ? 'كود CSS المنسق' : 'Formatted CSS'}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!outputCode && !inputCode}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-purple-50 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}
            </button>
          </div>

          <textarea
            readOnly
            value={outputCode}
            placeholder={isAr ? 'سيظهر كود CSS المنسق هنا...' : 'Formatted CSS will appear here...'}
            rows={12}
            className="w-full font-mono text-xs text-slate-900 dark:text-purple-300 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
