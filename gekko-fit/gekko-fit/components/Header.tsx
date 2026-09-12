'use client';

import { rankProgress, calcStreak } from '@/lib/xp';
import type { SetRecord } from '@/lib/types';

export default function Header({
  logs,
  bodyweight,
  onBodyweightChange,
}: {
  logs: SetRecord[];
  bodyweight: number;
  onBodyweightChange: (w: number) => void;
}) {
  const totalXP = logs.reduce((s, l) => s + l.xp, 0);
  const { rank, next, pct } = rankProgress(totalXP);
  const streak = calcStreak(logs);

  return (
    <header className="sticky top-0 z-10 bg-bg/90 backdrop-blur border-b border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="GEKKO FIT" className="h-11 w-11 rounded-xl object-cover border border-neutral-800" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-bold">GEKKO FIT</p>
            <p className="text-sm text-neutral-300 truncate">
              {rank.icon} {rank.name}
              <span className="text-neutral-500"> · {totalXP.toLocaleString('ru-RU')} XP</span>
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg leading-none">🔥</p>
            <p className="text-xs text-neutral-300 font-semibold">
              {streak} <span className="text-neutral-500">нед.</span>
            </p>
            <p className="text-[10px] text-neutral-500">streak ×{streak >= 4 ? '1.5' : streak === 3 ? '1.2' : streak === 2 ? '1.1' : '1.0'}</p>
          </div>
        </div>

        <div className="mt-2.5">
          <div className="flex justify-between text-[11px] text-neutral-500 mb-1">
            <span>{next ? `${rank.name} → ${next.name}` : 'Максимальный ранг'}</span>
            {next && <span>до {next.name}: {(next.min - totalXP).toLocaleString('ru-RU')} XP</span>}
          </div>
          <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
            <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
          <span>⚖️ Вес тела:</span>
          <input
            type="number"
            min={30}
            max={250}
            value={bodyweight}
            onChange={(e) => onBodyweightChange(Number(e.target.value) || 0)}
            className="w-16 bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-neutral-200 focus:outline-none focus:border-accent"
          />
          <span>кг · для упражнений с собственным весом берётся 70%</span>
        </div>
      </div>
    </header>
  );
}