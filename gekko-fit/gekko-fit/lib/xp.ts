import type { SetRecord } from './types';

/* ===================== XP ===================== */

/** Коэффициент интенсивности: 1–5 повт. → 1.3 (сила), 6–12 → 1.0 (гипертрофия), 13+ → 0.8 (выносливость) */
export function intensityK(reps: number): number {
  if (reps >= 1 && reps <= 5) return 1.3;
  if (reps <= 12) return 1.0;
  return 0.8;
}

/** Множитель регулярности: 1 нед. → 1.0, 2 → 1.1, 3 → 1.2, 4+ → 1.5 */
export function streakK(weeks: number): number {
  if (weeks >= 4) return 1.5;
  if (weeks === 3) return 1.2;
  if (weeks === 2) return 1.1;
  return 1.0;
}

/** XP за подход = вес × повторения × K_интенсивности × K_streak */
export function calcXP(weight: number, reps: number, weeks: number): number {
  return Math.round(weight * reps * intensityK(reps) * streakK(weeks));
}

/** Упражнения с собственным весом: базовый вес = 70% от массы тела (+ отягощение) */
export function bodyweightLoad(bodyweight: number, added: number): number {
  return Math.round((bodyweight + added) * 0.7 * 10) / 10;
}

/** Одноповторный максимум по формуле Эпли */
export function epley1RM(weight: number, reps: number): number {
  if (reps <= 1) return Math.round(weight);
  return Math.round(weight * (1 + reps / 30));
}

/* ===================== Ранги ===================== */

export interface Rank {
  name: string;
  min: number;
  icon: string;
  note: string;
}

export const RANKS: Rank[] = [
  { name: 'Бронза', min: 0, icon: '🦎', note: 'Геккон в базовой майке' },
  { name: 'Серебро', min: 2500, icon: '🎒', note: 'Спортивная сумка и перчатки' },
  { name: 'Золото', min: 10000, icon: '💪', note: 'Раскачанный физикум' },
  { name: 'Платина', min: 30000, icon: '🧗', note: 'Профи-экипировка и магнезия' },
  { name: 'Алмаз', min: 75000, icon: '💎', note: 'Алмазные пятна, свечение глаз' },
  { name: 'Обсидиан', min: 150000, icon: '🌑', note: 'Мистический вид, тёмная аура' },
];

export function rankIndex(xp: number): number {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].min) idx = i;
  }
  return idx;
}

export function rankProgress(xp: number): { rank: Rank; next: Rank | null; pct: number } {
  const idx = rankIndex(xp);
  const rank = RANKS[idx];
  const next = idx + 1 < RANKS.length ? RANKS[idx + 1] : null;
  const pct = next ? Math.min(100, Math.round(((xp - rank.min) / (next.min - rank.min)) * 100)) : 100;
  return { rank, next, pct };
}

/* ===================== Прогресс-бар выносливости (по тренажёру) ===================== */

const EX_STEPS = [100, 400, 1200, 3000, 6000];

export function exerciseProgress(xp: number): { pct: number; target: number } {
  const target = EX_STEPS.find((s) => xp < s) ?? 6000;
  return { pct: Math.min(100, Math.round((xp / target) * 100)), target };
}

/* ===================== Streak ===================== */

/** Ключ недели (понедельник) в виде timestamp */
function weekKey(d: Date): number {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // 0 = понедельник
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/** Число полных подряд идущих недель с тренировками (текущая неделя может быть ещё не закрыта) */
export function calcStreak(logs: SetRecord[]): number {
  const weeks = new Set(logs.map((l) => weekKey(new Date(l.date))));
  if (weeks.size === 0) return 0;
  let streak = 0;
  let wk = weekKey(new Date());
  if (!weeks.has(wk)) wk -= 7 * 24 * 3600 * 1000; // текущая неделя ещё идёт — смотрим предыдущую
  while (weeks.has(wk)) {
    streak += 1;
    wk -= 7 * 24 * 3600 * 1000;
  }
  return streak;
}