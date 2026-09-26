export interface IngredientDetected {
  name: string;
  category: 'ბოსტნეული' | 'ხორცი/თევზი' | 'რძის პროდუქტი' | 'მწვანილი/სანელებელი' | 'მარცვლეული' | 'ხილი' | 'სხვა';
  confidence: 'მაღალი' | 'საშუალო';
  estimatedQuantity?: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  note?: string;
}

export interface RecipeStep {
  stepNumber: number;
  title: string;
  instruction: string;
  tip?: string;
  durationMinutes?: number;
}

export interface IngredientCalorieDetail {
  name: string;
  amount: string;
  calories: number;
}

export interface CalorieBreakdown {
  totalDishCalories: number;
  caloriesPerServing: number;
  items: IngredientCalorieDetail[];
  macros?: {
    protein?: string;
    carbs?: string;
    fat?: string;
  };
}

export type CookingMethod = 'წვნიანი' | 'შემწვარი' | 'მოხარშული' | 'სხვა';

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  cookingMethod: CookingMethod;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  difficulty: 'ძალიან მარტივი' | 'მარტივი' | 'საშუალო' | 'რთული' | string;
  servings: number;
  caloriesEstimate: string;
  calorieBreakdown?: CalorieBreakdown;
  tags: string[];
  region?: string;
  category?: string;
  isFamous?: boolean;
  primaryIngredients: RecipeIngredient[];
  pantryItems: RecipeIngredient[];
  steps: RecipeStep[];
  chefSecret: string;
  wineOrDrinkPairing: string;
  nutritionHighlights: string;
}

export interface ChefAnalysisResult {
  detectedIngredients: IngredientDetected[];
  chefCommentary: string;
  recipes: Recipe[];
}

export interface PlateCalorieItem {
  name: string;
  portion: string;
  calories: number;
  protein: string;
  fat: string;
  carbs: string;
}

export interface PlateCalorieResult {
  dishName: string;
  confidence: string;
  estimatedWeightGrams: number;
  totalCalories: number;
  macros: {
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    fiberGrams?: number;
  };
  items: PlateCalorieItem[];
  healthScore: number;
  dietitianFeedback: string;
  sportsFit: string;
}

export interface UserPreferences {
  dietary: 'ყველაფერი' | 'ვეგეტარიანული' | 'სამარხვო' | 'დაბალკალორიული' | 'სწრაფი 20 წთ';
  mealType: 'ნებისმიერი' | 'საუზმე' | 'სადილი' | 'ვახშამი';
  servings: number;
  additionalIngredients: string[];
  excludedIngredients: string[];
  extraNote: string;
}
