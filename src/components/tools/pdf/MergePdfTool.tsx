import React, { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { PDFDocument } from 'pdf-lib';
import { Upload, Download, RotateCcw, Trash2, ArrowUp, ArrowDown, Layers, Check, Plus, FileText } from 'lucide-react';

interface PdfFileItem {
  id: string;
  name: string;
  size: number;
  arrayBuffer: ArrayBuffer;
  pageCount: number;
}

export const MergePdfTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newItems: PdfFileItem[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const f = selectedFiles[i];
      const buffer = await f.arrayBuffer();
      try {
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          name: f.name,
          size: f.size,
          arrayBuffer: buffer,
          pageCount: doc.getPageCount(),
        });
      } catch (err) {
        console.error('Error loading PDF:', err);
      }
    }

    setFiles((prev) => [...prev, ...newItems]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= files.length) return;

    const newArr = [...files];
    const temp = newArr[index];
    newArr[index] = newArr[target];
    newArr[target] = temp;
    setFiles(newArr);
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setIsMerging(true);

    try {
      const mergedDoc = await PDFDocument.create();

      for (const item of files) {
        const srcDoc = await PDFDocument.load(item.arrayBuffer);
        const copiedPages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((page) => mergedDoc.addPage(page));
      }

      const mergedPdfBytes = await mergedDoc.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
    } catch (err) {
      console.error('Failed to merge PDFs:', err);
    } finally {
      setIsMerging(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setMergedPdfUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const totalPages = files.reduce((acc, curr) => acc + curr.pageCount, 0);

  return (
    <div className="space-y-6">
      {files.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-400 bg-white dark:bg-slate-800/60 rounded-2xl p-10 text-center cursor-pointer transition-all group shadow-sm hover:shadow"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
            {isAr ? 'اختر ملفات PDF لدمجها في ملف واحد' : 'Select PDF files to merge together'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isAr ? 'حدد ملفين أو أكثر للدمج الفوري في المتصفح' : 'Combine 2 or more PDF documents instantly in your browser'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Actions */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-600" />
                {isAr ? 'ملخص الدمج' : 'Merge Summary'}
              </h4>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isAr ? 'مسح الكل' : 'Clear All'}
              </button>
            </div>

            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-xs text-red-800 dark:text-red-300 font-semibold">
                <span>{isAr ? 'عدد المستندات:' : 'Total Documents:'}</span>
                <span className="font-mono text-sm font-bold">{files.length}</span>
              </div>
              <div className="flex justify-between text-xs text-red-800 dark:text-red-300 font-semibold">
                <span>{isAr ? 'إجمالي الصفحات الناتجة:' : 'Total Output Pages:'}</span>
                <span className="font-mono text-sm font-bold">{totalPages} {isAr ? 'صفحة' : 'Pages'}</span>
              </div>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {isAr ? 'إضافة ملفات PDF أخرى' : 'Add More PDF Files'}
              </button>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={mergePdfs}
                disabled={files.length < 2 || isMerging}
                className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md ${
                  files.length >= 2 && !isMerging
                    ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer hover:shadow-lg'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Layers className="w-5 h-5" />
                {isMerging
                  ? isAr
                    ? 'جاري الدمج...'
                    : 'Merging PDFs...'
                  : isAr
                  ? `دمج المستندات (${files.length} ملفات)`
                  : `Merge (${files.length} Documents)`}
              </button>

              {mergedPdfUrl && (
                <a
                  href={mergedPdfUrl}
                  download="quickkit_merged.pdf"
                  className="w-full py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white transition shadow cursor-pointer text-sm"
                >
                  <Download className="w-4 h-4" />
                  {isAr ? 'تحميل المستند المدمج' : 'Download Merged PDF'}
                </a>
              )}
            </div>
          </div>

          {/* Files List */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isAr ? 'ترتيب تسلسل الملفات' : 'Document Sequence Order'}
              </span>
              <span className="text-xs text-slate-400">
                {isAr ? 'استخدم الأسهم لتحديد الترتيب' : 'Use arrows to arrange sequence'}
              </span>
            </div>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {files.map((file, idx) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-300 font-bold text-xs flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[200px] sm:max-w-[280px]">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {file.pageCount} {isAr ? 'صفحة' : 'pages'} • {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveFile(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveFile(idx, 'down')}
                      disabled={idx === files.length - 1}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{isAr ? 'دمج محلي بالكامل دون اتصال خادم' : '100% Client-side local merge'}</span>
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
