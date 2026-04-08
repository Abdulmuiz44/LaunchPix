import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navItems = [
  { href: "/pricing" as const, label: "Pricing" },
  { href: "/contact" as const, label: "Support" }
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/75 backdrop-blur-2xl">
      <div className="app-shell flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_18px_50px_-22px_hsl(var(--primary)/0.9)]">
            <Sparkles className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">LaunchPix</p>
            <p className="text-sm text-foreground/80">AI-assisted launch visuals</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="/#workflow" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Workflow
          </a>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/projects/new">Start a project</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
