import Link from "next/link";
import { Bolt, Plus, Search } from "lucide-react";

export function DashboardTopbar({ credits, planLabel }: { credits: number; planLabel: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-[#07101f]/95 px-4 py-4 backdrop-blur lg:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Overview</h1>
          <p className="mt-1 text-sm text-slate-400">Projects, generation status, credits, and exports.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex h-10 min-w-[260px] flex-1 items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 xl:w-80 xl:flex-none">
            <Search className="size-4 text-slate-500" />
            <input
              placeholder="Search projects"
              className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
            />
          </label>

          <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 text-sm text-slate-300">
            <Bolt className="size-4 text-cyan-300" />
            <span className="font-semibold text-white">{credits}</span>
            <span className="hidden sm:inline">credits</span>
          </div>

          <div className="hidden h-10 items-center rounded-lg border border-slate-800 bg-slate-950/60 px-3 text-sm text-slate-300 md:flex">
            {planLabel}
          </div>

          <Link href="/dashboard/projects/new" className="flex h-10 items-center gap-2 rounded-lg bg-cyan-400 px-4 text-sm font-semibold text-slate-950">
            <Plus className="size-4" />
            New project
          </Link>
        </div>
      </div>
    </header>
  );
}