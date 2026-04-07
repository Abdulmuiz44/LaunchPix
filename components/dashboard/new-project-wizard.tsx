"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ProjectRecord, UploadRecord } from "@/types/project";
import { PRODUCT_TYPE_OPTIONS, PLATFORM_OPTIONS, STYLE_PRESET_OPTIONS } from "@/lib/validation/project";
import { MultiStepShell } from "@/components/dashboard/multi-step-shell";
import { ProjectSummaryCard } from "@/components/dashboard/project-summary-card";
import { ScreenshotList } from "@/components/dashboard/screenshot-list";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { saveStyleDirection, upsertProjectIdentity } from "@/lib/actions/projects";

const labels: Record<string, string> = {
  browser_extension: "Browser Extension",
  saas: "SaaS",
  web_app: "Web App",
  mobile_app: "Mobile App",
  other: "Other",
  chrome_web_store: "Chrome Web Store",
  firefox_addons: "Firefox Add-ons",
  product_launch: "Product Launch",
  saas_marketing: "SaaS Marketing",
  general_promo: "General Promo",
  minimal: "Minimal",
  bold: "Bold",
  dark: "Dark",
  gradient: "Gradient",
  corporate: "Corporate"
};

export function NewProjectWizard({ initialStep, project, initialUploads }: { initialStep: number; project: ProjectRecord | null; initialUploads: UploadRecord[] }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [uploads, setUploads] = useState(initialUploads);
  const [progress, setProgress] = useState(0);
  const [isPending, startTransition] = useTransition();

  const step = Math.min(Math.max(initialStep, 1), 3);
  const canContinueToStep3 = uploads.length > 0;

  const summary = useMemo(
    () => ({
      name: project?.name || "",
      productType: labels[project?.product_type || ""] || "",
      platform: labels[project?.platform || ""] || "",
      audience: project?.audience || "",
      style: labels[project?.style_preset || ""] || "",
      screenshotCount: uploads.length
    }),
    [project, uploads.length]
  );

  async function uploadFiles(files: FileList | null) {
    if (!files || !project?.id) return;
    for (let i = 0; i < files.length && uploads.length + i < 5; i++) {
      const form = new FormData();
      form.append("file", files[i]);
      form.append("position", String(uploads.length + i));
      setProgress(Math.round(((i + 1) / files.length) * 90));
      const res = await fetch(`/api/projects/${project.id}/uploads`, { method: "POST", body: form });
      if (!res.ok) continue;
      const payload = await res.json();
      setUploads((prev) => [...prev, payload.upload]);
    }
    setProgress(100);
    setTimeout(() => setProgress(0), 600);
  }

  async function onDelete(id: string) {
    if (!project?.id) return;
    await fetch(`/api/projects/${project.id}/uploads/${id}`, { method: "DELETE" });
    const next = uploads.filter((u) => u.id !== id);
    setUploads(next);
    await fetch(`/api/projects/${project.id}/uploads/reorder`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: next.map((u) => u.id) }) });
  }

  async function onReorder(id: string, dir: "up" | "down") {
    if (!project?.id) return;
    const index = uploads.findIndex((u) => u.id === id);
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= uploads.length) return;
    const next = [...uploads];
    [next[index], next[target]] = [next[target], next[index]];
    setUploads(next);
    await fetch(`/api/projects/${project.id}/uploads/reorder`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: next.map((u) => u.id) }) });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <MultiStepShell step={step} />

        {step === 1 && (
          <Card><CardContent className="p-6"><h2 className="text-xl font-semibold">Define product identity</h2><p className="mt-1 text-sm text-muted-foreground">Tell us what you are launching. We’ll keep this context across all visuals.</p><form action={upsertProjectIdentity} className="mt-6 grid gap-4 md:grid-cols-2"><input type="hidden" name="projectId" value={project?.id || ""} /><label className="grid gap-1 text-sm">Project name<input name="name" required defaultValue={project?.name ?? ""} className="h-10 rounded-lg border border-border bg-transparent px-3" /></label><label className="grid gap-1 text-sm">Product type<select name="productType" defaultValue={project?.product_type ?? "browser_extension"} className="h-10 rounded-lg border border-border bg-transparent px-3">{PRODUCT_TYPE_OPTIONS.map((x)=><option key={x} value={x}>{labels[x]}</option>)}</select></label><label className="grid gap-1 text-sm">Target platform<select name="platform" defaultValue={project?.platform ?? "chrome_web_store"} className="h-10 rounded-lg border border-border bg-transparent px-3">{PLATFORM_OPTIONS.map((x)=><option key={x} value={x}>{labels[x]}</option>)}</select></label><label className="grid gap-1 text-sm">Target audience<input name="audience" required defaultValue={project?.audience ?? ""} className="h-10 rounded-lg border border-border bg-transparent px-3" /></label><label className="grid gap-1 text-sm md:col-span-2">One-sentence product description<textarea name="description" required defaultValue={project?.description ?? ""} className="min-h-24 rounded-lg border border-border bg-transparent px-3 py-2" /></label><label className="grid gap-1 text-sm">Website URL (optional)<input name="websiteUrl" defaultValue={project?.website_url ?? ""} className="h-10 rounded-lg border border-border bg-transparent px-3" /></label><label className="grid gap-1 text-sm">Primary brand color<input name="primaryColor" required defaultValue={project?.primary_color ?? "#4F46E5"} className="h-10 rounded-lg border border-border bg-transparent px-3" /></label><label className="grid gap-1 text-sm md:col-span-2">Preferred visual style<select name="stylePreset" defaultValue={project?.style_preset ?? "minimal"} className="h-10 rounded-lg border border-border bg-transparent px-3">{STYLE_PRESET_OPTIONS.map((x)=><option key={x} value={x}>{labels[x]}</option>)}</select></label><div className="md:col-span-2"><Button size="lg">Save identity and continue</Button></div></form></CardContent></Card>
        )}

        {step === 2 && project && (
          <Card><CardContent className="space-y-4 p-6"><div className="flex items-center justify-between"><div><h2 className="text-xl font-semibold">Upload screenshots</h2><p className="text-sm text-muted-foreground">Add up to 5 screenshots. Reorder to define story flow.</p></div><p className="text-sm text-muted-foreground">{uploads.length}/5 added</p></div><div className="flex min-h-36 cursor-pointer items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 p-4 text-center" onClick={() => fileInputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => {event.preventDefault(); void uploadFiles(event.dataTransfer.files);}}><div><p className="font-medium">Drop files here or click to browse</p><p className="text-sm text-muted-foreground">PNG, JPG, WEBP up to 10MB each</p></div><input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" multiple className="hidden" onChange={(event) => void uploadFiles(event.target.files)} /></div>{progress > 0 && <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>}<ScreenshotList uploads={uploads} onDelete={onDelete} onReorder={onReorder} /><div className="flex gap-3"><Button variant="outline" onClick={() => router.push(`/dashboard/projects/new?projectId=${project.id}&step=1`)}>Back</Button><Button disabled={!canContinueToStep3 || isPending} onClick={() => startTransition(() => router.push(`/dashboard/projects/new?projectId=${project.id}&step=3`))}>Continue to style direction</Button></div></CardContent></Card>
        )}

        {step === 3 && project && (
          <Card><CardContent className="space-y-4 p-6"><h2 className="text-xl font-semibold">Choose visual direction</h2><p className="text-sm text-muted-foreground">You’re one step away from launch-ready assets. Tune your style guidance for higher conversion impact.</p><form action={saveStyleDirection} className="space-y-4"><input type="hidden" name="projectId" value={project.id} /><label className="grid gap-1 text-sm">Selected style preset<input readOnly value={labels[project.style_preset] || project.style_preset} className="h-10 rounded-lg border border-border bg-muted px-3" /></label><label className="grid gap-1 text-sm">Custom style prompt (optional)<textarea name="stylePrompt" defaultValue={project.style_prompt ?? ""} placeholder="e.g. Keep contrast high, use concise headlines, and emphasize social proof." className="min-h-28 rounded-lg border border-border bg-transparent px-3 py-2" /></label><div className="rounded-xl border border-border bg-muted/30 p-4 text-sm"><p className="font-medium">Output pack preview</p><ul className="mt-2 list-disc pl-6 text-muted-foreground"><li>5 main screenshots (1280x800)</li><li>1 promo tile (440x280)</li><li>1 hero banner (1400x560)</li></ul></div><div className="flex gap-3"><Button variant="outline" type="button" onClick={() => router.push(`/dashboard/projects/new?projectId=${project.id}&step=2`)}>Back</Button><Button type="submit">Save and continue to project</Button></div></form></CardContent></Card>
        )}
      </div>

      <ProjectSummaryCard {...summary} />
    </div>
  );
}
