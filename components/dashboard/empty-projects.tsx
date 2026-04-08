import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyProjectsState() {
  return (
    <section className="surface overflow-hidden p-8 sm:p-10 lg:p-12">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="space-y-5">
          <span className="eyebrow">Start here</span>
          <h1 className="section-title max-w-2xl">Design your first sleek launch pack from real product screenshots.</h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Create one workspace, upload your best screenshots, define the tone, and let LaunchPix build the entire asset sequence around them.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard/projects/new">
                Create first project
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">Compare plans</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {[
            "Brief your product and audience",
            "Upload up to five screenshots",
            "Generate the full 7-asset pack"
          ].map((step, index) => (
            <div key={step} className="surface-muted flex items-start gap-4 px-4 py-4 text-sm text-muted-foreground">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {index === 2 ? <Sparkles className="size-4" /> : index + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
