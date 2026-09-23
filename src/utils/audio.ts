/**
 * Audio helpers for cooking timer chime
 */

export function playKitchenTimerSound() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Play a friendly two-tone kitchen chime (e.g. 523Hz then 659Hz)
    const now = audioCtx.currentTime;

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(start);
      osc.stop(start + duration);
    };

    playTone(523.25, now, 0.4);       // C5
    playTone(659.25, now + 0.2, 0.4); // E5
    playTone(783.99, now + 0.4, 0.8); // G5
  } catch (err) {
    console.warn('AudioContext not supported or blocked:', err);
  }
}

