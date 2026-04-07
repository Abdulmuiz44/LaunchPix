import { ThemeToggle } from "@/components/ui/theme-toggle";

export function DashboardTopbar() {
  return (
    <div className="flex h-16 items-center justify-between border-b border-border px-6">
      <h1 className="text-lg font-semibold">LaunchPix Dashboard</h1>
      <ThemeToggle />
    </div>
  );
}
