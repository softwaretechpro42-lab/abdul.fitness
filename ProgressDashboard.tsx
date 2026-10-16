import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Clock,
  Shield,
  Award,
  Crown,
  Zap,
  Printer,
  X,
  Sparkles,
} from 'lucide-react';
import { Badge, Language, LevelInfo, UserProfile, WorkoutSession } from '../types';
import { useTranslation } from '../locales/i18n';
import { LEVELS } from '../services/progression';

interface Props {
  profile: UserProfile;
  week: number;
  levelInfo: LevelInfo;
  streak: number;
  sessions: WorkoutSession[];
  badges: Badge[];
  language: Language;
}

export const ProgressDashboard: React.FC<Props> = ({
  profile,
  week,
  levelInfo,
  streak,
  sessions,
  badges,
  language,
}) => {
  const t = useTranslation(language);
  const isRtl = language === 'ur';

  const [showCertificate, setShowCertificate] = useState(false);

  // Totals calculations
  const totalWorkouts = sessions.length;
  const totalReps = sessions.reduce((acc, s) => acc + s.totalReps, 0);
  const totalSeconds = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const remainingMins = Math.floor((totalSeconds % 3600) / 60);

  // Best plank duration
  const bestPlankSeconds = sessions.reduce((max, s) => {
    const plankEx = s.exercises.find((e) => e.exerciseId === 'ex-14' && e.status === 'completed');
    if (plankEx && plankEx.actualValue > max) return plankEx.actualValue;
    return max;
  }, 0);

  // 7-day activity chart data
  const getLast7DaysActivity = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const session = sessions.find((s) => s.date === dateStr);
      const dayName = d.toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', { weekday: 'short' });
      days.push({
        date: dateStr,
        dayName,
        reps: session ? session.totalReps : 0,
        mins: session ? Math.round(session.durationSeconds / 60) : 0,
      });
    }
    return days;
  };

  const activity7Days = getLast7DaysActivity();
  const maxRepsIn7Days = Math.max(...activity7Days.map((d) => d.reps), 100);

  // 26-week plan progression
  const weekProgressPercent = Math.min(100, Math.round((week / 26) * 100));

  // Next level progress: each level spans 2 weeks. In week 1 (odd week), 50% to next level. In week 2, 100%.
  const nextLevelPercent = (week % 2 === 1) ? 50 : 100;

  const renderBadgeIcon = (icon: string) => {
    switch (icon) {
      case 'zap':
        return <Zap className="w-5 h-5 text-[#B7FF4A]" />;
      case 'flame':
        return <Flame className="w-5 h-5 text-[#FFAD5A]" />;
      case 'award':
        return <Award className="w-5 h-5 text-[#B7FF4A]" />;
      case 'shield':
        return <Shield className="w-5 h-5 text-[#43D98B]" />;
      case 'trophy':
        return <Trophy className="w-5 h-5 text-[#FFAD5A]" />;
      case 'crown':
        return <Crown className="w-5 h-5 text-[#B7FF4A]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#B7FF4A]" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7F4] tracking-tight">
          {t.progressTitle}
        </h1>
        <p className="mt-1 text-xs text-[#9DAFA6]">
          {language === 'ur'
            ? 'آپ کی تمام ورزشوں، پیشرفت اور تمغوں کا مصدقہ تجزیہ۔'
            : 'Verified bodyweight performance, 26-week calendar roadmap, and earned achievements.'}
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#17241D] border border-[#29372F]">
          <span className="text-xs font-semibold text-[#9DAFA6] flex items-center gap-1.5 mb-1">
            <Trophy className="w-3.5 h-3.5 text-[#B7FF4A]" />
            {t.totalWorkouts}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#F4F7F4] tabular-nums">
            {totalWorkouts}
          </div>
          <span className="text-[11px] text-[#52665C] block mt-0.5">
            {language === 'ur' ? 'مکمل سیشنز' : 'Sessions logged'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#17241D] border border-[#29372F]">
          <span className="text-xs font-semibold text-[#9DAFA6] flex items-center gap-1.5 mb-1">
            <Flame className="w-3.5 h-3.5 text-[#FFAD5A]" />
            {t.totalRepsMetric}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#FFAD5A] tabular-nums">
            {totalReps.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#52665C] block mt-0.5">
            {language === 'ur' ? 'کل دہرائیاں' : 'Actual completed'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#17241D] border border-[#29372F]">
          <span className="text-xs font-semibold text-[#9DAFA6] flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-[#B7FF4A]" />
            {t.totalTimeMetric}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#F4F7F4] tabular-nums">
            {totalHours}h {remainingMins}m
          </div>
          <span className="text-[11px] text-[#52665C] block mt-0.5">
            {language === 'ur' ? 'ورزش کا وقت' : 'Time in motion'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#17241D] border border-[#29372F]">
          <span className="text-xs font-semibold text-[#9DAFA6] flex items-center gap-1.5 mb-1">
            <Shield className="w-3.5 h-3.5 text-[#43D98B]" />
            {t.bestPlankMetric}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#43D98B] tabular-nums">
            {bestPlankSeconds}s
          </div>
          <span className="text-[11px] text-[#52665C] block mt-0.5">
            {language === 'ur' ? 'آہنی کور' : 'Personal Record'}
          </span>
        </div>
      </div>

      {/* 7-Day Activity Chart */}
      <div className="p-5 rounded-2xl bg-[#17241D] border border-[#29372F] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#F4F7F4] uppercase tracking-wider">
            {t.weeklyActivityTitle}
          </h3>
          <span className="text-xs text-[#9DAFA6]">
            {activity7Days.reduce((a, b) => a + b.reps, 0)} {t.reps} in last 7 days
          </span>
        </div>

        {/* SVG/Bar chart */}
        <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
          {activity7Days.map((item, idx) => {
            const heightPercent = maxRepsIn7Days > 0 ? Math.max(8, (item.reps / maxRepsIn7Days) * 100) : 8;
            const hasActivity = item.reps > 0;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] text-[#9DAFA6] tabular-nums font-semibold">
                  {hasActivity ? `${item.reps}` : '-'}
                </span>
                <div className="w-full max-w-[36px] bg-[#111A17] rounded-t-xl overflow-hidden h-full flex items-end p-0.5">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      hasActivity
                        ? 'bg-gradient-to-t from-[#43D98B] to-[#B7FF4A]'
                        : 'bg-[#29372F]/30'
                    }`}
                    style={{ height: `${hasActivity ? heightPercent : 6}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-[#9DAFA6] truncate">
                  {item.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Level & 26-Week Progression Roadmap */}
      <div className="p-5 rounded-2xl bg-[#17241D] border border-[#29372F] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#B7FF4A] block mb-0.5">
              {t.levelBadge} {levelInfo.level} · {levelInfo.weeks} {language === 'ur' ? 'ہفتے' : 'Weeks'}
            </span>
            <h3 className="text-lg font-bold text-[#F4F7F4]">
              {language === 'ur' ? levelInfo.nameUr : levelInfo.nameEn}
            </h3>
            <p className="text-xs text-[#9DAFA6] mt-1">
              {language === 'ur' ? levelInfo.descriptionUr : levelInfo.descriptionEn}
            </p>
          </div>
          <div className="text-right rtl:text-left">
            <span className="text-2xl font-black text-[#B7FF4A] tabular-nums">
              {weekProgressPercent}%
            </span>
            <span className="text-[10px] text-[#9DAFA6] block">Overall Plan</span>
          </div>
        </div>

        {/* Roadmap Progress Bar */}
        <div className="h-3 w-full bg-[#111A17] rounded-full overflow-hidden border border-[#29372F]">
          <div
            className="h-full bg-gradient-to-r from-[#43D98B] via-[#B7FF4A] to-[#FFAD5A] rounded-full transition-all duration-500"
            style={{ width: `${weekProgressPercent}%` }}
          />
        </div>

        {/* 13 Levels Grid Display */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-[#F4F7F4] uppercase tracking-wider mb-2.5">
            {t.levelRoadmapTitle}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {LEVELS.map((lvl) => {
              const isCurrent = lvl.level === levelInfo.level;
              const isPassed = lvl.level < levelInfo.level;
              return (
                <div
                  key={lvl.level}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                    isCurrent
                      ? 'bg-[#111A17] border-[#B7FF4A] text-[#F4F7F4]'
                      : isPassed
                      ? 'bg-[#111A17]/60 border-[#29372F] text-[#43D98B]'
                      : 'bg-[#111A17]/30 border-[#29372F]/50 text-[#52665C]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                        isCurrent
                          ? 'bg-[#B7FF4A] text-[#0B1110]'
                          : isPassed
                          ? 'bg-[#43D98B]/20 text-[#43D98B]'
                          : 'bg-[#29372F] text-[#9DAFA6]'
                      }`}
                    >
                      {lvl.level}
                    </span>
                    <span className="font-semibold truncate max-w-[150px]">
                      {language === 'ur' ? lvl.nameUr : lvl.nameEn}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#9DAFA6] font-mono tabular-nums">
                    W{lvl.weeks}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Badges Gallery */}
      <div className="p-5 rounded-2xl bg-[#17241D] border border-[#29372F] space-y-4">
        <h3 className="text-xs font-bold text-[#F4F7F4] uppercase tracking-wider flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-[#FFAD5A]" />
          <span>{t.recentBadgesTitle}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 transition ${
                badge.isUnlocked
                  ? 'bg-[#111A17] border-[#29372F]'
                  : 'bg-[#111A17]/30 border-[#29372F]/40 opacity-50'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl border shrink-0 ${
                  badge.isUnlocked
                    ? 'bg-[#17241D] border-[#29372F]'
                    : 'bg-[#17241D]/50 border-transparent text-[#52665C]'
                }`}
              >
                {renderBadgeIcon(badge.icon)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-[#F4F7F4]">
                    {language === 'ur' ? badge.titleUr : badge.titleEn}
                  </h4>
                  {badge.isUnlocked && (
                    <span className="text-[10px] text-[#43D98B] font-semibold">✓</span>
                  )}
                </div>
                <p className="text-[11px] text-[#9DAFA6] mt-0.5 leading-relaxed">
                  {language === 'ur' ? badge.descriptionUr : badge.descriptionEn}
                </p>
                {badge.isUnlocked && badge.earnedDate && (
                  <span className="text-[10px] text-[#52665C] block mt-1">
                    Unlocked: {badge.earnedDate}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6-Month Completion Certificate Trigger */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#17241D] to-[#111A17] border border-[#B7FF4A]/40 text-center space-y-3">
        <Crown className="w-10 h-10 text-[#B7FF4A] mx-auto" />
        <h3 className="text-lg font-bold text-[#F4F7F4]">{t.certificateTitle}</h3>
        <p className="text-xs text-[#9DAFA6] max-w-md mx-auto">
          {t.certificateSubtitle}
        </p>
        <button
          onClick={() => setShowCertificate(true)}
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B7FF4A] text-[#0B1110] font-bold text-xs hover:brightness-105 transition min-h-[44px]"
        >
          <Printer className="w-4 h-4" />
          <span>{t.printCertificateBtn}</span>
        </button>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0B1110] border-4 border-[#B7FF4A] rounded-3xl p-8 shadow-2xl text-[#F4F7F4] relative my-8 print:border-black">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-2 text-[#9DAFA6] hover:text-[#F4F7F4] rounded-xl hover:bg-[#111A17] transition print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Content */}
            <div className="border-2 border-[#29372F] p-8 rounded-2xl text-center space-y-4 relative">
              <Crown className="w-14 h-14 text-[#B7FF4A] mx-auto" />
              <span className="text-xs font-semibold tracking-widest uppercase text-[#FFAD5A] block">
                Official Calisthenics Mastery Credential
              </span>
              <h2 className="text-3xl font-black text-[#F4F7F4] tracking-tight">
                CERTIFICATE OF COMPLETION
              </h2>
              <p className="text-xs text-[#9DAFA6]">
                This honors and certifies that
              </p>
              <div className="text-2xl font-black text-[#B7FF4A] border-b-2 border-[#29372F] pb-2 max-w-sm mx-auto">
                {profile.name || 'Athlete'}
              </div>
              <p className="text-xs text-[#9DAFA6] max-w-md mx-auto leading-relaxed">
                has successfully committed to, persevered through, and completed the rigorous 26-week bodyweight strength and calisthenics progression program, logging {totalWorkouts} dedicated workout sessions and {totalReps.toLocaleString()} total repetitions.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#29372F] text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#9DAFA6] block">Start Date</span>
                  <strong className="text-[#F4F7F4]">{profile.startDate}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#9DAFA6] block">Status</span>
                  <strong className="text-[#43D98B]">
                    {week >= 26 ? '26-Week Master' : `Week ${week} Active`}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#9DAFA6] block">Author</span>
                  <strong className="text-[#B7FF4A]">Abdul Rehman Ktk</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#29372F] text-xs font-semibold text-[#F4F7F4] flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 rounded-xl bg-[#B7FF4A] text-xs font-bold text-[#0B1110]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
