import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Copy, Check, RotateCcw, Download, Terminal, Code2 } from 'lucide-react';

export const JavascriptFormatterTool: React.FC = () => {
  const { lang, t } = useApp();
  const isAr = lang === 'ar';

  const [input, setInput] = useState<string>(`// Sample JavaScript / TypeScript
function calculateMetrics(items, taxRate = 0.08) {
const subtotal = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
const tax = subtotal * taxRate;
const total = subtotal + tax;
return { subtotal, tax, total, itemCount: items.length };
}

const sampleCart = [{ id: 1, name: "Pro Laptop", price: 1299.99, quantity: 1 }, { id: 2, name: "Wireless Mouse", price: 49.5, quantity: 2 }];
const result = calculateMetrics(sampleCart);
console.log("Calculated Total:", result.total);`);
  const [output, setOutput] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [copied, setCopied] = useState<boolean>(false);
  const [stats, setStats] = useState<{ lines: number; chars: number; sizeKb: string }>({
    lines: 0,
    chars: 0,
    sizeKb: '0 KB',
  });

  const formatJS = (code: string, spaces: number): string => {
    if (!code.trim()) return '';

    // Token-aware simple beautifier for JavaScript
    let formatted = '';
    let indentLevel = 0;
    const indentStr = ' '.repeat(spaces);
    const lines = code.split('\n');

    const cleanLines: string[] = [];
    for (const rawLine of lines) {
      const trimmed = rawLine.trim();
      if (!trimmed) continue;
      cleanLines.push(trimmed);
    }

    // Reconstruct with structural bracket indentation
    const fullCode = cleanLines.join(' ');
    let inString: string | null = null;
    let inComment = false;
    let buffer = '';

    for (let i = 0; i < fullCode.length; i++) {
      const char = fullCode[i];
      const nextChar = fullCode[i + 1] || '';
      const prevChar = fullCode[i - 1] || '';

      // Handle strings
      if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
        if (!inString) inString = char;
        else if (inString === char) inString = null;
        buffer += char;
        continue;
      }

      if (inString) {
        buffer += char;
        continue;
      }

      // Handle comments
      if (char === '/' && nextChar === '/') {
        // Line comment
        const remaining = fullCode.slice(i);
        const newlineIdx = remaining.indexOf('\n');
        if (newlineIdx !== -1) {
          buffer += remaining.slice(0, newlineIdx);
          i += newlineIdx;
        } else {
          buffer += remaining;
          i = fullCode.length;
        }
        continue;
      }

      if (char === '{' || char === '[') {
        buffer = buffer.trim();
        if (buffer) {
          formatted += indentStr.repeat(indentLevel) + buffer + ' ' + char + '\n';
          buffer = '';
        } else {
          formatted += indentStr.repeat(indentLevel) + char + '\n';
        }
        indentLevel++;
      } else if (char === '}' || char === ']') {
        buffer = buffer.trim();
        if (buffer) {
          formatted += indentStr.repeat(indentLevel) + buffer + '\n';
          buffer = '';
        }
        indentLevel = Math.max(0, indentLevel - 1);
        formatted += indentStr.repeat(indentLevel) + char + '\n';
      } else if (char === ';') {
        buffer += char;
        buffer = buffer.trim();
        formatted += indentStr.repeat(indentLevel) + buffer + '\n';
        buffer = '';
      } else {
        buffer += char;
      }
    }

    if (buffer.trim()) {
      formatted += indentStr.repeat(indentLevel) + buffer.trim() + '\n';
    }

    // Fallback if structural parsing yielded empty or single line
    if (!formatted.trim()) {
      return code;
    }

    return formatted.trim();
  };

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    const res = formatJS(input, indentSize);
    setOutput(res);

    const lineCount = res.split('\n').length;
    const charCount = res.length;
    const bytes = new Blob([res]).size;
    setStats({
      lines: lineCount,
      chars: charCount,
      sizeKb: (bytes / 1024).toFixed(2) + ' KB',
    });
  };

  React.useEffect(() => {
    handleFormat();
  }, [input, indentSize]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'script-formatted.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            {isAr ? 'المسافة البادئة:' : 'Indentation:'}
          </label>
          <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setIndentSize(2)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                indentSize === 2
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              2 {isAr ? 'مسافات' : 'spaces'}
            </button>
            <button
              onClick={() => setIndentSize(4)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                indentSize === 4
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              4 {isAr ? 'مسافات' : 'spaces'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isAr ? 'مسح' : 'Clear'}
          </button>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ الكود' : 'Copy Code'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!output}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {isAr ? 'تحميل .js' : 'Download .js'}
          </button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Pane */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-purple-500" />
              {isAr ? 'كود جافاسكريبت المدخل' : 'JavaScript / TypeScript Input'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {input.length} {isAr ? 'حرف' : 'chars'}
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isAr ? 'الصق كود جافاسكريبت هنا...' : 'Paste JavaScript / TypeScript here...'}
            className="w-full h-96 p-4 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none text-slate-800 dark:text-slate-100"
            dir="ltr"
          />
        </div>

        {/* Output Pane */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <Code2 className="w-4 h-4" />
              {isAr ? 'الكود المنسق' : 'Formatted Code'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {stats.lines} {isAr ? 'أسطر' : 'lines'} • {stats.sizeKb}
            </span>
          </div>
          <div className="relative">
            <textarea
              readOnly
              value={output}
              placeholder={isAr ? 'سيظهر الكود المنسق هنا...' : 'Formatted code will appear here...'}
              className="w-full h-96 p-4 font-mono text-xs bg-slate-900 text-purple-300 border border-slate-800 rounded-xl focus:outline-none resize-none selection:bg-purple-800 selection:text-white"
              dir="ltr"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
