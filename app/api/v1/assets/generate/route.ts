import { NextResponse } from "next/server"
import { authenticateApiCustomerRequest } from "@/lib/services/api-keys/authenticate-api-key"
import { renderAssetSvg, renderAssetPng, buildAssetPlan } from "@/lib/render/deterministic"
import { getBackend } from "@/lib/backend"
import type { GenerateAssetRequest, AssetType, Theme, OutputFormat } from "@/lib/launch/types"
import { ASSET_DIMENSIONS, ASSET_LABELS } from "@/lib/launch/types"

const VALID_ASSET_TYPES = new Set(['hero_banner', 'promo_tile', 'app_listing_frame'])
const VALID_THEMES = new Set(['dark', 'light', 'auto'])
const VALID_FORMATS = new Set(['png', 'svg'])

function validateRequest(body: unknown): { ok: true; data: GenerateAssetRequest } | { ok: false; error: string; status: number } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Request body is required.', status: 400 }
  }

  const b = body as Record<string, unknown>

  if (!b.productName || typeof b.productName !== 'string' || b.productName.trim().length === 0) {
    return { ok: false, error: 'productName is required.', status: 400 }
  }
  if (!b.tagline || typeof b.tagline !== 'string') {
    return { ok: false, error: 'tagline is required.', status: 400 }
  }

  const hasUrl = !!b.screenshotUrl && typeof b.screenshotUrl === 'string'
  const hasId = !!b.screenshotId && typeof b.screenshotId === 'string'

  if (!hasUrl && !hasId) {
    return { ok: false, error: 'Either screenshotUrl or screenshotId is required.', status: 400 }
  }
  if (hasUrl && hasId) {
    return { ok: false, error: 'Provide either screenshotUrl or screenshotId, not both.', status: 400 }
  }

  if (hasUrl) {
    const screenshotUrl = String(b.screenshotUrl)
    if (!screenshotUrl.startsWith('https://')) {
      return { ok: false, error: 'screenshotUrl must use HTTPS.', status: 400 }
    }
    if (screenshotUrl.includes('localhost') || screenshotUrl.includes('127.0.0.1') || screenshotUrl.includes('192.168.') || screenshotUrl.includes('10.')) {
      return { ok: false, error: 'screenshotUrl must not be a private/local URL.', status: 400 }
    }
  }

  if (!b.assetType || !VALID_ASSET_TYPES.has(b.assetType as string)) {
    return { ok: false, error: `assetType must be one of: ${[...VALID_ASSET_TYPES].join(', ')}`, status: 400 }
  }
  if (!b.theme || !VALID_THEMES.has(b.theme as string)) {
    return { ok: false, error: `theme must be one of: ${[...VALID_THEMES].join(', ')}`, status: 400 }
  }
  if (b.outputFormat && !VALID_FORMATS.has(b.outputFormat as string)) {
    return { ok: false, error: `outputFormat must be one of: ${[...VALID_FORMATS].join(', ')}`, status: 400 }
  }

  return {
    ok: true,
    data: {
      productName: b.productName.trim(),
      tagline: String(b.tagline).trim(),
      screenshotUrl: hasUrl ? String(b.screenshotUrl) : undefined,
      screenshotId: hasId ? String(b.screenshotId) : undefined,
      assetType: b.assetType as AssetType,
      theme: b.theme as Theme,
      brandColor: typeof b.brandColor === 'string' ? b.brandColor : undefined,
      outputFormat: (b.outputFormat as OutputFormat) || 'png',
    },
  }
}

async function resolveScreenshotUrl(
  screenshotId: string,
  userId: string
): Promise<{ ok: true; url: string } | { ok: false; error: string; status: number }> {
  const backend = getBackend()
  let screenshot
  try {
    screenshot = await backend.getScreenshotById({ id: screenshotId, userId })
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Backend lookup failed.", status: 502 }
  }

  if (!screenshot) {
    return { ok: false, error: "Screenshot not found.", status: 404 }
  }

  if (screenshot.userId !== userId) {
    return { ok: false, error: "Screenshot does not belong to this account.", status: 403 }
  }

  return { ok: true, url: screenshot.publicUrl }
}

export async function POST(request: Request) {
  const authResult = await authenticateApiCustomerRequest(request)
  if ('response' in authResult) return authResult.response

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 })
  }

  const validation = validateRequest(body)
  if (!validation.ok) {
    return NextResponse.json({ ok: false, error: validation.error }, { status: validation.status })
  }

  const input = validation.data

  let screenshotUrl = input.screenshotUrl
  if (input.screenshotId) {
    const resolved = await resolveScreenshotUrl(input.screenshotId, authResult.customer.userId)
    if (!resolved.ok) {
      return NextResponse.json({ ok: false, error: resolved.error }, { status: resolved.status })
    }
    screenshotUrl = resolved.url
  }

  const { width, height } = ASSET_DIMENSIONS[input.assetType]
  const plan = buildAssetPlan({ ...input, screenshotUrl: screenshotUrl! })

  const svg = renderAssetSvg({ ...input, screenshotUrl: screenshotUrl! })
  let pngBuffer: Buffer | null = null

  if (input.outputFormat === 'png') {
    pngBuffer = renderAssetPng({ ...input, screenshotUrl: screenshotUrl! })
  }

  const renderedPng = pngBuffer !== null
  const assetId = `asset_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const backend = getBackend()

  const asset = {
    id: assetId,
    status: renderedPng ? 'generated' as const : 'preview_generated' as const,
    assetType: input.assetType,
    format: renderedPng ? 'png' as const : 'svg' as const,
    width,
    height,
    renderedPng,
    svgPreview: renderedPng ? undefined : svg,
  }

  const usageAction = renderedPng ? "launchpix.asset.generate" : "launchpix.asset.preview"
  const assetMetadata = {
    assetId,
    screenshotId: input.screenshotId,
    dimensions: { width, height },
    template: input.assetType,
    generatedAt: new Date().toISOString(),
    generationType: renderedPng ? "png" : "svg_preview",
  }

  if (backend.recordAssetMetadata) {
    const storedAsset = await backend.recordAssetMetadata({
      userId: authResult.customer.userId,
      assetId,
      filename: `${assetId}.${renderedPng ? "png" : "svg"}`,
      contentType: renderedPng ? "image/png" : "image/svg+xml",
      sizeBytes: renderedPng ? pngBuffer!.byteLength : Buffer.byteLength(svg),
      publicUrl: screenshotUrl,
      metadata: assetMetadata,
    })
    if (!storedAsset.ok && backend.name === "stacklane") {
      return NextResponse.json({ ok: false, error: `Failed to record Stacklane asset metadata: ${storedAsset.error || "unknown"}` }, { status: 502 })
    }
  }

  const usage = await backend.recordUsage({
    userId: authResult.customer.userId,
    apiKeyId: authResult.customer.apiKeyId,
    action: usageAction,
    units: 1,
    metadata: assetMetadata,
  })
  if (!usage.ok && backend.name === "stacklane") {
    return NextResponse.json({ ok: false, error: `Failed to record backend usage: ${usage.error || "unknown"}` }, { status: 502 })
  }

  return NextResponse.json({
    ok: true,
    asset,
    plan: {
      ...plan,
      warnings: [
        ...plan.warnings,
        input.screenshotId ? 'Used uploaded screenshot.' : undefined,
        renderedPng
          ? 'PNG rendered deterministically. No AI image generation was used.'
          : 'SVG preview generated. PNG rendering requires @resvg/resvg-js to be available.',
      ].filter(Boolean),
    },
    credits: {
      used: 1,
      remaining: 0,
    },
  })
}
