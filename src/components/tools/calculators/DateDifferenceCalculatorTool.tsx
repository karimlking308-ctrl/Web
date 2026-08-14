import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Calendar, Clock, ArrowRight, SunMedium } from 'lucide-react';

export const DateDifferenceCalculatorTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [startDate, setStartDate] = useState<string>('2024-01-01');
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [includeEndDay, setIncludeEndDay] = useState<boolean>(false);

  const diffData = useMemo(() => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    let isNegative = false;
    let d1 = start;
    let d2 = end;

    if (end < start) {
      isNegative = true;
      d1 = end;
      d2 = start;
    }

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate() + (includeEndDay ? 1 : 0);

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = Math.abs(end.getTime() - start.getTime()) + (includeEndDay ? 86400000 : 0);
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Working days (Mon-Fri)
    let workDays = 0;
    let weekendDays = 0;
    const cur = new Date(d1);
    while (cur < d2 || (includeEndDay && cur.toDateString() === d2.toDateString())) {
      const dayOfWeek = cur.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendDays++;
      } else {
        workDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      remDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      workDays,
      weekendDays,
      isNegative,
    };
  }, [startDate, endDate, includeEndDay]);

  return (
    <div className="space-y-6">
      {/* Date Pickers */}
      <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
              <Calendar className="w-4 h-4 text-indigo-500" />
              {isAr ? 'تاريخ البداية (Start Date)' : 'Start Date'}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
              <Calendar className="w-4 h-4 text-emerald-500" />
              {isAr ? 'تاريخ النهاية (End Date)' : 'End Date'}
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 dark:text-slate-100 text-sm font-semibold"
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeEndDay}
              onChange={(e) => setIncludeEndDay(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500"
            />
            {isAr ? 'تضمين اليوم الأخير في الحساب (+1 يوم)' : 'Include end date in calculation (+1 day)'}
          </label>
        </div>
      </div>

      {diffData ? (
        <div className="space-y-6">
          {/* Main Duration Banner */}
          <div className="p-6 bg-linear-to-br from-indigo-500/10 via-blue-500/10 to-teal-500/10 border border-indigo-500/20 rounded-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1">
              {isAr ? 'الفارق الزمني الإجمالي' : 'Total Duration Difference'}
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {diffData.years > 0 && (
                <span>
                  {diffData.years} {isAr ? 'سنة' : 'years'},{' '}
                </span>
              )}
              {diffData.months > 0 && (
                <span>
                  {diffData.months} {isAr ? 'شهر' : 'months'},{' '}
                </span>
              )}
              <span>
                {diffData.days} {isAr ? 'يوم' : 'days'}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-2 font-mono">
              = {diffData.totalDays.toLocaleString()} {isAr ? 'يوماً إجمالياً' : 'Total Days'} ({diffData.totalWeeks}{' '}
              {isAr ? 'أسابيع و' : 'weeks &'} {diffData.remDays} {isAr ? 'أيام' : 'days'})
            </div>
          </div>

          {/* Unit Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-semibold">{isAr ? 'أيام العمل' : 'Working Days (M-F)'}</div>
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                {diffData.workDays.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-semibold">{isAr ? 'أيام العطلة' : 'Weekend Days'}</div>
              <div className="text-xl font-bold text-slate-700 dark:text-slate-200 font-mono mt-1">
                {diffData.weekendDays.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-semibold">{isAr ? 'إجمالي الساعات' : 'Total Hours'}</div>
              <div className="text-xl font-bold text-slate-700 dark:text-slate-200 font-mono mt-1">
                {diffData.totalHours.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
              <div className="text-xs text-slate-400 font-semibold">{isAr ? 'إجمالي الدقائق' : 'Total Minutes'}</div>
              <div className="text-xl font-bold text-slate-700 dark:text-slate-200 font-mono mt-1">
                {diffData.totalMinutes.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
