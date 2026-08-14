import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Minimize, Copy, Check, Trash2, Download, Play, FileText } from 'lucide-react';

export const JsonMinifierTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [inputJson, setInputJson] = useState<string>('{\n  "title": "Sol Tools",\n  "status": "active",\n  "count": 39,\n  "supported": ["Web", "Mobile", "API"]\n}');
  const [minifiedJson, setMinifiedJson] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const minify = (text: string) => {
    setErrorMsg(null);
    if (!text.trim()) {
      setMinifiedJson('');
      return;
    }
    try {
      const parsed = JSON.parse(text);
      const minified = JSON.stringify(parsed);
      setMinifiedJson(minified);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid JSON syntax');
      setMinifiedJson('');
    }
  };

  const origSize = new Blob([inputJson]).size;
  const miniSize = new Blob([minifiedJson]).size;
  const savedPercent = origSize > 0 && miniSize > 0 ? Math.max(0, Math.round(((origSize - miniSize) / origSize) * 100)) : 0;

  const handleCopy = () => {
    if (!minifiedJson) return;
    navigator.clipboard.writeText(minifiedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!minifiedJson) return;
    const blob = new Blob([minifiedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'soltools_minified.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isAr ? 'ضغط وتصغير كود JSON' : 'JSON Minifier & Compressor'}
          </span>
          {minifiedJson && (
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              -{savedPercent}% ({origSize}B → {miniSize}B)
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setInputJson('');
            setMinifiedJson('');
            setErrorMsg(null);
          }}
          className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50 flex items-center gap-1.5 transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {isAr ? 'مسح' : 'Clear'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isAr ? 'الكود المنسق الأصلي' : 'Original JSON'}
            </span>
            <button
              type="button"
              onClick={() => minify(inputJson)}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer"
            >
              <Minimize className="w-3 h-3" /> {isAr ? 'ضغط وتصغير' : 'Minify'}
            </button>
          </div>

          <textarea
            value={inputJson}
            onChange={(e) => {
              setInputJson(e.target.value);
              minify(e.target.value);
            }}
            placeholder="Paste standard JSON..."
            rows={12}
            className="w-full font-mono text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 text-xs font-mono">
              ⚠️ {errorMsg}
            </div>
          )}
        </div>

        {/* Output */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isAr ? 'الكود المضغوط (سطر واحد)' : 'Minified Single-Line Output'}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!minifiedJson}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-950 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!minifiedJson}
                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                {isAr ? 'تحميل' : 'Download'}
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={minifiedJson}
            placeholder={isAr ? 'سيظهر الكود المضغوط هنا...' : 'Minified single-line payload will appear here...'}
            rows={12}
            className="w-full font-mono text-xs text-slate-900 dark:text-purple-300 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:outline-none resize-none break-all"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{isAr ? 'مثالي لتحسين حمولات الـ API واستجابات السيرفر' : 'Optimized for high-speed API payload transfers'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
