import React, { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { jsPDF } from 'jspdf';
import { Upload, Download, RotateCcw, Trash2, ArrowUp, ArrowDown, FileText, Check, Plus } from 'lucide-react';

interface ImageItem {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
}

export const JpgToPdfTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'p' | 'l'>('p');
  const [margin, setMargin] = useState<'none' | 'small' | 'normal'>('small');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [pdfDataUri, setPdfDataUri] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const src = (event.target?.result as string) || '';
        const img = new Image();
        img.onload = () => {
          setImages((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(2, 9),
              name: file.name,
              dataUrl: src,
              width: img.width,
              height: img.height,
            },
          ]);
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((item) => item.id !== id));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newArr = [...images];
    const temp = newArr[index];
    newArr[index] = newArr[targetIndex];
    newArr[targetIndex] = temp;
    setImages(newArr);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: pageSize === 'fit' ? 'a4' : pageSize,
      });

      const marginMap = {
        none: 0,
        small: 10,
        normal: 20,
      };
      const m = marginMap[margin];

      images.forEach((img, idx) => {
        if (idx > 0) {
          doc.addPage(pageSize === 'fit' ? 'a4' : pageSize, orientation);
        }

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const availWidth = pageWidth - m * 2;
        const availHeight = pageHeight - m * 2;

        const imgRatio = img.width / img.height;
        const boxRatio = availWidth / availHeight;

        let renderW = availWidth;
        let renderH = availHeight;

        if (imgRatio > boxRatio) {
          renderW = availWidth;
          renderH = availWidth / imgRatio;
        } else {
          renderH = availHeight;
          renderW = availHeight * imgRatio;
        }

        const renderX = m + (availWidth - renderW) / 2;
        const renderY = m + (availHeight - renderH) / 2;

        doc.addImage(img.dataUrl, 'JPEG', renderX, renderY, renderW, renderH);
      });

      const pdfBlob = doc.output('blob') as Blob;
      const blobUrl = URL.createObjectURL(pdfBlob);
      setPdfDataUri(blobUrl);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setImages([]);
    setPdfDataUri(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {images.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-400 bg-white dark:bg-slate-800/60 rounded-2xl p-10 text-center cursor-pointer transition-all group shadow-sm hover:shadow"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
            {isAr ? 'اختر صورة واحدة أو أكثر لإنشاء مستند PDF' : 'Select images to convert into a single PDF'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isAr ? 'يدعم JPG و PNG و WEBP مع إمكانية ترتيب الصفحات' : 'Supports JPG, PNG, and WEBP with custom page ordering'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Settings Column */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-600" />
                {isAr ? 'إعدادات مستند PDF' : 'PDF Document Settings'}
              </h4>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isAr ? 'مسح الكل' : 'Clear All'}
              </button>
            </div>

            {/* Page Size */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                {isAr ? 'حجم الصفحة:' : 'Page Size:'}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['a4', 'letter', 'fit'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setPageSize(sz)}
                    className={`py-2 text-center rounded-xl border font-bold uppercase transition ${
                      pageSize === sz
                        ? 'bg-red-600 border-red-600 text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {sz === 'fit' ? (isAr ? 'تلقائي' : 'Auto Fit') : sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                {isAr ? 'اتجاه الصفحة:' : 'Page Orientation:'}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setOrientation('p')}
                  className={`py-2.5 rounded-xl border font-bold transition ${
                    orientation === 'p'
                      ? 'bg-red-600 border-red-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isAr ? 'طولي (Portrait)' : 'Portrait'}
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation('l')}
                  className={`py-2.5 rounded-xl border font-bold transition ${
                    orientation === 'l'
                      ? 'bg-red-600 border-red-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isAr ? 'عرضي (Landscape)' : 'Landscape'}
                </button>
              </div>
            </div>

            {/* Margins */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                {isAr ? 'الهوامش:' : 'Page Margins:'}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'none', label: isAr ? 'بدون' : 'No Margin' },
                  { id: 'small', label: isAr ? 'صغيرة' : 'Small' },
                  { id: 'normal', label: isAr ? 'عادية' : 'Normal' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMargin(m.id as any)}
                    className={`py-2 rounded-xl border font-semibold text-xs transition ${
                      margin === m.id
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Add More Images Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                {isAr ? 'إضافة صور أخرى' : 'Add More Images'}
              </button>
            </div>

            {/* Generate & Download CTA */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={generatePdf}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white transition shadow-md hover:shadow-lg cursor-pointer"
              >
                <FileText className="w-5 h-5" />
                {isGenerating
                  ? isAr
                    ? 'جاري إنشاء المستند...'
                    : 'Generating PDF...'
                  : isAr
                  ? `إنشاء ملف PDF (${images.length} صفحة)`
                  : `Create PDF (${images.length} Pages)`}
              </button>

              {pdfDataUri && (
                <a
                  href={pdfDataUri}
                  download="soltools_document.pdf"
                  className="w-full py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white transition shadow cursor-pointer text-sm"
                >
                  <Download className="w-4 h-4" />
                  {isAr ? 'تحميل ملف PDF الآن' : 'Download Generated PDF'}
                </a>
              )}
            </div>
          </div>

          {/* Images Page List */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isAr ? `صفحات المستند (${images.length})` : `Document Pages (${images.length})`}
              </span>
              <span className="text-xs text-slate-400">
                {isAr ? 'استخدم الأسهم لإعادة الترتيب' : 'Use arrows to reorder pages'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative group border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 p-2 flex flex-col justify-between"
                >
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-white dark:bg-slate-800 flex items-center justify-center mb-2">
                    <img src={img.dataUrl} alt={img.name} className="max-h-full max-w-full object-contain" />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-md font-mono text-[11px]">
                      #{idx + 1}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveImage(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(idx, 'down')}
                        disabled={idx === images.length - 1}
                        className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{isAr ? 'يتم الإنشاء مباشرة في المتصفح' : 'Rendered locally via jsPDF'}</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> {isAr ? 'جاهز للتجميع' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
