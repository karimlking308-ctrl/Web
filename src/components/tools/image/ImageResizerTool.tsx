import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Upload, Download, RotateCcw, Lock, Unlock, Image as ImageIcon, Sliders, Check } from 'lucide-react';

export const ImageResizerTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image');
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(true);
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [resizedDataUrl, setResizedDataUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);

      const img = new Image();
      img.onload = () => {
        setOrigWidth(img.width);
        setOrigHeight(img.height);
        setWidth(img.width);
        setHeight(img.height);
        setScalePercent(100);
        processResize(src, img.width, img.height, format);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (maintainAspect && origWidth > 0) {
      const newH = Math.round((val / origWidth) * origHeight);
      setHeight(newH);
      setScalePercent(Math.round((val / origWidth) * 100));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (maintainAspect && origHeight > 0) {
      const newW = Math.round((val / origHeight) * origWidth);
      setWidth(newW);
      setScalePercent(Math.round((newW / origWidth) * 100));
    }
  };

  const handleScaleChange = (percent: number) => {
    setScalePercent(percent);
    if (origWidth > 0 && origHeight > 0) {
      setWidth(Math.round((origWidth * percent) / 100));
      setHeight(Math.round((origHeight * percent) / 100));
    }
  };

  const processResize = (src: string, targetW: number, targetH: number, targetFmt: string) => {
    if (!src || targetW <= 0 || targetH <= 0) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetW, targetH);
        const mime = `image/${targetFmt}`;
        const dataUrl = canvas.toDataURL(mime, 0.92);
        setResizedDataUrl(dataUrl);
      }
      setIsProcessing(false);
    };
    img.src = src;
  };

  useEffect(() => {
    if (imageSrc && width > 0 && height > 0) {
      const timer = setTimeout(() => {
        processResize(imageSrc, width, height, format);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [width, height, format]);

  const handleReset = () => {
    setImageSrc(null);
    setResizedDataUrl(null);
    setOrigWidth(0);
    setOrigHeight(0);
    setWidth(0);
    setHeight(0);
    setScalePercent(100);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-slate-800/60 rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 group shadow-sm hover:shadow"
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
            {isAr ? 'اختر صورة من جهازك أو اسحبها هنا' : 'Choose an image or drag & drop here'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isAr ? 'يدعم صيغ PNG, JPG, WEBP, GIF حتى 50 ميغابايت' : 'Supports PNG, JPG, WEBP, GIF up to 50MB'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                {isAr ? 'إعدادات الأبعاد' : 'Resize Settings'}
              </h4>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isAr ? 'تغيير الصورة' : 'Change Image'}
              </button>
            </div>

            {/* Original Info */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-400 flex justify-between">
              <span>{isAr ? 'الأبعاد الأصلية:' : 'Original Size:'}</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">
                {origWidth} × {origHeight} px
              </span>
            </div>

            {/* Dimension Inputs */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {isAr ? 'العرض (بكسل)' : 'Width (px)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={width || ''}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {isAr ? 'الارتفاع (بكسل)' : 'Height (px)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={height || ''}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Maintain Aspect Ratio Toggle */}
              <button
                type="button"
                onClick={() => setMaintainAspect(!maintainAspect)}
                className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  maintainAspect
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {maintainAspect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                {isAr ? 'الحفاظ على تناسب الأبعاد' : 'Maintain Aspect Ratio'}
              </button>

              {/* Scale Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold">
                  <span>{isAr ? 'نسبة التحجيم' : 'Scale Percentage'}</span>
                  <span className="font-mono">{scalePercent}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  value={scalePercent}
                  onChange={(e) => handleScaleChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>25%</span>
                  <span>50%</span>
                  <span>100%</span>
                  <span>150%</span>
                  <span>200%</span>
                </div>
              </div>

              {/* Preset Buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  {isAr ? 'أبعاد جاهزة سريعة' : 'Quick Dimension Presets'}
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                  {[
                    { label: 'HD 720p', w: 1280, h: 720 },
                    { label: 'FHD 1080p', w: 1920, h: 1080 },
                    { label: '4K UHD', w: 3840, h: 2160 },
                    { label: 'Square 1:1', w: 1080, h: 1080 },
                    { label: 'Story 9:16', w: 1080, h: 1920 },
                    { label: 'Post 4:5', w: 1080, h: 1350 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setWidth(p.w);
                        setHeight(p.h);
                        setMaintainAspect(false);
                      }}
                      className="py-1.5 px-2 bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/40 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-center hover:border-blue-400 transition"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Output Format */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  {isAr ? 'صيغة الحفظ' : 'Output Format'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFormat(fmt)}
                      className={`py-2 text-xs font-bold uppercase rounded-xl border transition ${
                        format === fmt
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <a
                href={resizedDataUrl || '#'}
                download={`${fileName}_resized_${width}x${height}.${format}`}
                className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md ${
                  resizedDataUrl && !isProcessing
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-lg'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Download className="w-5 h-5" />
                {isAr ? 'تحميل الصورة المعدلة' : 'Download Resized Image'}
              </a>
            </div>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isAr ? 'المعاينة الحية' : 'Live Preview'}
              </span>
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                {width} × {height} px ({format.toUpperCase()})
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/80 rounded-xl overflow-hidden min-h-[300px] max-h-[460px]">
              {resizedDataUrl ? (
                <img
                  src={resizedDataUrl}
                  alt="Resized preview"
                  className="max-h-[420px] max-w-full object-contain rounded-lg shadow-sm"
                />
              ) : (
                <div className="text-slate-400 flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 animate-pulse" />
                  <span>{isProcessing ? (isAr ? 'جاري المعالجة...' : 'Processing...') : ''}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{isAr ? 'معالجة محلية 100% بدون خوادم' : '100% Private local browser scaling'}</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> {isAr ? 'جاهز للتحميل' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
