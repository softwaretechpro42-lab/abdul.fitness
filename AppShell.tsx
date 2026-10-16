import React from 'react';
import {
  Home,
  Dumbbell,
  BarChart3,
  History,
  Settings as SettingsIcon,
  Flame,
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { useTranslation } from '../locales/i18n';
import { PWAInstallButton } from './PWAInstallButton';
import { OfflineIndicator } from './OfflineIndicator';

export type NavTab = 'home' | 'workout' | 'progress' | 'history' | 'settings';

interface Props {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  profile: UserProfile;
  language: Language;
  streak: number;
  isWorkoutActive: boolean;
  children: React.ReactNode;
}

export const AppShell: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  profile,
  language,
  streak,
  isWorkoutActive,
  children,
}) => {
  const t = useTranslation(language);
  const isRtl = language === 'ur';

  const navItems: Array<{ tab: NavTab; label: string; icon: typeof Home }> = [
    { tab: 'home', label: t.navHome, icon: Home },
    { tab: 'workout', label: t.navWorkout, icon: Dumbbell },
    { tab: 'progress', label: t.navProgress, icon: BarChart3 },
    { tab: 'history', label: t.navHistory, icon: History },
    { tab: 'settings', label: t.navSettings, icon: SettingsIcon },
  ];

  return (
    <div
      className="min-h-screen bg-[#0B1110] text-[#F4F7F4] flex flex-col font-sans selection:bg-[#B7FF4A]/25 selection:text-[#B7FF4A]"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Top App Bar (Mobile & Desktop) */}
      <header className="sticky top-0 z-40 bg-[#0B1110]/95 backdrop-blur-md border-b border-[#29372F] px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Wordmark & Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#17241D] to-[#29372F] border border-[#B7FF4A]/40 flex items-center justify-center font-black text-xs text-[#B7FF4A] shadow-sm">
              FT
            </div>
            <div>
              <span className="text-sm font-extrabold text-[#F4F7F4] tracking-tight block">
                {t.appTitle}
              </span>
              <span className="text-[10px] text-[#9DAFA6] hidden sm:block">
                {profile.name ? `${profile.name} · ${profile.weightKg}kg` : 'Calisthenics Tracker'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#111A17] p-1 rounded-xl border border-[#29372F]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => onSelectTab(item.tab)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer min-h-[36px] ${
                    isActive
                      ? 'bg-[#B7FF4A] text-[#0B1110] shadow-sm'
                      : 'text-[#9DAFA6] hover:text-[#F4F7F4]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Zone: Streak + PWA Install CTA */}
          <div className="flex items-center gap-2.5 shrink-0">
            {streak > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFAD5A]/15 border border-[#FFAD5A]/30 text-[#FFAD5A] text-xs font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span className="tabular-nums">{streak}</span>
              </div>
            )}

            <PWAInstallButton language={language} variant="header" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 md:pb-12">
        {children}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B1110]/95 backdrop-blur-md border-t border-[#29372F] pb-safe"
      >
        <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => onSelectTab(item.tab)}
                className={`flex flex-col items-center justify-center h-full py-1 text-center transition cursor-pointer relative min-h-[44px] ${
                  isActive ? 'text-[#B7FF4A]' : 'text-[#9DAFA6] hover:text-[#F4F7F4]'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.tab === 'workout' && isWorkoutActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#B7FF4A] ring-2 ring-[#0B1110]" />
                  )}
                </div>
                <span className="text-[10px] font-medium tracking-tight mt-1 truncate max-w-[64px]">
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-[#B7FF4A]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Non-intrusive Offline Indicator */}
      <OfflineIndicator language={language} />
    </div>
  );
};
