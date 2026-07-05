# Stacklane Backend Adapter

## Status

Stacklane is now a real LaunchPix backend option for customer linkage, usage tracking, asset metadata, and file recording.
Supabase support remains intact.

## Current Backend Responsibilities

| Responsibility | Local | Supabase | Stacklane v0.4.1 |
|----------------|-------|----------|-------------------|
| Screenshot metadata | ✅ | ✅ | ✅ |
| Screenshot lookup | ✅ | ✅ | ✅ |
| Usage events | ✅ | ✅ | ✅ |
| Asset metadata | ✅ | ✅ | ✅ |
| File record upload | ✅ | ✅ | ✅ |
| API customer auth | ❌ | ✅ | ❌ (LaunchPix auth path retained) |
| Credits/billing | ❌ | ✅ | ❌ |

## Configuration

Set `LAUNCHPIX_BACKEND` in `.env.local`:

```
LAUNCHPIX_BACKEND=local       # safe default
LAUNCHPIX_BACKEND=supabase    # existing path
LAUNCHPIX_BACKEND=stacklane   # Stacklane v0.4.1
```

### Stacklane Environment

```
LAUNCHPIX_STACKLANE_BASE_URL=http://localhost:7331
LAUNCHPIX_STACKLANE_API_KEY=
```

## Usage Events Sent To Stacklane

- `launchpix.screenshot.upload`
- `launchpix.asset.generate`
- `launchpix.asset.preview`

Metadata is sanitized before sending. Raw API keys, secrets, and request bodies are not forwarded.

## Asset Metadata Sent To Stacklane

LaunchPix sends:

- `product: launchpix`
- filename
- content type
- size bytes
- screenshot id when available
- dimensions
- template/style family
- generation type
- generated timestamp

## Migration Roadmap

| Version | Milestone |
|---------|-----------|
| v0.1 | Supabase-backed LaunchPix API |
| v0.2 | Backend adapter interface (this release) |
| v0.3 | Stacklane screenshot metadata |
| v0.4 | Stacklane storage/file metadata |
| v0.4.1 | Real Stacklane metadata/usage/file adapter |
| v0.5 | Stacklane auth for API customers |
| v0.6 | Full Stacklane migration |

## Limitations

- API customer authentication still uses the existing LaunchPix auth path
- Screenshot binary uploads still use the current storage path for compatibility
- Stacklane backend requires the Stacklane API to be running when selected
- No billing integration is added here
- No cross-repo imports are used; the adapter is HTTP-only

## What Supabase Still Handles

- File upload storage (screenshots bucket)
- API key/customer authentication
- Google OAuth (if enabled)
- Database migrations

## Testing

Run:

```bash
npx tsx scripts/test-launchpix-stacklane-adapter.mjs
```

This verifies config detection, payload construction, safe error handling, and route integration.
