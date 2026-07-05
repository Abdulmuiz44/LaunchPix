import type {
  AssetMetadataInput,
  BackendHealth,
  FileStorageInput,
  GetScreenshotInput,
  LaunchPixBackend,
  ScreenshotRecord,
  ScreenshotRecordInput,
  UsageInput,
  UsageResult,
} from "./types"
import { getStacklaneConfig } from "./config"

type StacklaneAsset = {
  id: string
  customerId?: string
  filename: string
  contentType: string
  sizeBytes: number
  storagePath: string
  publicUrl?: string
  checksum?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

function sanitizeMetadata(input?: Record<string, unknown>): Record<string, unknown> {
  if (!input) return {}
  const next: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(input)) {
    if (/key|token|secret|authorization/i.test(key)) continue
    next[key] = value
  }
  return next
}

async function stacklaneRequest(path: string, method = "GET", body?: unknown): Promise<{ ok: boolean; data?: any; error?: string }> {
  const { baseUrl, apiKey } = getStacklaneConfig()
  if (!baseUrl || !apiKey) {
    return { ok: false, error: "Stacklane backend is not fully configured." }
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    }

    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return { ok: false, error: data.error?.message || data.error || `HTTP ${res.status}` }
    }
    return { ok: true, data }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error" }
  }
}

async function ensureCustomer(userId: string): Promise<{ ok: true; customerId: string } | { ok: false; error: string }> {
  const customers = await stacklaneRequest("/api/v1/customers")
  if (!customers.ok) return { ok: false, error: customers.error || "Failed to list Stacklane customers" }

  const existing = (customers.data?.customers || []).find((item: any) => item.externalRef === userId)
  if (existing?.id) {
    return { ok: true, customerId: existing.id }
  }

  const created = await stacklaneRequest("/api/v1/customers", "POST", {
    name: `LaunchPix ${userId.slice(0, 8)}`,
    externalRef: userId,
    status: "active",
  })
  if (!created.ok || !created.data?.customer?.id) {
    return { ok: false, error: created.error || "Failed to create Stacklane customer" }
  }

  return { ok: true, customerId: created.data.customer.id }
}

function toScreenshotRecord(asset: StacklaneAsset, fallbackUserId: string): ScreenshotRecord {
  const meta = asset.metadata || {}
  return {
    id: asset.id,
    userId: typeof meta.userId === "string" ? meta.userId : fallbackUserId,
    storageKey: typeof meta.storageKey === "string" ? meta.storageKey : asset.storagePath,
    originalFilename: asset.filename,
    mimeType: asset.contentType,
    fileSize: asset.sizeBytes,
    width: typeof meta.width === "number" ? meta.width : 0,
    height: typeof meta.height === "number" ? meta.height : 0,
    publicUrl: asset.publicUrl || "",
    createdAt: asset.createdAt,
  }
}

export function buildStacklaneUsagePayload(input: UsageInput) {
  return {
    product: "launchpix",
    action: input.action,
    units: input.units ?? 1,
    metadata: sanitizeMetadata(input.metadata),
  }
}

export function buildStacklaneAssetPayload(input: AssetMetadataInput, customerId?: string) {
  return {
    customerId,
    product: "launchpix",
    filename: input.filename,
    contentType: input.contentType,
    sizeBytes: input.sizeBytes,
    publicUrl: input.publicUrl,
    metadata: sanitizeMetadata({
      ...input.metadata,
      userId: input.userId,
      assetId: input.assetId,
    }),
  }
}

export function createStacklaneAdapter(): LaunchPixBackend {
  return {
    name: "stacklane",

    async health(): Promise<BackendHealth> {
      const config = getStacklaneConfig()
      if (!config.baseUrl || !config.apiKey) {
        return {
          ok: false,
          backend: "stacklane",
          message: "Stacklane backend is not fully configured.",
          config: config.status,
        }
      }

      const result = await stacklaneRequest("/api/v1/health")
      return {
        ok: result.ok,
        backend: "stacklane",
        message: result.ok ? "Stacklane connected" : `Stacklane error: ${result.error}`,
        config: config.status,
      }
    },

    async insertScreenshot(input: ScreenshotRecordInput): Promise<ScreenshotRecord> {
      const customer = await ensureCustomer(input.userId)
      if (!customer.ok) throw new Error(customer.error)

      const result = await stacklaneRequest("/api/v1/assets", "POST", buildStacklaneAssetPayload({
        userId: input.userId,
        filename: input.originalFilename,
        contentType: input.mimeType,
        sizeBytes: input.fileSize,
        publicUrl: input.publicUrl,
        metadata: {
          kind: "screenshot",
          storageKey: input.storageKey,
          width: input.width,
          height: input.height,
        }
      }, customer.customerId))

      if (!result.ok || !result.data?.asset) {
        throw new Error(result.error || "Failed to record screenshot in Stacklane")
      }

      return toScreenshotRecord(result.data.asset as StacklaneAsset, input.userId)
    },

    async getScreenshotById(input: GetScreenshotInput): Promise<ScreenshotRecord | null> {
      const result = await stacklaneRequest(`/api/v1/assets/${input.id}`)
      if (!result.ok || !result.data?.asset) {
        throw new Error(result.error || "Failed to load screenshot from Stacklane")
      }
      const asset = result.data.asset as StacklaneAsset
      if (asset.metadata?.kind !== "screenshot") return null
      return toScreenshotRecord(asset, input.userId)
    },

    async recordUsage(input: UsageInput): Promise<UsageResult> {
      const result = await stacklaneRequest("/api/v1/usage/events", "POST", buildStacklaneUsagePayload(input))
      return { ok: result.ok, id: result.data?.event?.id, error: result.error }
    },

    async recordAssetMetadata(input: AssetMetadataInput) {
      const customer = await ensureCustomer(input.userId)
      if (!customer.ok) return { ok: false, error: customer.error }
      const result = await stacklaneRequest("/api/v1/assets", "POST", buildStacklaneAssetPayload(input, customer.customerId))
      return { ok: result.ok, id: result.data?.asset?.id, error: result.error }
    },

    async deleteAssetMetadata(id: string) {
      const result = await stacklaneRequest(`/api/v1/assets/${id}`, "DELETE")
      return { ok: result.ok, error: result.error }
    },

    async recordStoredFile(input: FileStorageInput) {
      const customer = await ensureCustomer(input.userId)
      if (!customer.ok) return { ok: false, error: customer.error }
      const result = await stacklaneRequest("/api/v1/files", "POST", {
        customerId: customer.customerId,
        product: "launchpix",
        filename: input.filename,
        contentType: input.contentType,
        bytesBase64: input.bytesBase64,
        metadata: sanitizeMetadata(input.metadata),
      })
      return { ok: result.ok, id: result.data?.file?.id, storagePath: result.data?.file?.storagePath, error: result.error }
    },
  }
}
