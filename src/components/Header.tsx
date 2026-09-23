import React from 'react';
import { ChefHat, Bookmark, Sparkles, HelpCircle, User, Mail } from 'lucide-react';
import { UserAccount } from '../types/userAccount';

interface HeaderProps {
  savedCount: number;
  currentUser: UserAccount | null;
  onOpenSaved: () => void;
  onOpenHelp: () => void;
  onOpenDietPlan: () => void;
  onOpenAccount: () => void;
  onOpenFeedback: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  savedCount,
  currentUser,
  onOpenSaved,
  onOpenHelp,
  onOpenDietPlan,
  onOpenAccount,
  onOpenFeedback,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-amber-50/90 backdrop-blur-md border-b border-amber-200/70 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-900/15 ring-2 ring-amber-400/30">
            <ChefHat className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-geo text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                მიკვებე
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300/60">
                <Sparkles className="w-3 h-3 text-amber-600" />
                AI დიეტოლოგი & შეფი
              </span>
            </div>
            <p className="text-xs text-stone-600 hidden xs:block">
              1-თვიანი კვების გეგმა, ჭკვიანი რეცეპტები და წყლის შეხსენებები
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            onClick={onOpenDietPlan}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300/80 rounded-xl transition-all shadow-xs"
            title="1-თვიანი კვების გეგმა და დიეტოლოგი"
          >
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span className="hidden xs:inline">1-თვიანი დიეტა</span>
          </button>

          <button
            onClick={onOpenAccount}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all border shadow-xs ${
              currentUser
                ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600'
                : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200'
            }`}
            title="ჩემი პროფილი და შენახული გეგმები"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">
              {currentUser ? currentUser.name : 'ექაუნთი'}
            </span>
          </button>

          <button
            onClick={onOpenFeedback}
            className="p-2 sm:px-2.5 sm:py-2 text-xs sm:text-sm font-medium text-stone-700 hover:text-amber-900 bg-white/80 hover:bg-amber-100/60 border border-stone-200/80 rounded-xl transition-all shadow-xs"
            title="მოგვწერეთ / უკუკავშირი"
          >
            <Mail className="w-4 h-4 text-amber-600" />
          </button>

          <button
            onClick={onOpenHelp}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-2 text-xs sm:text-sm font-medium text-stone-700 hover:text-amber-900 bg-white/80 hover:bg-amber-100/60 border border-stone-200/80 rounded-xl transition-all shadow-xs"
            title="როგორ მუშაობს"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>დახმარება</span>
          </button>

          <button
            onClick={onOpenSaved}
            className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium text-stone-800 hover:text-stone-950 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition-all shadow-xs"
            title="შენახული რეცეპტები"
          >
            <Bookmark className="w-4 h-4 text-amber-600 fill-amber-600/20" />
            <span className="hidden xs:inline">შენახული</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-amber-600 text-white font-bold text-xs rounded-full min-w-[20px] text-center">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
