import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const useCases = ["Chrome extensions", "Firefox add-ons", "SaaS launches", "Product launch promos"];

export function LandingSections() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Badge className="mb-4">Deterministic launch visuals with AI-assisted messaging</Badge>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">Turn raw screenshots into store-ready launch assets in minutes.</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">LaunchPix helps you move from rough product captures to a polished 7-asset pack with reliable dimensions, clean hierarchy, and conversion-focused copy.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg"><Link href="/dashboard/projects/new">Start your first project</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/pricing">See plans</Link></Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card><CardContent className="p-6"><p className="mb-2 text-sm font-medium text-muted-foreground">Before</p><div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">Screenshot-only listing with no clear message, weak visual structure, and inconsistent layout.</div></CardContent></Card>
          <Card className="border-primary/30"><CardContent className="p-6"><p className="mb-2 text-sm font-medium text-muted-foreground">After</p><div className="rounded-xl bg-primary/10 p-8 text-sm">Headline and callouts explain value fast, screenshots stay readable, and every asset matches required launch dimensions.</div></CardContent></Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <p className="mb-3 text-sm text-muted-foreground">Use cases</p>
        <div className="flex flex-wrap gap-2">{useCases.map((u)=><Badge key={u} className="bg-muted text-foreground">{u}</Badge>)}</div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-semibold">What a full pack includes</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card><CardContent className="p-5"><p className="text-sm font-medium">5 listing screenshots</p><p className="mt-1 text-sm text-muted-foreground">1280×800 each, optimized for store storytelling sequence.</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm font-medium">1 promo tile</p><p className="mt-1 text-sm text-muted-foreground">440×280 for compact campaign placements and teasers.</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm font-medium">1 hero banner + ZIP</p><p className="mt-1 text-sm text-muted-foreground">1400×560 marquee output and one-click ZIP export.</p></CardContent></Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-semibold">Sample packs (demo preview)</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["Extension workflow assistant","SaaS analytics dashboard","Product launch campaign"].map((title) => (
            <Card key={title}><CardContent className="space-y-3 p-5"><p className="font-medium">{title}</p><div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">Raw screenshot input</div><div className="rounded-lg border border-border bg-muted/30 p-3 text-xs">Generated framed output preview</div><p className="text-xs text-muted-foreground">Pack: 5 listing + promo + hero</p></CardContent></Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <Card><CardContent className="grid gap-6 p-6 md:grid-cols-2"><div><h3 className="text-xl font-semibold">Example project flow</h3><p className="mt-2 text-sm text-muted-foreground">Upload 3 raw screenshots from your extension, set audience and style, then generate a full launch pack with reusable dimensions.</p></div><div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">Step 1: upload screenshots → Step 2: choose style → Step 3: generate and preview → Step 4: unlock full export when ready.</div></CardContent></Card>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-semibold">Why LaunchPix feels reliable</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Card><CardContent className="p-5 text-sm"><p className="font-medium">Deterministic layouts</p><p className="mt-2 text-muted-foreground">Consistent structure, no random visual drift.</p></CardContent></Card>
          <Card><CardContent className="p-5 text-sm"><p className="font-medium">Store-ready dimensions</p><p className="mt-2 text-muted-foreground">Every output is rendered at required launch sizes.</p></CardContent></Card>
          <Card><CardContent className="p-5 text-sm"><p className="font-medium">Preview before upgrade</p><p className="mt-2 text-muted-foreground">Validate visual direction before paying for full export access.</p></CardContent></Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Can I preview before paying?</strong> Yes. Free plan lets you generate watermarked previews.</p>
          <p><strong className="text-foreground">What do paid plans unlock?</strong> Full-resolution PNG, ZIP export, and commercial-use positioning.</p>
          <p><strong className="text-foreground">Are exports store-ready?</strong> Yes. LaunchPix renders assets in required launch dimensions.</p>
          <p><strong className="text-foreground">Can I use outputs commercially?</strong> Paid plans include commercial-use support.</p>
          <p><strong className="text-foreground">What happens when credits run out?</strong> Generation pauses until you upgrade or buy additional credits.</p>
        </div>
      </section>
    </main>
  );
}
