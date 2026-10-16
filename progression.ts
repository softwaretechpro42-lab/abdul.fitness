import { Badge, LevelInfo, WorkoutSession } from '../types';

export const LEVELS: LevelInfo[] = [
  {
    level: 1,
    weeks: '1–2',
    nameEn: 'Beginner Start',
    nameUr: 'ابتدائی آغاز',
    descriptionEn: 'Forming neural pathways, establishing bodyweight baselines and workout consistency.',
    descriptionUr: 'بنیادی تکنیک سیکھنا اور باقاعدگی قائم کرنا۔',
  },
  {
    level: 2,
    weeks: '3–4',
    nameEn: 'Foundation Builder',
    nameUr: 'بنیاد ساز',
    descriptionEn: 'Building muscular endurance, stabilizing joints and strengthening core posture.',
    descriptionUr: 'پٹھوں کی برداشت اور جوڑوں کی مضبوطی پیدا کرنا۔',
  },
  {
    level: 3,
    weeks: '5–6',
    nameEn: 'Strength Starter',
    nameUr: 'طاقت کا آغاز',
    descriptionEn: 'Increasing pushing power, deeper squats and enhanced shoulder stabilization.',
    descriptionUr: 'پش اپس اور اسکواٹس میں گہرائی اور قوت بڑھانا۔',
  },
  {
    level: 4,
    weeks: '7–8',
    nameEn: 'Endurance Builder',
    nameUr: 'برداشت کا نمو',
    descriptionEn: 'Shorter recovery times between sets and increased total repetition volume.',
    descriptionUr: 'سیٹس کے درمیان کم آرام اور زیادہ تعداد۔',
  },
  {
    level: 5,
    weeks: '9–10',
    nameEn: 'Power Beginner',
    nameUr: 'طاقتور مبتدی',
    descriptionEn: 'Explosive bodyweight recruitment, jump squats and enhanced neuromuscular drive.',
    descriptionUr: 'دھماکہ خیز قوت اور جمپنگ مشقوں پر کنٹرول۔',
  },
  {
    level: 6,
    weeks: '11–12',
    nameEn: 'Core Crusher',
    nameUr: 'کور کرشر',
    descriptionEn: 'Longer plank hold duration and reinforced abdominal/oblique stability.',
    descriptionUr: 'پلانک کے طویل دورانیے اور پیٹ کی چٹان جیسی سختی۔',
  },
  {
    level: 7,
    weeks: '13–14',
    nameEn: 'Muscle Builder',
    nameUr: 'عضلات ساز',
    descriptionEn: 'Midpoint hypertrophy phase, high time-under-tension and mechanical work.',
    descriptionUr: 'نصف راستہ طے: پٹھوں کی نمو اور سخت محنت۔',
  },
  {
    level: 8,
    weeks: '15–16',
    nameEn: 'Advanced Beginner',
    nameUr: 'اعلیٰ درجے کا آغاز',
    descriptionEn: 'Mastering challenging variations including diamond push-ups and plyometrics.',
    descriptionUr: 'ڈائمنڈ پش اپس اور پلائیو میٹرک میں مہارت۔',
  },
  {
    level: 9,
    weeks: '17–18',
    nameEn: 'Power Builder',
    nameUr: 'پاور بلڈر',
    descriptionEn: 'Superior upper body pushing capacity and explosive lower body power.',
    descriptionUr: 'اوپری اور نچلے دھڑ کی اعلیٰ مشترکہ طاقت۔',
  },
  {
    level: 10,
    weeks: '19–20',
    nameEn: 'Strength Master',
    nameUr: 'طاقت کا ماہر',
    descriptionEn: 'Near-calisthenics mastery, flawless form under accumulated fatigue.',
    descriptionUr: 'تھکاوٹ کے باوجود بہترین جسمانی توازن اور طاقت۔',
  },
  {
    level: 11,
    weeks: '21–22',
    nameEn: 'Elite Beginner',
    nameUr: 'ایلیٹ فیز',
    descriptionEn: 'High rep volume execution, iron grip and exceptional cardio-muscular health.',
    descriptionUr: 'انتہائی تیز اور مضبوط ورزش کی صلاحیت۔',
  },
  {
    level: 12,
    weeks: '23–24',
    nameEn: 'Pro Athlete Mode',
    nameUr: 'پرو ایتھلیٹ موڈ',
    descriptionEn: 'Peak conditioning, high-level isometric endurance and pristine tempo.',
    descriptionUr: 'عروج کی فٹنس اور پیشہ ور کھلاڑی جیسا جذبہ۔',
  },
  {
    level: 13,
    weeks: '25–26',
    nameEn: '6-Month Champion',
    nameUr: '۶ ماہ کا چیمپئن',
    descriptionEn: 'The ultimate milestone: Complete physical transformation through 26 weeks.',
    descriptionUr: 'حتمی سنگ میل: ۲۶ ہفتوں کی مسلسل محنت کا شاندار اختتام۔',
  },
];

/**
 * Calculates calendar progression week from start date:
 * week = floor(days since start date / 7) + 1
 * Clamped between 1 and 26.
 */
export function calculateWeek(startDateStr: string, currentDate: Date = new Date()): number {
  if (!startDateStr) return 1;
  const start = new Date(startDateStr);
  start.setHours(0, 0, 0, 0);

  const current = new Date(currentDate);
  current.setHours(0, 0, 0, 0);

  const diffTime = current.getTime() - start.getTime();
  if (diffTime < 0) return 1;

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;

  return Math.min(26, Math.max(1, week));
}

/**
 * Calculates level from week:
 * level = ceil(week / 2)
 */
