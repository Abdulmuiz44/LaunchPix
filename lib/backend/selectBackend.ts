/**
 * Backend selector for LaunchPix.
 * 
 * Uses LAUNCHPIX_BACKEND env var to select backend.
 * Default: "local"
 */

import type { LaunchPixBackend, BackendName } from "./types"
import { getBackendName as resolveBackendName, getStacklaneConfig } from "./config"
import { createLocalAdapter } from "./localAdapter"
import { createSupabaseAdapter } from "./supabaseAdapter"
import { createStacklaneAdapter } from "./stacklaneAdapter"

let cachedBackend: LaunchPixBackend | null = null

export function getBackend(): LaunchPixBackend {
  if (cachedBackend) return cachedBackend

  const backendName = resolveBackendName()

  switch (backendName) {
    case "stacklane": {
      cachedBackend = createStacklaneAdapter()
      break
    }
    case "local":
      cachedBackend = createLocalAdapter()
      break
    case "supabase":
    default:
      cachedBackend = createSupabaseAdapter()
      break
  }

  return cachedBackend
}

export function getBackendName(): BackendName {
  return resolveBackendName()
}

export function getBackendConfigStatus() {
  const backend = getBackendName()
  const stacklane = getStacklaneConfig()
  return {
    backend,
    stacklane: stacklane.status,
  }
}

export function resetBackend(): void {
  cachedBackend = null
}
