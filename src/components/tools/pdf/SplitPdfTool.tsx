import React, { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { PDFDocument } from 'pdf-lib';
import { Upload, Download, RotateCcw, Scissors, Check, FileText } from 'lucide-react';

export const SplitPdfTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState<string>('document');
  const [pageCount, setPageCount] = useState<number>(0);
  const [rangeStr, setRangeStr] = useState<string>('1');
  const [splitPdfUrl, setSplitPdfUrl] = useState<string | null>(null);
  const [isSplitting, setIsSplitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    setErrorMessage(null);

    const buffer = await file.arrayBuffer();
    try {
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setPdfBuffer(buffer);
      setPageCount(count);
      setRangeStr(count > 1 ? `1-${Math.min(count, 3)}` : '1');
    } catch (err) {
      setErrorMessage(isAr ? 'تعذر قراءة ملف PDF. قد يكون محمياً بكلمة مرور.' : 'Failed to read PDF. It might be password protected.');
    }
  };

  const parseRanges = (input: string, max: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const from = Math.max(1, Math.min(start, end));
          const to = Math.min(max, Math.max(start, end));
          for (let i = from; i <= to; i++) {
            pages.add(i - 1); // 0-indexed
          }
        }
      } else {
        const p = parseInt(trimmed, 10);
        if (!isNaN(p) && p >= 1 && p <= max) {
          pages.add(p - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!pdfBuffer || pageCount === 0) return;
    setIsSplitting(true);
    setErrorMessage(null);

    try {
      const pageIndices = parseRanges(rangeStr, pageCount);
      if (pageIndices.length === 0) {
        setErrorMessage(isAr ? 'يرجى تحديد أرقام صفحات صالحة.' : 'Please enter valid page numbers.');
        setIsSplitting(false);
        return;
      }

      const srcDoc = await PDFDocument.load(pdfBuffer);
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((page) => newDoc.addPage(page));

      const splitPdfBytes = await newDoc.save();
      const blob = new Blob([splitPdfBytes], { type: 'application/pdf' });
      setSplitPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Error splitting PDF:', err);
      setErrorMessage(isAr ? 'حدث خطأ أثناء استخراج الصفحات.' : 'An error occurred while splitting the PDF.');
    } finally {
      setIsSplitting(false);
    }
  };

  const handleReset = () => {
    setPdfBuffer(null);
    setPageCount(0);
    setSplitPdfUrl(null);
    setRangeStr('1');
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {!pdfBuffer ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-400 bg-white dark:bg-slate-800/60 rounded-2xl p-10 text-center cursor-pointer transition-all group shadow-sm hover:shadow"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Scissors className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
            {isAr ? 'اختر ملف PDF لتقسيمه واستخراج صفحاته' : 'Select a PDF file to split or extract pages'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isAr ? 'استخرج صفحات مفردة أو نطاقات مثل 1-3، 5، 7-10' : 'Extract specific pages or custom ranges (e.g. 1-3, 5, 8)'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scissors className="w-4 h-4 text-red-600" />
                {isAr ? 'خيارات التقسيم' : 'Split Range Settings'}
              </h4>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isAr ? 'تغيير الملف' : 'Change PDF'}
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 flex items-center justify-between border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-red-500" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                    {fileName}.pdf
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {pageCount} {isAr ? 'صفحة إجمالاً' : 'Total Pages'}
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-2.5 py-1 rounded-lg">
                1 ~ {pageCount}
              </span>
            </div>

            {/* Range Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isAr ? 'الصفحات المراد استخراجها (مثال: 1-4, 7, 9-12):' : 'Pages to extract (e.g. 1-4, 7, 9-12):'}
              </label>
              <input
                type="text"
                value={rangeStr}
                onChange={(e) => setRangeStr(e.target.value)}
                placeholder="1-3, 5"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                {isAr
                  ? 'استخدم الفواصل والشرطات لتحديد صفحات متعددة.'
                  : 'Separate ranges with commas and dashes.'}
              </p>
            </div>

            {/* Quick Range Presets */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
                {isAr ? 'نطاقات سريعة:' : 'Quick Presets:'}
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setRangeStr('1')}
                  className="py-1.5 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:border-red-400 text-center"
                >
                  {isAr ? 'الصفحة 1 فقط' : 'First Page (1)'}
                </button>
                <button
                  type="button"
                  onClick={() => setRangeStr(`1-${Math.min(pageCount, 5)}`)}
                  className="py-1.5 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:border-red-400 text-center"
                >
                  1-{Math.min(pageCount, 5)}
                </button>
                <button
                  type="button"
                  onClick={() => setRangeStr(`${pageCount}`)}
                  className="py-1.5 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:border-red-400 text-center"
                >
                  {isAr ? 'آخر صفحة' : `Last (${pageCount})`}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleSplit}
                disabled={isSplitting}
                className="w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white transition shadow-md hover:shadow-lg cursor-pointer"
              >
                <Scissors className="w-5 h-5" />
                {isSplitting ? (isAr ? 'جاري الاستخراج...' : 'Extracting Pages...') : (isAr ? 'استخراج الصفحات المحددة' : 'Extract Selected Pages')}
              </button>

              {splitPdfUrl && (
                <a
                  href={splitPdfUrl}
                  download={`${fileName}_extracted.pdf`}
                  className="w-full py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white transition shadow cursor-pointer text-sm"
                >
                  <Download className="w-4 h-4" />
                  {isAr ? 'تحميل المستند المستخرج' : 'Download Extracted PDF'}
                </a>
              )}
            </div>
          </div>

          {/* Info Card */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between shadow-sm">
            <div className="border-b border-slate-100 dark:border-slate-700/60 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isAr ? 'تفاصيل التقسيم' : 'Extraction Details'}
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
              <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h5 className="font-bold text-slate-800 dark:text-white mb-1">
                  {isAr ? 'استخراج دقيق وسريع' : 'High Precision PDF Splitting'}
                </h5>
                <p className="text-xs text-slate-500 max-w-sm">
                  {isAr
                    ? 'يتم إنشاء ملف PDF جديد يحتوي فقط على الصفحات التي اخترتها دون أي فقدان في جودة النصوص أو الصور.'
                    : 'A clean new PDF document is produced containing only your chosen pages with 100% vector and image fidelity.'}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{isAr ? 'معالجة محلية داخل المتصفح' : 'Processed locally in browser'}</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> {isAr ? 'آمن' : 'Secure'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
