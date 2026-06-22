# Talocode Infrastructure Roadmap

## Current State

LaunchPix currently uses Supabase for:
- PostgreSQL database
- Storage (screenshot uploads)
- Auth (optional Google OAuth)

This is a **temporary adapter pattern**, not a permanent dependency.

## Roadmap

| Version | Milestone | Backend |
|---------|-----------|---------|
| v0.1 | LaunchPix API + Supabase-backed | Supabase |
| v0.2 | Self-host Docker runtime | Supabase (local) |
| v0.3 | Stacklane adapter for metadata/API keys | Stacklane |
| v0.4 | Stacklane storage/file metadata | Stacklane |
| v0.5 | Talocode API gateway + usage billing | Talocode infra |

## Why Stacklane

Stacklane is Talocode's open-source lightweight backend/database layer. As Stacklane matures, LaunchPix will migrate from Supabase to Stacklane for:

- API key management
- Project metadata
- Credit/usage tracking
- Connection storage
- Audit logging

## Migration Principles

1. **No lock-in** — external services are adapters, not dependencies
2. **Self-host first** — always runnable without hosted services
3. **Gradual migration** — one subsystem at a time
4. **Open source** — all adapters are open source

## No Render Dependency

Render was previously used but is no longer the default deployment target. LaunchPix is self-host first with Docker and VPS support.

## What We Control

- API design and contracts
- Rendering engine
- Credit/usage logic
- Auth boundaries
- Self-host runtime

## What We Don't Control (Yet)

- Database hosting (currently Supabase, migrating to Stacklane)
- Object storage (currently Supabase, migrating to Stacklane)
- Payment processing (Lemon Squeezy, replaceable)
- Email (Resend, replaceable)
