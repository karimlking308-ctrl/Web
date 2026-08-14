import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, Sliders, RefreshCw, Link as LinkIcon, Mail, Phone, Wifi } from 'lucide-react';

export const QrCodeGeneratorTool: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [qrType, setQrType] = useState<'url' | 'text' | 'wifi' | 'email'>('url');
  const [content, setContent] = useState<string>('https://sol-pump.store');
  const [fgColor, setFgColor] = useState<string>('#1e293b');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [qrSize, setQrSize] = useState<number>(360);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // WiFi helper state
  const [wifiSsid, setWifiSsid] = useState<string>('MyHomeWiFi');
  const [wifiPass, setWifiPass] = useState<string>('password123');
  const [wifiType, setWifiType] = useState<string>('WPA');

  // Email helper state
  const [emailTo, setEmailTo] = useState<string>('hello@example.com');
  const [emailSubject, setEmailSubject] = useState<string>('Inquiry');

  const generateQr = async (text: string, fg: string, bg: string, size: number) => {
    if (!text.trim()) {
      setQrDataUrl('');
      return;
    }
    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: {
          dark: fg,
          light: bg,
        },
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const getEffectivePayload = (): string => {
    if (qrType === 'wifi') {
      return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPass};;`;
    }
    if (qrType === 'email') {
      return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}`;
    }
    return content;
  };

  useEffect(() => {
    const payload = getEffectivePayload();
    generateQr(payload, fgColor, bgColor, qrSize);
  }, [qrType, content, wifiSsid, wifiPass, wifiType, emailTo, emailSubject, fgColor, bgColor, qrSize]);

  const handleCopyImage = async () => {
    if (!qrDataUrl) return;
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Fallback text copy
      navigator.clipboard.writeText(getEffectivePayload());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Type Selector */}
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        {[
          { id: 'url', label: isAr ? 'رابط ويب URL' : 'Website URL', icon: LinkIcon },
          { id: 'text', label: isAr ? 'نص حر' : 'Plain Text', icon: QrCode },
          { id: 'wifi', label: isAr ? 'شبكة واي فاي WiFi' : 'WiFi Network', icon: Wifi },
          { id: 'email', label: isAr ? 'بريد إلكتروني Email' : 'Email Message', icon: Mail },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setQrType(item.id as any);
                if (item.id === 'url' && !content.startsWith('http')) setContent('https://example.com');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                qrType === item.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings & Input Column */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-purple-600" />
              {isAr ? 'بيانات ومحتوى رمز QR' : 'QR Content & Information'}
            </h4>
          </div>

          {/* Dynamic Input based on Type */}
          {qrType === 'url' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isAr ? 'رابط الموقع (URL):' : 'Destination URL:'}
              </label>
              <input
                type="url"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          )}

          {qrType === 'text' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isAr ? 'النص المطلوب ترميزه:' : 'Text to encode:'}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="Type any message..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          )}

          {qrType === 'wifi' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? 'اسم شبكة الواي فاي (SSID):' : 'Network Name (SSID):'}
                </label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? 'كلمة المرور (Password):' : 'Password:'}
                </label>
                <input
                  type="text"
                  value={wifiPass}
                  onChange={(e) => setWifiPass(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          )}

          {qrType === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? 'عنوان البريد الإلكتروني:' : 'Recipient Email:'}
                </label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? 'موضوع الرسالة:' : 'Subject Line:'}
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Color & Size Customization */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {isAr ? 'لون الرمز (Foreground):' : 'QR Color:'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {isAr ? 'لون الخلفية (Background):' : 'Background:'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {isAr ? 'الحجم (Resolution):' : 'Size (px):'}
              </label>
              <select
                value={qrSize}
                onChange={(e) => setQrSize(parseInt(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              >
                <option value={240}>240 x 240 px</option>
                <option value={360}>360 x 360 px (HD)</option>
                <option value={512}>512 x 512 px (Ultra)</option>
              </select>
            </div>
          </div>
        </div>

        {/* QR Preview & Download Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isAr ? 'معاينة رمز QR' : 'Live QR Preview'}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700/50">
            {qrDataUrl ? (
              <div className="p-4 bg-white rounded-2xl shadow-md">
                <img src={qrDataUrl} alt="Generated QR" className="w-48 h-48 sm:w-56 sm:h-56 object-contain" />
              </div>
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                {isAr ? 'أدخل نصاً لتوليد الرمز' : 'Enter content to preview'}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <a
              href={qrDataUrl || '#'}
              download="soltools_qrcode.png"
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <Download className="w-5 h-5" />
              {isAr ? 'تحميل كصورة PNG' : 'Download PNG Image'}
            </a>

            <button
              type="button"
              onClick={handleCopyImage}
              className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition cursor-pointer text-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? (isAr ? 'تم نسخ الرمز!' : 'Copied!') : (isAr ? 'نسخ إلى الحافظة' : 'Copy to Clipboard')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
