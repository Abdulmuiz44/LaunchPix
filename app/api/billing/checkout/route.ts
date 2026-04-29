import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/auth";
import { createCreditCheckout } from "@/lib/payments/lemon-squeezy";
import { trackEvent } from "@/lib/services/analytics/events";
import { isCreditPackId } from "@/lib/services/billing/plans";

export async function POST(req: Request) {
  try {
    const { user } = await requireUser();
    const body = (await req.json()) as { packId?: string; planId?: string };
    const packId = body.packId || body.planId;
    if (!packId || !isCreditPackId(packId)) return NextResponse.json({ error: "Credit pack selection is required." }, { status: 400 });

    const email = user.email;
    if (!email) return NextResponse.json({ error: "No verified email found for checkout." }, { status: 400 });

    await trackEvent({ userId: user.id, eventType: "checkout_started", metadata: { pack: packId, provider: "lemon_squeezy" } });

    const data = await createCreditCheckout({
      email,
      packId,
      userId: user.id,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?checkout=success`
    });

    return NextResponse.json({ checkout_url: data.checkoutUrl, authorization_url: data.checkoutUrl });
  } catch {
    return NextResponse.json({ error: "Checkout could not start. Please try again." }, { status: 500 });
  }
}
