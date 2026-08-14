import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Thermometer, ArrowRightLeft, Copy, Check, Sun, Snowflake } from 'lucide-react';

export const TemperatureConverterTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [value, setValue] = useState<number>(25);
  const [fromUnit, setFromUnit] = useState<'C' | 'F' | 'K'>('C');
  const [toUnit, setToUnit] = useState<'C' | 'F' | 'K'>('F');
  const [copied, setCopied] = useState<boolean>(false);

  // Conversion logic to Celsius base
  const toCelsius = (val: number, unit: 'C' | 'F' | 'K'): number => {
    switch (unit) {
      case 'C':
        return val;
      case 'F':
        return ((val - 32) * 5) / 9;
      case 'K':
        return val - 273.15;
    }
  };

  const fromCelsius = (celsius: number, targetUnit: 'C' | 'F' | 'K'): number => {
    switch (targetUnit) {
      case 'C':
        return celsius;
      case 'F':
        return (celsius * 9) / 5 + 32;
      case 'K':
        return celsius + 273.15;
    }
  };

  const celsius = toCelsius(value || 0, fromUnit);
  const converted = fromCelsius(celsius, toUnit);

  const allTemps = {
    C: celsius,
    F: fromCelsius(celsius, 'F'),
    K: fromCelsius(celsius, 'K'),
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${converted.toFixed(2)}`);
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
              {isAr ? 'درجة الحرارة الأصلية' : 'From'}
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
                onChange={(e) => setFromUnit(e.target.value as any)}
                className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="C">Celsius (°C)</option>
                <option value="F">Fahrenheit (°F)</option>
                <option value="K">Kelvin (K)</option>
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

          {/* Output */}
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
                value={`${Number(converted.toFixed(2)).toLocaleString()} °${toUnit}`}
                className="w-full px-4 py-2.5 bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl font-mono font-bold text-amber-700 dark:text-amber-300 focus:outline-none"
              />
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value as any)}
                className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-xs text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="C">Celsius (°C)</option>
                <option value="F">Fahrenheit (°F)</option>
                <option value="K">Kelvin (K)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Temperature Reference Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {isAr ? 'الدرجة المئوية (Celsius)' : 'Celsius'}
          </div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {Number(allTemps.C.toFixed(2)).toLocaleString()} °C
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {isAr ? 'الفهرنهايت (Fahrenheit)' : 'Fahrenheit'}
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {Number(allTemps.F.toFixed(2)).toLocaleString()} °F
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {isAr ? 'الكلفن (Kelvin)' : 'Kelvin'}
          </div>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
            {Number(allTemps.K.toFixed(2)).toLocaleString()} K
          </div>
        </div>
      </div>
    </div>
  );
};
