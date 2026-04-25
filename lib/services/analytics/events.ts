import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendLifecycleEmail } from "@/lib/email/resend";

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

  await sendLifecycleEmail(input).catch((error) => {
    console.warn("Lifecycle email notification failed:", error instanceof Error ? error.message : error);
  });
}
