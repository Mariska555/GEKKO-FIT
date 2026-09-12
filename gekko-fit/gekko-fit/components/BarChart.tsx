'use client';

import type { ChartPoint } from './LineChart';

export default function BarChart({
  data,
  color = '#F5A623',
  height = 170,
}: {
  data: ChartPoint[];
  color?: string;
  height?: number;
}) {
  if (!data.length) {
    return <p className="text-sm text-neutral-500 py-6 text-center">Пока нет данных — добавьте первый подход</p>;
  }
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 h-full min-w-0">
            <span className="text-[10px] text-neutral-400 whitespace-nowrap">
              {d.value >= 10000 ? `${(d.value / 1000).toFixed(0)}k` : d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : d.value}
            </span>
            <div
              className="w-full rounded-t-md"
              style={{ height: `${Math.max(3, (d.value / max) * (height - 44))}px`, background: color, opacity: 0.85 }}
            />
            <span className="text-[10px] text-neutral-500 truncate w-full text-center">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}