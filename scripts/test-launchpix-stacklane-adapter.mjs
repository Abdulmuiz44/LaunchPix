#!/usr/bin/env node

/**
 * LaunchPix Stacklane adapter tests.
 * Run: node scripts/test-launchpix-stacklane-adapter.mjs
 */

import * as fs from 'fs'

let passed = 0
let failed = 0

function assert(condition, label) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.log(`  ✗ ${label}`); failed++; }
}

console.log('\n=== LaunchPix Stacklane Adapter Tests ===\n')

// Test 1: Backend adapter files exist
console.log('1. Adapter Files')
assert(fs.existsSync('lib/backend/types.ts'), 'types.ts exists')
assert(fs.existsSync('lib/backend/index.ts'), 'index.ts exists')
assert(fs.existsSync('lib/backend/supabaseAdapter.ts'), 'supabaseAdapter.ts exists')
assert(fs.existsSync('lib/backend/stacklaneAdapter.ts'), 'stacklaneAdapter.ts exists')
assert(fs.existsSync('lib/backend/selectBackend.ts'), 'selectBackend.ts exists')

// Test 2: Backend interface
console.log('\n2. Backend Interface')
const types = fs.readFileSync('lib/backend/types.ts', 'utf-8')
assert(types.includes('LaunchPixBackend'), 'Has LaunchPixBackend interface')
assert(types.includes('health()'), 'Has health method')
assert(types.includes('insertScreenshot'), 'Has insertScreenshot')
assert(types.includes('getScreenshotById'), 'Has getScreenshotById')
assert(types.includes('recordUsage'), 'Has recordUsage')
assert(types.includes('supabase'), 'Has supabase backend name')
assert(types.includes('stacklane'), 'Has stacklane backend name')

// Test 3: Backend selector
console.log('\n3. Backend Selector')
const selector = fs.readFileSync('lib/backend/selectBackend.ts', 'utf-8')
assert(selector.includes('LAUNCHPIX_BACKEND'), 'Uses LAUNCHPIX_BACKEND env')
assert(selector.includes('supabase'), 'Defaults to supabase')
assert(selector.includes('stacklane'), 'Supports stacklane')
assert(selector.includes('STACKLANE_PROJECT_URL'), 'Checks Stacklane env')
assert(selector.includes('STACKLANE_ACCESS_TOKEN'), 'Checks Stacklane token')

// Test 4: Supabase adapter
console.log('\n4. Supabase Adapter')
const supaAdapter = fs.readFileSync('lib/backend/supabaseAdapter.ts', 'utf-8')
assert(supaAdapter.includes('createSupabaseServerClient'), 'Uses Supabase client')
assert(supaAdapter.includes('screenshots'), 'Accesses screenshots table')
assert(supaAdapter.includes('usage_events'), 'Records usage events')

// Test 5: Stacklane adapter
console.log('\n5. Stacklane Adapter')
const stackAdapter = fs.readFileSync('lib/backend/stacklaneAdapter.ts', 'utf-8')
assert(stackAdapter.includes('STACKLANE_PROJECT_URL'), 'Uses Stacklane URL')
assert(stackAdapter.includes('STACKLANE_ACCESS_TOKEN'), 'Uses Stacklane token')
assert(stackAdapter.includes('health'), 'Has health check')
assert(stackAdapter.includes('insertScreenshot'), 'Has screenshot insert')
assert(stackAdapter.includes('getScreenshotById'), 'Has screenshot lookup')
assert(stackAdapter.includes('recordUsage'), 'Has usage recording')
assert(stackAdapter.includes('Stacklane not configured'), 'Safe error for missing config')

// Test 6: Upload route uses backend adapter
console.log('\n6. Upload Route Integration')
const uploadRoute = fs.readFileSync('app/api/v1/screenshots/upload/route.ts', 'utf-8')
assert(uploadRoute.includes('getBackend'), 'Upload uses backend adapter')
assert(uploadRoute.includes('backend.insertScreenshot'), 'Upload calls backend insertScreenshot')
assert(uploadRoute.includes('backend.name'), 'Upload uses backend name for storageMode')

// Test 7: Generate route uses backend adapter
console.log('\n7. Generate Route Integration')
const genRoute = fs.readFileSync('app/api/v1/assets/generate/route.ts', 'utf-8')
assert(genRoute.includes('getBackend'), 'Generate uses backend adapter')
assert(genRoute.includes('backend.getScreenshotById'), 'Generate calls backend screenshot lookup')

// Test 8: .env.example updated
console.log('\n8. Environment Config')
const env = fs.readFileSync('.env.example', 'utf-8')
assert(env.includes('LAUNCHPIX_BACKEND'), 'Has LAUNCHPIX_BACKEND')
assert(env.includes('STACKLANE_PROJECT_URL'), 'Has STACKLANE_PROJECT_URL')
assert(env.includes('STACKLANE_ACCESS_TOKEN'), 'Has STACKLANE_ACCESS_TOKEN')
assert(env.includes('STACKLANE_PROJECT_ID'), 'Has STACKLANE_PROJECT_ID')

// Test 9: Stacklane adapter does not fake auth
console.log('\n9. No Fake Auth')
assert(!stackAdapter.includes('authenticateApiCustomer'), 'Stacklane does not fake customer auth')
assert(stackAdapter.includes('experimental') || stackAdapter.includes('v0.1'), 'Stacklane adapter documents as experimental')

// Test 10: Docs exist
console.log('\n10. Docs')
assert(fs.existsSync('docs/STACKLANE_BACKEND.md'), 'Stacklane backend doc exists')
const stackDocs = fs.readFileSync('docs/STACKLANE_BACKEND.md', 'utf-8')
assert(stackDocs.includes('experimental'), 'Doc states experimental')
assert(stackDocs.includes('Supabase'), 'Doc mentions Supabase as default')
assert(stackDocs.includes('Stacklane'), 'Doc mentions Stacklane')

// Test 11: No secrets
console.log('\n11. No Secrets')
assert(!supaAdapter.includes('sk_live'), 'No raw tokens')
assert(!stackAdapter.includes('sk_live'), 'No raw tokens')

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
process.exit(failed > 0 ? 1 : 0)
