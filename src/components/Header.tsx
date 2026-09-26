import React, { useState } from 'react';
import { ChefHat, User, Moon, Sun, Zap } from 'lucide-react';
import { UserAccount } from '../types/userAccount';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface HeaderProps {
  savedCount: number;
  currentUser: UserAccount | null;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenLanguageModal: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isPremium: boolean;
  onOpenPremium: () => void;
  onOpenSaved: () => void;
  onOpenDietPlan: () => void;
  onOpenAccount: () => void;
  onOpenFeedback: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  lang,
  onLanguageChange,
  isDark,
  onToggleTheme,
  isPremium,
  onOpenPremium,
  onOpenAccount,
}) => {
  const t = TRANSLATIONS[lang];
  const [showLangMenu, setShowLangMenu] = useState(false);

  const langLabels: Record<Language, { flag: string; label: string }> = {
    ka: { flag: '🇬🇪', label: 'ქართული' },
    en: { flag: '🇬🇧', label: 'English' },
    ru: { flag: '🇷🇺', label: 'Русский' },
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-amber-200/70 dark:border-stone-800 shadow-xs transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Logo & Name (Clean, without duplicate badge) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-900/15 ring-2 ring-amber-400/30 shrink-0">
            <ChefHat className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="font-serif-geo text-base sm:text-xl font-black tracking-tight text-stone-900 dark:text-stone-100 leading-none">
              {t.appName}
            </h1>
            <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 hidden xs:block truncate mt-0.5">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Clean, Non-Overflowing Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 1. Language Flag Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-base rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors border border-stone-200 dark:border-stone-700 cursor-pointer shadow-2xs"
              title="ენის შეცვლა / Change Language"
              aria-label="Change Language"
            >
              <span>{langLabels[lang].flag}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 py-1 z-50 animate-in fade-in">
                {(['ka', 'en', 'ru'] as Language[]).map((lng) => (
                  <button
                    key={lng}
                    type="button"
                    onClick={() => {
                      onLanguageChange(lng);
                      setShowLangMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center gap-2 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors ${
                      lang === lng
                        ? 'text-amber-700 dark:text-amber-400 bg-amber-50/60 dark:bg-stone-800'
                        : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>{langLabels[lng].flag}</span>
                    <span>{langLabels[lng].label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Dark/Light Mode Switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-amber-400 hover:bg-stone-200 dark:hover:bg-stone-700 hover:scale-105 active:scale-95 transition-all border border-stone-200 dark:border-stone-700 cursor-pointer shadow-2xs"
            title={isDark ? 'დღის რეჟიმზე გადართვა' : 'ღამის რეჟიმზე გადართვა'}
            aria-label={isDark ? 'დღის რეჟიმზე გადართვა' : 'ღამის რეჟიმზე გადართვა'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300 fill-amber-400/20" />
            ) : (
              <Moon className="w-4 h-4 text-stone-700 hover:text-amber-600 transition-colors" />
            )}
          </button>

          {/* 3. Single Distinct Upgrade to Premium Button */}
          <button
            type="button"
            onClick={onOpenPremium}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer ${
              isPremium
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-900/20'
                : 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white shadow-md shadow-amber-900/20 hover:scale-[1.02] active:scale-[0.98]'
            }`}
            title="Upgrade to Premium"
          >
            <Zap className={`w-3.5 h-3.5 ${isPremium ? 'fill-white' : 'text-amber-200 fill-amber-200'}`} />
            <span>
              {isPremium ? (
                <>
                  <span className="xs:hidden">VIP</span>
                  <span className="hidden xs:inline">💎 VIP Active</span>
                </>
              ) : (
                <>
                  <span className="xs:hidden">Upgrade</span>
                  <span className="hidden xs:inline">Upgrade to Premium</span>
                </>
              )}
            </span>
          </button>

          {/* 4. Profile / Account Button */}
          <button
            type="button"
            onClick={onOpenAccount}
            className={`w-8 h-8 sm:w-auto sm:px-3 sm:py-2 flex items-center justify-center gap-1.5 rounded-xl transition-all border shadow-xs cursor-pointer ${
              currentUser
                ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600'
                : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
            }`}
            title="ჩემი პროფილი"
            aria-label="პროფილი"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-xs font-bold">
              {currentUser ? currentUser.name : t.navProfile}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
