import React, { useState, useEffect, useRef } from 'react';
import { Check, Sparkles, ShieldCheck, Star, ChevronLeft, ChevronRight, LayoutGrid, SlidersHorizontal, Zap, UserPlus, Flame, Users } from 'lucide-react';
import { UserAccount } from '../types/userAccount';
import { VipCheckoutModal } from './VipCheckoutModal';
import { getVipRemainingTime, getOrCreateVipExpirationDate } from '../utils/vipTimer';
import { fetchVipSpotsInfo, claimVipSpot, VipSpotsInfo } from '../utils/vipSpots';

export interface PricingPlan {
  id: string;
  name: string;
  durationLabel: string;
  price: string;
  priceNumeric: number;
  period: string;
  monthlyBreakdown: string;
  savingsBadge?: string;
  isBestDeal?: boolean;
  isPopular?: boolean;
  features: string[];
  monthsCount: number;
}

export const FREE_PROMO_PLANS: PricingPlan[] = [
  {
    id: 'free-vip-1m',
    name: '1 თვე VIP',
    durationLabel: '1 თვიანი უფასო VIP აქცია',
    price: '$0',
    priceNumeric: 0,
    period: '/ 1 თვე',
    monthlyBreakdown: '0₾ • 100% უფასო (2,000 კაცისთვის)',
    savingsBadge: '100% უფასო',
    features: [
      'მზა თეფშის კალორიების ანალიზი ფოტოთი',
      'პერსონალური შეფ-დიეტოლოგი & სპორტი',
      '1-თვიანი კლინიკური კვების გეგმა & საყიდლების სია',
    ],
    monthsCount: 1,
  },
  {
    id: 'free-vip-3m',
    name: '3 თვე VIP',
    durationLabel: '3 თვიანი უფასო VIP აქცია',
    price: '$0',
    priceNumeric: 0,
    period: '/ 3 თვე',
    monthlyBreakdown: '0₾ • 100% უფასო (2,000 კაცისთვის)',
    savingsBadge: '100% უფასო',
    features: [
      'ყველა VIP ფუნქცია 3 თვის განმავლობაში',
      'თეფშის ფოტოს კალორიები & მაკროები',
      'კლინიკური დიეტოლოგი & სპორტული რეჟიმი',
    ],
    monthsCount: 3,
  },
  {
    id: 'free-vip-5m',
    name: '5 თვე VIP',
    durationLabel: '5 თვიანი სრული უფასო VIP წვდომა',
    price: '$0',
    priceNumeric: 0,
    period: '/ 5 თვე',
    monthlyBreakdown: '0₾ • 100% უფასო (2,000 კაცისთვის)',
    savingsBadge: '100% უფასო',
    isPopular: true,
    features: [
      'ყველა VIP ფუნქცია 5 თვის განმავლობაში',
      'კალორიები, ცილები, ცხიმები, ნახშირწყლები',
      'კვების გეგმების შენახვა & PDF ექსპორტი',
    ],
    monthsCount: 5,
  },
  {
    id: 'free-vip-6m',
    name: '6 თვე VIP',
    durationLabel: '6 თვიანი All-in-One უფასო VIP',
    price: '$0',
    priceNumeric: 0,
    period: '/ 6 თვე',
    monthlyBreakdown: '0₾ • 100% უფასო (2,000 კაცისთვის)',
    savingsBadge: 'BEST DEAL • უფასო',
    isBestDeal: true,
    features: [
      '6 თვე შეუზღუდავი წვდომა ყველაფერზე',
      'თეფშის ფოტოს კალორიების სრული გახსნა',
      'პერსონალური AI შეფი & დიეტოლოგი',
    ],
    monthsCount: 6,
  },
];

