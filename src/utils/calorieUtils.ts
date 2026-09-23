import { Recipe, CalorieBreakdown, CookingMethod } from '../types/chef';

/**
 * Normalizes cooking method to one of the 3 primary categories:
 * 'წვნიანი' | 'შემწვარი' | 'მოხარშული'
 */
export function getCookingMethod(recipe: Recipe): 'წვნიანი' | 'შემწვარი' | 'მოხარშული' {
  if (recipe.cookingMethod === 'წვნიანი' || recipe.cookingMethod === 'შემწვარი' || recipe.cookingMethod === 'მოხარშული') {
    return recipe.cookingMethod;
  }

  const textToScan = `${recipe.title} ${recipe.subtitle} ${recipe.summary} ${recipe.tags?.join(' ') || ''}`.toLowerCase();

  if (
    textToScan.includes('წვნიან') ||
    textToScan.includes('სუპ') ||
    textToScan.includes('ბულიონ') ||
    textToScan.includes('ჩაშუშულ') ||
    textToScan.includes('შაკშუკ')
  ) {
    return 'წვნიანი';
  }

  if (
    textToScan.includes('მოხარშ') ||
    textToScan.includes('ორთქლ') ||
    textToScan.includes('პოშირებ') ||
    textToScan.includes('სალათ') ||
    textToScan.includes('მდუღარე')
  ) {
    return 'მოხარშული';
  }

  return 'შემწვარი';
}

export const COOKING_METHOD_INFO: Record<
  'წვნიანი' | 'შემწვარი' | 'მოხარშული',
  {
    name: string;
    icon: string;
    description: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    activeTabClass: string;
  }
> = {
  წვნიანი: {
    name: 'წვნიანი',
    icon: '🍲',
    description: 'სუპები, წვნიანი კერძები, ბულიონი და ჩაშუშული',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-900',
    badgeBorder: 'border-sky-300',
    activeTabClass: 'bg-sky-600 text-white shadow-sky-600/30 shadow-md',
  },
  შემწვარი: {
    name: 'შემწვარი',
    icon: '🍳',
    description: 'ტაფაზე შემწვარი, ღუმელში გამომცხვარი და დაბრაწული',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-900',
    badgeBorder: 'border-amber-300',
    activeTabClass: 'bg-amber-600 text-white shadow-amber-600/30 shadow-md',
  },
  მოხარშული: {
    name: 'მოხარშული',
    icon: '🥗',
    description: 'მოხარშული, ორთქლზე მომზადებული და მსუბუქი',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-900',
    badgeBorder: 'border-emerald-300',
    activeTabClass: 'bg-emerald-700 text-white shadow-emerald-700/30 shadow-md',
  },
};

/**
 * Returns estimated calories for an ingredient name if missing
 */
function estimateIngredientCalories(name: string, index: number): number {
  const n = name.toLowerCase();
  if (n.includes('კარაქ') || n.includes('ზეთ')) return 160;
  if (n.includes('ყველ')) return 180;
  if (n.includes('ხორც') || n.includes('ქათამ') || n.includes('ფილე')) return 220;
  if (n.includes('კვერცხ')) return 140;
  if (n.includes('კარტოფილ') || n.includes('ბრინჯ')) return 130;
  if (n.includes('სოკო')) return 40;
  if (n.includes('ავოკადო')) return 160;
  if (n.includes('პომიდორ')) return 40;
  if (n.includes('კიტრი')) return 20;
  if (n.includes('ისპანახ') || n.includes('მწვანილ') || n.includes('ქინძ') || n.includes('ოხრახუშ')) return 15;
  if (n.includes('ხახვ') || n.includes('ნიორ')) return 30;
  return 50 + ((index * 25) % 60);
}

/**
 * Computes calorie breakdown scaled to current servings
 */
export function getScaledCalorieBreakdown(recipe: Recipe, currentServings: number): {
  totalDishCalories: number;
  caloriesPerServing: number;
  items: Array<{ name: string; amount: string; calories: number }>;
  macros: { protein: string; carbs: string; fat: string };
} {
  const baseServings = Math.max(1, recipe.servings || 2);
  const ratio = currentServings / baseServings;

  if (recipe.calorieBreakdown && recipe.calorieBreakdown.items?.length > 0) {
    const rawTotal = recipe.calorieBreakdown.totalDishCalories || (recipe.calorieBreakdown.caloriesPerServing * baseServings) || 500;
    const scaledTotal = Math.round(rawTotal * ratio);
    const scaledPerServing = Math.round(scaledTotal / currentServings);

    const scaledItems = recipe.calorieBreakdown.items.map((item) => ({
      name: item.name,
      amount: item.amount,
      calories: Math.max(5, Math.round((item.calories || 50) * ratio)),
    }));

    return {
      totalDishCalories: scaledTotal,
      caloriesPerServing: scaledPerServing,
      items: scaledItems,
      macros: {
        protein: recipe.calorieBreakdown.macros?.protein || `${Math.round(24 * ratio)}გ`,
        carbs: recipe.calorieBreakdown.macros?.carbs || `${Math.round(30 * ratio)}გ`,
        fat: recipe.calorieBreakdown.macros?.fat || `${Math.round(18 * ratio)}გ`,
      },
    };
  }

  // Fallback: estimate from ingredients
  const combined = [
    ...recipe.primaryIngredients.map((i) => ({ ...i, isPantry: false })),
    ...recipe.pantryItems.filter((p) => {
      const pn = p.name.toLowerCase();
      return !pn.includes('მარილი') && !pn.includes('წყალი') && !pn.includes('პილპილი');
    }).map((i) => ({ ...i, isPantry: true })),
  ];

  const baseItems = combined.map((item, idx) => {
    const cal = estimateIngredientCalories(item.name, idx);
    return {
      name: item.name,
      amount: item.amount,
      calories: cal,
    };
  });

  const baseTotal = baseItems.reduce((acc, curr) => acc + curr.calories, 0) || 500;
  const scaledTotal = Math.round(baseTotal * ratio);
  const scaledPerServing = Math.round(scaledTotal / currentServings);

  const scaledItems = baseItems.map((item) => ({
    name: item.name,
    amount: item.amount,
    calories: Math.max(5, Math.round(item.calories * ratio)),
  }));

  return {
    totalDishCalories: scaledTotal,
    caloriesPerServing: scaledPerServing,
    items: scaledItems,
    macros: {
      protein: `${Math.round(22 * ratio)}გ`,
      carbs: `${Math.round(28 * ratio)}გ`,
      fat: `${Math.round(16 * ratio)}გ`,
    },
  };
}
