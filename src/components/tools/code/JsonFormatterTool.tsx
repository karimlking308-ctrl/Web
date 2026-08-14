import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Braces, Copy, Check, Trash2, Download, Play, RefreshCw, FileText } from 'lucide-react';

export const JsonFormatterTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const sampleJson = `{
  "app": "QuickKit",
  "version": "1.0.0",
  "features": [
    "100% Free Tools",
    "Private Browser Processing",
    "No Sign Up Required"
  ],
  "stats": {
    "totalTools": 36,
    "categories": 6,
    "rating": 4.9
  },
  "isLive": true
}`;

  const [inputJson, setInputJson] = useState<string>(sampleJson);
  const [outputJson, setOutputJson] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const formatJson = (text: string, indent: number) => {
    setErrorMsg(null);
    if (!text.trim()) {
      setOutputJson('');
      return;
    }
    try {
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutputJson(formatted);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid JSON format');
      setOutputJson('');
    }
  };

  const handleIndentChange = (sz: number) => {
    setIndentSize(sz);
    formatJson(inputJson, sz);
  };

  const handleCopy = () => {
    if (!outputJson && !inputJson) return;
    navigator.clipboard.writeText(outputJson || inputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToSave = outputJson || inputJson;
    if (!textToSave) return;
    const blob = new Blob([textToSave], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quickkit_formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleLoadSample = () => {
    setInputJson(sampleJson);
    formatJson(sampleJson, indentSize);
  };

  const handleClear = () => {
    setInputJson('');
    setOutputJson('');
    setErrorMsg(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            {isAr ? 'المسافة البادئة:' : 'Indentation:'}
          </span>
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700 text-xs font-mono">
            {[
              { val: 2, label: '2 Spaces' },
              { val: 4, label: '4 Spaces' },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => handleIndentChange(opt.val)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  indentSize === opt.val
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-purple-600" />
            {isAr ? 'نموذج للتجربة' : 'Sample JSON'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isAr ? 'مسح' : 'Clear'}
          </button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isAr ? 'كود JSON المدخل' : 'Input JSON'}
            </span>
            <button
              type="button"
              onClick={() => formatJson(inputJson, indentSize)}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer"
            >
              <Play className="w-3 h-3" /> {isAr ? 'تنسيق' : 'Format'}
            </button>
          </div>

          <textarea
            value={inputJson}
            onChange={(e) => {
              setInputJson(e.target.value);
              formatJson(e.target.value, indentSize);
            }}
            placeholder={isAr ? 'الصق كود JSON هنا...' : 'Paste raw JSON code here...'}
            rows={14}
            className="w-full font-mono text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-y"
          />

          {errorMsg && (
            <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 text-xs font-mono">
              ⚠️ {errorMsg}
            </div>
          )}
        </div>

        {/* Output */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isAr ? 'النتيجة المنسقة' : 'Formatted Output'}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!outputJson && !inputJson}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-950 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!outputJson && !inputJson}
                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                {isAr ? 'تحميل' : 'Download'}
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={outputJson}
            placeholder={isAr ? 'سيظهر كود JSON المنسق هنا...' : 'Formatted JSON will appear here...'}
            rows={14}
            className="w-full font-mono text-xs text-slate-900 dark:text-purple-300 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:outline-none resize-y"
          />

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>{outputJson ? `${outputJson.split('\n').length} ${isAr ? 'سطر' : 'lines'}` : ''}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              {outputJson && <><Check className="w-3 h-3" /> {isAr ? 'JSON صالح' : 'Valid JSON'}</>}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
