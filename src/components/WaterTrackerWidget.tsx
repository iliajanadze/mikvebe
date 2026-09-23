import React, { useState, useEffect } from 'react';
import { Droplets, Bell, CheckCircle2, Clock, RotateCcw, Sparkles } from 'lucide-react';

interface WaterTrackerProps {
  targetLiters: number;
}

const STORAGE_WATER_KEY = 'mikvebe_water_intake_today';

export const WaterTrackerWidget: React.FC<WaterTrackerProps> = ({ targetLiters = 2.5 }) => {
  const [glassesConsumed, setGlassesConsumed] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WATER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const today = new Date().toDateString();
        if (parsed.date === today) {
          return parsed.count;
        }
      }
    } catch {}
    return 0;
  });

  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  const [lastDrinkTime, setLastDrinkTime] = useState<string>('09:00');

  // Glass volume = 250ml
  const glassVolumeLiters = 0.25;
  const totalGlassesGoal = Math.max(4, Math.round(targetLiters / glassVolumeLiters));
  const currentLiters = Number((glassesConsumed * glassVolumeLiters).toFixed(2));
  const progressPercent = Math.min(100, Math.round((currentLiters / targetLiters) * 100));

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_WATER_KEY,
        JSON.stringify({
          date: new Date().toDateString(),
          count: glassesConsumed,
        })
      );
    } catch {}
  }, [glassesConsumed]);

  const addGlass = () => {
    setGlassesConsumed((prev) => prev + 1);
    const now = new Date();
    const formatted = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    setLastDrinkTime(formatted);
  };

  const removeGlass = () => {
    setGlassesConsumed((prev) => Math.max(0, prev - 1));
  };

  const resetTracker = () => {
    setGlassesConsumed(0);
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50/50 rounded-2xl p-4 sm:p-5 border border-sky-200/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
            <Droplets className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <h4 className="font-serif-geo text-sm sm:text-base font-bold text-sky-950">
              წყლის ბალანსის ქრონომეტრი
            </h4>
            <p className="text-[11px] text-sky-700">
              მიზანი: <strong>{targetLiters} ლიტრი/დღეში</strong> (~{totalGlassesGoal} ჭიქა 250 მლ)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setReminderEnabled(!reminderEnabled)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors flex items-center gap-1 ${
              reminderEnabled
                ? 'bg-sky-100 text-sky-900 border-sky-300'
                : 'bg-stone-100 text-stone-500 border-stone-200'
            }`}
          >
            <Bell className="w-3 h-3 text-sky-600" />
            <span>{reminderEnabled ? 'შეხსენება ჩართულია' : 'შეხსენება გამორთულია'}</span>
          </button>

          {glassesConsumed > 0 && (
            <button
              type="button"
              onClick={resetTracker}
              className="p-1 rounded-lg hover:bg-sky-100 text-sky-600 transition-colors"
              title="განულება"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar & Visual Liters */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-sky-950 flex items-center gap-1">
            <span>მიღებულია:</span>
            <span className="text-sm font-black text-sky-600">{currentLiters} ლ</span>
            <span className="text-stone-400 font-normal">({glassesConsumed} / {totalGlassesGoal} ჭიქა)</span>
          </span>
          <span className="text-sky-800">{progressPercent}%</span>
        </div>

        <div className="h-3 w-full bg-sky-100 rounded-full overflow-hidden p-0.5 border border-sky-200">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Interactive Glasses Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {Array.from({ length: Math.min(10, totalGlassesGoal) }).map((_, i) => {
            const isFilled = i < glassesConsumed;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (isFilled && i === glassesConsumed - 1) {
                    removeGlass();
                  } else {
                    setGlassesConsumed(i + 1);
                  }
                }}
                className={`w-7 h-8 rounded-lg text-xs font-bold transition-transform active:scale-90 flex items-center justify-center border ${
                  isFilled
                    ? 'bg-sky-500 text-white border-sky-600 shadow-2xs'
                    : 'bg-white hover:bg-sky-50 text-sky-700 border-sky-200'
                }`}
                title={`ჭიქა ${i + 1} (250მლ)`}
              >
                🥛
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addGlass}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>+1 ჭიქა (250მლ)</span>
          </button>
        </div>
      </div>

      {/* Schedule recommendation banner */}
      <div className="flex items-center justify-between text-[11px] text-sky-800 bg-white/80 p-2.5 rounded-xl border border-sky-200/60">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span>
            ბოლო მიღება: <strong>{lastDrinkTime}</strong> • შემდეგი რეკომენდებული: 1-1.5 საათში
          </span>
        </div>
        {progressPercent >= 100 && (
          <span className="font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> დღიური ნორმა შესრულებულია!
          </span>
        )}
      </div>
    </div>
  );
};
