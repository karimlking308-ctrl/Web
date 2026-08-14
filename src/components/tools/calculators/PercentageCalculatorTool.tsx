import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Percent, ArrowRight, TrendingUp, TrendingDown, HelpCircle, Check, Copy } from 'lucide-react';

export const PercentageCalculatorTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  // Mode 1: What is X% of Y?
  const [val1Percent, setVal1Percent] = useState<number>(15);
  const [val1Total, setVal1Total] = useState<number>(200);

  // Mode 2: X is what % of Y?
  const [val2Part, setVal2Part] = useState<number>(45);
  const [val2Total, setVal2Total] = useState<number>(180);

  // Mode 3: Percentage Increase / Decrease from X to Y
  const [val3From, setVal3From] = useState<number>(50);
  const [val3To, setVal3To] = useState<number>(75);

  // Results
  const res1 = (val1Percent * val1Total) / 100;
  const res2 = val2Total !== 0 ? (val2Part / val2Total) * 100 : 0;
  const diff3 = val3To - val3From;
  const res3Pct = val3From !== 0 ? (diff3 / val3From) * 100 : 0;
  const isIncrease = diff3 >= 0;

  return (
    <div className="space-y-6">
      {/* 3 Interactive Calculation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: X% of Y */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                %
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                {isAr ? 'كم يساوي X% من Y؟' : 'What is X% of Y?'}
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isAr ? 'النسبة المئوية (X%)' : 'Percentage (X%)'}
                </label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    value={val1Percent}
                    onChange={(e) => setVal1Percent(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 font-mono"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isAr ? 'العدد الإجمالي (Y)' : 'Total Number (Y)'}
                </label>
                <input
                  type="number"
                  value={val1Total}
                  onChange={(e) => setVal1Total(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 bg-blue-50/50 dark:bg-blue-950/30 -mx-5 -mb-5 p-5 rounded-b-2xl">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
              {isAr ? 'النتيجة المحسوبة:' : 'Result:'}
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {Number(res1.toFixed(4)).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              {val1Percent}% × {val1Total} = {Number(res1.toFixed(2))}
            </div>
          </div>
        </div>

        {/* Card 2: X is what % of Y */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                /
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                {isAr ? 'كم تمثل X كنسبة مئوية من Y؟' : 'X is what % of Y?'}
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isAr ? 'القيمة الجزئية (X)' : 'Part Value (X)'}
                </label>
                <input
                  type="number"
                  value={val2Part}
                  onChange={(e) => setVal2Part(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isAr ? 'القيمة الكلية (Y)' : 'Whole Value (Y)'}
                </label>
                <input
                  type="number"
                  value={val2Total}
                  onChange={(e) => setVal2Total(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 bg-purple-50/50 dark:bg-purple-950/30 -mx-5 -mb-5 p-5 rounded-b-2xl">
            <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">
              {isAr ? 'النسبة المئوية الناتجة:' : 'Calculated Percentage:'}
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {Number(res2.toFixed(2)).toLocaleString()}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              ({val2Part} ÷ {val2Total}) × 100 = {Number(res2.toFixed(2))}%
            </div>
          </div>
        </div>

        {/* Card 3: Percentage Increase / Decrease */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                  isIncrease
                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400'
                }`}
              >
                {isIncrease ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                {isAr ? 'نسبة الزيادة / النقصان' : 'Percentage Change'}
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isAr ? 'القيمة الابتدائية (من)' : 'Initial Value (From)'}
                </label>
                <input
                  type="number"
                  value={val3From}
                  onChange={(e) => setVal3From(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {isAr ? 'القيمة النهائية (إلى)' : 'Final Value (To)'}
                </label>
                <input
                  type="number"
                  value={val3To}
                  onChange={(e) => setVal3To(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
            </div>
          </div>

          <div
            className={`mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 -mx-5 -mb-5 p-5 rounded-b-2xl ${
              isIncrease ? 'bg-emerald-50/50 dark:bg-emerald-950/30' : 'bg-rose-50/50 dark:bg-rose-950/30'
            }`}
          >
            <div
              className={`text-xs font-semibold mb-1 ${
                isIncrease ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isIncrease ? (isAr ? 'زيادة بمقدار:' : 'Increase of:') : isAr ? 'نقصان بمقدار:' : 'Decrease of:'}
            </div>
            <div
              className={`text-3xl font-black font-mono ${
                isIncrease ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isIncrease ? '+' : ''}
              {Number(res3Pct.toFixed(2)).toLocaleString()}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              {isAr ? 'الفرق:' : 'Difference:'} {diff3 > 0 ? `+${diff3}` : diff3}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
