import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  ready: "bg-emerald-500/15 text-emerald-500",
  queued: "bg-amber-500/15 text-amber-500",
  analyzing: "bg-blue-500/15 text-blue-500",
  generating_copy: "bg-indigo-500/15 text-indigo-500",
  rendering_assets: "bg-fuchsia-500/15 text-fuchsia-500",
  generating: "bg-blue-500/15 text-blue-500",
  completed: "bg-violet-500/15 text-violet-500",
  failed: "bg-rose-500/15 text-rose-500"
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge className={cn("capitalize", colorMap[status] || "")}>{status.replaceAll("_", " ")}</Badge>;
}
