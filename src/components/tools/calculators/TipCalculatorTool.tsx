import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { DollarSign, Users, Sparkles, Percent } from 'lucide-react';

export const TipCalculatorTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [billAmount, setBillAmount] = useState<number>(85.5);
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [splitCount, setSplitCount] = useState<number>(2);

  const tipAmount = (billAmount * tipPercent) / 100;
  const totalWithTip = billAmount + tipAmount;
  const perPersonTotal = splitCount > 0 ? totalWithTip / splitCount : totalWithTip;
  const perPersonTip = splitCount > 0 ? tipAmount / splitCount : tipAmount;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              {isAr ? 'قيمة الفاتورة الإجمالية' : 'Bill Amount ($)'}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={billAmount}
              onChange={(e) => setBillAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 dark:text-slate-100 text-base font-bold font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-amber-500" />
                {isAr ? 'نسبة الإكرامية (Tip %)' : 'Tip Percentage (%)'}
              </label>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                {tipPercent}%
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 18, 20].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setTipPercent(pct)}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                    tipPercent === pct
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={tipPercent}
              onChange={(e) => setTipPercent(parseFloat(e.target.value) || 0)}
              className="w-full accent-amber-500 mt-3"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-500" />
                {isAr ? 'تقسيم الفاتورة (عدد الأشخاص)' : 'Split between people'}
              </span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {splitCount} {isAr ? 'أشخاص' : 'people'}
              </span>
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSplitCount((c) => Math.max(1, c - 1))}
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="100"
                value={splitCount}
                onChange={(e) => setSplitCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="flex-1 text-center py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-slate-800 dark:text-slate-100"
              />
              <button
                onClick={() => setSplitCount((c) => c + 1)}
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="p-6 bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-2xl flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-indigo-500/20">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 dark:text-indigo-400">
                {isAr ? 'نصيب الفرد الواحد' : 'Per Person Breakdown'}
              </span>
              <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
                {splitCount} {splitCount === 1 ? 'Person' : 'People'}
              </span>
            </div>

            <div className="mt-6 text-center">
              <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                {isAr ? 'المطلوب من كل شخص' : 'Amount Per Person'}
              </div>
              <div className="text-4xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                ${perPersonTotal.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                (incl. ${perPersonTip.toFixed(2)} tip each)
              </div>
            </div>

            <div className="mt-8 space-y-2.5 pt-4 border-t border-indigo-500/20 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isAr ? 'قيمة الإكرامية الكلية:' : 'Total Tip Amount:'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  ${tipAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isAr ? 'المجموع الكلي مع الإكرامية:' : 'Total Bill with Tip:'}</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  ${totalWithTip.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
