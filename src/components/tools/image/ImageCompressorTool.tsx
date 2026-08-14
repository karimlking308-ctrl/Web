import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Upload, Download, RotateCcw, Sliders, Check, Zap, Image as ImageIcon } from 'lucide-react';

export const ImageCompressorTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image');
  const [originalSizeBytes, setOriginalSizeBytes] = useState<number>(0);
  const [compressedSizeBytes, setCompressedSizeBytes] = useState<number>(0);
  const [quality, setQuality] = useState<number>(75);
  const [format, setFormat] = useState<'jpeg' | 'webp'>('jpeg');
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalSizeBytes(file.size);
    setFileName(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      compressImage(src, quality, format);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (src: string, q: number, fmt: 'jpeg' | 'webp') => {
    if (!src) return;
    setIsCompressing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const mime = `image/${fmt}`;
        const dataUrl = canvas.toDataURL(mime, q / 100);
        setCompressedUrl(dataUrl);

        // Calculate compressed size in bytes from base64
        const head = `data:${mime};base64,`;
        const base64Str = dataUrl.substring(head.length);
        const approxBytes = Math.round((base64Str.length * 3) / 4);
        setCompressedSizeBytes(approxBytes);
      }
      setIsCompressing(false);
    };
    img.src = src;
  };

  useEffect(() => {
    if (imageSrc) {
      const timer = setTimeout(() => {
        compressImage(imageSrc, quality, format);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [quality, format]);

  const savedPercent =
    originalSizeBytes > 0 && compressedSizeBytes > 0
      ? Math.max(0, Math.round(((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100))
      : 0;

  const handleReset = () => {
    setImageSrc(null);
    setCompressedUrl(null);
    setOriginalSizeBytes(0);
    setCompressedSizeBytes(0);
    setQuality(75);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-slate-800/60 rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 group shadow-sm hover:shadow"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
            {isAr ? 'اختر صورة لضغطها أو اسحبها هنا' : 'Choose an image to compress or drag & drop'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isAr ? 'يدعم صيغ JPG, PNG, WEBP حتى 50 ميغابايت' : 'Supports JPG, PNG, WEBP up to 50MB'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                {isAr ? 'إعدادات الضغط' : 'Compression Settings'}
              </h4>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isAr ? 'تغيير الصورة' : 'Change Image'}
              </button>
            </div>

            {/* Savings Badge */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 block">
                  {isAr ? 'نسبة توفير المساحة' : 'Space Saved'}
                </span>
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {savedPercent}%
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 line-through">{formatFileSize(originalSizeBytes)}</div>
                <div className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-300">
                  {formatFileSize(compressedSizeBytes)}
                </div>
              </div>
            </div>

            {/* Quality Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>{isAr ? 'جودة الصورة' : 'Image Quality'}</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                step="5"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>{isAr ? 'أقصى ضغط' : 'Smallest Size (10%)'}</span>
                <span>{isAr ? 'توازن مثالي' : 'Balanced (75%)'}</span>
                <span>{isAr ? 'أعلى جودة' : 'High Quality (95%)'}</span>
              </div>
            </div>

            {/* Target Format */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                {isAr ? 'صيغة الضغط' : 'Compression Output Format'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['jpeg', 'webp'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormat(fmt)}
                    className={`py-2.5 text-xs font-bold uppercase rounded-xl border transition ${
                      format === fmt
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {fmt} {fmt === 'webp' ? (isAr ? '(أخف وزناً)' : '(Ultra Light)') : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Download CTA */}
            <div className="pt-2">
              <a
                href={compressedUrl || '#'}
                download={`${fileName}_compressed_q${quality}.${format}`}
                className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md ${
                  compressedUrl && !isCompressing
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-lg'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Download className="w-5 h-5" />
                {isAr ? 'تحميل الصورة المضغوطة' : 'Download Compressed Image'}
              </a>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isAr ? 'معاينة المقارنة' : 'Live Compressed Output'}
              </span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                {formatFileSize(compressedSizeBytes)} ({savedPercent}% saved)
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/80 rounded-xl overflow-hidden min-h-[300px] max-h-[460px]">
              {compressedUrl ? (
                <img
                  src={compressedUrl}
                  alt="Compressed preview"
                  className="max-h-[420px] max-w-full object-contain rounded-lg shadow-sm"
                />
              ) : (
                <div className="text-slate-400 flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 animate-pulse" />
                  <span>{isCompressing ? (isAr ? 'جاري الضغط...' : 'Compressing...') : ''}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                {isAr ? 'معالجة مباشرة بذاكرة المتصفح' : 'Instant local browser engine'}
              </span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> {isAr ? 'تم التحسين' : 'Optimized'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
