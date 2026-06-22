#!/usr/bin/env node

/**
 * Supabase setup script for LaunchPix screenshots feature.
 *
 * Usage:
 *   npm run supabase:setup
 *
 * Required env:
 *   SUPABASE_ACCESS_TOKEN — Supabase CLI access token
 *   SUPABASE_PROJECT_REF  — Supabase project reference ID
 *
 * Optional env:
 *   SUPABASE_DB_PASSWORD  — Database password (may be required by `supabase link`)
 *   STORAGE_BUCKET_SCREENSHOTS — Bucket name (default: "screenshots")
 *
 * This script:
 *   - Verifies required env vars
 *   - Links to Supabase project if not already linked
 *   - Pushes database migrations
 *   - Reports success or failure
 *
 * This script does NOT:
 *   - Print tokens or secrets
 *   - Run destructive reset commands
 *   - Modify production data
 */

import { execSync } from 'child_process';

const token = process.env.SUPABASE_ACCESS_TOKEN;
const projectRef = process.env.SUPABASE_PROJECT_REF;

function fail(msg) {
  console.error(`\n❌ ${msg}\n`);
  process.exit(1);
}

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: 'pipe', ...opts });
  } catch (err) {
    const stderr = err.stderr || '';
    const stdout = err.stdout || '';
    return { error: true, stderr, stdout, status: err.status };
  }
}

console.log('\n=== LaunchPix Supabase Setup ===\n');

// 1. Check env vars
if (!token) {
  fail('SUPABASE_ACCESS_TOKEN is not set. Set it in your environment before running this script.');
}
if (!projectRef) {
  fail('SUPABASE_PROJECT_REF is not set. Set it to your Supabase project reference ID.');
}

console.log('✓ Environment variables configured');
console.log(`  Project ref: ${projectRef}`);

// 2. Check Supabase CLI
const cliCheck = run('supabase --version');
if (cliCheck.error) {
  fail(
    'Supabase CLI is not installed or not in PATH.\n' +
    'Install it: npm install -g supabase\n' +
    'Or: brew install supabase/tap/supabase'
  );
}
console.log(`✓ Supabase CLI available: ${cliCheck.stdout.trim().split('\n')[0]}`);

// 3. Link to project
console.log('\nLinking to Supabase project...');
const linkResult = run('supabase link --project-ref ' + projectRef, {
  env: { ...process.env, SUPABASE_ACCESS_TOKEN: token },
});

if (linkResult.error && !String(linkResult.stderr || '').includes('Already linked')) {
  const stderr = String(linkResult.stderr || linkResult.stdout || '');
  if (stderr.includes('token') || stderr.includes('auth')) {
    fail(`Link failed — token may be invalid. Do not print token details.`);
  }
  fail(`Link failed: ${stderr.slice(0, 200)}`);
}

console.log('✓ Project linked');

// 4. Push migrations
console.log('\nPushing database migrations...');
const pushResult = run('supabase db push', {
  env: { ...process.env, SUPABASE_ACCESS_TOKEN: token },
});

if (pushResult.error) {
  const stderr = String(pushResult.stderr || pushResult.stdout || '');
  if (stderr.includes('password')) {
    fail(
      'Migration push may require SUPABASE_DB_PASSWORD.\n' +
      'Set it in your environment and retry.'
    );
  }
  fail(`Migration push failed: ${stderr.slice(0, 300)}`);
}

console.log('✓ Migrations pushed');

// 5. Verify bucket
const bucketName = process.env.STORAGE_BUCKET_SCREENSHOTS || 'screenshots';
console.log(`\nBucket "${bucketName}" should exist after migration.`);
console.log('  Check: supabase storage ls');

console.log('\n=== Setup Complete ===');
console.log(`\nNext steps:`);
console.log(`  1. Verify bucket exists: supabase storage ls`);
console.log(`  2. Test upload: curl -X POST http://localhost:3000/api/v1/screenshots/upload`);
console.log(`  3. Run tests: node scripts/test-launchpix-upload.mjs`);
console.log('');
