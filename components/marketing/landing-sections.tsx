import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers3, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const workflow = [
  {
    icon: WandSparkles,
    title: "Brief once",
    description: "Define your product, audience, and preferred visual tone in one clean step."
  },
  {
    icon: Layers3,
    title: "Upload screenshots",
    description: "Bring in real captures from your extension, SaaS flow, or launch page."
  },
  {
    icon: Sparkles,
    title: "Generate the full pack",
    description: "LaunchPix outputs five listing slides, one promo tile, and one hero banner."
  }
];

const proof = [
  "Store-ready sizes for every asset",
  "Structured copy planning before rendering",
  "Preview mode before upgrading",
  "Commercial export paths on paid plans"
];

export function LandingSections() {
  return (
    <main>
      <section className="app-shell app-section pt-10 sm:pt-16">
        <div className="surface overflow-hidden px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="space-y-7">
              <Badge>Shadcn-style workflow for polished launch visuals</Badge>
              <div className="space-y-5">
                <p className="eyebrow">Visual system</p>
                <h1 className="hero-title max-w-4xl">Turn rough screenshots into a sleek, launch-ready asset pack.</h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  LaunchPix gives teams a crisp workspace for turning screenshots into persuasive product visuals with dependable sizing,
                  coherent copy, and fast preview-to-export flow.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
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

              <div className="grid gap-3 sm:grid-cols-2">
                {proof.map((item) => (
                  <div key={item} className="surface-muted flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="size-4 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="surface-muted rounded-[30px] p-5">
                <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <span>Preview canvas</span>
                  <span>7 outputs</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {["Listing 01", "Listing 02", "Listing 03", "Promo Tile"].map((label, index) => (
                    <div key={label} className={`rounded-[24px] border border-white/50 p-4 ${index === 3 ? "bg-primary text-primary-foreground" : "bg-background/80"}`}>
                      <p className="text-xs uppercase tracking-[0.18em] opacity-70">{label}</p>
                      <p className="mt-7 text-sm font-medium">
                        {index === 3 ? "Compact campaign artboard with concise launch messaging." : "Screenshot-led frame with layered copy and stable visual rhythm."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-muted grid gap-4 rounded-[30px] p-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Output discipline</p>
                  <p className="mt-3 text-lg font-semibold">Deterministic rendering means less cleanup and fewer surprises.</p>
                </div>
                <div className="text-sm leading-7 text-muted-foreground">
                  Every page of the app is optimized around a simple loop: brief, upload, generate, preview, export.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="app-shell app-section">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Workflow</p>
            <h2 className="section-title mt-4">One clear job per step.</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            The app is built like a focused production workspace: brief on the left, progress in the center, export actions only when they matter.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {workflow.map((item) => (
            <div key={item.title} className="surface p-6">
              <item.icon className="size-5 text-primary" />
              <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="app-shell app-section">
        <div className="surface grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
          <div>
            <p className="eyebrow">Trust layer</p>
            <h2 className="section-title mt-4">Built for launch pressure, not design busywork.</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="surface-muted p-5">
              <ShieldCheck className="size-5 text-primary" />
              <p className="mt-5 text-base font-semibold">Predictable outputs</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">Templates stay clean, text stays readable, and each export respects its target dimension.</p>
            </div>
            <div className="surface-muted p-5">
              <Sparkles className="size-5 text-primary" />
              <p className="mt-5 text-base font-semibold">Fast operator flow</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">You move from raw screenshots to a finished pack without leaving the product workspace.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="app-shell app-section pb-14">
        <div className="surface flex flex-col gap-6 px-6 py-8 sm:px-8 sm:py-10 lg:flex-row lg:items-end lg:justify-between lg:px-12">
          <div>
            <p className="eyebrow">Start here</p>
            <h2 className="section-title mt-4">Ready to redesign your launch assets, not just generate them?</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard/projects/new">Create a project</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Open dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
