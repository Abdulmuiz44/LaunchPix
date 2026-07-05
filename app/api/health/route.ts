import { NextResponse } from "next/server";
import { getBackendConfigStatus } from "@/lib/backend";

export async function GET() {
  const backend = getBackendConfigStatus()
  return NextResponse.json({
    ok: true,
    service: "launchpix",
    mode: "self-host",
    version: "0.1.0",
    backend: backend.backend,
    stacklane: backend.stacklane,
    timestamp: new Date().toISOString(),
  });
}
