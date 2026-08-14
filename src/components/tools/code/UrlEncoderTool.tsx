import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Link, Copy, Check, Trash2, ArrowLeftRight, Play } from 'lucide-react';

export const UrlEncoderTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputText, setInputText] = useState<string>('https://example.com/search?query=أدوات مجانية&category=online tools');
  const [outputText, setOutputText] = useState<string>('');
  const [encodeFullUri, setEncodeFullUri] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const process = (text: string, currentMode: 'encode' | 'decode', full: boolean) => {
    if (!text.trim()) {
      setOutputText('');
      setErrorMsg(null);
      return;
    }
    setErrorMsg(null);
    try {
      if (currentMode === 'encode') {
        const res = full ? encodeURI(text) : encodeURIComponent(text);
        setOutputText(res);
      } else {
        const res = full ? decodeURI(text) : decodeURIComponent(text);
        setOutputText(res);
      }
    } catch (err: any) {
      setErrorMsg(isAr ? 'تعذر فك تشفير الرابط بسبب صياغة غير متطابقة' : 'Failed to decode URL string');
      setOutputText('');
    }
  };

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    process(inputText, newMode, encodeFullUri);
  };

  const handleSwap = () => {
    if (!outputText) return;
    const prev = outputText;
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setInputText(prev);
    setMode(newMode);
    process(prev, newMode, encodeFullUri);
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => handleModeChange('encode')}
              className={`px-4 py-2 rounded-lg font-bold transition cursor-pointer ${
                mode === 'encode'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isAr ? 'ترميز URL' : 'Encode URL'}
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('decode')}
              className={`px-4 py-2 rounded-lg font-bold transition cursor-pointer ${
                mode === 'decode'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isAr ? 'فك تشفير URL' : 'Decode URL'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            title="Swap"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4 text-purple-600" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={encodeFullUri}
              onChange={(e) => {
                setEncodeFullUri(e.target.checked);
                process(inputText, mode, e.target.checked);
              }}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <span>{isAr ? 'ترميز الرابط بالكامل (encodeURI)' : 'Full URI mode (preserve protocol ://)'}</span>
          </label>

          <button
            type="button"
            onClick={() => {
              setInputText('');
              setOutputText('');
              setErrorMsg(null);
            }}
            className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isAr ? 'مسح' : 'Clear'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {mode === 'encode' ? (isAr ? 'الرابط أو النص الأصلي' : 'Raw Text / URL') : (isAr ? 'الرابط المشفر برموز %' : 'Encoded % URL')}
            </span>
            <button
              type="button"
              onClick={() => process(inputText, mode, encodeFullUri)}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer"
            >
              <Play className="w-3 h-3" /> {mode === 'encode' ? (isAr ? 'ترميز' : 'Encode') : (isAr ? 'فك التشفير' : 'Decode')}
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              process(e.target.value, mode, encodeFullUri);
            }}
            placeholder="Type or paste URL..."
            rows={10}
            className="w-full font-mono text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* Output */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {mode === 'encode' ? (isAr ? 'الرابط بعد الترميز' : 'Encoded Result') : (isAr ? 'الرابط المقروء بعد فك التشفير' : 'Decoded Result')}
            </span>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!outputText}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-950 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}
            </button>
          </div>

          <textarea
            readOnly
            value={outputText}
            placeholder={isAr ? 'ستظهر النتيجة هنا...' : 'Converted output will appear here...'}
            rows={10}
            className="w-full font-mono text-xs text-slate-900 dark:text-purple-300 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:outline-none resize-none break-all"
          />

          {errorMsg && (
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 text-xs font-mono">
              ⚠️ {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
