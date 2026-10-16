import React from 'react';
import { Moon, Droplets, BedDouble, Apple, Sparkles, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language, LevelInfo } from '../types';
import { useTranslation } from '../locales/i18n';

interface Props {
  week: number;
  levelInfo: LevelInfo;
  language: Language;
  onPreviewUpcomingWeek?: () => void;
  onViewHistory?: () => void;
}

export const SundayRestDay: React.FC<Props> = ({
  week,
  levelInfo,
  language,
  onPreviewUpcomingWeek,
  onViewHistory,
}) => {
  const t = useTranslation(language);
  const isRtl = language === 'ur';

  const tips = [
    {
      icon: Droplets,
      color: 'text-[#43D98B]',
      title: language === 'ur' ? 'ہائیڈریشن' : 'Deep Hydration',
      text: t.sundayTip1,
    },
    {
      icon: Sparkles,
      color: 'text-[#B7FF4A]',
      title: language === 'ur' ? 'ہلکی حرکت' : 'Gentle Mobility',
      text: t.sundayTip2,
    },
    {
      icon: BedDouble,
      color: 'text-[#FFAD5A]',
      title: language === 'ur' ? 'بھرپور نیند' : 'Sleep & Recovery',
      text: t.sundayTip3,
    },
    {
      icon: Apple,
      color: 'text-[#43D98B]',
      title: language === 'ur' ? 'صحت بخش غذا' : 'Whole Nutrition',
      text: t.sundayTip4,
    },
  ];

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Hero Card */}
      <div className="bg-[#17241D] border border-[#29372F] rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-[#B7FF4A]/10 border border-[#B7FF4A]/30 mx-auto flex items-center justify-center text-[#B7FF4A] mb-4">
          <Moon className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-[#111A17] border border-[#29372F] text-xs font-semibold text-[#B7FF4A] mb-2">
          {language === 'ur' ? 'ہفتہ وار آرام کا دن' : 'Weekly Recovery Protocol'}
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7F4] tracking-tight">
          {t.sundayTitle}
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-[#9DAFA6] max-w-lg mx-auto leading-relaxed">
          {t.sundaySubtitle}
        </p>

        {/* Current Progression Status */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 p-3 rounded-2xl bg-[#111A17] border border-[#29372F] text-xs">
          <span className="text-[#9DAFA6]">
            {t.weekBadge} <strong className="text-[#F4F7F4]">{week}</strong> {t.ofWeeks}
          </span>
          <span className="text-[#29372F]">·</span>
          <span className="text-[#9DAFA6]">
            {t.levelBadge} <strong className="text-[#B7FF4A]">{levelInfo.level}</strong> ({levelInfo.nameEn})
          </span>
        </div>
      </div>

      {/* Recovery Guidance Tips */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#F4F7F4] px-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#B7FF4A]" />
          <span>{t.sundayTipsTitle}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#17241D] border border-[#29372F] flex items-start gap-3.5"
              >
                <div className={`p-2.5 rounded-xl bg-[#111A17] border border-[#29372F] ${tip.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F4F7F4]">{tip.title}</h4>
                  <p className="text-xs text-[#9DAFA6] mt-1 leading-relaxed">{tip.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Links */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {onViewHistory && (
          <button
            onClick={onViewHistory}
            className="flex-1 py-3.5 px-4 rounded-xl bg-[#17241D] border border-[#29372F] hover:border-[#B7FF4A] text-[#F4F7F4] text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer min-h-[48px]"
          >
            <Calendar className="w-4 h-4 text-[#B7FF4A]" />
            <span>{language === 'ur' ? 'ماضی کی ورزشیں دیکھیں' : 'Review Workout History'}</span>
          </button>
        )}

        {onPreviewUpcomingWeek && (
          <button
            onClick={onPreviewUpcomingWeek}
            className="flex-1 py-3.5 px-4 rounded-xl bg-[#29372F] hover:bg-[#34463C] text-[#F4F7F4] text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer min-h-[48px]"
          >
            <span>{t.upcomingWeekPreview}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};
