import { NextResponse } from "next/server"
import { authenticateApiCustomerRequest } from "@/lib/services/api-keys/authenticate-api-key"
import { renderAssetSvg, renderAssetPng, buildAssetPlan } from "@/lib/render/deterministic"
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
  if (!b.screenshotUrl || typeof b.screenshotUrl !== 'string') {
    return { ok: false, error: 'screenshotUrl is required.', status: 400 }
  }
  if (!b.screenshotUrl.startsWith('https://')) {
    return { ok: false, error: 'screenshotUrl must use HTTPS.', status: 400 }
  }
  if (b.screenshotUrl.includes('localhost') || b.screenshotUrl.includes('127.0.0.1') || b.screenshotUrl.includes('192.168.') || b.screenshotUrl.includes('10.')) {
    return { ok: false, error: 'screenshotUrl must not be a private/local URL.', status: 400 }
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
      screenshotUrl: String(b.screenshotUrl),
      assetType: b.assetType as AssetType,
      theme: b.theme as Theme,
      brandColor: typeof b.brandColor === 'string' ? b.brandColor : undefined,
      outputFormat: (b.outputFormat as OutputFormat) || 'png',
    },
  }
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
  const { width, height } = ASSET_DIMENSIONS[input.assetType]
  const plan = buildAssetPlan(input)

  const svg = renderAssetSvg(input)
  let pngBuffer: Buffer | null = null

  if (input.outputFormat === 'png') {
    pngBuffer = renderAssetPng(input)
  }

  const renderedPng = pngBuffer !== null
  const assetId = `asset_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

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

  return NextResponse.json({
    ok: true,
    asset,
    plan: {
      ...plan,
      warnings: [
        ...plan.warnings,
        renderedPng
          ? 'PNG rendered deterministically. No AI image generation was used.'
          : 'SVG preview generated. PNG rendering requires @resvg/resvg-js to be available.',
      ],
    },
    credits: {
      used: 1,
      remaining: 0,
    },
  })
}
