import { BillingActions } from "@/components/dashboard/billing-actions";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/supabase/auth";
import { getAccessContext } from "@/lib/services/access/permissions";

export default async function BillingPage() {
  const { user } = await requireUser();

  try {
    const { subscription, plan } = await getAccessContext(user.id);

    return (
      <div className="space-y-6">
        <section className="surface overflow-hidden p-6 sm:p-8">
          <p className="eyebrow">Billing</p>
          <h1 className="section-title mt-4">Control credits, upgrades, and export access from one place.</h1>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="surface-muted p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Current plan</p>
              <p className="mt-3 text-2xl font-semibold">{plan.label}</p>
            </div>
            <div className="surface-muted p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Credits remaining</p>
              <p className="mt-3 text-2xl font-semibold">{subscription.credits_remaining}</p>
            </div>
            <div className="surface-muted p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Subscription status</p>
              <p className="mt-3 text-2xl font-semibold capitalize">{subscription.status}</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            {subscription.last_payment_at
              ? `Last payment recorded on ${new Date(subscription.last_payment_at).toLocaleDateString()}.`
              : "No payment has been recorded yet for this workspace."}
          </p>
        </section>

        <Card>
          <CardContent className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold">Upgrade or top up</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Launch Pack is ideal for a one-time release. Starter is the cleanest monthly plan for repeat shipping, while Pro supports higher output volume.
              </p>
            </div>
            <BillingActions />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-sm leading-7 text-muted-foreground">
            {plan.fullResolutionExport
              ? "Your current plan includes full-resolution PNG and ZIP exports for commercial use."
              : "The Free plan keeps preview exports watermarked. Upgrade when you are ready for full production launch assets."}
          </CardContent>
        </Card>
      </div>
    );
  } catch {
    return <Card><CardContent className="text-sm leading-7 text-muted-foreground">Billing details are temporarily unavailable. Please refresh or try again shortly.</CardContent></Card>;
  }
}
