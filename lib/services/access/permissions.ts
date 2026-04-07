import { PLAN_CONFIG } from "@/lib/services/billing/plans";
import { getOrCreateSubscription } from "@/lib/services/billing/subscription";

export async function getAccessContext(userId: string) {
  const subscription = await getOrCreateSubscription(userId);
  const plan = PLAN_CONFIG[(subscription.plan || "free") as keyof typeof PLAN_CONFIG] || PLAN_CONFIG.free;
  return { subscription, plan };
}

export function canDownloadFull(planId: string) {
  const plan = PLAN_CONFIG[(planId as keyof typeof PLAN_CONFIG) || "free"];
  return !!plan?.fullResolutionExport;
}
