import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms | LaunchPix",
  description: "LaunchPix terms covering usage limits, billing, credits, export access, and service constraints."
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-semibold">Terms of Use</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: April 7, 2026</p>
      <div className="mt-8 space-y-6 text-sm text-muted-foreground">
        <section><h2 className="text-lg font-semibold text-foreground">Acceptable use</h2><p className="mt-2">Use LaunchPix only for lawful product marketing workflows. You are responsible for rights to any screenshots and content you upload.</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">Plans and credits</h2><p className="mt-2">Each generation run consumes one credit. Plan limits and credit balances apply to generation and export access.</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">Export access by plan</h2><p className="mt-2">Free plan provides watermarked previews. Paid plans unlock full-resolution PNG and ZIP exports for launch use.</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">Commercial use</h2><p className="mt-2">Commercial-use positioning is available on paid plans. Free mode is intended for preview and evaluation workflows.</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">Service availability</h2><p className="mt-2">We aim for reliable service but provide LaunchPix on an “as available” basis during MVP stage.</p></section>
      </div>
    </main>
  );
}
