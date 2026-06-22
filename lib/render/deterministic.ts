/**
 * Deterministic SVG renderer for LaunchPix assets.
 * 
 * Generates premium launch visuals without AI image generation.
 * Uses clean typography, device mockups, and brand color accents.
 */

import type { AssetType, Theme } from '../launch/types'
import { ASSET_DIMENSIONS, THEME_COLORS } from '../launch/types'

interface RenderInput {
  productName: string
  tagline: string
  screenshotUrl: string
  assetType: AssetType
  theme: Theme
  brandColor?: string
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function getThemeColors(theme: Theme, brandColor?: string) {
  const base = THEME_COLORS[theme === 'auto' ? 'dark' : theme]
  return {
    bg: base.bg,
    text: base.text,
    accent: brandColor || base.accent,
  }
}

function renderDeviceMockup(screenshotUrl: string, width: number, height: number, accent: string): string {
  const mockupW = Math.round(width * 0.72)
  const mockupH = Math.round(mockupW * 0.62)
  const mockupX = (width - mockupW) / 2
  const mockupY = (height - mockupH) / 2 - 20

  return `
    <defs>
      <clipPath id="screen-clip">
        <rect x="${mockupX + 8}" y="${mockupY + 32}" width="${mockupW - 16}" height="${mockupH - 40}" rx="4"/>
      </clipPath>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000" flood-opacity="0.35"/>
      </filter>
    </defs>
    <rect x="${mockupX}" y="${mockupY}" width="${mockupW}" height="${mockupH}" rx="12" fill="#1e1e2e" filter="url(#shadow)"/>
    <rect x="${mockupX}" y="${mockupY}" width="${mockupW}" height="28" rx="12" fill="#2a2a3e"/>
    <rect x="${mockupX}" y="${mockupY + 12}" width="8" height="8" rx="4" fill="#ef4444"/>
    <rect x="${mockupX + 14}" y="${mockupY + 12}" width="8" height="8" rx="4" fill="#eab308"/>
    <rect x="${mockupX + 28}" y="${mockupY + 12}" width="8" height="8" rx="4" fill="#22c55e"/>
    <rect x="${mockupX + 8}" y="${mockupY + 32}" width="${mockupW - 16}" height="${mockupH - 40}" rx="4" fill="#0a0a1a"/>
    <image href="${escHtml(screenshotUrl)}" x="${mockupX + 8}" y="${mockupY + 32}" width="${mockupW - 16}" height="${mockupH - 40}" preserveAspectRatio="xMidYMid slice" clip-path="url(#screen-clip)"/>
  `
}

function renderBrowserMockup(screenshotUrl: string, width: number, height: number, accent: string): string {
  const mockupW = Math.round(width * 0.85)
  const mockupH = Math.round(mockupW * 0.65)
  const mockupX = (width - mockupW) / 2
  const mockupY = (height - mockupH) / 2 - 10

  return `
    <defs>
      <clipPath id="browser-clip">
        <rect x="${mockupX + 4}" y="${mockupY + 44}" width="${mockupW - 8}" height="${mockupH - 52}" rx="4"/>
      </clipPath>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#000" flood-opacity="0.4"/>
      </filter>
    </defs>
    <rect x="${mockupX}" y="${mockupY}" width="${mockupW}" height="${mockupH}" rx="10" fill="#1a1a2e" filter="url(#shadow)"/>
    <rect x="${mockupX}" y="${mockupY}" width="${mockupW}" height="36" rx="10" fill="#16213e"/>
    <rect x="${mockupX}" y="${mockupY + 26}" width="${mockupW}" height="10" fill="#16213e"/>
    <circle cx="${mockupX + 18}" cy="${mockupY + 18}" r="5" fill="#ef4444"/>
    <circle cx="${mockupX + 34}" cy="${mockupY + 18}" r="5" fill="#eab308"/>
    <circle cx="${mockupX + 50}" cy="${mockupY + 18}" r="5" fill="#22c55e"/>
    <rect x="${mockupX + 70}" y="${mockupY + 10}" width="${mockupW - 100}" height="16" rx="8" fill="rgba(255,255,255,0.08)"/>
    <rect x="${mockupX + 4}" y="${mockupY + 44}" width="${mockupW - 8}" height="${mockupH - 52}" rx="4" fill="#0a0a1a"/>
    <image href="${escHtml(screenshotUrl)}" x="${mockupX + 4}" y="${mockupY + 44}" width="${mockupW - 8}" height="${mockupH - 52}" preserveAspectRatio="xMidYMid slice" clip-path="url(#browser-clip)"/>
  `
}

function renderCardMockup(screenshotUrl: string, width: number, height: number, accent: string): string {
  const cardW = Math.round(width * 0.6)
  const cardH = Math.round(height * 0.7)
  const cardX = (width - cardW) / 2
  const cardY = (height - cardH) / 2

  return `
    <defs>
      <clipPath id="card-clip">
        <rect x="${cardX + 16}" y="${cardY + 16}" width="${cardW - 32}" height="${cardH - 80}" rx="8"/>
      </clipPath>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000" flood-opacity="0.3"/>
      </filter>
    </defs>
    <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="16" fill="#1a1a2e" filter="url(#shadow)"/>
    <rect x="${cardX + 16}" y="${cardY + 16}" width="${cardW - 32}" height="${cardH - 80}" rx="8" fill="#0a0a1a"/>
    <image href="${escHtml(screenshotUrl)}" x="${cardX + 16}" y="${cardY + 16}" width="${cardW - 32}" height="${cardH - 80}" preserveAspectRatio="xMidYMid slice" clip-path="url(#card-clip)"/>
    <rect x="${cardX + 16}" y="${cardY + cardH - 56}" width="${cardW - 32}" height="40" rx="6" fill="${accent}" opacity="0.15"/>
  `
}

export function renderAssetSvg(input: RenderInput): string {
  const { productName, tagline, screenshotUrl, assetType, theme, brandColor } = input
  const { width, height } = ASSET_DIMENSIONS[assetType]
  const colors = getThemeColors(theme, brandColor)

  const mockup =
    assetType === 'app_listing_frame'
      ? renderBrowserMockup(screenshotUrl, width, height, colors.accent)
      : assetType === 'promo_tile'
        ? renderCardMockup(screenshotUrl, width, height, colors.accent)
        : renderDeviceMockup(screenshotUrl, width, height, colors.accent)

  const headlineY = assetType === 'hero_banner' ? height - 160 : height - 120
  const subY = assetType === 'hero_banner' ? height - 110 : height - 80
  const ctaY = assetType === 'hero_banner' ? height - 60 : height - 40

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" fill="${colors.bg}"/>
  ${mockup}
  <text x="${width / 2}" y="${headlineY}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${assetType === 'hero_banner' ? 42 : 32}" font-weight="700" fill="${colors.text}">${escHtml(productName)}</text>
  <text x="${width / 2}" y="${subY}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${assetType === 'hero_banner' ? 20 : 16}" fill="${colors.text}" opacity="0.7">${escHtml(tagline)}</text>
  <rect x="${width / 2 - 80}" y="${ctaY}" width="160" height="36" rx="18" fill="${colors.accent}"/>
  <text x="${width / 2}" y="${ctaY + 23}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#ffffff">Learn More</text>
</svg>`
}

export function renderAssetPng(input: RenderInput): Buffer | null {
  try {
    const { Resvg } = require('@resvg/resvg-js')
    const svg = renderAssetSvg(input)
    const { width } = ASSET_DIMENSIONS[input.assetType]
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } })
    return Buffer.from(resvg.render().asPng())
  } catch {
    return null
  }
}

export function buildAssetPlan(input: RenderInput) {
  const { width, height } = ASSET_DIMENSIONS[input.assetType]
  const warnings: string[] = []

  if (!input.screenshotUrl.startsWith('https://')) {
    warnings.push('Screenshot URL should use HTTPS for best results.')
  }

  return {
    layout: input.assetType === 'hero_banner' ? 'device-mockup-centered' : input.assetType === 'promo_tile' ? 'card-centered' : 'browser-mockup-centered',
    headline: input.productName,
    subheadline: input.tagline,
    visualTreatment: `deterministic-${input.theme}-theme`,
    cta: 'Learn More',
    width,
    height,
    warnings,
  }
}
