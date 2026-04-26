import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileImage,
  Layers3,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Target,
  UploadCloud,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const proof = [
  "No design tool setup",
  "Preview before paying",
  "Store and promo sizes",
  "Export-ready ZIP packs"
];

const workflow = [
  {
    icon: FileImage,
    step: "Problem",
    title: "Screenshots are not launch assets.",
    description: "Raw product captures look unfinished when they land in store listings, ads, changelogs, or launch pages."
  },
  {
    icon: UploadCloud,
    step: "Agitate",
    title: "Manual polish steals launch time.",
    description: "Every crop, caption, layout, and export size becomes another handoff before your product can be shown properly."
  },
  {
    icon: Sparkles,
    step: "Solve",
    title: "LaunchPix turns the mess into a pack.",
    description: "Brief once, upload screenshots, generate a consistent visual system, then export the launch-ready files."
  }
];

const outputs = [
  { label: "App listing", size: "1290 x 2796", tone: "bg-[#0f172a]" },
  { label: "Promo tile", size: "1024 x 1024", tone: "bg-[#111827]" },
  { label: "Hero banner", size: "1600 x 900", tone: "bg-[#08111f]" }
];

const trustSignals = [
  { value: "3", label: "asset families per launch" },
  { value: "12", label: "screenshots organized fast" },
  { value: "1", label: "ZIP handoff when approved" }
];

const useCases = [
  {
    title: "App store launches",
    description: "Create listing frames that make the product value obvious before users read the description."
  },
  {
    title: "Product Hunt and social",
    description: "Turn approved screenshots into promo tiles that match the launch story and keep the campaign consistent."
  },
  {
    title: "Landing page hero visuals",
    description: "Generate clean hero assets for launch pages, changelogs, and update announcements."
  }
];

const faq = [
  {
    question: "What if the first output is not ready?",
    answer: "You preview before production export. Use the preview to judge layout quality, tighten the brief, and regenerate before spending on final files."
  },
  {
    question: "Do I need a designer to use it?",
    answer: "No. LaunchPix is built for founders and product teams who already have screenshots but need structured, launch-ready presentation."
  },
  {
    question: "What files do I get?",
    answer: "Paid plans unlock full-resolution PNG assets and ZIP export for app listings, promo tiles, and hero banners."
  },
  {
    question: "Why not just upload raw screenshots?",
    answer: "Raw screenshots rarely explain the product fast. LaunchPix adds structure, hierarchy, and consistent framing so the product looks ready to trust."
  }
];

