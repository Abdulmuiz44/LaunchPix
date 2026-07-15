/**
 * Supabase backend adapter for LaunchPix.
 * Wraps existing Supabase logic behind the backend interface.
 */

import { createSupabaseServerClient } from "@/lib/supabase/server"
import type {
  LaunchPixBackend,
  BackendHealth,
  ScreenshotRecordInput,
  ScreenshotRecord,
  GetScreenshotInput,
  UsageInput,
  UsageResult,
} from "./types"

export function createSupabaseAdapter(): LaunchPixBackend {
  return {
    name: "supabase",

    async health(): Promise<BackendHealth> {
      try {
        const supabase = await createSupabaseServerClient()
        const { error } = await supabase.from("screenshots").select("id").limit(1)
        return {
          ok: !error,
          backend: "supabase",
          message: error ? `Supabase error: ${error.message}` : "Supabase connected",
        }
      } catch (err) {
        return {
          ok: false,
          backend: "supabase",
          message: `Supabase health check failed: ${err instanceof Error ? err.message : "unknown"}`,
        }
      }
    },

    async insertScreenshot(input: ScreenshotRecordInput): Promise<ScreenshotRecord> {
      const supabase = await createSupabaseServerClient()
      const { data, error } = await supabase
        .from("screenshots")
        .insert({
          user_id: input.userId,
          storage_key: input.storageKey,
          original_filename: input.originalFilename,
          mime_type: input.mimeType,
          file_size: input.fileSize,
          width: input.width,
          height: input.height,
          public_url: input.publicUrl,
        })
        .select("id, user_id, storage_key, original_filename, mime_type, file_size, width, height, public_url, created_at")
        .single()

      if (error || !data) {
        throw new Error(error?.message || "Failed to insert screenshot")
      }

      return {
        id: data.id,
        userId: data.user_id,
        storageKey: data.storage_key,
        originalFilename: data.original_filename,
        mimeType: data.mime_type,
        fileSize: data.file_size,
        width: data.width,
        height: data.height,
        publicUrl: data.public_url,
        createdAt: data.created_at,
      }
    },

    async getScreenshotById(input: GetScreenshotInput): Promise<ScreenshotRecord | null> {
      const supabase = await createSupabaseServerClient()
      const { data, error } = await supabase
        .from("screenshots")
        .select("id, user_id, storage_key, original_filename, mime_type, file_size, width, height, public_url, created_at")
        .eq("id", input.id)
        .eq("user_id", input.userId)
        .single()

      if (error || !data) return null

      return {
        id: data.id,
        userId: data.user_id,
        storageKey: data.storage_key,
        originalFilename: data.original_filename,
        mimeType: data.mime_type,
        fileSize: data.file_size,
        width: data.width,
        height: data.height,
        publicUrl: data.public_url,
        createdAt: data.created_at,
      }
    },

    async recordUsage(input: UsageInput): Promise<UsageResult> {
      try {
        const supabase = await createSupabaseServerClient()
        const { error } = await supabase.from("usage_events").insert({
          user_id: input.userId,
          event_type: input.action,
          metadata_json: input.metadata || {},
          occurred_at: new Date().toISOString(),
        })
        if (error) return { ok: false, error: error.message }
        return { ok: true }
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : "unknown" }
      }
    },
  }
}
