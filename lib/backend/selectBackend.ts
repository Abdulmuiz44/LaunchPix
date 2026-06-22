/**
 * Backend selector for LaunchPix.
 * 
 * Uses LAUNCHPIX_BACKEND env var to select backend.
 * Default: "supabase"
 */

import type { LaunchPixBackend, BackendName } from "./types"
import { createSupabaseAdapter } from "./supabaseAdapter"
import { createStacklaneAdapter } from "./stacklaneAdapter"

let cachedBackend: LaunchPixBackend | null = null

export function getBackend(): LaunchPixBackend {
  if (cachedBackend) return cachedBackend

  const backendName = (process.env.LAUNCHPIX_BACKEND || "supabase") as BackendName

  switch (backendName) {
    case "stacklane": {
      if (!process.env.STACKLANE_PROJECT_URL || !process.env.STACKLANE_ACCESS_TOKEN) {
        throw new Error(
          "Stacklane backend selected but STACKLANE_PROJECT_URL and STACKLANE_ACCESS_TOKEN are not set. " +
          "Set these environment variables or switch to LAUNCHPIX_BACKEND=supabase."
        )
      }
      cachedBackend = createStacklaneAdapter()
      break
    }
    case "supabase":
    default:
      cachedBackend = createSupabaseAdapter()
      break
  }

  return cachedBackend
}

export function getBackendName(): BackendName {
  return (process.env.LAUNCHPIX_BACKEND || "supabase") as BackendName
}

export function resetBackend(): void {
  cachedBackend = null
}
