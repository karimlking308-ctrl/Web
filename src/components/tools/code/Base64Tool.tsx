import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Binary, Copy, Check, Trash2, ArrowLeftRight, Play } from 'lucide-react';

export const Base64Tool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputText, setInputText] = useState<string>('Hello from QuickKit!');
  const [outputText, setOutputText] = useState<string>('');
  const [urlSafe, setUrlSafe] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // UTF-8 safe Base64 encoding/decoding
  const encodeBase64 = (str: string, isUrlSafe: boolean) => {
    try {
      setErrorMsg(null);
      const encoded = btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );
      if (isUrlSafe) {
        return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
      return encoded;
    } catch (e: any) {
      setErrorMsg('Encoding error');
      return '';
    }
  };

  const decodeBase64 = (str: string) => {
    try {
      setErrorMsg(null);
      let sanitized = str.trim().replace(/-/g, '+').replace(/_/g, '/');
      while (sanitized.length % 4) {
        sanitized += '=';
      }
      const decoded = decodeURIComponent(
        Array.prototype.map
          .call(atob(sanitized), (c: string) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return decoded;
    } catch (e: any) {
      setErrorMsg(isAr ? 'نص Base64 غير صالح أو تالف' : 'Invalid Base64 string format');
      return '';
    }
  };

  const process = (text: string, currentMode: 'encode' | 'decode', isUrlSafe: boolean) => {
    if (!text.trim()) {
      setOutputText('');
      setErrorMsg(null);
      return;
    }
    if (currentMode === 'encode') {
      setOutputText(encodeBase64(text, isUrlSafe));
    } else {
      setOutputText(decodeBase64(text));
    }
  };

  const handleModeToggle = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    process(inputText, newMode, urlSafe);
  };

  const handleSwap = () => {
    if (!outputText) return;
    const prevOutput = outputText;
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setInputText(prevOutput);
    setMode(newMode);
    process(prevOutput, newMode, urlSafe);
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => handleModeToggle('encode')}
              className={`px-4 py-2 rounded-lg font-bold transition cursor-pointer ${
                mode === 'encode'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isAr ? 'ترميز (Encode)' : 'Encode to Base64'}
            </button>
            <button
              type="button"
              onClick={() => handleModeToggle('decode')}
              className={`px-4 py-2 rounded-lg font-bold transition cursor-pointer ${
                mode === 'decode'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isAr ? 'فك تشفير (Decode)' : 'Decode Base64'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            title="Swap input & output"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4 text-purple-600" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {mode === 'encode' && (
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={urlSafe}
                onChange={(e) => {
                  setUrlSafe(e.target.checked);
                  process(inputText, mode, e.target.checked);
                }}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span>{isAr ? 'وضع آمن لروابط الويب (URL Safe)' : 'URL Safe Mode'}</span>
            </label>
          )}

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
              {mode === 'encode' ? (isAr ? 'النص الأصلي (UTF-8)' : 'Plain Text Input') : (isAr ? 'نص Base64 المدخل' : 'Base64 Encoded Input')}
            </span>
            <button
              type="button"
              onClick={() => process(inputText, mode, urlSafe)}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer"
            >
              <Play className="w-3 h-3" /> {mode === 'encode' ? (isAr ? 'ترميز' : 'Encode') : (isAr ? 'فك التشفير' : 'Decode')}
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              process(e.target.value, mode, urlSafe);
            }}
            placeholder={mode === 'encode' ? 'Type or paste plain text...' : 'Paste Base64 encoded string...'}
            rows={10}
            className="w-full font-mono text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />

          <div className="text-[11px] text-slate-400 font-mono">
            {inputText.length} {isAr ? 'حرف' : 'characters'} • {new Blob([inputText]).size} bytes
          </div>
        </div>

        {/* Output */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {mode === 'encode' ? (isAr ? 'ناتج Base64 المشفر' : 'Base64 Output') : (isAr ? 'النص الأصلي المفكوك' : 'Decoded Plain Text')}
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
            placeholder={isAr ? 'ستظهر النتيجة هنا...' : 'Result will appear here...'}
            rows={10}
            className="w-full font-mono text-xs text-slate-900 dark:text-purple-300 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:outline-none resize-none break-all"
          />

          {errorMsg ? (
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 text-xs font-mono">
              ⚠️ {errorMsg}
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 font-mono">
              {outputText.length} {isAr ? 'حرف' : 'characters'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
