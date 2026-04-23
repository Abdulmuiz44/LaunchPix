"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, CreditCard, Folder, Gem, Home, ImageIcon, Settings, Wand2 } from "lucide-react";
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

function getDisplayName(email: string) {
  const alias = email.split("@")[0] || "launchpix";
  return alias
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
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
    <aside className="hidden h-screen w-[300px] shrink-0 border-r border-[#1a2752] bg-[#000d2b] px-3 py-4 lg:block">
      <div className="flex h-full flex-col">
        <div className="mb-6 flex items-center gap-3 px-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#57c0ff] to-[#6e4dff] text-white shadow-lg shadow-[#5f5fff]/30">
            <span className="text-lg font-bold">L</span>
          </div>
          <div>
            <p className="text-[33px] leading-none font-semibold text-white">LaunchPix</p>
            <p className="mt-1 text-sm text-[#95a7cf]">Launch Studio</p>
          </div>
        </div>

        <nav className="space-y-1.5 px-1">
          {navItems.map((item) => {
            const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href.split("?")[0]);
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-[22px] font-medium text-[#c8d5ff] transition",
                  active ? "bg-gradient-to-r from-[#2c348f] to-[#1d255f] text-white" : "hover:bg-[#101a44]"
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="rounded-2xl border border-[#24366a] bg-[#0a1638] p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8fa2cf]">Current plan</p>
            <div className="mt-3 flex items-center gap-2 text-white">
              <Gem className="size-4 text-[#8b6dff]" />
              <p className="text-[28px] font-semibold">{planLabel}</p>
            </div>
            <p className="mt-5 text-sm text-[#8fa2cf]">Credits Left</p>
            <p className="mt-1 text-[44px] font-semibold text-white">
              {credits} <span className="text-[24px] font-medium text-[#8fa2cf]">/ {maxCredits}</span>
            </p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#1c2950]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#5d79ff] to-[#6f42ff]" style={{ width: `${progress}%` }} />
            </div>
            <Link
              href="/settings/billing"
              className="mt-4 flex h-11 items-center justify-center rounded-lg bg-gradient-to-r from-[#5d79ff] to-[#6f42ff] text-sm font-semibold text-white"
            >
              Upgrade Plan
            </Link>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#24366a] bg-[#091636] px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full border border-[#3e5288] bg-[#112452] text-sm font-semibold text-white">
                {getInitials(userEmail)}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{getDisplayName(userEmail)}</p>
                <p className="text-xs text-[#8fa2cf]">{userEmail}</p>
              </div>
            </div>
            <ChevronDown className="size-4 text-[#8fa2cf]" />
          </div>
        </div>
      </div>
    </aside>
  );
}

