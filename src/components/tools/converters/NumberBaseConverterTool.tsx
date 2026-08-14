import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Binary, Copy, Check, Hash, RotateCcw } from 'lucide-react';

export const NumberBaseConverterTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [dec, setDec] = useState<string>('255');
  const [hex, setHex] = useState<string>('FF');
  const [bin, setBin] = useState<string>('11111111');
  const [oct, setOct] = useState<string>('377');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const updateFromDecimal = (val: string) => {
    setDec(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      setHex(parsed.toString(16).toUpperCase());
      setBin(parsed.toString(2));
      setOct(parsed.toString(8));
    } else {
      setHex('');
      setBin('');
      setOct('');
    }
  };

  const updateFromHex = (val: string) => {
    setHex(val);
    const parsed = parseInt(val, 16);
    if (!isNaN(parsed) && parsed >= 0) {
      setDec(parsed.toString(10));
      setBin(parsed.toString(2));
      setOct(parsed.toString(8));
    }
  };

  const updateFromBinary = (val: string) => {
    setBin(val);
    const parsed = parseInt(val, 2);
    if (!isNaN(parsed) && parsed >= 0) {
      setDec(parsed.toString(10));
      setHex(parsed.toString(16).toUpperCase());
      setOct(parsed.toString(8));
    }
  };

  const updateFromOctal = (val: string) => {
    setOct(val);
    const parsed = parseInt(val, 8);
    if (!isNaN(parsed) && parsed >= 0) {
      setDec(parsed.toString(10));
      setHex(parsed.toString(16).toUpperCase());
      setBin(parsed.toString(2));
    }
  };

  const copyToClipboard = (key: string, val: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const clearAll = () => {
    setDec('');
    setHex('');
    setBin('');
    setOct('');
  };

  const presets = [
    { label: '0', val: '0' },
    { label: '8', val: '8' },
    { label: '16', val: '16' },
    { label: '64', val: '64' },
    { label: '128', val: '128' },
    { label: '255', val: '255' },
    { label: '1024', val: '1024' },
    { label: '65535', val: '65535' },
  ];

  return (
    <div className="space-y-6">
      {/* Presets & Clear */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-500">{isAr ? 'قيم سريعة:' : 'Quick Presets:'}</span>
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => updateFromDecimal(p.val)}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-mono hover:bg-amber-500 hover:text-white transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {isAr ? 'تفريغ الكل' : 'Clear All'}
        </button>
      </div>

      {/* Main 4 Bases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Decimal (Base 10) */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Hash className="w-4 h-4" />
              {isAr ? 'النظام العشري (Decimal / Base 10)' : 'Decimal (Base 10)'}
            </label>
            <button
              onClick={() => copyToClipboard('dec', dec)}
              className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'dec' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'dec' ? (isAr ? 'تم!' : 'Copied') : isAr ? 'نسخ' : 'Copy'}
            </button>
          </div>
          <input
            type="text"
            value={dec}
            onChange={(e) => updateFromDecimal(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="0-9"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-base font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            dir="ltr"
          />
        </div>

        {/* Hexadecimal (Base 16) */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <Hash className="w-4 h-4" />
              {isAr ? 'النظام الست عشري (Hexadecimal / Base 16)' : 'Hexadecimal (Base 16)'}
            </label>
            <button
              onClick={() => copyToClipboard('hex', hex)}
              className="text-xs text-slate-400 hover:text-purple-600 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'hex' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'hex' ? (isAr ? 'تم!' : 'Copied') : isAr ? 'نسخ' : 'Copy'}
            </button>
          </div>
          <input
            type="text"
            value={hex}
            onChange={(e) => updateFromHex(e.target.value.replace(/[^0-9a-fA-F]/g, ''))}
            placeholder="0-9, A-F"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-base font-bold text-purple-700 dark:text-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            dir="ltr"
          />
        </div>

        {/* Binary (Base 2) */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Binary className="w-4 h-4" />
              {isAr ? 'النظام الثنائي (Binary / Base 2)' : 'Binary (Base 2)'}
            </label>
            <button
              onClick={() => copyToClipboard('bin', bin)}
              className="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'bin' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'bin' ? (isAr ? 'تم!' : 'Copied') : isAr ? 'نسخ' : 'Copy'}
            </button>
          </div>
          <input
            type="text"
            value={bin}
            onChange={(e) => updateFromBinary(e.target.value.replace(/[^01]/g, ''))}
            placeholder="0 or 1"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-base font-bold text-emerald-700 dark:text-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            dir="ltr"
          />
        </div>

        {/* Octal (Base 8) */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Hash className="w-4 h-4" />
              {isAr ? 'النظام الثماني (Octal / Base 8)' : 'Octal (Base 8)'}
            </label>
            <button
              onClick={() => copyToClipboard('oct', oct)}
              className="text-xs text-slate-400 hover:text-amber-600 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'oct' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'oct' ? (isAr ? 'تم!' : 'Copied') : isAr ? 'نسخ' : 'Copy'}
            </button>
          </div>
          <input
            type="text"
            value={oct}
            onChange={(e) => updateFromOctal(e.target.value.replace(/[^0-7]/g, ''))}
            placeholder="0-7"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-base font-bold text-amber-700 dark:text-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            dir="ltr"
          />
        </div>
      </div>
    </div>
  );
};
