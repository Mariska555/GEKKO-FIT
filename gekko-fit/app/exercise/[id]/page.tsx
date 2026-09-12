'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import LineChart from '@/components/LineChart';
import BarChart from '@/components/BarChart';
import { getExercise } from '@/lib/exercises';
import { useBodyweight, useLogs } from '@/lib/useLogs';
import {
  bodyweightLoad,
  calcStreak,
  calcXP,
  epley1RM,
  exerciseProgress,
  intensityK,
  streakK,
} from '@/lib/xp';
import type { SetRecord } from '@/lib/types';

type Tab = 'add' | 'history' | 'stats';

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
const fmtDateFull = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

export default function ExercisePage() {
  const params = useParams();
  const exerciseId = typeof params.id === 'string' ? params.id : '';
  const exercise = getExercise(exerciseId);
  const { logs, addSet, removeSet, clearExercise } = useLogs();
  const [bodyweight] = useBodyweight();
  const [tab, setTab] = useState<Tab>('add');
  const [weightInput, setWeightInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  const [justAdded, setJustAdded] = useState<number | null>(null);

  const exLogs = useMemo(
    () => logs.filter((l) => l.exerciseId === exerciseId),
    [logs, exerciseId]
  );
  const streak = useMemo(() => calcStreak(logs), [logs]);
  const exXP = exLogs.reduce((s, l) => s + l.xp, 0);
  const { pct: exPct, target: exTarget } = exerciseProgress(exXP);

  if (!exercise) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-400">Упражнение не найдено</p>
        <Link href="/" className="text-accent underline">← На главную</Link>
      </div>
    );
  }

  const isBW = exercise.type === 'bodyweight';
  const added = Number(weightInput) || 0;
  const reps = Number(repsInput) || 0;
  const effectiveWeight = isBW ? bodyweightLoad(bodyweight, added) : added;
  const previewXP = reps > 0 && effectiveWeight > 0 ? calcXP(effectiveWeight, reps, streak) : 0;

  const handleAdd = () => {
    if (reps < 1 || effectiveWeight <= 0) return;
    const rec = addSet({ exerciseId: exercise.id, weight: effectiveWeight, reps }, streak);
    setJustAdded(rec.xp);
    setRepsInput('');
    setTimeout(() => setJustAdded(null), 2000);
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Верхняя панель */}
      <div className="sticky top-0 z-10 bg-bg/90 backdrop-blur border-b border-neutral-800">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-neutral-400 hover:text-accent text-xl leading-none" aria-label="Назад">
              ←
            </Link>
            <span className="text-2xl" aria-hidden>{exercise.icon}</span>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold leading-tight truncate">{exercise.name}</h1>
              <p className="text-xs text-neutral-500">
                {exercise.group} · {exXP.toLocaleString('ru-RU')} XP
                {isBW && ` · эфф. вес = 70% от ${bodyweight} кг`}
              </p>
            </div>
          </div>
          {/* Вкладки */}
          <div className="flex gap-1 mt-3 bg-card rounded-xl p-1 border border-neutral-800">
            {(
              [
                ['add', '➕ Подход'],
                ['history', '📜 История'],
                ['stats', '📊 Статистика'],
              ] as [Tab, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                  tab === key ? 'bg-accent text-bg' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-4 pb-10">
        {/* ============ Форма ввода подхода ============ */}
        {tab === 'add' && (
          <div className="bg-card border border-neutral-800 rounded-2xl p-5">
            <h2 className="font-semibold text-sm text-neutral-300 uppercase tracking-wide">Новый подход</h2>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <label className="block">
                <span className="text-xs text-neutral-500">{isBW ? 'Доп. вес, кг (0 если без)' : 'Вес, кг'}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={isBW ? 1 : 2.5}
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder={isBW ? '0' : '60'}
                  className="mt-1 w-full bg-bg border border-neutral-800 rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:border-accent"
                />
              </label>
              <label className="block">
                <span className="text-xs text-neutral-500">Повторения</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={repsInput}
                  onChange={(e) => setRepsInput(e.target.value)}
                  placeholder="10"
                  className="mt-1 w-full bg-bg border border-neutral-800 rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:border-accent"
                />
              </label>
            </div>

            {/* Живой расчёт XP */}
            <div className="mt-4 bg-bg border border-neutral-800 rounded-xl p-4 text-sm">
              <div className="flex justify-between text-neutral-400">
                <span>Эффективный вес</span>
                <span className="text-neutral-200 font-semibold">{effectiveWeight > 0 ? `${effectiveWeight} кг` : '—'}</span>
              </div>
              <div className="flex justify-between text-neutral-400 mt-1.5">
                <span>Коэфф. интенсивности (K)</span>
                <span className="text-neutral-200 font-semibold">
                  {reps > 0 ? `×${intensityK(reps)}` : '—'}
                  {reps > 0 && (
                    <span className="text-neutral-500 text-xs">
                      {' '}({reps <= 5 ? 'сила' : reps <= 12 ? 'гипертрофия' : 'выносливость'})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400 mt-1.5">
                <span>Streak-множитель (нед. подряд: {streak})</span>
                <span className="text-neutral-200 font-semibold">×{streakK(streak)}</span>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-800">
                <span className="font-semibold text-neutral-200">Начислится XP</span>
                <span className="text-2xl font-bold text-accent">+{previewXP.toLocaleString('ru-RU')}</span>
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={reps < 1 || effectiveWeight <= 0}
              className="mt-4 w-full py-3.5 rounded-xl bg-accent text-bg font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] transition"
            >
              {justAdded !== null ? `✓ Записано: +${justAdded.toLocaleString('ru-RU')} XP` : 'Записать подход'}
            </button>

            {exLogs.length > 0 && (
              <div className="mt-5">
                <p className="text-xs text-neutral-500 mb-2">Сегодняшняя сессия</p>
                <div className="flex flex-wrap gap-2">
                  {[...exLogs].reverse().slice(0, 8).map((l) => (
                    <span key={l.id} className="bg-bg border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300">
                      {l.weight} кг × {l.reps} <span className="text-accent">+{l.xp}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============ История ============ */}
        {tab === 'history' && (
          <div className="bg-card border border-neutral-800 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm text-neutral-300 uppercase tracking-wide">
                История · {exLogs.length} подходов
              </h2>
              {exLogs.length > 0 && (
                <button
                  onClick={() => clearExercise(exercise.id)}
                  className="text-xs text-red-400/80 hover:text-red-400"
                >
                  Очистить
                </button>
              )}
            </div>
            {exLogs.length === 0 ? (
              <p className="text-sm text-neutral-500 py-8 text-center">Записей пока нет — добавьте первый подход</p>
            ) : (
              <ul className="mt-4 divide-y divide-neutral-800">
                {[...exLogs].reverse().map((l) => (
                  <li key={l.id} className="py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">
                        {l.weight} кг × {l.reps} <span className="text-neutral-500 font-normal">повт.</span>
                      </p>
                      <p className="text-xs text-neutral-500">
                        {fmtDateFull(l.date)} · {fmtTime(l.date)} · 1RM ≈ {epley1RM(l.weight, l.reps)} кг
                      </p>
                    </div>
                    <span className="text-accent text-sm font-bold shrink-0">+{l.xp.toLocaleString('ru-RU')}</span>
                    <button
                      onClick={() => removeSet(l.id)}
                      className="text-neutral-600 hover:text-red-400 text-lg leading-none px-1"
                      aria-label="Удалить"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* ============ Статистика ============ */}
        {tab === 'stats' && (
          <div className="flex flex-col gap-4">
            {/* Личные рекорды */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                title="Макс. вес"
                value={exLogs.length ? `${Math.max(...exLogs.map((l) => l.weight))} кг` : '—'}
              />
              <StatCard
                title="Макс. объём за подход"
                value={exLogs.length ? `${Math.max(...exLogs.map((l) => l.weight * l.reps)).toLocaleString('ru-RU')} кг` : '—'}
              />
            </div>

            <ChartCard title="Рост одноповторного максимума (1RM)">
              <LineChart data={build1RMHistory(exLogs)} />
            </ChartCard>

            <ChartCard title="Суммарный тоннаж по дням">
              <BarChart data={buildTonnageByDay(exLogs)} />
            </ChartCard>

            <ChartCard title={`Набранный XP · ${exXP.toLocaleString('ru-RU')} из ${exTarget.toLocaleString('ru-RU')}`}>
              <div className="h-2 rounded-full bg-neutral-800 overflow-hidden mb-4">
                <div className="h-full rounded-full bg-accent" style={{ width: `${exPct}%` }} />
              </div>
              <LineChart data={buildXPHistory(exLogs)} color="#f5d623" />
            </ChartCard>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-card border border-neutral-800 rounded-2xl p-4">
      <p className="text-[11px] uppercase tracking-wide text-neutral-500">{title}</p>
      <p className="text-xl font-bold text-accent mt-1">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-card border border-neutral-800 rounded-2xl p-5">
      <h2 className="font-semibold text-sm text-neutral-300 uppercase tracking-wide mb-4">{title}</h2>
      {children}
    </div>
  );
}

/** Кумулятивный максимум 1RM по дням */
function build1RMHistory(logs: SetRecord[]) {
  if (!logs.length) return [];
  let best = 0;
  const byDay = new Map<string, number>();
  for (const l of logs) {
    const key = fmtDate(l.date);
    const rm = epley1RM(l.weight, l.reps);
    byDay.set(key, Math.max(byDay.get(key) ?? 0, rm));
  }
  const out: { label: string; value: number }[] = [];
  for (const [label, v] of byDay) {
    best = Math.max(best, v);
    out.push({ label, value: best });
  }
  return out.slice(-14);
}

/** Тоннаж по дням (последние 14 дней с записями) */
function buildTonnageByDay(logs: SetRecord[]) {
  const byDay = new Map<string, number>();
  for (const l of logs) {
    const key = fmtDate(l.date);
    byDay.set(key, (byDay.get(key) ?? 0) + l.weight * l.reps);
  }
  return [...byDay.entries()].slice(-14).map(([label, value]) => ({ label, value }));
}

/** Кумулятивный XP */
function buildXPHistory(logs: SetRecord[]) {
  let sum = 0;
  return logs.slice(-20).map((l) => {
    sum += l.xp;
    return { label: fmtDate(l.date), value: sum };
  });
}