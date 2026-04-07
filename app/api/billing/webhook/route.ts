import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/payments/paystack";
import { grantPlanCredits } from "@/lib/services/billing/subscription";
import { trackEvent } from "@/lib/services/analytics/events";

export async function POST(req: Request) {
  const signature = req.headers.get("x-paystack-signature");
  const bodyText = await req.text();

  if (!verifyWebhookSignature(bodyText, signature)) {
    return NextResponse.json({ error: "Webhook signature mismatch" }, { status: 401 });
  }

  const body = JSON.parse(bodyText);
  if (body.event !== "charge.success") return NextResponse.json({ ok: true });

  const planId = body.data?.metadata?.plan_id as "launch_pack" | "starter" | "pro";
  const userId = body.data?.metadata?.user_id as string;
  const reference = body.data?.reference as string;

  if (!planId || !userId || !reference) {
    return NextResponse.json({ error: "Webhook payload missing required metadata" }, { status: 400 });
  }

  try {
    await grantPlanCredits(userId, planId, reference);
    await trackEvent({ userId, eventType: "checkout_completed", metadata: { plan: planId, source: "webhook" } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
