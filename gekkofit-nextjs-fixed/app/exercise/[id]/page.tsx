 "use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trophy, History, ChartNoAxesCombined, Trash2 } from "lucide-react";
import { exercises, calcXP, intensityK, streakK } from "../../../components/data";

type SetItem = { id: number; weight: number; reps: number; xp: number; date: string };

export default function ExercisePage({ params }: { params: { id: string } }) {
  const ex = exercises.find(e=>e.id===params.id) ?? exercises[0];
  const [weight, setWeight] = useState(ex.weight);
  const [reps, setReps] = useState(8);
  const [sets, setSets] = useState<SetItem[]>([]);
  const xpPreview = calcXP(Number(weight)||0, Number(reps)||0, 2);
  const total = sets.reduce((s,x)=>s+x.xp,0);
  const chart = [42,46,45,53,50,64,68,78];

  function addSet() {
    if (weight <= 0 || reps <= 0) return;
    setSets(v=>[...v,{id:Date.now(),weight:Number(weight),reps:Number(reps),xp:xpPreview,date:new Date().toLocaleDateString("ru-RU")}]);
  }

  return <div className="min-h-screen">
    <div className="mx-auto max-w-5xl px-5 py-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#F5A623]"><ArrowLeft className="h-4 w-4"/>Назад к тренировкам</Link>
      <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="text-xs font-bold uppercase tracking-[.2em] text-[#F5A623]">{ex.group}</div><h1 className="mt-2 text-3xl font-black sm:text-5xl">{ex.name}</h1><p className="mt-2 text-sm text-zinc-500">Лучший вес: {ex.best} кг · Рабочий: {ex.weight} кг</p></div><div className="rounded-2xl border border-[#2b2b2b] bg-[#171717] px-5 py-4 text-right"><div className="text-xs text-zinc-500">XP сегодня</div><div className="text-2xl font-black text-[#F5A623]">{total} XP</div></div></div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <div className="card rounded-3xl p-5 sm:p-7">
          <div className="flex items-center justify-between"><h2 className="text-lg font-black">Новый подход</h2><span className="rounded-full bg-[#F5A623]/10 px-3 py-1 text-xs text-[#F5A623]">× {streakK(2).toFixed(1)} streak</span></div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <label className="rounded-2xl border border-[#2c2c2c] bg-[#151515] p-4"><span className="text-xs text-zinc-600">Вес, кг</span><input type="number" value={weight} onChange={e=>setWeight(Number(e.target.value))} className="mt-2 w-full bg-transparent text-3xl font-black outline-none"/></label>
            <label className="rounded-2xl border border-[#2c2c2c] bg-[#151515] p-4"><span className="text-xs text-zinc-600">Повторения</span><input type="number" value={reps} onChange={e=>setReps(Number(e.target.value))} className="mt-2 w-full bg-transparent text-3xl font-black outline-none"/></label>
          </div>
          <div className="mt-4 rounded-2xl bg-[#222] p-4"><div className="flex justify-between text-xs text-zinc-500"><span>Интенсивность</span><b className="text-zinc-200">× {intensityK(reps).toFixed(1)}</b></div><div className="mt-2 text-3xl font-black text-[#F5A623]">+{xpPreview} XP</div><div className="mt-1 text-xs text-zinc-600">{weight} кг × {reps} повторений × коэффициенты</div></div>
          <button onClick={addSet} className="mt-4 w-full rounded-2xl bg-[#F5A623] py-4 text-sm font-black text-black hover:bg-[#FFC35A]"><Plus className="mr-2 inline h-4 w-4"/>Добавить подход</button>
        </div>
        <div className="card rounded-3xl p-5 sm:p-7">
          <div className="flex items-center gap-2"><ChartNoAxesCombined className="h-5 w-5 text-[#F5A623]"/><h2 className="font-black">Рост 1RM</h2></div>
          <div className="mt-8 flex h-44 items-end gap-2">{chart.map((v,i)=><div key={i} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-lg bg-[#F5A623]" style={{height:`${v}%`,opacity:.35+i*.08}}/><span className="text-[9px] text-zinc-700">{i+1}</span></div>)}</div>
          <div className="mt-5 flex items-end justify-between"><div><div className="text-xs text-zinc-600">Текущий 1RM</div><div className="text-3xl font-black">95 <span className="text-sm text-zinc-500">кг</span></div></div><div className="text-right text-xs text-emerald-400">+14.5% за 30 дней</div></div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <div className="card rounded-3xl p-5"><div className="flex items-center gap-2"><Trophy className="h-5 w-5 text-[#F5A623]"/><h2 className="font-black">Личные рекорды</h2></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[#171717] p-4"><div className="text-xs text-zinc-600">Макс. вес</div><div className="mt-2 text-2xl font-black">95 кг</div></div><div className="rounded-2xl bg-[#171717] p-4"><div className="text-xs text-zinc-600">Объём</div><div className="mt-2 text-2xl font-black">720 кг</div></div></div></div>
        <div className="card rounded-3xl p-5"><div className="flex items-center gap-2"><History className="h-5 w-5 text-[#F5A623]"/><h2 className="font-black">История подходов</h2></div><div className="mt-4 overflow-hidden rounded-2xl border border-[#292929]">{sets.length===0 ? <div className="p-8 text-center text-sm text-zinc-600">Добавь первый подход — он появится здесь.</div> : sets.slice().reverse().map(s=><div key={s.id} className="flex items-center justify-between border-b border-[#252525] px-4 py-3 last:border-0"><div><b>{s.weight} кг × {s.reps}</b><div className="text-xs text-zinc-600">{s.date}</div></div><div className="text-sm font-bold text-[#F5A623]">+{s.xp} XP</div><button onClick={()=>setSets(v=>v.filter(x=>x.id!==s.id))} className="text-zinc-700 hover:text-red-400"><Trash2 className="h-4 w-4"/></button></div>))}</div></div>
      </div>
    </div>
  </div>;
}