import { DietPlanTarget } from '../types/dietPlan';

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
  doesSports?: boolean;
  sportsDaysPerWeek?: number;
  sportsHoursPerDay?: number;
  sportsType?: string;
  goal: 'წონის დაკლება' | 'წონის მატება' | 'კუნთოვანი მასა' | 'შენარჩუნება' | 'ჯანსაღი კვება';
}): DietPlanTarget {
  const {
    age,
    gender,
    heightCm,
    weightKg,
    activityLevel,
    doesSports = false,
    sportsDaysPerWeek = 3,
    sportsHoursPerDay = 1,
    sportsType = 'ფიტნესი / ძალისმიერი / კარდიო',
    goal,
  } = params;

  // Mifflin-St Jeor equation for basal metabolic rate
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr = gender === 'კაცი' ? bmr + 5 : bmr - 161;
  bmr = Math.round(bmr);

  let tdee: number;

  if (doesSports) {
    // Calculated daily average sport energy expenditure
    // Typical moderate-vigorous activity burns ~6-7 kcal/kg/hour
    const weeklySportsHours = (sportsDaysPerWeek || 3) * (sportsHoursPerDay || 1);
    const hourlyBurnPerKg = 6.5;
    const weeklyBurn = weeklySportsHours * weightKg * hourlyBurnPerKg;
    const dailySportsBurn = Math.round(weeklyBurn / 7);

    // Base sedentary multiplier 1.2 plus sports burn
    const baseSedentary = bmr * 1.2;
    tdee = Math.round(baseSedentary + dailySportsBurn);
  } else {
    // Standard activity multipliers
    const activityMultipliers: Record<string, number> = {
      მჯდომარე: 1.2,
      ზომიერი: 1.375,
      აქტიური: 1.55,
      'ძალიან აქტიური': 1.725,
    };
    const multiplier = activityMultipliers[activityLevel] || 1.375;
    tdee = Math.round(bmr * multiplier);
  }

  // Goal adjustment
  let targetDailyCalories = tdee;
  if (goal === 'წონის დაკლება') {
    // Safe clinical deficit (~20%)
    targetDailyCalories = Math.max(1200, Math.round(tdee * 0.8));
  } else if (goal === 'წონის მატება' || goal === 'კუნთოვანი მასა') {
    // Progressive clinical surplus (+15%)
    targetDailyCalories = Math.round(tdee * 1.15);
  } else {
    // Maintenance
    targetDailyCalories = tdee;
  }

  // Macro distribution based on goal & sports activity
  let proteinRatio = 0.3;
  let fatRatio = 0.25;
  let carbsRatio = 0.45;

  if (goal === 'წონის მატება' || goal === 'კუნთოვანი მასა') {
    proteinRatio = doesSports ? 0.32 : 0.28;
    fatRatio = 0.25;
    carbsRatio = 1 - (proteinRatio + fatRatio);
  } else if (goal === 'წონის დაკლება') {
    // Higher protein to spare lean muscle and promote satiety
    proteinRatio = doesSports ? 0.35 : 0.32;
    fatRatio = 0.28;
    carbsRatio = 1 - (proteinRatio + fatRatio);
  } else {
    // Balanced maintenance
    proteinRatio = doesSports ? 0.28 : 0.25;
    fatRatio = 0.27;
    carbsRatio = 1 - (proteinRatio + fatRatio);
  }

  const proteinCalories = targetDailyCalories * proteinRatio;
  const fatCalories = targetDailyCalories * fatRatio;
  const carbsCalories = targetDailyCalories * carbsRatio;

  const proteinGrams = Math.round(proteinCalories / 4);
  const fatGrams = Math.round(fatCalories / 9);
  const carbsGrams = Math.round(carbsCalories / 4);

  // Water requirement: 35ml/kg + additional hydration for sports
  const baseWater = (weightKg * 35) / 1000;
  const sportsWater = doesSports ? (sportsHoursPerDay || 1) * 0.5 : 0;
  const dailyWaterLiters = Number((baseWater + sportsWater).toFixed(1));

  return {
    age,
    gender,
    heightCm,
    weightKg,
    activityLevel,
    doesSports,
    sportsDaysPerWeek,
    sportsHoursPerDay,
    sportsType,
    goal,
    bmr,
    tdee,
    targetDailyCalories,
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
