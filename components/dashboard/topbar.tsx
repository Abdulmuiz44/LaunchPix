import Link from "next/link";
import { Bolt, Search, Sparkles } from "lucide-react";

export function DashboardTopbar({ credits, planLabel }: { credits: number; planLabel: string }) {
  return (
    <div className="border-b border-[#1a2752] bg-[#030f2f] px-5 py-3 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[36px] font-semibold text-white">Overview</h1>
          <p className="mt-1 text-sm text-[#8fa2cf]">Track projects, generate packs, and export launch-ready visuals.</p>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <label className="hidden min-w-[320px] max-w-[460px] flex-1 items-center gap-3 rounded-xl border border-[#24335f] bg-[#081938] px-3 py-2.5 xl:flex">
            <Search className="size-4 text-[#8fa2cf]" />
            <input
              placeholder="Search projects, assets..."
              className="w-full bg-transparent text-sm text-[#d4e0ff] outline-none placeholder:text-[#6f83b4]"
            />
            <span className="rounded-md border border-[#334777] bg-[#102449] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[#8fa2cf]">K</span>
          </label>

          <div className="flex items-center gap-2 rounded-xl border border-[#24335f] bg-[#081938] px-4 py-2.5 text-sm text-[#d7e2ff]">
            <Bolt className="size-4 text-[#5f96ff]" />
            <span className="font-semibold text-white">{credits}</span>
            <span>Credits</span>
          </div>

          <div className="hidden items-center gap-2 rounded-xl border border-[#24335f] bg-[#081938] px-4 py-2.5 text-sm text-[#d7e2ff] lg:flex">
            <Sparkles className="size-4 text-[#8b6dff]" />
            <span>{planLabel} Plan</span>
          </div>

          <Link
            href="/dashboard/projects/new"
            className="rounded-xl bg-gradient-to-r from-[#5d79ff] to-[#6f42ff] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#5f4cff]/35"
          >
            + New Project
          </Link>

          <button className="flex size-10 items-center justify-center rounded-full border border-[#3e5288] bg-[#112452] text-sm font-semibold text-white">
            JB
          </button>
        </div>
      </div>
    </div>
  );
}
