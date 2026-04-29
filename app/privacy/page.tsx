import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Privacy | LaunchPix",
  description: "How LaunchPix stores user data, processes screenshots, and handles billing and AI services."
};

export default function PrivacyPage() {
  return (
    <MarketingPageShell
      eyebrow="Privacy"
      title="A clear view of the data LaunchPix stores and why."
      description="We keep the minimum account, project, asset, and billing context needed to run the product and support your launch workflow."
    >
      <div className="grid gap-4 lg:grid-cols-2 legal-copy">
        <section className="surface-muted p-6">
          <h2 className="text-xl font-semibold text-foreground">What we store</h2>
          <p className="mt-3">
            We store your account email, project metadata, uploaded screenshots, generated assets, credit balance, billing status, and usage events needed to operate LaunchPix.
          </p>
        </section>
        <section className="surface-muted p-6">
          <h2 className="text-xl font-semibold text-foreground">How screenshots are processed</h2>
          <p className="mt-3">
            Screenshots you upload are used to generate launch assets in deterministic layouts. Preview and export files are stored in the configured storage buckets for your workspace.
          </p>
        </section>
        <section className="surface-muted p-6">
          <h2 className="text-xl font-semibold text-foreground">Third-party providers</h2>
          <p className="mt-3">
            LaunchPix uses Mistral for structured planning and Lemon Squeezy for credit-pack billing. We do not store raw card details on our own servers.
          </p>
        </section>
        <section className="surface-muted p-6">
          <h2 className="text-xl font-semibold text-foreground">Data requests</h2>
          <p className="mt-3">
            For privacy, access, or deletion requests, contact <a href="mailto:support@launchpix.app" className="underline underline-offset-4">support@launchpix.app</a>.
          </p>
        </section>
      </div>
    </MarketingPageShell>
  );
}
