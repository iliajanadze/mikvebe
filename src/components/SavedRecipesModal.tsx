import React from 'react';
import { Recipe } from '../types/chef';
import { getCookingMethod, COOKING_METHOD_INFO } from '../utils/calorieUtils';
import { X, Trash2, Printer, PlayCircle, Clock, ChefHat, BookmarkCheck, Flame } from 'lucide-react';

interface SavedRecipesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedRecipes: Recipe[];
  onRemoveSaved: (id: string) => void;
  onOpenCookingMode: (recipe: Recipe) => void;
}

export const SavedRecipesModal: React.FC<SavedRecipesModalProps> = ({
  isOpen,
  onClose,
  savedRecipes,
  onRemoveSaved,
  onOpenCookingMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[700px] max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-200/70 bg-amber-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-geo text-lg font-bold text-stone-900">
                შენახული რეცეპტები
              </h3>
              <p className="text-xs text-stone-600">
                თქვენი საყვარელი კერძების კოლექცია ({savedRecipes.length})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recipes List */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
          {savedRecipes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                <ChefHat className="w-8 h-8" />
              </div>
              <h4 className="font-serif-geo text-lg font-semibold text-stone-800 mb-1">
                ჯერ შენახული რეცეპტი არ გაქვთ
              </h4>
              <p className="text-xs sm:text-sm text-stone-500 max-w-sm">
                მოიწონეთ რეცეპტები დოლის ნიშნით (Bookmark), რომ აქ სწრაფად იპოვოთ ნებისმიერ დროს.
              </p>
            </div>
          ) : (
            savedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="p-4 sm:p-5 rounded-2xl border border-stone-200 hover:border-amber-300 bg-white hover:bg-amber-50/20 shadow-2xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {(() => {
                      const method = getCookingMethod(recipe);
                      const mInfo = COOKING_METHOD_INFO[method];
                      return (
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${mInfo.badgeBg} ${mInfo.badgeText} ${mInfo.badgeBorder}`}>
                          <span>{mInfo.icon}</span>
                          <span>{mInfo.name}</span>
                        </span>
                      );
                    })()}
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      {recipe.difficulty}
                    </span>
                    <span className="text-[11px] text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      {recipe.totalTime}
                    </span>
                    <span className="text-[11px] text-orange-700 font-semibold flex items-center gap-0.5">
                      <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                      {recipe.caloriesEstimate}
                    </span>
                  </div>
                  <h4 className="font-serif-geo text-base sm:text-lg font-bold text-stone-900">
                    {recipe.title}
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                    {recipe.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      onOpenCookingMode(recipe);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-all"
                  >
                    <PlayCircle className="w-4 h-4 text-amber-400" />
                    <span>მომზადება</span>
                  </button>

                  <button
                    onClick={() => onRemoveSaved(recipe.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="წაშლა"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
