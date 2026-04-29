import crypto from "crypto";
import { CREDIT_PACKS, getCreditPack, type CreditPackId } from "@/lib/services/billing/plans";

const LEMON_SQUEEZY_BASE_URL = "https://api.lemonsqueezy.com/v1";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function getVariantId(packId: CreditPackId) {
  const pack = getCreditPack(packId);
  if (!pack) throw new Error("Unknown credit pack");
  return requiredEnv(pack.variantEnvKey);
}

async function lemonSqueezyRequest(path: string, init: RequestInit) {
  const apiKey = requiredEnv("LEMON_SQUEEZY_API_KEY");

  const res = await fetch(`${LEMON_SQUEEZY_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/vnd.api+json",
      ...(init.headers || {})
    }
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.errors?.[0]?.detail || json?.message || "Lemon Squeezy request failed");
  return json;
}

export async function createCreditCheckout(input: {
  email: string;
  packId: CreditPackId;
  userId: string;
  callbackUrl: string;
}) {
  const pack = getCreditPack(input.packId);
  if (!pack) throw new Error("Unknown credit pack");

  const json = await lemonSqueezyRequest("/checkouts", {
    method: "POST",
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          product_options: {
            name: pack.label,
            description: `${pack.creditsGranted} LaunchPix credits`,
            redirect_url: input.callbackUrl,
            receipt_button_text: "Return to LaunchPix",
            receipt_link_url: input.callbackUrl,
            enabled_variants: [Number(getVariantId(input.packId))]
          },
          checkout_options: {
            embed: false,
            media: false,
            logo: true,
            desc: true,
            discount: true,
            button_color: "#6d5dfc"
          },
          checkout_data: {
            email: input.email,
            custom: {
              user_id: input.userId,
              pack_id: input.packId,
              credits: pack.creditsGranted
            },
            custom_data: {
              user_id: input.userId,
              pack_id: input.packId,
              credits: pack.creditsGranted
            }
          }
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: requiredEnv("LEMON_SQUEEZY_STORE_ID")
            }
          },
          variant: {
            data: {
              type: "variants",
              id: getVariantId(input.packId)
            }
          }
        }
      }
    })
  });

  const url = json?.data?.attributes?.url;
  if (!url) throw new Error("Lemon Squeezy did not return a checkout URL");
  return { checkoutUrl: url };
}

export function verifyLemonSqueezyWebhookSignature(body: string, signature: string | null) {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const digest = Buffer.from(crypto.createHmac("sha256", secret).update(body).digest("hex"), "utf8");
  const received = Buffer.from(signature, "utf8");
  if (digest.length !== received.length) return false;
  return crypto.timingSafeEqual(digest, received);
}

export function packIdFromVariantId(variantId: string | number | null | undefined): CreditPackId | null {
  const id = String(variantId || "");
  const pack = CREDIT_PACKS.find((item) => process.env[item.variantEnvKey] === id);
  return pack?.id ?? null;
}
