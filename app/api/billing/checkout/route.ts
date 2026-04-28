import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/auth";
import { initializeCheckout } from "@/lib/payments/paystack";
import { trackEvent } from "@/lib/services/analytics/events";

export async function POST(req: Request) {
  try {
    const { user, supabase } = await requireUser();
    const body = (await req.json()) as { planId: "launch_pack" | "starter" | "pro" };
    if (!body.planId) return NextResponse.json({ error: "Plan selection is required." }, { status: 400 });

    const email = user.email;
    if (!email) return NextResponse.json({ error: "No verified email found for checkout." }, { status: 400 });

    await trackEvent({ userId: user.id, eventType: "checkout_started", metadata: { plan: body.planId } });

    const data = await initializeCheckout({
      email,
      planId: body.planId,
      metadata: { user_id: user.id },
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?checkout=success`
    });

    return NextResponse.json({ authorization_url: data.authorization_url, reference: data.reference });
  } catch {
    return NextResponse.json({ error: "Checkout could not start. Please try again." }, { status: 500 });
  }
}
