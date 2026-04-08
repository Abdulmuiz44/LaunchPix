import { GeneratePanel } from "@/components/dashboard/generate-panel";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/supabase/auth";
import { getAccessContext } from "@/lib/services/access/permissions";
import { getLatestGeneration } from "@/lib/services/generations/queries";
import { getProjectOverview } from "@/lib/services/projects/queries";

export default async function GeneratePage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await requireUser();
  const { id } = await params;

  const { project, uploads } = await getProjectOverview(id, user.id);
  const generation = await getLatestGeneration(id);
  const { plan, subscription } = await getAccessContext(user.id);

  const missing: string[] = [];
  if (!project.description) missing.push("project description");
  if (!uploads.length) missing.push("at least one screenshot");
  if (!project.style_preset) missing.push("style preset");
  if (subscription.credits_remaining <= 0) missing.push("credits");

  const ready = missing.length === 0;

  return (
    <div className="space-y-6">
      <section className="surface p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Generate</p>
            <h2 className="mt-4 text-3xl font-semibold">Create the launch asset pack for {project.name}.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Your render pipeline stays focused: one brief, one screenshot sequence, one export-ready pack.
            </p>
          </div>
          <StatusBadge status={generation?.status || (ready ? "ready" : "draft")} />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Brief</p>
            <div>
              <h3 className="text-xl font-semibold">{project.name}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{project.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 text-sm">
              <div><p className="text-muted-foreground">Product</p><p className="mt-1 font-medium">{project.product_type}</p></div>
              <div><p className="text-muted-foreground">Platform</p><p className="mt-1 font-medium">{project.platform}</p></div>
              <div><p className="text-muted-foreground">Audience</p><p className="mt-1 font-medium">{project.audience}</p></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Capacity</p>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div><p className="text-muted-foreground">Plan</p><p className="mt-1 font-medium">{plan.label}</p></div>
              <div><p className="text-muted-foreground">Credits</p><p className="mt-1 font-medium">{subscription.credits_remaining}</p></div>
              <div><p className="text-muted-foreground">Uploads ready</p><p className="mt-1 font-medium">{uploads.length}/5</p></div>
              <div><p className="text-muted-foreground">Export path</p><p className="mt-1 font-medium">{plan.fullResolutionExport ? "Full-resolution" : "Preview mode"}</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <GeneratePanel projectId={id} ready={ready} missing={missing} />
    </div>
  );
}
