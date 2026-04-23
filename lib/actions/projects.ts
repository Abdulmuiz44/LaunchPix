"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { defineIdentitySchema, styleDirectionSchema } from "@/lib/validation/project";
import { requireUser } from "@/lib/supabase/auth";
import { trackEvent } from "@/lib/services/analytics/events";

export async function upsertProjectIdentity(formData: FormData) {
  const { user, supabase } = await requireUser();

  const parsed = defineIdentitySchema.safeParse({
    name: formData.get("name"),
    productType: formData.get("productType"),
    platform: formData.get("platform"),
    description: formData.get("description"),
    audience: formData.get("audience"),
    websiteUrl: formData.get("websiteUrl"),
    primaryColor: formData.get("primaryColor"),
    stylePreset: formData.get("stylePreset")
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid project identity.");
  }

  const projectId = String(formData.get("projectId") || "");

  const payload = {
    user_id: user.id,
    name: parsed.data.name,
    product_type: parsed.data.productType,
    platform: parsed.data.platform,
    description: parsed.data.description,
    audience: parsed.data.audience,
    website_url: parsed.data.websiteUrl || null,
    primary_color: parsed.data.primaryColor,
    style_preset: parsed.data.stylePreset
  };

  const query = projectId
    ? supabase.from("projects").update(payload).eq("id", projectId).eq("user_id", user.id).select("id").single()
    : supabase.from("projects").insert(payload).select("id").single();

  const { data, error } = await query;
  if (error || !data) throw new Error(error?.message || "Unable to save project.");

  const { data: existingDraft, error: draftLookupError } = await supabase
    .from("generations")
    .select("id")
    .eq("project_id", data.id)
    .eq("status", "draft")
    .maybeSingle();

  if (draftLookupError) throw new Error(draftLookupError.message);

  if (!existingDraft) {
    const { error: genError } = await supabase
      .from("generations")
      .insert({ project_id: data.id, status: "draft" });

    if (genError) throw new Error(genError.message);
  }

  await trackEvent({ userId: user.id, projectId: data.id, eventType: "project_created" });
  revalidatePath("/dashboard/projects");
  redirect(`/dashboard/projects/new?projectId=${data.id}&step=2`);
}

export async function saveStyleDirection(formData: FormData) {
  const { user, supabase } = await requireUser();
  const projectId = String(formData.get("projectId") || "");
  if (!projectId) throw new Error("Missing project id");

  const parsed = styleDirectionSchema.safeParse({ stylePrompt: formData.get("stylePrompt") });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid style prompt");

  const { error } = await supabase
    .from("projects")
    .update({ style_prompt: parsed.data.stylePrompt || null, status: "ready" })
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/projects/${projectId}`);
  redirect(`/dashboard/projects/${projectId}`);
}
