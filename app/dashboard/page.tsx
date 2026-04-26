import Link from "next/link";
import { ArrowRight, Clock3, Download, Folder, Package, Sparkles, Zap } from "lucide-react";
import { requireUser } from "@/lib/supabase/auth";
import { getAccessContext } from "@/lib/services/access/permissions";
import { listUserProjects } from "@/lib/services/projects/queries";

function statusTone(status: unknown) {
  const value = typeof status === "string" ? status.toLowerCase() : "draft";
  if (value.includes("complete")) return "bg-emerald-400/12 text-emerald-300";
  if (value.includes("progress") || value.includes("generating")) return "bg-slate-300/10 text-slate-200";
  if (value.includes("failed")) return "bg-rose-400/12 text-rose-300";
  return "bg-slate-100 text-slate-700 dark:bg-white/8 dark:text-slate-300";
}

function prettyStatus(status: unknown) {
  const raw = typeof status === "string" ? status : "draft";
  return raw.replaceAll("_", " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

export default async function DashboardPage() {
  const { user } = await requireUser();
  const { subscription, plan } = await getAccessContext(user.id);
  const projects = await listUserProjects(user.id);

  const activeProject = projects[0];
  const activeProjectsCount = projects.filter((project) => project.status !== "completed").length;
  const generatedPacksCount = projects.reduce((total, project) => {
    const generations = Array.isArray(project.generations) ? project.generations : [];
    return total + generations.filter((generation) => generation?.status === "completed").length;
  }, 0);
  const exportReady = plan.fullResolutionExport ? generatedPacksCount + Math.max(0, projects.length - 1) : generatedPacksCount;
  const uploadCount = activeProject?.uploads?.[0]?.count ?? 0;

  const kpis = [
    { label: "Credits", value: `${subscription.credits_remaining}`, detail: "Available for upcoming generations", icon: Zap },
    { label: "Active projects", value: String(activeProjectsCount), detail: "Drafts and in-progress work", icon: Folder },
    { label: "Generated packs", value: String(generatedPacksCount), detail: "Completed generation runs", icon: Package },
    { label: "Export ready", value: String(exportReady), detail: "Assets available to download", icon: Download }
  ];

  const recentProjects = projects.slice(0, 5);

  return (
    <div className="dashboard-page">
      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="dashboard-card p-6 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="dashboard-label">Launch workspace</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white sm:text-[2.2rem]">Your launch visuals, organized from first brief to final export.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Keep project identity, screenshot sequencing, pack generation, and export access in one controlled workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/projects/new" className="inline-flex h-11 items-center gap-2 rounded-[14px] bg-[#5b5ff7] px-4 text-sm font-semibold text-white hover:bg-[#686cf8]">
                New project
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/dashboard/projects" className="inline-flex h-11 items-center rounded-[14px] border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50 dark:border-white/[0.1] dark:bg-[#070b12] dark:text-slate-100 dark:hover:bg-[#0d1320]">
                View projects
              </Link>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-6 sm:p-7">
          <p className="dashboard-label">Plan posture</p>
          <div className="mt-4 space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-white/8">
              <span className="text-slate-500">Current plan</span>
              <span className="font-medium text-slate-950 dark:text-white">{plan.label}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-white/8">
              <span className="text-slate-500">Credits left</span>
              <span className="font-medium text-slate-950 dark:text-white">{subscription.credits_remaining}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-white/8">
              <span className="text-slate-500">Export access</span>
              <span className="font-medium text-slate-950 dark:text-white">{plan.fullResolutionExport ? "Full resolution" : "Preview only"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Queue priority</span>
              <span className="font-medium text-slate-950 dark:text-white">{plan.priorityGeneration ? "Priority" : "Standard"}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <div key={item.label} className="dashboard-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="dashboard-label">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{item.value}</p>
              </div>
              <span className="flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-[#0b111c] dark:text-slate-300">
                <item.icon className="size-5" />
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-500">{item.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="dashboard-card p-6 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="dashboard-label">Current project</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{activeProject?.name ?? "No active project yet"}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                {activeProject
                  ? `${activeProject.product_type.replaceAll("_", " ")} - ${uploadCount} screenshots uploaded - updated ${new Date(activeProject.updated_at).toLocaleDateString()}`
                  : "Create a project to define the brief, upload screenshots, and generate the first launch pack."}
              </p>
            </div>
            {activeProject ? <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(activeProject.status)}`}>{prettyStatus(activeProject.status)}</span> : null}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {[
              { label: "Define identity", done: Boolean(activeProject?.description) },
              { label: "Upload screenshots", done: uploadCount > 0 },
              { label: "Generate pack", done: generatedPacksCount > 0 },
              { label: "Export assets", done: exportReady > 0 }
            ].map((step, index) => (
              <div key={step.label} className="dashboard-card-muted p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-950 dark:text-white">{step.label}</span>
                  <span className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${step.done ? "bg-emerald-400/12 text-emerald-600 dark:text-emerald-300" : "bg-slate-100 text-slate-500 dark:bg-white/8 dark:text-slate-400"}`}>
                    {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={activeProject ? `/dashboard/projects/${activeProject.id}` : "/dashboard/projects/new"} className="inline-flex h-11 items-center rounded-[14px] bg-[#5b5ff7] px-4 text-sm font-semibold text-white hover:bg-[#686cf8]">
              {activeProject ? "Open project" : "Create project"}
            </Link>
            <Link href={activeProject ? `/dashboard/projects/${activeProject.id}/generate` : "/dashboard/projects/new"} className="inline-flex h-11 items-center rounded-[14px] border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50 dark:border-white/[0.1] dark:bg-[#070b12] dark:text-slate-100 dark:hover:bg-[#0d1320]">
              Generate pack
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="dashboard-card p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <p className="dashboard-label">Recent projects</p>
              <Link href="/dashboard/projects" className="text-sm text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">View all</Link>
            </div>
            <div className="mt-5 space-y-3">
              {recentProjects.length ? recentProjects.map((project) => (
                <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="dashboard-card-muted flex items-center justify-between gap-4 p-4 hover:border-slate-300 hover:bg-white dark:hover:border-white/[0.14]">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{project.name}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">{project.product_type.replaceAll("_", " ")}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(project.status)}`}>{prettyStatus(project.status)}</span>
                </Link>
              )) : <p className="text-sm text-slate-500">No projects yet.</p>}
            </div>
          </div>

          <div className="dashboard-card p-6 sm:p-7">
            <p className="dashboard-label">Activity summary</p>
            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 size-4 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-950 dark:text-white">Generation workflow stays in one place</p>
                  <p className="mt-1 text-slate-500">Review project brief, uploads, generation status, and export access without leaving the dashboard.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 size-4 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-950 dark:text-white">Best next step</p>
                  <p className="mt-1 text-slate-500">{activeProject ? `Continue ${activeProject.name} or generate a fresh pack.` : "Create the first project to activate the full launch workflow."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
