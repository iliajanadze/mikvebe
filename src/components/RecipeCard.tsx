import React, { useState, useEffect } from 'react';
import { Recipe } from '../types/chef';
import { scaleIngredientAmount } from '../utils/scaleIngredients';
import { getCookingMethod, COOKING_METHOD_INFO } from '../utils/calorieUtils';
import { CalorieBreakdownSection } from './CalorieBreakdownSection';
import {
  Clock,
  ChefHat,
  Flame,
  Users,
  Bookmark,
  Check,
  Wine,
  Sparkles,
  HelpCircle,
  PlayCircle,
  Timer,
  Printer,
  Copy,
  Zap,
} from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  isSaved: boolean;
  isPremium?: boolean;
  onOpenPremium?: () => void;
  initialServings?: number;
  onToggleSave: (recipe: Recipe) => void;
  onOpenCookingMode: (recipe: Recipe) => void;
  onAskChef: (recipe: Recipe) => void;
  onStartTimer: (minutes: number, label: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  index,
  isSaved,
  isPremium = false,
  onOpenPremium,
  initialServings,
  onToggleSave,
  onOpenCookingMode,
  onAskChef,
  onStartTimer,
}) => {
  const [servings, setServings] = useState<number>(initialServings || recipe.servings || 2);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialServings && initialServings > 0) {
      setServings(initialServings);
    }
  }, [initialServings]);

  const cookingMethod = getCookingMethod(recipe);
  const methodInfo = COOKING_METHOD_INFO[cookingMethod];

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const handleCopyIngredients = () => {
    const list = [
      `🍳 ${recipe.title} (${servings} პერსონაზე)`,
      '',
      'ძირითადი ინგრედიენტები:',
      ...recipe.primaryIngredients.map(
        (i) => `• ${i.name} - ${scaleIngredientAmount(i.amount, recipe.servings, servings)}`
      ),
      '',
      'საბაზისო ინგრედიენტები (სახლში):',
      ...recipe.pantryItems.map(
        (i) => `• ${i.name} - ${scaleIngredientAmount(i.amount, recipe.servings, servings)}`
      ),
    ].join('\n');

    navigator.clipboard.writeText(list);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl border border-amber-200/80 dark:border-stone-800 shadow-md shadow-amber-950/5 overflow-hidden transition-all hover:shadow-lg">
      {/* Header Banner */}
      <div className="p-5 sm:p-7 border-b border-amber-100 dark:border-stone-800 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-600 text-white tracking-wide">
                რეცეპტი #{index + 1}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${methodInfo.badgeBg} ${methodInfo.badgeText} ${methodInfo.badgeBorder}`}>
                <span>{methodInfo.icon}</span>
                <span>{methodInfo.name}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                {recipe.difficulty}
              </span>
              {recipe.tags?.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <h3 className="font-serif-geo text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
              {recipe.title}
            </h3>
            {recipe.subtitle && (
              <p className="text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-400 mt-1">
                {recipe.subtitle}
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleSave(recipe)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isSaved
                  ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300'
                  : 'bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
              }`}
              title={isSaved ? 'შენახულია' : 'შენახვა'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
            </button>
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-xl border bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 transition-all cursor-pointer"
              title="ამობეჭდვა"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chef Summary Note */}
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-3 leading-relaxed">
          {recipe.summary}
        </p>

        {/* Key Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 p-3 rounded-2xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-200/60 dark:border-stone-700 text-stone-700 dark:text-stone-300">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 block uppercase font-bold">მომზადება</span>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{recipe.prepTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
            <div>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 block uppercase font-bold">ცხობა/შეწვა</span>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{recipe.cookTime}</span>
            </div>
          </div>

          {/* Metric 3: Either Calorie estimate (Premium) or Cooking Method (Free, strictly no calories) */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 block uppercase font-bold">
                {isPremium ? 'ენერგია' : 'კატეგორია'}
              </span>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                {isPremium ? recipe.caloriesEstimate : methodInfo.name}
              </span>
            </div>
          </div>

          {/* Dynamic Servings / People Counter */}
          <div className="flex items-center justify-between sm:justify-end gap-2 bg-white/90 dark:bg-stone-900 p-1.5 sm:p-2 rounded-xl border border-amber-200/80 dark:border-stone-700 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-stone-500 dark:text-stone-400 block uppercase font-bold leading-tight">გათვლა</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <button
                    type="button"
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    disabled={servings <= 1}
                    className="w-5 h-5 rounded-md bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 flex items-center justify-center text-xs font-bold hover:bg-amber-100 text-stone-700 dark:text-stone-300 disabled:opacity-40 transition-colors cursor-pointer"
                    title="შემცირება"
                  >
                    -
                  </button>
                  <span className="text-xs font-black text-amber-950 dark:text-amber-300 px-1 min-w-[32px] text-center">
                    {servings} კაცი
                  </span>
                  <button
                    type="button"
                    onClick={() => setServings(Math.min(24, servings + 1))}
                    className="w-5 h-5 rounded-md bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 flex items-center justify-center text-xs font-bold hover:bg-amber-100 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                    title="გაზრდა"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body: Ingredients, Steps & Tips (Strictly without calories in Free mode) */}
      <div className="p-5 sm:p-7 space-y-6">
        {/* Full Dish Calorie Breakdown ONLY in Premium Mode */}
        {isPremium && (
          <CalorieBreakdownSection recipe={recipe} servings={servings} />
        )}

        {/* Ingredients Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-serif-geo text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              ინგრედიენტები ({servings} პერსონაზე)
            </h4>
            <button
              onClick={handleCopyIngredients}
              className="inline-flex items-center gap-1 text-xs text-amber-800 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-300 font-medium cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>დაკოპირდა!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>კოპირება</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary from photo */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/25 border border-emerald-200/60 dark:border-emerald-800/60">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block mb-2">
                ✓ თქვენი პროდუქტები (ფოტოდან):
              </span>
              <ul className="space-y-1.5">
                {recipe.primaryIngredients.map((item, iIdx) => (
                  <li
                    key={iIdx}
                    className="text-xs text-stone-800 dark:text-stone-200 flex items-center justify-between py-1 border-b border-emerald-100/50 dark:border-emerald-900/40 last:border-0"
                  >
                    <span className="font-medium text-stone-900 dark:text-stone-100">{item.name}</span>
                    <span className="text-emerald-950 dark:text-emerald-300 font-semibold bg-emerald-100/80 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      {scaleIngredientAmount(item.amount, recipe.servings, servings)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pantry staples */}
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">
                🧂 საბაზისო ინგრედიენტები (სახლში):
              </span>
              <ul className="space-y-1.5">
                {recipe.pantryItems.map((item, pIdx) => (
                  <li
                    key={pIdx}
                    className="text-xs text-stone-700 dark:text-stone-300 flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-800 last:border-0"
                  >
                    <span>{item.name}</span>
                    <span className="text-stone-600 dark:text-stone-400 font-medium">
                      {scaleIngredientAmount(item.amount, recipe.servings, servings)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-serif-geo text-base font-bold text-stone-900 dark:text-stone-100">
              მომზადების ეტაპები
            </h4>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              {Object.values(completedSteps).filter(Boolean).length} / {recipe.steps.length} დასრულებული
            </span>
          </div>

          <div className="space-y-3">
            {recipe.steps.map((step) => {
              const isDone = completedSteps[step.stepNumber];
              return (
                <div
                  key={step.stepNumber}
                  onClick={() => toggleStep(step.stepNumber)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                    isDone
                      ? 'bg-stone-50/70 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 opacity-60'
                      : 'bg-white dark:bg-stone-800/60 hover:bg-amber-50/20 dark:hover:bg-stone-800 border-stone-200/90 dark:border-stone-700 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 transition-all ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-100 dark:bg-stone-700 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-stone-600'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.stepNumber}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h5
                          className={`text-xs sm:text-sm font-bold ${
                            isDone ? 'line-through text-stone-500 dark:text-stone-400' : 'text-stone-900 dark:text-stone-100'
                          }`}
                        >
                          {step.title}
                        </h5>

                        {step.durationMinutes && step.durationMinutes > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartTimer(step.durationMinutes!, `${recipe.title} - ${step.title}`);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 px-2 py-0.5 rounded-md transition-colors shrink-0 cursor-pointer"
                          >
                            <Timer className="w-3 h-3" />
                            <span>{step.durationMinutes} წთ ტაიმერი</span>
                          </button>
                        )}
                      </div>

                      <p
                        className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                          isDone ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {step.instruction}
                      </p>

                      {step.tip && !isDone && (
                        <p className="text-[11px] text-amber-800 dark:text-amber-400 font-medium mt-1.5 flex items-center gap-1">
                          💡 <span>{step.tip}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chef's Secret Tip */}
        {recipe.chefSecret && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-100/70 via-orange-100/50 to-amber-100/60 dark:from-stone-800 dark:via-stone-850 dark:to-stone-800 border border-amber-300/80 dark:border-amber-900/40 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif-geo text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-300 block">
                  შეფის საიდუმლო რჩევა:
                </span>
                <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 mt-0.5 leading-relaxed">
                  {recipe.chefSecret}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pairings & Nutrition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {recipe.wineOrDrinkPairing && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700">
              <Wine className="w-4 h-4 text-purple-700 dark:text-purple-400 shrink-0" />
              <div className="text-xs">
                <span className="text-stone-500 dark:text-stone-400 font-medium block">სასმელის შეხამება:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{recipe.wineOrDrinkPairing}</span>
              </div>
            </div>
          )}

          {recipe.nutritionHighlights && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="text-xs">
                <span className="text-stone-500 dark:text-stone-400 font-medium block">კვებითი შეფასება:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{recipe.nutritionHighlights}</span>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
          <button
            type="button"
            onClick={() => onOpenCookingMode(recipe)}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-xs sm:text-sm bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-white shadow-xs transition-all cursor-pointer"
          >
            <PlayCircle className="w-4 h-4 text-amber-400" />
            <span>მომზადების რეჟიმი (ხმოვანი ასისტენტით)</span>
          </button>

          <button
            type="button"
            onClick={() => onAskChef(recipe)}
            className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-medium text-xs sm:text-sm bg-amber-100 dark:bg-stone-800 hover:bg-amber-200 dark:hover:bg-stone-750 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-stone-700 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>ჰკითხე შეფს ამ კერძზე</span>
          </button>
        </div>
      </div>
    </div>
  );
};
