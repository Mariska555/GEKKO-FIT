'use client';

export interface ChartPoint {
  label: string;
  value: number;
}

export default function LineChart({
  data,
  color = '#F5A623',
  height = 160,
}: {
  data: ChartPoint[];
  color?: string;
  height?: number;
}) {
  if (!data.length) {
    return <p className="text-sm text-neutral-500 py-6 text-center">Пока нет данных — добавьте первый подход</p>;
  }
  const W = 640;
  const padX = 28;
  const padBottom = 26;
  const padTop = 14;
  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const stepX = (W - padX * 2) / Math.max(data.length - 1, 1);
  const y = (v: number) => height - padBottom - ((v - min) / range) * (height - padBottom - padTop);
  const pts = data.map((d, i) => [padX + i * stepX, y(d.value)] as const);
  const line = pts.map((p) => `${p[0]},${p[1]}`).join(' ');
  const area = `${padX},${height - padBottom} ${line} ${padX + (data.length - 1) * stepX},${height - padBottom}`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${height}`} className="w-full" role="img" aria-label="Линейный график">
        <polygon points={area} fill={color} opacity={0.12} />
        <polyline points={line} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={3.5} fill={color} />
        ))}
      </svg>
      <div className="flex justify-between items-center text-xs text-neutral-500 px-1 mt-1">
        <span>{data[0].label}</span>
        <span className="text-accent font-semibold">пик: {max.toLocaleString('ru-RU')}</span>
        <span>{data[data.length - 1].label}</span>
      </div>
    </div>
  );
}