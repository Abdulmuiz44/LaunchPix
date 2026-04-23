import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  draft: "border-white/10 bg-white/[0.06] text-slate-300",
  ready: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  queued: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  analyzing: "border-sky-400/20 bg-sky-400/10 text-sky-300",
  generating_copy: "border-indigo-400/20 bg-indigo-400/10 text-indigo-300",
  rendering_assets: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-300",
  generating: "border-sky-400/20 bg-sky-400/10 text-sky-300",
  completed: "border-violet-400/20 bg-violet-400/10 text-violet-300",
  failed: "border-rose-400/20 bg-rose-400/10 text-rose-300"
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge className={cn("capitalize tracking-[0.14em]", colorMap[status] || colorMap.draft)}>{status.replaceAll("_", " ")}</Badge>;
}
