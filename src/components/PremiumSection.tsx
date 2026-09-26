import React, { useState, useRef } from 'react';
import { PlateCalorieResult } from '../types/chef';
import { calculateDietTargets } from '../utils/dietCalculations';
import {
  Camera,
  Upload,
  Zap,
  Flame,
  Activity,
  Heart,
  Droplets,
  Dumbbell,
  Sparkles,
  CheckCircle2,
  Lock,
  RefreshCw,
  Utensils,
  ChevronRight,
  Info,
  Apple,
  Clock,
  Award,
} from 'lucide-react';

interface PremiumSectionProps {
  isPremium: boolean;
  onTogglePremium: (active: boolean) => void;
  onOpenDietPlan: () => void;
  onOpenDietPlanWithParams?: (params: {
    age: number;
    gender: 'ქალი' | 'კაცი';
    heightCm: number;
    weightKg: number;
    doesSports: boolean;
    sportsDaysPerWeek: number;
    sportsHoursPerDay: number;
    sportsType: string;
    goal: 'წონის კლება' | 'წონის მატება (კუნთოვანი მასა)' | 'წონის შენარჩუნება';
  }) => void;
}

const PRESET_PLATES = [
  {
    id: 'salmon',
    title: 'ორაგულის სტეიკი ბრინჯითა და ბროკოლით',
    category: 'ჯანსაღი ვახშამი',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
    mockResult: {
      dishName: 'შემწვარი ორაგული ბასმათი ბრინჯითა და ორთქლზე მომზადებული ბროკოლით',
      confidence: 'მაღალი (98%)',
      estimatedWeightGrams: 420,
      totalCalories: 585,
      macros: { proteinGrams: 42, carbsGrams: 48, fatGrams: 23, fiberGrams: 6 },
      items: [
        { name: 'ორაგულის ფილე (კანით)', portion: '160გ', calories: 330, protein: '34გ', fat: '21გ', carbs: '0გ' },
        { name: 'მოხარშული ბასმათი ბრინჯი', portion: '150გ', calories: 195, protein: '4გ', fat: '0.8გ', carbs: '43გ' },
        { name: 'ბროკოლი (ორთქლზე)', portion: '100გ', calories: 35, protein: '3გ', fat: '0.4გ', carbs: '5გ' },
        { name: 'ზეითუნის ზეთი და ლიმონი', portion: '5მლ', calories: 25, protein: '0გ', fat: '2.8გ', carbs: '0გ' },
      ],
      healthScore: 94,
      dietitianFeedback: 'იდეალურად დაბალანსებული თეფში: მდიდარია ომეგა-3 ცხიმოვანი მჟავებით, სუფთა ცილით და რთული ნახშირწყლებით.',
      sportsFit: 'შესანიშნავია ვარჯიშის შემდგომი ცილოვანი აღდგენისთვის ან წონის ჯანსაღი კლებისთვის.',
    } as PlateCalorieResult,
  },
  {
    id: 'chicken_salad',
    title: 'ქათმის ფილე და ცეზარის სალათი',
    category: 'მაღალცილოვანი სადილი',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    mockResult: {
      dishName: 'გრილზე შემწვარი ქათმის მკერდი ცეზარის სალათითა და პარმეზანით',
      confidence: 'მაღალი (96%)',
      estimatedWeightGrams: 360,
      totalCalories: 460,
      macros: { proteinGrams: 48, carbsGrams: 14, fatGrams: 22, fiberGrams: 4 },
      items: [
        { name: 'ქათმის ფილე გრილზე', portion: '180გ', calories: 260, protein: '42გ', fat: '6გ', carbs: '0გ' },
        { name: 'რომაული სალათის ფურცლები', portion: '100გ', calories: 18, protein: '1.2გ', fat: '0.3გ', carbs: '3გ' },
        { name: 'პარმეზანი (გახეხილი)', portion: '25გ', calories: 105, protein: '9გ', fat: '7.5გ', carbs: '0.5გ' },
        { name: 'სოუსი ცეზარი (მსუბუქი)', portion: '25გ', calories: 77, protein: '0.8გ', fat: '8გ', carbs: '1.5გ' },
      ],
      healthScore: 89,
      dietitianFeedback: 'ძალიან მაღალი ცილოვანი შემცველობა და მინიმალური ნახშირწყლები. ხელს უწყობს კუნთის შენარჩუნებას.',
      sportsFit: 'რეკომენდებულია მშრალი კუნთოვანი მასის შენარჩუნებისთვის და წონის სწრაფი კლების ფაზაში.',
    } as PlateCalorieResult,
  },
  {
    id: 'steak_bowl',
    title: 'საქონლის სტეიკი ბოსტნეულით',
    category: 'ძალისმიერი ვახშამი',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    mockResult: {
      dishName: 'საქონლის ანტრეკოტი გამომცხვარი ასპარაგუსითა და ბულგარულით',
      confidence: 'მაღალი (95%)',
      estimatedWeightGrams: 380,
      totalCalories: 620,
      macros: { proteinGrams: 52, carbsGrams: 16, fatGrams: 38, fiberGrams: 5 },
      items: [
        { name: 'საქონლის სტეიკი (მედიუმი)', portion: '200გ', calories: 480, protein: '48გ', fat: '32გ', carbs: '0გ' },
        { name: 'გამომცხვარი ასპარაგუსი', portion: '90გ', calories: 25, protein: '2.5გ', fat: '0.3გ', carbs: '4გ' },
        { name: 'შემწვარი ბულგარული წიწაკა', portion: '80გ', calories: 35, protein: '1.5გ', fat: '0.5გ', carbs: '7გ' },
        { name: 'კარაქი და მწვანილი', portion: '10გ', calories: 80, protein: '0.1გ', fat: '9გ', carbs: '0.1გ' },
      ],
      healthScore: 88,
      dietitianFeedback: 'მდიდარია რკინით, თუთიით, B12 ვიტამინითა და სრულფასოვანი ამინომჟავებით.',
      sportsFit: 'იდეალურია ძალისმიერი ვარჯიშის შემდგომ ტესტოსტერონის და ენერგიის ასამაღლებლად.',
    } as PlateCalorieResult,
  },
  {
    id: 'khachapuri',
    title: 'იმერული ხაჭაპური (1 ულუფა / ნაჭერი)',
    category: 'ტრადიციული კერძი',
    imageUrl: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=80',
    mockResult: {
      dishName: 'იმერული ხაჭაპური (ნატურალური იმერული ყველით)',
      confidence: 'მაღალი (99%)',
      estimatedWeightGrams: 280,
      totalCalories: 740,
      macros: { proteinGrams: 32, carbsGrams: 64, fatGrams: 40, fiberGrams: 3 },
      items: [
        { name: 'საფუვრიანი ცომი', portion: '150გ', calories: 410, protein: '10გ', fat: '4გ', carbs: '62გ' },
        { name: 'იმერული ყველი (ცხიმიანი)', portion: '120გ', calories: 300, protein: '22გ', fat: '26გ', carbs: '1.5გ' },
        { name: 'კარაქი გადასასმელად', portion: '10გ', calories: 72, protein: '0.1გ', fat: '8.2გ', carbs: '0.1გ' },
      ],
      healthScore: 72,
      dietitianFeedback: 'მაღალკალორიული და ენერგეტიკულად მდიდარი კერძი. კალციუმისა და ცილის კარგი წყაროა, თუმცა ცხიმები და ნახშირწყლები მაღალია.',
      sportsFit: 'რეკომენდებულია ზომიერი მიღება წონის კლებისას. გამოსადეგია ინტენსიური ვარჯიშის წინ ენერგიის დასაგროვებლად.',
    } as PlateCalorieResult,
  },
];

