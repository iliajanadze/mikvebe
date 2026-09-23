import React, { useState, useEffect } from 'react';
import { Recipe, RecipeStep } from '../types/chef';
import { X, ChevronLeft, ChevronRight, Timer, Play, Pause, RotateCcw, Check } from 'lucide-react';
import { playKitchenTimerSound } from '../utils/audio';

interface CookingModeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({ recipe, onClose }) => {
  if (!recipe) return null;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Timer state for the current step
  const currentStep = recipe.steps[currentStepIndex];
  const initialStepSeconds = (currentStep?.durationMinutes || 0) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(initialStepSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    // Reset timer when step changes
    const secs = (recipe.steps[currentStepIndex]?.durationMinutes || 0) * 60;
    setSecondsRemaining(secs);
    setIsTimerRunning(false);
  }, [currentStepIndex, recipe]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            playKitchenTimerSound();
            alert('🔔 ტაიმერის დრო ამოიწურა!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  const handleClose = () => {
    onClose();
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-amber-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                მომზადების რეჟიმი
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100/90 text-amber-950 border border-amber-200">
                👥 {recipe.servings || 2} ადამიანზე
              </span>
            </div>
            <h3 className="font-serif-geo text-lg font-bold text-stone-900 truncate max-w-md mt-0.5">
              {recipe.title}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 h-1.5">
          <div
            className="bg-amber-600 h-1.5 transition-all duration-300"
            style={{
              width: `${((currentStepIndex + 1) / recipe.steps.length) * 100}%`,
            }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              ნაბიჯი {currentStepIndex + 1} / {recipe.steps.length}
            </span>
          </div>

          <div>
            <h4 className="font-serif-geo text-xl sm:text-2xl font-bold text-stone-900 mb-3">
              {currentStep.title}
            </h4>
            <p className="text-base sm:text-lg text-stone-700 leading-relaxed">
              {currentStep.instruction}
            </p>
          </div>

          {currentStep.tip && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80">
              <span className="text-xs font-bold text-amber-900 block mb-1">
                💡 შეფის რჩევა ამ ეტაპზე:
              </span>
              <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                {currentStep.tip}
              </p>
            </div>
          )}

          {/* Built-in Step Timer */}
          {currentStep.durationMinutes && currentStep.durationMinutes > 0 ? (
            <div className="p-5 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600/30 flex items-center justify-center text-amber-400">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-400 block font-medium">ეტაპის ტაიმერი</span>
                  <span className="text-2xl font-mono font-bold tracking-wider text-amber-400">
                    {formatTimer(secondsRemaining)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-sm"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isTimerRunning ? 'პაუზა' : 'დაწყება'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setSecondsRemaining(initialStepSeconds);
                  }}
                  className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition-all"
                  title="თავიდან დაწყება"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex((prev) => prev - 1)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              currentStepIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-stone-100 border-stone-200 text-stone-400'
                : 'bg-white hover:bg-stone-100 border-stone-300 text-stone-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>წინა ნაბიჯი</span>
          </button>

          {currentStepIndex < recipe.steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStepIndex((prev) => prev + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all"
            >
              <span>შემდეგი ნაბიჯი</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
            >
              <Check className="w-4 h-4" />
              <span>მომზადება დასრულდა!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
