/**
 * LaunchPix Backend Adapter Interface
 * 
 * Common interface for local, Supabase, and Stacklane backend adapters.
 */

export type BackendName = 'local' | 'supabase' | 'stacklane'

export type ConfigSignal = 'present' | 'missing' | 'default'

export interface BackendHealth {
  ok: boolean
  backend: BackendName
  message: string
  config?: Record<string, ConfigSignal>
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
  apiKeyId?: string
  projectId?: string
  action: string
  units?: number
  metadata?: Record<string, unknown>
}

export interface UsageResult {
  ok: boolean
  id?: string
  error?: string
}

export interface AssetMetadataInput {
  userId: string
  assetId?: string
  filename: string
  contentType: string
  sizeBytes: number
  publicUrl?: string
  checksum?: string
  metadata?: Record<string, unknown>
}

export interface FileStorageInput {
  userId: string
  filename: string
  contentType: string
  bytesBase64: string
  metadata?: Record<string, unknown>
}

export interface LaunchPixBackend {
  name: BackendName
  health(): Promise<BackendHealth>
  insertScreenshot(input: ScreenshotRecordInput): Promise<ScreenshotRecord>
  getScreenshotById(input: GetScreenshotInput): Promise<ScreenshotRecord | null>
  recordUsage(input: UsageInput): Promise<UsageResult>
  recordAssetMetadata?(input: AssetMetadataInput): Promise<{ ok: boolean; id?: string; error?: string }>
  deleteAssetMetadata?(id: string): Promise<{ ok: boolean; error?: string }>
  recordStoredFile?(input: FileStorageInput): Promise<{ ok: boolean; id?: string; storagePath?: string; error?: string }>
}
