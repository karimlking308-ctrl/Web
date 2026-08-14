import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Key, Copy, Check, RefreshCw, Sliders } from 'lucide-react';

export const UuidGeneratorTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [quantity, setQuantity] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [removeHyphens, setRemoveHyphens] = useState<boolean>(false);
  const [wrapQuotes, setWrapQuotes] = useState<boolean>(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateUuidV4 = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generate = (count = quantity, isUpper = uppercase, noHyphen = removeHyphens, quotes = wrapQuotes) => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = generateUuidV4();
      if (noHyphen) id = id.replace(/-/g, '');
      if (isUpper) id = id.toUpperCase();
      else id = id.toLowerCase();
      if (quotes) id = `"${id}"`;
      list.push(id);
    }
    setUuids(list);
  };

  React.useEffect(() => {
    generate(quantity, uppercase, removeHyphens, wrapQuotes);
  }, []);

  const handleCopyAll = () => {
    if (uuids.length === 0) return;
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (id: string, idx: number) => {
    navigator.clipboard.writeText(id);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-600" />
            {isAr ? 'إعدادات توليد المعرفات' : 'UUID Generator Settings'}
          </h4>
          <button
            type="button"
            onClick={() => generate()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {isAr ? 'توليد معرفات جديدة' : 'Generate New'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              {isAr ? 'الكمية (1 - 50):' : 'Quantity (1 - 50):'}
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={quantity}
              onChange={(e) => {
                const val = Math.max(1, Math.min(50, parseInt(e.target.value) || 1));
                setQuantity(val);
                generate(val, uppercase, removeHyphens, wrapQuotes);
              }}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 dark:text-white"
            />
          </div>

          {/* Uppercase */}
          <div className="flex items-center h-full pt-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => {
                  setUppercase(e.target.checked);
                  generate(quantity, e.target.checked, removeHyphens, wrapQuotes);
                }}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span>{isAr ? 'أحرف كبيرة UPPERCASE' : 'Uppercase'}</span>
            </label>
          </div>

          {/* Remove Hyphens */}
          <div className="flex items-center h-full pt-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={removeHyphens}
                onChange={(e) => {
                  setRemoveHyphens(e.target.checked);
                  generate(quantity, uppercase, e.target.checked, wrapQuotes);
                }}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span>{isAr ? 'بدون شرطات فاصلة (-)' : 'Remove Hyphens'}</span>
            </label>
          </div>

          {/* Wrap Quotes */}
          <div className="flex items-center h-full pt-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={wrapQuotes}
                onChange={(e) => {
                  setWrapQuotes(e.target.checked);
                  generate(quantity, uppercase, removeHyphens, e.target.checked);
                }}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span>{isAr ? 'إحاطة بعلامات تنصيص ""' : 'Wrap in Quotes'}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Generated List */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isAr ? `المعرفات المولدة (${uuids.length})` : `Generated UUIDs (${uuids.length})`}
          </span>

          <button
            type="button"
            onClick={handleCopyAll}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedAll ? (isAr ? 'تم نسخ الكل!' : 'All Copied!') : (isAr ? 'نسخ الكل' : 'Copy All')}
          </button>
        </div>

        <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
          {uuids.map((id, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-700 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
                <span className="font-mono text-xs text-slate-800 dark:text-purple-300 select-all font-semibold">
                  {id}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopySingle(id, idx)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-purple-600 text-xs transition cursor-pointer"
              >
                {copiedIndex === idx ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
