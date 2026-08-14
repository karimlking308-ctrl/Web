import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Copy, Check, RotateCcw, CaseUpper, CaseLower, Type } from 'lucide-react';

export const TextCaseConverterTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [text, setText] = useState<string>(
    'QuickKit offers an intuitive suite of free web developer tools and productivity converters.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Conversion helpers
  const toUpper = (str: string) => str.toUpperCase();
  const toLower = (str: string) => str.toLowerCase();

  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const toSentenceCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toCamelCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
      .replace(/^[A-Z]/, (c) => c.toLowerCase());
  };

  const toPascalCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
  };

  const toSnakeCase = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  const toKebabCase = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const toConstantCase = (str: string) => {
    return str
      .toUpperCase()
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  const toAlternatingCase = (str: string) => {
    let result = '';
    let toggle = false;
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (/[a-zA-Z]/.test(char)) {
        result += toggle ? char.toUpperCase() : char.toLowerCase();
        toggle = !toggle;
      } else {
        result += char;
      }
    }
    return result;
  };

  const cases = [
    { id: 'upper', name: 'UPPERCASE', fn: toUpper, sample: 'SAMPLE TEXT' },
    { id: 'lower', name: 'lowercase', fn: toLower, sample: 'sample text' },
    { id: 'title', name: 'Title Case', fn: toTitleCase, sample: 'Sample Text' },
    { id: 'sentence', name: 'Sentence case', fn: toSentenceCase, sample: 'Sample text.' },
    { id: 'camel', name: 'camelCase', fn: toCamelCase, sample: 'sampleText' },
    { id: 'pascal', name: 'PascalCase', fn: toPascalCase, sample: 'SampleText' },
    { id: 'snake', name: 'snake_case', fn: toSnakeCase, sample: 'sample_text' },
    { id: 'kebab', name: 'kebab-case', fn: toKebabCase, sample: 'sample-text' },
    { id: 'constant', name: 'CONSTANT_CASE', fn: toConstantCase, sample: 'SAMPLE_TEXT' },
    { id: 'alternating', name: 'aLtErNaTiNg', fn: toAlternatingCase, sample: 'sAmPlE tExT' },
  ];

  const handleApplyCase = (fn: (s: string) => string) => {
    setText(fn(text));
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Case Action Buttons */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          {isAr ? 'اختر الحالة المطلوبة للتحويل الفوري:' : 'Click to transform text case:'}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {cases.map((item) => (
            <button
              key={item.id}
              onClick={() => handleApplyCase(item.fn)}
              className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-xs text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs group"
            >
              <span className="font-bold text-xs group-hover:text-white">{item.name}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-amber-100 font-mono mt-0.5">
                {item.sample}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Text Input / Output */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-amber-500" />
            {isAr ? 'النص القابل للتعديل' : 'Live Text Editor'}
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setText('')}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {isAr ? 'مسح' : 'Clear'}
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ النص' : 'Copy Text'}
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isAr ? 'اكتب أو الصق نصك هنا ثم انقر على الحالة المطلوبة...' : 'Type or paste text here then click any format above...'}
          className="w-full h-72 p-4 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none resize-y text-slate-800 dark:text-slate-100 leading-relaxed"
        />
      </div>
    </div>
  );
};
