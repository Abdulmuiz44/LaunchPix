"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Folder, Gem, Home, ImageIcon, Menu, Settings, Wand2, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home, section: "overview" },
  { href: "/dashboard/projects", label: "Projects", icon: Folder, section: "projects" },
  { href: "/dashboard/projects/new?step=3", label: "Generations", icon: Wand2, section: "generations" },
  { href: "/dashboard/projects", label: "Assets", icon: ImageIcon, section: "assets" },
  { href: "/settings/billing", label: "Billing", icon: CreditCard, section: "billing" },
  { href: "/settings", label: "Settings", icon: Settings, section: "settings" }
] as const;

function getInitials(email: string) {
  const alias = email.split("@")[0] || "launchpix";
  const parts = alias.replace(/[._-]+/g, " ").split(" ").filter(Boolean);
  if (parts.length === 0) return "LP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function isActive(pathname: string, section: (typeof navItems)[number]["section"]) {
  if (section === "overview") return pathname === "/dashboard";
  if (section === "projects") return pathname.startsWith("/dashboard/projects") && !pathname.includes("/dashboard/projects/new") && !pathname.endsWith("/assets") && !pathname.endsWith("/generate");
  if (section === "generations") return pathname.endsWith("/generate") || pathname.includes("/dashboard/projects/new");
  if (section === "assets") return pathname.endsWith("/assets");
  if (section === "billing") return pathname.startsWith("/settings/billing");
  if (section === "settings") return pathname === "/settings";
  return false;
}

function Brand() {
  return (
    <Link href="/dashboard" className="group flex items-center gap-3 rounded-2xl px-2 py-2 outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-300/50">
      <span className="flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2fc7e6,#7c3aed)] text-sm font-bold text-white shadow-[0_18px_44px_-22px_rgba(47,199,230,0.85)] transition group-hover:scale-[1.03]">
        L
      </span>
      <span className="min-w-0">
        <span className="block text-[17px] font-semibold leading-tight text-white">LaunchPix</span>
        <span className="block text-xs text-slate-400">Launch studio</span>
      </span>
    </Link>
  );
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const active = isActive(pathname, item.section);

        return (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group relative flex h-10 items-center gap-3 rounded-2xl px-3 text-[13px] font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-300/50",
              active ? "bg-white/[0.075] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" : "text-slate-400 hover:bg-white/[0.045] hover:text-slate-100"
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full transition",
                active ? "bg-cyan-300 opacity-100" : "bg-transparent opacity-0"
              )}
            />
            <item.icon className={cn("size-4 shrink-0 transition", active ? "text-cyan-200" : "text-slate-500 group-hover:text-slate-300")} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function PlanCard({ credits, planLabel }: { credits: number; planLabel: string }) {
  const maxCredits = Math.max(credits, 300);
  const progress = Math.min(100, Math.round((credits / maxCredits) * 100));

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(17,28,51,0.84),rgba(8,16,31,0.92))] p-3.5 shadow-[0_24px_70px_-48px_rgba(0,0,0,0.85)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-cyan-300/10">
            <Gem className="size-4 text-cyan-300" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{planLabel}</p>
            <p className="text-[11px] text-slate-500">Current plan</p>
          </div>
        </div>
        <p className="text-[11px] font-medium text-slate-400">{credits} / {maxCredits}</p>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#2fc7e6,#8b5cf6)]" style={{ width: `${progress}%` }} />
      </div>

      <Link
        href="/settings/billing"
        className="mt-3 flex h-9 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2fc7e6,#8b5cf6)] text-xs font-semibold text-white shadow-[0_16px_40px_-24px_rgba(47,199,230,0.9)] transition hover:brightness-110"
      >
        Upgrade
      </Link>
    </div>
  );
}

function AccountCard({ userEmail }: { userEmail: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#101c32] text-xs font-semibold text-white">
        {getInitials(userEmail)}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-white">{userEmail.split("@")[0]}</span>
        <span className="block truncate text-[11px] text-slate-500">{userEmail}</span>
      </span>
    </div>
  );
}

export function DashboardSidebar({
  credits,
  planLabel,
  userEmail
}: {
  credits: number;
  planLabel: string;
  userEmail: string;
}) {
  const pathname = usePathname() ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#050b16]/95 px-4 py-3 backdrop-blur-2xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Brand />
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            className="grid size-10 place-items-center rounded-2xl border border-white/[0.1] bg-white/[0.045] text-slate-100 transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="mt-3 rounded-3xl border border-white/[0.08] bg-[#07101f] p-3 shadow-[0_28px_90px_-44px_rgba(0,0,0,0.9)]">
            <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr]">
              <PlanCard credits={credits} planLabel={planLabel} />
              <AccountCard userEmail={userEmail} />
            </div>
          </div>
        )}
      </div>

      <aside className="hidden w-[236px] shrink-0 border-r border-white/[0.08] bg-[#07101f]/96 lg:block xl:w-[244px]">
        <div className="sticky top-0 flex h-screen min-h-0 flex-col px-3 py-4">
          <Brand />

          <div className="mt-7 min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.35)_transparent]">
            <NavLinks pathname={pathname} />
          </div>

          <div className="mt-4 space-y-3">
            <PlanCard credits={credits} planLabel={planLabel} />
            <AccountCard userEmail={userEmail} />
          </div>
        </div>
      </aside>
    </>
  );
}
