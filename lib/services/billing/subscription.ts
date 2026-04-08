import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PLAN_CONFIG, type PlanId } from "@/lib/services/billing/plans";

function fallbackSubscription(userId: string) {
  return {
    id: `fallback-${userId}`,
    user_id: userId,
    plan: "free",
    status: "active",
    credits_remaining: PLAN_CONFIG.free.creditsGranted,
    provider: "paystack",
    provider_reference: null,
    last_payment_at: null
  } as any;
}

export async function getOrCreateSubscription(userId: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    if (data) return data;

    const { data: created, error: createError } = await supabase
      .from("subscriptions")
      .insert({ user_id: userId, plan: "free", status: "active", credits_remaining: PLAN_CONFIG.free.creditsGranted, provider: "paystack" })
      .select("*")
      .single();

    if (createError || !created) return fallbackSubscription(userId);
    return created;
  } catch {
    return fallbackSubscription(userId);
  }
}

export async function consumeGenerationCredit(userId: string) {
  const supabase = await createSupabaseServerClient();
  const current = await getOrCreateSubscription(userId);
  if (current.credits_remaining <= 0) throw new Error("No credits remaining. Upgrade to continue generating.");

  const { data, error } = await supabase
    .from("subscriptions")
    .update({ credits_remaining: current.credits_remaining - 1 })
    .eq("id", current.id)
    .eq("credits_remaining", current.credits_remaining)
    .select("*")
    .single();

  if (error || !data) throw new Error("Could not reserve credit. Please retry.");
  return data;
}

export async function grantPlanCredits(userId: string, planId: PlanId, providerRef: string) {
  const supabase = await createSupabaseServerClient();
  const current = await getOrCreateSubscription(userId);
  const plan = PLAN_CONFIG[planId];

  const credits = plan.billingType === "one_time" ? current.credits_remaining + plan.creditsGranted : plan.creditsGranted;
  const { error } = await supabase
    .from("subscriptions")
    .update({
      plan: planId,
      status: "active",
      credits_remaining: credits,
      provider: "paystack",
      provider_reference: providerRef,
      last_payment_at: new Date().toISOString()
    })
    .eq("id", current.id);

  if (error) throw new Error(error.message);
}
