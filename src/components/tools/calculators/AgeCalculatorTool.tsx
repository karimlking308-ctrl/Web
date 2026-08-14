import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Calendar, Cake, Clock, Heart, Sparkles } from 'lucide-react';

export const AgeCalculatorTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [birthDate, setBirthDate] = useState<string>('1998-05-15');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const ageData = useMemo(() => {
    if (!birthDate || !targetDate) return null;

    const bDate = new Date(birthDate);
    const tDate = new Date(targetDate);

    if (isNaN(bDate.getTime()) || isNaN(tDate.getTime()) || tDate < bDate) {
      return null;
    }

    let years = tDate.getFullYear() - bDate.getFullYear();
    let months = tDate.getMonth() - bDate.getMonth();
    let days = tDate.getDate() - bDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(tDate.getFullYear(), tDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total units
    const diffMs = tDate.getTime() - bDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDaysAfterWeeks = totalDays % 7;
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Next birthday calculation
    const currentYearBirthday = new Date(tDate.getFullYear(), bDate.getMonth(), bDate.getDate());
    let nextBday = currentYearBirthday;
    if (currentYearBirthday < tDate) {
      nextBday = new Date(tDate.getFullYear() + 1, bDate.getMonth(), bDate.getDate());
    }
    const daysUntilNextBday = Math.ceil((nextBday.getTime() - tDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      remainingDaysAfterWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      totalSeconds,
      daysUntilNextBday,
    };
  }, [birthDate, targetDate]);

  return (
    <div className="space-y-6">
      {/* Date Pickers */}
      <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
              <Cake className="w-4 h-4 text-pink-500" />
              {isAr ? 'تاريخ الميلاد' : 'Date of Birth'}
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-slate-800 dark:text-slate-100 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
              <Calendar className="w-4 h-4 text-indigo-500" />
              {isAr ? 'حساب العمر حتى تاريخ' : 'Calculate Age as of'}
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100 text-sm font-semibold"
            />
          </div>
        </div>
      </div>

      {ageData ? (
        <div className="space-y-6">
          {/* Main Big Age Banner */}
          <div className="p-6 bg-linear-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 shrink-0">
                <Cake className="w-8 h-8" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400">
                  {isAr ? 'عمرك الحالي بدقة' : 'Exact Calculated Age'}
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
                  {ageData.years} <span className="text-base font-bold text-slate-500">{isAr ? 'سنة' : 'years'}</span>,{' '}
                  {ageData.months} <span className="text-base font-bold text-slate-500">{isAr ? 'شهر' : 'months'}</span>,{' '}
                  {ageData.days} <span className="text-base font-bold text-slate-500">{isAr ? 'يوم' : 'days'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs border border-pink-500/20 rounded-xl text-center shrink-0">
              <div className="text-xs text-slate-500">{isAr ? 'عيد ميلادك القادم بعد:' : 'Next Birthday In:'}</div>
              <div className="text-2xl font-black text-pink-600 dark:text-pink-400 font-mono">
                {ageData.daysUntilNextBday} {isAr ? 'يوم' : 'days'}
              </div>
            </div>
          </div>

          {/* Breakdown Units */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-semibold">{isAr ? 'إجمالي الأشهر' : 'Total Months'}</div>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100 font-mono mt-1">
                {ageData.totalMonths.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-semibold">{isAr ? 'إجمالي الأسابيع' : 'Total Weeks'}</div>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100 font-mono mt-1">
                {ageData.totalWeeks.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-semibold">{isAr ? 'إجمالي الأيام' : 'Total Days'}</div>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100 font-mono mt-1">
                {ageData.totalDays.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-semibold">{isAr ? 'إجمالي الساعات' : 'Total Hours'}</div>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100 font-mono mt-1">
                {ageData.totalHours.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-semibold">{isAr ? 'إجمالي الدقائق' : 'Total Minutes'}</div>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100 font-mono mt-1">
                {ageData.totalMinutes.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-semibold">{isAr ? 'إجمالي الثواني' : 'Total Seconds'}</div>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100 font-mono mt-1">
                {ageData.totalSeconds.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          {isAr ? 'يرجى اختيار تاريخ ميلاد وتاريخ حساب صالحين' : 'Please select valid birth and calculation dates'}
        </div>
      )}
    </div>
  );
};
