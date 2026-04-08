import Link from "next/link";
import { AssetsManager } from "@/components/dashboard/assets-manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/supabase/auth";
import { getAccessContext } from "@/lib/services/access/permissions";
import { getGenerationAssets, getGenerationHistory, getLatestGeneration } from "@/lib/services/generations/queries";
import { getProjectOverview } from "@/lib/services/projects/queries";

export default async function AssetsPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await requireUser();
  const { id } = await params;

  try {
    const { project } = await getProjectOverview(id, user.id);
    const generation = await getLatestGeneration(id);
    const history = await getGenerationHistory(id);
    const { plan, subscription } = await getAccessContext(user.id);

    if (!generation) {
      return (
        <section className="surface space-y-5 p-6 sm:p-8">
          <p className="eyebrow">Asset studio</p>
          <h1 className="section-title">No generated assets yet for {project.name}.</h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Generate the first pack to unlock editable copy, rerender controls, previews, and final export actions.
          </p>
          <Button asChild>
            <Link href={`/dashboard/projects/${id}/generate`}>Start generation</Link>
          </Button>
        </section>
      );
    }

    const assets = await getGenerationAssets(generation.id);

    return (
      <div className="space-y-6">
        <section className="surface overflow-hidden p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Asset studio</p>
              <h1 className="section-title mt-4">Review, refine, and export assets for {project.name}.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                Edit copy, rerender variants, and ship the final pack from a single production-ready canvas.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="surface-muted min-w-[170px] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Plan</p>
                <p className="mt-3 text-lg font-semibold">{plan.label}</p>
              </div>
              <div className="surface-muted min-w-[170px] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Credits</p>
                <p className="mt-3 text-lg font-semibold">{subscription.credits_remaining}</p>
              </div>
              <div className="surface-muted min-w-[170px] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Export mode</p>
                <p className="mt-3 text-lg font-semibold">{plan.fullResolutionExport ? "Full" : "Preview"}</p>
              </div>
            </div>
          </div>
        </section>

        <AssetsManager projectId={id} generation={generation as any} assets={assets as any} canDownloadFull={plan.fullResolutionExport} />

        <Card>
          <CardContent className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">History</p>
              <h2 className="mt-3 text-2xl font-semibold">Recent generation runs</h2>
            </div>

            <div className="space-y-3">
              {history.map((item: { id: string; created_at: string; status: string; error_message: string | null }) => (
                <div key={item.id} className="surface-muted p-4 text-sm">
                  <p className="font-semibold text-foreground">{new Date(item.created_at).toLocaleString()}</p>
                  <p className="mt-2 text-muted-foreground">
                    Status: <span className="font-medium text-foreground">{item.status}</span>
                    {item.error_message ? ` · ${item.error_message}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch {
    return <Card><CardContent className="text-sm leading-7 text-muted-foreground">Unable to load project assets right now.</CardContent></Card>;
  }
}
