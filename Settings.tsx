import React, { useState, useRef } from 'react';
import {
  User,
  Scale,
  Calendar,
  Globe,
  Sun,
  Moon,
  Clock,
  Volume2,
  VolumeX,
  Bell,
  Dumbbell,
  Download,
  Upload,
  AlertTriangle,
  RotateCcw,
  Check,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Edit2,
  Save,
} from 'lucide-react';
import { ExerciseDefinition, Language, Theme, UserProfile } from '../types';
import { useTranslation } from '../locales/i18n';
import { PWAInstallButton } from './PWAInstallButton';
import { exportAllData, importData } from '../services/storage';

interface Props {
  profile: UserProfile;
  exercises: ExerciseDefinition[];
  language: Language;
  onUpdateProfile: (updated: UserProfile) => void;
  onUpdateExercises: (updated: ExerciseDefinition[]) => void;
  onResetExercises: () => void;
  onResetAllData: () => void;
}

export const Settings: React.FC<Props> = ({
  profile,
  exercises,
  language,
  onUpdateProfile,
  onUpdateExercises,
  onResetExercises,
  onResetAllData,
}) => {
  const t = useTranslation(language);
  const isRtl = language === 'ur';

  // Profile edit state
  const [name, setName] = useState(profile.name);
  const [weight, setWeight] = useState(profile.weightKg.toString());
  const [startDate, setStartDate] = useState(profile.startDate);
  const [profileSaved, setProfileSaved] = useState(false);

  // Exercise manager state
  const [showExerciseManager, setShowExerciseManager] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showResetAllConfirm, setShowResetAllConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedWeight = parseFloat(weight);
    if (!name.trim() || isNaN(parsedWeight) || parsedWeight < 30 || parsedWeight > 250) {
      alert(t.weightInvalidError);
      return;
    }

    onUpdateProfile({
      ...profile,
      name: name.trim(),
      weightKg: Math.round(parsedWeight * 10) / 10,
      startDate,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleToggleSound = () => {
    onUpdateProfile({
      ...profile,
      soundEnabled: !profile.soundEnabled,
    });
  };

  const handleRestDurationChange = (duration: 30 | 45 | 60 | 90) => {
    onUpdateProfile({
      ...profile,
      defaultRestDuration: duration,
    });
  };

  const handleThemeChange = (newTheme: Theme) => {
    onUpdateProfile({
      ...profile,
      theme: newTheme,
    });
  };

  const handleLanguageChange = (newLang: Language) => {
    onUpdateProfile({
      ...profile,
      language: newLang,
    });
  };

  const handleExportJSON = async () => {
    try {
      const json = await exportAllData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitness_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to export data.');
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const res = await importData(content);
      if (res.success) {
        setImportStatus(res.message);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
  };

  // Reordering and toggling exercises
  const handleToggleExercise = (id: string) => {
    const updated = exercises.map((ex) => (ex.id === id ? { ...ex, enabled: !ex.enabled } : ex));
    onUpdateExercises(updated);
  };

  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === exercises.length - 1)) {
      return;
    }
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    const copy = [...exercises];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIdx, 0, moved);
    onUpdateExercises(copy);
  };

  const handleUpdateTargetValue = (id: string, newVal: number) => {
    if (newVal < 1) return;
    const updated = exercises.map((ex) => (ex.id === id ? { ...ex, currentValue: newVal } : ex));
    onUpdateExercises(updated);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7F4] tracking-tight">
          {t.settingsTitle}
        </h1>
        <p className="mt-1 text-xs text-[#9DAFA6]">
          {language === 'ur'
            ? 'ذاتی ترتیبات، زبان، بیک اپ اور ورزشوں کی لائبریری کا انتظام۔'
            : 'Personal profile, language preferences, exercise targets, and local data backups.'}
        </p>
      </div>

      {/* SECTION 1: Profile Settings */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#17241D] border border-[#29372F] space-y-4">
        <h3 className="text-xs font-bold text-[#F4F7F4] uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-[#B7FF4A]" />
          <span>{t.profileSection}</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#9DAFA6] block mb-1">
                {t.nameLabel}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#111A17] border border-[#29372F] text-xs font-semibold text-[#F4F7F4] focus:outline-none focus:border-[#B7FF4A]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#9DAFA6] block mb-1">
                {t.weightLabel}
              </label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="250"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#111A17] border border-[#29372F] text-xs font-semibold text-[#F4F7F4] focus:outline-none focus:border-[#B7FF4A]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#9DAFA6] block mb-1">
                {t.startDateLabel}
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#111A17] border border-[#29372F] text-xs font-semibold text-[#F4F7F4] focus:outline-none focus:border-[#B7FF4A]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {profileSaved && (
              <span className="text-xs text-[#43D98B] flex items-center gap-1 font-semibold">
                <Check className="w-3.5 h-3.5" />
                Profile updated successfully!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto rtl:mr-auto rtl:ml-0 px-5 py-2.5 rounded-xl bg-[#B7FF4A] text-[#0B1110] font-bold text-xs hover:brightness-105 transition min-h-[44px]"
            >
              {t.saveProfileBtn}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: Language & Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Language switch */}
        <div className="p-5 rounded-2xl bg-[#17241D] border border-[#29372F] space-y-3">
          <h3 className="text-xs font-bold text-[#F4F7F4] uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#B7FF4A]" />
            <span>{t.languageSection}</span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition min-h-[44px] ${
                language === 'en'
                  ? 'bg-[#B7FF4A] text-[#0B1110] border-[#B7FF4A]'
                  : 'bg-[#111A17] border-[#29372F] text-[#9DAFA6] hover:text-[#F4F7F4]'
              }`}
            >
              English (US)
            </button>
            <button
              onClick={() => handleLanguageChange('ur')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition min-h-[44px] ${
                language === 'ur'
                  ? 'bg-[#B7FF4A] text-[#0B1110] border-[#B7FF4A]'
                  : 'bg-[#111A17] border-[#29372F] text-[#9DAFA6] hover:text-[#F4F7F4]'
              }`}
            >
              اردو (Urdu)
            </button>
          </div>
        </div>

        {/* Theme switch */}
        <div className="p-5 rounded-2xl bg-[#17241D] border border-[#29372F] space-y-3">
          <h3 className="text-xs font-bold text-[#F4F7F4] uppercase tracking-wider flex items-center gap-2">
            <Moon className="w-4 h-4 text-[#FFAD5A]" />
            <span>{t.themeSection}</span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleThemeChange('dark')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition min-h-[44px] ${
                profile.theme === 'dark'
                  ? 'bg-[#B7FF4A] text-[#0B1110] border-[#B7FF4A]'
                  : 'bg-[#111A17] border-[#29372F] text-[#9DAFA6] hover:text-[#F4F7F4]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark (Default)</span>
            </button>
            <button
              onClick={() => handleThemeChange('light')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition min-h-[44px] ${
                profile.theme === 'light'
                  ? 'bg-[#B7FF4A] text-[#0B1110] border-[#B7FF4A]'
                  : 'bg-[#111A17] border-[#29372F] text-[#9DAFA6] hover:text-[#F4F7F4]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: Timer & Audio Preferences */}
      <div className="p-5 rounded-2xl bg-[#17241D] border border-[#29372F] space-y-4">
        <h3 className="text-xs font-bold text-[#F4F7F4] uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#B7FF4A]" />
          <span>{t.restDurationSection}</span>
        </h3>

        <div className="grid grid-cols-4 gap-2">
          {([30, 45, 60, 90] as const).map((secs) => (
            <button
              key={secs}
              onClick={() => handleRestDurationChange(secs)}
              className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition min-h-[44px] ${
                profile.defaultRestDuration === secs
                  ? 'bg-[#B7FF4A] text-[#0B1110] border-[#B7FF4A]'
                  : 'bg-[#111A17] border-[#29372F] text-[#9DAFA6] hover:text-[#F4F7F4]'
              }`}
            >
              {secs}s
            </button>
          ))}
        </div>

        {/* Audio Toggle */}
        <div className="pt-2 border-t border-[#29372F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {profile.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#43D98B]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#9DAFA6]" />
            )}
            <span className="text-xs font-medium text-[#F4F7F4]">{t.soundEnabled}</span>
          </div>
          <button
            onClick={handleToggleSound}
            className={`w-12 h-7 rounded-full p-1 transition cursor-pointer ${
              profile.soundEnabled ? 'bg-[#B7FF4A]' : 'bg-[#29372F]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-[#0B1110] transition-transform ${
                profile.soundEnabled ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Reminder note */}
        <div className="pt-2 border-t border-[#29372F] text-xs text-[#9DAFA6] space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-[#FFAD5A]">
            <Bell className="w-3.5 h-3.5" />
            <span>{t.reminderSection}</span>
          </div>
          <p className="text-[11px] leading-relaxed">{t.reminderHint}</p>
        </div>
      </div>

      {/* SECTION 4: Exercise Library Manager */}
      <div className="p-5 rounded-2xl bg-[#17241D] border border-[#29372F] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#F4F7F4] uppercase tracking-wider flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-[#B7FF4A]" />
            <span>{t.exerciseLibrarySection} ({exercises.length} Exercises)</span>
          </h3>
          <button
            onClick={() => setShowExerciseManager(!showExerciseManager)}
            className="text-xs text-[#B7FF4A] font-semibold hover:underline"
          >
            {showExerciseManager ? 'Hide Manager' : t.manageExercisesBtn}
          </button>
        </div>

        {showExerciseManager && (
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#9DAFA6]">
                {exercises.filter((e) => e.enabled).length} Active · Reorder or toggle exercises
              </span>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="text-xs text-[#FFAD5A] hover:underline font-semibold"
              >
                {t.resetExercisesBtn}
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto p-1">
              {exercises.map((ex, idx) => (
                <div
                  key={ex.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                    ex.enabled
                      ? 'bg-[#111A17] border-[#29372F]'
                      : 'bg-[#111A17]/40 border-[#29372F]/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] text-[#52665C] font-mono w-4">{idx + 1}</span>
                    <button
                      onClick={() => handleToggleExercise(ex.id)}
                      className="p-1 text-[#9DAFA6] hover:text-[#B7FF4A]"
                      title="Toggle active"
                    >
                      {ex.enabled ? (
                        <Eye className="w-4 h-4 text-[#43D98B]" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-[#52665C]" />
                      )}
                    </button>
                    <span className="font-semibold text-[#F4F7F4] truncate">
                      {ex.name[language] || ex.name.en}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Target adjuster */}
                    <div className="flex items-center gap-1 bg-[#17241D] px-2 py-1 rounded-lg border border-[#29372F]">
                      <input
                        type="number"
                        min="1"
                        value={ex.currentValue}
                        onChange={(e) => handleUpdateTargetValue(ex.id, parseInt(e.target.value) || 1)}
                        className="w-12 text-center text-xs font-bold text-[#F4F7F4] bg-transparent focus:outline-none"
                      />
                      <span className="text-[10px] text-[#9DAFA6]">
                        {ex.type === 'seconds' ? 's' : 'reps'}
                      </span>
                    </div>

                    {/* Up / Down arrows */}
                    <button
                      onClick={() => handleMoveExercise(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-[#9DAFA6] hover:text-[#F4F7F4] disabled:opacity-20"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveExercise(idx, 'down')}
                      disabled={idx === exercises.length - 1}
                      className="p-1 text-[#9DAFA6] hover:text-[#F4F7F4] disabled:opacity-20"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: Backup, Restore & Reset */}
      <div className="p-5 rounded-2xl bg-[#17241D] border border-[#29372F] space-y-4">
        <h3 className="text-xs font-bold text-[#F4F7F4] uppercase tracking-wider flex items-center gap-2">
          <Download className="w-4 h-4 text-[#B7FF4A]" />
          <span>{t.backupSection}</span>
        </h3>

        <p className="text-xs text-[#9DAFA6] leading-relaxed">
          {t.offlineNotice}
        </p>

        {importStatus && (
          <div className="p-3 rounded-xl bg-[#43D98B]/20 text-[#43D98B] border border-[#43D98B]/30 text-xs font-semibold">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            onClick={handleExportJSON}
            className="py-3 px-4 rounded-xl bg-[#111A17] border border-[#29372F] hover:border-[#B7FF4A] text-[#F4F7F4] text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer min-h-[44px]"
          >
            <Download className="w-4 h-4 text-[#B7FF4A]" />
            <span>{t.exportDataBtn}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="py-3 px-4 rounded-xl bg-[#111A17] border border-[#29372F] hover:border-[#FFAD5A] text-[#F4F7F4] text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer min-h-[44px]"
          >
            <Upload className="w-4 h-4 text-[#FFAD5A]" />
            <span>{t.importDataBtn}</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />
        </div>

        {/* Downloadable Project Source Code ZIP */}
        <div className="pt-2">
          <a
            href="/my-fitness-tracker.zip"
            download="my-fitness-tracker.zip"
            className="w-full py-2.5 px-4 rounded-xl bg-[#111A17] border border-[#29372F] hover:border-[#B7FF4A] text-[#B7FF4A] text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'ur' ? 'مکمل پروجیکٹ کوڈ ڈاؤن لوڈ کریں (ZIP)' : 'Download Complete Project Source (ZIP)'}</span>
          </a>
        </div>

        {/* Reset All Data Button */}
        <div className="pt-2 border-t border-[#29372F]">
          <button
            onClick={() => setShowResetAllConfirm(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#FF6B6B]/15 border border-[#FF6B6B]/30 hover:bg-[#FF6B6B]/25 text-[#FF6B6B] text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.resetAllDataBtn}</span>
          </button>
        </div>
      </div>

      {/* SECTION 6: PWA App Installation */}
      <div className="p-5 rounded-2xl bg-[#17241D] border border-[#29372F] space-y-3">
        <h3 className="text-xs font-bold text-[#F4F7F4] uppercase tracking-wider">
          {t.pwaInstallTitle}
        </h3>
        <p className="text-xs text-[#9DAFA6]">
          {language === 'ur'
            ? 'ایپ کو اپنے فون پر براہ راست انسٹال کریں تاکہ یہ بغیر انٹرنیٹ کے ہمیشہ کام کرے۔'
            : 'Install this app directly on your phone home screen for instant offline access and native app experience.'}
        </p>
        <PWAInstallButton language={language} variant="settings" />
      </div>

      {/* SECTION 7: About & Exact Developer Credit */}
      <div className="p-6 rounded-2xl bg-[#111A17] border border-[#29372F] text-center space-y-2">
        <h3 className="text-sm font-bold text-[#F4F7F4]">{t.aboutSection}</h3>
        <p className="text-xs text-[#9DAFA6] max-w-md mx-auto">
          {t.aboutAppDesc}
        </p>
        <div className="pt-3 border-t border-[#29372F]/60">
          <span className="text-xs text-[#9DAFA6] block">
            Application Engineer & Product Designer
          </span>
          <span className="text-sm font-black text-[#B7FF4A] tracking-wide block mt-0.5">
            Made by Abdul Rehman Ktk
          </span>
        </div>
      </div>

      {/* Reset Exercises Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-[#17241D] border border-[#29372F] rounded-2xl p-6 text-center space-y-4">
            <RotateCcw className="w-8 h-8 text-[#FFAD5A] mx-auto" />
            <h3 className="text-base font-bold text-[#F4F7F4]">{t.resetExercisesConfirm}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#111A17] border border-[#29372F] text-xs font-semibold text-[#9DAFA6]"
              >
                {t.cancelBtn}
              </button>
              <button
                onClick={() => {
                  onResetExercises();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#FFAD5A] text-[#0B1110] text-xs font-bold"
              >
                Reset Library
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset All Data Modal */}
      {showResetAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-[#17241D] border border-[#FF6B6B]/40 rounded-2xl p-6 text-center space-y-4">
            <AlertTriangle className="w-8 h-8 text-[#FF6B6B] mx-auto" />
            <h3 className="text-base font-bold text-[#F4F7F4]">{t.resetAllDataConfirm}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetAllConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#111A17] border border-[#29372F] text-xs font-semibold text-[#9DAFA6]"
              >
                {t.cancelBtn}
              </button>
              <button
                onClick={() => {
                  onResetAllData();
                  setShowResetAllConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#FF6B6B] text-white text-xs font-bold"
              >
                Confirm Erase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
