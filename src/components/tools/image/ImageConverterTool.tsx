import React, { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { Upload, Download, RotateCcw, RefreshCw, Check } from 'lucide-react';

export const ImageConverterTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image');
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [convertedSize, setConvertedSize] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      convert(src, targetFormat, bgColor);
    };
    reader.readAsDataURL(file);
  };

  const convert = (src: string, fmt: 'png' | 'jpeg' | 'webp', bg: string) => {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (fmt === 'jpeg') {
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        const mime = `image/${fmt}`;
        const dataUrl = canvas.toDataURL(mime, 0.95);
        setConvertedUrl(dataUrl);

        const head = `data:${mime};base64,`;
        const base64Str = dataUrl.substring(head.length);
        setConvertedSize(Math.round((base64Str.length * 3) / 4));
      }
    };
    img.src = src;
  };

  const handleFormatChange = (fmt: 'png' | 'jpeg' | 'webp') => {
    setTargetFormat(fmt);
    if (imageSrc) convert(imageSrc, fmt, bgColor);
  };

  const handleReset = () => {
    setImageSrc(null);
    setConvertedUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-slate-800/60 rounded-2xl p-10 text-center cursor-pointer transition-all group shadow-sm hover:shadow"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
            {isAr ? 'اختر صورة لتحويل صيغتها' : 'Choose an image to convert format'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isAr ? 'تحويل بين PNG و JPG و WEBP بنقرة واحدة' : 'Convert between PNG, JPG, and WEBP seamlessly'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-600" />
                {isAr ? 'صيغة التحويل' : 'Target Format'}
              </h4>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isAr ? 'تغيير الصورة' : 'Change Image'}
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                {isAr ? 'اختر الصيغة المطلوبة:' : 'Select Target Format:'}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => handleFormatChange(fmt)}
                    className={`py-3 px-2 text-center rounded-xl border font-bold uppercase text-xs transition ${
                      targetFormat === fmt
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {fmt === 'jpeg' ? 'JPG' : fmt}
                  </button>
                ))}
              </div>
            </div>

            {targetFormat === 'jpeg' && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {isAr ? 'لون خلفية الصور الشفافة (عند التحويل إلى JPG):' : 'Background fill color (for transparent PNGs):'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => {
                      setBgColor(e.target.value);
                      if (imageSrc) convert(imageSrc, targetFormat, e.target.value);
                    }}
                    className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer p-0.5 bg-white"
                  />
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-400 uppercase">{bgColor}</span>
                </div>
              </div>
            )}

            <div className="pt-2">
              <a
                href={convertedUrl || '#'}
                download={`${fileName}.${targetFormat === 'jpeg' ? 'jpg' : targetFormat}`}
                className="w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition shadow-md hover:shadow-lg cursor-pointer"
              >
                <Download className="w-5 h-5" />
                {isAr ? `تحميل بصيغة ${targetFormat.toUpperCase()}` : `Download as ${targetFormat.toUpperCase()}`}
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isAr ? 'معاينة التحويل' : 'Converted Preview'}
              </span>
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                {targetFormat.toUpperCase()} ({(convertedSize / 1024).toFixed(1)} KB)
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/80 rounded-xl overflow-hidden min-h-[300px] max-h-[460px]">
              {convertedUrl && (
                <img
                  src={convertedUrl}
                  alt="Converted output"
                  className="max-h-[420px] max-w-full object-contain rounded-lg shadow-sm"
                />
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{isAr ? 'تحويل فوري بدون ضغط زائد' : 'High fidelity format converter'}</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> {isAr ? 'تم بنجاح' : 'Success'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
