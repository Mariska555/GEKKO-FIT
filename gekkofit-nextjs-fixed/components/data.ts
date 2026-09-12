export type Exercise = {
  id: string;
  name: string;
  group: string;
  icon: string;
  weight: number;
  endurance: number;
  best: number;
};

export const exercises: Exercise[] = [
  { id: "bench", name: "Жим штанги лёжа", group: "Грудь", icon: "▰", weight: 80, endurance: 78, best: 95 },
  { id: "lat", name: "Тяга верхнего блока", group: "Спина", icon: "↟", weight: 65, endurance: 64, best: 75 },
  { id: "squat", name: "Приседания", group: "Ноги", icon: "◒", weight: 100, endurance: 82, best: 120 },
  { id: "shoulder", name: "Жим гантелей сидя", group: "Плечи", icon: "✦", weight: 26, endurance: 58, best: 32 },
  { id: "row", name: "Тяга штанги в наклоне", group: "Спина", icon: "≋", weight: 70, endurance: 61, best: 82 },
  { id: "curl", name: "Сгибание рук с гантелями", group: "Бицепс", icon: "◐", weight: 18, endurance: 52, best: 22 },
  { id: "triceps", name: "Разгибание на блоке", group: "Трицепс", icon: "⌁", weight: 35, endurance: 69, best: 42 },
  { id: "legpress", name: "Жим ногами", group: "Ноги", icon: "▰", weight: 180, endurance: 74, best: 220 }
];

export const groups = ["Все", "Грудь", "Спина", "Ноги", "Плечи", "Бицепс", "Трицепс"];

export function intensityK(reps: number) {
  if (reps <= 5) return 1.3;
  if (reps <= 12) return 1;
  return 0.8;
}

export function streakK(weeks: number) {
  if (weeks >= 4) return 1.5;
  if (weeks === 3) return 1.2;
  if (weeks === 2) return 1.1;
  return 1;
}

export function calcXP(weight: number, reps: number, weeks = 2) {
  return Math.round(weight * reps * intensityK(reps) * streakK(weeks));
}

export function rankForXP(xp: number) {
  if (xp >= 150000) return { name: "Обсидиан", next: Infinity, min: 150000 };
  if (xp >= 75000) return { name: "Алмаз", next: 150000, min: 75000 };
  if (xp >= 30000) return { name: "Платина", next: 75000, min: 30000 };
  if (xp >= 10000) return { name: "Золото", next: 30000, min: 10000 };
  if (xp >= 2501) return { name: "Серебро", next: 10000, min: 2501 };
  return { name: "Бронза", next: 2501, min: 0 };
}