#!/usr/bin/env node

/**
 * LaunchPix Supabase setup tests.
 * Run: node scripts/test-launchpix-supabase-setup.mjs
 */

import * as fs from 'fs'
import * as path from 'path'

let passed = 0
let failed = 0

function assert(condition, label) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.log(`  ✗ ${label}`); failed++; }
}

console.log('\n=== LaunchPix Supabase Setup Tests ===\n')

// Test 1: Migration file exists
console.log('1. Migration File')
const migrationPath = 'supabase/migrations/0008_screenshots_table.sql'
assert(fs.existsSync(migrationPath), 'Migration file exists')
const migration = fs.readFileSync(migrationPath, 'utf-8')

// Test 2: Screenshots table
console.log('\n2. Screenshots Table')
assert(migration.includes('create table if not exists public.screenshots'), 'Creates screenshots table')
assert(migration.includes('id uuid primary key'), 'Has UUID primary key')
assert(migration.includes('user_id text not null'), 'Has user_id column')
assert(migration.includes('storage_key text not null'), 'Has storage_key column')
assert(migration.includes('public_url text'), 'Has public_url column')
assert(migration.includes('mime_type text not null'), 'Has mime_type column')
assert(migration.includes('size_bytes integer not null'), 'Has size_bytes column')
assert(migration.includes('created_at timestamptz'), 'Has created_at')

// Test 3: Indexes
console.log('\n3. Indexes')
assert(migration.includes('idx_screenshots_user_id'), 'Has user_id index')
assert(migration.includes('idx_screenshots_customer_id'), 'Has customer_id index')
assert(migration.includes('idx_screenshots_created_at'), 'Has created_at index')
assert(migration.includes('unique index'), 'Has unique index on storage key')

// Test 4: Trigger
console.log('\n4. Trigger')
assert(migration.includes('trg_screenshots_updated_at'), 'Has updated_at trigger')
assert(migration.includes('set_updated_at'), 'Uses existing set_updated_at function')

// Test 5: Storage bucket
console.log('\n5. Storage Bucket')
assert(migration.includes('storage.buckets'), 'Creates storage bucket')
assert(migration.includes("'screenshots'"), 'Bucket name is screenshots')
assert(migration.includes('5242880'), 'File size limit is 5MB')
assert(migration.includes('image/png'), 'Allows PNG')
assert(migration.includes('image/jpeg'), 'Allows JPEG')
assert(migration.includes('image/webp'), 'Allows WEBP')
assert(migration.includes('on conflict'), 'Uses upsert for bucket')

// Test 6: Storage policies
console.log('\n6. Storage Policies')
assert(migration.includes('storage.objects'), 'Has storage policies')
assert(migration.includes('Public read'), 'Has public read policy')
assert(migration.includes('Service role can upload'), 'Has upload policy')

// Test 7: RLS
console.log('\n7. RLS')
assert(migration.includes('enable row level security'), 'Enables RLS')
assert(migration.includes('Users can view own screenshots'), 'Has select policy')
assert(migration.includes('Users can insert own screenshots'), 'Has insert policy')
assert(migration.includes('Users can delete own screenshots'), 'Has delete policy')

// Test 8: Setup script
console.log('\n8. Setup Script')
assert(fs.existsSync('scripts/setup-supabase.mjs'), 'Setup script exists')
const setupScript = fs.readFileSync('scripts/setup-supabase.mjs', 'utf-8')
assert(setupScript.includes('SUPABASE_ACCESS_TOKEN'), 'Requires SUPABASE_ACCESS_TOKEN')
assert(setupScript.includes('SUPABASE_PROJECT_REF'), 'Requires SUPABASE_PROJECT_REF')
assert(setupScript.includes('supabase link'), 'Links to project')
assert(setupScript.includes('supabase db push'), 'Pushes migrations')
assert(!setupScript.includes('supabase db reset'), 'Does not run destructive reset')
assert(setupScript.includes('token'), 'References token env var')
assert(!setupScript.includes('console.log(token)'), 'Does not print token')

// Test 9: Package.json updated
console.log('\n9. Package.json')
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
assert(pkg.scripts['supabase:setup'], 'Has supabase:setup script')
assert(pkg.scripts['supabase:setup'].includes('setup-supabase'), 'Script runs setup file')

// Test 10: .env.example updated
console.log('\n10. Environment Config')
const envExample = fs.readFileSync('.env.example', 'utf-8')
assert(envExample.includes('STORAGE_BUCKET_SCREENSHOTS'), 'Has STORAGE_BUCKET_SCREENSHOTS')
assert(envExample.includes('SUPABASE_ACCESS_TOKEN'), 'Has SUPABASE_ACCESS_TOKEN')
assert(envExample.includes('SUPABASE_PROJECT_REF'), 'Has SUPABASE_PROJECT_REF')

// Test 11: Upload route uses bucket env
console.log('\n11. Upload Route')
const uploadRoute = fs.readFileSync('app/api/v1/screenshots/upload/route.ts', 'utf-8')
assert(uploadRoute.includes('STORAGE_BUCKET_SCREENSHOTS'), 'Upload route uses STORAGE_BUCKET_SCREENSHOTS env')
assert(uploadRoute.includes('screenshots'), 'Upload route defaults to screenshots bucket')

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
process.exit(failed > 0 ? 1 : 0)
