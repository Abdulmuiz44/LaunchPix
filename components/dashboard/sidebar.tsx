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
    <aside className="hidden w-[252px] shrink-0 border-r border-white/8 bg-[#07101f] lg:block">
      <div className="sticky top-0 flex h-screen flex-col px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-2">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2fc7e6,#7c3aed)] text-sm font-bold text-white shadow-[0_18px_38px_-24px_rgba(47,199,230,0.9)]">
            L
          </span>
          <span>
            <span className="block text-lg font-semibold text-white">LaunchPix</span>
            <span className="block text-xs text-slate-400">Launch studio</span>
          </span>
        </Link>

        <nav className="mt-8 space-y-1.5">
          {navItems.map((item) => {
            const baseHref = item.href.split("?")[0];
            const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(baseHref);

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-[14px] px-3.5 text-sm font-medium transition",
                  active
                    ? "bg-[linear-gradient(135deg,rgba(124,58,237,0.24),rgba(31,43,66,0.92))] text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="dashboard-card p-4">
            <div className="flex items-center gap-2">
              <Gem className="size-4 text-cyan-300" />
              <p className="text-sm font-semibold text-white">{planLabel}</p>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-500">Credits left</p>
                <p className="text-2xl font-semibold text-white">{credits}</p>
              </div>
              <p className="text-xs text-slate-500">/ {maxCredits}</p>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-[linear-gradient(90deg,#2fc7e6,#7c3aed)]" style={{ width: `${progress}%` }} />
            </div>
            <Link href="/settings/billing" className="mt-4 flex h-10 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#7c3aed,#9f67ff)] text-sm font-semibold text-white">
              Upgrade plan
            </Link>
          </div>

          <div className="dashboard-card-muted flex items-center gap-3 p-3.5">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#0a1426] text-xs font-semibold text-white">
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
