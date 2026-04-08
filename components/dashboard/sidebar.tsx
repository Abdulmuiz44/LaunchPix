"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, FolderKanban, LayoutDashboard, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/settings/billing", label: "Billing", icon: CreditCard }
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-80 shrink-0 border-r border-border/60 bg-background/70 px-5 py-6 backdrop-blur-xl lg:block">
      <div className="flex h-full flex-col gap-8">
        <Link href="/dashboard" className="surface-muted flex items-center gap-3 px-4 py-4">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">LaunchPix</p>
            <p className="text-sm font-medium text-foreground">Creative workspace</p>
          </div>
        </Link>

        <nav className="space-y-2">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-[0_20px_40px_-24px_hsl(var(--primary)/0.95)]"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="size-4" />
                  {item.label}
                </span>
                <span className={cn("text-[10px] uppercase tracking-[0.22em]", active ? "text-primary-foreground/70" : "text-muted-foreground/60")}>
                  Open
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="surface mt-auto space-y-4 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Workspace rhythm</p>
          <h3 className="text-lg font-semibold">Keep the flow simple.</h3>
          <p className="text-sm leading-7 text-muted-foreground">
            Brief, upload, generate, export. Every page is tuned to that one operator loop.
          </p>
        </div>
      </div>
    </aside>
  );
}
