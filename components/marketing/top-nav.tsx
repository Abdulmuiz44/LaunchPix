import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/pricing" as const, label: "Pricing" },
  { href: "/contact" as const, label: "Support" }
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#050b16]/88 backdrop-blur-2xl">
      <div className="app-shell flex h-[78px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2fc7e6,#7c3aed)] text-white shadow-[0_20px_40px_-24px_rgba(47,199,230,0.9)]">
            <Sparkles className="size-4" />
          </span>
          <div>
            <p className="text-lg font-semibold text-white">LaunchPix</p>
            <p className="text-sm text-slate-400">Launch studio</p>
          </div>
        </Link>

        <div className="flex items-center gap-3 md:gap-8">
          <nav className="hidden items-center gap-8 md:flex">
            <a href="/#workflow" className="text-sm font-medium text-slate-400 hover:text-white">Workflow</a>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-400 hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/dashboard/projects/new">
                New project
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
