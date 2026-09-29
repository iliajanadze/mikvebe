import React from 'react';

interface AdsterraBannerProps {
  className?: string;
}

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({ className = '' }) => {
  const adHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 728px;
      height: 90px;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '1eddf56bb67d3c71c68b913229ef9f07',
      'format' : 'iframe',
      'height' : 90,
      'width' : 728,
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://www.highrevenueformat.com/1eddf56bb67d3c71c68b913229ef9f07/invoke.js"></script>
</body>
</html>`;

  return (
    <div className={`w-full flex flex-col items-center justify-center my-6 sm:my-8 px-2 ${className}`}>
      {/* Label */}
      <div className="flex items-center gap-1.5 mb-1.5 text-[10px] uppercase font-bold tracking-wider text-stone-400 dark:text-stone-500 select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500/70" />
        <span>რეკლამა / Advertisement</span>
      </div>

      {/* Responsive Wrapper for 728x90 Banner */}
      <div className="w-full max-w-[740px] flex items-center justify-center overflow-x-auto no-scrollbar rounded-2xl bg-stone-100/80 dark:bg-stone-850/80 border border-stone-200/90 dark:border-stone-800 p-1.5 shadow-xs">
        <div className="w-[728px] h-[90px] shrink-0 overflow-hidden flex items-center justify-center">
          <iframe
            title="Adsterra Advertisement"
            width="728"
            height="90"
            scrolling="no"
            srcDoc={adHtml}
            className="w-[728px] h-[90px] border-0 overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
};
