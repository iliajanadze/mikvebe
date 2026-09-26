import React, { useState, useRef } from 'react';
import { Check, Sparkles, ShieldCheck, ArrowRight, Star, ChevronLeft, ChevronRight, LayoutGrid, SlidersHorizontal } from 'lucide-react';

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
  checkoutUrl: string; // Lemon Squeezy checkout link
  features: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: '1m',
    name: '1 თვე',
    durationLabel: '1 Month Access',
    price: '$3.50',
    priceNumeric: 3.5,
    period: '/ 1 თვე',
    monthlyBreakdown: '$3.50 თვეში',
    checkoutUrl: '#checkout-1m',
    features: [
      'თეფშის კალორიების ანალიზი ფოტოთი',
      'შეფ-დიეტოლოგი და სპორტული აქტივობა',
      '2 შემწვარი, 2 მოხარშული, 2 წვნიანი',
    ],
  },
  {
    id: '2m',
    name: '2 თვე',
    durationLabel: '2 Months Access',
    price: '$5',
    priceNumeric: 5,
    period: '/ 2 თვე',
    monthlyBreakdown: '$2.50 თვეში',
    savingsBadge: 'დაზოგე 28%',
    checkoutUrl: '#checkout-2m',
    features: [
      'სრული წვდომა 2 თვის განმავლობაში',
      'კალორიები, ცილები, ცხიმები, ნახშირწყლები',
      '1-თვიანი კლინიკური კვების გეგმა',
    ],
  },
  {
    id: '3m',
    name: '3 თვე',
    durationLabel: '3 Months Access',
    price: '$6.50',
    priceNumeric: 6.5,
    period: '/ 3 თვე',
    monthlyBreakdown: '$2.17 თვეში',
    savingsBadge: 'დაზოგე 38%',
    isPopular: true,
    checkoutUrl: '#checkout-3m',
    features: [
      'სრული წვდომა 3 თვის განმავლობაში',
      'BMR / TDEE კალკულატორი სპორტსმენებისთვის',
      'კვების გეგმების შენახვა & PDF ექსპორტი',
    ],
  },
  {
    id: '6m',
    name: '6 თვე',
    durationLabel: '6 Months Access',
    price: '$9.50',
    priceNumeric: 9.5,
    period: '/ 6 თვე',
    monthlyBreakdown: '$1.58 თვეში',
    savingsBadge: 'დაზოგე 55%',
    isBestDeal: true,
    checkoutUrl: '#checkout-6m',
    features: [
      'ყველაზე დიდი ეკონომია ($1.58/თვე)',
      '6 თვე შეუზღუდავი წვდომა ყველაფერზე',
      'პრიორიტეტული AI & VIP მხარდაჭერა',
    ],
  },
];

