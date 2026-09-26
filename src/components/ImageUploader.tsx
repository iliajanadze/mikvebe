import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, Sparkles, SlidersHorizontal, Plus, Minus, Users, X, Utensils, Check } from 'lucide-react';
import { PRESET_IMAGES, PresetImage } from '../data/presets';
import { UserPreferences } from '../types/chef';

interface ImageUploaderProps {
  selectedImage: string | null;
  selectedPreset: string | null;
  onImageSelected: (base64: string, presetId: string | null) => void;
  onClearImage: () => void;
  preferences: UserPreferences;
  onPreferencesChange: (prefs: UserPreferences) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  isPremium?: boolean;
  onOpenPremium?: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  selectedImage,
  selectedPreset,
  onImageSelected,
  onClearImage,
  preferences,
  onPreferencesChange,
  onAnalyze,
  isLoading,
  isPremium = false,
  onOpenPremium,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [newIngredientInput, setNewIngredientInput] = useState('');
  const [newExcludedInput, setNewExcludedInput] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Handle file drop & selection
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('გთხოვთ აირჩიოთ სურათის ფაილი (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        onImageSelected(e.target.result, null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreset = (preset: PresetImage) => {
    onImageSelected(preset.imageUrl, preset.id);
  };

  const addExtraIngredient = () => {
    const trimmed = newIngredientInput.trim();
    if (trimmed && !preferences.additionalIngredients.includes(trimmed)) {
      onPreferencesChange({
        ...preferences,
        additionalIngredients: [...preferences.additionalIngredients, trimmed],
      });
      setNewIngredientInput('');
    }
  };

  const removeExtraIngredient = (item: string) => {
    onPreferencesChange({
      ...preferences,
      additionalIngredients: preferences.additionalIngredients.filter((i) => i !== item),
    });
  };

  const addExcludedIngredient = () => {
    const trimmed = newExcludedInput.trim();
    const existing = preferences.excludedIngredients || [];
    if (trimmed && !existing.includes(trimmed)) {
      onPreferencesChange({
        ...preferences,
        excludedIngredients: [...existing, trimmed],
      });
      setNewExcludedInput('');
    }
  };

  const removeExcludedIngredient = (item: string) => {
    onPreferencesChange({
      ...preferences,
      excludedIngredients: (preferences.excludedIngredients || []).filter((i) => i !== item),
    });
  };

