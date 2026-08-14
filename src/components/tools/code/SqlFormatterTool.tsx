import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Copy, Check, RotateCcw, Download, Database, Code2 } from 'lucide-react';

export const SqlFormatterTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [input, setInput] = useState<string>(
    `select u.id, u.username, u.email, count(o.id) as total_orders, sum(o.total_amount) as total_spent from users u left join orders o on u.id = o.user_id where u.status = 'active' and u.created_at >= '2024-01-01' group by u.id, u.username, u.email having count(o.id) > 2 order by total_spent desc limit 50;`
  );
  const [output, setOutput] = useState<string>('');
  const [uppercaseKeywords, setUppercaseKeywords] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const formatSQL = (sql: string, upper: boolean): string => {
    if (!sql.trim()) return '';

    const keywords = [
      'SELECT',
      'FROM',
      'WHERE',
      'LEFT JOIN',
      'RIGHT JOIN',
      'INNER JOIN',
      'FULL OUTER JOIN',
      'CROSS JOIN',
      'JOIN',
      'ON',
      'GROUP BY',
      'HAVING',
      'ORDER BY',
      'LIMIT',
      'OFFSET',
      'INSERT INTO',
      'VALUES',
      'UPDATE',
      'SET',
      'DELETE FROM',
      'CREATE TABLE',
      'ALTER TABLE',
      'DROP TABLE',
      'UNION ALL',
      'UNION',
      'AND',
      'OR',
      'AS',
      'DESC',
      'ASC',
      'IN',
      'NOT IN',
      'EXISTS',
      'BETWEEN',
      'LIKE',
      'IS NULL',
      'IS NOT NULL',
      'COUNT',
      'SUM',
      'AVG',
      'MIN',
      'MAX',
      'CASE',
      'WHEN',
      'THEN',
      'ELSE',
      'END',
    ];

    // Main line-breaking clauses
    const majorClauses = [
      'SELECT',
      'FROM',
      'WHERE',
      'LEFT JOIN',
      'RIGHT JOIN',
      'INNER JOIN',
      'FULL OUTER JOIN',
      'CROSS JOIN',
      'JOIN',
      'GROUP BY',
      'HAVING',
      'ORDER BY',
      'LIMIT',
      'OFFSET',
      'SET',
      'VALUES',
      'UNION ALL',
      'UNION',
    ];

    let clean = sql.replace(/\s+/g, ' ').trim();

    // Replace keywords
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      clean = clean.replace(regex, (match) => (upper ? match.toUpperCase() : match.toLowerCase()));
    });

    // Add newlines before major clauses
    majorClauses.forEach((clause) => {
      const kw = upper ? clause.toUpperCase() : clause.toLowerCase();
      const regex = new RegExp(`\\s+(${kw})\\b`, 'g');
      clean = clean.replace(regex, `\n$1`);
    });

    // Add indentation for AND / OR under WHERE / HAVING
    clean = clean.replace(/\s+(AND|OR)\b/g, `\n  $1`);

    // Format commas in SELECT clause
    const lines = clean.split('\n').map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('SELECT') || trimmed.startsWith('select')) {
        // format select items onto multiple lines if long
        const parts = trimmed.split(/,\s*/);
        if (parts.length > 3) {
          const first = parts[0];
          const rest = parts.slice(1).map((p) => '  ' + p);
          return [first, ...rest].join(',\n');
        }
      }
      return trimmed;
    });

    return lines.join('\n');
  };

  const handleFormat = () => {
    setOutput(formatSQL(input, uppercaseKeywords));
  };

  React.useEffect(() => {
    handleFormat();
  }, [input, uppercaseKeywords]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query-formatted.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={uppercaseKeywords}
              onChange={(e) => setUppercaseKeywords(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded-sm border-slate-300 focus:ring-purple-500"
            />
            {isAr ? 'تحويل الكلمات المفتاحية لأحرف كبيرة (UPPERCASE)' : 'Capitalize SQL Keywords'}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setInput('');
              setOutput('');
            }}
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
            {copied ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ الاستعلام' : 'Copy Query'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!output}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {isAr ? 'تحميل .sql' : 'Download .sql'}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-purple-500" />
              {isAr ? 'استعلام SQL المدخل' : 'Raw SQL Query'}
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isAr ? 'الصق استعلام SQL هنا...' : 'Paste SQL query here...'}
            className="w-full h-96 p-4 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none text-slate-800 dark:text-slate-100"
            dir="ltr"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <Code2 className="w-4 h-4" />
              {isAr ? 'الاستعلام المنسق' : 'Formatted SQL'}
            </span>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder={isAr ? 'سيظهر الاستعلام المنسق هنا...' : 'Formatted SQL will appear here...'}
            className="w-full h-96 p-4 font-mono text-xs bg-slate-900 text-purple-300 border border-slate-800 rounded-xl focus:outline-none resize-none selection:bg-purple-800 selection:text-white"
            dir="ltr"
          />
        </div>
      </div>
    </div>
  );
};
