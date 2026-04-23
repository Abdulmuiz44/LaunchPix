import Link from "next/link";
import { ArrowRight, FolderPlus, ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyProjectsState() {
  return (
    <div className="mx-auto max-w-[1420px] space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-lg border border-slate-800 bg-[#0a1426] p-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">Projects</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Create the first launch workspace.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Add a product brief, upload screenshots, and move straight into generation without leaving the dashboard.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/projects/new">
                Create first project
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/pricing">Compare plans</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-5">
          <p className="text-sm font-semibold text-white">What you will do here</p>
          <div className="mt-4 space-y-3">
            {[
              { icon: FolderPlus, title: "Define the brief", text: "Name the project, audience, and platform." },
              { icon: ImageIcon, title: "Upload screenshots", text: "Add the core frames you want to turn into assets." },
              { icon: Sparkles, title: "Generate the pack", text: "Review and export the final launch visuals." }
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-slate-800 bg-[#0a1426] p-4">
                <div className="flex items-center gap-3">
                  <item.icon className="size-4 text-cyan-300" />
                  <p className="text-sm font-medium text-white">{item.title}</p>
                </div>
                <p className="mt-2 text-sm text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-dashed border-slate-800 bg-slate-950/40 p-10 text-center">
        <p className="text-sm text-slate-500">No projects yet.</p>
      </section>
    </div>
  );
}