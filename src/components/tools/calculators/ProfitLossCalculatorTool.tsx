import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { DollarSign, TrendingUp, TrendingDown, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const ProfitLossCalculatorTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [costPrice, setCostPrice] = useState<number>(45);
  const [sellingPrice, setSellingPrice] = useState<number>(70);
  const [quantity, setQuantity] = useState<number>(100);

  const totalCost = costPrice * quantity;
  const totalRevenue = sellingPrice * quantity;
  const netAmount = totalRevenue - totalCost;
  const isProfit = netAmount >= 0;
  const marginPercent = totalRevenue > 0 ? (netAmount / totalRevenue) * 100 : 0;
  const markupPercent = totalCost > 0 ? (netAmount / totalCost) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
              <DollarSign className="w-4 h-4 text-slate-500" />
              {isAr ? 'سعر التكلفة للوحدة (Cost Price)' : 'Cost Price per Unit ($)'}
            </label>
            <input
              type="number"
              min="0"
              value={costPrice}
              onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100 text-sm font-bold font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              {isAr ? 'سعر البيع للوحدة (Selling Price)' : 'Selling Price per Unit ($)'}
            </label>
            <input
              type="number"
              min="0"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 dark:text-slate-100 text-sm font-bold font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
              <Layers className="w-4 h-4 text-blue-500" />
              {isAr ? 'الكمية المباعة (Quantity)' : 'Total Units Sold'}
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 dark:text-slate-100 text-sm font-bold font-mono"
            />
          </div>
        </div>

        {/* Results Panel */}
        <div
          className={`p-6 border rounded-2xl flex flex-col justify-between shadow-xs ${
            isProfit
              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30'
              : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-500/30'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <span
                className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                  isProfit ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                }`}
              >
                {isProfit ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {isProfit ? (isAr ? 'نتيجة إيجابية: صافي ربح' : 'Net Profit') : isAr ? 'نتيجة سلبية: صافي خسارة' : 'Net Loss'}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isProfit ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {isProfit ? '+' : ''}
                {marginPercent.toFixed(1)}% Margin
              </span>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isAr ? 'إجمالي التكاليف (Total Cost):' : 'Total Cost:'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isAr ? 'إجمالي الإيرادات (Total Revenue):' : 'Total Revenue:'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isAr ? 'نسبة هامش الربح (Profit Margin):' : 'Profit Margin:'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {marginPercent.toFixed(2)}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isAr ? 'نسبة الزيادة على التكلفة (Markup):' : 'Cost Markup:'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {markupPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              {isProfit ? (isAr ? 'صافي الربح الكلي' : 'Total Profit') : isAr ? 'صافي الخسارة الكلية' : 'Total Loss'}
            </div>
            <div
              className={`text-4xl font-black font-mono ${
                isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isProfit ? '+' : ''}${netAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
