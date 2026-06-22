import { NextResponse } from "next/server"
import { authenticateApiCustomerRequest } from "@/lib/services/api-keys/authenticate-api-key"
import { createSupabaseServerClient } from "@/lib/supabase/server"

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
  try {
    if (file.type === "image/png" || file.type === "image/jpeg") {
      const buffer = Buffer.from(await file.arrayBuffer())
      const dimensions = getImageDimensions(buffer, file.type)
      width = dimensions.width
      height = dimensions.height
    }
  } catch {
    // Dimension extraction is best-effort
  }

  const { data: record, error: dbError } = await supabase
    .from("screenshots")
    .insert({
      user_id: authResult.customer.userId,
      storage_key: storageKey,
      original_filename: filename,
      mime_type: file.type,
      file_size: file.size,
      width,
      height,
      public_url: pub.publicUrl,
    })
    .select("id, storage_key, original_filename, mime_type, file_size, width, height, public_url, created_at")
    .single()

  if (dbError || !record) {
    return NextResponse.json({ ok: false, error: dbError?.message || "Could not save screenshot record." }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    screenshot: {
      id: record.id,
      name: record.original_filename,
      mimeType: record.mime_type,
      sizeBytes: record.file_size,
      width: record.width,
      height: record.height,
      url: record.public_url,
      storageKey: record.storage_key,
      storageMode: "supabase",
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
