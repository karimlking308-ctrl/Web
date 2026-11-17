import React from 'react';

interface ToolAdBannerProps {
  variant: 'top' | 'bottom';
}

export const ToolAdBanner: React.FC<ToolAdBannerProps> = ({ variant }) => {
  const isTop = variant === 'top';
  const key = isTop
    ? '733f37d5b3e5b35fd0302daa53c1798c'
    : 'ba7702fb84b056f6daf905b1af53674f';
  const width = isTop ? 320 : 300;
  const height = isTop ? 50 : 250;
  const margin = isTop ? '12px auto' : '20px auto';

  const srcDoc = `<!DOCTYPE html><html><body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;overflow:hidden;background:transparent;"><script>atOptions={'key':'${key}','format':'iframe','height':${height},'width':${width},'params':{}};</script><script src="https://bauval.org/22/${key}"></script></body></html>`;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        margin,
        maxWidth: '100%',
        overflow: 'hidden',
      }}
    >
      <iframe
        title={isTop ? 'Tool top banner 320x50' : 'Tool bottom banner 300x250'}
        srcDoc={srcDoc}
        width={width}
        height={height}
        scrolling="no"
        style={{
          border: 'none',
          width: `${width}px`,
          height: `${height}px`,
          maxWidth: '100%',
          display: 'block',
        }}
      />
    </div>
  );
};
