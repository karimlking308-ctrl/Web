import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Code, Copy, Check, Trash2, Download, Play, FileCode } from 'lucide-react';

export const HtmlFormatterTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const sampleHtml = `<div class="card"><header><h1>QuickKit Tools</h1><p>Free Online Utilities</p></header><main><button onclick="alert('Hello')">Click Me</button></main></div>`;

  const [inputCode, setInputCode] = useState<string>(sampleHtml);
  const [outputCode, setOutputCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const formatHtml = (html: string) => {
    if (!html.trim()) {
      setOutputCode('');
      return;
    }
    let formatted = '';
    let indent = 0;
    const tab = '  ';

    // Normalize whitespace around tags
    const clean = html.replace(/>\s*</g, '><').trim();

    clean.split(/(<[^>]+>)/g).forEach((element) => {
      if (!element) return;

      if (element.match(/^<\/\w/)) {
        // Closing tag
        indent = Math.max(0, indent - 1);
        formatted += '\n' + tab.repeat(indent) + element;
      } else if (element.match(/^<\w[^>]*[^\/]>$/) && !element.startsWith('<!') && !element.match(/^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i)) {
        // Opening tag
        formatted += '\n' + tab.repeat(indent) + element;
        indent++;
      } else if (element.match(/^<.*\/>$/) || element.startsWith('<!')) {
        // Self-closing tag or doctype
        formatted += '\n' + tab.repeat(indent) + element;
      } else {
        // Text content
        const text = element.trim();
        if (text) {
          formatted += '\n' + tab.repeat(indent) + text;
        }
      }
    });

    setOutputCode(formatted.trim());
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
          {isAr ? 'منسق ومجمل كود HTML' : 'HTML Code Formatter & Beautifier'}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setInputCode(sampleHtml);
              formatHtml(sampleHtml);
            }}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-purple-50 transition cursor-pointer"
          >
            {isAr ? 'نموذج للتجربة' : 'Sample HTML'}
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
              {isAr ? 'كود HTML المدخل' : 'Input HTML'}
            </span>
            <button
              type="button"
              onClick={() => formatHtml(inputCode)}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer"
            >
              <Play className="w-3 h-3" /> {isAr ? 'تنسيق' : 'Format'}
            </button>
          </div>

          <textarea
            value={inputCode}
            onChange={(e) => {
              setInputCode(e.target.value);
              formatHtml(e.target.value);
            }}
            placeholder="Paste HTML here..."
            rows={12}
            className="w-full font-mono text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isAr ? 'الكود المنسق' : 'Formatted HTML'}
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
            placeholder={isAr ? 'سيظهر الكود المنسق هنا...' : 'Formatted HTML will appear here...'}
            rows={12}
            className="w-full font-mono text-xs text-slate-900 dark:text-purple-300 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
