import React, { useState, useEffect } from 'react';
import {
  DietPlanTarget,
  FullMonthDietPlan,
  WeeklyPlan,
  DailyMealPlan,
  MealRecipe,
} from '../types/dietPlan';
import { calculateDietTargets } from '../utils/dietCalculations';
import { WaterTrackerWidget } from './WaterTrackerWidget';
import {
  Heart,
  Activity,
  Flame,
  Droplets,
  Calendar,
  ShoppingBag,
  Clock,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Award,
  CheckCircle2,
  Printer,
  Copy,
  Info,
  Apple,
  Utensils,
  Dumbbell,
  ShieldCheck,
  RefreshCw,
  Bookmark,
  X,
} from 'lucide-react';

interface DietPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: FullMonthDietPlan | null;
  onSavePlan?: (plan: FullMonthDietPlan) => void;
  isPlanSaved?: boolean;
}

export const DietPlanModal: React.FC<DietPlanModalProps> = ({
  isOpen,
  onClose,
  initialPlan = null,
  onSavePlan,
  isPlanSaved = false,
}) => {
  // Input fields
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<'ქალი' | 'კაცი'>('ქალი');
  const [heightCm, setHeightCm] = useState<number>(168);
  const [weightKg, setWeightKg] = useState<number>(68);
  const [activityLevel, setActivityLevel] = useState<
    'მჯდომარე' | 'ზომიერი' | 'აქტიური' | 'ძალიან აქტიური'
  >('ზომიერი');
  const [goal, setGoal] = useState<
    'წონის დაკლება' | 'კუნთოვანი მასა' | 'შენარჩუნება' | 'ჯანსაღი კვება'
  >('წონის დაკლება');
  const [extraNotes, setExtraNotes] = useState<string>('');

  // Generated state
  const [dietPlan, setDietPlan] = useState<FullMonthDietPlan | null>(initialPlan);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPlan) {
      setDietPlan(initialPlan);
      setAge(initialPlan.target.age);
      setGender(initialPlan.target.gender);
      setHeightCm(initialPlan.target.heightCm);
      setWeightKg(initialPlan.target.weightKg);
      setActivityLevel(initialPlan.target.activityLevel);
      setGoal(initialPlan.target.goal);
    }
  }, [initialPlan]);

  // Active view states
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [activeDayNumber, setActiveDayNumber] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'meals' | 'shopping' | 'hydration' | 'doctorAdvice'>(
    'meals'
  );
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Real-time calculated targets preview
  const liveTarget = calculateDietTargets({
    age,
    gender,
    heightCm,
    weightKg,
    activityLevel,
    goal,
  });

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/chef/generate-diet-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: liveTarget,
          preferences: {
            notes: extraNotes,
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'კვების გეგმის შედგენა ვერ მოხერხდა');
      }

      const plan: FullMonthDietPlan = await response.json();
      setDietPlan(plan);
      setActiveWeek(1);
      setActiveDayNumber(1);
      setActiveTab('meals');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'შეცდომა კვების გეგმის შექმნისას');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    if (!dietPlan) return;
    const text = `1-თვიანი კვების გეგმა (${dietPlan.target.goal})
დღიური კალორაჟი: ${dietPlan.target.targetDailyCalories} კკალ
ცილები: ${dietPlan.target.macros.proteinGrams}გ | ცხიმები: ${dietPlan.target.macros.fatGrams}გ | ნახშირწყლები: ${dietPlan.target.macros.carbsGrams}გ
წყალი: ${dietPlan.target.dailyWaterLiters} ლ/დღეში
შედგენილია კლინიკური დიეტოლოგისა და შეფის მიერ.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentWeekPlan = dietPlan?.weeks.find((w) => w.weekNumber === activeWeek);
  const currentDayPlan = currentWeekPlan?.days.find((d) => d.dayNumber === activeDayNumber);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-amber-200/80 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-amber-200/60 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-geo text-lg sm:text-xl font-bold text-stone-900">
                  კლინიკური დიეტოლოგი & შეფი
                </h3>
                <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  1-თვიანი სრული კვების გეგმა
                </span>
              </div>
              <p className="text-xs text-stone-500">
                პერსონალური კალორაჟი, მაკრონუტრიენტები, 4 კვირის მენიუ და კვირის საყიდლების სია
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Form / Calculator Bar */}
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-600" />
              თქვენი ფიზიკური პარამეტრები & მიზანი
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {/* Age */}
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  ასაკი (წელი)
                </label>
                <input
                  type="number"
                  min="14"
                  max="95"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 text-sm font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">სქესი</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-white rounded-xl border border-stone-300 text-sm font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="ქალი">ქალი</option>
                  <option value="კაცი">კაცი</option>
                </select>
              </div>

              {/* Height */}
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  სიმაღლე (სმ)
                </label>
                <input
                  type="number"
                  min="120"
                  max="230"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 text-sm font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  წონა (კგ)
                </label>
                <input
                  type="number"
                  min="35"
                  max="200"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 text-sm font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Goal */}
              <div className="col-span-2 sm:col-span-1 md:col-span-2">
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  სასურველი მიზანი
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 text-sm font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="წონის დაკლება">წონის დაკლება (ცხიმის კლება)</option>
                  <option value="კუნთოვანი მასა">კუნთოვანი მასის მომატება</option>
                  <option value="შენარჩუნება">წონის შენარჩუნება & ენერგია</option>
                  <option value="ჯანსაღი კვება">ჯანსაღი კვება & დეტოქსი</option>
                </select>
              </div>
            </div>

            {/* Live calculated summary banner */}
            <div className="mt-4 pt-3 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-amber-300 font-bold text-amber-950">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  დღიური კალორაჟი: {liveTarget.targetDailyCalories} კკალ
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-stone-700">
                  🥩 ცილები: <strong>{liveTarget.macros.proteinGrams}გ</strong> ({liveTarget.macros.proteinPercent}%)
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-stone-700">
                  🥑 ცხიმები: <strong>{liveTarget.macros.fatGrams}გ</strong> ({liveTarget.macros.fatPercent}%)
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-stone-700">
                  🌾 ნახშირწყლები: <strong>{liveTarget.macros.carbsGrams}გ</strong> ({liveTarget.macros.carbsPercent}%)
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-50 border border-sky-200 text-sky-800">
                  <Droplets className="w-3.5 h-3.5 text-sky-600" />
                  წყალი: <strong>{liveTarget.dailyWaterLiters} ლ/დღეში</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    დიეტოლოგი ადგენს 1-თვიან გეგმას...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {dietPlan ? 'ხელახლა გენერირება' : '1-თვიანი გეგმის შედგენა'}
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}
          </div>

          {/* If plan is generated */}
          {dietPlan ? (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Doctor Intro & Action Bar */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      კლინიკური დასკვნა
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                      დაბალანსებული მენიუ
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                    „{dietPlan.dietitianIntro}“
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onSavePlan && (
                    <button
                      onClick={() => onSavePlan(dietPlan)}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all ${
                        isPlanSaved
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-amber-600 hover:bg-amber-700 text-white'
                      }`}
                      title="გეგმის შენახვა პირად პროფილში"
                    >
                      <Bookmark className="w-4 h-4" />
                      <span>{isPlanSaved ? 'შენახულია პროფილში' : 'შენახვა პროფილში'}</span>
                    </button>
                  )}
                  <button
                    onClick={handleCopySummary}
                    className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                    title="მონაცემების კოპირება"
                  >
                    <Copy className="w-4 h-4 text-amber-600" />
                    <span>{copied ? 'დაკოპირდა!' : 'კოპირება'}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                    title="გეგმის ამობეჭდვა"
                  >
                    <Printer className="w-4 h-4 text-amber-600" />
                    <span>ბეჭდვა</span>
                  </button>
                </div>
              </div>

              {/* Week Navigation Pills (Week 1, Week 2, Week 3, Week 4) */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-stone-200">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {dietPlan.weeks.map((week) => {
                    const isSelected = activeWeek === week.weekNumber;
                    return (
                      <button
                        key={week.weekNumber}
                        onClick={() => {
                          setActiveWeek(week.weekNumber);
                          setActiveDayNumber(1);
                        }}
                        className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>კვირა {week.weekNumber}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sub tabs: Meals vs Shopping vs Hydration */}
                <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-bold text-stone-700">
                  <button
                    onClick={() => setActiveTab('meals')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                      activeTab === 'meals' ? 'bg-white text-stone-900 shadow-2xs' : 'hover:text-stone-950'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5 text-amber-600" />
                    დღის მენიუ (7 დღე)
                  </button>
                  <button
                    onClick={() => setActiveTab('shopping')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                      activeTab === 'shopping' ? 'bg-white text-stone-900 shadow-2xs' : 'hover:text-stone-950'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                    საყიდლების სია
                  </button>
                  <button
                    onClick={() => setActiveTab('hydration')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                      activeTab === 'hydration' ? 'bg-white text-stone-900 shadow-2xs' : 'hover:text-stone-950'
                    }`}
                  >
                    <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    წყალი & რეჟიმი
                  </button>
                </div>
              </div>

              {/* Tab 1: Day by Day Meals */}
              {activeTab === 'meals' && currentWeekPlan && (
                <div className="space-y-4">
                  {/* Week title & objective */}
                  <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/60">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                      {currentWeekPlan.weekTitle}
                    </span>
                    <p className="text-xs text-stone-600 mt-0.5">
                      <strong>მიზანი:</strong> {currentWeekPlan.weekObjective}
                    </p>
                  </div>

                  {/* Day Pills (Mon - Sun) */}
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                    {currentWeekPlan.days.map((day) => {
                      const isDaySelected = activeDayNumber === day.dayNumber;
                      return (
                        <button
                          key={day.dayNumber}
                          onClick={() => setActiveDayNumber(day.dayNumber)}
                          className={`p-2 rounded-xl text-center border transition-all flex flex-col items-center justify-center ${
                            isDaySelected
                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                              : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                          }`}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 block">
                            დღე {day.dayNumber}
                          </span>
                          <span className="text-xs sm:text-sm font-bold truncate max-w-full">
                            {day.dayName}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Current Day Meals Cards */}
                  {currentDayPlan && (
                    <div className="space-y-4 mt-2">
                      <div className="flex items-center justify-between bg-stone-100/80 px-4 py-2 rounded-xl text-xs font-bold text-stone-700">
                        <span>
                          {currentDayPlan.dayName} - დღიური ჯამი: ~{currentDayPlan.totalDayCalories} კკალ
                        </span>
                        {currentDayPlan.focusNote && (
                          <span className="text-amber-800 text-[11px]">
                            💡 {currentDayPlan.focusNote}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Breakfast */}
                        <MealCard
                          type="საუზმე"
                          icon="🍳"
                          meal={currentDayPlan.breakfast}
                          defaultTime="09:00"
                          badgeColor="bg-amber-100 text-amber-900 border-amber-200"
                        />

                        {/* Snack */}
                        <MealCard
                          type="ჯანსაღი წახემსება"
                          icon="🍎"
                          meal={currentDayPlan.snack}
                          defaultTime="12:00"
                          badgeColor="bg-purple-100 text-purple-900 border-purple-200"
                        />

                        {/* Lunch */}
                        <MealCard
                          type="სადილი"
                          icon="🍲"
                          meal={currentDayPlan.lunch}
                          defaultTime="15:00"
                          badgeColor="bg-orange-100 text-orange-900 border-orange-200"
                        />

                        {/* Dinner */}
                        <MealCard
                          type="ვახშამი"
                          icon="🥗"
                          meal={currentDayPlan.dinner}
                          defaultTime="19:00"
                          badgeColor="bg-emerald-100 text-emerald-900 border-emerald-200"
                        />
                      </div>
                    </div>
                  )}

                  {/* Weekly Tips */}
                  {currentWeekPlan.weeklyTips && currentWeekPlan.weeklyTips.length > 0 && (
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 mt-4">
                      <h5 className="text-xs font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ამ კვირის დიეტოლოგის პრაქტიკული რჩევები:
                      </h5>
                      <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                        {currentWeekPlan.weeklyTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Shopping List */}
              {activeTab === 'shopping' && currentWeekPlan && (
                <div className="space-y-4">
                  <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-amber-600" />
                        კვირა {activeWeek}-ის სრული საყიდლების სია (Shopping List)
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5">
                        სია მოიცავს რეცეპტების <strong>აბსოლუტურად ყველა ინგრედიენტს</strong> (თაფლი, ნიგოზი, ზეთი, სანელებლები, მწვანილი და ა.შ.) ზუსტი რაოდენობებით.
                      </p>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 self-start sm:self-center shrink-0">
                      ✓ 100% ამოწურვადი სია
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {currentWeekPlan.shoppingList.map((categoryGroup, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:border-amber-300 transition-all"
                      >
                        <h5 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-2.5 pb-1.5 border-b border-stone-100 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                          <span>{categoryGroup.category}</span>
                        </h5>
                        <ul className="space-y-2 text-xs text-stone-700">
                          {categoryGroup.items.map((item, itemIdx) => (
                            <li
                              key={itemIdx}
                              className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-stone-50/80 hover:bg-amber-50/50 border border-stone-100 transition-colors"
                            >
                              <span className="font-medium text-stone-800">{item.name}</span>
                              <span className="font-extrabold text-amber-950 bg-amber-100/80 border border-amber-200 px-2 py-0.5 rounded-md text-[11px] shrink-0">
                                {item.quantity}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Hydration & Schedule */}
              {activeTab === 'hydration' && (
                <div className="space-y-4">
                  {/* Interactive Water Tracker Widget with reminders & glasses */}
                  <WaterTrackerWidget targetLiters={dietPlan.hydrationGuidelines.dailyTargetLiters} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Hourly Water Schedule */}
                    <div className="p-4 rounded-2xl bg-white border border-stone-200">
                      <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-sky-600" />
                        საათობრივი წყლის მიღების გრაფიკი
                      </h5>
                      <div className="space-y-2">
                        {dietPlan.hydrationGuidelines.hourlySchedule.map((step, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-100 text-xs"
                          >
                            <span className="font-extrabold text-sky-900 bg-sky-100 px-2 py-0.5 rounded-md shrink-0">
                              {step.time}
                            </span>
                            <span className="text-stone-700 mt-0.5">{step.action}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rules & Clinical Tips */}
                    <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
                      <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        დიეტოლოგის ოქროს წესები
                      </h5>
                      <ul className="space-y-2 text-xs text-stone-600">
                        {dietPlan.hydrationGuidelines.importantRules.map((rule, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-3 border-t border-stone-100">
                        <h6 className="text-[11px] font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                          კლინიკური რეკომენდაციები:
                        </h6>
                        <ul className="space-y-1.5 text-xs text-stone-600">
                          {dietPlan.generalClinicalRecommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty state / placeholder prompt */
            <div className="text-center py-10 px-4 max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center shadow-inner">
                <Apple className="w-7 h-7" />
              </div>
              <h4 className="font-serif-geo text-lg font-bold text-stone-900">
                შეიყვანეთ თქვენი მონაცემები
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                მიუთითეთ ასაკი, სიმაღლე, წონა და მიზანი ზედა ველებში. კლინიკური დიეტოლოგი და შეფი
                შეგიდგენთ სრულ 1-თვიან კვების გეგმას ზუსტი რეცეპტებით, კალორიებითა და საყიდლების
                სიით.
              </p>
              <button
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    დიეტოლოგი ადგენს გეგმას...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    გეგმის შექმნა ახლავე
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component for individual Meal Card
interface MealCardProps {
  type: string;
  icon: string;
  meal: MealRecipe;
  defaultTime?: string;
  badgeColor: string;
}

const MealCard: React.FC<MealCardProps> = ({ type, icon, meal, defaultTime, badgeColor }) => {
  const [showRecipe, setShowRecipe] = useState(false);
  const displayTime = meal.timeSlot || defaultTime;

  return (
    <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-amber-300 transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${badgeColor}`}
            >
              <span>{icon}</span>
              <span>{type}</span>
            </span>

            {displayTime && (
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>{displayTime}</span>
              </span>
            )}
          </div>

          <span className="text-xs font-black text-amber-950 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
            ~{meal.calories} კკალ
          </span>
        </div>

        {/* Meal Name */}
        <h4 className="font-serif-geo text-sm sm:text-base font-bold text-stone-900 leading-snug">
          {meal.name}
        </h4>

        {/* Macros summary */}
        <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium mt-1 mb-2.5">
          <span>🥩 ცილა: {meal.protein}</span>
          <span>•</span>
          <span>🥑 ცხიმი: {meal.fat}</span>
          <span>•</span>
          <span>🌾 ნახშ: {meal.carbs}</span>
        </div>

        {/* Ingredients preview */}
        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
            ინგრედიენტები:
          </span>
          <div className="flex flex-wrap gap-1">
            {meal.ingredients.map((ing, i) => (
              <span
                key={i}
                className="bg-white px-2 py-0.5 rounded-md border border-stone-200 text-stone-700 text-[11px]"
              >
                {ing.name} ({ing.amount})
              </span>
            ))}
          </div>
        </div>

        {/* Recipe / Instructions Toggle */}
        {showRecipe && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-2 animate-in fade-in duration-200">
            <div>
              <span className="font-bold text-amber-950 block mb-0.5">
                👨‍🍳 მომზადების ინსტრუქცია ({meal.cookingTimeMinutes || 10} წთ):
              </span>
              <p className="text-stone-700 leading-relaxed">{meal.instructions}</p>
            </div>
            {meal.prepTip && (
              <p className="text-amber-800 text-[11px] italic bg-white p-2 rounded-lg border border-amber-200">
                💡 <strong>შეფის რჩევა:</strong> {meal.prepTip}
              </p>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowRecipe(!showRecipe)}
        className="mt-3 text-xs font-bold text-amber-700 hover:text-amber-900 self-start inline-flex items-center gap-1 transition-colors"
      >
        <span>{showRecipe ? 'ინსტრუქციის დამალვა' : 'მომზადების წესი'}</span>
        <ChevronRight
          className={`w-3.5 h-3.5 transition-transform ${showRecipe ? 'rotate-90' : ''}`}
        />
      </button>
    </div>
  );
};
