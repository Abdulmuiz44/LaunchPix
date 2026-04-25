import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/auth";
import { verifyTransaction } from "@/lib/payments/paystack";
import { grantPlanCredits } from "@/lib/services/billing/subscription";
import { trackEvent } from "@/lib/services/analytics/events";
import { PLAN_CONFIG } from "@/lib/services/billing/plans";

export async function POST(req: Request) {
  try {
    const { user } = await requireUser();
    const body = (await req.json()) as { reference: string };
    if (!body.reference) return NextResponse.json({ error: "Payment reference is required." }, { status: 400 });

    const data = await verifyTransaction(body.reference);
    const planId = data?.metadata?.plan_id as "launch_pack" | "starter" | "pro";
    const owner = data?.metadata?.user_id as string;

    if (data.status !== "success" || !planId || owner !== user.id) {
      return NextResponse.json({ error: "Payment verification did not complete. Please contact support if charged." }, { status: 400 });
    }

    await grantPlanCredits(user.id, planId, data.reference);
    const planLabel = PLAN_CONFIG[planId].label;
    await trackEvent({ userId: user.id, eventType: "checkout_completed", metadata: { plan: planLabel, reference: data.reference, credits: PLAN_CONFIG[planId].creditsGranted } });
    await trackEvent({ userId: user.id, eventType: "plan_upgraded", metadata: { plan: planId } });

    return NextResponse.json({ ok: true, plan: planId });
  } catch {
    return NextResponse.json({ error: "We could not verify this payment right now. Please retry in billing settings." }, { status: 500 });
  }
}
