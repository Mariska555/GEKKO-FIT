export interface SetRecord {
  id: string;
  exerciseId: string;
  /** Эффективный вес в кг (для упражнений с собственным весом уже пересчитан: 0.7 × масса тела) */
  weight: number;
  reps: number;
  xp: number;
  date: string; // ISO
}