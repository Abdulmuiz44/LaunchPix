import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/supabase/auth";
import { getAccessContext } from "@/lib/services/access/permissions";

export default async function DashboardPage() {
  const { user } = await requireUser();
  const { subscription, plan } = await getAccessContext(user.id);

  return (
    <section className="space-y-6">
      <Card><CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"><div><h1 className="text-2xl font-semibold">Workspace overview</h1><p className="mt-1 text-sm text-muted-foreground">Plan: {plan.label} • Credits remaining: {subscription.credits_remaining}</p></div><div className="flex gap-2">{subscription.credits_remaining <= 2 ? <Button asChild><Link href="/settings/billing">Top up credits</Link></Button> : null}<Button asChild variant="outline"><Link href="/dashboard/projects/new">New project</Link></Button></div></CardContent></Card>
      <Card><CardContent className="p-6"><h2 className="text-lg font-semibold">Get value in 3 steps</h2><div className="mt-4 grid gap-3 text-sm md:grid-cols-3"><p><strong>1.</strong> Upload product screenshots.</p><p><strong>2.</strong> Choose style and audience focus.</p><p><strong>3.</strong> Generate and preview your 7-asset pack.</p></div></CardContent></Card>
      <div className="grid gap-4 md:grid-cols-3">
        {[{k:'Export access',v: plan.fullResolutionExport ? 'Full-resolution enabled' : 'Preview-only on Free'}, {k:'Commercial rights',v: plan.commercialUse ? 'Included on your plan' : 'Upgrade required'}, {k:'Generation priority',v: plan.priorityGeneration ? 'Priority queue enabled' : 'Standard queue'}].map((x)=><Card key={x.k}><CardContent className="p-5"><p className="text-sm text-muted-foreground">{x.k}</p><p className="mt-2 text-sm font-medium">{x.v}</p></CardContent></Card>)}
      </div>
    </section>
  );
}
