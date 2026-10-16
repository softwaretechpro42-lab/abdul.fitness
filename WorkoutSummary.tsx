import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, XCircle, Clock, Flame, Save, X } from 'lucide-react';
import { Language, WorkoutSession } from '../types';
import { useTranslation } from '../locales/i18n';
import { playVictory } from '../services/sound';

interface Props {
  session: WorkoutSession;
  language: Language;
  soundEnabled: boolean;
  onSave: (notes: string) => void;
  onCancel: () => void;
}

export const WorkoutSummary: React.FC<Props> = ({
  session,
  language,
  soundEnabled,
  onSave,
  onCancel,
}) => {
  const t = useTranslation(language);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Fire victory sound
    playVictory(soundEnabled);

    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B7FF4A', '#FFAD5A', '#43D98B', '#FFFFFF'],
      });
    } catch {
      // Ignored if canvas not supported
    }
  }, [soundEnabled]);

  const completedCount = session.exercises.filter((e) => e.status === 'completed').length;
  const skippedCount = session.exercises.filter((e) => e.status === 'skipped').length;
  const pendingCount = session.exercises.filter((e) => e.status === 'pending').length;

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#17241D] border border-[#29372F] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F4F7F4] relative my-8">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-[#9DAFA6] hover:text-[#F4F7F4] rounded-xl hover:bg-[#111A17] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#B7FF4A]/15 border border-[#B7FF4A]/40 mx-auto flex items-center justify-center text-[#B7FF4A] mb-3">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-[#F4F7F4] tracking-tight">
            {t.workoutSummaryTitle}
          </h2>
          <p className="mt-1 text-xs text-[#9DAFA6]">
            {session.date} · {t.weekBadge} {session.week} · {t.levelBadge} {session.level}
          </p>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
          <div className="p-3.5 rounded-2xl bg-[#111A17] border border-[#29372F] text-center">
            <div className="flex items-center justify-center gap-1 text-[#FFAD5A] text-xs font-semibold mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>{t.totalRepsMetric}</span>
            </div>
            <span className="text-2xl font-black text-[#F4F7F4] tabular-nums">
              {session.totalReps}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111A17] border border-[#29372F] text-center">
            <div className="flex items-center justify-center gap-1 text-[#B7FF4A] text-xs font-semibold mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.sessionDuration}</span>
            </div>
            <span className="text-xl font-black text-[#F4F7F4] tabular-nums">
              {formatDuration(session.durationSeconds)}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-[#111A17] border border-[#29372F] text-center">
            <div className="flex items-center justify-center gap-1 text-[#43D98B] text-xs font-semibold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.completedCount}</span>
            </div>
            <span className="text-2xl font-black text-[#43D98B] tabular-nums">
              {completedCount}
              <span className="text-xs text-[#9DAFA6] font-normal"> / {session.exercises.length}</span>
            </span>
          </div>
        </div>

        {/* Exercise Completion Breakdown */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9DAFA6] font-semibold px-1">
            <span>{session.exercises.length} Exercises Recorded</span>
            <span>
              {skippedCount > 0 && <span className="text-[#FFAD5A]">{skippedCount} Skipped · </span>}
              {pendingCount > 0 && <span className="text-[#9DAFA6]">{pendingCount} Left</span>}
            </span>
          </div>

          <div className="max-h-44 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-[#111A17] border border-[#29372F]">
            {session.exercises.map((e, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs"
              >
                <div className="flex items-center gap-2">
                  {e.status === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#43D98B] shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-[#FFAD5A] shrink-0" />
                  )}
                  <span className={e.status === 'skipped' ? 'text-[#9DAFA6] line-through' : 'text-[#F4F7F4]'}>
                    {e.exerciseName}
                  </span>
                </div>
                <span className="text-[11px] tabular-nums text-[#9DAFA6]">
                  {e.status === 'completed'
                    ? `${e.actualSets}x ${e.actualValue} ${e.type === 'seconds' ? 's' : ''}`
                    : t.skippedBadge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Workout Notes */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-[#9DAFA6] mb-1.5">
            {language === 'ur' ? 'نوٹس اور احساسات (اختیاری)' : 'Workout Notes (Optional)'}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder={t.notesPlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#111A17] border border-[#29372F] text-[#F4F7F4] placeholder-[#52665C] focus:outline-none focus:border-[#B7FF4A] text-xs resize-none"
          />
        </div>

        {/* Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onSave(notes)}
            className="flex-1 py-3.5 px-4 rounded-xl bg-[#B7FF4A] hover:bg-[#a6ec3f] active:scale-[0.98] text-[#0B1110] font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer min-h-[48px]"
          >
            <Save className="w-4 h-4" />
            <span>{t.saveSessionBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