interface PricingSectionProps {
  onPlanSelected?: (plan: PricingPlan) => void;
  className?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onPlanSelected,
  className = '',
}) => {
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [mobileViewMode, setMobileViewMode] = useState<'slider' | 'grid'>('slider');
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, clientWidth } = sliderRef.current;
    if (clientWidth === 0) return;
    const index = Math.round(scrollLeft / (clientWidth * 0.78));
    setActiveMobileIndex(Math.min(Math.max(index, 0), PRICING_PLANS.length - 1));
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

  return (
    <section
      id="pricing"
      className={`py-8 sm:py-12 scroll-mt-20 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Compact Header */}
        <div className="text-center max-w-xl mx-auto space-y-2 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>სატარიფო პაკეტები</span>
          </div>

          <h2 className="font-serif-geo text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            გადადით <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">Premium</span>-ზე
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            გახსენით მზა თეფშის კალორიების დათვლა და შეფ-დიეტოლოგი სპორტული აქტივობით
          </p>

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
                {PRICING_PLANS.map((plan, index) => {
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
                      {isBest && (
                        <div className="absolute -top-3 left-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-white" />
                          <span>BEST DEAL</span>
                        </div>
                      )}
                      {isPop && !isBest && (
                        <div className="absolute -top-3 left-4 bg-stone-900 dark:bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                          POPULAR
                        </div>
                      )}

                      <div>
                        {/* Title & Savings */}
                        <div className="flex items-center justify-between gap-1 mb-1 mt-0.5">
                          <h3 className="font-serif-geo text-lg font-bold text-stone-900 dark:text-stone-100">
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
                            <span className="font-serif-geo text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
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

                      {/* Buy Button */}
                      <a
                        href={plan.checkoutUrl}
                        onClick={() => onPlanSelected && onPlanSelected(plan)}
                        className={`lemonsqueezy-button w-full py-2.5 px-3 rounded-xl font-serif-geo text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
                          isBest
                            ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-md shadow-amber-900/20 active:scale-[0.98]'
                            : isPop
                            ? 'bg-stone-900 dark:bg-amber-600 text-white shadow-xs'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        <span>{isBest ? 'ყიდვა (BEST DEAL)' : 'ყიდვა'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
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
                  {PRICING_PLANS.map((_, i) => (
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
                  onClick={() => scrollToCard(Math.min(activeMobileIndex + 1, PRICING_PLANS.length - 1))}
                  disabled={activeMobileIndex === PRICING_PLANS.length - 1}
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
              {PRICING_PLANS.map((plan) => {
                const isBest = plan.isBestDeal;
                const isPop = plan.isPopular;

                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col justify-between rounded-2xl p-3.5 transition-all ${
                      isBest
                        ? 'bg-gradient-to-b from-amber-500/15 to-amber-500/5 dark:from-amber-950/50 dark:to-stone-900 border-2 border-amber-500 dark:border-amber-400 shadow-md ring-1 ring-amber-400/40'
                        : isPop
                        ? 'bg-white dark:bg-stone-850 border border-amber-300 dark:border-amber-700 shadow-xs'
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
                        <h4 className="font-serif-geo font-bold text-sm text-stone-900 dark:text-stone-100">
                          {plan.name}
                        </h4>
                        {plan.savingsBadge && (
                          <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                            {plan.savingsBadge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-0.5 my-1">
                        <span className="font-serif-geo text-2xl font-black text-stone-900 dark:text-stone-100">
                          {plan.price}
                        </span>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400">
                          {plan.period}
                        </span>
                      </div>

                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 block mb-2">
                        {plan.monthlyBreakdown}
                      </span>
                    </div>

                    <a
                      href={plan.checkoutUrl}
                      onClick={() => onPlanSelected && onPlanSelected(plan)}
                      className={`lemonsqueezy-button w-full py-2 px-2 rounded-xl text-center font-serif-geo text-xs font-bold transition-all block ${
                        isBest
                          ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xs'
                          : 'bg-stone-900 dark:bg-stone-700 text-white'
                      }`}
                    >
                      ყიდვა
                    </a>
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
          {PRICING_PLANS.map((plan) => {
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
                {isBest && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    <span>BEST DEAL</span>
                  </div>
                )}

                {isPop && !isBest && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-stone-900 dark:bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    POPULAR
                  </div>
                )}

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
                      <span className="font-serif-geo text-3xl lg:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
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

                {/* Checkout Button */}
                <div className="pt-1">
                  <a
                    href={plan.checkoutUrl}
                    onClick={() => onPlanSelected && onPlanSelected(plan)}
                    className={`lemonsqueezy-button w-full py-2.5 px-3 rounded-xl font-serif-geo text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
                      isBest
                        ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white shadow-md shadow-amber-900/20 hover:scale-[1.02] active:scale-[0.98]'
                        : isPop
                        ? 'bg-stone-900 hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white shadow-xs hover:scale-[1.01]'
                        : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 hover:border-amber-300'
                    }`}
                  >
                    <span>
                      {isBest ? 'არჩევა (BEST DEAL)' : 'პაკეტის არჩევა'}
                    </span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimalist Security & Lemon Squeezy Note */}
        <div className="mt-6 text-center max-w-lg mx-auto space-y-1 text-[11px] text-stone-500 dark:text-stone-400">
          <div className="flex items-center justify-center gap-1.5 text-stone-700 dark:text-stone-300 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Lemon Squeezy დაცული გადახდა (Visa, Mastercard, Apple/Google Pay)</span>
          </div>
          <p>
            მყისიერი აქტივაცია • გაუქმება ნებისმიერ დროს
          </p>
        </div>
      </div>
    </section>
  );
};
