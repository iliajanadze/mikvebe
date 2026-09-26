import React from 'react';
import { Mail, ShieldCheck, Heart, Sparkles, Droplets, Calendar, ChefHat } from 'lucide-react';

interface FooterProps {
  onOpenFeedback: () => void;
  onOpenDietPlan: () => void;
  onOpenAccount: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenFeedback,
  onOpenDietPlan,
  onOpenAccount,
}) => {
  return (
    <footer className="mt-16 bg-white dark:bg-stone-900 border-t border-amber-200/70 dark:border-stone-800 py-10 px-4 sm:px-6 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 text-white flex items-center justify-center font-black shadow-md">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-geo text-lg font-bold text-stone-900 dark:text-stone-100">
                მიკვებე
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                AI დიეტოლოგი & შეფი
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              პერსონალური 1-თვიანი კვების გეგმა, ზუსტი საათები და ჭკვიანი რეცეპტები
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center text-xs font-bold text-stone-700 dark:text-stone-300">
          <button
            onClick={onOpenDietPlan}
            className="hover:text-amber-700 dark:hover:text-amber-400 px-3 py-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>1-თვიანი გეგმა</span>
          </button>

          <button
            onClick={onOpenAccount}
            className="hover:text-amber-700 dark:hover:text-amber-400 px-3 py-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>ჩემი პროფილი</span>
          </button>

          <button
            onClick={onOpenFeedback}
            className="px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Mail className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>მოგვწერეთ / უკუკავშირი</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400 dark:text-stone-500 text-center">
        <p>© {new Date().getFullYear()} მიკვებე (Mikvebe). ყველა უფლება დაცულია.</p>
        <p className="flex items-center gap-1 justify-center">
          შექმნილია ჯანსაღი და გემრიელი ცხოვრებისთვის
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
        </p>
      </div>
    </footer>
  );
};
