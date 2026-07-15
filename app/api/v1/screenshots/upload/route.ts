import { NextResponse } from "next/server"
import { authenticateApiCustomerRequest } from "@/lib/services/api-keys/authenticate-api-key"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getBackend } from "@/lib/backend"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"])
const BUCKET = process.env.STORAGE_BUCKET_SCREENSHOTS || "screenshots"

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 100)
}

function generateStorageKey(userId: string, filename: string): string {
  const id = crypto.randomUUID()
  return `${userId}/${id}-${filename}`
}

export async function POST(request: Request) {
  const authResult = await authenticateApiCustomerRequest(request)
  if ("response" in authResult) return authResult.response

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data." }, { status: 400 })
  }

  const file = form.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Missing 'file' field." }, { status: 400 })
  }

  if (!ACCEPTED_TYPES.has(file.type)) {
    return NextResponse.json(
      { ok: false, error: `Unsupported file type: ${file.type}. Accepted: image/png, image/jpeg, image/webp.` },
      { status: 400 }
    )
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { ok: false, error: `File too large: ${file.size} bytes. Maximum is ${MAX_FILE_SIZE} bytes (5MB).` },
      { status: 413 }
    )
  }

  if (file.size === 0) {
    return NextResponse.json({ ok: false, error: "File is empty." }, { status: 400 })
  }

  const rawFilename = file.name || "screenshot.png"
  const filename = sanitizeFilename(rawFilename) || "screenshot.png"
  const storageKey = generateStorageKey(authResult.customer.userId, filename)

  // File storage still uses Supabase directly
  const supabase = await createSupabaseServerClient()
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storageKey, file, { upsert: false, contentType: file.type })

  if (uploadError) {
    return NextResponse.json({ ok: false, error: `Storage upload failed: ${uploadError.message}` }, { status: 500 })
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(storageKey)

  let width = 0
  let height = 0
  const fileBuffer = Buffer.from(await file.arrayBuffer())
  try {
    if (file.type === "image/png" || file.type === "image/jpeg") {
      const dimensions = getImageDimensions(fileBuffer, file.type)
      width = dimensions.width
      height = dimensions.height
    }
  } catch {
    // Dimension extraction is best-effort
  }

  // Metadata recording uses backend adapter
  const backend = getBackend()
  let record
  try {
    record = await backend.insertScreenshot({
      userId: authResult.customer.userId,
      storageKey,
      originalFilename: filename,
      mimeType: file.type,
      fileSize: file.size,
      width,
      height,
      publicUrl: pub.publicUrl,
    })
    if (backend.recordStoredFile) {
      const stored = await backend.recordStoredFile({
        userId: authResult.customer.userId,
        filename,
        contentType: file.type,
        bytesBase64: fileBuffer.toString("base64"),
        metadata: {
          screenshotId: record.id,
          contentType: file.type,
          sizeBytes: file.size,
          kind: "screenshot_upload",
        },
      })
      if (!stored.ok && backend.name === "stacklane") {
        return NextResponse.json({ ok: false, error: `Failed to record Stacklane file storage: ${stored.error || "unknown"}` }, { status: 502 })
      }
    }
    const usage = await backend.recordUsage({
      userId: authResult.customer.userId,
      apiKeyId: authResult.customer.apiKeyId,
      action: "launchpix.screenshot.upload",
      units: 1,
      metadata: {
        screenshotId: record.id,
        contentType: file.type,
        sizeBytes: file.size,
      },
    })
    if (!usage.ok && backend.name === "stacklane") {
      return NextResponse.json({ ok: false, error: `Failed to record Stacklane usage: ${usage.error || "unknown"}` }, { status: 502 })
    }
  } catch (err) {
    return NextResponse.json({ ok: false, error: `Failed to record screenshot: ${err instanceof Error ? err.message : "unknown"}` }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    screenshot: {
      id: record.id,
      name: record.originalFilename,
      mimeType: record.mimeType,
      sizeBytes: record.fileSize,
      width: record.width,
      height: record.height,
      url: record.publicUrl,
      storageKey: record.storageKey,
      storageMode: backend.name,
    },
  }, { status: 201 })
}

function getImageDimensions(buffer: Buffer, mimeType: string): { width: number; height: number } {
  if (mimeType === "image/png" && buffer[0] === 0x89 && buffer[1] === 0x50) {
    const width = buffer.readUInt32BE(16)
    const height = buffer.readUInt32BE(20)
    return { width, height }
  }
  if (mimeType === "image/jpeg") {
    let offset = 2
    while (offset < buffer.length - 1) {
      if (buffer[offset] === 0xff && buffer[offset + 1] === 0xc0) {
        const height = buffer.readUInt16BE(offset + 5)
        const width = buffer.readUInt16BE(offset + 7)
        return { width, height }
      }
      offset += 2 + buffer.readUInt16BE(offset + 1)
    }
  }
  return { width: 0, height: 0 }
}
