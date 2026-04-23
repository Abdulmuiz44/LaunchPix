import Link from "next/link";
import { ArrowRight, Check, Download, Folder, Gem, ImageIcon, Package, Sparkles, Zap } from "lucide-react";
import { requireUser } from "@/lib/supabase/auth";
import { getAccessContext } from "@/lib/services/access/permissions";
import { listUserProjects } from "@/lib/services/projects/queries";

function statusClass(status: unknown) {
  const value = typeof status === "string" ? status.toLowerCase() : "draft";
  if (value.includes("complete")) return "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20";
  if (value.includes("progress") || value.includes("generating")) return "bg-cyan-400/10 text-cyan-300 ring-cyan-400/20";
  if (value.includes("failed")) return "bg-rose-400/10 text-rose-300 ring-rose-400/20";
  return "bg-slate-700/40 text-slate-300 ring-slate-600";
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
  const creditLimit = Math.max(300, subscription.credits_remaining);
  const uploadCount = activeProject?.uploads?.[0]?.count ?? 0;

  const recentProjects = projects.slice(0, 5).map((project) => ({
    id: project.id,
    name: project.name,
    type: (project.product_type ?? "web app").toString().replaceAll("_", " "),
    screenshots: project.uploads?.[0]?.count ?? 0,
    status: project.status
  }));

  const kpis = [
    { label: "Credits", value: `${subscription.credits_remaining}`, detail: `${creditLimit} available limit`, icon: Zap },
    { label: "Active projects", value: String(activeProjectsCount), detail: "Drafts and in-progress work", icon: Folder },
    { label: "Generated packs", value: String(generatedPacksCount), detail: "Completed generation runs", icon: Package },
    { label: "Export ready", value: String(exportReady), detail: "Assets available to download", icon: Download }
  ];

  return (
    <div className="mx-auto max-w-[1420px] space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">Launch workspace</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Keep every launch asset moving.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Review project readiness, generate packs, and export final assets from one focused workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/projects/new" className="flex h-10 items-center gap-2 rounded-lg bg-cyan-400 px-4 text-sm font-semibold text-slate-950">
                New project
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/dashboard/projects" className="flex h-10 items-center rounded-lg border border-slate-700 px-4 text-sm font-medium text-slate-200">
                View projects
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gem className="size-4 text-cyan-300" />
              <p className="text-sm font-semibold text-white">{plan.label}</p>
            </div>
            <span className="rounded-md bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-300">Active</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-slate-500">Credits left</span>
            <span className="text-right text-white">{subscription.credits_remaining} / {creditLimit}</span>
            <span className="text-slate-500">Export access</span>
            <span className="text-right text-white">{plan.fullResolutionExport ? "Full" : "Preview"}</span>
            <span className="text-slate-500">Queue</span>
            <span className="text-right text-white">{plan.priorityGeneration ? "Priority" : "Standard"}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <div key={item.label} className="rounded-lg border border-slate-800 bg-[#0a1426] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{item.value}</p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-lg bg-slate-900 text-cyan-300">
                <item.icon className="size-5" />
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-500">{item.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-slate-800 bg-[#0a1426] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Current project</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{activeProject?.name ?? "No active project yet"}</h3>
              <p className="mt-2 text-sm text-slate-400">
                {activeProject ? `${activeProject.product_type.replaceAll("_", " ")} / ${uploadCount} screenshots` : "Create a project to begin generating launch assets."}
              </p>
            </div>
            {activeProject ? <span className={`rounded-md px-2 py-1 text-xs font-medium ring-1 ${statusClass(activeProject.status)}`}>{prettyStatus(activeProject.status)}</span> : null}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {[
              { label: "Define identity", done: true },
              { label: "Upload screenshots", done: uploadCount > 0 },
              { label: "Generate pack", done: generatedPacksCount > 0 },
              { label: "Export assets", done: exportReady > 0 }
            ].map((step) => (
              <div key={step.label} className="rounded-lg border border-slate-800 bg-slate-950/45 p-3">
                <div className="flex items-center gap-2">
                  <span className={step.done ? "text-emerald-300" : "text-slate-600"}>
                    <Check className="size-4" />
                  </span>
                  <p className="text-sm font-medium text-slate-200">{step.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={activeProject ? `/dashboard/projects/${activeProject.id}` : "/dashboard/projects/new"} className="flex h-10 items-center rounded-lg bg-cyan-400 px-4 text-sm font-semibold text-slate-950">
              {activeProject ? "Open project" : "Create project"}
            </Link>
            <Link href={activeProject ? `/dashboard/projects/${activeProject.id}/generate` : "/dashboard/projects/new"} className="flex h-10 items-center gap-2 rounded-lg border border-slate-700 px-4 text-sm font-medium text-slate-200">
              <Sparkles className="size-4" />
              Generate
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-[#0a1426] p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Latest pack</h3>
            <Link href="/dashboard/projects" className="text-sm text-cyan-300">View all</Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {["Listing 01", "Listing 02", "Promo", "Hero"].map((asset, index) => (
              <div key={asset} className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950/50">
                <div className={index === 2 ? "h-24 bg-amber-400/20" : "h-24 bg-cyan-400/15"} />
                <div className="p-3">
                  <p className="text-sm font-medium text-white">{asset}</p>
                  <p className="mt-1 text-xs text-slate-500">Preview asset</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-slate-800 bg-[#0a1426] p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Recent projects</h3>
            <Link href="/dashboard/projects" className="text-sm text-cyan-300">View all</Link>
          </div>
          <div className="mt-4 divide-y divide-slate-800">
            {(recentProjects.length ? recentProjects : [{ id: "empty", name: "No projects yet", type: "web app", screenshots: 0, status: "draft" }]).map((project) => (
              <div key={project.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{project.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{project.type} / {project.screenshots} screenshots</p>
                </div>
                <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-medium ring-1 ${statusClass(project.status)}`}>{prettyStatus(project.status)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-[#0a1426] p-5">
          <h3 className="text-base font-semibold text-white">Plan summary</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><span className="text-slate-500">Plan</span><span className="text-white">{plan.label}</span></div>
            <div className="flex justify-between gap-4"><span className="text-slate-500">Credits</span><span className="text-white">{subscription.credits_remaining} / {creditLimit}</span></div>
            <div className="flex justify-between gap-4"><span className="text-slate-500">Watermark</span><span className="text-white">{plan.watermarkPreview ? "Enabled" : "Disabled"}</span></div>
            <div className="flex justify-between gap-4"><span className="text-slate-500">Commercial use</span><span className="text-white">{plan.commercialUse ? "Included" : "Upgrade required"}</span></div>
          </div>
          <Link href="/settings/billing" className="mt-5 flex h-10 items-center justify-center rounded-lg border border-slate-700 text-sm font-medium text-slate-200">
            Manage billing
          </Link>
        </div>
      </section>
    </div>
  );
}