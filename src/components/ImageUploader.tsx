import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, Sparkles, SlidersHorizontal, Plus, X, Utensils, Check } from 'lucide-react';
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
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [newIngredientInput, setNewIngredientInput] = useState('');
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

  return (
    <div className="bg-white rounded-3xl border border-amber-200/80 shadow-md shadow-amber-900/5 p-5 sm:p-7 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-lg">
            <Utensils className="w-3.5 h-3.5" />
            ნაბიჯი 1
          </span>
          <h2 className="font-serif-geo text-xl sm:text-2xl font-bold text-stone-900 mt-1">
            აჩვენეთ შეფს თქვენი პროდუქტები
          </h2>
          <p className="text-sm text-stone-600">
            გადაუღეთ ფოტო მაცივარს, მაგიდას ან აირჩიეთ მზა სურათი
          </p>
        </div>

        {/* Preferences Toggle */}
        <button
          type="button"
          onClick={() => setShowPreferences(!showPreferences)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
            showPreferences
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-amber-600" />
          <span>პრეფერენციები</span>
          {preferences.dietary !== 'ყველაფერი' && (
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
          )}
        </button>
      </div>

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
                  ? 'border-amber-500 bg-amber-50/70 scale-[0.99]'
                  : 'border-stone-300 hover:border-amber-400 bg-stone-50/50 hover:bg-amber-50/20'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 shadow-xs">
                <Upload className="w-8 h-8 stroke-[1.8]" />
              </div>

              <h3 className="font-serif-geo text-lg font-semibold text-stone-800 mb-1">
                ჩააგდეთ ფოტო აქ ან ატვირთეთ
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-sm mb-5">
                გადაუღეთ ფოტო მაცივარში ან მაგიდაზე არსებულ ინგრედიენტებს
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm transition-all"
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
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-stone-900 group aspect-[4/3] max-h-[360px] flex items-center justify-center">
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
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
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
                        ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-400/40 shadow-xs'
                        : 'border-stone-200 hover:border-amber-300 bg-stone-50/60 hover:bg-amber-50/30'
                    }`}
                  >
                    <img
                      src={preset.imageUrl}
                      alt={preset.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm text-stone-900 truncate">
                          {preset.title}
                        </h4>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-amber-800/90 font-medium truncate mt-0.5">
                        {preset.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {preset.likelyIngredients.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-white text-stone-600 px-1.5 py-0.5 rounded-md border border-stone-200"
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
          <div className="mt-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-700">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950">
                    რამდენ ადამიანზე ვამზადებთ?
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    ინგრედიენტების დოზები და კალორიები მოერგება ამ რაოდენობას
                  </p>
                </div>
              </div>

              {/* Stepper with count */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-amber-300 shadow-2xs">
                <button
                  type="button"
                  onClick={() =>
                    onPreferencesChange({
                      ...preferences,
                      servings: Math.max(1, preferences.servings - 1),
                    })
                  }
                  className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 flex items-center justify-center transition-colors disabled:opacity-40"
                  disabled={preferences.servings <= 1}
                  title="შემცირება"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <div className="min-w-[48px] text-center px-1">
                  <span className="font-serif-geo text-base font-extrabold text-amber-950 block leading-tight">
                    {preferences.servings}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold block leading-none">
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
                  className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 flex items-center justify-center transition-colors"
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
                        : 'bg-white hover:bg-amber-100/60 text-stone-700 border-amber-200/70 hover:border-amber-400'
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
          <div className="mt-4 pt-3 border-t border-stone-100">
            <button
              type="button"
              disabled={!selectedImage || isLoading}
              onClick={onAnalyze}
              className={`w-full py-4 px-6 rounded-2xl font-serif-geo text-base font-bold flex items-center justify-center gap-3 transition-all shadow-md ${
                !selectedImage || isLoading
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white shadow-amber-900/20 active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>შეფი ამზადებს რეცეპტებს...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>შეფ, შემომთავაზე რეცეპტები!</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Preferences Drawer */}
      {showPreferences && (
        <div className="mt-6 pt-6 border-t border-stone-200/80 grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Dietary options */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              კვების რეჟიმი / შეზღუდვა
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  'ყველაფერი',
                  'ვეგეტარიანული',
                  'სამარხვო',
                  'დაბალკალორიული',
                  'სწრაფი 20 წთ',
                ] as const
              ).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onPreferencesChange({ ...preferences, dietary: mode })}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border text-left font-medium transition-all ${
                    preferences.dietary === mode
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Servings & Meal Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              პორციის რაოდენობა & კვება
            </label>
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 4, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onPreferencesChange({ ...preferences, servings: num })}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    preferences.servings === num
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {num} {num === 1 ? 'პერსონა' : 'პერსონა'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              {(['ნებისმიერი', 'საუზმე', 'სადილი', 'ვახშამი'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onPreferencesChange({ ...preferences, mealType: type })}
                  className={`flex-1 py-1 rounded-md text-[11px] font-medium border ${
                    preferences.mealType === type
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-600 border-stone-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Ingredients & Extra Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              დაამატეთ ინგრედიენტი (რაც ფოტოზე არ ჩანს)
            </label>
            <div className="flex items-center gap-2 mb-2">
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
                className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={addExtraIngredient}
                className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-xl text-xs"
                title="დამატება"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {preferences.additionalIngredients.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {preferences.additionalIngredients.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-xs px-2 py-0.5 rounded-md"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeExtraIngredient(item)}
                      className="text-amber-700 hover:text-amber-950"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <input
              type="text"
              placeholder="დამატებითი სურვილი (მაგ: ნაკლები ცხიმი, ცხარე...)"
              value={preferences.extraNote}
              onChange={(e) =>
                onPreferencesChange({ ...preferences, extraNote: e.target.value })
              }
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
