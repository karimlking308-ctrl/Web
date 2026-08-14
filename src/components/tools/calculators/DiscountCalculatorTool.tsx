import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Tag, Percent, DollarSign, ArrowDown, ShoppingBag } from 'lucide-react';

export const DiscountCalculatorTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [originalPrice, setOriginalPrice] = useState<number>(120);
  const [discountPercent, setDiscountPercent] = useState<number>(25);
  const [taxPercent, setTaxPercent] = useState<number>(5);

  const discountAmount = (originalPrice * discountPercent) / 100;
  const priceAfterDiscount = originalPrice - discountAmount;
  const taxAmount = (priceAfterDiscount * taxPercent) / 100;
  const finalPrice = priceAfterDiscount + taxAmount;
  const totalSaved = discountAmount;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Controls */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              {isAr ? 'السعر الأصلي' : 'Original Price ($)'}
            </label>
            <input
              type="number"
              min="0"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 dark:text-slate-100 text-base font-bold font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-amber-500" />
                {isAr ? 'نسبة الخصم' : 'Discount Percentage (%)'}
              </label>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                {discountPercent}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
              className="w-full accent-amber-500"
            />
            {/* Quick discount chips */}
            <div className="flex items-center gap-1.5 mt-2">
              {[10, 15, 20, 25, 30, 50, 70].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setDiscountPercent(pct)}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                    discountPercent === pct
                      ? 'bg-amber-500 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
              <Tag className="w-4 h-4 text-blue-500" />
              {isAr ? 'ضريبة المبيعات الإضافية (اختياري)' : 'Sales Tax Percentage (Optional %)'}
            </label>
            <input
              type="number"
              min="0"
              value={taxPercent}
              onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 dark:text-slate-100 text-sm font-semibold font-mono"
            />
          </div>
        </div>

        {/* Results Card */}
        <div className="p-6 bg-linear-to-br from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                {isAr ? 'ملخص الفاتورة النهائي' : 'Payment Summary'}
              </span>
              <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
                -{discountPercent}% OFF
              </span>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">{isAr ? 'السعر الأصلي:' : 'Original Price:'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  ${originalPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                <span>{isAr ? 'قيمة الخصم المستفاد:' : 'You Save (Discount):'}</span>
                <span className="font-mono font-bold">-${discountAmount.toFixed(2)}</span>
              </div>

              {taxPercent > 0 && (
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{isAr ? `الضريبة (${taxPercent}%):` : `Tax (${taxPercent}%):`}</span>
                  <span className="font-mono">+${taxAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-emerald-500/20">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              {isAr ? 'السعر النهائي للدفع' : 'Final Price to Pay'}
            </div>
            <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              ${finalPrice.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
