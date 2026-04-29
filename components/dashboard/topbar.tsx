"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bolt, Plus, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const copyMap = [
  { match: "/dashboard/projects/new", title: "New Project", description: "Define the brief, upload screenshots, and set the visual direction." },
  { match: "/dashboard/projects/", title: "Project Workspace", description: "Review the brief, generation state, and launch asset readiness." },
  { match: "/dashboard/projects", title: "Projects", description: "Track every launch workspace, status, and screenshot stack in one place." },
  { match: "/settings/billing", title: "Billing", description: "Manage credits and one-time top-ups." },
  { match: "/settings", title: "Settings", description: "Control workspace defaults, account details, and credit posture." },
  { match: "/dashboard", title: "Overview", description: "Track projects, generate packs, and export launch-ready visuals." }
] as const;

export function DashboardTopbar({ credits, planLabel }: { credits: number; planLabel: string }) {
  const pathname = usePathname() ?? "/dashboard";
  const current = copyMap.find((item) => pathname.startsWith(item.match)) ?? copyMap[copyMap.length - 1];

  return (
    <header className="sticky top-[65px] z-30 border-b border-slate-200 bg-white/95 px-4 py-2 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#02040a]/95 lg:top-0 lg:px-6">
      <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0 xl:max-w-[420px]">
          <h1 className="truncate text-xl font-semibold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-[22px]">{current.title}</h1>
          <p className="mt-0.5 hidden truncate text-[11px] text-slate-500 dark:text-slate-400 md:block xl:hidden">{current.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex h-8 min-w-[200px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 dark:border-white/[0.08] dark:bg-[#070b12] xl:w-[280px] xl:flex-none">
            <Search className="size-3.5 text-slate-500" />
            <input
              placeholder="Search projects, assets, generations..."
              className="w-full bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </label>

          <ThemeToggle />

          <div className="flex h-8 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-700 dark:border-white/[0.08] dark:bg-[#070b12] dark:text-slate-300">
            <Bolt className="size-3.5 text-slate-400" />
            <span className="font-semibold text-slate-950 dark:text-white">{credits}</span>
            <span>credits</span>
          </div>

          <div className="hidden h-8 items-center rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-700 dark:border-white/[0.08] dark:bg-[#070b12] dark:text-slate-300 md:flex">
            {planLabel}
          </div>

          <Link href="/dashboard/projects/new" className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-[#6d5dfc] px-2.5 text-xs font-semibold text-white shadow-[0_18px_42px_-28px_rgba(109,93,252,0.85)] hover:bg-[#7c70ff]">
            <Plus className="size-3.5" />
            New project
          </Link>
        </div>
      </div>
    </header>
  );
}
