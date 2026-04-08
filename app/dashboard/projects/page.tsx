import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

  if (!projects.length) {
    return <EmptyProjectsState />;
  }

  return (
    <div className="space-y-6">
      <section className="surface flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow">Projects</span>
          <h2 className="section-title mt-4">Track every launch workspace from one clean view.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            Keep drafts moving, spot stalled generations, and jump straight into the project that needs attention.
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard/projects/new">
            New project
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="group overflow-hidden">
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{textMap[project.product_type]}</p>
                  <Link href={`/dashboard/projects/${project.id}`} className="mt-2 block text-xl font-semibold text-foreground group-hover:text-primary">
                    {project.name}
                  </Link>
                </div>
                <StatusBadge status={project.status} />
              </div>

              <div className="grid gap-4 sm:grid-cols-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Platform</p>
                  <p className="mt-1 font-medium">{textMap[project.platform]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Screenshots</p>
                  <p className="mt-1 font-medium">{project.uploads?.[0]?.count || 0}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Updated</p>
                  <p className="mt-1 font-medium">{new Date(project.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
