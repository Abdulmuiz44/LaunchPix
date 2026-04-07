import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAccessContext } from "@/lib/services/access/permissions";
import { trackEvent } from "@/lib/services/analytics/events";

const ASSET_BUCKET = process.env.STORAGE_BUCKET_ASSETS || "launchpix-assets";

export async function GET(_: Request, { params }: { params: Promise<{ generationId: string }> }) {
  const { user, supabase } = await requireUser();
  const { generationId } = await params;

  const { plan } = await getAccessContext(user.id);
  if (!plan.zipExport) {
    await trackEvent({ userId: user.id, eventType: "paywall_viewed", metadata: { location: "zip_export" } });
    return NextResponse.json({ error: "ZIP export is available on paid plans. Upgrade to unlock full-resolution pack downloads." }, { status: 403 });
  }

  const { data: generation } = await supabase
    .from("generations")
    .select("id, project_id, projects!inner(user_id)")
    .eq("id", generationId)
    .eq("projects.user_id", user.id)
    .single();

  if (!generation) return NextResponse.json({ error: "Generation not found." }, { status: 404 });

  const path = `${user.id}/${generation.project_id}/${generation.id}/launchpix-pack.zip`;
  const { data, error } = await (await createSupabaseServerClient()).storage.from(ASSET_BUCKET).download(path);
  if (error || !data) return NextResponse.json({ error: "ZIP file is not ready yet. Try again in a moment." }, { status: 404 });

  await trackEvent({ userId: user.id, projectId: generation.project_id, eventType: "zip_export_requested" });

  return new NextResponse(data, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=launchpix-${generation.project_id}.zip`
    }
  });
}
