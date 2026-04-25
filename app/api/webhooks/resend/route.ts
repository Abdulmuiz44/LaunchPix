import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "RESEND_WEBHOOK_SECRET is not configured." }, { status: 500 });
  }

  const payload = await req.text();
  const resend = new Resend(process.env.RESEND_API_KEY);

  let event: any;

  try {
    event = resend.webhooks.verify({
      payload,
      webhookSecret,
      headers: {
        id: req.headers.get("svix-id") ?? "",
        timestamp: req.headers.get("svix-timestamp") ?? "",
        signature: req.headers.get("svix-signature") ?? ""
      }
    });
  } catch {
    return NextResponse.json({ error: "Invalid Resend webhook signature." }, { status: 401 });
  }

  console.info("Resend webhook received:", event.type);

  return NextResponse.json({ ok: true });
}
