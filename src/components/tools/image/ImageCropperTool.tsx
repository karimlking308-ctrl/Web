import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Upload, Download, RotateCcw, Crop, Check } from 'lucide-react';

export const ImageCropperTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image');
  const [imgDims, setImgDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [cropBox, setCropBox] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [aspectPreset, setAspectPreset] = useState<string>('free');

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
        setImgDims({ w: img.width, h: img.height });
        // Initial center crop 80%
        const initialW = Math.round(img.width * 0.8);
        const initialH = Math.round(img.height * 0.8);
        const initialX = Math.round((img.width - initialW) / 2);
        const initialY = Math.round((img.height - initialH) / 2);
        const initBox = { x: initialX, y: initialY, w: initialW, h: initialH };
        setCropBox(initBox);
        applyCrop(src, initBox);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const applyCrop = (src: string, box: { x: number; y: number; w: number; h: number }) => {
    if (!src || box.w <= 0 || box.h <= 0) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = box.w;
      canvas.height = box.h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h);
        setCroppedUrl(canvas.toDataURL('image/png'));
      }
    };
    img.src = src;
  };

  const handlePresetSelect = (preset: string) => {
    setAspectPreset(preset);
    if (!imgDims.w || !imgDims.h) return;

    let targetRatio = 1;
    if (preset === '1:1') targetRatio = 1;
    else if (preset === '16:9') targetRatio = 16 / 9;
    else if (preset === '4:3') targetRatio = 4 / 3;
    else if (preset === '9:16') targetRatio = 9 / 16;
    else return;

    let newW = imgDims.w;
    let newH = Math.round(newW / targetRatio);

    if (newH > imgDims.h) {
      newH = imgDims.h;
      newW = Math.round(newH * targetRatio);
    }

    const newX = Math.max(0, Math.round((imgDims.w - newW) / 2));
    const newY = Math.max(0, Math.round((imgDims.h - newH) / 2));
    const newBox = { x: newX, y: newY, w: newW, h: newH };
    setCropBox(newBox);
    if (imageSrc) applyCrop(imageSrc, newBox);
  };

  const handleBoxChange = (key: 'x' | 'y' | 'w' | 'h', val: number) => {
    const updated = { ...cropBox, [key]: Math.max(0, val) };
    setCropBox(updated);
    if (imageSrc) applyCrop(imageSrc, updated);
  };

  const handleReset = () => {
    setImageSrc(null);
    setCroppedUrl(null);
    setImgDims({ w: 0, h: 0 });
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
            <Crop className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
            {isAr ? 'اختر صورة لقصها وتعديل أبعادها' : 'Choose an image to crop and trim'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isAr ? 'نسب قص جاهزة (1:1، 16:9، 4:3) أو تحديد حر' : 'Square, widescreen 16:9, or custom freeform crop'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Crop className="w-4 h-4 text-blue-600" />
                {isAr ? 'إعدادات القص' : 'Crop Controls'}
              </h4>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isAr ? 'تغيير الصورة' : 'Change Image'}
              </button>
            </div>

            {/* Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                {isAr ? 'نسب الأبعاد الجاهزة:' : 'Aspect Ratio Presets:'}
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                {[
                  { id: 'free', label: isAr ? 'حر' : 'Free' },
                  { id: '1:1', label: '1:1 (Square)' },
                  { id: '16:9', label: '16:9' },
                  { id: '4:3', label: '4:3' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePresetSelect(p.id)}
                    className={`py-2 text-center rounded-xl border font-bold text-xs transition ${
                      aspectPreset === p.id
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Precise Dimensions Inputs */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {isAr ? 'العرض (W)' : 'Width (px)'}
                  </label>
                  <input
                    type="number"
                    value={cropBox.w}
                    onChange={(e) => handleBoxChange('w', parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {isAr ? 'الارتفاع (H)' : 'Height (px)'}
                  </label>
                  <input
                    type="number"
                    value={cropBox.h}
                    onChange={(e) => handleBoxChange('h', parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {isAr ? 'الإزاحة من اليسار (X)' : 'Offset X (px)'}
                  </label>
                  <input
                    type="number"
                    value={cropBox.x}
                    onChange={(e) => handleBoxChange('x', parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {isAr ? 'الإزاحة من الأعلى (Y)' : 'Offset Y (px)'}
                  </label>
                  <input
                    type="number"
                    value={cropBox.y}
                    onChange={(e) => handleBoxChange('y', parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={croppedUrl || '#'}
                download={`${fileName}_cropped_${cropBox.w}x${cropBox.h}.png`}
                className="w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition shadow-md hover:shadow-lg cursor-pointer"
              >
                <Download className="w-5 h-5" />
                {isAr ? 'تحميل الصورة المقصوصة' : 'Download Cropped Image'}
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isAr ? 'معاينة نتيجة القص' : 'Cropped Output Preview'}
              </span>
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                {cropBox.w} × {cropBox.h} px
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/80 rounded-xl overflow-hidden min-h-[300px] max-h-[460px]">
              {croppedUrl && (
                <img
                  src={croppedUrl}
                  alt="Cropped output"
                  className="max-h-[420px] max-w-full object-contain rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
                />
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{isAr ? 'أبعاد أصلية:' : 'Original:'} {imgDims.w} × {imgDims.h} px</span>
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
