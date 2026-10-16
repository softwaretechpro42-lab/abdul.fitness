import React, { useState } from 'react';
import { Sparkles, Calendar, Scale, User, Target, Ruler, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { useTranslation } from '../locales/i18n';

interface Props {
  onComplete: (profile: UserProfile) => void;
  initialLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Onboarding: React.FC<Props> = ({ onComplete, initialLanguage, onLanguageChange }) => {
  const t = useTranslation(initialLanguage);
  const isRtl = initialLanguage === 'ur';

  const todayStr = new Date().toISOString().split('T')[0];

  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [startDate, setStartDate] = useState(todayStr);
  const [height, setHeight] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate Name
    if (!name.trim()) {
      setError(t.nameRequiredError);
      return;
    }

    // Validate Weight
    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight) || parsedWeight < 30 || parsedWeight > 250) {
      setError(t.weightInvalidError);
      return;
    }

    // Validate Start Date: Cannot be future
    const selectedDate = new Date(startDate);
    selectedDate.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (selectedDate > now) {
      setError(t.startDateFutureError);
      return;
    }

    const profile: UserProfile = {
      name: name.trim(),
      weightKg: Math.round(parsedWeight * 10) / 10,
      startDate,
      heightCm: height ? parseFloat(height) : undefined,
      fitnessGoal: fitnessGoal.trim() || undefined,
      theme: 'dark',
      language: initialLanguage,
      soundEnabled: true,
      defaultRestDuration: 45,
      isOnboarded: true,
    };

    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-[#0B1110] text-[#F4F7F4] flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Language Switcher Bar */}
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-xl bg-[#111A17] border border-[#29372F] p-1">
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer min-h-[36px] ${
                initialLanguage === 'en'
                  ? 'bg-[#B7FF4A] text-[#0B1110] shadow-sm'
                  : 'text-[#9DAFA6] hover:text-[#F4F7F4]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('ur')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer min-h-[36px] ${
                initialLanguage === 'ur'
                  ? 'bg-[#B7FF4A] text-[#0B1110] shadow-sm'
                  : 'text-[#9DAFA6] hover:text-[#F4F7F4]'
              }`}
            >
              اردو
            </button>
          </div>
        </div>

        {/* Brand Kicker & Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17241D] border border-[#29372F] text-xs font-medium text-[#B7FF4A] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>26-Week Calisthenics Progression</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F7F4]">
            {t.onboardingTitle}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#9DAFA6] leading-relaxed">
            {t.onboardingSubtitle}
          </p>
        </div>

        {/* Card Form */}
        <div className="mt-6 bg-[#17241D] border border-[#29372F] rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-[#FF6B6B]/15 border border-[#FF6B6B]/40 text-[#FF6B6B] text-xs font-medium">
                {error}
              </div>
            )}

            {/* User Name */}
            <div>
              <label className="block text-xs font-semibold text-[#9DAFA6] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#B7FF4A]" />
                <span>{t.nameLabel} *</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="w-full px-3.5 py-3 rounded-xl bg-[#111A17] border border-[#29372F] text-[#F4F7F4] placeholder-[#52665C] focus:outline-none focus:border-[#B7FF4A] text-sm transition min-h-[48px]"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-xs font-semibold text-[#9DAFA6] mb-1.5 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-[#B7FF4A]" />
                <span>{t.weightLabel} *</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="250"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={t.weightPlaceholder}
                className="w-full px-3.5 py-3 rounded-xl bg-[#111A17] border border-[#29372F] text-[#F4F7F4] placeholder-[#52665C] focus:outline-none focus:border-[#B7FF4A] text-sm transition min-h-[48px]"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-semibold text-[#9DAFA6] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#B7FF4A]" />
                <span>{t.startDateLabel} *</span>
              </label>
              <input
                type="date"
                required
                max={todayStr}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-[#111A17] border border-[#29372F] text-[#F4F7F4] focus:outline-none focus:border-[#B7FF4A] text-sm transition min-h-[48px]"
              />
              <p className="mt-1 text-[11px] text-[#9DAFA6]">
                {initialLanguage === 'ur'
                  ? 'ترقی کے ہفتے آپ کی منتخب کردہ تاریخ سے حساب کیے جائیں گے۔'
                  : 'Training weeks 1–26 are calculated from this anchor date.'}
              </p>
            </div>

            {/* Optional Height */}
            <div>
              <label className="block text-xs font-semibold text-[#9DAFA6] mb-1.5 flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-[#9DAFA6]" />
                <span>{t.heightLabel}</span>
              </label>
              <input
                type="number"
                min="100"
                max="250"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder={t.heightPlaceholder}
                className="w-full px-3.5 py-3 rounded-xl bg-[#111A17] border border-[#29372F] text-[#F4F7F4] placeholder-[#52665C] focus:outline-none focus:border-[#B7FF4A] text-sm transition min-h-[48px]"
              />
            </div>

            {/* Optional Fitness Goal */}
            <div>
              <label className="block text-xs font-semibold text-[#9DAFA6] mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#9DAFA6]" />
                <span>{t.goalLabel}</span>
              </label>
              <input
                type="text"
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                placeholder={t.goalPlaceholder}
                className="w-full px-3.5 py-3 rounded-xl bg-[#111A17] border border-[#29372F] text-[#F4F7F4] placeholder-[#52665C] focus:outline-none focus:border-[#B7FF4A] text-sm transition min-h-[48px]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-[#B7FF4A] hover:bg-[#a6ec3f] active:scale-[0.99] text-[#0B1110] font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer min-h-[48px]"
              >
                <span>{t.getStartedBtn}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

            {/* Developer Credit & Local Privacy */}
            <div className="pt-3 border-t border-[#29372F] text-center space-y-1">
              <p className="text-[11px] text-[#9DAFA6]">
                {t.offlineNotice}
              </p>
              <p className="text-[11px] font-semibold text-[#B7FF4A]">
                Made by Abdul Rehman Ktk
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