export const PremiumSection: React.FC<PremiumSectionProps> = ({
  isPremium,
  onTogglePremium,
  onOpenDietPlan,
  onOpenDietPlanWithParams,
}) => {
  const [activeTab, setActiveTab] = useState<'plate_calories' | 'dietitian_sports'>('plate_calories');

  // Plate Calories state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [selectedPlateImage, setSelectedPlateImage] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [plateNotes, setPlateNotes] = useState<string>('');
  const [plateResult, setPlateResult] = useState<PlateCalorieResult | null>(null);
  const [isAnalyzingPlate, setIsAnalyzingPlate] = useState<boolean>(false);
  const [plateError, setPlateError] = useState<string | null>(null);

  // Dietitian & Sports parameters state
  const [dietAge, setDietAge] = useState<number>(28);
  const [dietGender, setDietGender] = useState<'ქალი' | 'კაცი'>('ქალი');
  const [dietHeight, setDietHeight] = useState<number>(168);
  const [dietWeight, setDietWeight] = useState<number>(68);
  const [doesSports, setDoesSports] = useState<boolean>(true);
  const [sportsDays, setSportsDays] = useState<number>(3);
  const [sportsHours, setSportsHours] = useState<number>(1);
  const [sportsType, setSportsType] = useState<string>('ფიტნესი / ძალისმიერი');
  const [dietGoal, setDietGoal] = useState<'წონის კლება' | 'წონის მატება (კუნთოვანი მასა)' | 'წონის შენარჩუნება'>('წონის კლება');

  // Computed metabolic values
  const activityLevel = !doesSports
    ? 'მჯდომარე'
    : sportsDays <= 2
    ? 'ზომიერი'
    : sportsDays <= 4
    ? 'აქტიური'
    : 'ძალიან აქტიური';

  const mappedGoal =
    dietGoal === 'წონის კლება'
      ? 'წონის დაკლება'
      : dietGoal === 'წონის მატება (კუნთოვანი მასა)'
      ? 'წონის მატება'
      : 'შენარჩუნება';

  const calculatedTargets = calculateDietTargets({
    age: dietAge,
    gender: dietGender,
    heightCm: dietHeight,
    weightKg: dietWeight,
    activityLevel,
    goal: mappedGoal,
    doesSports,
    sportsDaysPerWeek: sportsDays,
    sportsHoursPerDay: sportsHours,
  });

  const handleSelectPresetPlate = (preset: (typeof PRESET_PLATES)[0]) => {
    setSelectedPresetId(preset.id);
    setSelectedPlateImage(preset.imageUrl);
    setPlateResult(preset.mockResult);
    setPlateError(null);
  };

  const handlePlateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setSelectedPlateImage(event.target.result);
          setSelectedPresetId('');
          setPlateResult(null);
          // If premium, automatically trigger analyze
          if (isPremium) {
            triggerPlateAnalysis(event.target.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerPlateAnalysis = async (imgData?: string) => {
    if (!isPremium) {
      onTogglePremium(true);
      return;
    }

    const targetImage = imgData || selectedPlateImage;
    if (!targetImage) {
      setPlateError('გთხოვთ, ჯერ ატვირთეთ ან გადაიღეთ თეფშის ფოტო, ან ქვემოთ აირჩიეთ მზა ნიმუში.');
      return;
    }

    // Check if preset selected and already has result
    const matchedPreset = PRESET_PLATES.find((p) => p.id === selectedPresetId);
    if (matchedPreset && !imgData && !plateNotes) {
      setPlateResult(matchedPreset.mockResult);
      return;
    }

    setIsAnalyzingPlate(true);
    setPlateError(null);

    try {
      const res = await fetch('/api/chef/analyze-plate-calories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: targetImage,
          notes: plateNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'კალორიების ანალიზი ვერ მოხერხდა');
      }

      setPlateResult(data);
    } catch (err: any) {
      console.warn('Analysis error:', err);
      // Fallback to closest preset or friendly error
      if (matchedPreset) {
        setPlateResult(matchedPreset.mockResult);
      } else {
        setPlateError(err?.message || 'შეცდომა კალორიების დათვლისას. გთხოვთ სცადოთ მკაფიო ფოტოთი.');
      }
    } finally {
      setIsAnalyzingPlate(false);
    }
  };

  const handleGeneratePlan = () => {
    if (onOpenDietPlanWithParams) {
      onOpenDietPlanWithParams({
        age: dietAge,
        gender: dietGender,
        heightCm: dietHeight,
        weightKg: dietWeight,
        doesSports,
        sportsDaysPerWeek: sportsDays,
        sportsHoursPerDay: sportsHours,
        sportsType,
        goal: dietGoal,
      });
    } else {
      onOpenDietPlan();
    }
  };

  return (
    <section
      id="premium-section"
      className="relative rounded-3xl p-6 sm:p-9 border-2 border-amber-400/80 dark:border-amber-500/50 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/15 dark:from-stone-900 dark:via-stone-900/95 dark:to-stone-850 shadow-xl overflow-hidden space-y-8 transition-all"
    >
      {/* Decorative Gold Glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-44 h-44 bg-orange-400/20 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 pb-4 border-b border-amber-300/60 dark:border-stone-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-black uppercase tracking-wider shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-white" />
              VIP & პრემიუმ სივრცე
            </span>
            {isPremium ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                აქტიურია (ყველა ფუნქცია გახსნილია)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-200/80 dark:bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-400/70 dark:border-amber-800">
                <Lock className="w-3.5 h-3.5" />
                პრემიუმ სექცია ჩაკეტილია
              </span>
            )}
          </div>

          <h2 className="font-serif-geo text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            პრემიუმ პაკეტი: კალორიების დათვლა & შეფ-დიეტოლოგი
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
            მთლიანი თეფშის ან კერძის ზუსტი კალორიების ანალიზი ფოტოთი + პერსონალური შეფ-დიეტოლოგი სპორტული აქტივობისა და მიზნის მიხედვით.
          </p>
        </div>

        {/* Status / Activation Toggle Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          {!isPremium ? (
            <button
              type="button"
              onClick={() => onTogglePremium(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-serif-geo font-bold text-xs sm:text-sm shadow-lg shadow-amber-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>გააქტიურება</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onTogglePremium(false)}
              className="px-4 py-2.5 rounded-2xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs transition-colors cursor-pointer"
            >
              პრემიუმის გათიშვა
            </button>
          )}
        </div>
      </div>

      {/* Locked State Container when not premium */}
      {!isPremium ? (
        <div className="relative z-10 bg-white/90 dark:bg-stone-900/90 rounded-3xl p-6 sm:p-10 border-2 border-dashed border-amber-400 dark:border-amber-600/70 shadow-lg text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/70 border-2 border-amber-400 dark:border-amber-600 flex items-center justify-center text-amber-700 dark:text-amber-400 mx-auto shadow-md">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 dark:text-amber-400" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800">
              🔒 VIP / პრემიუმ სექცია ჩაკეტილია
            </span>
            <h3 className="font-serif-geo text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              გახსენით მზა თეფშის კალორიები & შეფ-დიეტოლოგი
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              ეს სექცია ჩაკეტილია. ფუნქციების და ფოტოთი კალორიების ანალიზის გასახსნელად დააჭირეთ ქვემოთ ღილაკს <strong>„გააქტიურება“</strong> ან აირჩიეთ სასურველი პაკეტი.
            </p>
          </div>

          {/* 2 Feature Cards Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-stone-800/70 border border-amber-200 dark:border-stone-700 space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-200/80 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-lg">📸</span>
                <h4 className="font-serif-geo font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                  მზა თეფშის კალორიები
                </h4>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                გადაუღეთ ან ატვირთეთ მზა თეფშის ფოტო — სისტემა მომენტალურად დაითვლის მთლიან კალორიებს, ცილებს, ცხიმებს, ნახშირწყლებს და თითოეული პროდუქტის წილს.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-stone-800/70 border border-amber-200 dark:border-stone-700 space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-200/80 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-lg">🥗</span>
                <h4 className="font-serif-geo font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                  შეფ-დიეტოლოგი & სპორტული აქტივობა
                </h4>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                მიუთითეთ წონა, ასაკი, სიმაღლე, სქესი, ვარჯიშის გრაფიკი (კვირაში რამდენჯერ და დღეში რამდენ საათს ვარჯიშობთ) და მიიღეთ პერსონალური კვების გეგმა.
              </p>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={() => onTogglePremium(true)}
              className="px-8 py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white rounded-2xl font-serif-geo font-bold text-sm sm:text-base shadow-xl shadow-amber-900/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-2.5"
            >
              <Zap className="w-5 h-5 fill-white" />
              <span>გააქტიურება — ფუნქციების გახსნა</span>
              <Sparkles className="w-4 h-4 text-amber-200" />
            </button>

            <button
              type="button"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline block mx-auto cursor-pointer"
            >
              სატარიფო პაკეტების ნახვა (1, 2, 3 და 6 თვე) →
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Tabs Switcher: Plate Calories vs Dietitian & Sports */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
            <button
              type="button"
              onClick={() => setActiveTab('plate_calories')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                activeTab === 'plate_calories'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/25 ring-2 ring-amber-400/40'
                  : 'bg-white/80 dark:bg-stone-850 hover:bg-white dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border-amber-200 dark:border-stone-700'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                  activeTab === 'plate_calories'
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                }`}
              >
                📸
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider block opacity-90">
                  ფუნქცია 1
                </span>
                <span className="font-serif-geo text-sm sm:text-base font-bold block leading-tight">
                  მზა თეფშის / კერძის კალორიები
                </span>
                <span className="text-[11px] opacity-80 block mt-0.5">
                  თეფშის ანალიზი, ზუსტი კალორიები, ცილები, ცხიმები, ნახშირწყლები
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dietitian_sports')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                activeTab === 'dietitian_sports'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/25 ring-2 ring-amber-400/40'
                  : 'bg-white/80 dark:bg-stone-850 hover:bg-white dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border-amber-200 dark:border-stone-700'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                  activeTab === 'dietitian_sports'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                }`}
              >
                🥗
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider block opacity-90">
                  ფუნქცია 2
                </span>
                <span className="font-serif-geo text-sm sm:text-base font-bold block leading-tight">
                  შეფ-დიეტოლოგი & სპორტული აქტივობა
                </span>
                <span className="text-[11px] opacity-80 block mt-0.5">
                  წონა, ასაკი, სიმაღლე, სქესი, ვარჯიშის გრაფიკი და 1-თვიანი გეგმა
                </span>
              </div>
            </button>
          </div>

      {/* TAB 1: PLATE CALORIE ANALYZER */}
      {activeTab === 'plate_calories' && (
        <div className="space-y-6 animate-in fade-in duration-200 relative z-10">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePlateFileChange}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handlePlateFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Image preview / upload */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-amber-300 dark:border-stone-700 bg-stone-900 aspect-[4/3] max-h-[300px] relative group flex items-center justify-center shadow-md">
                {selectedPlateImage ? (
                  <img
                    src={selectedPlateImage}
                    alt="Ready food plate"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 text-stone-300 dark:text-stone-400 z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 dark:bg-stone-800/80 border border-white/20 dark:border-stone-700 flex items-center justify-center mx-auto mb-3">
                      <Camera className="w-7 h-7 text-amber-400" />
                    </div>
                    <p className="text-sm font-serif-geo font-bold text-white">გადაუღეთ ან ატვირთეთ თეფშის ფოტო</p>
                    <p className="text-xs text-stone-400 mt-1">ან ქვემოთ აირჩიეთ მზა თეფშის ნიმუში</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 px-3 bg-stone-900/90 hover:bg-black text-white text-xs font-bold rounded-xl backdrop-blur-sm border border-stone-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>ატვირთვა</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex-1 py-2 px-3 bg-amber-600/90 hover:bg-amber-700 text-white text-xs font-bold rounded-xl backdrop-blur-sm border border-amber-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>გადაღება</span>
                  </button>
                </div>
              </div>

              {/* Sample Plates for Quick Testing */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 block mb-2">
                  ან გამოსცადეთ მზა თეფშებით:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_PLATES.map((p) => {
                    const isSelected = selectedPresetId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPresetPlate(p)}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-500 ring-1 ring-amber-400'
                            : 'bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-750 border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-bold text-stone-900 dark:text-stone-100 truncate block">
                            {p.title}
                          </span>
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 block">
                            {p.category}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Note input & Analyze CTA */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="მინიშნება შეფს (მაგ: უცხიმო, ზეთის გარეშე მომზადდა...)"
                  value={plateNotes}
                  onChange={(e) => setPlateNotes(e.target.value)}
                  className="w-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                <button
                  type="button"
                  onClick={() => triggerPlateAnalysis()}
                  disabled={isAnalyzingPlate}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-serif-geo font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAnalyzingPlate ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>კალორიების ზუსტი დათვლა...</span>
                    </>
                  ) : (
                    <>
                      <Flame className="w-4 h-4 text-amber-300" />
                      <span>თეფშის კალორიების ანალიზი</span>
                    </>
                  )}
                </button>
              </div>

              {plateError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900">
                  {plateError}
                </p>
              )}
            </div>

            {/* Right Column: Exact Calorie Breakdown Results */}
            <div className="lg:col-span-7">
              {plateResult ? (
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 border border-amber-300/80 dark:border-stone-700 shadow-md space-y-5">
                  {/* Result Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/70 px-2 py-0.5 rounded-md">
                        {plateResult.confidence} სიზუსტე • {plateResult.estimatedWeightGrams} გრამი
                      </span>
                      <h3 className="font-serif-geo text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                        {plateResult.dishName}
                      </h3>
                    </div>

                    <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-xl text-center shrink-0 shadow-sm">
                      <span className="text-[10px] uppercase font-black block tracking-wider opacity-90">
                        სრული ენერგია
                      </span>
                      <span className="font-serif-geo text-xl sm:text-2xl font-black block leading-none">
                        {plateResult.totalCalories}
                      </span>
                      <span className="text-[10px] font-bold block opacity-90">კკალ</span>
                    </div>
                  </div>

                  {/* Macros Breakdown Bar */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
                      <span className="text-[10px] text-rose-700 dark:text-rose-400 font-bold block uppercase">
                        ცილა
                      </span>
                      <span className="text-base font-black text-rose-900 dark:text-rose-300">
                        {plateResult.macros.proteinGrams}გ
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block uppercase">
                        ნახშირწყალი
                      </span>
                      <span className="text-base font-black text-amber-900 dark:text-amber-300">
                        {plateResult.macros.carbsGrams}გ
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900">
                      <span className="text-[10px] text-orange-700 dark:text-orange-400 font-bold block uppercase">
                        ცხიმი
                      </span>
                      <span className="text-base font-black text-orange-900 dark:text-orange-300">
                        {plateResult.macros.fatGrams}გ
                      </span>
                    </div>
                  </div>

                  {/* Individual Products Calorie Table */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 mb-2 flex items-center justify-between">
                      <span>თეფშის შემადგენელი პროდუქტები:</span>
                      <span className="text-stone-500 font-normal">კალორია & მაკროები</span>
                    </h4>
                    <div className="space-y-1.5">
                      {plateResult.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700 text-xs"
                        >
                          <div>
                            <span className="font-bold text-stone-900 dark:text-stone-100 block">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-stone-500 dark:text-stone-400">
                              ულუფა: {item.portion} • ცილა: {item.protein} • ცხიმი: {item.fat}
                            </span>
                          </div>
                          <span className="font-extrabold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-1 rounded-lg shrink-0">
                            {item.calories} კკალ
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dietitian & Sports Advice */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-amber-50 dark:from-stone-800 dark:to-stone-850 border border-emerald-200/80 dark:border-stone-700 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold">
                      <Award className="w-4 h-4" />
                      <span>დიეტოლოგის შეფასება (ინდექსი: {plateResult.healthScore}/100)</span>
                    </div>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {plateResult.dietitianFeedback}
                    </p>
                    <div className="pt-1 text-[11px] text-amber-900 dark:text-amber-400 font-medium">
                      🏋️‍♂️ <strong>სპორტული რეკომენდაცია:</strong> {plateResult.sportsFit}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[260px] bg-white dark:bg-stone-900 rounded-2xl p-6 border border-dashed border-stone-300 dark:border-stone-700 flex flex-col items-center justify-center text-center space-y-3">
                  <Flame className="w-10 h-10 text-amber-500 animate-pulse" />
                  <div>
                    <h4 className="font-serif-geo text-base font-bold text-stone-800 dark:text-stone-200">
                      აირჩიეთ ან ატვირთეთ მზა თეფშის ფოტო
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mt-1">
                      შეფი დეტალურად დაშლის თითოეულ ლუკმას, დაითვლის ზუსტ კალორიებს, ცილებს, ცხიმებს და ნახშირწყლებს.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHEF DIETITIAN & SPORTS ACTIVITY PLAN */}
      {activeTab === 'dietitian_sports' && (
        <div className="space-y-6 animate-in fade-in duration-200 relative z-10">
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-7 border border-amber-300/80 dark:border-stone-700 shadow-md space-y-6">
            {/* Header */}
            <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/70 px-2.5 py-1 rounded-md">
                კლინიკური შეფ-დიეტოლოგი & სპორტული გათვლები
              </span>
              <h3 className="font-serif-geo text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                პერსონალური კვების გეგმა თქვენი ფიზიკური პარამეტრებით
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                მიუთითეთ მონაცემები და სპორტული აქტივობა — შეფი ზუსტად გამოთვლის საჭირო კალორაჟს წონის კლებისთვის ან მატებისთვის.
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Age */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">ასაკი (წელი)</label>
                <input
                  type="number"
                  min={14}
                  max={95}
                  value={dietAge}
                  onChange={(e) => setDietAge(Number(e.target.value) || 25)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">სქესი</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['ქალი', 'კაცი'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setDietGender(g)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        dietGender === g
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">სიმაღლე (სმ)</label>
                <input
                  type="number"
                  min={120}
                  max={230}
                  value={dietHeight}
                  onChange={(e) => setDietHeight(Number(e.target.value) || 170)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Weight */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">წონა (კგ)</label>
                <input
                  type="number"
                  min={35}
                  max={250}
                  value={dietWeight}
                  onChange={(e) => setDietWeight(Number(e.target.value) || 70)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Sports Activity Block (Crucial requirement from prompt) */}
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-800/70 border border-amber-300/80 dark:border-stone-700 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 dark:text-amber-300">
                      სპორტული აქტივობა & ვარჯიში
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      რამდენად ხშირად და ინტენსიურად ვარჯიშობთ
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={doesSports}
                    onChange={(e) => setDoesSports(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded-md focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    დავდივარ სპორტზე
                  </span>
                </label>
              </div>

              {doesSports && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {/* Days per week */}
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      კვირაში რამდენჯერ? ({sportsDays} დღე)
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5, 6].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSportsDays(day)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            sportsDays === day
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hours per day */}
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      დღეში რამდენი საათი? ({sportsHours} სთ)
                    </label>
                    <div className="flex items-center gap-1">
                      {[0.5, 1, 1.5, 2].map((hr) => (
                        <button
                          key={hr}
                          type="button"
                          onClick={() => setSportsHours(hr)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            sportsHours === hr
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {hr}სთ
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sports Type */}
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      ვარჯიშის ტიპი
                    </label>
                    <select
                      value={sportsType}
                      onChange={(e) => setSportsType(e.target.value)}
                      className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 dark:text-stone-100 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="ფიტნესი / ძალისმიერი">ფიტნესი / ძალისმიერი</option>
                      <option value="კარდიო / სირბილი">კარდიო / სირბილი</option>
                      <option value="ცურვა">ცურვა</option>
                      <option value="ფეხბურთი / კალათბურთი">სათამაშო სპორტი</option>
                      <option value="იოგა / პილატესი">იოგა / გაწელვები</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Goal Selector */}
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                თქვენი მთავარი მიზანი
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'წონის კლება', label: 'წონის კლება (დეფიციტი)', icon: '📉' },
                  { id: 'წონის მატება (კუნთოვანი მასა)', label: 'წონის მატება / კუნთი (სურპლუსი)', icon: '📈' },
                  { id: 'წონის შენარჩუნება', label: 'წონის შენარჩუნება / ტონუსი', icon: '⚖️' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDietGoal(item.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      dietGoal === item.id
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Computed Summary Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 text-center">
                <span className="text-[10px] text-stone-500 dark:text-stone-400 font-bold block uppercase">
                  სამიზნე კალორია
                </span>
                <span className="text-lg font-black text-amber-950 dark:text-amber-300">
                  {calculatedTargets.targetDailyCalories} კკალ
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
                <span className="text-[10px] text-stone-500 dark:text-stone-400 font-bold block uppercase">
                  დღიური ხარჯი (TDEE)
                </span>
                <span className="text-lg font-black text-stone-800 dark:text-stone-200">
                  {calculatedTargets.tdee} კკალ
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
                <span className="text-[10px] text-stone-500 dark:text-stone-400 font-bold block uppercase">
                  ცილა / დღეში
                </span>
                <span className="text-lg font-black text-stone-800 dark:text-stone-200">
                  ~{calculatedTargets.macros.proteinGrams}გ
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-center">
                <span className="text-[10px] text-blue-700 dark:text-blue-400 font-bold block uppercase">
                  წყლის ნორმა
                </span>
                <span className="text-lg font-black text-blue-950 dark:text-blue-300">
                  {calculatedTargets.dailyWaterLiters} ლ/დღეში
                </span>
              </div>
            </div>

            {/* Launch Diet Plan CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGeneratePlan}
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-serif-geo font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-amber-900/20 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>1-თვიანი კლინიკური კვების გეგმის შედგენა (4 კვირა, ზუსტი საათებით & საყიდლების სიით)</span>
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </section>
  );
};
