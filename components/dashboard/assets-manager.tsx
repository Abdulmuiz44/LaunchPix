"use client";

import { useState, useTransition } from "react";
import type { AssetRecord, GenerationRecord } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function AssetsManager({ projectId, generation, assets, canDownloadFull }: { projectId: string; generation: GenerationRecord | null; assets: AssetRecord[]; canDownloadFull: boolean }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [templateFamily, setTemplateFamily] = useState("minimal");
  const [pending, startTransition] = useTransition();

  async function save(assetId: string) {
    await fetch(`/api/assets/${assetId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ headline, subheadline, templateFamily })
    });
    setEditing(null);
    window.location.reload();
  }

  async function rerenderAsset(assetId: string) {
    await fetch(`/api/assets/${assetId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateFamily })
    });
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      {!canDownloadFull ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="space-y-3 p-5 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Preview mode is active on the Free plan.</p>
            <p>Review watermarked assets now, then upgrade when you need full-resolution PNG and ZIP export.</p>
            <Button asChild variant="outline" size="sm">
              <a href="/settings/billing">Upgrade plan</a>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <a href={`/api/export/${generation?.id}`}>Download full ZIP</a>
        </Button>
        <Button variant="outline" asChild>
          <a href={`/dashboard/projects/${projectId}/generate`}>Regenerate pack</a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {assets.map((asset) => (
          <Card key={asset.id} className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <span>{asset.asset_type.replaceAll("_", " ")}</span>
              <span>{asset.width}×{asset.height}</span>
            </div>

            <CardContent className="space-y-4 p-4">
              <img src={asset.preview_url || asset.file_url} alt={asset.asset_type} className="h-56 w-full rounded-[22px] border border-border/60 bg-card object-cover" />

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <p className="text-muted-foreground">Template: {(asset.metadata_json as { template_family?: string } | null)?.template_family || "minimal"}</p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" asChild>
                    <a href={`/api/assets/${asset.id}/download`}>Download</a>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { setEditing(asset.id); setHeadline(""); setSubheadline(""); }}>
                    Edit copy
                  </Button>
                  <Button size="sm" variant="outline" disabled={pending} onClick={() => startTransition(() => void rerenderAsset(asset.id))}>
                    Rerender
                  </Button>
                </div>
              </div>

              {editing === asset.id ? (
                <div className="surface-muted space-y-3 p-4">
                  <input className="field h-10" placeholder="Headline" value={headline} onChange={(event) => setHeadline(event.target.value)} />
                  <input className="field h-10" placeholder="Subheadline" value={subheadline} onChange={(event) => setSubheadline(event.target.value)} />
                  <select className="field-select h-10" value={templateFamily} onChange={(event) => setTemplateFamily(event.target.value)}>
                    <option value="minimal">Minimal</option>
                    <option value="bold">Bold</option>
                    <option value="dark">Dark</option>
                    <option value="gradient">Gradient</option>
                  </select>
                  <div className="flex gap-2">
                    <Button size="sm" disabled={pending} onClick={() => startTransition(() => void save(asset.id))}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
