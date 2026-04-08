import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  draft: "border-border/70 bg-background/80 text-muted-foreground",
  ready: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  queued: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300",
  analyzing: "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-300",
  generating_copy: "border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
  rendering_assets: "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-300",
  generating: "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-300",
  completed: "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-300",
  failed: "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-300"
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge className={cn("capitalize tracking-[0.14em]", colorMap[status] || "")}>{status.replaceAll("_", " ")}</Badge>;
}
