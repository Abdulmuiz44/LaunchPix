# LaunchPix Master Plan (Source of Truth)

## Product Vision
LaunchPix helps founders and growth teams transform raw screenshots into premium launch visuals that increase listing conversion and product trust.

## Positioning
**Core line:** Turn raw screenshots into polished launch visuals in minutes.

LaunchPix starts extension-first (Chrome/Firefox stores), but the messaging and architecture serve broader SaaS and launch graphics from day one.

## ICP
1. Solo founders launching extensions/SaaS.
2. Micro SaaS teams shipping frequently.
3. Agencies creating launch creative at scale.
4. Early-stage Nigerian builders needing local-first billing.

## MVP Scope
- Auth + dashboard + project scaffolding.
- Template-driven generation system with AI-assisted copy/layout decisions.
- v1 output pack:
  - 5x screenshots (1280x800)
  - 1x promo tile (440x280)
  - 1x hero banner (1400x560)
- PNG + ZIP export.
- Paystack-first billing architecture.

## Out of Scope (v1)
- Freeform drag-and-drop canvas.
- Advanced manual layer editing.
- Video generation.
- Team roles/permissions.
- Marketplace/community template uploads.

## UX Principles
- Conversion over decoration.
- Deterministic output over unpredictable creativity.
- Clear progress states.
- High-trust language and visuals.
- Fast path from upload to export.

## Design System Rules
- Premium, minimal, modern SaaS aesthetic.
- Strong type hierarchy and spacing rhythm.
- Neutral background + strong primary accent.
- Rounded corners (professional, not playful).
- Reusable cards, sections, CTA blocks, badges.
- Dark mode parity for all key surfaces.

## Page Map
- Marketing: Hero, before/after, how it works, asset pack, ICP blocks, conversion rationale, pricing preview, FAQ, final CTA.
- Product: Dashboard overview, projects list, new project, project detail, generate, assets, settings, billing.

## Route Map
- /
- /pricing
- /login
- /dashboard
- /dashboard/projects
- /dashboard/projects/new
- /dashboard/projects/[id]
- /dashboard/projects/[id]/generate
- /dashboard/projects/[id]/assets
- /settings
- /settings/billing

## Database Schema Plan
Core tables:
- `profiles`: maps auth users to product metadata.
- `projects`: project metadata, status, target channel.
- `project_inputs`: uploaded screenshots, style settings, prompts.
- `generation_jobs`: queue/status/error metadata for deterministic rendering.
- `assets`: rendered outputs with dimension/type/storage path.
- `subscriptions`: Paystack subscription status and renewal metadata.
- `usage_events`: track credits and feature usage.

## Generation Pipeline Architecture
1. Ingest raw screenshots + project metadata.
2. AI adapters generate copy options and style directives.
3. Template selector maps project type to approved layout families.
4. Server-side render engine composes deterministic output (Playwright or Sharp backend).
5. Post-process quality checks (dimensions, safe zones, typography constraints).
6. Persist assets to Supabase storage + DB records.
7. Export service bundles PNGs + ZIP package.

## Billing Strategy
- Paystack-first checkout and webhooks.
- NGN-first pricing with global strategy compatibility.
- Plan + usage model architecture to support future expansion.

## Export Strategy
- Individual PNG download per asset.
- One-click ZIP containing all generated assets and naming conventions.
- Future-ready hooks for webp/pdf if required.

## Analytics Events Plan
- `signup_started`, `signup_completed`
- `project_created`
- `screenshots_uploaded`
- `generation_started`, `generation_completed`, `generation_failed`
- `asset_downloaded`, `zip_downloaded`
- `checkout_started`, `checkout_success`, `subscription_renewed`

## Launch Checklist
- Branding and core landing copy finalized.
- Auth and project flows functioning.
- Deterministic rendering for required pack sizes.
- Storage and export paths verified.
- Billing and webhook handling verified.
- Error states and empty states polished.
- Basic analytics events firing.

## Technical Guardrails
- Next.js App Router + TypeScript.
- Tailwind + shadcn/ui component patterns.
- Modular adapters for AI/render/payment providers.
- SSR-friendly architecture.
- Strict type safety and schema validation.
- Avoid UI drift from approved premium design direction.

## Acceptance Criteria by Phase
### Phase 1: Foundation
- Marketing site polished and credible.
- Auth pages and dashboard shell present.
- Core routes implemented.
- Folder architecture aligned with plan.

### Phase 2: Project Intake
- New project flow captures required metadata.
- Upload states and validations implemented.
- Projects list shows draft items and statuses.

### Phase 3: Generation
- Queueing + deterministic rendering engine operational.
- All v1 dimensions generated reliably.
- Retry/failure states and logs exposed.

### Phase 4: Export + Billing
- PNG + ZIP exports stable.
- Paystack subscription lifecycle handled.
- Basic usage limits and analytics instrumentation live.
