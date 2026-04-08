import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers3, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const workflow = [
  {
    icon: WandSparkles,
    step: "01",
    title: "Brief the launch",
    description: "Add the product, audience, and preferred style once so every asset follows the same direction."
  },
  {
    icon: Layers3,
    step: "02",
    title: "Upload real screenshots",
    description: "Bring in the actual product captures you want to turn into listing slides, promo tiles, and banners."
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Generate the pack",
    description: "Review a complete, structured asset pack instead of designing each output manually from scratch."
  }
];

const proof = [
  "Store-ready output sizes",
  "Structured copy planning before render",
  "Preview before upgrade",
  "Full-resolution export on paid plans"
];

export function LandingSections() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-border/50 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.16),transparent_32%),radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.08),transparent_28%)]" />

        <div className="app-shell relative grid min-h-[calc(100svh-5rem)] items-center gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
          <div className="max-w-xl">
            <p className="eyebrow">Launch visuals without the design mess</p>
            <h1 className="hero-title mt-5 text-balance">Turn product screenshots into a clean, conversion-focused asset pack.</h1>
            <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">
              LaunchPix helps product teams move from raw screenshots to polished listing visuals, promo tiles, and banners with a workflow built for speed and clarity.
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

            <div className="mt-8 space-y-3">
              {proof.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[36px] border border-border/60 bg-card/80 p-4 shadow-[0_40px_120px_-48px_rgba(0,0,0,0.45)] backdrop-blur">
              <div className="rounded-[30px] border border-border/60 bg-background p-4 sm:p-5">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <span>LaunchPix workspace</span>
                  <span>7 outputs</span>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
                  <div className="rounded-[26px] border border-border/60 bg-muted/40 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Project brief</p>
                    <div className="mt-5 space-y-3">
                      <div className="h-10 rounded-2xl bg-background/90" />
                      <div className="h-10 rounded-2xl bg-background/90" />
                      <div className="h-24 rounded-[22px] bg-background/90" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {["Listing 01", "Listing 02"].map((label, index) => (
                        <div key={label} className={`rounded-[26px] border p-4 ${index === 0 ? "border-primary/25 bg-primary/10" : "border-border/60 bg-muted/30"}`}>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                          <div className="mt-4 h-28 rounded-[20px] bg-background/90" />
                          <div className="mt-3 h-3 w-3/4 rounded-full bg-foreground/10" />
                          <div className="mt-2 h-3 w-1/2 rounded-full bg-foreground/10" />
                        </div>
                      ))}
                    </div>

                    <div className="rounded-[26px] border border-border/60 bg-muted/30 p-4">
                      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        <span>Hero banner</span>
                        <span>Ready to export</span>
                      </div>
                      <div className="mt-4 h-32 rounded-[22px] bg-[linear-gradient(135deg,hsl(var(--primary)/0.22),transparent_55%),hsl(var(--background))]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="app-shell py-20">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="section-title mt-4">A simple flow built to get to publishable visuals faster.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              Each step has one job, so the page reads clearly and the product promise lands quickly.
            </p>
          </div>

          <div className="divide-y divide-border/60 rounded-[32px] border border-border/60 bg-card/70 backdrop-blur">
            {workflow.map((item) => (
              <div key={item.title} className="grid gap-4 px-6 py-6 sm:grid-cols-[72px_1fr] sm:px-8">
                <div className="flex items-center gap-3 sm:block">
                  <span className="text-sm font-semibold text-primary">{item.step}</span>
                  <item.icon className="size-5 text-primary sm:mt-4" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="app-shell pb-20">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="eyebrow">Why teams use it</p>
            <h2 className="section-title mt-4">Structured enough for speed, simple enough to trust.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              LaunchPix is designed for teams who need clean outputs and clear decisions, not another heavy design workflow.
            </p>
          </div>

          <div className="rounded-[32px] border border-border/60 bg-card/70 p-6 backdrop-blur sm:p-8">
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-1 size-5 text-primary" />
              <div>
                <p className="text-lg font-semibold">Predictable output quality</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Templates stay readable, dimensions stay controlled, and export actions appear only when the pack is ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-muted/20">
        <div className="app-shell flex flex-col gap-6 py-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Start here</p>
            <h2 className="section-title mt-4">Create launch visuals with a layout that stays clear from brief to export.</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Start free, test the output quality, and upgrade only when you are ready for production export.
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
