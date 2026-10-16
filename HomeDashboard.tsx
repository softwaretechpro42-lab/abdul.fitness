import React from 'react';
import {
  Flame,
  Trophy,
  Scale,
  Calendar,
  Sparkles,
  Play,
  CheckCircle2,
  Moon,
  ChevronRight,
  Shield,
  Award,
  Zap,
  Crown,
} from 'lucide-react';
import { Badge, ExerciseDefinition, Language, LevelInfo, UserProfile, WorkoutSession } from '../types';
import { useTranslation } from '../locales/i18n';
import { SundayRestDay } from './SundayRestDay';
import { isSunday } from '../services/progression';

interface Props {
  profile: UserProfile;
  week: number;
  levelInfo: LevelInfo;
  streak: number;
  sessions: WorkoutSession[];
  exercises: ExerciseDefinition[];
  badges: Badge[];
  language: Language;
  onStartWorkout: () => void;
  onNavigateTab: (tab: 'workout' | 'progress' | 'history' | 'settings') => void;
}

export const HomeDashboard: React.FC<Props> = ({
  profile,
  week,
  levelInfo,
  streak,
  sessions,
  exercises,
  badges,
  language,
  onStartWorkout,
  onNavigateTab,
}) => {
  const t = useTranslation(language);
  const isRtl = language === 'ur';

  const today = new Date();
  const todayIsSunday = isSunday(today);
  const todayDateStr = today.toISOString().split('T')[0];

  const todaySession = sessions.find((s) => s.date === todayDateStr);
  const isTodayCompleted = !!todaySession;

  // Weekly calendar summary: get Monday through Sunday of current week
  const getWeekDaysSummary = () => {
    const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday
    // Distance from Monday (1)
    const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    const days = [];
    const dayNamesEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayNamesUr = ['پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ', 'اتوار'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const isPast = d <= today;
      const isCurrent = d.toDateString() === today.toDateString();
      const isSun = i === 6;
      const completed = sessions.some((s) => s.date === dateStr);

      days.push({
        label: language === 'ur' ? dayNamesUr[i] : dayNamesEn[i],
        dayNum: d.getDate(),
        isCurrent,
        isPast,
        isSun,
        completed,
      });
    }
    return days;
  };

  const weekDays = getWeekDaysSummary();

  // Six-month progression calculation (out of 26 weeks)
  const sixMonthProgressPercent = Math.min(100, Math.round((week / 26) * 100));

  // Render badge icon helper
  const renderBadgeIcon = (icon: string) => {
    switch (icon) {
      case 'zap':
        return <Zap className="w-4 h-4 text-[#B7FF4A]" />;
      case 'flame':
        return <Flame className="w-4 h-4 text-[#FFAD5A]" />;
      case 'award':
        return <Award className="w-4 h-4 text-[#B7FF4A]" />;
      case 'shield':
        return <Shield className="w-4 h-4 text-[#43D98B]" />;
      case 'trophy':
        return <Trophy className="w-4 h-4 text-[#FFAD5A]" />;
      case 'crown':
        return <Crown className="w-4 h-4 text-[#B7FF4A]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#B7FF4A]" />;
    }
  };

  const unlockedBadges = badges.filter((b) => b.isUnlocked);

  // If today is Sunday, render the dedicated Sunday recovery view
  if (todayIsSunday) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6" dir={isRtl ? 'rtl' : 'ltr'}>
        <SundayRestDay
          week={week}
          levelInfo={levelInfo}
          language={language}
          onPreviewUpcomingWeek={() => onNavigateTab('progress')}
          onViewHistory={() => onNavigateTab('history')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Prominent Greeting & Avatar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#9DAFA6] flex items-center gap-1.5">
            <span>{t.greeting},</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7F4] tracking-tight">
            {profile.name || 'Athlete'} 👋
          </h1>
        </div>

        {/* Level Quick Pill */}
        <div className="px-3.5 py-1.5 rounded-2xl bg-[#17241D] border border-[#29372F] flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#B7FF4A]/15 text-[#B7FF4A] flex items-center justify-center font-bold text-xs">
            {levelInfo.level}
          </div>
          <div className="text-left rtl:text-right">
            <span className="text-[10px] text-[#9DAFA6] block leading-tight">
              {t.levelBadge} {levelInfo.level}
            </span>
            <span className="text-xs font-bold text-[#F4F7F4]">
              {language === 'ur' ? levelInfo.nameUr : levelInfo.nameEn}
            </span>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Week */}
        <div className="p-4 rounded-2xl bg-[#17241D] border border-[#29372F]">
          <div className="flex items-center gap-1.5 text-xs text-[#9DAFA6] mb-1">
            <Calendar className="w-3.5 h-3.5 text-[#B7FF4A]" />
            <span>{t.weekBadge}</span>
          </div>
          <div className="text-2xl font-black text-[#F4F7F4] tabular-nums">
            {week}{' '}
            <span className="text-xs text-[#9DAFA6] font-normal">/ 26</span>
          </div>
          <span className="text-[11px] text-[#52665C] block mt-0.5">
            {26 - week} {language === 'ur' ? 'ہفتے باقی' : 'weeks left'}
          </span>
        </div>

        {/* Metric 2: Streak */}
        <div className="p-4 rounded-2xl bg-[#17241D] border border-[#29372F]">
          <div className="flex items-center gap-1.5 text-xs text-[#9DAFA6] mb-1">
            <Flame className="w-3.5 h-3.5 text-[#FFAD5A]" />
            <span>{t.streak}</span>
          </div>
          <div className="text-2xl font-black text-[#FFAD5A] tabular-nums">
            {streak}{' '}
            <span className="text-xs text-[#9DAFA6] font-normal">
              {language === 'ur' ? 'دن' : 'days'}
            </span>
          </div>
          <span className="text-[11px] text-[#52665C] block mt-0.5">
            {language === 'ur' ? 'اتوار شامل نہیں' : 'Sun excluded'}
          </span>
        </div>

        {/* Metric 3: Weight */}
        <div className="p-4 rounded-2xl bg-[#17241D] border border-[#29372F]">
          <div className="flex items-center gap-1.5 text-xs text-[#9DAFA6] mb-1">
            <Scale className="w-3.5 h-3.5 text-[#B7FF4A]" />
            <span>{t.weight}</span>
          </div>
          <div className="text-2xl font-black text-[#F4F7F4] tabular-nums">
            {profile.weightKg}{' '}
            <span className="text-xs text-[#9DAFA6] font-normal">kg</span>
          </div>
          <span className="text-[11px] text-[#52665C] block mt-0.5">
            {language === 'ur' ? 'باڈی ویٹ' : 'Current baseline'}
          </span>
        </div>

        {/* Metric 4: Total Sessions */}
        <div className="p-4 rounded-2xl bg-[#17241D] border border-[#29372F]">
          <div className="flex items-center gap-1.5 text-xs text-[#9DAFA6] mb-1">
            <Trophy className="w-3.5 h-3.5 text-[#43D98B]" />
            <span>{t.totalWorkouts}</span>
          </div>
          <div className="text-2xl font-black text-[#43D98B] tabular-nums">
            {sessions.length}
          </div>
          <span className="text-[11px] text-[#52665C] block mt-0.5">
            {sessions.reduce((acc, s) => acc + s.totalReps, 0)} {t.reps}
          </span>
        </div>
      </div>

      {/* Primary Action Card: Today's Workout CTA */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#17241D] to-[#111A17] border border-[#29372F] shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B7FF4A] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.todayStatus}</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#F4F7F4] tracking-tight">
              {isTodayCompleted ? t.statusCompleted : t.statusNotStarted}
            </h2>
            <p className="mt-1 text-xs text-[#9DAFA6] max-w-md">
              {isTodayCompleted
                ? language === 'ur'
                  ? `آج آپ نے ${todaySession?.totalReps} دہرائیاں کامیابی سے مکمل کیں۔ شاندار محنت!`
                  : `Great job! Today's session logged ${todaySession?.totalReps} total reps.`
                : language === 'ur'
                ? `ہفتہ ${week} کا تربیتی سیشن تیار ہے۔ باڈی ویٹ طاقت اور تسلسل برقرار رکھیں۔`
                : `Week ${week} routine loaded: ${exercises.filter((e) => e.enabled).length} exercises configured.`}
            </p>
          </div>

          <div className="w-full sm:w-auto">
            {!isTodayCompleted ? (
              <button
                onClick={onStartWorkout}
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#B7FF4A] hover:bg-[#a6ec3f] active:scale-[0.98] text-[#0B1110] font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-[#B7FF4A]/10 min-h-[48px]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t.startWorkoutBtn}</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigateTab('history')}
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#29372F] hover:bg-[#3B4F43] text-[#F4F7F4] font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer min-h-[48px]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#43D98B]" />
                <span>{t.viewWorkoutBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Schedule Row (Mon - Sat active, Sun rest) */}
      <div className="p-5 rounded-2xl bg-[#17241D] border border-[#29372F]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-[#F4F7F4] uppercase tracking-wider">
            {t.weeklyCompletionTitle}
          </h3>
          <span className="text-[11px] text-[#9DAFA6]">
            Mon–Sat Training · Sun Rest
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {weekDays.map((day, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-xl border flex flex-col items-center justify-between min-h-[58px] ${
                day.isCurrent
                  ? 'border-[#B7FF4A] bg-[#111A17]'
                  : 'border-[#29372F] bg-[#111A17]/50'
              }`}
            >
              <span className="text-[10px] text-[#9DAFA6] font-medium">{day.label}</span>
              <div className="my-1">
                {day.isSun ? (
                  <Moon className="w-4 h-4 text-[#9DAFA6]" />
                ) : day.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-[#43D98B]" />
                ) : (
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      day.isPast ? 'bg-[#FF6B6B]/40' : 'bg-[#29372F]'
                    }`}
                  />
                )}
              </div>
              <span className="text-[10px] tabular-nums text-[#9DAFA6]">{day.dayNum}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6-Month Plan Progress Bar */}
      <div className="p-5 rounded-2xl bg-[#17241D] border border-[#29372F] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#F4F7F4]">{t.sixMonthGoalTitle}</span>
          <span className="font-bold text-[#B7FF4A] tabular-nums">
            {sixMonthProgressPercent}%
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="h-2.5 w-full bg-[#111A17] rounded-full overflow-hidden border border-[#29372F]">
          <div
            className="h-full bg-gradient-to-r from-[#43D98B] via-[#B7FF4A] to-[#FFAD5A] transition-all duration-500 rounded-full"
            style={{ width: `${sixMonthProgressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#9DAFA6]">
          <span>{language === 'ur' ? 'شروع: لیول ۱' : 'Start: Level 1'}</span>
          <span>{language === 'ur' ? 'ہدف: لیول ۱۳ (۶ ماہ کا چیمپئن)' : 'Goal: Level 13 (6-Month Champion)'}</span>
        </div>
      </div>

      {/* Recent Achievements & Earned Badges */}
      <div className="p-5 rounded-2xl bg-[#17241D] border border-[#29372F] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#F4F7F4] uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-[#FFAD5A]" />
            <span>{t.recentBadgesTitle}</span>
          </h3>
          <button
            onClick={() => onNavigateTab('progress')}
            className="text-xs text-[#B7FF4A] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>{t.viewAllBadges}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {unlockedBadges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {unlockedBadges.slice(0, 3).map((badge) => (
              <div
                key={badge.id}
                className="p-3 rounded-xl bg-[#111A17] border border-[#29372F] flex items-center gap-2.5"
              >
                <div className="p-2 rounded-lg bg-[#17241D] border border-[#29372F] shrink-0">
                  {renderBadgeIcon(badge.icon)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#F4F7F4] truncate">
                    {language === 'ur' ? badge.titleUr : badge.titleEn}
                  </h4>
                  <span className="text-[10px] text-[#43D98B] font-semibold block">
                    {language === 'ur' ? 'حاصل شدہ' : 'Unlocked'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#9DAFA6] py-2">{t.noBadgesYet}</p>
        )}
      </div>

      {/* Developer Credit Footer */}
      <div className="text-center pt-2 pb-6">
        <p className="text-xs text-[#9DAFA6]">
          My Fitness Tracker · <strong className="text-[#B7FF4A]">Made by Abdul Rehman Ktk</strong>
        </p>
      </div>
    </div>
  );
};
