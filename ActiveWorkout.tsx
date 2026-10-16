import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import {
  ExerciseDefinition,
  Language,
  SessionExerciseRecord,
  WorkoutSession,
} from '../types';
import { ExerciseCard } from './ExerciseCard';
import { RestTimer } from './RestTimer';
import { WorkoutSummary } from './WorkoutSummary';
import { useTranslation } from '../locales/i18n';
import { playTick, playTimerFinish } from '../services/sound';

interface Props {
  week: number;
  level: number;
  exercises: ExerciseDefinition[];
  language: Language;
  soundEnabled: boolean;
  defaultRestDuration: number;
  onFinishSession: (session: WorkoutSession) => void;
  onCancelWorkout: () => void;
}

type WorkoutStage = 'warmup' | 'exercises' | 'cooldown' | 'summary';

export const ActiveWorkout: React.FC<Props> = ({
  week,
  level,
  exercises,
  language,
  soundEnabled,
  defaultRestDuration,
  onFinishSession,
  onCancelWorkout,
}) => {
  const t = useTranslation(language);
  const isRtl = language === 'ur';

  // Active enabled exercises
  const activeExercises = exercises.filter((e) => e.enabled);

  // Initialize session records
  const [exerciseRecords, setExerciseRecords] = useState<SessionExerciseRecord[]>(() =>
    activeExercises.map((ex) => ({
      exerciseId: ex.id,
      exerciseName: ex.name[language] || ex.name.en,
      category: ex.category,
      type: ex.type,
      status: 'pending',
      targetValue: ex.currentValue,
      actualValue: ex.currentValue,
      targetSets: ex.sets,
      actualSets: ex.sets,
      completedSets: 0,
    }))
  );

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [stage, setStage] = useState<WorkoutStage>('warmup');
  const [warmupCompleted, setWarmupCompleted] = useState(false);
  const [cooldownCompleted, setCooldownCompleted] = useState(false);

  // Total session timer
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // 5-min Warm-up timer state (300 seconds)
  const [warmupSecondsLeft, setWarmupSecondsLeft] = useState(300);
  const [isWarmupRunning, setIsWarmupRunning] = useState(false);

  // 5-min Cooldown timer state (300 seconds)
  const [cooldownSecondsLeft, setCooldownSecondsLeft] = useState(300);
  const [isCooldownRunning, setIsCooldownRunning] = useState(false);

  // Active rest timer modal/panel
  const [activeRestSeconds, setActiveRestSeconds] = useState<number | null>(null);

  // Completed session ready for summary modal
  const [completedSession, setCompletedSession] = useState<WorkoutSession | null>(null);

  // Overall session elapsed ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Warmup countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (stage === 'warmup' && isWarmupRunning && warmupSecondsLeft > 0) {
      interval = setInterval(() => {
        setWarmupSecondsLeft((prev) => {
          if (prev <= 4 && prev > 1) playTick(soundEnabled);
          if (prev <= 1) {
            clearInterval(interval!);
            setIsWarmupRunning(false);
            setWarmupCompleted(true);
            playTimerFinish(soundEnabled);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stage, isWarmupRunning, warmupSecondsLeft, soundEnabled]);

  // Cooldown countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (stage === 'cooldown' && isCooldownRunning && cooldownSecondsLeft > 0) {
      interval = setInterval(() => {
        setCooldownSecondsLeft((prev) => {
          if (prev <= 4 && prev > 1) playTick(soundEnabled);
          if (prev <= 1) {
            clearInterval(interval!);
            setIsCooldownRunning(false);
            setCooldownCompleted(true);
            playTimerFinish(soundEnabled);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stage, isCooldownRunning, cooldownSecondsLeft, soundEnabled]);

  // Update specific exercise record
  const handleUpdateRecord = (updated: SessionExerciseRecord) => {
    setExerciseRecords((prev) =>
      prev.map((rec) => (rec.exerciseId === updated.exerciseId ? updated : rec))
    );
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < activeExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Finished all exercises, advance to cooldown
      setStage('cooldown');
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const calculateTotalReps = () => {
    return exerciseRecords.reduce((acc, rec) => {
      // Exclude skipped exercises
      if (rec.status === 'skipped') return acc;
      if (rec.type === 'reps') {
        return acc + rec.actualValue * rec.completedSets;
      }
      return acc;
    }, 0);
  };

  const handleInitiateSummary = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const sessionObj: WorkoutSession = {
      id: `session-${Date.now()}`,
      date: todayStr,
      timestamp: Date.now(),
      week,
      level,
      durationSeconds: Math.max(1, sessionSeconds),
      warmupCompleted,
      cooldownCompleted,
      exercises: exerciseRecords,
      totalReps: calculateTotalReps(),
      notes: '',
    };
    setCompletedSession(sessionObj);
    setStage('summary');
  };

  const handleSaveFinalSession = (notes: string) => {
    if (!completedSession) return;
    const finalSession: WorkoutSession = {
      ...completedSession,
      notes,
    };
    onFinishSession(finalSession);
  };

  const formatTimerDigits = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentExercise = activeExercises[currentExerciseIndex];
  const currentRecord = exerciseRecords[currentExerciseIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Session Progress Bar */}
      <div className="bg-[#17241D] border border-[#29372F] rounded-2xl p-4 mb-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#B7FF4A]/15 border border-[#B7FF4A]/40 flex items-center justify-center text-[#B7FF4A]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#9DAFA6] uppercase tracking-wider block">
              {t.sessionDuration}
            </span>
            <span className="text-lg font-black tabular-nums text-[#F4F7F4]">
              {formatTimerDigits(sessionSeconds)}
            </span>
          </div>
        </div>

        {/* Stage Pills */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span
            className={`px-3 py-1 rounded-full font-semibold transition ${
              stage === 'warmup'
                ? 'bg-[#B7FF4A] text-[#0B1110]'
                : warmupCompleted
                ? 'bg-[#43D98B]/20 text-[#43D98B]'
                : 'text-[#9DAFA6]'
            }`}
          >
            1. Warm-Up
          </span>
          <span className="text-[#29372F]">/</span>
          <span
            className={`px-3 py-1 rounded-full font-semibold transition ${
              stage === 'exercises'
                ? 'bg-[#B7FF4A] text-[#0B1110]'
                : 'text-[#9DAFA6]'
            }`}
          >
            2. Exercises
          </span>
          <span className="text-[#29372F]">/</span>
          <span
            className={`px-3 py-1 rounded-full font-semibold transition ${
              stage === 'cooldown'
                ? 'bg-[#B7FF4A] text-[#0B1110]'
                : cooldownCompleted
                ? 'bg-[#43D98B]/20 text-[#43D98B]'
                : 'text-[#9DAFA6]'
            }`}
          >
            3. Cooldown
          </span>
        </div>

        {/* Exit / Finish Early Button */}
        <button
          onClick={handleInitiateSummary}
          className="px-3.5 py-2 rounded-xl bg-[#29372F] hover:bg-[#3B4F43] text-[#F4F7F4] text-xs font-semibold flex items-center gap-1.5 transition min-h-[44px]"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#B7FF4A]" />
          <span>{t.finishWorkoutEarlyBtn}</span>
        </button>
      </div>

      {/* STAGE 1: WARM-UP */}
      {stage === 'warmup' && (
        <div className="bg-[#17241D] border border-[#29372F] rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#FFAD5A]/15 border border-[#FFAD5A]/40 mx-auto flex items-center justify-center text-[#FFAD5A]">
            <Flame className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-[#F4F7F4] tracking-tight">
              {t.warmupStageTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#9DAFA6] max-w-md mx-auto leading-relaxed">
              {t.warmupStageDesc}
            </p>
          </div>

          {/* Guided warm-up sequence */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto">
            <div className="p-3 rounded-xl bg-[#111A17] border border-[#29372F]">
              <span className="text-[10px] text-[#B7FF4A] font-bold block">01 · 2 MIN</span>
              <h4 className="text-xs font-bold text-[#F4F7F4] mt-0.5">Light Jumping / Jogging</h4>
              <p className="text-[11px] text-[#9DAFA6] mt-1">Elevate heart rate and warm up core body temperature.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#111A17] border border-[#29372F]">
              <span className="text-[10px] text-[#B7FF4A] font-bold block">02 · 1.5 MIN</span>
              <h4 className="text-xs font-bold text-[#F4F7F4] mt-0.5">Arm & Shoulder Rolls</h4>
              <p className="text-[11px] text-[#9DAFA6] mt-1">Lubricate rotator cuffs and chest joints for push-ups.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#111A17] border border-[#29372F]">
              <span className="text-[10px] text-[#B7FF4A] font-bold block">03 · 1.5 MIN</span>
              <h4 className="text-xs font-bold text-[#F4F7F4] mt-0.5">Hip & Leg Swings</h4>
              <p className="text-[11px] text-[#9DAFA6] mt-1">Mobilize pelvis, hamstrings, and ankles for squats.</p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="py-2">
            <span className="text-5xl font-black tabular-nums tracking-tight text-[#B7FF4A]">
              {formatTimerDigits(warmupSecondsLeft)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsWarmupRunning(!isWarmupRunning)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#B7FF4A] text-[#0B1110] font-bold text-sm flex items-center justify-center gap-2 transition min-h-[48px]"
            >
              {isWarmupRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isWarmupRunning ? t.pauseTimerBtn : t.startWarmupTimerBtn}</span>
            </button>

            <button
              onClick={() => {
                setWarmupCompleted(true);
                setStage('exercises');
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#29372F] hover:bg-[#34463C] text-[#F4F7F4] font-semibold text-sm flex items-center justify-center gap-2 transition min-h-[48px]"
            >
              <span>{t.finishWarmupBtn}</span>
              {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                setWarmupCompleted(false); // records skipped
                setStage('exercises');
              }}
              className="text-xs text-[#9DAFA6] hover:text-[#FFAD5A] px-3 py-2 transition min-h-[44px] flex items-center"
            >
              <span>{t.skipWarmupBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: MAIN EXERCISES */}
      {stage === 'exercises' && currentExercise && currentRecord && (
        <div className="space-y-4">
          <ExerciseCard
            exercise={currentExercise}
            record={currentRecord}
            currentIndex={currentExerciseIndex}
            totalExercises={activeExercises.length}
            language={language}
            soundEnabled={soundEnabled}
            onUpdateRecord={handleUpdateRecord}
            onNext={handleNextExercise}
            onPrev={handlePrevExercise}
            onRequestRest={(restSecs) => setActiveRestSeconds(restSecs || defaultRestDuration)}
          />

          {/* Active Rest Timer (Embedded directly when requested) */}
          {activeRestSeconds !== null && (
            <div className="mt-4 animate-fade-in">
              <RestTimer
                initialSeconds={activeRestSeconds}
                soundEnabled={soundEnabled}
                language={language}
                onFinish={() => setActiveRestSeconds(null)}
                onClose={() => setActiveRestSeconds(null)}
              />
            </div>
          )}
        </div>
      )}

      {/* STAGE 3: COOLDOWN */}
      {stage === 'cooldown' && (
        <div className="bg-[#17241D] border border-[#29372F] rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#43D98B]/15 border border-[#43D98B]/40 mx-auto flex items-center justify-center text-[#43D98B]">
            <Sparkles className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-[#F4F7F4] tracking-tight">
              {t.cooldownStageTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#9DAFA6] max-w-md mx-auto leading-relaxed">
              {t.cooldownStageDesc}
            </p>
          </div>

          {/* Guided Cooldown steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto">
            <div className="p-3 rounded-xl bg-[#111A17] border border-[#29372F]">
              <span className="text-[10px] text-[#43D98B] font-bold block">01 · 2 MIN</span>
              <h4 className="text-xs font-bold text-[#F4F7F4] mt-0.5">Hamstring & Quad Fold</h4>
              <p className="text-[11px] text-[#9DAFA6] mt-1">Slow static hold to decompress spine and leg muscles.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#111A17] border border-[#29372F]">
              <span className="text-[10px] text-[#43D98B] font-bold block">02 · 1.5 MIN</span>
              <h4 className="text-xs font-bold text-[#F4F7F4] mt-0.5">Child’s Pose & Chest Lean</h4>
              <p className="text-[11px] text-[#9DAFA6] mt-1">Open thoracic spine, latissimus, and chest wall.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#111A17] border border-[#29372F]">
              <span className="text-[10px] text-[#43D98B] font-bold block">03 · 1.5 MIN</span>
              <h4 className="text-xs font-bold text-[#F4F7F4] mt-0.5">Deep Belly Breathing</h4>
              <p className="text-[11px] text-[#9DAFA6] mt-1">Activate parasympathetic state for optimal muscle repair.</p>
            </div>
          </div>

          <div className="py-2">
            <span className="text-5xl font-black tabular-nums tracking-tight text-[#43D98B]">
              {formatTimerDigits(cooldownSecondsLeft)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsCooldownRunning(!isCooldownRunning)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#43D98B] text-[#0B1110] font-bold text-sm flex items-center justify-center gap-2 transition min-h-[48px]"
            >
              {isCooldownRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isCooldownRunning ? t.pauseTimerBtn : t.startCooldownTimerBtn}</span>
            </button>

            <button
              onClick={() => {
                setCooldownCompleted(true);
                handleInitiateSummary();
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#B7FF4A] text-[#0B1110] font-bold text-sm flex items-center justify-center gap-2 transition min-h-[48px]"
            >
              <span>{t.finishCooldownBtn}</span>
            </button>

            <button
              onClick={() => {
                setCooldownCompleted(false);
                handleInitiateSummary();
              }}
              className="text-xs text-[#9DAFA6] hover:text-[#FFAD5A] px-3 py-2 transition min-h-[44px] flex items-center"
            >
              <span>{t.skipCooldownBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: SUMMARY CELEBRATION MODAL */}
      {stage === 'summary' && completedSession && (
        <WorkoutSummary
          session={completedSession}
          language={language}
          soundEnabled={soundEnabled}
          onSave={handleSaveFinalSession}
          onCancel={onCancelWorkout}
        />
      )}
    </div>
  );
};
