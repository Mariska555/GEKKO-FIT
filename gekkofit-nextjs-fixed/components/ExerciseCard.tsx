import Link from "next/link";
import type { Exercise } from "./data";
import { ChevronRight } from "lucide-react";

export default function ExerciseCard({ ex }: { ex: Exercise }) {
  return (
    <Link href={`/exercise/${ex.id}`} className="card group rounded-2xl p-4 transition hover:-translate-y-1 hover:border-[#F5A623]/40">
      <div className="flex items-start justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#242424] text-xl text-[#F5A623]">{ex.icon}</div>
        <ChevronRight className="h-5 w-5 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-[#F5A623]" />
      </div>
      <div className="mt-5 text-base font-bold">{ex.name}</div>
      <div className="mt-1 text-xs text-zinc-500">{ex.group}</div>
      <div className="mt-5 flex items-end justify-between">
        <div><div className="text-[11px] uppercase tracking-wider text-zinc-600">Рабочий вес</div><div className="mt-1 text-xl font-black">{ex.weight}<span className="ml-1 text-sm text-zinc-500">кг</span></div></div>
        <div className="text-right"><div className="text-[11px] uppercase tracking-wider text-zinc-600">Выносливость</div><div className="mt-1 text-sm font-bold text-[#F5A623]">{ex.endurance}%</div></div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#303030]"><div className="h-full rounded-full bg-[#F5A623]" style={{width: `${ex.endurance}%`}} /></div>
    </Link>
  );
}