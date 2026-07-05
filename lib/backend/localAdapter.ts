import * as crypto from "node:crypto"
import * as fs from "node:fs"
import * as path from "node:path"

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

const ROOT = path.join(process.cwd(), ".launchpix", "backend")
const SCREENSHOTS_FILE = path.join(ROOT, "screenshots.json")
const USAGE_FILE = path.join(ROOT, "usage-events.json")
const ASSETS_FILE = path.join(ROOT, "assets.json")
const FILES_DIR = path.join(ROOT, "files")

function ensureRoot() {
  fs.mkdirSync(ROOT, { recursive: true })
  fs.mkdirSync(FILES_DIR, { recursive: true })
}

function readList<T>(filePath: string): T[] {
  ensureRoot()
  if (!fs.existsSync(filePath)) return []
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T[]
}

function writeList<T>(filePath: string, items: T[]) {
  ensureRoot()
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf-8")
}

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function sanitizeFilename(name: string): string {
  return path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "file"
}

export function createLocalAdapter(): LaunchPixBackend {
  return {
    name: "local",

    async health(): Promise<BackendHealth> {
      return {
        ok: true,
        backend: "local",
        message: "Local LaunchPix backend active",
        config: {
          root: fs.existsSync(ROOT) ? "present" : "default"
        }
      }
    },

    async insertScreenshot(input: ScreenshotRecordInput): Promise<ScreenshotRecord> {
      const screenshots = readList<ScreenshotRecord>(SCREENSHOTS_FILE)
      const record: ScreenshotRecord = {
        id: makeId("shot"),
        userId: input.userId,
        storageKey: input.storageKey,
        originalFilename: input.originalFilename,
        mimeType: input.mimeType,
        fileSize: input.fileSize,
        width: input.width,
        height: input.height,
        publicUrl: input.publicUrl,
        createdAt: new Date().toISOString()
      }
      screenshots.push(record)
      writeList(SCREENSHOTS_FILE, screenshots)
      return record
    },

    async getScreenshotById(input: GetScreenshotInput): Promise<ScreenshotRecord | null> {
      const screenshots = readList<ScreenshotRecord>(SCREENSHOTS_FILE)
      return screenshots.find((item) => item.id === input.id && item.userId === input.userId) || null
    },

    async recordUsage(input: UsageInput): Promise<UsageResult> {
      const usage = readList<Record<string, unknown>>(USAGE_FILE)
      const id = makeId("usage")
      usage.push({
        id,
        userId: input.userId,
        apiKeyId: input.apiKeyId,
        projectId: input.projectId,
        action: input.action,
        units: input.units ?? 1,
        metadata: input.metadata || {},
        createdAt: new Date().toISOString()
      })
      writeList(USAGE_FILE, usage)
      return { ok: true, id }
    },

    async recordAssetMetadata(input: AssetMetadataInput) {
      const assets = readList<Record<string, unknown>>(ASSETS_FILE)
      const id = makeId("asset")
      assets.push({ id, ...input, createdAt: new Date().toISOString() })
      writeList(ASSETS_FILE, assets)
      return { ok: true, id }
    },

    async deleteAssetMetadata(id: string) {
      const assets = readList<Record<string, unknown>>(ASSETS_FILE)
      writeList(ASSETS_FILE, assets.filter((item) => item.id !== id))
      return { ok: true }
    },

    async recordStoredFile(input: FileStorageInput) {
      ensureRoot()
      const id = makeId("file")
      const filename = sanitizeFilename(input.filename)
      const storagePath = path.join(FILES_DIR, `${id}-${filename}`)
      const buffer = Buffer.from(input.bytesBase64, "base64")
      const checksum = crypto.createHash("sha256").update(buffer).digest("hex")
      fs.writeFileSync(storagePath, buffer)
      const assets = readList<Record<string, unknown>>(ASSETS_FILE)
      assets.push({
        id,
        userId: input.userId,
        filename,
        contentType: input.contentType,
        sizeBytes: buffer.byteLength,
        storagePath,
        checksum,
        metadata: input.metadata || {},
        createdAt: new Date().toISOString()
      })
      writeList(ASSETS_FILE, assets)
      return { ok: true, id, storagePath }
    }
  }
}
