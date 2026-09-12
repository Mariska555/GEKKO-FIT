'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { EXERCISES, MUSCLE_GROUPS } from '@/lib/exercises';
import { useBodyweight, useLogs } from '@/lib/useLogs';
import { exerciseProgress } from '@/lib/xp';

export default function HomePage() {
  const { logs, ready } = useLogs();
  const [bodyweight, setBodyweight] = useBodyweight();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('Все');

  const filtered = EXERCISES.filter(
    (e) =>
      (group === 'Все' || e.group === group) &&
      e.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg">
      <Header logs={logs} bodyweight={bodyweight} onBodyweightChange={setBodyweight} />

      <main className="max-w-5xl mx-auto px-4 py-4 pb-10">
        {/* Поиск и фильтры */}
        <div className="flex flex-col gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск упражнения…"
            className="w-full bg-card border border-neutral-800 rounded-2xl px-4 py-3 text-sm placeholder:text-neutral-600 focus:outline-none focus:border-accent"
          />
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
            {MUSCLE_GROUPS.map((g) => (
              <button
                key={g}
                onClick={() => setGroup(g)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                  group === g
                    ? 'bg-accent text-bg border-accent'
                    : 'bg-card text-neutral-400 border-neutral-800 hover:border-neutral-600'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Сетка тренажёров и упражнений */}
        {!ready ? (
          <p className="text-neutral-500 text-sm mt-10 text-center">Загрузка…</p>
        ) : filtered.length === 0 ? (
          <p className="text-neutral-500 text-sm mt-10 text-center">Ничего не найдено</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
            {filtered.map((e) => {
              const exLogs = logs.filter((l) => l.exerciseId === e.id);
              const last = exLogs[exLogs.length - 1];
              const xp = exLogs.reduce((s, l) => s + l.xp, 0);
              const { pct, target } = exerciseProgress(xp);
              return (
                <Link
                  key={e.id}
                  href={`/exercise/${e.id}`}
                  className="block bg-card border border-neutral-800 rounded-2xl p-4 hover:border-accent/70 hover:-translate-y-0.5 transition"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl" aria-hidden>
                      {e.icon}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-neutral-500 bg-bg border border-neutral-800 rounded-full px-2 py-0.5">
                      {e.group}
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold leading-tight text-[15px]">{e.name}</h3>
                  {last ? (
                    <p className="text-xs text-neutral-400 mt-1.5">
                      {last.weight} кг · {last.reps} повт.
                      {e.type === 'bodyweight' && <span className="text-neutral-600"> (эфф. вес)</span>}
                    </p>
                  ) : (
                    <p className="text-xs text-neutral-600 mt-1.5">Нет записей</p>
                  )}
                  <div className="mt-3">
                    <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between mt-1.5 text-[10px] text-neutral-500">
                      <span>{xp.toLocaleString('ru-RU')} XP</span>
                      <span>до {target.toLocaleString('ru-RU')}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}