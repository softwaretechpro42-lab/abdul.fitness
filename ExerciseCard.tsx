import React, { useState, useEffect } from 'react';
import {
  Check,
  SkipForward,
  RotateCcw,
  Edit2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Info,
  Clock,
  Flame,
  Plus,
  Minus,
} from 'lucide-react';
import { ExerciseDefinition, Language, SessionExerciseRecord } from '../types';
import { ExerciseIllustration } from './ExerciseIllustration';
import { useTranslation } from '../locales/i18n';
import { playTick, playTimerFinish, playSetComplete } from '../services/sound';

interface Props {
  exercise: ExerciseDefinition;
  record: SessionExerciseRecord;
  currentIndex: number;
  totalExercises: number;
  language: Language;
  soundEnabled: boolean;
  onUpdateRecord: (updated: SessionExerciseRecord) => void;
  onNext: () => void;
  onPrev: () => void;
  onRequestRest: (restSeconds: number) => void;
}

export const ExerciseCard: React.FC<Props> = ({
  exercise,
  record,
  currentIndex,
  totalExercises,
  language,
  soundEnabled,
  onUpdateRecord,
  onNext,
  onPrev,
  onRequestRest,
}) => {
  const t = useTranslation(language);
  const isRtl = language === 'ur';

  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(record.targetValue);
  const [editedSets, setEditedSets] = useState(record.targetSets);

  // Live timer for duration-based exercises or rep pacing
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(record.actualValue);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    setEditedValue(record.targetValue);
    setEditedSets(record.targetSets);
    setLiveSeconds(record.actualValue || record.targetValue);
    setIsTimerRunning(false);
  }, [record.exerciseId, record.targetValue, record.targetSets, record.actualValue]);

  // Countdown/up timer for timed exercises (plank, stretches)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && liveSeconds > 0) {
      interval = setInterval(() => {
        setLiveSeconds((prev) => {
          if (prev <= 4 && prev > 1) {
            playTick(soundEnabled);
          }
          if (prev <= 1) {
            clearInterval(interval!);
            setIsTimerRunning(false);
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
  }, [isTimerRunning, liveSeconds, soundEnabled]);

  const handleSaveEdits = () => {
    onUpdateRecord({
      ...record,
      targetValue: Math.max(1, editedValue),
      actualValue: Math.max(1, editedValue),
      targetSets: Math.max(1, editedSets),
      actualSets: Math.max(1, editedSets),
    });
    setIsEditing(false);
  };

  const handleMarkSetDone = (setIdx: number) => {
    const newCompletedSets = Math.min(record.targetSets, Math.max(record.completedSets, setIdx + 1));
    const isAllSetsDone = newCompletedSets >= record.targetSets;

    playSetComplete(soundEnabled);

    onUpdateRecord({
      ...record,
      completedSets: newCompletedSets,
      actualSets: newCompletedSets,
      status: isAllSetsDone ? 'completed' : 'pending',
    });

    if (!isAllSetsDone) {
      onRequestRest(exercise.restSeconds || 45);
    }
  };

  const handleCompleteExercise = () => {
    playSetComplete(soundEnabled);
    onUpdateRecord({
      ...record,
      status: 'completed',
      completedSets: record.targetSets,
      actualSets: record.targetSets,
      actualValue: record.type === 'seconds' && liveSeconds < record.targetValue ? record.targetValue - liveSeconds : record.targetValue,
    });
    // Trigger rest before next exercise
    onRequestRest(exercise.restSeconds || 45);
  };

  const handleSkipExercise = () => {
    onUpdateRecord({
      ...record,
      status: 'skipped',
      completedSets: 0,
      actualSets: 0,
      actualValue: 0, // exclude skipped reps from actual totals
    });
    onNext();
  };

  const handleUndo = () => {
    onUpdateRecord({
      ...record,
      status: 'pending',
      completedSets: 0,
      actualSets: 0,
    });
  };

  const exerciseName = exercise.name[language] || exercise.name.en;
  const isSeconds = record.type === 'seconds';

  return (
    <div className="bg-[#17241D] border border-[#29372F] rounded-2xl overflow-hidden shadow-2xl transition-all">
      {/* Top Header: Step Counter and Status Badges */}
      <div className="px-5 py-4 border-b border-[#29372F] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#9DAFA6]">
            {t.exercise} {currentIndex + 1} {t.of} {totalExercises}
          </span>
          <span className="text-xs text-[#52665C]">·</span>
          <span className="text-xs text-[#B7FF4A] font-medium capitalize">
            {exercise.category}
          </span>
        </div>

        {/* Status Pill */}
        <div>
          {record.status === 'completed' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#43D98B]/20 text-[#43D98B] border border-[#43D98B]/30 text-xs font-bold">
              <Check className="w-3 h-3" />
              {t.completedBadge}
            </span>
          )}
          {record.status === 'skipped' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFAD5A]/20 text-[#FFAD5A] border border-[#FFAD5A]/30 text-xs font-semibold">
              <SkipForward className="w-3 h-3" />
              {t.skippedBadge}
            </span>
          )}
          {record.status === 'pending' && (
            <span className="text-xs text-[#9DAFA6] font-medium">
              {record.completedSets} / {record.targetSets} {t.sets}
            </span>
          )}
        </div>
      </div>

      {/* Exercise Illustration */}
      <div className="p-4 bg-[#111A17] flex justify-center">
        <ExerciseIllustration iconType={exercise.iconType} className="w-full max-w-sm h-44 object-contain" />
      </div>

      {/* Main Details Body */}
      <div className="p-5 sm:p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#F4F7F4] tracking-tight">
              {exerciseName}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#9DAFA6]">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#FFAD5A]" />
                <strong className="text-[#F4F7F4] tabular-nums">{record.targetValue}</strong>{' '}
                {isSeconds ? t.seconds : t.reps}
              </span>
              <span>·</span>
              <span>
                <strong className="text-[#F4F7F4] tabular-nums">{record.targetSets}</strong> {t.sets}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#B7FF4A]" />
                {exercise.restSeconds}s {t.rest}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="p-2 rounded-xl bg-[#111A17] border border-[#29372F] text-[#9DAFA6] hover:text-[#B7FF4A] transition min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
            title="Form instructions"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Collapsible Form & Technique Instructions */}
        {showInstructions && (
          <div className="p-4 rounded-xl bg-[#111A17] border border-[#29372F] space-y-3 text-xs leading-relaxed animate-fade-in">
            <p className="text-[#F4F7F4]">
              {exercise.instructions[language] || exercise.instructions.en}
            </p>
            <div className="pt-2 border-t border-[#29372F]/60">
              <span className="font-semibold text-[#B7FF4A] block mb-1">
                {language === 'ur' ? 'اہم ہدایات:' : 'Key Form Cues:'}
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-[#9DAFA6]">
                {(exercise.cues[language] || exercise.cues.en).map((cue, idx) => (
                  <li key={idx}>{cue}</li>
                ))}
              </ul>
            </div>
            <div className="pt-1 text-[11px] text-[#9DAFA6]">
              <span className="text-[#52665C]">{language === 'ur' ? 'پٹھے: ' : 'Target Muscles: '}</span>
              {(exercise.targetMuscles[language] || exercise.targetMuscles.en).join(' · ')}
            </div>
          </div>
        )}

        {/* Target Modification Modal/In-place Form */}
        {isEditing ? (
          <div className="p-4 rounded-xl bg-[#111A17] border border-[#B7FF4A]/40 space-y-3">
            <h4 className="text-xs font-bold text-[#B7FF4A]">{t.editTargetBtn}</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[#9DAFA6] block mb-1">
                  {isSeconds ? t.seconds : t.reps}
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditedValue((v) => Math.max(1, v - 1))}
                    className="p-1.5 rounded-lg bg-[#29372F] text-[#F4F7F4]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={editedValue}
                    onChange={(e) => setEditedValue(parseInt(e.target.value) || 1)}
                    className="w-16 text-center py-1 rounded bg-[#17241D] border border-[#29372F] text-sm font-bold text-[#F4F7F4]"
                  />
                  <button
                    onClick={() => setEditedValue((v) => v + 1)}
                    className="p-1.5 rounded-lg bg-[#29372F] text-[#F4F7F4]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#9DAFA6] block mb-1">{t.sets}</label>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditedSets((s) => Math.max(1, s - 1))}
                    className="p-1.5 rounded-lg bg-[#29372F] text-[#F4F7F4]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editedSets}
                    onChange={(e) => setEditedSets(parseInt(e.target.value) || 1)}
                    className="w-16 text-center py-1 rounded bg-[#17241D] border border-[#29372F] text-sm font-bold text-[#F4F7F4]"
                  />
                  <button
                    onClick={() => setEditedSets((s) => s + 1)}
                    className="p-1.5 rounded-lg bg-[#29372F] text-[#F4F7F4]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-lg bg-[#29372F] text-xs font-semibold text-[#F4F7F4]"
              >
                {t.cancelBtn}
              </button>
              <button
                onClick={handleSaveEdits}
                className="px-4 py-1.5 rounded-lg bg-[#B7FF4A] text-xs font-bold text-[#0B1110]"
              >
                {t.saveTargetBtn}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-[#9DAFA6] hover:text-[#B7FF4A] flex items-center gap-1 transition"
            >
              <Edit2 className="w-3 h-3" />
              <span>{t.editTargetBtn}</span>
            </button>
          </div>
        )}

        {/* Set Tracker Buttons */}
        <div>
          <span className="text-xs font-semibold text-[#9DAFA6] block mb-2">
            {t.sets} ({record.completedSets}/{record.targetSets})
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {Array.from({ length: record.targetSets }).map((_, idx) => {
              const isSetDone = idx < record.completedSets;
              return (
                <button
                  key={idx}
                  onClick={() => handleMarkSetDone(idx)}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition cursor-pointer min-h-[52px] ${
                    isSetDone
                      ? 'bg-[#43D98B]/20 border-[#43D98B] text-[#43D98B]'
                      : 'bg-[#111A17] border-[#29372F] text-[#9DAFA6] hover:border-[#B7FF4A] hover:text-[#F4F7F4]'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider">
                    {language === 'ur' ? `سیٹ ${idx + 1}` : `Set ${idx + 1}`}
                  </span>
                  <div className="flex items-center gap-1">
                    {isSetDone ? <Check className="w-3.5 h-3.5" /> : null}
                    <span className="tabular-nums">
                      {record.targetValue} {isSeconds ? 's' : ''}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Countdown for Plank or Timed Stretches */}
        {isSeconds && (
          <div className="p-4 rounded-xl bg-[#111A17] border border-[#29372F] flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-[#9DAFA6] block">
                {language === 'ur' ? 'لائیو ٹائمر' : 'Live Hold Timer'}
              </span>
              <span className="text-3xl font-black tabular-nums text-[#B7FF4A]">
                {liveSeconds}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-4 py-2.5 rounded-xl bg-[#B7FF4A] text-[#0B1110] font-bold text-xs flex items-center gap-1.5 transition min-h-[44px]"
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isTimerRunning ? t.pauseTimerBtn : t.startTimerBtn}</span>
              </button>
              <button
                onClick={() => {
                  setLiveSeconds(record.targetValue);
                  setIsTimerRunning(false);
                }}
                className="p-2.5 rounded-xl bg-[#29372F] text-[#9DAFA6] hover:text-[#F4F7F4] transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Action Controls: Complete, Skip, Undo */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          {record.status !== 'completed' ? (
            <button
              onClick={handleCompleteExercise}
              className="flex-1 py-3.5 px-4 rounded-xl bg-[#B7FF4A] hover:bg-[#a6ec3f] active:scale-[0.98] text-[#0B1110] font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer min-h-[48px]"
            >
              <Check className="w-4 h-4" />
              <span>{t.completeExerciseBtn}</span>
            </button>
          ) : (
            <button
              onClick={handleUndo}
              className="flex-1 py-3.5 px-4 rounded-xl bg-[#29372F] hover:bg-[#34463C] text-[#F4F7F4] font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer min-h-[48px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.undoBtn}</span>
            </button>
          )}

          {record.status !== 'completed' && (
            <button
              onClick={handleSkipExercise}
              className="py-3.5 px-4 rounded-xl bg-[#111A17] border border-[#29372F] hover:border-[#FFAD5A] text-[#FFAD5A] font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer min-h-[48px]"
            >
              <SkipForward className="w-4 h-4" />
              <span>{t.skipExerciseBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Navigation: Previous / Next Exercise */}
      <div className="px-5 py-3.5 bg-[#111A17] border-t border-[#29372F] flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#9DAFA6] hover:text-[#F4F7F4] disabled:opacity-30 disabled:pointer-events-none transition min-h-[44px]"
        >
          {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <span>{t.prevBtn}</span>
        </button>

        <span className="text-xs text-[#9DAFA6] tabular-nums">
          {currentIndex + 1} / {totalExercises}
        </span>

        <button
          onClick={onNext}
          disabled={currentIndex === totalExercises - 1}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#B7FF4A] hover:brightness-110 disabled:opacity-30 disabled:pointer-events-none transition min-h-[44px]"
        >
          <span>{t.nextBtn}</span>
          {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