export const PAID_AFTER_PROMO_PLANS: PricingPlan[] = [
  {
    id: 'paid-vip-1m',
    name: '1 თვე VIP',
    durationLabel: '1 თვიანი სრული VIP წვდომა',
    price: '$3.50',
    priceNumeric: 3.5,
    period: '/ 1 თვე',
    monthlyBreakdown: '~9.50₾ • თვეში ($3.50/თვე)',
    features: [
      'მზა თეფშის კალორიების ანალიზი ფოტოთი',
      'პერსონალური შეფ-დიეტოლოგი & სპორტი',
      '1-თვიანი კლინიკური კვების გეგმა & საყიდლების სია',
    ],
    monthsCount: 1,
  },
  {
    id: 'paid-vip-3m',
    name: '3 თვე VIP',
    durationLabel: '3 თვიანი სრული VIP წვდომა',
    price: '$6.50',
    priceNumeric: 6.5,
    period: '/ 3 თვე',
    monthlyBreakdown: '~17.50₾ (თვეში $2.17)',
    savingsBadge: 'დაზოგეთ 38%',
    features: [
      'ყველა VIP ფუნქცია 3 თვის განმავლობაში',
      'თეფშის ფოტოს კალორიები & მაკროები',
      'კლინიკური დიეტოლოგი & სპორტული რეჟიმი',
    ],
    monthsCount: 3,
  },
  {
    id: 'paid-vip-5m',
    name: '5 თვე VIP',
    durationLabel: '5 თვიანი სრული VIP წვდომა',
    price: '$9.50',
    priceNumeric: 9.5,
    period: '/ 5 თვე',
    monthlyBreakdown: '~25.50₾ (თვეში $1.90)',
    savingsBadge: 'დაზოგეთ 46%',
    isPopular: true,
    features: [
      'ყველა VIP ფუნქცია 5 თვის განმავლობაში',
      'კალორიები, ცილები, ცხიმები, ნახშირწყლები',
      'კვების გეგმების შენახვა & PDF ექსპორტი',
    ],
    monthsCount: 5,
  },
  {
    id: 'paid-vip-6m',
    name: '6 თვე VIP',
    durationLabel: '6 თვიანი All-in-One VIP',
    price: '$10.50',
    priceNumeric: 10.5,
    period: '/ 6 თვე',
    monthlyBreakdown: '~28₾ (თვეში $1.75)',
    savingsBadge: 'დაზოგეთ 50%',
    isBestDeal: true,
    features: [
      '6 თვე შეუზღუდავი წვდომა ყველაფერზე',
      'თეფშის ფოტოს კალორიების სრული გახსნა',
      'პერსონალური AI შეფი & დიეტოლოგი',
    ],
    monthsCount: 6,
  },
];

export const PRICING_PLANS = FREE_PROMO_PLANS;
export const ORIGINAL_PAID_PLANS = PAID_AFTER_PROMO_PLANS;

