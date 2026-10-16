import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Clock,
  Flame,
  CheckCircle2,
  XCircle,
  Trash2,
  ChevronRight,
  X,
  FileText,
} from 'lucide-react';
import { Language, WorkoutSession } from '../types';
import { useTranslation } from '../locales/i18n';

interface Props {
  sessions: WorkoutSession[];
  language: Language;
  onDeleteSession: (sessionId: string) => void;
}

export const WorkoutHistory: React.FC<Props> = ({ sessions, language, onDeleteSession }) => {
  const t = useTranslation(language);
  const isRtl = language === 'ur';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredSessions = sessions.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    if (s.date.includes(q)) return true;
    if (s.notes && s.notes.toLowerCase().includes(q)) return true;
    const hasExercise = s.exercises.some((e) => e.exerciseName.toLowerCase().includes(q));
    if (hasExercise) return true;
    return false;
  });

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7F4] tracking-tight">
          {t.historyTitle}
        </h1>
        <p className="mt-1 text-xs text-[#9DAFA6]">
          {language === 'ur'
            ? 'آپ کے تمام ریکارڈ شدہ ورک آؤٹس کا تفصیلی محفوظ آرکائیو۔'
            : 'Detailed log of your logged calisthenics sessions, actual reps performed, and notes.'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#9DAFA6] absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchHistoryPlaceholder}
          className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-3 rounded-2xl bg-[#17241D] border border-[#29372F] text-[#F4F7F4] placeholder-[#52665C] focus:outline-none focus:border-[#B7FF4A] text-xs sm:text-sm transition min-h-[48px]"
        />
      </div>

      {/* Sessions List */}
      {filteredSessions.length > 0 ? (
        <div className="space-y-3">
          {filteredSessions.map((session) => {
            const completedExercises = session.exercises.filter((e) => e.status === 'completed');
            const skippedExercises = session.exercises.filter((e) => e.status === 'skipped');

            return (
              <div
                key={session.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#17241D] border border-[#29372F] hover:border-[#3B4F43] transition space-y-3 cursor-pointer"
                onClick={() => setSelectedSession(session)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#B7FF4A]" />
                    <span className="text-sm font-bold text-[#F4F7F4]">{session.date}</span>
                    <span className="text-xs text-[#52665C]">·</span>
                    <span className="text-xs text-[#9DAFA6]">
                      {t.weekBadge} {session.week} · {t.levelBadge} {session.level}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(session.id);
                      }}
                      className="p-2 rounded-lg text-[#9DAFA6] hover:text-[#FF6B6B] hover:bg-[#111A17] transition"
                      title={t.deleteBtn}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-[#9DAFA6] rtl:rotate-180" />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#9DAFA6]">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#FFAD5A]" />
                    <strong className="text-[#F4F7F4] tabular-nums">{session.totalReps}</strong> {t.reps}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#B7FF4A]" />
                    {formatDuration(session.durationSeconds)}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#43D98B]" />
                    <span>
                      {completedExercises.length} / {session.exercises.length} {language === 'ur' ? 'مکمل' : 'done'}
                    </span>
                  </span>
                  {skippedExercises.length > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-[#FFAD5A]">
                        {skippedExercises.length} {t.skippedBadge}
                      </span>
                    </>
                  )}
                </div>

                {session.notes && (
                  <p className="text-xs text-[#9DAFA6] italic bg-[#111A17] p-2.5 rounded-xl border border-[#29372F] line-clamp-2">
                    "{session.notes}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-[#17241D] border border-[#29372F] text-center space-y-2">
          <FileText className="w-8 h-8 text-[#52665C] mx-auto" />
          <h3 className="text-sm font-bold text-[#F4F7F4]">{t.noSessionsFound}</h3>
          <p className="text-xs text-[#9DAFA6]">
            {language === 'ur'
              ? 'جب آپ ورزش مکمل کریں گے تو وہ یہاں محفوظ ہو جائے گی۔'
              : 'Complete a workout session to see your activity history recorded here.'}
          </p>
        </div>
      )}

      {/* Session Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#17241D] border border-[#29372F] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F4F7F4] relative my-8">
            <button
              onClick={() => setSelectedSession(null)}
              className="absolute top-4 right-4 p-2 text-[#9DAFA6] hover:text-[#F4F7F4] rounded-xl hover:bg-[#111A17] transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#F4F7F4]">{t.sessionDetails}</h3>
            <p className="text-xs text-[#9DAFA6] mt-0.5">
              {selectedSession.date} · {t.weekBadge} {selectedSession.week} · {t.levelBadge} {selectedSession.level}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-[#111A17] border border-[#29372F]">
                <span className="text-[11px] text-[#9DAFA6] block">{t.totalRepsMetric}</span>
                <span className="text-xl font-black text-[#FFAD5A] tabular-nums">
                  {selectedSession.totalReps}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#111A17] border border-[#29372F]">
                <span className="text-[11px] text-[#9DAFA6] block">{t.sessionDuration}</span>
                <span className="text-xl font-black text-[#B7FF4A] tabular-nums">
                  {formatDuration(selectedSession.durationSeconds)}
                </span>
              </div>
            </div>

            {/* List of exercises performed */}
            <div className="mt-4 space-y-1.5 max-h-60 overflow-y-auto p-2 rounded-xl bg-[#111A17] border border-[#29372F]">
              {selectedSession.exercises.map((e, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5 px-2.5 text-xs">
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

            {selectedSession.notes && (
              <div className="mt-4">
                <span className="text-xs font-semibold text-[#9DAFA6] block mb-1">Notes:</span>
                <p className="text-xs text-[#F4F7F4] bg-[#111A17] p-3 rounded-xl border border-[#29372F]">
                  {selectedSession.notes}
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-5 py-2.5 rounded-xl bg-[#29372F] hover:bg-[#34463C] text-xs font-semibold text-[#F4F7F4]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-[#17241D] border border-[#29372F] rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <Trash2 className="w-8 h-8 text-[#FF6B6B] mx-auto" />
            <h3 className="text-base font-bold text-[#F4F7F4]">{t.deleteSessionPrompt}</h3>
            <p className="text-xs text-[#9DAFA6]">
              This action cannot be undone. The session reps and stats will be removed.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#111A17] border border-[#29372F] text-xs font-semibold text-[#9DAFA6]"
              >
                {t.cancelBtn}
              </button>
              <button
                onClick={() => {
                  onDeleteSession(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#FF6B6B] hover:bg-[#e05656] text-xs font-bold text-white"
              >
                {t.confirmDeleteBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
