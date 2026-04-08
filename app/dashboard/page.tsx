import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/supabase/auth";
import { getAccessContext } from "@/lib/services/access/permissions";

export default async function DashboardPage() {
  const { user } = await requireUser();
  const { subscription, plan } = await getAccessContext(user.id);

  const metrics = [
    {
      label: "Plan access",
      value: plan.label,
      note: plan.fullResolutionExport ? "Full-resolution export enabled" : "Preview mode on Free"
    },
    {
      label: "Credits remaining",
      value: String(subscription.credits_remaining),
      note: subscription.credits_remaining <= 2 ? "Top up soon to avoid blocking generation" : "Healthy balance for upcoming launches"
    },
    {
      label: "Commercial use",
      value: plan.commercialUse ? "Included" : "Upgrade required",
      note: plan.priorityGeneration ? "Priority generation is active" : "Standard queue is active"
    }
  ];

  return (
    <div className="space-y-6">
      <section className="surface overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-5">
            <span className="eyebrow">Overview</span>
            <div>
              <h2 className="section-title">Operate every launch asset from one calm workspace.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                Build, review, and export your product visuals without jumping between mockup tools, copy docs, and image editors.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/dashboard/projects/new">
                  New project
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/settings/billing">Manage billing</Link>
              </Button>
            </div>
          </div>

          <div className="surface-muted grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Current posture</p>
              <p className="mt-3 text-2xl font-semibold">{plan.label}</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">Credits available: {subscription.credits_remaining}</p>
            </div>
            <div className="text-sm leading-7 text-muted-foreground">
              {plan.fullResolutionExport ? "Your workspace is ready for production export and launch delivery." : "You can preview outputs first, then upgrade when the visuals are approved."}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{metric.label}</p>
              <p className="text-2xl font-semibold">{metric.value}</p>
              <p className="text-sm leading-7 text-muted-foreground">{metric.note}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          { icon: Layers3, title: "Brief the launch", text: "Capture the product story, audience, and style so every asset pulls in one direction." },
          { icon: Sparkles, title: "Generate the pack", text: "Turn screenshots into a complete sequence with strong hierarchy and launch-ready composition." },
          { icon: CheckCircle2, title: "Review and export", text: "Refine copy, rerender assets, and download the final ZIP when the visuals are approved." }
        ].map((item) => (
          <Card key={item.title}>
            <CardContent className="space-y-4">
              <item.icon className="size-5 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
