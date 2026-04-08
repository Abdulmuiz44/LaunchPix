import { ThemeToggle } from "@/components/ui/theme-toggle";

export function DashboardTopbar() {
  return (
    <div className="border-b border-border/60 bg-background/60 backdrop-blur-xl">
      <div className="app-shell flex h-20 items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Workspace</p>
          <h1 className="mt-2 text-xl font-semibold">LaunchPix dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <p className="hidden text-sm text-muted-foreground md:block">Sleek asset operations for every launch cycle.</p>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
