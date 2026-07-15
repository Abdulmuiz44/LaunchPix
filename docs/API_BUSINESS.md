# LaunchPix API Business

## Positioning

LaunchPix is an **open-source static launch asset API**. It generates listing frames, promo tiles, and hero banners from product screenshots.

## What It Does

- Upload screenshots (PNG/JPEG/WEBP)
- Generate deterministic launch assets (hero banners, promo tiles, app listing frames)
- SVG rendering available immediately
- PNG rendering via @resvg/resvg-js when available

## What It Doesn't Do

- No AI image generation
- No guaranteed conversion claims
- No hosted database provisioning
- No real-time collaboration

## Business Model

- **Self-host**: Free, open-source, MIT license
- **Hosted API**: Usage-based pricing via API keys and credits
- **Internal use**: Talocode products (Tera, Codra, WorkLane) consume LaunchPix API internally

## API Keys

- Required for all `/api/v1/*` endpoints
- Support `x-launchpix-api-key`, `x-api-key`, `Authorization: Bearer`
- Key management via API or dashboard

## Credits

- Users start with free credits
- One-time credit packs via Lemon Squeezy
- Credits consumed per generation request

## Self-Host vs Hosted

| Feature | Self-Host | Hosted API |
|---------|-----------|------------|
| Cost | Free | Usage-based |
| Storage | Your Supabase | Managed |
| Scaling | Your infra | Managed |
| Support | Community | TBD |
| Customization | Full | API-only |

## Limitations

- No AI image generation (deterministic only)
- No real-time features
- No multi-tenant isolation beyond API keys
- No guaranteed uptime SLA
