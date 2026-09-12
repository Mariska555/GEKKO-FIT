export type ExerciseType = 'barbell' | 'machine' | 'bodyweight';

export interface Exercise {
  id: string;
  name: string;
  group: string;
  type: ExerciseType;
  icon: string;
}

export const MUSCLE_GROUPS = ['Все', 'Грудь', 'Спина', 'Ноги', 'Плечи', 'Бицепс', 'Трицепс'];

export const EXERCISES: Exercise[] = [
  { id: 'bench-press', name: 'Жим штанги лежа', group: 'Грудь', type: 'barbell', icon: '🏋️' },
  { id: 'incline-db-press', name: 'Жим гантелей на наклонной', group: 'Грудь', type: 'machine', icon: '💪' },
  { id: 'push-ups', name: 'Отжимания от пола', group: 'Грудь', type: 'bodyweight', icon: '🤸' },
  { id: 'dips', name: 'Брусья', group: 'Грудь', type: 'bodyweight', icon: '🧗' },
  { id: 'lat-pulldown', name: 'Тяга верхнего блока', group: 'Спина', type: 'machine', icon: '⛓️' },
  { id: 'barbell-row', name: 'Тяга штанги в наклоне', group: 'Спина', type: 'barbell', icon: '🚣' },
  { id: 'pull-ups', name: 'Подтягивания', group: 'Спина', type: 'bodyweight', icon: '🌿' },
  { id: 'deadlift', name: 'Становая тяга', group: 'Ноги', type: 'barbell', icon: '🏆' },
  { id: 'squat', name: 'Приседания со штангой', group: 'Ноги', type: 'barbell', icon: '🦵' },
  { id: 'leg-press', name: 'Жим ногами', group: 'Ноги', type: 'machine', icon: '🛞' },
  { id: 'calf-raise', name: 'Подъём на носки', group: 'Ноги', type: 'machine', icon: '🐄' },
  { id: 'ohp', name: 'Жим гантелей сидя', group: 'Плечи', type: 'machine', icon: '🙌' },
  { id: 'lateral-raise', name: 'Разводка гантелей в стороны', group: 'Плечи', type: 'machine', icon: '🕊️' },
  { id: 'biceps-curl', name: 'Подъём штанги на бицепс', group: 'Бицепс', type: 'barbell', icon: '💥' },
  { id: 'french-press', name: 'Французский жим', group: 'Трицепс', type: 'barbell', icon: '⚡' },
];

export const getExercise = (id: string) => EXERCISES.find((e) => e.id === id);