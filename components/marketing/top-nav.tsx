import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navItems = [
  { href: "/pricing" as const, label: "Pricing" },
  { href: "/contact" as const, label: "Support" }
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-white/8 dark:bg-[#02040a]/90">
      <div className="app-shell flex h-[74px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-950 text-sm font-bold text-white dark:border-white/[0.08] dark:bg-[#0d1320]">
            L
          </span>
          <div>
            <p className="text-lg font-semibold text-slate-950 dark:text-white">LaunchPix</p>
            <p className="text-xs text-slate-500">Launch studio</p>
          </div>
        </Link>

        <div className="flex items-center gap-3 md:gap-8">
          <nav className="hidden items-center gap-8 md:flex">
            <a href="/#workflow" className="text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">Workflow</a>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/dashboard/projects/new">
                <span className="hidden sm:inline">New project</span>
                <span className="sm:hidden">Start</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
