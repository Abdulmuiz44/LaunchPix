import { AssetsManager } from "@/components/dashboard/assets-manager";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/supabase/auth";
import { getProjectOverview } from "@/lib/services/projects/queries";
import { getGenerationAssets, getGenerationHistory, getLatestGeneration } from "@/lib/services/generations/queries";
import { getAccessContext } from "@/lib/services/access/permissions";

export default async function AssetsPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await requireUser();
  const { id } = await params;
  const { project } = await getProjectOverview(id, user.id);
  const generation = await getLatestGeneration(id);
  const history = await getGenerationHistory(id);
  const { plan, subscription } = await getAccessContext(user.id);

  if (!generation) return <Card><CardContent className="p-6">No assets yet. Start generation to create your first pack.</CardContent></Card>;

  const assets = await getGenerationAssets(generation.id);

  return (
    <div className="space-y-6">
      <Card><CardContent className="p-6"><h1 className="text-2xl font-semibold">Asset studio • {project.name}</h1><p className="mt-2 text-sm text-muted-foreground">Plan: {plan.label} • Credits: {subscription.credits_remaining} • {plan.fullResolutionExport ? "Full export enabled" : "Preview export on Free"}</p></CardContent></Card>
      <AssetsManager projectId={id} generation={generation as any} assets={assets as any} canDownloadFull={plan.fullResolutionExport} />
      <Card><CardContent className="p-6"><h2 className="font-semibold">Generation history</h2><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{history.map((item:any)=><li key={item.id}><span className="font-medium text-foreground">{new Date(item.created_at).toLocaleString()}</span> — {item.status}{item.error_message ? ` • ${item.error_message}` : ""}</li>)}</ul></CardContent></Card>
    </div>
  );
}
