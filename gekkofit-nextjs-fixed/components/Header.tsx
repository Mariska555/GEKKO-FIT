import Image from "next/image";
import Link from "next/link";
import { Flame, Trophy, UserRound } from "lucide-react";

export default function Header({ xp, streak, rank }: { xp: number; streak: number; rank: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#242424] bg-[#0d0d0d]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/gekkofit-logo.png" alt="GEKKO FIT" width={48} height={48} className="h-10 w-10 rounded-xl object-cover" />
          <div className="hidden sm:block">
            <div className="text-sm font-black tracking-[.2em] text-[#F5A623]">GEKKO FIT</div>
            <div className="text-[10px] text-zinc-500">TRACK YOUR PROGRESS</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-[#2b2b2b] bg-[#171717] px-3 py-2 text-xs">
            <span className="text-zinc-500">Ранг</span> <b className="ml-1 text-[#F5A623]">{rank}</b>
          </div>
          <div className="hidden rounded-xl border border-[#2b2b2b] bg-[#171717] px-3 py-2 text-xs sm:block">
            <Trophy className="mr-1 inline h-4 w-4 text-[#F5A623]" /> {xp.toLocaleString("ru-RU")} XP
          </div>
          <div className="rounded-xl border border-[#2b2b2b] bg-[#171717] px-3 py-2 text-xs">
            <Flame className="mr-1 inline h-4 w-4 text-[#F5A623]" /> {streak}
          </div>
          <Link href="/profile" className="rounded-xl border border-[#2b2b2b] bg-[#171717] p-2 hover:border-[#F5A623]/50">
            <UserRound className="h-5 w-5 text-zinc-300" />
          </Link>
        </div>
      </div>
    </header>
  );
}