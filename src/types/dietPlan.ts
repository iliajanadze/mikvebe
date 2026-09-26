export interface DietPlanTarget {
  age: number;
  gender: 'ქალი' | 'კაცი';
  heightCm: number;
  weightKg: number;
  activityLevel: 'მჯდომარე' | 'ზომიერი' | 'აქტიური' | 'ძალიან აქტიური';
  doesSports?: boolean;
  sportsDaysPerWeek?: number; // 1-7 days per week
  sportsHoursPerDay?: number; // e.g. 0.5, 1, 1.5, 2, 2.5
  sportsType?: string;
  goal: 'წონის დაკლება' | 'წონის მატება' | 'კუნთოვანი მასა' | 'შენარჩუნება' | 'ჯანსაღი კვება';
  bmr: number;
  tdee: number;
  targetDailyCalories: number;
  macros: {
    proteinGrams: number;
    proteinPercent: number;
    fatGrams: number;
    fatPercent: number;
    carbsGrams: number;
    carbsPercent: number;
  };
  dailyWaterLiters: number;
}

export interface MealRecipe {
  name: string;
  timeSlot?: string; // e.g. "09:00", "12:30", "15:00", "19:30"
  calories: number;
  protein: string;
  fat: string;
  carbs: string;
  portion: string;
  ingredients: { name: string; amount: string }[];
  instructions: string;
  cookingTimeMinutes: number;
  prepTip?: string;
}

export interface DailyMealPlan {
  dayNumber: number;
  dayName: string; // ორშაბათი, სამშაბათი...
  focusNote?: string;
  breakfast: MealRecipe;
  lunch: MealRecipe;
  dinner: MealRecipe;
  snack: MealRecipe;
  totalDayCalories: number;
}

export interface WeeklyPlan {
  weekNumber: number;
  weekTitle: string;
  weekObjective: string;
  days: DailyMealPlan[];
  shoppingList: {
    category: string;
    items: { name: string; quantity: string }[];
  }[];
  weeklyTips: string[];
}

export interface FullMonthDietPlan {
  id: string;
  createdAt: string;
  target: DietPlanTarget;
  dietitianIntro: string;
  weeks: WeeklyPlan[];
  hydrationGuidelines: {
    dailyTargetLiters: number;
    hourlySchedule: { time: string; action: string }[];
    importantRules: string[];
  };
  generalClinicalRecommendations: string[];
}