export function calculateLevel(week: number): number {
  const safeWeek = Math.min(26, Math.max(1, week));
  return Math.min(13, Math.max(1, Math.ceil(safeWeek / 2)));
}

export function getLevelInfo(level: number): LevelInfo {
  const safeLevel = Math.min(13, Math.max(1, level));
  return LEVELS[safeLevel - 1] || LEVELS[0];
}

/**
 * Progression formula:
 * Reps: baseReps + (week - 1)
 * Seconds (plank, stretches): baseSeconds + (week - 1) * 3 (increases by 3 seconds per week)
 */
export function calculateExerciseTarget(baseValue: number, week: number, type: 'reps' | 'seconds'): number {
  const safeWeek = Math.min(26, Math.max(1, week));
  if (type === 'reps') {
    return Math.max(1, baseValue + (safeWeek - 1));
  }
  // For timed exercises (plank, side plank, stretches)
  return Math.max(10, baseValue + (safeWeek - 1) * 3);
}

/**
 * Checks if a given date is Sunday (0 = Sunday in JS getDay())
 */
export function isSunday(date: Date = new Date()): boolean {
  return date.getDay() === 0;
}

/**
 * Calculates current streak based on actual completed sessions.
 * Missing a scheduled workout (Monday-Saturday) breaks the streak.
 * Sundays are excluded from streak requirements!
 */
export function calculateStreak(sessions: WorkoutSession[], today: Date = new Date()): number {
  if (!sessions || sessions.length === 0) return 0;

  // Set of dates with saved workouts
  const completedDateStrings = new Set(sessions.map((s) => s.date));

  let streak = 0;
  const checkDate = new Date(today);
  checkDate.setHours(0, 0, 0, 0);

  const todayStr = checkDate.toISOString().split('T')[0];
  const hasToday = completedDateStrings.has(todayStr);

  // If today has workout, streak starts with today.
  // If today is Sunday or today workout not yet done, we can check starting from yesterday
  if (!hasToday) {
    if (checkDate.getDay() !== 0) {
      // It's Mon-Sat and today isn't done yet: check if yesterday was done to count previous streak
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Today is Sunday, rest day! Start checking backwards from Saturday
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // Iterate backwards day by day
  let safetyCounter = 0;
  while (safetyCounter < 365) {
    safetyCounter++;
    const dateStr = checkDate.toISOString().split('T')[0];
    const isSun = checkDate.getDay() === 0;

    if (isSun) {
      // Sunday is rest day: does NOT break streak and does NOT require a workout
      checkDate.setDate(checkDate.getDate() - 1);
      continue;
    }

    if (completedDateStrings.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Missing a scheduled day breaks the streak
      break;
    }
  }

  return streak;
}

/**
 * Evaluates earned badges strictly from actual saved workouts.
 * No fabricated activity!
 */
export function evaluateBadges(sessions: WorkoutSession[], week: number, streak: number): Badge[] {
  const completedCount = sessions.length;
  const maxPlank = sessions.reduce((max, s) => {
    const plank = s.exercises.find((e) => e.exerciseId === 'ex-14' && e.status === 'completed');
    if (plank && plank.actualValue > max) return plank.actualValue;
    return max;
  }, 0);

  const level = calculateLevel(week);

  const badges: Badge[] = [
    {
      id: 'first_workout',
      titleEn: 'First Workout',
      titleUr: 'پہلی ورزش',
      descriptionEn: 'Completed your very first workout session.',
      descriptionUr: 'اپنی زندگی کی پہلی ورک آؤٹ مکمل کی۔',
      icon: 'zap',
      isUnlocked: completedCount >= 1,
      earnedDate: completedCount >= 1 ? sessions[0]?.date : undefined,
    },
    {
      id: 'streak_7',
      titleEn: '7-Day Streak',
      titleUr: '۷ دن کا تسلسل',
      descriptionEn: 'Maintained 7 active days of consistent training without missing a workout.',
      descriptionUr: 'بغیر ناغہ ۷ دن مسلسل تربیت جاری رکھی۔',
      icon: 'flame',
      isUnlocked: streak >= 7,
    },
    {
      id: 'level_5',
      titleEn: 'Level 5 Reached',
      titleUr: 'لیول ۵ مکمل',
      descriptionEn: 'Advanced to Power Beginner (Week 9+).',
      descriptionUr: 'پاور بگنر کا درجہ حاصل کیا۔',
      icon: 'award',
      isUnlocked: level >= 5,
    },
    {
      id: 'plank_master',
      titleEn: 'Iron Core (60s+ Plank)',
      titleUr: 'آہنی کور (۶۰ سیکنڈ پلانک)',
      descriptionEn: 'Successfully held a continuous plank for 60 seconds or longer.',
      descriptionUr: '۶۰ سیکنڈ یا اس سے زیادہ کا مسلسل پلانک مکمل کیا۔',
      icon: 'shield',
      isUnlocked: maxPlank >= 60,
    },
    {
      id: 'streak_30',
      titleEn: '30-Day Streak',
      titleUr: '۳۰ دن کا تسلسل',
      descriptionEn: 'Unstoppable consistency: 30 scheduled days completed.',
      descriptionUr: '۳۰ دن کا شاندار اور غیر متزلزل تسلسل۔',
      icon: 'trophy',
      isUnlocked: streak >= 30,
    },
    {
      id: 'champion_6m',
      titleEn: '6-Month Champion',
      titleUr: '۶ ماہ کا چیمپئن',
      descriptionEn: 'Completed all 26 weeks and attained Level 13 mastery!',
      descriptionUr: 'مکمل ۲۶ ہفتے مکمل کر کے عظیم الشان چیمپئن بن گئے!',
      icon: 'crown',
      isUnlocked: week >= 26 && completedCount >= 20,
    },
  ];

  return badges;
}
