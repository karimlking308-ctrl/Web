import React, { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import * as pdfjsLib from 'pdfjs-dist';
import { Upload, Download, RotateCcw, FileImage, Check, Eye } from 'lucide-react';

// Set up worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
} catch (e) {}

interface RenderedPage {
  pageNumber: number;
  dataUrl: string;
}

export const PdfToJpgTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [format, setFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [scale, setScale] = useState<number>(2); // 2x for crisp high-DPI output
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [totalPageCount, setTotalPageCount] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfFile(file);
    setPages([]);
    setIsLoading(true);
    setProgress(0);

    try {
      const buffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;
      setTotalPageCount(pdf.numPages);

      const renderedList: RenderedPage[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(Math.round((i / pdf.numPages) * 100));
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          if (format === 'jpeg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          await page.render({
            canvasContext: ctx,
            viewport: viewport,
            canvas: canvas,
          } as any).promise;

          const mime = `image/${format}`;
          const dataUrl = canvas.toDataURL(mime, 0.95);
          renderedList.push({
            pageNumber: i,
            dataUrl,
          });
        }
      }

      setPages(renderedList);
    } catch (err) {
      console.error('Error converting PDF to images:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPdfFile(null);
    setPages([]);
    setProgress(0);
    setTotalPageCount(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadAll = () => {
    pages.forEach((p) => {
      const a = document.createElement('a');
      a.href = p.dataUrl;
      const baseName = pdfFile ? pdfFile.name.replace(/\.[^/.]+$/, '') : 'document';
      a.download = `${baseName}_page_${p.pageNumber}.${format === 'jpeg' ? 'jpg' : 'png'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <div className="space-y-6">
      {!pdfFile ? (
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
            <FileImage className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
            {isAr ? 'اختر ملف PDF لتحويل صفحاته إلى صور عالية الدقة' : 'Select a PDF file to convert into high-res images'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isAr ? 'استخراج سريع لصفحات المستند بصيغة JPG أو PNG' : 'Instantly extract pages as high-quality JPG or PNG images'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileImage className="w-4 h-4 text-red-600" />
                {isAr ? 'إعدادات الاستخراج' : 'Export Settings'}
              </h4>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isAr ? 'تغيير الملف' : 'Change PDF'}
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white truncate">{pdfFile.name}</div>
              <div>{totalPageCount} {isAr ? 'صفحة مكتشفة' : 'pages found'}</div>
            </div>

            {/* Format choice */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                {isAr ? 'صيغة الصور:' : 'Image Format:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['jpeg', 'png'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormat(fmt)}
                    className={`py-2 text-xs font-bold uppercase rounded-xl border transition ${
                      format === fmt
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {fmt === 'jpeg' ? 'JPG' : fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality scale */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                {isAr ? 'دقة الصورة:' : 'Render Quality (DPI):'}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {[
                  { scaleVal: 1.5, label: isAr ? 'عادية (150 DPI)' : 'Standard (1.5x)' },
                  { scaleVal: 2.0, label: isAr ? 'فائقة (300 DPI)' : 'High Res (2.0x)' },
                ].map((s) => (
                  <button
                    key={s.scaleVal}
                    type="button"
                    onClick={() => setScale(s.scaleVal)}
                    className={`py-2 px-2 text-center rounded-xl border font-bold text-xs transition ${
                      scale === s.scaleVal
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Download All CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={downloadAll}
                disabled={pages.length === 0}
                className="w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white transition shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-5 h-5" />
                {isAr ? `تحميل كافة الصفحات (${pages.length})` : `Download All Pages (${pages.length})`}
              </button>
            </div>
          </div>

          {/* Rendered Grid */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isAr ? `الصفحات المستخرجة (${pages.length}/${totalPageCount})` : `Extracted Pages (${pages.length}/${totalPageCount})`}
              </span>
              {isLoading && (
                <span className="text-xs font-mono text-red-600 dark:text-red-400 font-semibold animate-pulse">
                  {progress}% {isAr ? 'جاري التحويل...' : 'Converting...'}
                </span>
              )}
            </div>

            {isLoading && (
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-red-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[520px] overflow-y-auto pr-1">
              {pages.map((p) => (
                <div
                  key={p.pageNumber}
                  className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 p-2 flex flex-col justify-between group hover:border-red-400 transition"
                >
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-white dark:bg-slate-800 flex items-center justify-center mb-2 shadow-inner">
                    <img src={p.dataUrl} alt={`Page ${p.pageNumber}`} className="max-h-full max-w-full object-contain" />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {isAr ? `صفحة ${p.pageNumber}` : `Page ${p.pageNumber}`}
                    </span>
                    <a
                      href={p.dataUrl}
                      download={`${pdfFile ? pdfFile.name.replace(/\.[^/.]+$/, '') : 'doc'}_page_${p.pageNumber}.${format === 'jpeg' ? 'jpg' : 'png'}`}
                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{isAr ? 'استخراج مباشر عالي الدقة' : 'High quality PDF rasterization'}</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> {isAr ? 'جاهز' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
