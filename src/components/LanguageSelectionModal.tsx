import React from 'react';
import { ChefHat, Check, Globe } from 'lucide-react';
import { Language } from '../utils/i18n';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onSelectLanguage: (lang: Language) => void;
  currentLanguage: Language;
  canDismiss?: boolean;
  onClose?: () => void;
}

interface LangOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  desc: string;
}

const LANGUAGES: LangOption[] = [
  {
    code: 'ka',
    name: 'Georgian',
    nativeName: 'ქართული',
    flag: '🇬🇪',
    desc: 'ქართული კერძები, ზუსტი რეცეპტები და დიეტოლოგი',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    desc: 'Personalized AI Chef, diet plans & photo recipes',
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    desc: 'Персональный AI шеф, планы диеты и рецепты по фото',
  },
];

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  onSelectLanguage,
  currentLanguage,
  canDismiss = false,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full shadow-2xl border border-amber-200/90 dark:border-stone-700 overflow-hidden text-center p-6 sm:p-8 space-y-6">
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-900/20 ring-4 ring-amber-400/20">
          <ChefHat className="w-9 h-9 stroke-[2.2]" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <h2 className="font-serif-geo text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            მიკვებე • Mikvebe
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-400">
            აირჩიეთ სასურველი ენა • Choose Language • Выберите язык
          </p>
        </div>

        {/* Language Options Grid */}
        <div className="space-y-3 pt-1">
          {LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => onSelectLanguage(lang.code)}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.99] cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30 shadow-md'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-stone-600'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-3xl filter drop-shadow-sm">{lang.flag}</span>
                  <div>
                    <div className="font-serif-geo text-base font-bold text-stone-900 dark:text-stone-100">
                      {lang.nativeName}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400">
                      {lang.desc}
                    </div>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-amber-600 border-amber-600 text-white'
                      : 'border-stone-300 dark:border-stone-600 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>

        {canDismiss && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 underline font-medium"
          >
            დახურვა • Close
          </button>
        )}
      </div>
    </div>
  );
};
