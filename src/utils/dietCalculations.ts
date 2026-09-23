import { DietPlanTarget, FullMonthDietPlan, WeeklyPlan, DailyMealPlan } from '../types/dietPlan';

/**
 * Calculates BMR using Mifflin-St Jeor equation:
 * Men: 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) + 5
 * Women: 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) - 161
 */
export function calculateDietTargets(params: {
  age: number;
  gender: 'ქალი' | 'კაცი';
  heightCm: number;
  weightKg: number;
  activityLevel: 'მჯდომარე' | 'ზომიერი' | 'აქტიური' | 'ძალიან აქტიური';
  goal: 'წონის დაკლება' | 'კუნთოვანი მასა' | 'შენარჩუნება' | 'ჯანსაღი კვება';
}): DietPlanTarget {
  const { age, gender, heightCm, weightKg, activityLevel, goal } = params;

  // Mifflin-St Jeor
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr = gender === 'კაცი' ? bmr + 5 : bmr - 161;
  bmr = Math.round(bmr);

  // Activity multiplier
  const activityMultipliers: Record<string, number> = {
    მჯდომარე: 1.2,
    ზომიერი: 1.375,
    აქტიური: 1.55,
    'ძალიან აქტიური': 1.725,
  };
  const multiplier = activityMultipliers[activityLevel] || 1.375;
  const tdee = Math.round(bmr * multiplier);

  // Goal adjustment
  let targetCalories = tdee;
  if (goal === 'წონის დაკლება') {
    // 20% deficit (safe & sustainable clinical deficit)
    targetCalories = Math.max(1200, Math.round(tdee * 0.8));
  } else if (goal === 'კუნთოვანი მასა') {
    // 10-15% surplus
    targetCalories = Math.round(tdee * 1.15);
  } else {
    targetCalories = tdee;
  }

  // Macro calculation based on goal
  let proteinRatio = 0.3;
  let fatRatio = 0.25;
  let carbsRatio = 0.45;

  if (goal === 'კუნთოვანი მასა') {
    proteinRatio = 0.3;
    fatRatio = 0.25;
    carbsRatio = 0.45;
  } else if (goal === 'წონის დაკლება') {
    proteinRatio = 0.35; // high protein for satiety and muscle sparing
    fatRatio = 0.25;
    carbsRatio = 0.4;
  } else if (goal === 'ჯანსაღი კვება') {
    proteinRatio = 0.25;
    fatRatio = 0.25;
    carbsRatio = 0.5;
  }

  const proteinCalories = targetCalories * proteinRatio;
  const fatCalories = targetCalories * fatRatio;
  const carbsCalories = targetCalories * carbsRatio;

  const proteinGrams = Math.round(proteinCalories / 4);
  const fatGrams = Math.round(fatCalories / 9);
  const carbsGrams = Math.round(carbsCalories / 4);

  // Water: 35ml per kg body weight + buffer
  const dailyWaterLiters = Number(((weightKg * 35) / 1000).toFixed(1));

  return {
    age,
    gender,
    heightCm,
    weightKg,
    activityLevel,
    goal,
    bmr,
    tdee,
    targetDailyCalories: targetCalories,
    macros: {
      proteinGrams,
      proteinPercent: Math.round(proteinRatio * 100),
      fatGrams,
      fatPercent: Math.round(fatRatio * 100),
      carbsGrams,
      carbsPercent: Math.round(carbsRatio * 100),
    },
    dailyWaterLiters,
  };
}
