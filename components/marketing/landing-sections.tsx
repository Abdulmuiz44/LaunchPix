import Link from "next/link";
import { Sparkles, WandSparkles, Layers3, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function LandingSections() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Badge className="mb-4">Built for extension launches, SaaS releases, and product campaigns.</Badge>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">Turn raw screenshots into polished launch visuals in minutes.</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">LaunchPix blends deterministic templates with Mistral-assisted messaging so every export is reliable, premium, and conversion-ready.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><Link href="/dashboard/projects/new">Create your first pack</Link></Button><Button asChild size="lg" variant="outline"><Link href="/pricing">View pricing</Link></Button></div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <Card><CardContent className="p-6"><p className="mb-2 text-sm text-muted-foreground">Before</p><div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">Screenshot is clear, but the message is weak and visual hierarchy is flat.</div></CardContent></Card>
          <Card className="border-primary/30"><CardContent className="p-6"><p className="mb-2 text-sm text-muted-foreground">After</p><div className="rounded-xl bg-primary/10 p-8 text-sm">Headline, callouts, and framing now explain value quickly while keeping your product screenshot readable.</div></CardContent></Card>
        </div>
      </section>

      <section id="how" className="mx-auto grid max-w-6xl gap-6 px-6 py-12 md:grid-cols-3">
        {[{i:WandSparkles,t:'Upload screenshots',d:'Bring raw captures from your product, store listing, or launch page.'},{i:Sparkles,t:'Generate plan',d:'Mistral extracts product context and creates concise, structured copy plans.'},{i:Layers3,t:'Render assets',d:'Deterministic templates export your full pack in required launch dimensions.'}].map((s)=> (
          <Card key={s.t}><CardContent className="p-6"><s.i className="mb-4 size-5 text-primary"/><h3 className="font-medium">{s.t}</h3><p className="mt-2 text-sm text-muted-foreground">{s.d}</p></CardContent></Card>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-semibold">What you get per generation</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {['5 listing screenshots • 1280×800','1 promo tile • 440×280','1 hero banner • 1400×560 + ZIP'].map((x)=><Card key={x}><CardContent className="p-5 text-sm">{x}</CardContent></Card>)}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 py-12">
        <Card><CardContent className="grid gap-6 p-6 md:grid-cols-2"><div><h3 className="text-2xl font-semibold">Transparent pricing, fair limits</h3><p className="mt-2 text-muted-foreground">Start free in preview mode, then unlock full-resolution export when ready to launch.</p></div><div className="rounded-xl border border-border p-5"><p className="text-sm text-muted-foreground">Starter (recommended for repeat builders)</p><p className="mt-1 text-3xl font-semibold">₦12,000 / month</p><ul className="mt-4 space-y-2 text-sm">{['25 monthly credits','Full-resolution PNG + ZIP','Commercial use included'].map((f)=><li className="flex items-center gap-2" key={f}><CheckCircle2 className="size-4 text-primary"/>{f}</li>)}</ul></div></CardContent></Card>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="mt-4 space-y-3 text-sm text-muted-foreground"><p><strong className="text-foreground">Can I use Free for real exports?</strong> Free is for preview and fit-checking. Paid plans unlock full-resolution export for launch use.</p><p><strong className="text-foreground">Is generation reliable?</strong> Yes. LaunchPix uses deterministic rendering, so dimensions and layout quality are consistent.</p><p><strong className="text-foreground">Is billing secure?</strong> Payments are handled through Paystack checkout and verified server-side.</p></div>
      </section>
    </main>
  );
}
