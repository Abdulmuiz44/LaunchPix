import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/supabase/auth";
import { getAccessContext } from "@/lib/services/access/permissions";
import { BillingActions } from "@/components/dashboard/billing-actions";

export default async function BillingPage() {
  const { user } = await requireUser();

  try {
    const { subscription, plan } = await getAccessContext(user.id);

    return (
      <div className="space-y-6">
        <Card><CardContent className="p-6"><h1 className="text-2xl font-semibold">Billing & plan access</h1><p className="mt-2 text-sm text-muted-foreground">Current plan: <span className="font-medium">{plan.label}</span> • Credits remaining: {subscription.credits_remaining}</p><p className="mt-1 text-sm text-muted-foreground">Status: {subscription.status} {subscription.last_payment_at ? `• Last payment ${new Date(subscription.last_payment_at).toLocaleDateString()}` : ""}</p></CardContent></Card>
        <Card><CardContent className="space-y-3 p-6"><h2 className="font-semibold">Upgrade or top up</h2><p className="text-sm text-muted-foreground">Launch Pack is ideal for one-time launch campaigns. Starter is the most balanced monthly option for repeat shipping.</p><BillingActions /></CardContent></Card>
        <Card><CardContent className="p-6 text-sm text-muted-foreground">{plan.fullResolutionExport ? "Your current plan includes full-resolution PNG and ZIP exports for commercial use." : "Free plan includes watermarked preview exports. Upgrade when you’re ready for production launch assets."}</CardContent></Card>
      </div>
    );
  } catch {
    return <Card><CardContent className="p-6">Billing details are temporarily unavailable. Please refresh or try again shortly.</CardContent></Card>;
  }
}