interface PricingSectionProps {
  currentUser?: UserAccount | null;
  onRequireAuth?: (reason: string) => void;
  onPlanSelected?: (plan: PricingPlan) => void;
  onActivateVIP?: (plan?: PricingPlan) => void;
  isPremium?: boolean;
  className?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  currentUser,
  onRequireAuth,
  onPlanSelected,
  onActivateVIP,
  isPremium = false,
  className = '',
}) => {
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [mobileViewMode, setMobileViewMode] = useState<'slider' | 'grid'>('slider');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<PricingPlan | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

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

  const currentPlans = spotsInfo.isPromoActive ? PRICING_PLANS : ORIGINAL_PAID_PLANS;

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, clientWidth } = sliderRef.current;
    if (clientWidth === 0) return;
    const index = Math.round(scrollLeft / (clientWidth * 0.78));
    setActiveMobileIndex(Math.min(Math.max(index, 0), currentPlans.length - 1));
  };

  const scrollToCard = (index: number) => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.clientWidth * 0.8;
    sliderRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
    setActiveMobileIndex(index);
  };

  const handlePlanClick = (plan: PricingPlan) => {
    // If already premium, let user know and show countdown
    if (isPremium) {
      const vipInfo = getVipRemainingTime(currentUser?.vipExpiresAt || getOrCreateVipExpirationDate(isPremium));
      setStatusNotice(`💎 VIP (${vipInfo.badgeText}) უკვე გააქტიურებულია თქვენთვის! (${vipInfo.displayText}) • ყველა ფუნქცია გახსნილია.`);
      return;
    }

    // 1. First rule: Require registration
    if (!currentUser) {
      if (onRequireAuth) {
        onRequireAuth(
          spotsInfo.isPromoActive
            ? `უფასო VIP პაკეტის (${plan.name}) გასააქტიურებლად გთხოვთ ჯერ გაიაროთ რეგისტრაცია (სახელი და ელ-ფოსტა)`
            : `VIP პაკეტის (${plan.name}) შესაძენად გთხოვთ ჯერ გაიაროთ რეგისტრაცია (სახელი და ელ-ფოსტა)`
        );
      }
      return;
    }

    // 2. Open VIP checkout / claim modal
    setCheckoutPlan(plan);
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmPurchase = (plan: PricingPlan) => {
    setIsCheckoutModalOpen(false);
    claimVipSpot().then((updated) => {
      setSpotsInfo(updated);
    });

    setStatusNotice(
      spotsInfo.isPromoActive
        ? `🎉 გილოცავთ! ${plan.name} 100% უფასოდ გააქტიურდა! ყველა ფუნქცია სრულად გაიხსნა.`
        : `🎉 გილოცავთ! ${plan.name} წარმატებით გააქტიურდა! ყველა ფუნქცია სრულად გაიხსნა.`
    );

    if (onActivateVIP) {
      onActivateVIP(plan);
    }
    if (onPlanSelected) {
      onPlanSelected(plan);
    }
  };

  const renderButtonContent = (plan: PricingPlan) => {
    if (isPremium) {
      const vipInfo = getVipRemainingTime(currentUser?.vipExpiresAt || getOrCreateVipExpirationDate(isPremium));
      return (
        <span className="flex items-center justify-center gap-1.5">
          <Zap className="w-3.5 h-3.5 fill-white" />
          <span>💎 VIP აქტიურია ({vipInfo.badgeText})</span>
        </span>
      );
    }

    if (!currentUser) {
      return (
        <span className="flex items-center justify-center gap-1.5">
          <UserPlus className="w-3.5 h-3.5" />
          <span>{spotsInfo.isPromoActive ? 'რეგისტრაცია & უფასო VIP' : 'რეგისტრაცია & შეძენა'}</span>
        </span>
      );
    }

    if (spotsInfo.isPromoActive) {
      return (
        <span className="flex items-center justify-center gap-1.5">
          <Zap className="w-3.5 h-3.5 fill-white" />
          <span>უფასო VIP-ის გააქტიურება ($0)</span>
        </span>
      );
    }

    return (
      <span className="flex items-center justify-center gap-1.5">
        <Zap className="w-3.5 h-3.5 fill-white" />
        <span>შეძენა ({plan.price})</span>
      </span>
    );
  };

  return (
    <section
      id="pricing"
      className={`py-8 sm:py-12 scroll-mt-20 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Compact Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>
              {spotsInfo.isPromoActive
                ? 'სპეციალური აქცია • 100% უფასო VIP პირველ 2,000 ადამიანს'
                : 'ოფიციალური VIP პაკეტები (ლიმიტი ამოიწურა)'}
            </span>
          </div>

          <h2 className="font-serif-geo text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            {spotsInfo.isPromoActive ? (
              <>
                მიიღეთ <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">უფასო VIP წვდომა</span> ($0)
              </>
            ) : (
              'ოფიციალური VIP ტარიფები'
            )}
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            {spotsInfo.isPromoActive
              ? 'პირველი 2,000 ადამიანი იღებს VIP წვდომას სრულიად უფასოდ ($0)! 2,000 ადგილის ამოწურვის შემდეგ VIP გადავა ფიქსირებულ მინიმალურ ტარიფებზე: 1 თვე — $3.50, 3 თვე — $6.50, 5 თვე — $9.50, 6 თვე — $10.50 (და არა გაბერილი საბაზრო ფასები).'
              : '2,000-ვე უფასო ადგილი შევსებულია. მოქმედებს ჩვენი სპეციალური ხელმისაწვდომი ტარიფები (1 თვე: $3.50, 3 თვე: $6.50, 5 თვე: $9.50, 6 თვე: $10.50):'}
          </p>

          {/* Limited 2,000 spots live counter card */}
          {spotsInfo.isPromoActive ? (
            <div className="mt-2 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-amber-500/15 to-orange-500/10 border-2 border-emerald-400 dark:border-emerald-500/80 text-left shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-600 flex items-center justify-center text-white shrink-0 shadow-sm animate-pulse">
                  <Flame className="w-5 h-5 fill-white text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs sm:text-sm font-black text-stone-900 dark:text-stone-100">
                      100% უფასო VIP პირველ 2,000 ადამიანს — დარჩენილია {spotsInfo.remainingSpots.toLocaleString('ka-GE')} ადგილი!
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider animate-bounce">
                      100% უფასო
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                    სრული 2,000 ადგილი VIP მომხმარებლებისთვის უფასოდ ($0)! დარჩენილია{' '}
                    <span className="font-black text-emerald-700 dark:text-emerald-400 text-sm">
                      {spotsInfo.remainingSpots.toLocaleString('ka-GE')}
                    </span>{' '}
                    ადგილი. 2,000 ადგილის ამოწურვის შემდეგ VIP გადავა ფიქსირებულ დაბალ ფასებზე ($3.50, $6.50, $9.50, $10.50).
                  </p>
                </div>
              </div>

              {/* Live Progress Bar */}
              <div className="w-full sm:w-44 shrink-0 space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-stone-600 dark:text-stone-300">
                  <span>შევსებულია: {spotsInfo.claimedSpots}/2,000</span>
                  <span>{spotsInfo.percentageClaimed}%</span>
                </div>
                <div className="w-full h-2.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${spotsInfo.percentageClaimed}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-2 p-3.5 sm:p-4 rounded-2xl bg-stone-100 dark:bg-stone-850 border-2 border-stone-300 dark:border-stone-700 text-center space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-stone-800 text-white text-[10px] font-bold uppercase tracking-wider mb-1">
                2,000 ადგილი ამოიწურა
              </span>
              <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                2,000-ვე უფასო ადგილი შევსებულია! VIP გადავიდა ჩვენს ფიქსირებულ დაბალ ტარიფებზე: 1 თვე — $3.50, 3 თვე — $6.50, 5 თვე — $9.50, 6 თვე — $10.50 (სხვებისგან განსხვავებით, გაბერილი საბაზრო ფასების გარეშე).
              </p>
            </div>
          )}

          {/* Status / celebration notice banner without buttons */}
          {(statusNotice || isPremium) && (() => {
            const vipInfo = getVipRemainingTime(currentUser?.vipExpiresAt || getOrCreateVipExpirationDate(isPremium));
            return (
              <div className="mt-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border-2 border-amber-400 dark:border-amber-500/80 text-amber-950 dark:text-amber-200 text-xs sm:text-sm font-bold animate-in fade-in flex items-center justify-center gap-2 text-center shadow-xs">
                <span className="text-lg">🎉</span>
                <span>
                  {statusNotice ||
                    `💎 VIP (${vipInfo.badgeText}) აქტიურია! (${vipInfo.displayText}) • ყველა ფუნქცია სრულად გახსნილია.`}
                </span>
              </div>
            );
          })()}

          {/* Mobile View Mode Switcher Toggle (Slider vs 2x2 Grid) */}
          <div className="sm:hidden flex items-center justify-center pt-1">
            <div className="inline-flex p-1 rounded-xl bg-stone-200/70 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMobileViewMode('slider')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                  mobileViewMode === 'slider'
                    ? 'bg-white dark:bg-stone-700 text-amber-700 dark:text-amber-300 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>სლაიდერი</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileViewMode('grid')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                  mobileViewMode === 'grid'
                    ? 'bg-white dark:bg-stone-700 text-amber-700 dark:text-amber-300 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>2×2 ბადე</span>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MOBILE VIEW: HORIZONTAL SLIDER OR COMPACT 2X2 GRID      */}
        {/* ======================================================== */}
        <div className="sm:hidden">
          {mobileViewMode === 'slider' ? (
            <div className="relative">
              {/* Horizontal Swipeable Track */}
              <div
                ref={sliderRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 pt-4 px-2 no-scrollbar -mx-4 px-6 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {currentPlans.map((plan) => {
                  const isBest = plan.isBestDeal;
                  const isPop = plan.isPopular;

                  return (
                    <div
                      key={plan.id}
                      className={`w-[80vw] max-w-[280px] shrink-0 snap-center relative flex flex-col justify-between rounded-2xl p-4 sm:p-5 transition-all duration-300 ${
                        isBest
                          ? 'bg-gradient-to-b from-amber-500/15 via-orange-500/5 to-amber-500/20 dark:from-amber-950/50 dark:to-stone-900 border-2 border-amber-500 dark:border-amber-400 shadow-lg shadow-amber-900/15 ring-2 ring-amber-400/40'
                          : isPop
                          ? 'bg-white dark:bg-stone-850 border-2 border-amber-300 dark:border-amber-700 shadow-md'
                          : 'bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs'
                      }`}
                    >
                      {/* Top Badges */}
                      {isBest ? (
                        <div className="absolute -top-3 left-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-white" />
                          <span>BEST DEAL</span>
                        </div>
                      ) : isPop ? (
                        <div className="absolute -top-3 left-4 bg-stone-900 dark:bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                          POPULAR
                        </div>
                      ) : null}

                      <div>
                        {/* Title & Savings */}
                        <div className="flex items-center justify-between gap-1 mb-1 mt-0.5">
                          <h3 className="font-serif-geo text-base font-bold text-stone-900 dark:text-stone-100">
                            {plan.name}
                          </h3>
                          {plan.savingsBadge && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                              {plan.savingsBadge}
                            </span>
                          )}
                        </div>

                        {/* Price */}
                        <div className="mb-3 pb-2.5 border-b border-stone-100 dark:border-stone-800">
                          <div className="flex items-baseline gap-1">
                            <span className="font-serif-geo text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                              {plan.price}
                            </span>
                            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                              {plan.period}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 block mt-0.5">
                            {plan.monthlyBreakdown}
                          </span>
                        </div>

                        {/* Feature bullets (3 compact items) */}
                        <ul className="space-y-1.5 mb-4 text-xs text-stone-600 dark:text-stone-300">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              <span className="leading-tight text-[11px]">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Activate Button */}
                      <button
                        type="button"
                        onClick={() => handlePlanClick(plan)}
                        className={`w-full py-2.5 px-3 rounded-xl font-serif-geo text-xs font-bold transition-all cursor-pointer text-center ${
                          isPremium
                            ? 'bg-emerald-600 text-white'
                            : !currentUser
                            ? 'bg-stone-900 hover:bg-stone-800 dark:bg-stone-700 text-white'
                            : isBest
                            ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-md shadow-amber-900/20 active:scale-[0.98]'
                            : isPop
                            ? 'bg-stone-900 dark:bg-amber-600 text-white shadow-xs'
                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                        }`}
                      >
                        {renderButtonContent(plan)}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Slider Dots & Arrow Controls */}
              <div className="flex items-center justify-between px-4 mt-2">
                <button
                  type="button"
                  onClick={() => scrollToCard(Math.max(activeMobileIndex - 1, 0))}
                  disabled={activeMobileIndex === 0}
                  className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 disabled:opacity-30 cursor-pointer"
                  title="წინა"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  {currentPlans.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollToCard(i)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeMobileIndex === i
                          ? 'w-5 bg-amber-600'
                          : 'w-2 bg-stone-300 dark:bg-stone-700'
                      }`}
                      aria-label={`ბარათი ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => scrollToCard(Math.min(activeMobileIndex + 1, currentPlans.length - 1))}
                  disabled={activeMobileIndex === currentPlans.length - 1}
                  className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 disabled:opacity-30 cursor-pointer"
                  title="შემდეგი"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10px] text-center text-stone-500 dark:text-stone-400 mt-1">
                ← გადაფურცლეთ 4-ვე პაკეტის სანახავად →
              </p>
            </div>
          ) : (
            /* Mobile 2x2 Compact Grid */
            <div className="grid grid-cols-2 gap-2.5 pt-3">
              {currentPlans.map((plan) => {
                const isBest = plan.isBestDeal;

                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col justify-between rounded-2xl p-3 text-left transition-all ${
                      isBest
                        ? 'bg-gradient-to-b from-amber-500/10 to-transparent border-2 border-amber-500 shadow-sm'
                        : 'bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    {isBest && (
                      <span className="absolute -top-2.5 right-2 bg-amber-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                        BEST DEAL
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-serif-geo font-bold text-xs text-stone-900 dark:text-stone-100">
                          {plan.name}
                        </h4>
                        {plan.savingsBadge && (
                          <span className="text-[8px] font-bold text-emerald-700 dark:text-emerald-400">
                            {plan.savingsBadge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-0.5 my-1">
                        <span className="font-serif-geo text-2xl font-black text-emerald-600 dark:text-emerald-400">
                          {plan.price}
                        </span>
                        <span className="text-[9px] text-stone-500 dark:text-stone-400">
                          {plan.period}
                        </span>
                      </div>

                      <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 block mb-2">
                        {plan.monthlyBreakdown}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlanClick(plan)}
                      className={`w-full py-2 px-1.5 rounded-xl text-center font-serif-geo text-[11px] font-bold transition-all block cursor-pointer ${
                        isPremium
                          ? 'bg-emerald-600 text-white'
                          : isBest
                          ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xs'
                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                      }`}
                    >
                      {renderButtonContent(plan)}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* TABLET & DESKTOP VIEW: STREAMLINED COMPACT 4-COLUMN GRID */}
        {/* ======================================================== */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch pt-2">
          {currentPlans.map((plan) => {
            const isBest = plan.isBestDeal;
            const isPop = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl p-5 transition-all duration-300 ${
                  isBest
                    ? 'bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-amber-500/15 dark:from-amber-950/40 dark:via-stone-900 dark:to-stone-900 border-2 border-amber-500 dark:border-amber-400 shadow-xl shadow-amber-900/10 ring-2 ring-amber-400/30 lg:-translate-y-1.5'
                    : isPop
                    ? 'bg-white dark:bg-stone-850 border-2 border-amber-300 dark:border-amber-800 shadow-md'
                    : 'bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-stone-700 shadow-xs hover:shadow-sm'
                }`}
              >
                {/* Badges */}
                {isBest ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    <span>BEST DEAL</span>
                  </div>
                ) : isPop ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-stone-900 dark:bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    POPULAR
                  </div>
                ) : null}

                {/* Plan Content */}
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1 mt-1">
                    <h3 className="font-serif-geo text-lg font-bold text-stone-900 dark:text-stone-100">
                      {plan.name}
                    </h3>
                    {plan.savingsBadge && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        {plan.savingsBadge}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-3">
                    {plan.durationLabel}
                  </p>

                  {/* Price */}
                  <div className="mb-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif-geo text-3xl lg:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-0.5">
                      {plan.monthlyBreakdown}
                    </p>
                  </div>

                  {/* Compact Features List (3 points) */}
                  <ul className="space-y-2 mb-5 text-xs text-stone-600 dark:text-stone-300">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-tight text-[11px]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Activation Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handlePlanClick(plan)}
                    className={`w-full py-2.5 px-3 rounded-xl font-serif-geo text-xs font-bold transition-all cursor-pointer text-center ${
                      isPremium
                        ? 'bg-emerald-600 text-white'
                        : !currentUser
                        ? 'bg-stone-900 hover:bg-stone-800 dark:bg-stone-700 text-white shadow-xs'
                        : isBest
                        ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white shadow-md shadow-amber-900/20 hover:scale-[1.02] active:scale-[0.98]'
                        : isPop
                        ? 'bg-stone-900 hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white shadow-xs hover:scale-[1.01]'
                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                    }`}
                  >
                    {renderButtonContent(plan)}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* VIP Guarantee Note */}
        <div className="mt-6 text-center max-w-lg mx-auto space-y-1 text-[11px] text-stone-500 dark:text-stone-400">
          <div className="flex items-center justify-center gap-1.5 text-stone-700 dark:text-stone-300 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>მყისიერი გააქტიურება • 1, 3, 5 და 6-თვიანი VIP წვდომა • ყველა ფუნქცია სრულად იხსნება</span>
          </div>
          <p>
            აირჩიეთ თქვენთვის სასურველი პაკეტი და მიიღეთ შეუზღუდავი წვდომა კალორიების დათვლაზე, შეფ-დიეტოლოგსა და 1-თვიან კვების გეგმაზე!
          </p>
        </div>
      </div>

      {/* VIP Checkout Modal */}
      {checkoutPlan && (
        <VipCheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          plan={checkoutPlan}
          spotsRemaining={spotsInfo.remainingSpots}
          totalSpots={spotsInfo.totalSpots}
          isPromoActive={spotsInfo.isPromoActive}
          onConfirmPurchase={handleConfirmPurchase}
        />
      )}
    </section>
  );
};
