"use client";

import { useState, useTransition } from "react";
import type { AssetRecord, GenerationRecord } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function AssetsManager({ projectId, generation, assets, canDownloadFull }: { projectId: string; generation: GenerationRecord | null; assets: AssetRecord[]; canDownloadFull: boolean; }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [templateFamily, setTemplateFamily] = useState("minimal");
  const [pending, startTransition] = useTransition();

  async function save(assetId: string) {
    await fetch(`/api/assets/${assetId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ headline, subheadline, templateFamily }) });
    setEditing(null);
    window.location.reload();
  }

  async function rerenderAsset(assetId: string) {
    await fetch(`/api/assets/${assetId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ templateFamily }) });
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      {!canDownloadFull ? (
        <Card className="border-primary/30 bg-primary/5"><CardContent className="p-4 text-sm"><p className="font-medium">Preview mode on Free plan</p><p className="mt-1 text-muted-foreground">You can review watermarked assets now. Upgrade to unlock full-resolution PNG and ZIP export for launch use.</p></CardContent></Card>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button asChild><a href={`/api/export/${generation?.id}`}>Download full ZIP</a></Button>
        <Button variant="outline" asChild><a href={`/dashboard/projects/${projectId}/generate`}>Regenerate full pack</a></Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => (
          <Card key={asset.id} className="overflow-hidden">
            <div className="border-b border-border bg-muted/20 p-2 text-xs text-muted-foreground">{asset.asset_type} • {asset.width}×{asset.height}</div>
            <CardContent className="space-y-3 p-4">
              <img src={asset.preview_url || asset.file_url} alt={asset.asset_type} className="h-44 w-full rounded-lg border border-border bg-card object-cover" />
              <p className="text-xs text-muted-foreground">Template: {(asset.metadata_json as any)?.template_family || "minimal"}</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" asChild><a href={`/api/assets/${asset.id}/download`}>Download</a></Button>
                <Button size="sm" variant="outline" onClick={() => { setEditing(asset.id); setHeadline(""); setSubheadline(""); }}>Edit copy</Button>
                <Button size="sm" variant="outline" disabled={pending} onClick={() => startTransition(() => { void rerenderAsset(asset.id); })}>Rerender</Button>
              </div>

              {editing === asset.id ? (
                <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
                  <input className="h-9 w-full rounded-md border border-border bg-transparent px-2 text-sm" placeholder="Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
                  <input className="h-9 w-full rounded-md border border-border bg-transparent px-2 text-sm" placeholder="Subheadline" value={subheadline} onChange={(e) => setSubheadline(e.target.value)} />
                  <select className="h-9 w-full rounded-md border border-border bg-transparent px-2 text-sm" value={templateFamily} onChange={(e) => setTemplateFamily(e.target.value)}>
                    <option value="minimal">Minimal</option><option value="bold">Bold</option><option value="dark">Dark</option><option value="gradient">Gradient</option>
                  </select>
                  <div className="flex gap-2"><Button size="sm" disabled={pending} onClick={() => startTransition(() => { void save(asset.id); })}>Save</Button><Button size="sm" variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
