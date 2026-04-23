import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Check,
  ChevronRight,
  Download,
  Folder,
  Gem,
  ImageIcon,
  Package,
  Sparkles,
  Zap
} from "lucide-react";
import { requireUser } from "@/lib/supabase/auth";
import { getAccessContext } from "@/lib/services/access/permissions";
import { listUserProjects } from "@/lib/services/projects/queries";

function statusClass(status: unknown) {
  const value = typeof status === "string" ? status.toLowerCase() : "draft";
  if (value.includes("complete")) return "bg-[#113828] text-[#76e6a6]";
  if (value.includes("progress") || value.includes("generating")) return "bg-[#213150] text-[#8cb2ff]";
  if (value.includes("failed")) return "bg-[#4a1d2f] text-[#ff9eb9]";
  return "bg-[#2a2f45] text-[#b7c5e8]";
}

function prettyStatus(status: unknown) {
  const raw = typeof status === "string" ? status : "draft";
  return raw.replaceAll("_", " ").replace(/\b\w/g, (m) => m.toUpperCase());
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

  const recentProjects = projects.slice(0, 4).map((project) => ({
    id: project.id,
    name: project.name,
    type: (project.product_type ?? "web app").toString().replaceAll("_", " "),
    screenshots: project.uploads?.[0]?.count ?? 0,
    status: project.status
  }));

  const recentActivity = [
    {
      id: "activity-1",
      label: activeProject ? `Generation completed for ${activeProject.name}` : "Generation queue ready",
      detail: activeProject ? `${activeProject.uploads?.[0]?.count ?? 0} assets prepared` : "Start by creating a new project",
      time: "2h ago",
      icon: Sparkles
    },
    {
      id: "activity-2",
      label: activeProject ? `Screenshots uploaded to ${activeProject.name}` : "Upload pipeline available",
      detail: activeProject ? `${activeProject.uploads?.[0]?.count ?? 0} uploads recorded` : "PNG, JPG, and WEBP are supported",
      time: "3h ago",
      icon: ImageIcon
    },
    {
      id: "activity-3",
      label: projects[1] ? `Project created: ${projects[1].name}` : "New workspace prepared",
      detail: projects[1] ? `${projects[1].uploads?.[0]?.count ?? 0} screenshots uploaded` : "Define identity and style to begin",
      time: "1d ago",
      icon: Folder
    },
    {
      id: "activity-4",
      label: "Credits consumed",
      detail: `-${Math.max(0, plan.creditsGranted - subscription.credits_remaining)} credits for generation`,
      time: "1d ago",
      icon: Zap
    }
  ];

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-2xl border border-[#24366a] bg-[#061645]">
        <div className="grid gap-5 p-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="relative overflow-hidden rounded-xl border border-[#2a3e74] bg-[linear-gradient(135deg,#0a1d65_0%,#0a1643_45%,#0a1030_100%)] p-6">
            <div className="absolute right-0 top-0 h-full w-[45%] bg-[radial-gradient(circle_at_80%_20%,rgba(106,119,255,0.55),transparent_55%),radial-gradient(circle_at_20%_90%,rgba(132,78,255,0.32),transparent_50%)]" />
            <div className="relative z-10 max-w-xl">
              <p className="text-xs uppercase tracking-[0.15em] text-[#8fa2cf]">Launch Workspace</p>
              <h2 className="mt-2 text-4xl font-semibold text-white">Your launch visuals, ready faster.</h2>
              <p className="mt-3 text-[#b3c3ea]">Upload screenshots, generate a polished pack, and export when the visuals are approved.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/dashboard/projects/new" className="rounded-xl bg-gradient-to-r from-[#5d79ff] to-[#6f42ff] px-5 py-2.5 text-sm font-semibold text-white">
                  + New Project
                </Link>
                <Link href="/dashboard/projects" className="rounded-xl border border-[#334a7c] bg-[#111f4b] px-5 py-2.5 text-sm font-semibold text-[#dce6ff]">
                  View Latest Pack
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#2a3e74] bg-[#081a3d] p-4">
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <p className="text-[#b3c3ea]">Plan</p>
              <p className="text-right text-white">{plan.label}</p>
              <p className="text-[#b3c3ea]">Credits Left</p>
              <p className="text-right text-white">
                <span className="font-semibold text-[#5f96ff]">{subscription.credits_remaining}</span> / {Math.max(300, subscription.credits_remaining)}
              </p>
              <p className="text-[#b3c3ea]">Export Mode</p>
              <p className="text-right text-white">{plan.fullResolutionExport ? "Full" : "Preview (Watermarked)"}</p>
              <p className="text-[#b3c3ea]">Queue Priority</p>
              <p className="text-right text-white">{plan.priorityGeneration ? "High" : "Normal"}</p>
            </div>
            <div className="mt-5 flex items-start gap-2 rounded-lg border border-[#334a7c] bg-[#111f4b] p-3 text-sm text-[#b3c3ea]">
              <Activity className="mt-0.5 size-4 text-[#8fa2cf]" />
              <p>Preview first on Free. Export full resolution on paid plans.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 xl:grid-cols-4">
        {[
          { icon: Zap, title: "Credits Left", value: `${subscription.credits_remaining} / ${Math.max(300, subscription.credits_remaining)}`, note: "Available for upcoming generations.", tone: "from-[#6f42ff]/35 to-[#392173]/35" },
          { icon: Folder, title: "Active Projects", value: String(activeProjectsCount), note: "In progress or ready to generate.", tone: "from-[#3d6aff]/30 to-[#173160]/30" },
          { icon: Package, title: "Generated Packs", value: String(generatedPacksCount), note: "Ready for review or export.", tone: "from-[#34c97e]/30 to-[#1f5c3f]/30" },
          { icon: Download, title: "Export Ready Assets", value: String(exportReady), note: "Available for download.", tone: "from-[#ffb64f]/30 to-[#5f4420]/30" }
        ].map((card) => (
          <div key={card.title} className="rounded-xl border border-[#24366a] bg-[#071637] p-4">
            <div className="flex items-center gap-3">
              <div className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.tone}`}>
                <card.icon className="size-5 text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#8fa2cf]">{card.title}</p>
                <p className="mt-1 text-4xl font-semibold text-white">{card.value}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-[#98add8]">{card.note}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-3 xl:grid-cols-[1.62fr_1fr]">
        <div className="rounded-xl border border-[#24366a] bg-[#071637] p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-semibold text-white">Active Project</h3>
            <button className="text-[#8fa2cf]">...</button>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.75fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6f42ff] to-[#36206f] text-4xl font-semibold text-white">S</div>
                <div>
                  <p className="text-4xl font-semibold text-white">{activeProject?.name ?? "Snaply - iOS App"}</p>
                  <p className="mt-1 text-sm text-[#98add8]">{(activeProject?.product_type ?? "ios_app").replaceAll("_", " ")} | Productivity | Updated 2h ago</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-[#8fa2cf]">Target Platform</p>
                <p className="text-white">App Store</p>
                <p className="text-[#8fa2cf]">Screenshots</p>
                <p className="text-white">{activeProject?.uploads?.[0]?.count ?? 12} uploaded</p>
                <p className="text-[#8fa2cf]">Visual Style</p>
                <p className="text-white">Bold Modern</p>
                <p className="text-[#8fa2cf]">Audience</p>
                <p className="text-white">Professionals</p>
              </div>

              <div className="rounded-xl border border-[#30457a] bg-[#0f2149] p-3">
                <div className="flex items-center justify-between text-sm text-[#c8d7fb]">
                  <span className="flex items-center gap-2"><Check className="size-4 text-[#6fe39f]" /> Define Identity</span>
                  <span className="flex items-center gap-2"><Check className="size-4 text-[#6fe39f]" /> Upload Screenshots</span>
                  <span className="flex items-center gap-2"><Sparkles className="size-4 text-[#9e8fff]" /> Generate Pack</span>
                  <span className="text-[#7e8fb9]">Export Assets</span>
                </div>
              </div>

              <button className="rounded-lg border border-[#334a7c] bg-[#111f4b] px-4 py-2 text-sm font-semibold text-[#dce6ff]">View Project Details</button>
            </div>

            <div className="space-y-2">
              <Link href="/dashboard/projects/new?step=3" className="flex items-center justify-between rounded-lg bg-gradient-to-r from-[#5d79ff] to-[#6f42ff] px-4 py-3 text-sm font-semibold text-white">
                Continue Project
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/dashboard/projects/new?step=3" className="flex items-center justify-between rounded-lg border border-[#334a7c] bg-[#111f4b] px-4 py-3 text-sm font-semibold text-[#dce6ff]">
                Generate Assets
                <Sparkles className="size-4" />
              </Link>
              <Link href="/dashboard/projects" className="flex items-center justify-between rounded-lg border border-[#334a7c] bg-[#111f4b] px-4 py-3 text-sm font-semibold text-[#dce6ff]">
                View Assets
                <Folder className="size-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#24366a] bg-[#071637] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-3xl font-semibold text-white">Latest Pack Preview</h3>
            <Link href="/dashboard/projects" className="text-sm text-[#8fa2cf]">View All</Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {["iPhone 15 Pro", "iPhone 15 Pro", "iPad Pro", "Promo Tile"].map((item, index) => (
              <div key={item + index} className="overflow-hidden rounded-lg border border-[#2f4478] bg-[#0f2048]">
                <div className="h-24 bg-[linear-gradient(120deg,#6f42ff_0%,#384ddf_45%,#1f2f66_100%)]" />
                <div className="px-2 py-1.5">
                  <p className="text-xs font-semibold text-white">{item}</p>
                  <p className="text-[11px] text-[#8fa2cf]">1280 x 2796</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <Link href="/dashboard/projects" className="rounded-lg border border-[#334a7c] bg-[#111f4b] py-2 text-center text-sm font-medium text-[#dce6ff]">View Full Pack</Link>
            <Link href="/dashboard/projects" className="rounded-lg bg-gradient-to-r from-[#5d79ff] to-[#6f42ff] py-2 text-center text-sm font-semibold text-white">Download ZIP</Link>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#24366a] bg-[#071637] p-4">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            { step: 1, title: "Define Identity", text: "Tell us about your product and audience.", color: "bg-[#5a3cff]" },
            { step: 2, title: "Upload Screenshots", text: "Add your screenshots and key visuals.", color: "bg-[#3d6aff]" },
            { step: 3, title: "Generate Pack", text: "AI crafts high-converting visual assets.", color: "bg-[#6f42ff]" },
            { step: 4, title: "Export Assets", text: "Download and ship your launch visuals.", color: "bg-[#2f8d55]" }
          ].map((item, idx) => (
            <div key={item.title} className="flex items-start gap-3 rounded-lg border border-[#2f4478] bg-[#0f2048] p-3">
              <div className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${item.color}`}>{item.step}</div>
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-[#8fa2cf]">{item.text}</p>
              </div>
              {idx < 3 ? <ChevronRight className="ml-auto mt-1 size-4 text-[#8fa2cf]" /> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3 xl:grid-cols-3">
        <div className="rounded-xl border border-[#24366a] bg-[#071637] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-3xl font-semibold text-white">Recent Projects</h3>
            <Link href="/dashboard/projects" className="text-sm text-[#8fa2cf]">View All</Link>
          </div>
          <div className="space-y-2">
            {(recentProjects.length ? recentProjects : [{ id: "empty", name: "No projects yet", type: "web app", screenshots: 0, status: "draft" }]).map((project) => (
              <div key={project.id} className="flex items-center justify-between rounded-lg border border-[#2f4478] bg-[#0f2048] px-3 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-white">{project.name}</p>
                  <p className="text-xs text-[#8fa2cf]">{project.type} | {project.screenshots} screenshots</p>
                </div>
                <span className={`rounded-md px-2 py-0.5 text-xs ${statusClass(project.status)}`}>{prettyStatus(project.status)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#24366a] bg-[#071637] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-3xl font-semibold text-white">Recent Activity</h3>
            <Link href="/dashboard/projects" className="text-sm text-[#8fa2cf]">View All</Link>
          </div>
          <div className="space-y-2">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3 rounded-lg border border-[#2f4478] bg-[#0f2048] px-3 py-2.5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-7 items-center justify-center rounded-md bg-[#213150]">
                    <item.icon className="size-4 text-[#8cb2ff]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-[#8fa2cf]">{item.detail}</p>
                  </div>
                </div>
                <span className="text-xs text-[#8fa2cf]">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#24366a] bg-[#071637] p-4">
          <h3 className="text-3xl font-semibold text-white">Billing & Plan</h3>
          <div className="mt-3 rounded-lg border border-[#2f4478] bg-[#0f2048] p-3">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold text-white"><Gem className="size-4 text-[#8b6dff]" /> {plan.label} Plan</p>
              <span className="rounded-md bg-[#113828] px-2 py-0.5 text-xs text-[#76e6a6]">Active</span>
            </div>
            <div className="mt-3 grid grid-cols-[1fr_auto] gap-y-2 text-sm">
              <p className="text-[#8fa2cf]">Credits Left</p>
              <p className="text-white">{subscription.credits_remaining} / {Math.max(300, subscription.credits_remaining)}</p>
              <p className="text-[#8fa2cf]">Export Access</p>
              <p className="text-white">{plan.fullResolutionExport ? "Full" : "Preview (Watermarked)"}</p>
              <p className="text-[#8fa2cf]">Watermark</p>
              <p className="text-white">{plan.watermarkPreview ? "Enabled" : "Disabled"}</p>
              <p className="text-[#8fa2cf]">Commercial Use</p>
              <p className="text-white">{plan.commercialUse ? "Included" : "Not included"}</p>
            </div>
          </div>

          <div className="mt-3 grid gap-2">
            <Link href="/settings/billing" className="rounded-lg bg-gradient-to-r from-[#5d79ff] to-[#6f42ff] py-2.5 text-center text-sm font-semibold text-white">Upgrade Plan</Link>
            <Link href="/settings/billing" className="rounded-lg border border-[#334a7c] bg-[#111f4b] py-2.5 text-center text-sm font-semibold text-[#dce6ff]">Buy Launch Pack</Link>
            <p className="text-center text-xs text-[#8fa2cf]">Need more credits? Purchase a one-time Launch Pack.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
