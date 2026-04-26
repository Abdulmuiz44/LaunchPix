import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingPageShell } from "@/components/marketing/page-shell";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "NGN 0",
    desc: "Use this when you need proof before paying.",
    tag: "Preview",
    features: ["1 project", "3 preview generations", "Watermarked preview exports"]
  },
  {
    id: "launch_pack",
    name: "Launch Pack",
    price: "NGN 15,000 one-time",
    desc: "Best for one release that needs polished assets fast.",
    tag: "One-time",
    features: ["15 credits", "Full-resolution PNG", "ZIP export"]
  },
  {
    id: "starter",
    name: "Starter",
    price: "NGN 12,000 / month",
    desc: "Best for builders shipping and testing launches regularly.",
    tag: "Recommended",
    features: ["25 monthly credits", "Commercial use", "Full-resolution PNG + ZIP"]
  },
  {
    id: "pro",
    name: "Pro",
    price: "NGN 35,000 / month",
    desc: "Best for teams producing launch visuals every week.",
    tag: "High volume",
    features: ["80 monthly credits", "Priority generation badge", "Commercial use"]
  }
];

export const metadata: Metadata = {
  title: "Pricing | LaunchPix",
  description: "Compare Free, Launch Pack, Starter, and Pro plans for LaunchPix asset generation.",
  openGraph: {
    title: "LaunchPix Pricing",
    description: "Preview free, then unlock full-resolution export with paid plans.",
    url: "https://launchpix.app/pricing"
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchPix Pricing",
    description: "Clear plans for previews, one-time launches, and monthly workflows."
  }
};

export default function PricingPage() {
  return (
    <MarketingPageShell
      eyebrow="Pricing"
      title="Do not pay before the visuals prove they can sell the launch."
      description="Start with a preview, then unlock production exports only when the generated pack is strong enough for your store, campaign, or landing page."
    >
      <div className="grid gap-5 xl:grid-cols-4">
        {plans.map((plan) => (
          <Card key={plan.id} className={plan.id === "starter" ? "border-cyan-300/30 shadow-[0_24px_60px_rgba(34,211,238,0.12)]" : undefined}>
            <CardContent className="flex h-full flex-col gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{plan.tag}</p>
                <h2 className="mt-3 text-2xl font-semibold">{plan.name}</h2>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{plan.price}</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{plan.desc}</p>
              </div>

              <div className="space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 text-cyan-300" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button asChild className="mt-auto w-full" variant={plan.id === "starter" ? "default" : "outline"}>
                <Link href={plan.id === "free" ? "/dashboard/projects/new" : "/settings/billing"}>
                  {plan.id === "free" ? "Preview with Free" : "Choose this plan"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "How credits work",
            text: "One generation run uses one credit, so your spend follows actual launch work instead of seats or empty subscriptions."
          },
          {
            title: "Preview before paying",
            text: "Free previews let you judge composition, copy, and format before committing to full-resolution export."
          },
          {
            title: "Export readiness",
            text: "Paid plans unlock production PNG files and ZIP downloads for store uploads, campaigns, and team handoff."
          }
        ].map((item) => (
          <div key={item.title} className="surface-muted p-5">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="surface-muted mt-10 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Launch faster</p>
          <h3 className="mt-3 text-2xl font-semibold">Stop spending launch week rebuilding screenshot layouts.</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            Preview first, choose the plan that matches the release, and export only when the pack is ready.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/dashboard/projects/new">
            Create your first project
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </MarketingPageShell>
  );
}