  const hasCustomPreferences =
    preferences.dietary !== 'ყველაფერი' ||
    preferences.mealType !== 'ნებისმიერი' ||
    preferences.servings !== 2 ||
    preferences.additionalIngredients.length > 0 ||
    (preferences.excludedIngredients && preferences.excludedIngredients.length > 0) ||
    Boolean(preferences.extraNote);

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl border border-amber-200/80 dark:border-stone-800 shadow-md shadow-amber-900/5 p-5 sm:p-7 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg">
              <Utensils className="w-3.5 h-3.5" />
              ფოტოთი ძებნა
            </span>
            {isPremium ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-800">
                💎 კალორიების სრული დათვლა აქტიურია
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-lg border border-stone-200 dark:border-stone-700">
                ✨ უფასო რეჟიმი (კალორიების გარეშე, რეცეპტები და ინგრედიენტები)
              </span>
            )}
          </div>
          <h2 className="font-serif-geo text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            აჩვენეთ შეფს თქვენი პროდუქტები
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            გადაუღეთ ფოტო მაცივარს ან პროდუქტებს — შეფი ამოიცნობს ინგრედიენტებს და შეგიდგენთ მკაცრად 2 შემწვარ, 2 მოხარშულ და 2 წვნიან კერძს!
          </p>
        </div>

        {/* Preferences Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreferences(!showPreferences)}
            id="btn-chef-preferences"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border shadow-xs cursor-pointer ${
              showPreferences
                ? 'bg-amber-600 text-white border-amber-600 ring-2 ring-amber-400/40'
                : hasCustomPreferences
                ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border-amber-400 dark:border-amber-700'
                : 'bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>პრეფერენციები</span>
            {hasCustomPreferences && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {/* Active Preferences Indicator Chips Banner */}
      {hasCustomPreferences && !showPreferences && (
        <div className="mb-5 p-3 rounded-2xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-amber-950 dark:text-amber-300 uppercase tracking-wider mr-1">
              აქტიური პრეფერენციები:
            </span>
            {preferences.dietary !== 'ყველაფერი' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-200/80 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 text-xs font-bold border border-amber-300 dark:border-amber-700">
                🌱 {preferences.dietary}
              </span>
            )}
            {preferences.mealType !== 'ნებისმიერი' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-950 dark:text-orange-200 text-xs font-bold border border-orange-200 dark:border-orange-800">
                🍽️ {preferences.mealType}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold border border-stone-200 dark:border-stone-600">
              👥 {preferences.servings} პერსონა
            </span>
            {preferences.additionalIngredients.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                +{preferences.additionalIngredients.length} დამატებული
              </span>
            )}
            {preferences.excludedIngredients && preferences.excludedIngredients.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800">
                🚫 გამორიცხულია: {preferences.excludedIngredients.join(', ')}
              </span>
            )}
            {preferences.extraNote && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-900 dark:text-sky-300 text-xs font-bold border border-sky-200 dark:border-sky-800 truncate max-w-xs">
                📝 {preferences.extraNote}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowPreferences(true)}
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer shrink-0"
          >
            შეცვლა
          </button>
        </div>
      )}

      {/* Prominent Preferences Drawer directly below header in full view */}
      {showPreferences && (
        <div className="mb-6 p-5 sm:p-6 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 dark:from-stone-850 dark:to-stone-800 rounded-3xl border-2 border-amber-400 dark:border-amber-600 shadow-md space-y-5 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between border-b border-amber-200 dark:border-stone-700 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-600 text-white shadow-xs">
                <SlidersHorizontal className="w-4 h-4" />
              </span>
              <h3 className="font-serif-geo text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                შეფის პრეფერენციები & შეზღუდვები
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowPreferences(false)}
              className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-stone-700 transition-colors cursor-pointer"
              title="დახურვა"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Dietary options */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                კვების რეჟიმი / შეზღუდვა
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {(
                  [
                    { id: 'ყველაფერი', label: 'ყველაფერი (შეზღუდვის გარეშე)', icon: '🍽️' },
                    { id: 'ვეგეტარიანული', label: 'ვეგეტარიანული (უხორცო)', icon: '🌱' },
                    { id: 'სამარხვო', label: 'სამარხვო (მცენარეული)', icon: '🌿' },
                    { id: 'დაბალკალორიული', label: 'დაბალკალორიული (უცხიმო)', icon: '🥗' },
                    { id: 'სწრაფი 20 წთ', label: 'სწრაფი (მაქს. 20 წუთი)', icon: '⚡' },
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => onPreferencesChange({ ...preferences, dietary: mode.id })}
                    className={`text-xs px-3 py-2 rounded-xl border text-left font-bold transition-all flex items-center justify-between cursor-pointer ${
                      preferences.dietary === mode.id
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <span>{mode.icon} {mode.label}</span>
                    {preferences.dietary === mode.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Type & Servings */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                  კერძის ტიპი
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      { id: 'ნებისმიერი', label: 'ნებისმიერი', icon: '🍽️' },
                      { id: 'საუზმე', label: 'საუზმე', icon: '🍳' },
                      { id: 'სადილი', label: 'სადილი', icon: '🍲' },
                      { id: 'ვახშამი', label: 'ვახშამი', icon: '🌙' },
                    ] as const
                  ).map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => onPreferencesChange({ ...preferences, mealType: type.id })}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between cursor-pointer ${
                        preferences.mealType === type.id
                          ? 'bg-stone-900 dark:bg-amber-600 text-white border-stone-900 dark:border-amber-600 shadow-xs'
                          : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span>{type.icon} {type.label}</span>
                      {preferences.mealType === type.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                  პორციის რაოდენობა
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => onPreferencesChange({ ...preferences, servings: num })}
                      className={`py-2 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                        preferences.servings === num
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white dark:bg-stone-800 hover:bg-amber-50 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {num} კაცი
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Ingredients & Exclusions */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                  დამატებითი ინგრედიენტები (რაც გაქვთ)
                </label>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <input
                    type="text"
                    placeholder="მაგ: ნიორი, არაჟანი..."
                    value={newIngredientInput}
                    onChange={(e) => setNewIngredientInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addExtraIngredient();
                      }
                    }}
                    className="flex-1 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={addExtraIngredient}
                    className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-xl text-xs cursor-pointer shrink-0"
                    title="დამატება"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {preferences.additionalIngredients.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {preferences.additionalIngredients.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1 bg-amber-200/80 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 text-[11px] px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-800 font-medium"
                      >
                        +{item}
                        <button
                          type="button"
                          onClick={() => removeExtraIngredient(item)}
                          className="text-amber-800 dark:text-amber-400 hover:text-amber-950 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-1.5">
                  გამორიცხული პროდუქტები (არ გამოიყენოს)
                </label>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <input
                    type="text"
                    placeholder="მაგ: ხახვი, სოკო, ღორის ხორცი..."
                    value={newExcludedInput}
                    onChange={(e) => setNewExcludedInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addExcludedIngredient();
                      }
                    }}
                    className="flex-1 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    type="button"
                    onClick={addExcludedIngredient}
                    className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-xl text-xs cursor-pointer shrink-0"
                    title="გამორიცხვა"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {(preferences.excludedIngredients || []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {preferences.excludedIngredients.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1 bg-rose-100 dark:bg-rose-950/80 text-rose-950 dark:text-rose-200 text-[11px] px-2 py-0.5 rounded-md border border-rose-300 dark:border-rose-800 font-medium"
                      >
                        🚫 {item}
                        <button
                          type="button"
                          onClick={() => removeExcludedIngredient(item)}
                          className="text-rose-800 dark:text-rose-400 hover:text-rose-950 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="დამატებითი სურვილი (მაგ: ნაკლები ცხიმი, ცხარე...)"
                  value={preferences.extraNote}
                  onChange={(e) =>
                    onPreferencesChange({ ...preferences, extraNote: e.target.value })
                  }
                  className="w-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-amber-200 dark:border-stone-700">
            <span className="text-xs text-stone-600 dark:text-stone-400">
              ✓ პრეფერენციები მყისიერად ინახება და აისახება რეცეპტების შერჩევისას
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="px-4 py-2 bg-stone-900 dark:bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-stone-800 dark:hover:bg-amber-700 transition-colors cursor-pointer"
              >
                შენახვა & დახურვა
              </button>

              {selectedImage && (
                <button
                  type="button"
                  onClick={() => {
                    setShowPreferences(false);
                    onAnalyze();
                  }}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl text-xs font-bold hover:from-amber-700 hover:to-orange-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>რეცეპტების მომზადება ამ პრეფერენციებით</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Upload / Preview Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dropzone or Selected Image */}
        <div className="lg:col-span-7">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          {!selectedImage ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center min-h-[260px] sm:min-h-[300px] transition-all ${
                dragActive
                  ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 scale-[0.99]'
                  : 'border-stone-300 dark:border-stone-700 hover:border-amber-400 bg-stone-50/50 dark:bg-stone-800/40 hover:bg-amber-50/20'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-4 shadow-xs">
                <Upload className="w-8 h-8 stroke-[1.8]" />
              </div>

              <h3 className="font-serif-geo text-lg font-semibold text-stone-800 dark:text-stone-100 mb-1">
                ჩააგდეთ ფოტო აქ ან ატვირთეთ
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-sm mb-5">
                გადაუღეთ ფოტო მაცივარში ან მაგიდაზე არსებულ ინგრედიენტებს
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm transition-all"
                >
                  <Upload className="w-4 h-4" />
                  ფაილის არჩევა
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm transition-all"
                >
                  <Camera className="w-4 h-4" />
                  კამერით გადაღება
                </button>
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-sm bg-stone-900 group aspect-[4/3] max-h-[360px] flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Selected ingredients"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

              {/* Action overlays on image */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-black/70 hover:bg-black/90 text-white px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-xs flex items-center gap-1.5 transition-all"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  შეცვლა
                </button>
                <button
                  type="button"
                  onClick={onClearImage}
                  className="bg-red-600/80 hover:bg-red-700 text-white p-1.5 rounded-lg text-xs backdrop-blur-xs transition-all"
                  title="წაშლა"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedPreset && (
                <div className="absolute bottom-3 left-3 bg-amber-900/80 backdrop-blur-md text-amber-100 text-xs px-3 py-1.5 rounded-lg font-medium border border-amber-700/50">
                  არჩეულია ნიმუში: {PRESET_IMAGES.find((p) => p.id === selectedPreset)?.title}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Instant Presets */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                ან გამოსცადეთ მზა ნიმუშებით:
              </span>
            </div>

            <div className="space-y-2.5">
              {PRESET_IMAGES.map((preset) => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`w-full text-left flex items-center gap-3 p-2.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/50 ring-2 ring-amber-400/40 shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 hover:border-amber-300 bg-stone-50/60 dark:bg-stone-800/60 hover:bg-amber-50/30'
                    }`}
                  >
                    <img
                      src={preset.imageUrl}
                      alt={preset.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm text-stone-900 dark:text-stone-100 truncate">
                          {preset.title}
                        </h4>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-amber-800/90 dark:text-amber-400 font-medium truncate mt-0.5">
                        {preset.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {preset.likelyIngredients.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-white dark:bg-stone-700 text-stone-600 dark:text-stone-300 px-1.5 py-0.5 rounded-md border border-stone-200 dark:border-stone-600"
                          >
                            {item}
                          </span>
                        ))}
                        {preset.likelyIngredients.length > 3 && (
                          <span className="text-[10px] text-stone-400">
                            +{preset.likelyIngredients.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* People Count / Servings Selector Block */}
          <div className="mt-5 p-4 rounded-2xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200/90 dark:border-stone-700 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-600/10 dark:bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 dark:text-amber-300">
                    რამდენ ადამიანზე ვამზადებთ?
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    ინგრედიენტების დოზები მოერგება ამ რაოდენობას
                  </p>
                </div>
              </div>

              {/* Stepper with count */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 p-1 rounded-xl border border-amber-300 dark:border-stone-700 shadow-2xs">
                <button
                  type="button"
                  onClick={() =>
                    onPreferencesChange({
                      ...preferences,
                      servings: Math.max(1, preferences.servings - 1),
                    })
                  }
                  className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 text-stone-700 dark:text-stone-300 hover:text-amber-900 flex items-center justify-center transition-colors disabled:opacity-40"
                  disabled={preferences.servings <= 1}
                  title="შემცირება"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <div className="min-w-[48px] text-center px-1">
                  <span className="font-serif-geo text-base font-extrabold text-amber-950 dark:text-amber-300 block leading-tight">
                    {preferences.servings}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-bold block leading-none">
                    {preferences.servings === 1 ? 'ადამიანი' : 'ადამიანი'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onPreferencesChange({
                      ...preferences,
                      servings: Math.min(20, preferences.servings + 1),
                    })
                  }
                  className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 text-stone-700 dark:text-stone-300 hover:text-amber-900 flex items-center justify-center transition-colors"
                  title="გაზრდა"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Presets Pills */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 pt-1">
              {[
                { count: 1, label: '1 პერსონა', icon: '👤' },
                { count: 2, label: '2 ადამიანი', icon: '👥' },
                { count: 3, label: '3 ადამიანი', icon: '👨‍👩‍👦' },
                { count: 4, label: '4 ადამიანი', icon: '👨‍👩‍👧‍👦' },
                { count: 6, label: '6+ სუფრა', icon: '🎉' },
              ].map((item) => {
                const isSelected = preferences.servings === item.count;
                return (
                  <button
                    key={item.count}
                    type="button"
                    onClick={() =>
                      onPreferencesChange({
                        ...preferences,
                        servings: item.count,
                      })
                    }
                    className={`py-1.5 px-1 rounded-xl text-center border transition-all text-xs font-semibold flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white dark:bg-stone-900 hover:bg-amber-100/60 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border-amber-200/70 dark:border-stone-700'
                    }`}
                  >
                    <span className="text-xs">{item.icon}</span>
                    <span className="text-[10px] leading-tight font-bold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cooking CTA Button */}
          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              disabled={!selectedImage || isLoading}
              onClick={onAnalyze}
              className={`w-full py-4 px-6 rounded-2xl font-serif-geo text-sm sm:text-base font-bold flex items-center justify-center gap-3 transition-all shadow-md ${
                !selectedImage || isLoading
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white shadow-amber-900/20 active:scale-[0.99] cursor-pointer'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>შეფი ადგენს 6 რეცეპტს (2 შემწვარი, 2 მოხარშული, 2 წვნიანი)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>
                    შეფ, შემომთავაზე 6 კერძი (
                    {preferences.dietary !== 'ყველაფერი' ? `${preferences.dietary} • ` : ''}
                    {preferences.servings} პერსონაზე)!
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
