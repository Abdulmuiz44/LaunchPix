import crypto from "crypto";
import type { PlanId } from "@/lib/services/billing/plans";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

export const PAYSTACK_PLAN_AMOUNTS: Record<Exclude<PlanId, "free">, number> = {
  launch_pack: 15000,
  starter: 12000,
  pro: 35000
};

async function paystackRequest(path: string, init: RequestInit) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("PAYSTACK_SECRET_KEY is not configured");

  const res = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
      ...(init.headers || {})
    }
  });

  const json = await res.json();
  if (!res.ok || !json.status) throw new Error(json.message || "Paystack request failed");
  return json.data;
}

export async function initializeCheckout(input: {
  email: string;
  planId: Exclude<PlanId, "free">;
  metadata: Record<string, unknown>;
  callbackUrl: string;
}) {
  return paystackRequest("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: PAYSTACK_PLAN_AMOUNTS[input.planId] * 100,
      callback_url: input.callbackUrl,
      metadata: { ...input.metadata, plan_id: input.planId },
      channels: ["card", "bank", "ussd", "bank_transfer"]
    })
  });
}

export async function verifyTransaction(reference: string) {
  return paystackRequest(`/transaction/verify/${reference}`, { method: "GET" });
}

export function verifyWebhookSignature(body: string, signature: string | null) {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
}
