import type { BackendName, ConfigSignal } from "./types"

export function getBackendName(): BackendName {
  const value = (process.env.LAUNCHPIX_BACKEND || "local").trim().toLowerCase()
  if (value === "supabase" || value === "stacklane" || value === "local") return value
  return "local"
}

export function getStacklaneConfig() {
  const baseUrl = process.env.LAUNCHPIX_STACKLANE_BASE_URL || process.env.STACKLANE_PROJECT_URL || ""
  const apiKey = process.env.LAUNCHPIX_STACKLANE_API_KEY || process.env.STACKLANE_ACCESS_TOKEN || ""

  return {
    baseUrl,
    apiKey,
    status: {
      baseUrl: baseUrl ? "present" : "missing",
      apiKey: apiKey ? "present" : "missing",
    } satisfies Record<string, ConfigSignal>,
  }
}
