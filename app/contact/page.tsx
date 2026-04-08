import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | LaunchPix",
  description: "Contact LaunchPix support for product, billing, and account help."
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-semibold">Contact Support</h1>
      <p className="mt-3 text-sm text-muted-foreground">We help with onboarding, billing, and export issues.</p>
      <div className="mt-8 space-y-4 text-sm text-muted-foreground">
        <p><strong className="text-foreground">Primary support:</strong> <a href="mailto:support@launchpix.app" className="underline">support@launchpix.app</a></p>
        <p><strong className="text-foreground">Billing help:</strong> Include your checkout reference and account email for faster support.</p>
        <p><strong className="text-foreground">What to expect:</strong> We aim to respond with clear next steps for account, generation, and export questions.</p>
      </div>
      <a href="mailto:support@launchpix.app" className="mt-8 inline-flex rounded-xl border border-border px-4 py-2 text-sm font-medium">Email support</a>
    </main>
  );
}
