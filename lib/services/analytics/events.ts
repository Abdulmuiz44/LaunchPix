import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function trackEvent(input: {
  userId: string;
  eventType: string;
  projectId?: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("usage_events").insert({
    user_id: input.userId,
    project_id: input.projectId || null,
    event_type: input.eventType,
    metadata_json: input.metadata || null
  });
}
