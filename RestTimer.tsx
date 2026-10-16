import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Plus, X, Bell } from 'lucide-react';
import { playTick, playTimerFinish } from '../services/sound';
import { Language } from '../types';
import { useTranslation } from '../locales/i18n';

interface Props {
  initialSeconds: number;
  soundEnabled: boolean;
  language: Language;
  onFinish?: () => void;
  onClose?: () => void;
}

export const RestTimer: React.FC<Props> = ({
  initialSeconds,
  soundEnabled,
  language,
  onFinish,
  onClose,
}) => {
  const t = useTranslation(language);
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setTotalSeconds(initialSeconds);
    setTimeLeft(initialSeconds);
    setIsRunning(true);
    setIsFinished(false);
  }, [initialSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 4 && prev > 1) {
            playTick(soundEnabled);
          }
          if (prev <= 1) {
            clearInterval(interval!);
            setIsRunning(false);
            setIsFinished(true);
            playTimerFinish(soundEnabled);
            if (onFinish) onFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, soundEnabled, onFinish]);

  const toggleRun = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setTimeLeft(totalSeconds);
    setIsRunning(true);
    setIsFinished(false);
  };

  const addTime = (secs: number) => {
    setTotalSeconds((prev) => prev + secs);
    setTimeLeft((prev) => prev + secs);
    setIsFinished(false);
    if (!isRunning) setIsRunning(true);
  };

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-[#17241D] border border-[#29372F] rounded-2xl p-4 sm:p-5 shadow-lg relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-[#9DAFA6] hover:text-[#F4F7F4] rounded-lg hover:bg-[#111A17] transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-[#B7FF4A]" />
        <h4 className="text-sm font-bold text-[#F4F7F4]">{t.restTimerTitle}</h4>
        {isFinished && (
          <span className="text-xs font-semibold text-[#43D98B] animate-pulse">
            {language === 'ur' ? 'وقت ختم!' : 'Rest Complete!'}
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Circular Progress & Digits */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#29372F"
              strokeWidth="7"
            />
            {/* Foreground animated ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={isFinished ? '#43D98B' : '#B7FF4A'}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black tabular-nums tracking-tight text-[#F4F7F4]">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] text-[#9DAFA6] uppercase tracking-wider">
              {isRunning ? t.timerRunning : isFinished ? 'Done' : t.timerPaused}
            </span>
          </div>
        </div>

        {/* Quick Duration Buttons & Controls */}
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 justify-center sm:justify-start">
            {[30, 45, 60, 90].map((dur) => (
              <button
                key={dur}
                onClick={() => {
                  setTotalSeconds(dur);
                  setTimeLeft(dur);
                  setIsRunning(true);
                  setIsFinished(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer min-h-[36px] ${
                  totalSeconds === dur && !isFinished
                    ? 'bg-[#B7FF4A] text-[#0B1110]'
                    : 'bg-[#111A17] border border-[#29372F] text-[#9DAFA6] hover:text-[#F4F7F4]'
                }`}
              >
                {dur}s
              </button>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <button
              onClick={toggleRun}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#29372F] hover:bg-[#34463C] text-[#F4F7F4] text-xs font-semibold flex items-center justify-center gap-1.5 transition min-h-[44px]"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? t.pauseTimerBtn : t.resumeTimerBtn}</span>
            </button>

            <button
              onClick={() => addTime(15)}
              className="px-3 py-2 rounded-xl bg-[#111A17] border border-[#29372F] hover:border-[#B7FF4A] text-[#B7FF4A] text-xs font-semibold flex items-center justify-center gap-1 transition min-h-[44px]"
              title="Add 15 seconds"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.add15sBtn}</span>
            </button>

            <button
              onClick={resetTimer}
              className="p-2 rounded-xl bg-[#111A17] border border-[#29372F] text-[#9DAFA6] hover:text-[#F4F7F4] transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              title={t.resetTimerBtn}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
