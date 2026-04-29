import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FREE_SIGNUP_CREDITS, PLAN_CONFIG, type CreditPackId } from "@/lib/services/billing/plans";

function fallbackSubscription(userId: string) {
  return {
    id: `fallback-${userId}`,
    user_id: userId,
    plan: "credits",
    status: "active",
    credits_remaining: FREE_SIGNUP_CREDITS,
    provider: "lemon_squeezy",
    provider_reference: null,
    last_payment_at: null
  } as any;
}

async function raiseLegacyBalance(userId: string, subscription: any) {
  if (subscription.credits_remaining >= FREE_SIGNUP_CREDITS && subscription.plan === "credits") return subscription;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .update({
      plan: "credits",
      status: "active",
      credits_remaining: Math.max(subscription.credits_remaining ?? 0, FREE_SIGNUP_CREDITS),
      provider: subscription.provider || "lemon_squeezy"
    })
    .eq("id", subscription.id)
    .eq("user_id", userId)
    .select("*")
    .single();

  return error || !data ? subscription : data;
}

export async function getOrCreateSubscription(userId: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    if (data) return raiseLegacyBalance(userId, data);

    const { data: created, error: createError } = await supabase
      .from("subscriptions")
      .insert({ user_id: userId, plan: "credits", status: "active", credits_remaining: FREE_SIGNUP_CREDITS, provider: "lemon_squeezy" })
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
  if (current.credits_remaining <= 0) throw new Error("No credits remaining. Buy credits to continue generating.");

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

export async function grantCreditPack(userId: string, packId: CreditPackId, providerRef: string) {
  const supabase = await createSupabaseServerClient();
  const current = await getOrCreateSubscription(userId);
  const pack = PLAN_CONFIG[packId];

  const credits = current.credits_remaining + pack.creditsGranted;
  const { error } = await supabase
    .from("subscriptions")
    .update({
      plan: "credits",
      status: "active",
      credits_remaining: credits,
      provider: "lemon_squeezy",
      provider_reference: providerRef,
      last_payment_at: new Date().toISOString()
    })
    .eq("id", current.id);

  if (error) throw new Error(error.message);
}
