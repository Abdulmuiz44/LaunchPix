import type { Metadata } from "next";
import { LifeBuoy, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingPageShell } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Contact | LaunchPix",
  description: "Contact LaunchPix support for product, billing, and account help."
};

export default function ContactPage() {
  return (
    <MarketingPageShell
      eyebrow="Support"
      title="Talk to LaunchPix support without the runaround."
      description="We help with onboarding, billing questions, generation problems, and export issues. Send context once and we will reply with concrete next steps."
    >
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="surface-muted space-y-4 p-6">
          {[
            {
              icon: Mail,
              title: "Primary support",
              text: "support@launchpix.app"
            },
            {
              icon: ShieldCheck,
              title: "Billing help",
              text: "Include your account email and checkout reference for faster resolution."
            },
            {
              icon: LifeBuoy,
              title: "What to expect",
              text: "We respond with practical steps for account, generation, and export issues."
            }
          ].map((item) => (
            <div key={item.title} className="border-b border-border/50 pb-4 last:border-b-0 last:pb-0">
              <item.icon className="size-5 text-primary" />
              <p className="mt-3 font-semibold">{item.title}</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="surface-muted p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">Need an answer quickly?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            Share the page you were on, the action you took, and any error text you saw. For billing requests, include the payment reference and the email used at checkout.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="surface p-5">
              <p className="text-sm font-semibold">Helpful context</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">Project name, browser details, account email, and any screenshot of the issue.</p>
            </div>
            <div className="surface p-5">
              <p className="text-sm font-semibold">Best channel</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">Email is the fastest route for both account and billing support right now.</p>
            </div>
          </div>

          <Button asChild className="mt-6" size="lg">
            <a href="mailto:support@launchpix.app">Email support</a>
          </Button>
        </div>
      </div>
    </MarketingPageShell>
  );
}
