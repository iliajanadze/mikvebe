import React from 'react';
import { Language, TRANSLATIONS } from '../utils/i18n';
import {
  Sparkles,
  CheckCircle2,
  Camera,
  Calendar,
  Dumbbell,
  MessageSquare,
  Droplets,
  X,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  isPremium: boolean;
  onTogglePremium: (active: boolean) => void;
  onOpenDietPlan: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  lang,
  isPremium,
  onTogglePremium,
  onOpenDietPlan,
}) => {
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  const features = [
    {
      icon: Camera,
      title: t.premiumFeature1,
      desc: t.premiumFeature1Desc,
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      icon: Calendar,
      title: t.premiumFeature2,
      desc: t.premiumFeature2Desc,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      icon: Dumbbell,
      title: t.premiumFeature3,
      desc: t.premiumFeature3Desc,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      icon: MessageSquare,
      title: t.premiumFeature4,
      desc: t.premiumFeature4Desc,
      color: 'text-purple-500 bg-purple-500/10',
    },
    {
      icon: Droplets,
      title: t.premiumFeature5,
      desc: t.premiumFeature5Desc,
      color: 'text-teal-500 bg-teal-500/10',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full shadow-2xl border border-amber-300 dark:border-amber-900/60 overflow-hidden">
        {/* Banner Header */}
        <div className="relative p-6 sm:p-7 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white overflow-hidden">
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute right-4 bottom-2 text-white/10 text-8xl font-serif-geo font-black select-none pointer-events-none">
            $5
          </div>

          <div className="flex items-center justify-between relative z-10 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider border border-white/30">
              <Sparkles className="w-3.5 h-3.5" />
              {t.premiumBadge}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3 className="font-serif-geo text-2xl sm:text-3xl font-extrabold tracking-tight relative z-10">
            {t.premiumTitle}
          </h3>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-sm leading-relaxed relative z-10">
            {t.premiumSubtitle}
          </p>

          <div className="mt-4 flex items-baseline gap-2 relative z-10">
            <span className="text-3xl sm:text-4xl font-extrabold font-serif-geo">Upgrade to Premium</span>
            <span className="ml-auto px-2.5 py-1 rounded-lg bg-white/20 text-xs font-bold text-white border border-white/30">
              4 მოქნილი პაკეტი
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Status Message if Active */}
          {isPremium ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{t.premiumStatusActive}</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                თქვენთვის სრულად გახსნილია ფოტოთი კალორიების დათვლა და პერსონალური სპორტული კვების გეგმა.
              </p>
              <div className="pt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDietPlan();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  გეგმის გახსნა
                </button>
                <button
                  type="button"
                  onClick={() => onTogglePremium(false)}
                  className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs"
                >
                  {t.premiumDeactivateBtn}
                </button>
              </div>
            </div>
          ) : null}

          {/* 4 Pricing Tiers Selection Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              აირჩიეთ სასურველი პაკეტი (Lemon Squeezy):
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1 Month */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-serif-geo font-bold text-sm text-stone-900 dark:text-stone-100">1 თვე</span>
                    <span className="font-serif-geo text-lg font-black text-amber-700 dark:text-amber-400">$3.50</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-3">1 Month Access (~9.50 GEL)</p>
                </div>
                <a
                  href="https://mikvebe.lemonsqueezy.com/checkout/buy/9649c076-de24-4be1-8e49-1f4a781c1b3c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lemonsqueezy-button block text-center py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-700 dark:hover:bg-stone-600 text-white text-xs font-bold transition-all"
                >
                  ყიდვა ($3.50)
                </a>
              </div>

              {/* 2 Months */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-serif-geo font-bold text-sm text-stone-900 dark:text-stone-100">2 თვე</span>
                    <span className="font-serif-geo text-lg font-black text-amber-700 dark:text-amber-400">$4.50</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-3">$2.25/თვეში (~12.15 GEL)</p>
                </div>
                <a
                  href="https://mikvebe.lemonsqueezy.com/checkout/buy/6176674f-fac2-40ae-afc4-f5e64ce198d0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lemonsqueezy-button block text-center py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-700 dark:hover:bg-stone-600 text-white text-xs font-bold transition-all"
                >
                  ყიდვა ($4.50)
                </a>
              </div>

              {/* 3 Months */}
              <div className="p-4 rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-stone-800/80 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif-geo font-bold text-sm text-stone-900 dark:text-stone-100">3 თვე</span>
                      <span className="text-[9px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-1.5 py-0.2 rounded font-bold">POPULAR</span>
                    </div>
                    <span className="font-serif-geo text-lg font-black text-amber-700 dark:text-amber-400">$5.50</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-3">$1.83/თვეში (~14.85 GEL)</p>
                </div>
                <a
                  href="https://mikvebe.lemonsqueezy.com/checkout/buy/624b09cc-7019-4154-9f16-4d9028e2b2ab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lemonsqueezy-button block text-center py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white text-xs font-bold transition-all"
                >
                  ყიდვა ($5.50)
                </a>
              </div>

              {/* 6 Months - BEST DEAL */}
              <div className="relative p-4 rounded-2xl border-2 border-amber-500 dark:border-amber-500 bg-gradient-to-b from-amber-500/15 via-orange-500/10 to-amber-500/15 dark:from-amber-950/40 dark:to-stone-850 shadow-md flex flex-col justify-between">
                <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                  BEST DEAL
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-serif-geo font-bold text-sm text-stone-900 dark:text-stone-100">6 თვე</span>
                    <span className="font-serif-geo text-lg font-black text-amber-700 dark:text-amber-400">$6.50</span>
                  </div>
                  <p className="text-[11px] font-bold text-amber-800 dark:text-amber-300 mb-3">$1.08/თვეში (~17.55 GEL)</p>
                </div>
                <a
                  href="https://mikvebe.lemonsqueezy.com/checkout/buy/9b4bb471-32d1-436e-9693-09272b66d055"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lemonsqueezy-button block text-center py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold shadow-xs transition-all"
                >
                  ყიდვა ($6.50) • BEST DEAL
                </a>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {t.premiumIncluded}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60 text-xs"
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${feat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-stone-800 dark:text-stone-200 truncate">
                      {feat.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instant Unlock for testing / developer & Close button */}
          <div className="pt-2 space-y-2 border-t border-stone-200 dark:border-stone-800">
            {!isPremium ? (
              <button
                type="button"
                onClick={() => onTogglePremium(true)}
                className="w-full py-2.5 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-amber-600" />
                <span>სატესტო რეჟიმში გააქტიურება</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
