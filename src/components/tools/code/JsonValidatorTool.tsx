import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CheckCircle, AlertTriangle, Play, Trash2, Copy, Check, FileText } from 'lucide-react';

export const JsonValidatorTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [inputJson, setInputJson] = useState<string>('{\n  "name": "QuickKit",\n  "version": 1.0,\n  "status": "active"\n}');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    error: string | null;
    stats?: { keys: number; depth: number; size: number };
  } | null>(null);

  const validate = (text: string) => {
    if (!text.trim()) {
      setValidationResult(null);
      return;
    }

    try {
      const parsed = JSON.parse(text);

      const countKeysAndDepth = (obj: any, currentDepth = 1): { keys: number; depth: number } => {
        if (typeof obj !== 'object' || obj === null) return { keys: 0, depth: currentDepth };
        let count = Array.isArray(obj) ? obj.length : Object.keys(obj).length;
        let maxChildDepth = currentDepth;

        for (const key of Object.keys(obj)) {
          const res = countKeysAndDepth(obj[key], currentDepth + 1);
          count += res.keys;
          if (res.depth > maxChildDepth) maxChildDepth = res.depth;
        }
        return { keys: count, depth: maxChildDepth };
      };

      const { keys, depth } = countKeysAndDepth(parsed);
      setValidationResult({
        isValid: true,
        error: null,
        stats: {
          keys,
          depth,
          size: new Blob([text]).size,
        },
      });
    } catch (err: any) {
      setValidationResult({
        isValid: false,
        error: err.message || 'Invalid JSON syntax',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {isAr ? 'فاحص ومحقق صحة كود JSON' : 'JSON Syntax & Structure Validator'}
        </span>
        <button
          type="button"
          onClick={() => {
            setInputJson('');
            setValidationResult(null);
          }}
          className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50 flex items-center gap-1.5 transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {isAr ? 'مسح' : 'Clear'}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
        <textarea
          value={inputJson}
          onChange={(e) => {
            setInputJson(e.target.value);
            validate(e.target.value);
          }}
          placeholder={isAr ? 'الصق كود JSON للتحقق من صحته...' : 'Paste your JSON string here to validate...'}
          rows={12}
          className="w-full font-mono text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />

        <button
          type="button"
          onClick={() => validate(inputJson)}
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
        >
          <Play className="w-4 h-4" />
          {isAr ? 'فحص الصياغة الآن' : 'Validate Syntax Now'}
        </button>
      </div>

      {/* Validation Result Box */}
      {validationResult && (
        <div
          className={`rounded-2xl p-6 border shadow-sm transition-all ${
            validationResult.isValid
              ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                validationResult.isValid
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300'
              }`}
            >
              {validationResult.isValid ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>

            <div className="space-y-2 flex-1">
              <h4
                className={`text-base font-bold ${
                  validationResult.isValid
                    ? 'text-emerald-900 dark:text-emerald-200'
                    : 'text-rose-900 dark:text-rose-200'
                }`}
              >
                {validationResult.isValid
                  ? isAr
                    ? 'كود JSON صحيح 100% وخالٍ من الأخطاء!'
                    : 'Valid JSON! Syntax is completely clean.'
                  : isAr
                  ? 'تم اكتشاف خطأ في صياغة JSON'
                  : 'Invalid JSON Syntax Detected'}
              </h4>

              {validationResult.isValid && validationResult.stats && (
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-3 border border-emerald-100 dark:border-emerald-900/40 text-center">
                    <span className="text-[11px] text-slate-500 block">{isAr ? 'إجمالي الحقول' : 'Total Keys'}</span>
                    <span className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300">
                      {validationResult.stats.keys}
                    </span>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-3 border border-emerald-100 dark:border-emerald-900/40 text-center">
                    <span className="text-[11px] text-slate-500 block">{isAr ? 'أقصى عمق' : 'Max Depth'}</span>
                    <span className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300">
                      {validationResult.stats.depth}
                    </span>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-3 border border-emerald-100 dark:border-emerald-900/40 text-center">
                    <span className="text-[11px] text-slate-500 block">{isAr ? 'الحجم' : 'Payload Size'}</span>
                    <span className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300">
                      {validationResult.stats.size} B
                    </span>
                  </div>
                </div>
              )}

              {!validationResult.isValid && validationResult.error && (
                <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-3 border border-rose-200 dark:border-rose-900/50 font-mono text-xs text-rose-700 dark:text-rose-300">
                  {validationResult.error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
