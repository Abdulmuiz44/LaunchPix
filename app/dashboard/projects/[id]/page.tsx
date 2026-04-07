import Link from "next/link";
import { ProjectSummaryCard } from "@/components/dashboard/project-summary-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/supabase/auth";
import { getProjectOverview } from "@/lib/services/projects/queries";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await requireUser();
  const { id } = await params;
  const { project, uploads } = await getProjectOverview(id, user.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Card><CardContent className="space-y-4 p-6"><div className="flex items-start justify-between"><div><h1 className="text-2xl font-semibold">{project.name}</h1><p className="text-sm text-muted-foreground">Your control center for copy, generation, and export readiness.</p></div><StatusBadge status={project.status} /></div><div className="flex gap-3"><Button asChild><Link href={`/dashboard/projects/${id}/generate`}>Generate assets</Link></Button><Button asChild variant="outline"><Link href={`/dashboard/projects/new?projectId=${id}&step=1`}>Edit project</Link></Button></div></CardContent></Card>
        <Card><CardContent className="p-6"><h2 className="font-semibold">Identity</h2><p className="mt-3 text-sm text-muted-foreground">{project.description}</p><div className="mt-3 grid gap-2 text-sm md:grid-cols-2"><p><span className="text-muted-foreground">Type:</span> {project.product_type}</p><p><span className="text-muted-foreground">Platform:</span> {project.platform}</p><p><span className="text-muted-foreground">Audience:</span> {project.audience}</p><p><span className="text-muted-foreground">Website:</span> {project.website_url || "—"}</p></div></CardContent></Card>
        <Card><CardContent className="p-6"><h2 className="font-semibold">Screenshots</h2><p className="mt-1 text-sm text-muted-foreground">{uploads.length} uploaded and ordered for narrative flow.</p><div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">{uploads.slice(0,4).map((u)=><img key={u.id} src={u.file_url} alt={u.original_filename} className="h-20 w-full rounded-lg border border-border object-cover" />)}{uploads.length===0?<p className="text-sm text-muted-foreground">No uploads yet.</p>:null}</div></CardContent></Card>
      </div>
      <ProjectSummaryCard name={project.name} productType={project.product_type} platform={project.platform} audience={project.audience} style={project.style_preset} screenshotCount={uploads.length} />
    </div>
  );
}
