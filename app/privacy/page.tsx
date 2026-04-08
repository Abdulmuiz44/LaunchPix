import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy | LaunchPix",
  description: "How LaunchPix stores user data, processes screenshots, and handles billing and AI services."
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-semibold">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: April 7, 2026</p>
      <div className="mt-8 space-y-6 text-sm text-muted-foreground">
        <section><h2 className="text-lg font-semibold text-foreground">What we store</h2><p className="mt-2">We store your account email, project metadata, uploaded screenshots, generated assets, plan status, and usage events needed to run LaunchPix.</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">How screenshots are processed</h2><p className="mt-2">Screenshots you upload are used to generate launch assets in deterministic layouts. Preview and export files are stored in our configured storage buckets.</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">Third-party providers</h2><p className="mt-2">LaunchPix uses Mistral for structured content planning and Paystack for billing. We do not store raw card details on our servers.</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">Data requests</h2><p className="mt-2">For privacy, access, or deletion requests, contact <a href="mailto:support@launchpix.app" className="underline">support@launchpix.app</a>.</p></section>
      </div>
    </main>
  );
}
