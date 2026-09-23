import React, { useEffect, useState } from 'react';
import { Timer, Play, Pause, X, RotateCcw } from 'lucide-react';
import { playKitchenTimerSound } from '../utils/audio';

interface CookingTimerWidgetProps {
  timerData: {
    minutes: number;
    label: string;
  } | null;
  onClose: () => void;
}

export const CookingTimerWidget: React.FC<CookingTimerWidgetProps> = ({ timerData, onClose }) => {
  if (!timerData) return null;

  const [seconds, setSeconds] = useState(timerData.minutes * 60);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    setSeconds(timerData.minutes * 60);
    setIsRunning(true);
  }, [timerData]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            playKitchenTimerSound();
            alert(`⏰ ტაიმერი დასრულდა: ${timerData.label}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds, timerData]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 bg-stone-900 text-white rounded-2xl p-3.5 shadow-2xl border border-stone-700 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
      <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
        <Timer className="w-5 h-5 animate-pulse" />
      </div>

      <div>
        <span className="text-[10px] uppercase font-bold text-stone-400 block max-w-[140px] truncate">
          {timerData.label}
        </span>
        <span className="font-mono text-lg font-bold text-amber-400">
          {formatted}
        </span>
      </div>

      <div className="flex items-center gap-1 ml-2">
        <button
          type="button"
          onClick={() => setIsRunning(!isRunning)}
          className="p-1.5 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-200 transition-colors"
          title={isRunning ? 'პაუზა' : 'გაგრძელება'}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => {
            setSeconds(timerData.minutes * 60);
            setIsRunning(false);
          }}
          className="p-1.5 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-200 transition-colors"
          title="თავიდან"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-stone-400 hover:text-stone-100 transition-colors"
          title="დახურვა"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
