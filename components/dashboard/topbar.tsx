"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bolt, Plus, Search } from "lucide-react";

const copyMap = [
  { match: "/dashboard/projects/new", title: "New Project", description: "Define the brief, upload screenshots, and set the visual direction." },
  { match: "/dashboard/projects/", title: "Project Workspace", description: "Review the brief, generation state, and launch asset readiness." },
  { match: "/dashboard/projects", title: "Projects", description: "Track every launch workspace, status, and screenshot stack in one place." },
  { match: "/settings/billing", title: "Billing", description: "Manage credits, upgrades, and export access." },
  { match: "/settings", title: "Settings", description: "Control workspace defaults, account details, and plan posture." },
  { match: "/dashboard", title: "Overview", description: "Track projects, generate packs, and export launch-ready visuals." }
] as const;

export function DashboardTopbar({ credits, planLabel }: { credits: number; planLabel: string }) {
  const pathname = usePathname() ?? "/dashboard";
  const current = copyMap.find((item) => pathname.startsWith(item.match)) ?? copyMap[copyMap.length - 1];

  return (
    <header className="sticky top-[65px] z-30 border-b border-white/8 bg-[#050b16]/92 px-4 py-4 backdrop-blur-2xl lg:top-0 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-white">{current.title}</h1>
          <p className="mt-1 text-sm text-slate-400">{current.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex h-11 min-w-[250px] flex-1 items-center gap-2 rounded-[14px] border border-white/10 bg-[#111c33] px-3 xl:w-[340px] xl:flex-none">
            <Search className="size-4 text-slate-500" />
            <input
              placeholder="Search projects, assets, generations..."
              className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
          </label>

          <div className="flex h-11 items-center gap-2 rounded-[14px] border border-white/10 bg-[#111c33] px-4 text-sm text-slate-300">
            <Bolt className="size-4 text-cyan-300" />
            <span className="font-semibold text-white">{credits}</span>
            <span>credits</span>
          </div>

          <div className="hidden h-11 items-center rounded-[14px] border border-white/10 bg-[#111c33] px-4 text-sm text-slate-300 md:flex">
            {planLabel}
          </div>

          <Link href="/dashboard/projects/new" className="inline-flex h-11 items-center gap-2 rounded-[14px] bg-[linear-gradient(135deg,#7c3aed,#9f67ff)] px-4 text-sm font-semibold text-white shadow-[0_20px_48px_-24px_rgba(124,58,237,0.95)]">
            <Plus className="size-4" />
            New project
          </Link>
        </div>
      </div>
    </header>
  );
}
