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
      description: 'ყველა შემოთავაზებული კერძი',
    },
    {
      id: 'წვნიანი',
      label: 'წვნიანი',
      icon: '🍲',
      count: counts['წვნიანი'] || 0,
      description: 'სუპები & ბულიონები',
    },
    {
      id: 'შემწვარი',
      label: 'შემწვარი',
      icon: '🍳',
      count: counts['შემწვარი'] || 0,
      description: 'ტაფაზე & ღუმელში',
    },
    {
      id: 'მოხარშული',
      label: 'მოხარშული',
      icon: '🥗',
      count: counts['მოხარშული'] || 0,
      description: 'მოხარშული & ორთქლზე',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-200/80 shadow-xs space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            კერძის მომზადების 3 არჩევანი
          </span>
          <h3 className="font-serif-geo text-lg sm:text-xl font-bold text-stone-900">
            როგორ გსურთ დღეს მომზადება?
          </h3>
        </div>
        <p className="text-xs text-stone-600 sm:text-right max-w-xs">
          ამოცნობილი ინგრედიენტებით შეგიძლიათ მოამზადოთ ცხელი წვნიანი, შეწვათ ან მოხარშოთ
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
              className={`p-3 rounded-2xl text-left border transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20'
                  : 'bg-stone-50 hover:bg-amber-50/60 text-stone-800 border-stone-200/80 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5 w-full">
                <span className="text-xl sm:text-2xl">{cat.icon}</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-200/80 text-stone-700'
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
                    isActive ? 'text-amber-100' : 'text-stone-500'
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
        <div className="pt-3 border-t border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-amber-50/50 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-600/10 flex items-center justify-center text-amber-700 shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block leading-tight">
                საჭმლის გათვლა: {servings} {servings === 1 ? 'ადამიანზე' : 'ადამიანზე'}
              </span>
              <span className="text-[10px] text-stone-500 block">
                ინგრედიენტების დოზები და კალორიები ქვემოთ ავტომატურად გადათვლილია
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center bg-white rounded-xl border border-stone-200 p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => onServingsChange(Math.max(1, servings - 1))}
                disabled={servings <= 1}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-amber-100 disabled:opacity-40"
                title="შემცირება"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-extrabold text-xs text-amber-950 px-2 min-w-[28px] text-center">
                {servings}
              </span>
              <button
                type="button"
                onClick={() => onServingsChange(Math.min(24, servings + 1))}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-amber-100"
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
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                    servings === num
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-white hover:bg-amber-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  {num} {num === 1 ? 'კაცი' : 'კაცი'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
