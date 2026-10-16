import React, { useState, useEffect } from 'react';
import {
  clearAllData,
  deleteSession,
  loadExercises,
  loadSessions,
  loadUserProfile,
  resetExercisesToDefault,
  saveExercises,
  saveSession,
  saveUserProfile,
} from './services/storage';
import {
  calculateExerciseTarget,
  calculateLevel,
  calculateStreak,
  calculateWeek,
  evaluateBadges,
  getLevelInfo,
} from './services/progression';
import {
  Badge,
  ExerciseDefinition,
  Language,
  UserProfile,
  WorkoutSession,
} from './types';
import { Onboarding } from './components/Onboarding';
import { AppShell, NavTab } from './components/AppShell';
import { HomeDashboard } from './components/HomeDashboard';
import { ActiveWorkout } from './components/ActiveWorkout';
import { ProgressDashboard } from './components/ProgressDashboard';
import { WorkoutHistory } from './components/WorkoutHistory';
import { Settings } from './components/Settings';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [exercises, setExercises] = useState<ExerciseDefinition[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    async function init() {
      try {
        const [loadedProfile, loadedExercises, loadedSessions] = await Promise.all([
          loadUserProfile(),
          loadExercises(),
          loadSessions(),
        ]);

        setProfile(loadedProfile);
        setExercises(loadedExercises);
        setSessions(loadedSessions);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Theme & HTML Attributes synchronization
  useEffect(() => {
    if (!profile) return;
    const root = document.documentElement;
    if (profile.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }

    root.setAttribute('lang', profile.language);
    root.setAttribute('dir', profile.language === 'ur' ? 'rtl' : 'ltr');
  }, [profile?.theme, profile?.language]);

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-[#0B1110] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#29372F] border-t-[#B7FF4A] animate-spin" />
      </div>
    );
  }

  // Mandatory Onboarding Flow
  if (!profile.isOnboarded) {
    return (
      <Onboarding
        initialLanguage={profile.language}
        onLanguageChange={(lang: Language) => {
          setProfile((prev) => (prev ? { ...prev, language: lang } : null));
        }}
        onComplete={async (newProfile: UserProfile) => {
          await saveUserProfile(newProfile);
          setProfile(newProfile);
        }}
      />
    );
  }

  // Calculate Progression Metrics
  const week = calculateWeek(profile.startDate);
  const level = calculateLevel(week);
  const levelInfo = getLevelInfo(level);
  const streak = calculateStreak(sessions);
  const badges = evaluateBadges(sessions, week, streak);

  // Dynamically calculate progressive targets for current week
  const progressiveExercises = exercises.map((ex) => ({
    ...ex,
    currentValue: calculateExerciseTarget(ex.baseValue, week, ex.type),
  }));

  // Handlers
  const handleStartWorkout = () => {
    setIsWorkoutActive(true);
    setActiveTab('workout');
  };

  const handleFinishWorkout = async (session: WorkoutSession) => {
    const updatedSessions = await saveSession(session);
    setSessions(updatedSessions);
    setIsWorkoutActive(false);
    setActiveTab('history');
  };

  const handleDeleteSession = async (sessionId: string) => {
    const updatedSessions = await deleteSession(sessionId);
    setSessions(updatedSessions);
  };

  const handleUpdateProfile = async (updated: UserProfile) => {
    await saveUserProfile(updated);
    setProfile(updated);
  };

  const handleUpdateExercises = async (updated: ExerciseDefinition[]) => {
    await saveExercises(updated);
    setExercises(updated);
  };

  const handleResetExercises = async () => {
    const defaults = await resetExercisesToDefault();
    setExercises(defaults);
  };

  const handleResetAllData = async () => {
    await clearAllData();
    window.location.reload();
  };

  return (
    <AppShell
      activeTab={activeTab}
      onSelectTab={(tab) => setActiveTab(tab)}
      profile={profile}
      language={profile.language}
      streak={streak}
      isWorkoutActive={isWorkoutActive}
    >
      {activeTab === 'home' && (
        <HomeDashboard
          profile={profile}
          week={week}
          levelInfo={levelInfo}
          streak={streak}
          sessions={sessions}
          exercises={progressiveExercises}
          badges={badges}
          language={profile.language}
          onStartWorkout={handleStartWorkout}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      )}

      {activeTab === 'workout' && (
        <ActiveWorkout
          week={week}
          level={level}
          exercises={progressiveExercises}
          language={profile.language}
          soundEnabled={profile.soundEnabled}
          defaultRestDuration={profile.defaultRestDuration}
          onFinishSession={handleFinishWorkout}
          onCancelWorkout={() => {
            setIsWorkoutActive(false);
            setActiveTab('home');
          }}
        />
      )}

      {activeTab === 'progress' && (
        <ProgressDashboard
          profile={profile}
          week={week}
          levelInfo={levelInfo}
          streak={streak}
          sessions={sessions}
          badges={badges}
          language={profile.language}
        />
      )}

      {activeTab === 'history' && (
        <WorkoutHistory
          sessions={sessions}
          language={profile.language}
          onDeleteSession={handleDeleteSession}
        />
      )}

      {activeTab === 'settings' && (
        <Settings
          profile={profile}
          exercises={exercises}
          language={profile.language}
          onUpdateProfile={handleUpdateProfile}
          onUpdateExercises={handleUpdateExercises}
          onResetExercises={handleResetExercises}
          onResetAllData={handleResetAllData}
        />
      )}
    </AppShell>
  );
}
