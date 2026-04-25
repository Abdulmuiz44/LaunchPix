# LaunchPix Resend Setup

LaunchPix sends transactional emails through the Resend Node SDK at runtime and uses the Resend CLI for setup, domain management, webhook creation, logs, and test sends.

## Environment

Set these locally and in Netlify:

```bash
RESEND_API_KEY=...
RESEND_FROM_EMAIL="LaunchPix <hello@launchpix.app>"
RESEND_DOMAIN=launchpix.app
RESEND_WEBHOOK_SECRET=...
SUPABASE_SERVICE_ROLE_KEY=...
```

`SUPABASE_SERVICE_ROLE_KEY` is required so server-side email automations can resolve a user id to the account email.

## CLI Setup

```bash
npx resend login
npm run resend:setup
```

After the CLI creates the domain, add the DNS records in your domain provider, then verify:

```bash
npx resend domains list
npx resend domains verify <domain_id>
```

Create or inspect webhook configuration:

```bash
npx resend webhooks list
npx resend webhooks get <webhook_id>
```

Use the webhook secret from Resend as `RESEND_WEBHOOK_SECRET`.

## Test Email

```bash
npm run resend:test -- you@example.com
```

## Runtime Automations

The app sends operational emails for:

- Project created
- Screenshots uploaded
- Generation started
- Generation completed
- Generation failed
- Payment confirmed
- Asset downloaded
- ZIP export requested
- Low credits, when emitted as `credits_low`

The source of truth is `lib/email/resend.ts`; templates live in `lib/email/templates.ts`.

The app also sends matching Resend Events through the SDK. That means you can later move specific emails from app-side transactional sends into Resend-hosted Automations without changing LaunchPix business logic.

## Resend Events

Create the event definitions with:

```bash
npm run resend:setup
```

Or manually:

```bash
npx resend events create --name "generation.completed" --schema '{"projectId":"string","projectName":"string","generationId":"string"}'
```

Test an event:

```bash
npx resend events send --event "generation.completed" --email you@example.com --payload '{"projectId":"demo","projectName":"Demo App","generationId":"gen_demo"}'
```

## Resend-hosted Automations

Example automation payloads live in `resend/automations/*.example.json`.

To use them:

1. Create a template with `npx resend templates create ...`.
2. Publish the template with `npx resend templates publish <template_id>`.
3. Replace the placeholder template id in the automation JSON.
4. Create the automation:

```bash
npx resend automations create --file resend/automations/generation-completed.example.json
npx resend automations update <automation_id> --status enabled
```

For the MVP, LaunchPix sends emails directly from the app and emits Resend Events in parallel. This prevents product-critical email from depending on dashboard-hosted automation setup during initial rollout.
