import { DEFAULT_EXERCISES } from '../data/exercises';
import { ExerciseDefinition, UserProfile, WorkoutSession } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'fitness_tracker_profile',
  EXERCISES: 'fitness_tracker_exercises',
  SESSIONS: 'fitness_tracker_sessions',
};

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  weightKg: 70,
  startDate: new Date().toISOString().split('T')[0],
  theme: 'dark',
  language: 'en',
  soundEnabled: true,
  defaultRestDuration: 45,
  isOnboarded: false,
};

// IndexedDB Helper with localStorage fallback
const DB_NAME = 'MyFitnessTrackerDB';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('dataStore')) {
        db.createObjectStore('dataStore', { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbGet<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('dataStore', 'readonly');
      const store = tx.objectStore('dataStore');
      const req = store.get(key);
      req.onsuccess = () => {
        resolve(req.result ? req.result.value : null);
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    // Fallback to localStorage
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}

async function idbSet<T>(key: string, value: T): Promise<void> {
  // Always mirror to localStorage as well for safety
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or private mode
  }

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('dataStore', 'readwrite');
      const store = tx.objectStore('dataStore');
      const req = store.put({ key, value });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // IndexedDB failure handled by localStorage mirror
  }
}

export async function loadUserProfile(): Promise<UserProfile> {
  const profile = await idbGet<UserProfile>(STORAGE_KEYS.PROFILE);
  if (!profile) return DEFAULT_PROFILE;
  return { ...DEFAULT_PROFILE, ...profile };
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await idbSet(STORAGE_KEYS.PROFILE, profile);
}

export async function loadExercises(): Promise<ExerciseDefinition[]> {
  const saved = await idbGet<ExerciseDefinition[]>(STORAGE_KEYS.EXERCISES);
  if (saved && Array.isArray(saved) && saved.length > 0) {
    return saved;
  }
  return DEFAULT_EXERCISES;
}

export async function saveExercises(exercises: ExerciseDefinition[]): Promise<void> {
  await idbSet(STORAGE_KEYS.EXERCISES, exercises);
}

export async function resetExercisesToDefault(): Promise<ExerciseDefinition[]> {
  await idbSet(STORAGE_KEYS.EXERCISES, DEFAULT_EXERCISES);
  return DEFAULT_EXERCISES;
}

export async function loadSessions(): Promise<WorkoutSession[]> {
  const sessions = await idbGet<WorkoutSession[]>(STORAGE_KEYS.SESSIONS);
  if (sessions && Array.isArray(sessions)) {
    // Sort descending by date/timestamp
    return sessions.sort((a, b) => b.timestamp - a.timestamp);
  }
  return [];
}

export async function saveSession(session: WorkoutSession): Promise<WorkoutSession[]> {
  const sessions = await loadSessions();
  // Filter out any existing session with same id or replace
  const filtered = sessions.filter((s) => s.id !== session.id);
  const updated = [session, ...filtered].sort((a, b) => b.timestamp - a.timestamp);
  await idbSet(STORAGE_KEYS.SESSIONS, updated);
  return updated;
}

export async function deleteSession(sessionId: string): Promise<WorkoutSession[]> {
  const sessions = await loadSessions();
  const updated = sessions.filter((s) => s.id !== sessionId);
  await idbSet(STORAGE_KEYS.SESSIONS, updated);
  return updated;
}

export interface BackupData {
  version: 1;
  exportDate: string;
  profile: UserProfile;
  exercises: ExerciseDefinition[];
  sessions: WorkoutSession[];
  appCredit: string;
}

export async function exportAllData(): Promise<string> {
  const [profile, exercises, sessions] = await Promise.all([
    loadUserProfile(),
    loadExercises(),
    loadSessions(),
  ]);

  const backup: BackupData = {
    version: 1,
    exportDate: new Date().toISOString(),
    profile,
    exercises,
    sessions,
    appCredit: 'Made by Abdul Rehman Ktk',
  };

  return JSON.stringify(backup, null, 2);
}

export async function importData(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const data = JSON.parse(jsonString) as Partial<BackupData>;
    if (!data.profile || !Array.isArray(data.sessions)) {
      return { success: false, message: 'Invalid backup file structure.' };
    }

    if (data.profile) {
      await saveUserProfile({ ...DEFAULT_PROFILE, ...data.profile });
    }
    if (Array.isArray(data.exercises) && data.exercises.length > 0) {
      await saveExercises(data.exercises);
    }
    if (Array.isArray(data.sessions)) {
      await idbSet(STORAGE_KEYS.SESSIONS, data.sessions);
    }

    return { success: true, message: 'Data successfully restored!' };
  } catch (err) {
    return { success: false, message: (err as Error).message || 'Failed to parse JSON file.' };
  }
}

export async function clearAllData(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.EXERCISES);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  } catch {
    // Ignore
  }

  try {
    const db = await openDB();
    const tx = db.transaction('dataStore', 'readwrite');
    tx.objectStore('dataStore').clear();
  } catch {
    // Ignore
  }
}
