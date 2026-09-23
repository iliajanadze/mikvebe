import React, { useState } from 'react';
import { IngredientDetected } from '../types/chef';
import { Tag, Plus, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface IngredientsBadgeListProps {
  ingredients: IngredientDetected[];
  onRemoveIngredient: (name: string) => void;
  onAddIngredient: (ingredient: IngredientDetected) => void;
  chefCommentary?: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'ბოსტნეული': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  'ხორცი/თევზი': { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
  'რძის პროდუქტი': { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' },
  'მწვანილი/სანელებელი': { bg: 'bg-lime-50', text: 'text-lime-800', border: 'border-lime-200' },
  'მარცვლეული': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'ხილი': { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
  'სხვა': { bg: 'bg-stone-50', text: 'text-stone-800', border: 'border-stone-200' },
};

export const IngredientsBadgeList: React.FC<IngredientsBadgeListProps> = ({
  ingredients,
  onRemoveIngredient,
  onAddIngredient,
  chefCommentary,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<IngredientDetected['category']>('ბოსტნეული');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddIngredient({
      name: newName.trim(),
      category: newCategory,
      confidence: 'მაღალი',
    });
    setNewName('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-200/70 p-5 sm:p-6 shadow-xs">
      {/* Header & Chef Commentary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <h3 className="font-serif-geo text-lg font-bold text-stone-900">
              ამოცნობილი ინგრედიენტები ({ingredients.length})
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            შეფმა ფოტოდან ამოიცნო შემდეგი პროდუქტები (შეგიძლიათ დაამატოთ ან ამოშალოთ):
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all self-start sm:self-center"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>დამატება</span>
        </button>
      </div>

      {chefCommentary && (
        <div className="mb-4 p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 text-sm font-bold shadow-xs">
            👨‍🍳
          </div>
          <div>
            <span className="text-xs font-bold text-amber-900 block mb-0.5">შეფის კომენტარი:</span>
            <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
              "{chefCommentary}"
            </p>
          </div>
        </div>
      )}

      {/* Add new ingredient form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="mb-4 p-3 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="ინგრედიენტის სახელი..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 min-w-[140px] px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            autoFocus
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-700"
          >
            <option value="ბოსტნეული">ბოსტნეული</option>
            <option value="ხორცი/თევზი">ხორცი/თევზი</option>
            <option value="რძის პროდუქტი">რძის პროდუქტი</option>
            <option value="მწვანილი/სანელებელი">მწვანილი/სანელებელი</option>
            <option value="მარცვლეული">მარცვლეული</option>
            <option value="ხილი">ხილი</option>
            <option value="სხვა">სხვა</option>
          </select>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all"
          >
            დამატება
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="px-2 py-1.5 text-xs text-stone-500 hover:text-stone-700"
          >
            გაუქმება
          </button>
        </form>
      )}

      {/* Badges list */}
      <div className="flex flex-wrap gap-2">
        {ingredients.map((ing, idx) => {
          const catStyle = CATEGORY_COLORS[ing.category] || CATEGORY_COLORS['სხვა'];
          return (
            <span
              key={`${ing.name}-${idx}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${catStyle.bg} ${catStyle.text} ${catStyle.border} transition-all shadow-2xs hover:shadow-xs`}
            >
              <span>{ing.name}</span>
              {ing.estimatedQuantity && (
                <span className="text-[10px] opacity-75 font-normal">({ing.estimatedQuantity})</span>
              )}
              <span className="text-[10px] px-1.5 py-0.2 bg-white/70 rounded-md border border-stone-200/50">
                {ing.category}
              </span>
              <button
                type="button"
                onClick={() => onRemoveIngredient(ing.name)}
                className="hover:opacity-70 text-stone-400 hover:text-rose-600 transition-colors ml-0.5"
                title="ამოღება"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
};
