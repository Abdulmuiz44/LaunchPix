# LaunchPix

LaunchPix is a Mistral-assisted, deterministic asset generator for product launches.
It turns raw screenshots into polished listing visuals, promo tiles, and hero banners.

## Tech stack
- Next.js App Router + TypeScript
- Tailwind CSS + reusable UI primitives
- Supabase (Auth, Postgres, Storage)
- Mistral (structured planning only)
- Deterministic SVG -> PNG rendering (`@resvg/resvg-js`)
- Paystack-first billing and verification

## Core product flow
1. Sign in
2. Create project and upload screenshots
3. Generate structured asset plan via Mistral
4. Render deterministic asset pack (5 listing + promo + hero)
5. Preview/download assets based on plan access

## Pricing model implemented
- Free: 3 credits, watermarked preview exports, no full ZIP
- Launch Pack: one-time, 15 credits
- Starter: monthly, 25 credits
- Pro: monthly, 80 credits + priority flag

## Required environment variables
See `.env.example`.
Minimum required:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MISTRAL_API_KEY`
- `MISTRAL_MODEL_VISION`
- `MISTRAL_MODEL_TEXT`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_PUBLIC_KEY`
- `PAYSTACK_WEBHOOK_SECRET`

## Local setup
1. Copy env:
   - `cp .env.example .env.local`
2. Install dependencies:
   - `npm install`
3. Run database migrations in Supabase SQL editor (`supabase/migrations/*` in order).
4. Start dev server:
   - `npm run dev`

## Supabase notes
- Enable email auth.
- Ensure storage buckets exist:
  - `project-uploads-raw`
  - `project-uploads-normalized`
  - `launchpix-assets`
- Apply RLS policies from migrations.

## Mistral notes
- Mistral is used for structured product/copy/layout planning.
- Rendering remains deterministic and template-driven.
- Default model: `mistral-small-2506` (configurable via env).

## Paystack notes
- Checkout init: `POST /api/billing/checkout`
- Verification: `POST /api/billing/verify`
- Webhook: `POST /api/billing/webhook`
- Configure Paystack webhook URL to point to `/api/billing/webhook`.

## Commands
- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Deployment notes
- Set all env vars in hosting provider.
- Use HTTPS and production callback URLs for Paystack.
- Confirm webhook signature secret matches deployment env.

## Known MVP constraints
- Rate limiting is lightweight (in-memory).
- Subscription renewal automation is structured but minimal.
- Visual templates are production-capable baseline and can be expanded further.
