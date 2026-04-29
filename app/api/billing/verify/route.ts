import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await req.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    message: "Lemon Squeezy purchases are confirmed by webhook. Credits will appear after the order_created event is received."
  });
}
