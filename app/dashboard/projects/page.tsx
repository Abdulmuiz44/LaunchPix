import Link from "next/link";
import { EmptyProjectsState } from "@/components/dashboard/empty-projects";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/supabase/auth";
import { listUserProjects } from "@/lib/services/projects/queries";

const textMap: Record<string, string> = {
  browser_extension: "Browser Extension",
  saas: "SaaS",
  web_app: "Web App",
  mobile_app: "Mobile App",
  other: "Other",
  chrome_web_store: "Chrome Web Store",
  firefox_addons: "Firefox Add-ons",
  product_launch: "Product Launch",
  saas_marketing: "SaaS Marketing",
  general_promo: "General Promo"
};

export default async function ProjectsPage() {
  const { user } = await requireUser();
  const projects = await listUserProjects(user.id);

  if (!projects.length) return <EmptyProjectsState />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-semibold">Projects</h1><p className="text-sm text-muted-foreground">Manage drafts and generation-ready launch packs.</p></div><Button asChild><Link href="/dashboard/projects/new">New project</Link></Button></div>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="transition hover:border-primary/40">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <Link href={`/dashboard/projects/${project.id}`} className="font-semibold">{project.name}</Link>
                <StatusBadge status={project.status} />
              </div>
              <p className="text-sm text-muted-foreground">{textMap[project.product_type]} • {textMap[project.platform]}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{project.uploads?.[0]?.count || 0} screenshots</span>
                <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
