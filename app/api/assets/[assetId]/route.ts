import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateAssetMetadata } from "@/lib/services/assets/edits";
import { renderAssetPng } from "@/lib/render/pipeline";

const ASSET_BUCKET = process.env.STORAGE_BUCKET_ASSETS || "launchpix-assets";

async function ensureOwnership(assetId: string, userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("assets")
    .select("id, file_url, asset_type, width, height, generation_id, metadata_json, generations!inner(projects!inner(user_id))")
    .eq("id", assetId)
    .eq("generations.projects.user_id", userId)
    .single();

  return data;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ assetId: string }> }) {
  const { user } = await requireUser();
  const { assetId } = await params;
  const body = await req.json();

  const asset = await ensureOwnership(assetId, user.id);
  if (!asset) return NextResponse.json({ error: "Asset not found" }, { status: 404 });

  await updateAssetMetadata(assetId, body);
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request, { params }: { params: Promise<{ assetId: string }> }) {
  const { user } = await requireUser();
  const { assetId } = await params;
  const asset = await ensureOwnership(assetId, user.id);
  if (!asset) return NextResponse.json({ error: "Asset not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const editable = { ...((asset.metadata_json as any)?.editable || {}), ...(body || {}) };

  const png = await renderAssetPng({
    width: asset.width,
    height: asset.height,
    templateFamily: editable.templateFamily || (asset.metadata_json as any)?.template_family || "minimal",
    headline: editable.headline || "Launch visuals in minutes",
    subheadline: editable.subheadline || "Deterministic, conversion-focused design output.",
    callouts: editable.callouts || ["Premium templates", "Reliable exports", "Built for product launches"],
    cta: "Try LaunchPix",
    screenshotUrls: [],
    primaryColor: editable.primaryColor || "#4F46E5"
  });

  const path = `${user.id}/rerendered/${asset.generation_id}/${asset.id}.png`;
  const supabase = await createSupabaseServerClient();
  const { error: uploadError } = await supabase.storage.from(ASSET_BUCKET).upload(path, png, { upsert: true, contentType: "image/png" });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: pub } = supabase.storage.from(ASSET_BUCKET).getPublicUrl(path);
  await supabase.from("assets").update({ file_url: pub.publicUrl, preview_url: pub.publicUrl }).eq("id", asset.id);

  return NextResponse.json({ ok: true, file_url: pub.publicUrl });
}
