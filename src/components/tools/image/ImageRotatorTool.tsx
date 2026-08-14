import React, { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { Upload, Download, RotateCcw, RotateCw, RefreshCw, Check } from 'lucide-react';

export const ImageRotatorTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image');
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [rotatedUrl, setRotatedUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      processTransform(src, 0, false, false);
    };
    reader.readAsDataURL(file);
  };

  const processTransform = (src: string, deg: number, fh: boolean, fv: boolean) => {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const rad = (deg * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));

      canvas.width = Math.round(img.width * cos + img.height * sin);
      canvas.height = Math.round(img.width * sin + img.height * cos);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rad);
        ctx.scale(fh ? -1 : 1, fv ? -1 : 1);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        setRotatedUrl(canvas.toDataURL('image/png'));
      }
    };
    img.src = src;
  };

  const handleRotate = (angleChange: number) => {
    const next = (rotation + angleChange + 360) % 360;
    setRotation(next);
    if (imageSrc) processTransform(imageSrc, next, flipH, flipV);
  };

  const handleFlipHorizontal = () => {
    const next = !flipH;
    setFlipH(next);
    if (imageSrc) processTransform(imageSrc, rotation, next, flipV);
  };

  const handleFlipVertical = () => {
    const next = !flipV;
    setFlipV(next);
    if (imageSrc) processTransform(imageSrc, rotation, flipH, next);
  };

  const handleReset = () => {
    setImageSrc(null);
    setRotatedUrl(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
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
            <RotateCw className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
            {isAr ? 'اختر صورة لتدويرها أو قلبها' : 'Choose an image to rotate or flip'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isAr ? 'تدوير 90°، 180°، 270° وقلب أفقي ورأسي' : 'Rotate 90°, 180°, 270°, and mirror flip'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-blue-600" />
                {isAr ? 'أدوات التدوير والقلب' : 'Rotation & Flip Tools'}
              </h4>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isAr ? 'تغيير الصورة' : 'Change Image'}
              </button>
            </div>

            {/* Rotation Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                {isAr ? 'تدوير الزوايا:' : 'Rotate Angles:'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRotate(90)}
                  className="py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <RotateCw className="w-4 h-4 text-blue-600" />
                  {isAr ? 'تدوير +90° لليمين' : 'Rotate +90° Right'}
                </button>
                <button
                  type="button"
                  onClick={() => handleRotate(-90)}
                  className="py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <RotateCcw className="w-4 h-4 text-blue-600" />
                  {isAr ? 'تدوير -90° لليسار' : 'Rotate -90° Left'}
                </button>
              </div>
            </div>

            {/* Flip Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                {isAr ? 'قلب وعكس الاتجاه:' : 'Flip & Mirror:'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleFlipHorizontal}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    flipH
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  {isAr ? 'قلب أفقي (مرآة)' : 'Flip Horizontal'}
                </button>
                <button
                  type="button"
                  onClick={handleFlipVertical}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    flipV
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <RefreshCw className="w-4 h-4 rotate-90" />
                  {isAr ? 'قلب رأسي' : 'Flip Vertical'}
                </button>
              </div>
            </div>

            {/* Current status */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-400 flex justify-between font-mono">
              <span>{isAr ? 'الزاوية الحالية:' : 'Current Rotation:'} {rotation}°</span>
              <span>{flipH ? (isAr ? 'مرآة' : 'Flipped-H') : ''} {flipV ? (isAr ? 'رأسي' : 'Flipped-V') : ''}</span>
            </div>

            <div className="pt-2">
              <a
                href={rotatedUrl || '#'}
                download={`${fileName}_rotated_${rotation}deg.png`}
                className="w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition shadow-md hover:shadow-lg cursor-pointer"
              >
                <Download className="w-5 h-5" />
                {isAr ? 'تحميل الصورة المعدلة' : 'Download Rotated Image'}
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isAr ? 'معاينة الاتجاه' : 'Transformed Preview'}
              </span>
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                {rotation}°
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/80 rounded-xl overflow-hidden min-h-[300px] max-h-[460px]">
              {rotatedUrl && (
                <img
                  src={rotatedUrl}
                  alt="Rotated preview"
                  className="max-h-[420px] max-w-full object-contain rounded-lg shadow-sm"
                />
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{isAr ? 'معالجة مباشرة ودقة أصلية' : 'Preserves full image resolution'}</span>
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
