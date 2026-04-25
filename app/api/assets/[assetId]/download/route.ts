import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAccessContext } from "@/lib/services/access/permissions";
import { trackEvent } from "@/lib/services/analytics/events";

export async function GET(_: Request, { params }: { params: Promise<{ assetId: string }> }) {
  const { user } = await requireUser();
  const { assetId } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: asset } = await supabase
    .from("assets")
    .select("id, file_url, preview_url, generation_id, generations!inner(project_id, projects!inner(user_id,name))")
    .eq("id", assetId)
    .eq("generations.projects.user_id", user.id)
    .single();

  if (!asset) return NextResponse.json({ error: "Asset not found or access denied." }, { status: 404 });

  const { plan } = await getAccessContext(user.id);
  const url = plan.fullResolutionExport ? asset.file_url : asset.preview_url || asset.file_url;
  const projectName = (asset.generations as any).projects?.name;
  if (!plan.fullResolutionExport) await trackEvent({ userId: user.id, projectId: (asset.generations as any).project_id, eventType: "paywall_viewed", metadata: { location: "asset_download", projectName } });

  await trackEvent({ userId: user.id, projectId: (asset.generations as any).project_id, eventType: "asset_downloaded", metadata: { full: plan.fullResolutionExport, projectName } });
  return NextResponse.redirect(url);
}
