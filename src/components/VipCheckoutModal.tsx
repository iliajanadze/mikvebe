import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Zap, CreditCard, Flame, CheckCircle2 } from 'lucide-react';
import { PricingPlan } from './PricingSection';

interface VipCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan | null;
  spotsRemaining: number;
  totalSpots?: number;
  isPromoActive: boolean;
  onConfirmPurchase: (plan: PricingPlan) => void;
}

export const VipCheckoutModal: React.FC<VipCheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  spotsRemaining,
  totalSpots = 2000,
  isPromoActive,
  onConfirmPurchase,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !plan) return null;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmPurchase(plan);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border-2 border-emerald-500/80 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden text-stone-900 dark:text-stone-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-md shrink-0">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>{isPromoActive ? '100% უფასო VIP აქცია' : 'VIP პაკეტის შეძენა'}</span>
              </div>
              <h3 className="font-serif-geo text-lg sm:text-xl font-extrabold leading-tight">
                {plan.name} ({isPromoActive ? 'უფასო $0' : plan.price})
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
        <div className="p-5 sm:p-6 space-y-4">
          {/* Limited Spots Alert */}
          {isPromoActive ? (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center gap-2.5 text-xs">
              <Flame className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 animate-pulse" />
              <div>
                <p className="font-bold text-emerald-950 dark:text-emerald-200 text-xs sm:text-sm">
                  უფასო VIP პირველ 2,000 ადამიანს — დარჩა მხოლოდ{' '}
                  <span className="font-black text-emerald-700 dark:text-emerald-300 text-base">
                    {spotsRemaining.toLocaleString('ka-GE')} ადგილი
                  </span>
                  !
                </p>
                <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                  სრულიად უფასო ($0), საბანკო ბარათი არ არის საჭირო. 2,000 ადგილის ამოწურვის შემდეგ VIP გადავა ჩვენს ფიქსირებულ ტარიფებზე ($3.50, $6.50, $9.50, $10.50).
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs">
              <p className="font-bold text-stone-900 dark:text-stone-100">
                ფიქსირებული დაბალი ტარიფი (1 თვე: $3.50, 3 თვე: $6.50, 5 თვე: $9.50, 6 თვე: $10.50 — საბაზრო გაბერილი ფასების გარეშე).
              </p>
            </div>
          )}

          {/* Plan Summary Card */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-serif-geo font-bold text-base text-stone-900 dark:text-stone-100">
                  {plan.durationLabel}
                </span>
                <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  {isPromoActive ? '0₾ • 100% უფასო VIP (2,000 ადამიანისთვის)' : plan.monthlyBreakdown}
                </p>
              </div>
              <div className="text-right">
                <span className="font-serif-geo text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {isPromoActive ? '$0' : plan.price}
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                  {plan.period}
                </span>
              </div>
            </div>

            {/* Features Included List */}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-700 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                პაკეტში შედის (სრული შეუზღუდავი წვდომა):
              </span>
              <ul className="space-y-1 text-xs text-stone-700 dark:text-stone-300">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Method Selector (Only shown if promo ended and it's paid!) */}
          {!isPromoActive && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                გადახდის მეთოდი:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-2xs'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>საბანკო ბარათი</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-2xs'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <span className="text-base leading-none"></span>
                  <span>Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('google_pay')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                    paymentMethod === 'google_pay'
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-2xs'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <span className="text-base leading-none font-bold">G</span>
                  <span>Google Pay</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleCheckout}
              className={`w-full py-3.5 px-6 rounded-2xl text-white font-serif-geo font-bold text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                isPromoActive
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-900/30'
                  : 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 shadow-amber-900/30'
              }`}
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>
                {isProcessing
                  ? 'მიმდინარეობს გააქტიურება...'
                  : isPromoActive
                  ? `უფასო VIP-ის გააქტიურება ($0) • სრული წვდომა`
                  : `დადასტურება & შეძენა (${plan.price})`}
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {isPromoActive
                  ? '100% უფასო • ბარათი არ არის საჭირო • მომენტალური გახსნა'
                  : 'მყისიერი გააქტიურება • ყველა ფუნქცია იხსნება სრულად'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
