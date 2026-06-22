/**
 * Stacklane backend adapter for LaunchPix v0.1.
 * 
 * Experimental: Stacklane support is not yet complete.
 * Supabase remains the default backend.
 * 
 * v0.1 handles:
 * - health check
 * - screenshot metadata recording
 * - screenshot lookup
 * - usage event recording
 * 
 * v0.1 limitations:
 * - API customer auth still uses Supabase
 * - File storage still uses Supabase
 * - No full Stacklane project creation yet
 */

import type {
  LaunchPixBackend,
  BackendHealth,
  ScreenshotRecordInput,
  ScreenshotRecord,
  GetScreenshotInput,
  UsageInput,
  UsageResult,
} from "./types"

const STACKLANE_URL = process.env.STACKLANE_PROJECT_URL || ""
const STACKLANE_TOKEN = process.env.STACKLANE_ACCESS_TOKEN || ""
const STACKLANE_PROJECT_ID = process.env.STACKLANE_PROJECT_ID || ""

async function stacklaneRequest(path: string, method = "GET", body?: unknown): Promise<{ ok: boolean; data?: any; error?: string }> {
  if (!STACKLANE_URL || !STACKLANE_TOKEN) {
    return { ok: false, error: "Stacklane not configured" }
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${STACKLANE_TOKEN}`,
    }

    const res = await fetch(`${STACKLANE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await res.json()
    if (!res.ok) {
      return { ok: false, error: data.error?.message || `HTTP ${res.status}` }
    }
    return { ok: true, data }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error" }
  }
}

export function createStacklaneAdapter(): LaunchPixBackend {
  return {
    name: "stacklane",

    async health(): Promise<BackendHealth> {
      if (!STACKLANE_URL || !STACKLANE_TOKEN) {
        return {
          ok: false,
          backend: "stacklane",
          message: "Stacklane not configured. Set STACKLANE_PROJECT_URL and STACKLANE_ACCESS_TOKEN.",
        }
      }

      const result = await stacklaneRequest("/health")
      return {
        ok: result.ok,
        backend: "stacklane",
        message: result.ok ? "Stacklane connected" : `Stacklane error: ${result.error}`,
      }
    },

    async insertScreenshot(input: ScreenshotRecordInput): Promise<ScreenshotRecord> {
      const result = await stacklaneRequest("/v1/snapshots", "POST", {
        projectId: STACKLANE_PROJECT_ID,
        name: input.originalFilename,
        mimeType: input.mimeType,
        fileSize: input.fileSize,
        width: input.width,
        height: input.height,
        url: input.publicUrl,
        metadata: {
          userId: input.userId,
          storageKey: input.storageKey,
        },
      })

      if (!result.ok) {
        throw new Error(result.error || "Failed to record screenshot in Stacklane")
      }

      return {
        id: result.data?.id || generateId("snap"),
        userId: input.userId,
        storageKey: input.storageKey,
        originalFilename: input.originalFilename,
        mimeType: input.mimeType,
        fileSize: input.fileSize,
        width: input.width,
        height: input.height,
        publicUrl: input.publicUrl,
        createdAt: new Date().toISOString(),
      }
    },

    async getScreenshotById(input: GetScreenshotInput): Promise<ScreenshotRecord | null> {
      const result = await stacklaneRequest(`/v1/snapshots/${input.id}`)
      if (!result.ok || !result.data) return null

      const s = result.data
      return {
        id: s.id,
        userId: s.metadata?.userId || input.userId,
        storageKey: s.metadata?.storageKey || "",
        originalFilename: s.name || "",
        mimeType: s.mimeType || "",
        fileSize: s.fileSize || 0,
        width: s.width || 0,
        height: s.height || 0,
        publicUrl: s.url || "",
        createdAt: s.createdAt || new Date().toISOString(),
      }
    },

    async recordUsage(input: UsageInput): Promise<UsageResult> {
      const result = await stacklaneRequest("/v1/usage", "POST", {
        projectId: STACKLANE_PROJECT_ID,
        action: input.action,
        metadata: input.metadata || {},
      })
      return { ok: result.ok, error: result.error }
    },
  }
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
