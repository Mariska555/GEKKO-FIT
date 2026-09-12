 "use client";
import { useMemo, useState } from "react";
import { Search, Plus, Flame, Target, Dumbbell, BarChart3, Sparkles } from "lucide-react";
import Header from "./Header";
import ExerciseCard from "./ExerciseCard";
import { exercises, groups, rankForXP } from "./data";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("Все");
  const [xp] = useState(12740);
  const streak = 12;
  const rank = rankForXP(xp);
  const filtered = useMemo(() => exercises.filter(e => (group === "Все" || e.group === group) && e.name.toLowerCase().includes(query.toLowerCase())), [query, group]);

  return (
    <div className="min-h-screen">
      <Header xp={xp} streak={streak} rank={rank.name} />
      <main className="mx-auto max-w-7xl px-5 py-7 lg:px-8">
        <section className="fade-up grid gap-4 lg:grid-cols-[1.6fr_.8fr]">
          <div className="card gold-glow relative overflow-hidden rounded-3xl p-6 sm:p-8">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#F5A623]/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#F5A623]"><Sparkles className="h-4 w-4" /> Сегодня</div>
              <h1 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">Не пропускай.<br /><span className="text-[#F5A623]">Становись сильнее.</span></h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400">Записывай подходы, получай XP и следи за тем, как растут твои показатели.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button className="rounded-xl bg-[#F5A623] px-5 py-3 text-sm font-black text-black hover:bg-[#FFC35A]"><Plus className="mr-2 inline h-4 w-4" />Начать тренировку</button>
                <button className="rounded-xl border border-[#333] bg-[#171717] px-5 py-3 text-sm font-bold text-zinc-200 hover:border-[#F5A623]/40">Моя статистика</button>
              </div>
            </div>
          </div>
          <div className="card rounded-3xl p-5">
            <div className="flex items-center justify-between"><div className="text-sm font-bold">Прогресс ранга</div><span className="rounded-full bg-[#F5A623]/10 px-2.5 py-1 text-xs text-[#F5A623]">{rank.name}</span></div>
            <div className="mt-7 flex items-center gap-5">
              <div className="progress-ring grid h-28 w-28 shrink-0 place-items-center rounded-full" style={{"--progress": `${Math.min(100, ((xp-rank.min)/(rank.next-rank.min))*100)}%`} as React.CSSProperties}><div className="grid h-20 w-20 place-items-center rounded-full bg-[#151515]"><div className="text-center"><div className="text-xl font-black">{xp.toLocaleString("ru-RU")}</div><div className="text-[9px] text-zinc-600">XP</div></div></div></div>
              <div><div className="text-sm text-zinc-400">До {rank.next === Infinity ? "вечности" : "следующего ранга"}</div><div className="mt-1 text-2xl font-black">{rank.next === Infinity ? "MAX" : (rank.next-xp).toLocaleString("ru-RU")} <span className="text-sm text-zinc-600">XP</span></div><div className="mt-3 text-xs text-zinc-600">Streak: <b className="text-[#F5A623]">{streak} дней</b></div></div>
            </div>
          </div>
        </section>

        <section className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            [Dumbbell, "Тренировок", "24", "+4 за месяц"],
            [BarChart3, "Тоннаж", "38.4 т", "+12.8%"],
            [Target, "Рекордов", "7", "+2 новых"],
            [Flame, "Streak", `${streak} дн.`, "Личный рекорд"]
          ].map(([Icon, title, value, sub], i) => {
            const I = Icon as any;
            return <div key={i} className="card rounded-2xl p-4"><I className="h-5 w-5 text-[#F5A623]" /><div className="mt-4 text-xs text-zinc-500">{title as string}</div><div className="mt-1 text-xl font-black">{value as string}</div><div className="mt-1 text-[11px] text-emerald-400">{sub as string}</div></div>
          })}
        </section>

        <section className="mt-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-2xl font-black">Тренировки</h2><p className="mt-1 text-sm text-zinc-500">Выбери упражнение и запиши новый подход</p></div>
            <div className="relative w-full sm:w-72"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" /><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск упражнений..." className="w-full rounded-xl border border-[#2b2b2b] bg-[#171717] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#F5A623]/50" /></div>
          </div>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">{groups.map(g => <button key={g} onClick={()=>setGroup(g)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${group===g ? "bg-[#F5A623] text-black" : "border border-[#2b2b2b] bg-[#171717] text-zinc-400 hover:text-white"}`}>{g}</button>)}</div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{filtered.map(ex=><ExerciseCard key={ex.id} ex={ex}/>)}</div>
        </section>
      </main>
    </div>
  );
}