export function LandingSections() {
  return (
    <main>
      <section className="border-b border-slate-200 dark:border-white/8">
        <div className="app-shell grid min-h-[calc(100svh-74px)] items-center gap-12 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
          <div className="max-w-2xl">
            <p className="eyebrow">Problem</p>
            <h1 className="hero-title mt-5 text-balance">
              Your product is ready. Your screenshots still look unfinished.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              LaunchPix turns raw product screenshots into structured launch packs for app stores, promo posts, and landing pages - without sending every release back through design.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="sm:min-w-52">
                <Link href="/dashboard/projects/new">
                  Generate my launch pack
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="sm:min-w-40">
                <Link href="/pricing">View plans</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {proof.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="size-4 shrink-0 text-cyan-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[36px] bg-cyan-400/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[30px] border border-white/[0.1] bg-[#050810] p-4 shadow-[0_34px_120px_-70px_rgba(76,201,240,0.65)] sm:p-5">
              <div className="flex items-center justify-between border-b border-white/8 pb-4">
                <div>
                  <p className="text-sm font-semibold text-white">Launch pack preview</p>
                  <p className="mt-1 text-xs text-slate-500">Generated from 12 uploaded screenshots</p>
                </div>
                <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                  Export ready
                </span>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-[0.78fr_1.22fr]">
                <div className="rounded-[22px] border border-white/[0.08] bg-[#080d16] p-4">
                  <p className="dashboard-label">Brief</p>
                  <div className="mt-5 space-y-3">
                    {["Audience: founders", "Tone: bold and clear", "Goal: launch week"].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/[0.07] bg-[#030610] px-4 py-3 text-sm text-slate-300">
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-2xl bg-[#111827] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Plan</p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">Five listing frames, one promo tile, and one hero banner.</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {outputs.map((item, index) => (
                    <div
                      key={item.label}
                      className={`min-h-44 rounded-[22px] border border-white/[0.09] ${item.tone} p-4 ${index === 2 ? "sm:col-span-2" : ""}`}
                    >
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{item.label}</span>
                        <span>{item.size}</span>
                      </div>
                      <div className="mt-5 grid h-28 grid-cols-[0.7fr_1fr] gap-3">
                        <div className="rounded-[18px] bg-gradient-to-br from-cyan-300/80 to-indigo-500/80" />
                        <div className="space-y-3 pt-2">
                          <div className="h-3 w-3/4 rounded-full bg-white/20" />
                          <div className="h-3 w-1/2 rounded-full bg-white/12" />
                          <div className="h-14 rounded-2xl bg-white/[0.08]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 dark:border-white/8 dark:bg-[#03060d]">
        <div className="app-shell grid gap-4 py-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <p className="text-center text-sm leading-7 text-slate-600 dark:text-slate-400 md:text-left">
            Built for launch teams that need credible visuals before the campaign window closes.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {trustSignals.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center dark:border-white/[0.07] dark:bg-white/[0.03]">
                <p className="text-2xl font-semibold text-slate-950 dark:text-white">{item.value}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="app-shell app-section">
        <div className="grid gap-10 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
          <div>
            <p className="eyebrow">PAS framework</p>
            <h2 className="section-title mt-5">From screenshot debt to launch-ready visuals.</h2>
            <p className="section-copy mt-4 max-w-md">
              The workflow is built around one job: remove the gap between a finished product and the visuals needed to launch it.
            </p>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#060a12]">
            {workflow.map((item, index) => (
              <div key={item.title} className={`grid gap-5 p-6 sm:grid-cols-[128px_1fr] sm:p-8 ${index < workflow.length - 1 ? "border-b border-slate-200 dark:border-white/8" : ""}`}>
                <div>
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.04]">
                    <item.icon className="size-5 text-cyan-200" />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.step}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="app-shell pb-16 sm:pb-20">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 dark:border-red-400/10 dark:bg-[#070a12]">
            <div className="flex items-center gap-3 text-sm font-semibold text-red-200">
              <XCircle className="size-5" />
              Before LaunchPix
            </div>
            <h2 className="mt-5 text-3xl font-semibold text-slate-950 dark:text-white">The launch looks assembled at the last minute.</h2>
            <div className="mt-6 space-y-4">
              {[
                "Screenshots have different crops, spacing, and visual weight.",
                "The product story changes across store, promo, and landing assets.",
                "Design handoff blocks the release even after the product is ready."
              ].map((item) => (
                <p key={item} className="border-t border-slate-200 pt-4 text-sm leading-7 text-slate-600 dark:border-white/8 dark:text-slate-400">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-cyan-200 bg-cyan-50 p-6 sm:p-8 dark:border-cyan-300/20 dark:bg-[#071017]">
            <div className="flex items-center gap-3 text-sm font-semibold text-cyan-200">
              <CheckCircle2 className="size-5" />
              After LaunchPix
            </div>
            <h2 className="mt-5 text-3xl font-semibold text-slate-950 dark:text-white">The launch has one clear visual system.</h2>
            <div className="mt-6 space-y-4">
              {[
                "Every asset follows the same brief, audience, and tone.",
                "Listing frames, promo tiles, and hero banners feel connected.",
                "Your team previews quality first, then exports when it is ready."
              ].map((item) => (
                <p key={item} className="border-t border-cyan-200 pt-4 text-sm leading-7 text-slate-700 dark:border-white/8 dark:text-slate-300">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="app-shell pb-16 sm:pb-20">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 dark:border-white/[0.08] dark:bg-[#060a12]">
            <p className="eyebrow">What changes</p>
            <h2 className="section-title mt-5 max-w-2xl">
              Fewer design detours. More consistent launch assets.
            </h2>
            <p className="section-copy mt-4 max-w-2xl">
              LaunchPix keeps the brief, screenshots, generation state, billing, and exports in one workspace so teams can move from product capture to launch delivery without losing context.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["12", "screenshots organized"],
                ["3", "asset formats generated"],
                ["1", "ZIP ready for handoff"]
              ].map(([value, label]) => (
                <div key={label} className="border-t border-slate-200 pt-4 dark:border-white/8">
                  <p className="text-3xl font-semibold text-slate-950 dark:text-white">{value}</p>
                  <p className="mt-2 text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 sm:p-8 dark:border-white/[0.08] dark:bg-[#080d16]">
            <ShieldCheck className="size-6 text-cyan-200" />
            <h3 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">Built for review before commitment.</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Preview the visual direction first. Upgrade only when the pack is worth exporting at production quality.
            </p>
            <div className="mt-8 space-y-3">
              {["Watermarked preview flow", "Clear credit usage", "Full-resolution export on paid plans"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <Layers3 className="size-4 text-slate-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 dark:border-white/8 dark:bg-[#03060d]">
        <div className="app-shell app-section">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <p className="eyebrow">Use cases</p>
              <h2 className="section-title mt-5">One workflow for the places your launch has to show up.</h2>
              <p className="section-copy mt-4 max-w-md">
                High-converting pages make the next use case obvious. LaunchPix keeps each output tied to the same product story.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {useCases.map((item, index) => (
                <div key={item.title} className="rounded-[24px] border border-slate-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#070b12]">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-white/[0.04] text-sm font-semibold text-cyan-200">
                    0{index + 1}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="app-shell app-section">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 dark:border-white/[0.08] dark:bg-[#060a12]">
            <p className="eyebrow">Decision support</p>
            <h2 className="section-title mt-5">Answer the objections before they slow the signup.</h2>
            <p className="section-copy mt-4">
              A professional landing page should reduce uncertainty. These are the practical questions that block teams from trying a new launch workflow.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Clock3, title: "Fast start", text: "Brief and upload in one guided flow." },
                { icon: Target, title: "Clear output", text: "Formats are tied to launch channels." },
                { icon: MessageSquareText, title: "Less guessing", text: "Preview before export keeps risk low." }
              ].map((item) => (
                <div key={item.title} className="border-t border-slate-200 pt-4 dark:border-white/8">
                  <item.icon className="size-5 text-cyan-200" />
                  <p className="mt-3 font-semibold text-slate-950 dark:text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#060a12]">
            {faq.map((item, index) => (
              <div key={item.question} className={`p-6 sm:p-7 ${index < faq.length - 1 ? "border-b border-slate-200 dark:border-white/8" : ""}`}>
                <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{item.question}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white dark:border-white/8 dark:bg-[#02040a]">
        <div className="app-shell grid gap-8 py-14 lg:grid-cols-[1fr_0.48fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="eyebrow">Solution</p>
            <h2 className="section-title mt-5">Stop shipping with screenshots that undersell the product.</h2>
            <p className="section-copy mt-4">
              Create the first project, upload your captures, and see whether the generated pack is strong enough to export.
            </p>
          </div>

          <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5 dark:border-white/[0.08] dark:bg-[#070b12]">
            <p className="text-sm font-semibold text-slate-950 dark:text-white">Start with a preview project</p>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              No design setup. No production export charge until the generated visuals are worth shipping.
            </p>
            <Button asChild size="lg" className="mt-5 w-full">
              <Link href="/dashboard/projects/new">
                Start with a free preview
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
