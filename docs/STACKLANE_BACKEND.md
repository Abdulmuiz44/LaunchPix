# Stacklane Backend Adapter

## Status

**Experimental.** Stacklane support is not yet complete. Supabase remains the default backend.

## Current Backend Responsibilities

| Responsibility | Supabase | Stacklane v0.1 |
|----------------|----------|----------------|
| File storage | ✅ | ❌ (still Supabase) |
| Screenshot metadata | ✅ | ✅ |
| Screenshot lookup | ✅ | ✅ |
| Usage events | ✅ | ✅ |
| API customer auth | ✅ | ❌ (still Supabase) |
| Credits/billing | ✅ | ❌ |

## Configuration

Set `LAUNCHPIX_BACKEND` in `.env.local`:

```
LAUNCHPIX_BACKEND=supabase    # default
LAUNCHPIX_BACKEND=stacklane   # experimental
```

### Stacklane Environment

```
STACKLANE_PROJECT_URL=http://localhost:4321
STACKLANE_ACCESS_TOKEN=sk_lane_live_...
STACKLANE_PROJECT_ID=proj_xxx
```

## Migration Roadmap

| Version | Milestone |
|---------|-----------|
| v0.1 | Supabase-backed LaunchPix API |
| v0.2 | Backend adapter interface (this release) |
| v0.3 | Stacklane screenshot metadata |
| v0.4 | Stacklane storage/file metadata |
| v0.5 | Stacklane auth for API customers |
| v0.6 | Full Stacklane migration |

## Limitations (Stacklane Adapter v0.1)

- API customer authentication still requires Supabase
- File storage still uses Supabase
- Stacklane health check requires Stacklane server to be running
- No automatic Stacklane project creation
- Hybrid mode not yet implemented

## What Supabase Still Handles

- File upload storage (screenshots bucket)
- API key/customer authentication
- Google OAuth (if enabled)
- Database migrations
