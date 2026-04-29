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
      description="These terms cover acceptable use, credit consumption, export access, and the current MVP service posture for LaunchPix."
    >
      <div className="grid gap-4 lg:grid-cols-2 legal-copy">
        <section className="surface-muted p-6">
          <h2 className="text-xl font-semibold text-foreground">Acceptable use</h2>
          <p className="mt-3">
            Use LaunchPix only for lawful product marketing workflows. You are responsible for the rights to any screenshots, copy, and content you upload.
          </p>
        </section>
        <section className="surface-muted p-6">
          <h2 className="text-xl font-semibold text-foreground">Credits</h2>
          <p className="mt-3">
            Each generation run consumes one credit. Every account starts with included credits, and you can buy one-time credit packs when the balance runs out.
          </p>
        </section>
        <section className="surface-muted p-6">
          <h2 className="text-xl font-semibold text-foreground">Export access</h2>
          <p className="mt-3">
            Full-resolution PNG downloads and ZIP export are available while your account has credits. You will be prompted to buy credits after exhausting your balance.
          </p>
        </section>
        <section className="surface-muted p-6">
          <h2 className="text-xl font-semibold text-foreground">Commercial use</h2>
          <p className="mt-3">
            Launch assets generated through LaunchPix may be used for product marketing as long as you have the rights to the source materials you upload.
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
