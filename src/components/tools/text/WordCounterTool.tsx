import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Copy, Check, RotateCcw, FileText, Clock, Volume2, AlignLeft, Hash } from 'lucide-react';

export const WordCounterTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [text, setText] = useState<string>(
    `Sol Tools provides a versatile suite of browser-based utilities built for everyday productivity. All operations run locally inside your browser, guaranteeing total privacy and zero data leakage. Explore fast image resizers, PDF converters, and code beautifiers with ease.`
  );
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    if (!text.trim()) {
      return {
        words: 0,
        charsWithSpaces: 0,
        charsWithoutSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        readingTime: '0 min',
        speakingTime: '0 min',
        topWords: [] as { word: string; count: number }[],
      };
    }

    // Word count (split by spaces/newlines)
    const wordsArray = text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    const words = wordsArray.length;

    // Characters
    const charsWithSpaces = text.length;
    const charsWithoutSpaces = text.replace(/\s/g, '').length;

    // Sentences
    const sentenceMatches = text.match(/[^.!?]+[.!?]+(\s|$)/g);
    const sentences = sentenceMatches ? sentenceMatches.length : (words > 0 ? 1 : 0);

    // Paragraphs
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;

    // Lines
    const lines = text.split('\n').length;

    // Reading & speaking times (avg reading speed = 200 wpm, speaking = 130 wpm)
    const readMin = Math.ceil(words / 200);
    const speakMin = Math.ceil(words / 130);

    // Top words density
    const frequencyMap: Record<string, number> = {};
    const stopWords = new Set([
      'the', 'and', 'a', 'an', 'in', 'on', 'of', 'for', 'to', 'with', 'is', 'are', 'was', 'were',
      'this', 'that', 'it', 'by', 'as', 'at', 'from', 'or', 'be', 'من', 'في', 'على', 'إلى', 'عن', 'مع', 'هذا', 'هذه', 'أن', 'ان'
    ]);

    wordsArray.forEach((raw) => {
      const clean = raw.toLowerCase().replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '');
      if (clean.length > 2 && !stopWords.has(clean)) {
        frequencyMap[clean] = (frequencyMap[clean] || 0) + 1;
      }
    });

    const topWords = Object.entries(frequencyMap)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      words,
      charsWithSpaces,
      charsWithoutSpaces,
      sentences,
      paragraphs,
      lines,
      readingTime: `${readMin} ${isAr ? 'دقيقة' : 'min'}`,
      speakingTime: `${speakMin} ${isAr ? 'دقيقة' : 'min'}`,
      topWords,
    };
  }, [text, isAr]);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 text-center">
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {stats.words.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
            {isAr ? 'الكلمات' : 'Words'}
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3.5 text-center">
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {stats.charsWithSpaces.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
            {isAr ? 'الأحرف (مع المسافات)' : 'Chars (w/ space)'}
          </div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 text-center">
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.charsWithoutSpaces.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
            {isAr ? 'الأحرف (بدون مسافات)' : 'Chars (no space)'}
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3.5 text-center">
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {stats.sentences.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
            {isAr ? 'الجمل' : 'Sentences'}
          </div>
        </div>

        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 text-center">
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {stats.paragraphs.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
            {isAr ? 'الفقرات' : 'Paragraphs'}
          </div>
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3.5 text-center">
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
            {stats.lines.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
            {isAr ? 'الأسطر' : 'Lines'}
          </div>
        </div>
      </div>

      {/* Main Text Area */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-500" />
            {isAr ? 'مساحة كتابة النص' : 'Input Text'}
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
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ' : 'Copy'}
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isAr ? 'اكتب أو الصق نصك هنا لحساب الكلمات والأحرف فوراً...' : 'Type or paste your text here to count words, characters and metrics in real-time...'}
          className="w-full h-64 sm:h-80 p-4 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none resize-y text-slate-800 dark:text-slate-100 leading-relaxed"
        />
      </div>

      {/* Additional Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
        <div className="flex flex-col gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            {isAr ? 'تقديرات الوقت' : 'Time Estimates'}
          </span>
          <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500">{isAr ? 'وقت القراءة المقدر (200 ك/د):' : 'Estimated Reading Time (200 wpm):'}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{stats.readingTime}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500">{isAr ? 'وقت الإلقاء الصوتي (130 ك/د):' : 'Estimated Speaking Time (130 wpm):'}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{stats.speakingTime}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-amber-500" />
            {isAr ? 'أكثر الكلمات تكراراً' : 'Top Keywords Density'}
          </span>
          {stats.topWords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {stats.topWords.map((item) => (
                <div
                  key={item.word}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{item.word}</span>
                  <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.2 rounded-full font-mono text-[10px]">
                    {item.count}×
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400 italic p-2">{isAr ? 'أدخل مزيداً من النص لتحليل الكلمات' : 'Enter more text to view keyword density'}</div>
          )}
        </div>
      </div>
    </div>
  );
};
