import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Terms | LaunchPix",
  description: "LaunchPix terms covering usage limits, billing, credits, export access, and service constraints."
};

export default function TermsPage() {
  return (
    <MarketingPageShell
      eyebrow="Terms"
      title="The operating terms for using LaunchPix."
      description="These terms cover acceptable use, plan access, credit consumption, and the current MVP service posture for LaunchPix."
    >
      <div className="grid gap-4 lg:grid-cols-2 legal-copy">
        <section className="surface-muted p-6">
          <h2 className="text-xl font-semibold text-foreground">Acceptable use</h2>
          <p className="mt-3">
            Use LaunchPix only for lawful product marketing workflows. You are responsible for the rights to any screenshots, copy, and content you upload.
          </p>
        </section>
        <section className="surface-muted p-6">
          <h2 className="text-xl font-semibold text-foreground">Plans and credits</h2>
          <p className="mt-3">
            Each generation run consumes one credit. Plan limits, credit balances, and export entitlements determine what you can generate and download.
          </p>
        </section>
        <section className="surface-muted p-6">
          <h2 className="text-xl font-semibold text-foreground">Export access by plan</h2>
          <p className="mt-3">
            Free mode provides watermarked previews. Paid plans unlock full-resolution PNG downloads and ZIP export for launch delivery.
          </p>
        </section>
        <section className="surface-muted p-6">
          <h2 className="text-xl font-semibold text-foreground">Commercial use</h2>
          <p className="mt-3">
            Commercial-use positioning is available on paid plans. The Free plan is intended for evaluation and preview workflows.
          </p>
        </section>
        <section className="surface-muted p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-foreground">Service availability</h2>
          <p className="mt-3">
            We aim for reliable service, but LaunchPix is currently offered on an as-available basis while the product is in MVP stage.
          </p>
        </section>
      </div>
    </MarketingPageShell>
  );
}
