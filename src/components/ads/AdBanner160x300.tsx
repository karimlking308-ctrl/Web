import React from 'react';
import { useApp } from '../../context/AppContext';

interface AdBanner160x300Props {
  className?: string;
}

export const AdBanner160x300: React.FC<AdBanner160x300Props> = ({ className = '' }) => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  return (
    <div
      className={`hidden lg:flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden ${className}`}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 select-none">
        {isAr ? 'إعلان' : 'Sponsor'}
      </span>
      <div className="w-[160px] h-[300px] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800/80">
        <iframe
          title="Advertisement"
          width={160}
          height={300}
          className="w-[160px] h-[300px] border-0 overflow-hidden"
          scrolling="no"
          srcDoc={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 160px;
      height: 300px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '0385c1534046cbeed66f1be30fb9c4dd',
      'format' : 'iframe',
      'height' : 300,
      'width' : 160,
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://www.highperformanceformat.com/0385c1534046cbeed66f1be30fb9c4dd/invoke.js"></script>
</body>
</html>`}
        />
      </div>
    </div>
  );
};
