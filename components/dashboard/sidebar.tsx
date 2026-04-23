"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Folder, Gem, Home, ImageIcon, Settings, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/projects", label: "Projects", icon: Folder },
  { href: "/dashboard/projects/new?step=3", label: "Generations", icon: Wand2 },
  { href: "/dashboard/projects", label: "Assets", icon: ImageIcon },
  { href: "/settings/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings }
] as const;

function getInitials(email: string) {
  const alias = email.split("@")[0] || "launchpix";
  const parts = alias.replace(/[._-]+/g, " ").split(" ").filter(Boolean);
  if (parts.length === 0) return "LP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
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
  const maxCredits = Math.max(credits, 300);
  const progress = Math.min(100, Math.round((credits / maxCredits) * 100));

  return (
    <aside className="hidden h-screen w-[248px] shrink-0 border-r border-slate-800 bg-[#07101f] lg:block">
      <div className="flex h-full flex-col px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-3 px-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-cyan-400 text-sm font-bold text-slate-950">
            L
          </span>
          <span>
            <span className="block text-base font-semibold text-white">LaunchPix</span>
            <span className="block text-xs text-slate-400">Launch studio</span>
          </span>
        </Link>

        <nav className="mt-7 space-y-1">
          {navItems.map((item) => {
            const baseHref = item.href.split("?")[0];
            const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(baseHref);

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition",
                  active ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5">
            <div className="flex items-center gap-2">
              <Gem className="size-4 text-cyan-300" />
              <p className="text-sm font-semibold text-white">{planLabel}</p>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-500">Credits left</p>
                <p className="text-xl font-semibold text-white">{credits}</p>
              </div>
              <p className="text-xs text-slate-500">/ {maxCredits}</p>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-cyan-400" style={{ width: `${progress}%` }} />
            </div>
            <Link href="/settings/billing" className="mt-3 flex h-9 items-center justify-center rounded-md bg-cyan-400 text-sm font-semibold text-slate-950">
              Upgrade
            </Link>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white">
              {getInitials(userEmail)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-white">{userEmail.split("@")[0]}</span>
              <span className="block truncate text-xs text-slate-500">{userEmail}</span>
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}