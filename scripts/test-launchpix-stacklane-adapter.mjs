#!/usr/bin/env node

let passed = 0
let failed = 0

function assert(condition, label) {
  if (condition) {
    console.log(`  ✓ ${label}`)
    passed += 1
  } else {
    console.log(`  ✗ ${label}`)
    failed += 1
  }
}

async function run() {
  console.log('\n=== LaunchPix Stacklane Adapter Tests ===\n')

  const backend = await import('../lib/backend/stacklaneAdapter.ts')
  const backendConfig = await import('../lib/backend/config.ts')
  const localBackend = await import('../lib/backend/localAdapter.ts')

  console.log('1. Stacklane backend config is detected safely')
  delete process.env.LAUNCHPIX_BACKEND
  delete process.env.LAUNCHPIX_STACKLANE_BASE_URL
  delete process.env.LAUNCHPIX_STACKLANE_API_KEY
  assert(backendConfig.getBackendName() === 'local', 'default backend is local')
  const defaultStatus = backendConfig.getStacklaneConfig()
  assert(defaultStatus.status.baseUrl === 'missing', 'missing Stacklane base URL is reported safely')
  assert(defaultStatus.status.apiKey === 'missing', 'missing Stacklane API key is reported safely')
  assert(localBackend.createLocalAdapter().name === 'local', 'local adapter exists')

  console.log('\n2. Usage event payload is built correctly')
  const usagePayload = backend.buildStacklaneUsagePayload({
    userId: 'usr_1',
    apiKeyId: 'key_1',
    action: 'launchpix.asset.generate',
    units: 2,
    metadata: {
      assetId: 'asset_1',
      screenshotId: 'shot_1',
      contentType: 'image/png',
      sizeBytes: 2048,
      generationType: 'png'
    }
  })
  assert(usagePayload.product === 'launchpix', 'usage payload sets launchpix product')
  assert(usagePayload.action === 'launchpix.asset.generate', 'usage payload preserves action')
  assert(usagePayload.units === 2, 'usage payload preserves units')
  assert(!('apiKey' in usagePayload.metadata), 'usage payload does not expose raw key metadata')

  console.log('\n3. Asset metadata payload is built correctly')
  const assetPayload = backend.buildStacklaneAssetPayload({
    userId: 'usr_1',
    assetId: 'asset_1',
    filename: 'hero.png',
    contentType: 'image/png',
    sizeBytes: 2048,
    publicUrl: 'https://example.com/hero.png',
    metadata: {
      screenshotId: 'shot_1',
      dimensions: { width: 1400, height: 560 },
      template: 'hero_banner',
      generationType: 'png'
    }
  }, 'cust_1')
  assert(assetPayload.product === 'launchpix', 'asset payload sets launchpix product')
  assert(assetPayload.customerId === 'cust_1', 'asset payload includes customer id')
  assert(assetPayload.metadata.screenshotId === 'shot_1', 'asset payload preserves screenshot id')

  console.log('\n4. Stacklane unavailable stays safe when selected explicitly')
  const stacklaneBackend = backend.createStacklaneAdapter()
  const health = await stacklaneBackend.health()
  assert(health.ok === false, 'stacklane health fails safely when config is missing')
  assert(!health.message.includes('sk_lane_'), 'stacklane health message does not expose API key text')

  console.log('\n5. Existing upload/generate behavior still uses backend adapter')
  const fs = await import('node:fs')
  const uploadRoute = fs.readFileSync('app/api/v1/screenshots/upload/route.ts', 'utf8')
  const generateRoute = fs.readFileSync('app/api/v1/assets/generate/route.ts', 'utf8')
  assert(uploadRoute.includes('backend.insertScreenshot'), 'upload route still calls backend insertScreenshot')
  assert(uploadRoute.includes('backend.recordUsage'), 'upload route records usage via backend')
  assert(generateRoute.includes('backend.recordAssetMetadata'), 'generate route records asset metadata via backend')
  assert(generateRoute.includes('backend.recordUsage'), 'generate route records usage via backend')

  console.log('\n6. No raw API key appears in routes or docs')
  const stacklaneAdapterSource = fs.readFileSync('lib/backend/stacklaneAdapter.ts', 'utf8')
  const docs = fs.readFileSync('docs/STACKLANE_BACKEND.md', 'utf8')
  assert(!stacklaneAdapterSource.includes('console.log('), 'adapter does not log secrets')
  assert(!docs.includes('sk_lane_live_actual'), 'docs do not contain raw real keys')

  console.log('\n7. Health route shows stacklane present/missing only')
  const healthRoute = fs.readFileSync('app/api/health/route.ts', 'utf8')
  assert(healthRoute.includes('stacklane'), 'health route exposes stacklane block')
  assert(healthRoute.includes('getBackendConfigStatus'), 'health route uses backend config status helper')

  console.log('\n8. Existing LaunchPix tests and Supabase path remain')
  assert(fs.existsSync('scripts/test-launchpix-api.mjs'), 'existing API tests still exist')
  assert(fs.existsSync('scripts/test-launchpix-upload.mjs'), 'existing upload tests still exist')
  assert(fs.existsSync('lib/backend/supabaseAdapter.ts'), 'supabase adapter remains present')

  console.log('\n9. No cross-repo import')
  assert(!stacklaneAdapterSource.includes('/workspace/projects/Stacklane'), 'adapter does not reference Stacklane repo path directly')
  assert(!stacklaneAdapterSource.includes('/root/projects/Stacklane'), 'adapter does not reference root Stacklane repo path directly')

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
  process.exit(failed > 0 ? 1 : 0)
}

run().catch((error) => {
  console.error(error instanceof Error ? error.stack : error)
  process.exit(1)
})
