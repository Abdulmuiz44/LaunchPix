import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers3, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const workflow = [
  {
    icon: WandSparkles,
    step: "01",
    title: "Brief the launch",
    description: "Define the product, audience, and visual direction once so every exported asset follows the same story."
  },
  {
    icon: Layers3,
    step: "02",
    title: "Upload screenshot proof",
    description: "Bring real product captures into a structured sequence that guides the final pack composition."
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Generate and export",
    description: "Review a ready-to-ship asset pack instead of designing each listing slide and banner by hand."
  }
];

const proof = [
  "Store-ready output sizes",
  "Preview before upgrade",
  "Deterministic export pipeline",
  "Clear billing and credit controls"
];

export function LandingSections() {
  return (
    <main>
      <section className="border-b border-white/8">
        <div className="app-shell grid min-h-[calc(100svh-78px)] items-center gap-10 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:py-18">
          <div className="max-w-2xl">
            <p className="eyebrow">Launch visuals without the design overhead</p>
            <h1 className="hero-title mt-5 text-balance">Turn raw screenshots into a clean launch pack that looks ready to ship.</h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
              LaunchPix gives product teams one dark, focused workspace for briefing, sequencing screenshots, generating polished visuals, and exporting without tool-hopping.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/dashboard/projects/new">
                  Start your first project
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/pricing">See pricing</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {proof.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="size-4 text-slate-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card p-4 sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="dashboard-card-muted p-5">
                <p className="dashboard-label">Launch brief</p>
                <div className="mt-5 space-y-3">
                  <div className="h-11 rounded-2xl bg-[#050810]" />
                  <div className="h-11 rounded-2xl bg-[#050810]" />
                  <div className="h-28 rounded-[18px] bg-[#050810]" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {["Listing 01", "Listing 02"].map((label, index) => (
                    <div key={label} className={`rounded-[18px] border p-4 ${index === 0 ? "border-white/[0.16] bg-white/[0.06]" : "border-white/10 bg-[#0b111c]"}`}>
                      <p className="dashboard-label">{label}</p>
                      <div className="mt-4 h-28 rounded-[16px] bg-[#050810]" />
                      <div className="mt-3 h-3 w-3/4 rounded-full bg-white/10" />
                      <div className="mt-2 h-3 w-1/2 rounded-full bg-white/10" />
                    </div>
                  ))}
                </div>

                <div className="rounded-[18px] border border-white/10 bg-[#0b111c] p-4">
                  <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    <span>Hero banner</span>
                    <span>Export ready</span>
                  </div>
                  <div className="mt-4 h-32 rounded-[16px] bg-[#050810]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="app-shell app-section">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="eyebrow">Workflow</p>
            <h2 className="section-title mt-4">One controlled sequence from brief to export.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
              Every step has one job, so the interface stays clear and the product promise is obvious.
            </p>
          </div>

          <div className="dashboard-card overflow-hidden">
            {workflow.map((item, index) => (
              <div key={item.title} className={`grid gap-4 px-6 py-6 sm:grid-cols-[72px_1fr] sm:px-8 ${index < workflow.length - 1 ? "border-b border-white/8" : ""}`}>
                <div className="flex items-center gap-3 sm:block">
                  <span className="text-sm font-semibold text-slate-300">{item.step}</span>
                  <item.icon className="size-5 text-slate-400 sm:mt-4" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="app-shell pb-16 sm:pb-20">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="dashboard-card p-6 sm:p-8">
            <p className="eyebrow">Why teams use it</p>
            <h2 className="section-title mt-4">Structured enough for speed. Clear enough to trust.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              LaunchPix is built for teams who need polished marketing output without rebuilding layouts in a design tool for every release.
            </p>
          </div>

          <div className="dashboard-card-muted p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-1 size-5 text-slate-300" />
              <div>
                <p className="text-lg font-semibold text-white">Predictable output quality</p>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Templates stay readable, export rules stay controlled, and billing gates stay obvious so teams can move faster without guessing what happens next.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 bg-[#050810]">
        <div className="app-shell flex flex-col gap-6 py-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Start here</p>
            <h2 className="section-title mt-4">Build launch visuals from a workspace that stays focused the whole way through.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Start free, validate the output quality, and upgrade only when you need production export.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard/projects/new">Create a project</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
