import React from 'react';
import { Recipe } from '../types/chef';
import { COOKING_METHOD_INFO, getCookingMethod } from '../utils/calorieUtils';
import { Users, Minus, Plus } from 'lucide-react';

export type CookingMethodFilter = 'all' | 'წვნიანი' | 'შემწვარი' | 'მოხარშული';

interface CookingMethodSelectorProps {
  recipes: Recipe[];
  activeFilter: CookingMethodFilter;
  onSelectFilter: (filter: CookingMethodFilter) => void;
  servings?: number;
  onServingsChange?: (servings: number) => void;
}

export const CookingMethodSelector: React.FC<CookingMethodSelectorProps> = ({
  recipes,
  activeFilter,
  onSelectFilter,
  servings = 2,
  onServingsChange,
}) => {
  // Compute counts for each method
  const counts = recipes.reduce(
    (acc, r) => {
      const method = getCookingMethod(r);
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    },
    { წვნიანი: 0, შემწვარი: 0, მოხარშული: 0 } as Record<string, number>
  );

  const categories: Array<{
    id: CookingMethodFilter;
    label: string;
    icon: string;
    count: number;
    description: string;
  }> = [
    {
      id: 'all',
      label: 'ყველა არჩევანი',
      icon: '🍽️',
      count: recipes.length,
      description: 'ყველა 6 კერძი (2+2+2)',
    },
    {
      id: 'შემწვარი',
      label: '2 შემწვარი',
      icon: '🍳',
      count: counts['შემწვარი'] || 0,
      description: 'ტაფაზე & ღუმელში',
    },
    {
      id: 'მოხარშული',
      label: '2 მოხარშული',
      icon: '🥗',
      count: counts['მოხარშული'] || 0,
      description: 'მოხარშული & ორთქლზე',
    },
    {
      id: 'წვნიანი',
      label: '2 წვნიანი',
      icon: '🍲',
      count: counts['წვნიანი'] || 0,
      description: 'სუპები & ბულიონები',
    },
  ];

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-4 sm:p-5 border border-amber-200/80 dark:border-stone-800 shadow-xs space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 dark:border-stone-800 pb-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
            კერძების მკაცრი განაწილება: 2 შემწვარი + 2 მოხარშული + 2 წვნიანი
          </span>
          <h3 className="font-serif-geo text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
            როგორ გსურთ დღეს მომზადება?
          </h3>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-400 sm:text-right max-w-xs">
          ამოცნობილი ინგრედიენტებით შეგიძლიათ მოამზადოთ შემწვარი, მოხარშული ან ცხელი წვნიანი
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
        {categories.map((cat) => {
          const isActive = activeFilter === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectFilter(cat.id)}
              className={`p-3 rounded-2xl text-left border transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                isActive
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20'
                  : 'bg-stone-50 dark:bg-stone-800/60 hover:bg-amber-50/60 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200/80 dark:border-stone-700 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5 w-full">
                <span className="text-xl sm:text-2xl">{cat.icon}</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-200/80 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {cat.count}
                </span>
              </div>

              <div className="mt-2">
                <div className="text-xs sm:text-sm font-bold tracking-tight">
                  {cat.label}
                </div>
                <div
                  className={`text-[10px] mt-0.5 truncate ${
                    isActive ? 'text-amber-100' : 'text-stone-500 dark:text-stone-400'
                  }`}
                >
                  {cat.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* People / Servings Quick Controller for All Recipes */}
      {onServingsChange && (
        <div className="pt-3 border-t border-amber-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-amber-50/50 dark:bg-stone-800/50 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-600/10 dark:bg-amber-600/20 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block leading-tight">
                საჭმლის გათვლა: {servings} {servings === 1 ? 'ადამიანზე' : 'ადამიანზე'}
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 block">
                ინგრედიენტების დოზები ქვემოთ ავტომატურად გადათვლილია
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => onServingsChange(Math.max(1, servings - 1))}
                disabled={servings <= 1}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-800 disabled:opacity-40 cursor-pointer"
                title="შემცირება"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-extrabold text-xs text-amber-950 dark:text-amber-300 px-2 min-w-[28px] text-center">
                {servings}
              </span>
              <button
                type="button"
                onClick={() => onServingsChange(Math.min(24, servings + 1))}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-800 cursor-pointer"
                title="გაზრდა"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 4, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onServingsChange(num)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    servings === num
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-white dark:bg-stone-900 hover:bg-amber-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {num} კაცი
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
