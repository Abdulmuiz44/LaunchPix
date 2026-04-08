import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updateAssetMetadata(assetId: string, payload: {
  headline?: string;
  subheadline?: string;
  callouts?: string[];
  templateFamily?: string;
  primaryColor?: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: asset, error } = await supabase.from("assets").select("metadata_json").eq("id", assetId).single();
  if (error || !asset) throw new Error("Asset not found");

  const metadata = {
    ...(asset.metadata_json || {}),
    editable: {
      ...((asset.metadata_json as any)?.editable || {}),
      ...payload
    }
  };

  const { error: updateError } = await supabase.from("assets").update({ metadata_json: metadata }).eq("id", assetId);
  if (updateError) throw new Error(updateError.message);
}
