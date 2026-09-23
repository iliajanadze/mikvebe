import React, { useState } from 'react';
import { Recipe } from '../types/chef';
import { getScaledCalorieBreakdown } from '../utils/calorieUtils';
import { Flame, ChevronDown, ChevronUp, PieChart, Info, Scale } from 'lucide-react';

interface CalorieBreakdownSectionProps {
  recipe: Recipe;
  servings: number;
}

export const CalorieBreakdownSection: React.FC<CalorieBreakdownSectionProps> = ({
  recipe,
  servings,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const breakdown = getScaledCalorieBreakdown(recipe, servings);

  // Maximum calorie item for percentage bars
  const maxCalories = Math.max(...breakdown.items.map((i) => i.calories), 1);

  return (
    <div className="rounded-2xl border border-orange-200/80 bg-gradient-to-br from-orange-50/60 via-amber-50/30 to-white overflow-hidden shadow-2xs">
      {/* Summary Header Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-300/40 flex items-center justify-center text-orange-600 shrink-0 mt-0.5">
            <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-800">
                ენერგეტიკული ღირებულება
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-orange-100 text-orange-900 border border-orange-200">
                {servings} {servings === 1 ? 'პორცია' : 'პორცია'}
              </span>
            </div>

            {/* Total and Per-Serving Numbers */}
            <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <div>
                <span className="text-xs text-stone-500">ჯამში მთლიანი კერძი: </span>
                <span className="font-serif-geo text-lg sm:text-xl font-extrabold text-orange-900">
                  ~{breakdown.totalDishCalories.toLocaleString()} კკალ
                </span>
              </div>
              <div className="text-xs text-stone-600 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-stone-300 hidden sm:inline-block" />
                <span className="text-stone-500">ერთ პორციაზე: </span>
                <span className="font-bold text-stone-800 bg-white/80 px-2 py-0.5 rounded-md border border-orange-200/50">
                  ~{breakdown.caloriesPerServing.toLocaleString()} კკალ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expand / Collapse Button ("ვრცლად") */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
            isExpanded
              ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
              : 'bg-white hover:bg-orange-50 text-orange-950 border-orange-200/90 hover:border-orange-300'
          }`}
          aria-expanded={isExpanded}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>{isExpanded ? 'შეკეცვა' : 'ვრცლად (კალორიები ინგრედიენტებით)'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Ingredient-by-Ingredient Breakdown */}
      {isExpanded && (
        <div className="border-t border-orange-200/60 bg-white/95 p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h5 className="font-serif-geo text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-orange-600" />
                <span>კალორიების განაწილება ინგრედიენტების მიხედვით</span>
              </h5>
              <p className="text-[11px] text-stone-500 mt-0.5">
                ნახეთ, რომელი პროდუქტი რამდენი კალორიას მატებს კერძს ({servings} პორციის გათვლით):
              </p>
            </div>

            {/* Macros summary pill */}
            <div className="flex items-center gap-2 self-start sm:self-center text-[11px] font-semibold bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
              <span className="text-emerald-800">ცილა: {breakdown.macros.protein}</span>
              <span className="text-stone-300">•</span>
              <span className="text-amber-800">ცხიმი: {breakdown.macros.fat}</span>
              <span className="text-stone-300">•</span>
              <span className="text-blue-800">ნახშირწყალი: {breakdown.macros.carbs}</span>
            </div>
          </div>

          {/* List of ingredients with bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {breakdown.items.map((item, idx) => {
              const percentage = Math.round((item.calories / breakdown.totalDishCalories) * 100) || 0;
              const barWidth = Math.min(100, Math.max(10, Math.round((item.calories / maxCalories) * 100)));

              return (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-orange-50/30 hover:bg-orange-50/60 border border-orange-100 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-stone-900 truncate max-w-[180px]">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] text-stone-500 font-normal">
                        ({percentage}%)
                      </span>
                      <span className="font-bold text-orange-950 font-mono">
                        ~{item.calories} კკალ
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-orange-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chef advice note */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-start gap-2 text-stone-600 text-[11px] leading-relaxed">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong>შეფის განმარტება:</strong> კალორიები გათვლილია ინგრედიენტების ზომიერი თერმული დამუშავებით. პორციის შემცირების ან გაზრდისას კალორიები ავტომატურად გადაითვლება.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
