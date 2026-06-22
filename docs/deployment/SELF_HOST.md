# Self-Host LaunchPix

LaunchPix is self-host first. Run it on your own infrastructure.

## Quick Start (Local)

```bash
git clone https://github.com/talocode/launchpix.git
cd launchpix
cp .env.example .env.local
# Edit .env.local with your credentials
npm install
npm run dev
```

## Docker

```bash
docker compose up -d
```

This starts:
- LaunchPix app on port 3000
- PostgreSQL on port 5432

Edit `docker-compose.yml` environment or use `.env.local`.

## VPS Deployment

1. Install Node.js 20+ and PostgreSQL
2. Clone repo and install dependencies
3. Set environment variables
4. Run: `npm run build && npm start`
5. Use Caddy or Nginx as reverse proxy

### Caddy Example

```
your-domain.com {
    reverse_proxy localhost:3000
}
```

### Nginx Example

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Required Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | NextAuth session secret |
| `LAUNCHPIX_API_KEY` | Yes | API key for customer auth |
| `MISTRAL_API_KEY` | Optional | For AI-assisted planning |

## Storage Requirement

LaunchPix uses Supabase Storage for screenshot uploads. You need:

- A Supabase project with Storage enabled
- A `screenshots` bucket (run `npm run supabase:setup` to create it)
- Or migrate to another object storage (S3, MinIO) with adapter changes

## Security Checklist

- [ ] HTTPS enabled (required for OAuth and API auth)
- [ ] `NEXTAUTH_SECRET` is a strong random string
- [ ] `LAUNCHPIX_API_KEY` is strong and not shared publicly
- [ ] Supabase service role key is not exposed to client
- [ ] Database credentials are not in version control
- [ ] `.env.local` is in `.gitignore`
- [ ] Reverse proxy configured with proper headers

## Backup

- Database: `pg_dump` your PostgreSQL database
- Storage: Supabase dashboard → Storage → download bucket
- Config: Keep `.env.local` backed up securely
