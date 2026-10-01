import React, { useState, useEffect } from 'react';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { UserAccount } from '../types/userAccount';
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
  UserPlus,
  Clock,
  Flame,
  Check,
  CreditCard,
} from 'lucide-react';
import { getVipRemainingTime, getOrCreateVipExpirationDate } from '../utils/vipTimer';
import { fetchVipSpotsInfo, claimVipSpot, VipSpotsInfo } from '../utils/vipSpots';
import { PRICING_PLANS, ORIGINAL_PAID_PLANS, PricingPlan } from './PricingSection';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  isPremium: boolean;
  onTogglePremium: (active: boolean, plan?: { monthsCount?: number; name?: string; id?: string }) => void;
  onOpenDietPlan: () => void;
  currentUser?: UserAccount | null;
  onRequireAuth?: (reason: string) => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  lang,
  isPremium,
  onTogglePremium,
  onOpenDietPlan,
  currentUser,
  onRequireAuth,
}) => {
  const t = TRANSLATIONS[lang];
  const [helperNotice, setHelperNotice] = useState<string | null>(null);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PricingPlan | null>(null);

  const [spotsInfo, setSpotsInfo] = useState<VipSpotsInfo>({
    totalSpots: 2000,
    claimedSpots: 0,
    remainingSpots: 2000,
    isPromoActive: true,
    percentageClaimed: 0,
  });

  useEffect(() => {
    fetchVipSpotsInfo().then((info) => setSpotsInfo(info));
  }, []);

  if (!isOpen) return null;

  const currentPlans = spotsInfo.isPromoActive ? PRICING_PLANS : ORIGINAL_PAID_PLANS;

  const handlePlanSelect = (plan: PricingPlan) => {
    if (isPremium) return;

    // 1. Must register first
    if (!currentUser) {
      onClose();
      if (onRequireAuth) {
        onRequireAuth(
          spotsInfo.isPromoActive
            ? `უფასო VIP პაკეტის (${plan.name}) გასააქტიურებლად გთხოვთ ჯერ გაიაროთ რეგისტრაცია`
            : `VIP პაკეტის (${plan.name}) შესაძენად გთხოვთ ჯერ გაიაროთ რეგისტრაცია`
        );
      }
      return;
    }

    // Open confirmation / checkout
    setSelectedPlanForCheckout(plan);
  };

  const handleConfirmPurchase = (plan: PricingPlan) => {
    claimVipSpot().then((updated) => setSpotsInfo(updated));
    onTogglePremium(true, {
      monthsCount: plan.monthsCount,
      name: plan.name,
      id: plan.id,
    });
    setSelectedPlanForCheckout(null);
    onClose();
  };

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
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-xl w-full shadow-2xl border border-amber-300 dark:border-amber-900/60 overflow-hidden">
        {/* Banner Header */}
        <div className="relative p-6 sm:p-7 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white overflow-hidden">
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute right-4 bottom-2 text-white/10 text-8xl font-serif-geo font-black select-none pointer-events-none">
            VIP
          </div>

          <div className="flex items-center justify-between relative z-10 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider border border-white/30">
              <Sparkles className="w-3.5 h-3.5" />
              {spotsInfo.isPromoActive ? '100% უფასო VIP აქცია • 2,000 ადგილი' : 'ოფიციალური VIP პაკეტები'}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3 className="font-serif-geo text-2xl sm:text-3xl font-extrabold tracking-tight relative z-10">
            {spotsInfo.isPromoActive ? 'უფასო VIP წვდომა ($0)' : 'VIP წვდომა & პაკეტები'}
          </h3>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-md leading-relaxed relative z-10">
            {spotsInfo.isPromoActive
              ? 'პირველი 2,000 ადამიანი იღებს VIP წვდომას 100% უფასოდ ($0)! 2,000 ადგილის ამოწურვის შემდეგ VIP გადავა ფიქსირებულ დაბალ ტარიფებზე ($3.50, $6.50, $9.50, $10.50).'
              : 'შეიძინეთ ნებისმიერი VIP პაკეტი ფიქსირებულ დაბალ ფასად და მომენტალურად გახსენით ყველა ფუნქცია შეუზღუდავად!'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Status Message if Active */}
          {isPremium ? (() => {
            const vipInfo = getVipRemainingTime(currentUser?.vipExpiresAt || getOrCreateVipExpirationDate(isPremium));
            return (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-300 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{t.premiumStatusActive}</span>
                </div>

                {/* VIP Countdown Card */}
                <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-700/80 flex items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        VIP მოქმედების ვადა:{' '}
                        <span className="text-emerald-700 dark:text-emerald-300 font-black">
                          {vipInfo.displayText}
                        </span>
                      </p>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400">
                        აქტიურია {vipInfo.expiryDateFormatted}-მდე
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-[10px] font-black border border-emerald-300 dark:border-emerald-700">
                    {vipInfo.badgeText}
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400">
                  თქვენთვის სრულად გახსნილია ფოტოთი კალორიების დათვლა და პერსონალური სპორტული კვების გეგმა.
                </p>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenDietPlan();
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    კვების გეგმის გახსნა →
                  </button>
                </div>
              </div>
            );
          })() : null}

          {/* Helper Notice if active */}
          {helperNotice && (
            <div className="p-3 rounded-2xl bg-amber-500/15 border-2 border-amber-500 text-amber-950 dark:text-amber-200 text-xs font-bold animate-in fade-in flex items-center justify-between gap-2">
              <span>{helperNotice}</span>
              <button
                type="button"
                onClick={() => setHelperNotice(null)}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-500 text-white font-bold cursor-pointer"
              >
                დახურვა
              </button>
            </div>
          )}

          {/* Limited 2,000 spots banner */}
          {spotsInfo.isPromoActive ? (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-500/10 via-amber-500/15 to-orange-500/10 border-2 border-amber-400 dark:border-amber-600 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 animate-pulse" />
                <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  სრული 2,000 ადგილი VIP მომხმარებლებისთვის — დარჩა:{' '}
                  <span className="text-red-600 dark:text-red-400 font-black text-sm">
                    {spotsInfo.remainingSpots.toLocaleString('ka-GE')} ადგილი
                  </span>
                  !
                </p>
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-600 text-white shrink-0">
                {spotsInfo.claimedSpots}/2,000 შევსებულია
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-center">
              <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                2,000-ვე ლიმიტირებული ადგილი შევსებულია. მოქმედებს ჩვენი ფიქსირებული დაბალი ტარიფები (1 თვე: $3.50, 3 თვე: $6.50, 5 თვე: $9.50, 6 თვე: $10.50):
              </p>
            </div>
          )}

          {/* Checkout Confirmation Card if selected */}
          {selectedPlanForCheckout && !isPremium && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-stone-800/90 border-2 border-amber-500 text-stone-900 dark:text-stone-100 space-y-3 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <h4 className="font-serif-geo font-bold text-base">
                    {spotsInfo.isPromoActive ? 'უფასო VIP-ის გააქტიურება:' : 'პაკეტის შეძენა:'} {selectedPlanForCheckout.name}
                  </h4>
                </div>
                <span className="font-serif-geo text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {spotsInfo.isPromoActive ? '$0 (უფასო)' : selectedPlanForCheckout.price}
                </span>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300">
                {selectedPlanForCheckout.durationLabel}.{' '}
                {spotsInfo.isPromoActive
                  ? 'გააქტიურების შემდეგ პლატფორმაზე ყველა VIP ფუნქცია (კალორიების დათვლა, რეცეპტები, შეფ-დიეტოლოგი) 100% უფასოდ მომენტალურად სრულად გაიხსნება.'
                  : 'შეძენის შემდეგ პლატფორმაზე ყველა VIP ფუნქცია (კალორიების დათვლა, რეცეპტები, შეფ-დიეტოლოგი) მომენტალურად სრულად გაიხსნება.'}
              </p>

              <div className="flex items-center justify-between pt-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlanForCheckout(null)}
                  className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold cursor-pointer"
                >
                  გაუქმება
                </button>

                <button
                  type="button"
                  onClick={() => handleConfirmPurchase(selectedPlanForCheckout)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-serif-geo text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>
                    {spotsInfo.isPromoActive
                      ? 'უფასო VIP-ის გააქტიურება ($0) • სრული წვდომა'
                      : `დადასტურება & შეძენა (${selectedPlanForCheckout.price})`}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* 4 Pricing Tiers Selection Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {spotsInfo.isPromoActive
                ? `აირჩიეთ სასურველი VIP პაკეტი (დარჩენილია ${spotsInfo.remainingSpots.toLocaleString('ka-GE')} ადგილი):`
                : 'აირჩიეთ სასურველი VIP პაკეტი (სტანდარტული ტარიფი):'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentPlans.map((plan) => {
                const isBest = plan.isBestDeal;
                const isPop = plan.isPopular;

                return (
                  <div
                    key={plan.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                      isBest
                        ? 'border-2 border-amber-500 bg-amber-50/40 dark:bg-stone-850 shadow-md ring-1 ring-amber-400/40'
                        : isPop
                        ? 'border-2 border-amber-300 dark:border-amber-700 bg-white dark:bg-stone-800 shadow-sm'
                        : 'border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/60'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-serif-geo font-bold text-sm text-stone-900 dark:text-stone-100">
                          {plan.name}
                        </span>
                        <span className="font-serif-geo text-lg font-black text-emerald-600 dark:text-emerald-400">
                          {plan.price}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 mb-2">
                        {plan.monthlyBreakdown}
                      </p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-3">
                        {plan.durationLabel}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlanSelect(plan)}
                      className={`w-full text-center py-2 px-3 rounded-xl text-white text-xs font-bold transition-all cursor-pointer ${
                        isPremium
                          ? 'bg-emerald-600'
                          : !currentUser
                          ? 'bg-stone-900 hover:bg-stone-800'
                          : isBest
                          ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-sm'
                          : 'bg-amber-500 hover:bg-amber-600'
                      }`}
                    >
                      {isPremium
                        ? 'აქტიურია'
                        : !currentUser
                        ? (spotsInfo.isPromoActive ? 'რეგისტრაცია & უფასო VIP' : 'რეგისტრაცია & შეძენა')
                        : spotsInfo.isPromoActive
                        ? 'უფასო VIP-ის გააქტიურება ($0)'
                        : `შეძენა (${plan.price})`}
                    </button>
                  </div>
                );
              })}
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

          {/* Guarantee and Close */}
          <div className="pt-2 space-y-2 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>ყველა VIP პაკეტი ხსნის საიტის ყველა ფუნქციას შეუზღუდავად</span>
            </div>

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
