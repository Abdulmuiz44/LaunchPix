import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingFooter } from "@/components/marketing/footer";

const plans = [
  { id: "free", name: "Free", price: "₦0", desc: "Explore launch-ready previews", tag: "Try now", features: ["1 project", "3 preview generations", "Watermarked preview exports"] },
  { id: "launch_pack", name: "Launch Pack", price: "₦15,000 one-time", desc: "Best for a single launch push", tag: "One-time", features: ["15 credits", "Full-resolution PNG", "ZIP export"] },
  { id: "starter", name: "Starter", price: "₦12,000 / month", desc: "Best value for repeat builders", tag: "Recommended", features: ["25 monthly credits", "Commercial use", "Full-resolution PNG + ZIP"] },
  { id: "pro", name: "Pro", price: "₦35,000 / month", desc: "For high-output teams", tag: "Priority", features: ["80 monthly credits", "Priority generation badge", "Commercial use"] }
];

export const metadata = {
  title: "Pricing | LaunchPix",
  description: "Choose a LaunchPix plan for preview, one-time launch, or recurring growth workflows."
};

export default function PricingPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-4xl font-semibold tracking-tight">Choose a plan that matches your launch pace</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">No hidden limits. Free helps you preview. Paid plans unlock full-resolution export and commercial use.</p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((p) => (
            <Card key={p.id} className={p.id === "starter" ? "border-primary shadow-sm" : ""}>
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{p.tag}</p>
                <p className="mt-2 text-xl font-semibold">{p.name}</p>
                <p className="mt-1 text-2xl font-semibold">{p.price}</p>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <ul className="mt-4 space-y-2 text-sm">{p.features.map((f)=><li key={f}>• {f}</li>)}</ul>
                <Button asChild className="mt-6 w-full" variant={p.id === "starter" ? "default" : "outline"}><Link href={p.id === "free" ? "/dashboard/projects/new" : "/settings/billing"}>{p.id === "free" ? "Start Free" : "Select plan"}</Link></Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-10"><CardContent className="p-6"><h2 className="text-lg font-semibold">Quick comparison</h2><div className="mt-4 grid gap-3 text-sm md:grid-cols-3"><p><strong>Preview:</strong> Free includes watermarked previews.</p><p><strong>Launch once:</strong> Launch Pack gives 15 credits, one-time.</p><p><strong>Launch often:</strong> Starter/Pro include recurring credits + commercial use.</p></div></CardContent></Card>

        <div className="mt-10 rounded-2xl border border-border bg-muted/20 p-6 text-center"><h3 className="text-xl font-semibold">Ready to ship better launch visuals?</h3><p className="mt-2 text-sm text-muted-foreground">Start with Free, then upgrade when your assets are ready for release.</p><Button asChild className="mt-4"><Link href="/dashboard/projects/new">Create project</Link></Button></div>
      </section>
      <MarketingFooter />
    </main>
  );
}
