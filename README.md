# Talocode LaunchPix

**Open-source static launch asset API. Self-host first.**

LaunchPix turns product screenshots into listing frames, promo tiles, and hero banners with deterministic rendering. No AI image generation — honest, reproducible output.

## Quick Start

```bash
# Clone and install
git clone https://github.com/talocode/launchpix.git
cd launchpix
cp .env.example .env.local
npm install

# Apply database migrations (requires Supabase CLI linked)
npx supabase db push --linked

# Start
npm run dev
```

## Self-Host with Docker

```bash
docker compose up -d
```

See [docs/deployment/SELF_HOST.md](docs/deployment/SELF_HOST.md) for VPS, Docker, and reverse proxy setup.

## API

Every `/api/v1/*` request requires:

```
x-launchpix-api-key: <LAUNCHPIX_API_KEY>
Authorization: Bearer <LAUNCHPIX_API_KEY>
```

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/screenshots/upload` | Upload a screenshot (PNG/JPEG/WEBP, 5MB max) |
| POST | `/api/v1/assets/generate` | Generate a launch asset (screenshotUrl or screenshotId) |
| GET | `/api/v1/projects` | List projects |
| POST | `/api/v1/projects` | Create a project |

### Example

```bash
# Upload screenshot
curl -X POST http://localhost:3000/api/v1/screenshots/upload \
  -H "x-launchpix-api-key: YOUR_KEY" \
  -F "file=@screenshot.png"

# Generate hero banner
curl -X POST http://localhost:3000/api/v1/assets/generate \
  -H "x-launchpix-api-key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "My App",
    "tagline": "Ship faster",
    "screenshotUrl": "https://example.com/screenshot.png",
    "assetType": "hero_banner",
    "theme": "dark"
  }'
```

## Deployment

Self-host first. Docker-ready. VPS-ready.

- See [docs/deployment/SELF_HOST.md](docs/deployment/SELF_HOST.md)
- See [docs/deployment/TALOCODE_INFRA.md](docs/deployment/TALOCODE_INFRA.md) for Talocode infrastructure roadmap
- See [render.yaml](render.yaml) for optional Render deployment (community/legacy)

## Backend Options

- `LAUNCHPIX_BACKEND=local` keeps metadata and usage local to LaunchPix and is the safe default
- `LAUNCHPIX_BACKEND=supabase` preserves the existing Supabase-backed adapter path
- `LAUNCHPIX_BACKEND=stacklane` sends customer, usage, asset, and file metadata to Stacklane v0.4.1 over HTTP

## Environment

See `.env.example` for all variables. Key sections:

- **Core**: `NEXT_PUBLIC_APP_URL`, `NEXTAUTH_SECRET`
- **Database/Storage**: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- **Rendering**: `MISTRAL_API_KEY` (optional, for planning)
- **API Auth**: `LAUNCHPIX_API_KEY`
- **Backend**: `LAUNCHPIX_BACKEND`, `LAUNCHPIX_STACKLANE_BASE_URL`, `LAUNCHPIX_STACKLANE_API_KEY`
- **Billing** (optional): `LEMON_SQUEEZY_*`

## Documentation

- [Self-Host Guide](docs/deployment/SELF_HOST.md)
- [Talocode Infra Roadmap](docs/deployment/TALOCODE_INFRA.md)
- [API Authentication](docs/API_AUTHENTICATION.md)
- [Stacklane Backend](docs/STACKLANE_BACKEND.md)

## Talocode Domains

| Domain | Purpose |
|--------|---------|
| [talocode.site](https://talocode.site) | Main site / homepage |
| [docs.talocode.site](https://docs.talocode.site) | Documentation |
| [api.talocode.site](https://api.talocode.site) | API endpoint |
| [dashboard.talocode.site](https://dashboard.talocode.site) | Cloud dashboard |
| [stacklane.talocode.site](https://stacklane.talocode.site) | Stacklane platform |
| [dashboard.talocode.site](https://dashboard.talocode.site) | Dashboard |

## License

MIT

## Support

Open-source Talocode products are built and maintained by Abdulmuiz Adeyemo.

Sponsor the work: https://github.com/sponsors/Abdulmuiz44
