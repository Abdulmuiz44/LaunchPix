"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Gen = { id: string; status: string; error_message?: string | null } | null;

const statusLabel: Record<string, string> = {
  queued: "Queued for processing",
  analyzing: "Reading product context",
  generating_copy: "Building asset messaging",
  rendering_assets: "Rendering launch visuals",
  completed: "Asset pack completed",
  failed: "Generation failed"
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
    const intervalId = setInterval(fetchState, 3500);
    return () => clearInterval(intervalId);
  }, [projectId]);

  useEffect(() => {
    if (generation?.status === "completed") {
      router.push(`/dashboard/projects/${projectId}/assets`);
    }
  }, [generation?.status, projectId, router]);

  async function generate() {
    setApiError(null);
    setGeneration((current) => ({ id: current?.id || "pending", status: "queued", error_message: null }));
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
    <section className="surface space-y-6 p-6 sm:p-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Generation</p>
          <h2 className="mt-3 text-2xl font-semibold">Launch pack progress</h2>
        </div>
        <div className="surface-muted px-4 py-3 text-sm text-muted-foreground">
          {statusLabel[currentStatus] || "Ready when you are"}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-muted space-y-4 p-5">
          {!ready ? (
            <p className="text-sm leading-7 text-rose-500">You still need: {missingText}.</p>
          ) : (
            <p className="text-sm leading-7 text-muted-foreground">
              Your project is ready. LaunchPix will create the full seven-asset sequence and redirect you to the asset view once rendering completes.
            </p>
          )}

          <div className="h-2 overflow-hidden rounded-full bg-background/80">
            <div className={`h-full rounded-full bg-primary transition-all ${busy ? "w-2/3 animate-pulse" : generation?.status === "completed" ? "w-full" : "w-1/4"}`} />
          </div>

          {generation?.status === "failed" ? <p className="text-sm text-rose-500">{generation.error_message || "Generation failed. Please retry."}</p> : null}
          {apiError ? <p className="text-sm text-rose-500">{apiError}</p> : null}
        </div>

        <div className="surface-muted flex flex-col gap-3 p-5 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">What gets rendered</p>
          <p>Five listing frames, one promo tile, and one hero banner built from your uploaded screenshots and structured copy plan.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button disabled={!ready || pending || busy} onClick={() => startTransition(() => void generate())}>
          {generation?.status === "failed" ? "Retry generation" : "Generate assets"}
        </Button>
        <Button asChild variant="outline">
          <Link href={`/dashboard/projects/${projectId}`}>Back to project</Link>
        </Button>
      </div>
    </section>
  );
}
