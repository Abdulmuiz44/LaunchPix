/**
 * LaunchPix Backend Adapter Interface
 * 
 * Common interface for Supabase and Stacklane backends.
 * Storage (file upload) remains Supabase-only for now.
 */

export type BackendName = 'supabase' | 'stacklane'

export interface BackendHealth {
  ok: boolean
  backend: BackendName
  message: string
}

export interface ScreenshotRecordInput {
  userId: string
  storageKey: string
  originalFilename: string
  mimeType: string
  fileSize: number
  width: number
  height: number
  publicUrl: string
}

export interface ScreenshotRecord {
  id: string
  userId: string
  storageKey: string
  originalFilename: string
  mimeType: string
  fileSize: number
  width: number
  height: number
  publicUrl: string
  createdAt: string
}

export interface GetScreenshotInput {
  id: string
  userId: string
}

export interface UsageInput {
  userId: string
  projectId?: string
  action: string
  metadata?: Record<string, unknown>
}

export interface UsageResult {
  ok: boolean
  id?: string
  error?: string
}

export interface LaunchPixBackend {
  name: BackendName
  health(): Promise<BackendHealth>
  insertScreenshot(input: ScreenshotRecordInput): Promise<ScreenshotRecord>
  getScreenshotById(input: GetScreenshotInput): Promise<ScreenshotRecord | null>
  recordUsage(input: UsageInput): Promise<UsageResult>
}
