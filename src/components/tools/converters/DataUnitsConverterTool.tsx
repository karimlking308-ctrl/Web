import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { HardDrive, ArrowRightLeft, Copy, Check } from 'lucide-react';

export const DataUnitsConverterTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [useBinary, setUseBinary] = useState<boolean>(false); // 1000 vs 1024 base

  const unitsDecimal: Record<string, { name: string; toBytes: number; symbol: string }> = {
    B: { name: 'Bytes', toBytes: 1, symbol: 'B' },
    KB: { name: 'Kilobytes (KB)', toBytes: 1000, symbol: 'KB' },
    MB: { name: 'Megabytes (MB)', toBytes: 1000 ** 2, symbol: 'MB' },
    GB: { name: 'Gigabytes (GB)', toBytes: 1000 ** 3, symbol: 'GB' },
    TB: { name: 'Terabytes (TB)', toBytes: 1000 ** 4, symbol: 'TB' },
    PB: { name: 'Petabytes (PB)', toBytes: 1000 ** 5, symbol: 'PB' },
    b: { name: 'Bits', toBytes: 0.125, symbol: 'bit' },
    Kb: { name: 'Kilobits (Kb)', toBytes: 125, symbol: 'Kb' },
    Mb: { name: 'Megabits (Mb)', toBytes: 125000, symbol: 'Mb' },
    Gb: { name: 'Gigabits (Gb)', toBytes: 125000000, symbol: 'Gb' },
  };

  const unitsBinary: Record<string, { name: string; toBytes: number; symbol: string }> = {
    B: { name: 'Bytes', toBytes: 1, symbol: 'B' },
    KiB: { name: 'Kibibytes (KiB / 1024)', toBytes: 1024, symbol: 'KiB' },
    MiB: { name: 'Mebibytes (MiB / 1024)', toBytes: 1024 ** 2, symbol: 'MiB' },
    GiB: { name: 'Gibibytes (GiB / 1024)', toBytes: 1024 ** 3, symbol: 'GiB' },
    TiB: { name: 'Tebibytes (TiB / 1024)', toBytes: 1024 ** 4, symbol: 'TiB' },
    PiB: { name: 'Pebibytes (PiB / 1024)', toBytes: 1024 ** 5, symbol: 'PiB' },
    b: { name: 'Bits', toBytes: 0.125, symbol: 'bit' },
    Kibit: { name: 'Kibibits (Kibit)', toBytes: 128, symbol: 'Kibit' },
    Mibit: { name: 'Mebibits (Mibit)', toBytes: 131072, symbol: 'Mibit' },
    Gibit: { name: 'Gibibits (Gibit)', toBytes: 134217728, symbol: 'Gibit' },
  };

  const units = useBinary ? unitsBinary : unitsDecimal;

  const [value, setValue] = useState<number>(100);
  const [fromUnit, setFromUnit] = useState<string>(useBinary ? 'GiB' : 'GB');
  const [toUnit, setToUnit] = useState<string>(useBinary ? 'MiB' : 'MB');
  const [copied, setCopied] = useState<boolean>(false);

  // Safety fallback for unit key
  const safeFrom = units[fromUnit] ? fromUnit : Object.keys(units)[3];
  const safeTo = units[toUnit] ? toUnit : Object.keys(units)[2];

  const bytes = (value || 0) * units[safeFrom].toBytes;
  const converted = bytes / units[safeTo].toBytes;

  const handleSwap = () => {
    const prevFrom = safeFrom;
    setFromUnit(safeTo);
    setToUnit(prevFrom);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${converted}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {isAr ? 'نظام الحساب:' : 'Base Standard:'}
          </span>
          <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
            <button
              onClick={() => {
                setUseBinary(false);
                setFromUnit('GB');
                setToUnit('MB');
              }}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                !useBinary
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              Decimal (1 KB = 1000 B)
            </button>
            <button
              onClick={() => {
                setUseBinary(true);
                setFromUnit('GiB');
                setToUnit('MiB');
              }}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                useBinary
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              Binary (1 KiB = 1024 B)
            </button>
          </div>
        </div>
      </div>

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
                value={safeFrom}
                onChange={(e) => setFromUnit(e.target.value)}
                className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {Object.entries(units).map(([key, u]) => (
                  <option key={key} value={key}>
                    {u.name}
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
                value={safeTo}
                onChange={(e) => setToUnit(e.target.value)}
                className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {Object.entries(units).map(([key, u]) => (
                  <option key={key} value={key}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of conversions */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <HardDrive className="w-4 h-4 text-amber-500" />
          {isAr ? `تحويل ${value} ${units[safeFrom].name} لجميع وحدات التخزين:` : `All Data Storage Conversions for ${value} ${units[safeFrom].name}:`}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
          {Object.entries(units).map(([key, u]) => {
            const val = bytes / u.toBytes;
            return (
              <div
                key={key}
                className={`p-3 rounded-xl border flex flex-col justify-between ${
                  safeTo === key
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="text-slate-500 text-[11px] font-semibold">{u.name}</span>
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
