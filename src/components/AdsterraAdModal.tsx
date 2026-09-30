import React from 'react';
import { X, Sparkles, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface AdsterraAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  clickStep: 1 | 2;
  onAdClicked: () => void;
}

export const AdsterraAdModal: React.FC<AdsterraAdModalProps> = ({
  isOpen,
  onClose,
  clickStep,
  onAdClicked,
}) => {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-stone-900 border-2 border-amber-500/80 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden text-stone-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>5 თვე უფასო VIP გააქტიურება</span>
              </div>
              <h3 className="font-serif-geo text-lg sm:text-xl font-extrabold">
                {clickStep === 1
                  ? 'ნაბიჯი 1/2: Adsterra-ს რეკლამა'
                  : 'ნაბიჯი 2/2: ბოლო ნაბიჯი VIP-ის გასააქტიურებლად!'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-center">
          {/* Progress Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-800 border border-stone-700 text-xs font-bold text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>
              {clickStep === 1
                ? 'დარჩა 1 კლიკი VIP-ის სრულად მისაღებად'
                : 'ბოლო კლიკი! დააჭირეთ და მიიღეთ 5 თვე უფასო VIP'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
            დააჭირეთ ქვემოთ მოცემულ ღილაკს, რათა გადახვიდეთ Adsterra-ს სპონსორის რეკლამაზე{' '}
            {clickStep === 1 ? '(1-ლი კლიკი)' : '(მე-2 კლიკი — VIP გააქტიურდება)'}.
          </p>

          {/* Adsterra 728x90 Live Preview Slot */}
          <div className="w-full flex flex-col items-center justify-center overflow-x-auto no-scrollbar rounded-2xl bg-stone-850 border border-stone-700/80 p-2 shadow-inner">
            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-400 mb-1">
              Adsterra 728x90 Banner
            </span>
            <div className="w-[728px] h-[90px] shrink-0 overflow-hidden flex items-center justify-center bg-stone-800/80 rounded-xl">
              <iframe
                title="Adsterra Ad Modal Preview"
                width="728"
                height="90"
                scrolling="no"
                srcDoc={adHtml}
                className="w-[728px] h-[90px] border-0 overflow-hidden"
              />
            </div>
          </div>

          {/* Direct External Link Button (Never blocked by browser popup blockers!) */}
          <div className="pt-2">
            <a
              href="/adsterra.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                onAdClicked();
              }}
              className="w-full max-w-md mx-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-serif-geo font-bold text-sm sm:text-base shadow-xl shadow-amber-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer block text-center"
            >
              <span>
                {clickStep === 1
                  ? '👉 გადადით Adsterra-ს რეკლამაზე (დარჩა 1 კლიკი)'
                  : '🎉 გადადით და გაააქტიურეთ 5 თვე უფასო VIP! ($0)'}
              </span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% უფასო • ბარათი არ არის საჭირო • მყისიერი გახსნა</span>
          </div>
        </div>
      </div>
    </div>
  );
};
