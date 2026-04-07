import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingFooter } from "@/components/marketing/footer";

const plans = [
  { id: "free", name: "Free", price: "₦0", desc: "Preview mode for first-time testing", tag: "Preview", features: ["1 project", "3 preview generations", "Watermarked preview exports"] },
  { id: "launch_pack", name: "Launch Pack", price: "₦15,000 one-time", desc: "Lowest-friction entry for a single launch", tag: "Best one-time entry", features: ["15 credits", "Full-resolution PNG", "ZIP export"] },
  { id: "starter", name: "Starter", price: "₦12,000 / month", desc: "Best ongoing plan for repeat builders", tag: "Recommended", features: ["25 monthly credits", "Commercial use", "Full-resolution PNG + ZIP"] },
  { id: "pro", name: "Pro", price: "₦35,000 / month", desc: "For heavy, frequent launch output", tag: "High volume", features: ["80 monthly credits", "Priority generation badge", "Commercial use"] }
];

export const metadata: Metadata = {
  title: "Pricing | LaunchPix",
  description: "Compare Free, Launch Pack, Starter, and Pro plans for LaunchPix asset generation.",
  openGraph: { title: "LaunchPix Pricing", description: "Preview free, then unlock full-resolution export with paid plans.", url: "https://launchpix.app/pricing" },
  twitter: { card: "summary_large_image", title: "LaunchPix Pricing", description: "Clear plans for previews, one-time launches, and monthly workflows." }
};

export default function PricingPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-4xl font-semibold tracking-tight">Choose a plan that fits your launch cycle</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Free is for preview and fit-checking. Launch Pack is the easiest one-time start. Starter and Pro are for recurring launch work.</p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((p) => (
            <Card key={p.id} className={p.id === "starter" ? "border-primary shadow-sm" : p.id === "launch_pack" ? "border-primary/40" : ""}>
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{p.tag}</p>
                <p className="mt-2 text-xl font-semibold">{p.name}</p>
                <p className="mt-1 text-2xl font-semibold">{p.price}</p>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <ul className="mt-4 space-y-2 text-sm">{p.features.map((f)=><li key={f}>• {f}</li>)}</ul>
                <Button asChild className="mt-6 w-full" variant={p.id === "starter" ? "default" : "outline"}><Link href={p.id === "free" ? "/dashboard/projects/new" : "/settings/billing"}>{p.id === "free" ? "Preview with Free" : "Choose this plan"}</Link></Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Card><CardContent className="p-6"><h2 className="text-lg font-semibold">How credits work</h2><p className="mt-2 text-sm text-muted-foreground">1 generation run uses 1 credit. Credits reset monthly for Starter/Pro. Launch Pack credits are one-time and consume until exhausted.</p></CardContent></Card>
          <Card><CardContent className="p-6"><h2 className="text-lg font-semibold">Preview vs full export</h2><p className="mt-2 text-sm text-muted-foreground">Free plan supports watermarked previews so you can validate quality before paying. Paid plans unlock full-resolution PNG and ZIP export.</p></CardContent></Card>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-muted/20 p-6 text-center">
          <h3 className="text-xl font-semibold">Ready to ship launch visuals with confidence?</h3>
          <p className="mt-2 text-sm text-muted-foreground">Start free, preview your output, then upgrade only when you’re ready for production export.</p>
          <Button asChild className="mt-4"><Link href="/dashboard/projects/new">Create your first project</Link></Button>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}
