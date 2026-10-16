export type Language = 'en' | 'ur';
export type Theme = 'dark' | 'light';

export interface UserProfile {
  name: string;
  weightKg: number;
  startDate: string; // ISO format: YYYY-MM-DD
  heightCm?: number;
  fitnessGoal?: string;
  theme: Theme;
  language: Language;
  soundEnabled: boolean;
  defaultRestDuration: 30 | 45 | 60 | 90;
  reminderTime?: string; // HH:mm format
  isOnboarded: boolean;
}

export type ExerciseType = 'reps' | 'seconds';

export interface ExerciseDefinition {
  id: string; // 'ex-1' to 'ex-18'
  name: {
    en: string;
    ur: string;
  };
  category: 'warmup' | 'push' | 'core' | 'legs' | 'stretch' | 'upper';
  type: ExerciseType;
  baseValue: number; // base reps or seconds in week 1
  currentValue: number; // customizable by user
  sets: number;
  restSeconds: number;
  instructions: {
    en: string;
    ur: string;
  };
  cues: {
    en: string[];
    ur: string[];
  };
  targetMuscles: {
    en: string[];
    ur: string[];
  };
  enabled: boolean;
  order: number;
  iconType: string;
}

export interface SessionExerciseRecord {
  exerciseId: string;
  exerciseName: string;
  category: string;
  type: ExerciseType;
  status: 'completed' | 'skipped' | 'pending';
  targetValue: number;
  actualValue: number;
  targetSets: number;
  actualSets: number;
  completedSets: number;
  elapsedSeconds?: number;
}

export interface WorkoutSession {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  week: number;
  level: number;
  durationSeconds: number;
  warmupCompleted: boolean;
  cooldownCompleted: boolean;
  exercises: SessionExerciseRecord[];
  totalReps: number;
  notes: string;
}

export interface LevelInfo {
  level: number;
  weeks: string;
  nameEn: string;
  nameUr: string;
  descriptionEn: string;
  descriptionUr: string;
}

export interface Badge {
  id: string;
  titleEn: string;
  titleUr: string;
  descriptionEn: string;
  descriptionUr: string;
  icon: string;
  earnedDate?: string;
  isUnlocked: boolean;
}
