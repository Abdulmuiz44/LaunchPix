"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Gen = { id: string; status: string; error_message?: string | null } | null;

const statusLabel: Record<string, string> = {
  queued: "Queued",
  analyzing: "Analyzing product context",
  generating_copy: "Generating conversion copy",
  rendering_assets: "Rendering deterministic assets",
  completed: "Completed",
  failed: "Failed"
};

export function GeneratePanel({ projectId, ready, missing }: { projectId: string; ready: boolean; missing: string[] }) {
  const router = useRouter();
  const [generation, setGeneration] = useState<Gen>(null);
  const [pending, startTransition] = useTransition();
  const [apiError, setApiError] = useState<string | null>(null);

  const currentStatus = generation?.status || "idle";
  const busy = ["queued", "analyzing", "generating_copy", "rendering_assets"].includes(currentStatus);

  async function fetchState() {
    const res = await fetch(`/api/generations/${projectId}`);
    if (!res.ok) return;
    const json = await res.json();
    setGeneration(json.generation);
  }

  useEffect(() => {
    void fetchState();
    const i = setInterval(fetchState, 3500);
    return () => clearInterval(i);
  }, [projectId]);

  useEffect(() => {
    if (generation?.status === "completed") router.push(`/dashboard/projects/${projectId}/assets`);
  }, [generation?.status, projectId, router]);

  async function generate() {
    setApiError(null);
    const res = await fetch(`/api/generations/${projectId}`, { method: "POST" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setApiError(json.error || "Generation could not start. Please retry.");
      return;
    }
    await fetchState();
  }

  const missingText = useMemo(() => missing.join(", "), [missing]);

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div>
          <h2 className="text-lg font-semibold">Generation progress</h2>
          {!ready ? (
            <p className="mt-1 text-sm text-rose-500">To continue, add: {missingText}.</p>
          ) : (
            <p className="mt-1 text-sm text-emerald-600">Ready to produce your full 7-asset launch pack.</p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium">Current status</p>
          <p className="mt-1 text-sm text-muted-foreground">{statusLabel[currentStatus] || "Ready"}</p>
          {busy ? <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full w-2/3 animate-pulse rounded-full bg-primary" /></div> : null}
          {generation?.status === "failed" ? <p className="mt-3 text-sm text-rose-500">{generation.error_message || "Generation failed. Please retry."}</p> : null}
          {apiError ? <p className="mt-2 text-sm text-rose-500">{apiError}</p> : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button disabled={!ready || pending || busy} onClick={() => startTransition(() => void generate())}>{generation?.status === "failed" ? "Retry generation" : "Generate assets"}</Button>
          <Button asChild variant="outline"><Link href={`/dashboard/projects/${projectId}`}>Back to project</Link></Button>
        </div>
      </CardContent>
    </Card>
  );
}
