import Link from "next/link";
import { ArrowRight, FolderPlus, Layers3, Sparkles } from "lucide-react";
import { EmptyProjectsState } from "@/components/dashboard/empty-projects";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
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

  const activeCount = projects.filter((project) => project.status !== "completed").length;
  const totalUploads = projects.reduce((count, project) => count + (project.uploads?.[0]?.count ?? 0), 0);

  return (
    <div className="mx-auto max-w-[1420px] space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-lg border border-slate-800 bg-[#0a1426] p-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">Projects</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">All launch workspaces in one view.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Track progress, spot blocked work, and jump back into the project that needs action.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/projects/new">
                Create project
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/settings/billing">Manage plan</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          {[
            { label: "Projects", value: String(projects.length), icon: FolderPlus },
            { label: "Active", value: String(activeCount), icon: Sparkles },
            { label: "Uploads", value: String(totalUploads), icon: Layers3 }
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                <item.icon className="size-4 text-cyan-300" />
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-800 bg-[#0a1426]">
        <div className="grid grid-cols-[minmax(0,1.5fr)_180px_120px_160px_140px] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
          <span>Project</span>
          <span>Platform</span>
          <span>Screenshots</span>
          <span>Status</span>
          <span>Updated</span>
        </div>

        <div className="divide-y divide-slate-800">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="grid grid-cols-[minmax(0,1.5fr)_180px_120px_160px_140px] items-center gap-4 px-5 py-4 transition hover:bg-slate-950/40"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{project.name}</p>
                <p className="mt-1 truncate text-xs text-slate-500">{textMap[project.product_type] || project.product_type}</p>
              </div>
              <p className="text-sm text-slate-300">{textMap[project.platform] || project.platform}</p>
              <p className="text-sm text-slate-300">{project.uploads?.[0]?.count || 0}</p>
              <div className="min-w-0">
                <StatusBadge status={project.status} />
              </div>
              <p className="text-sm text-slate-400">{new Date(project.updated_at).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}