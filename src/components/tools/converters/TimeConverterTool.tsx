import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Clock, ArrowRightLeft, Copy, Check } from 'lucide-react';

export const TimeConverterTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const units: Record<string, { name: string; nameAr: string; toSeconds: number; symbol: string }> = {
    s: { name: 'Seconds', nameAr: 'ثانية', toSeconds: 1, symbol: 's' },
    ms: { name: 'Milliseconds', nameAr: 'مللي ثانية', toSeconds: 0.001, symbol: 'ms' },
    min: { name: 'Minutes', nameAr: 'دقيقة', toSeconds: 60, symbol: 'min' },
    h: { name: 'Hours', nameAr: 'ساعة', toSeconds: 3600, symbol: 'hr' },
    d: { name: 'Days', nameAr: 'يوم', toSeconds: 86400, symbol: 'd' },
    wk: { name: 'Weeks', nameAr: 'أسبوع', toSeconds: 604800, symbol: 'wk' },
    mo: { name: 'Months (30d)', nameAr: 'شهر (30 يوماً)', toSeconds: 2592000, symbol: 'mo' },
    yr: { name: 'Years (365d)', nameAr: 'سنة (365 يوماً)', toSeconds: 31536000, symbol: 'yr' },
  };

  const [value, setValue] = useState<number>(24);
  const [fromUnit, setFromUnit] = useState<string>('h');
  const [toUnit, setToUnit] = useState<string>('d');
  const [copied, setCopied] = useState<boolean>(false);

  const seconds = (value || 0) * units[fromUnit].toSeconds;
  const converted = seconds / units[toUnit].toSeconds;

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${converted}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
          {/* Input */}
          <div className="md:col-span-3 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isAr ? 'القيمة والوحدة الأصلية' : 'From'}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono font-bold text-slate-800 dark:text-slate-100"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {Object.entries(units).map(([key, u]) => (
                  <option key={key} value={key}>
                    {isAr ? u.nameAr : u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap */}
          <div className="md:col-span-1 flex justify-center pt-4 md:pt-6">
            <button
              onClick={handleSwap}
              className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-xs"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Result */}
          <div className="md:col-span-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {isAr ? 'النتيجة المحولة' : 'To'}
              </label>
              <button
                onClick={handleCopy}
                className="text-xs text-slate-500 hover:text-amber-600 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? (isAr ? 'تم النسخ!' : 'Copied') : isAr ? 'نسخ' : 'Copy'}
              </button>
            </div>
            <div className="flex gap-2">
              <input
                readOnly
                type="text"
                value={Number(converted.toFixed(6)).toLocaleString()}
                className="w-full px-4 py-2.5 bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl font-mono font-bold text-amber-700 dark:text-amber-300 focus:outline-none"
              />
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {Object.entries(units).map(([key, u]) => (
                  <option key={key} value={key}>
                    {isAr ? u.nameAr : u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-500" />
          {isAr ? `تحويل ${value} ${units[fromUnit].nameAr} لجميع وحدات الوقت:` : `All Time Conversions for ${value} ${units[fromUnit].name}:`}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
          {Object.entries(units).map(([key, u]) => {
            const val = seconds / u.toSeconds;
            return (
              <div
                key={key}
                className={`p-3 rounded-xl border flex flex-col justify-between ${
                  toUnit === key
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="text-slate-500 text-[11px] font-semibold">{isAr ? u.nameAr : u.name}</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">
                  {Number(val.toFixed(4)).toLocaleString()} {u.symbol}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
