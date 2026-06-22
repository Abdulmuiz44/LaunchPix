/**
 * LaunchPix Asset Generation Types
 * 
 * v0.1: Deterministic fallback rendering only.
 * AI image generation is planned but not implemented.
 */

export type AssetType = 'hero_banner' | 'promo_tile' | 'app_listing_frame'
export type Theme = 'dark' | 'light' | 'auto'
export type OutputFormat = 'png' | 'svg'

export interface GenerateAssetRequest {
  productName: string
  tagline: string
  screenshotUrl: string
  assetType: AssetType
  theme: Theme
  brandColor?: string
  outputFormat?: OutputFormat
}

export interface AssetPlan {
  layout: string
  headline: string
  subheadline: string
  visualTreatment: string
  cta: string
  width: number
  height: number
  warnings: string[]
}

export interface GeneratedAsset {
  id: string
  status: 'generated' | 'preview_generated' | 'failed'
  assetType: AssetType
  format: OutputFormat
  url?: string
  previewUrl?: string
  width: number
  height: number
  renderedPng: boolean
}

export interface GenerateAssetResponse {
  ok: boolean
  asset?: GeneratedAsset
  plan?: AssetPlan
  credits?: {
    used: number
    remaining: number
  }
  error?: string
}

export const ASSET_DIMENSIONS: Record<AssetType, { width: number; height: number }> = {
  hero_banner: { width: 1600, height: 900 },
  promo_tile: { width: 800, height: 800 },
  app_listing_frame: { width: 1200, height: 630 },
}

export const ASSET_LABELS: Record<AssetType, string> = {
  hero_banner: 'Hero Banner',
  promo_tile: 'Promo Tile',
  app_listing_frame: 'App Listing Frame',
}

export const THEME_COLORS: Record<Theme, { bg: string; text: string; accent: string }> = {
  dark: { bg: '#0f0f1a', text: '#ffffff', accent: '#58C4DD' },
  light: { bg: '#ffffff', text: '#1a1a2e', accent: '#2563eb' },
  auto: { bg: '#0f0f1a', text: '#ffffff', accent: '#58C4DD' },
}
