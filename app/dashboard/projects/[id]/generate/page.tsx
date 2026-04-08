import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { GeneratePanel } from "@/components/dashboard/generate-panel";
import { requireUser } from "@/lib/supabase/auth";
import { getProjectOverview } from "@/lib/services/projects/queries";
import { getLatestGeneration } from "@/lib/services/generations/queries";
import { getAccessContext } from "@/lib/services/access/permissions";

export default async function GeneratePage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await requireUser();
  const { id } = await params;

  try {
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
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><h1 className="text-2xl font-semibold">Generate launch asset pack</h1><StatusBadge status={generation?.status || (ready ? "ready" : "draft")} /></div><p className="mt-2 text-sm text-muted-foreground">Plan: {plan.label} • Credits remaining: {subscription.credits_remaining}</p></CardContent></Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Card><CardContent className="p-6"><h2 className="font-semibold">Project brief</h2><p className="mt-2 text-sm text-muted-foreground">{project.name} • {project.product_type} • {project.platform}</p><p className="mt-2 text-sm">{project.description}</p><p className="mt-2 text-sm text-muted-foreground">Audience: {project.audience}</p></CardContent></Card>
          <Card><CardContent className="p-6"><h2 className="font-semibold">Output pack</h2><ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground"><li>5 listing screenshots (1280x800)</li><li>1 promo tile (440x280)</li><li>1 hero banner (1400x560)</li></ul><p className="mt-3 text-sm text-muted-foreground">Uploads ready: {uploads.length}/5</p></CardContent></Card>
        </div>
        <GeneratePanel projectId={id} ready={ready} missing={missing} />
      </div>
    );
  } catch {
    return <Card><CardContent className="p-6">This project could not be loaded for generation. Please return to projects and try again.</CardContent></Card>;
  }
}
