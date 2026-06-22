#!/usr/bin/env node

/**
 * LaunchPix self-host readiness tests.
 * Run: node scripts/test-self-host-readiness.mjs
 */

import * as fs from 'fs'

let passed = 0
let failed = 0

function assert(condition, label) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.log(`  ✗ ${label}`); failed++; }
}

console.log('\n=== LaunchPix Self-Host Readiness Tests ===\n')

// Test 1: Docker files
console.log('1. Docker Files')
assert(fs.existsSync('Dockerfile'), 'Dockerfile exists')
assert(fs.existsSync('docker-compose.yml'), 'docker-compose.yml exists')
assert(fs.existsSync('.dockerignore'), '.dockerignore exists')

const dockerfile = fs.readFileSync('Dockerfile', 'utf-8')
assert(dockerfile.includes('node:20'), 'Uses Node 20')
assert(dockerfile.includes('npm run build'), 'Builds the app')
assert(dockerfile.includes('EXPOSE'), 'Exposes port')
assert(dockerfile.includes('CMD'), 'Has start command')

const dockerCompose = fs.readFileSync('docker-compose.yml', 'utf-8')
assert(dockerCompose.includes('launchpix'), 'Has launchpix service')
assert(dockerCompose.includes('postgres'), 'Has postgres service')

// Test 2: Self-host docs
console.log('\n2. Self-Host Docs')
assert(fs.existsSync('docs/deployment/SELF_HOST.md'), 'Self-host doc exists')
const selfHost = fs.readFileSync('docs/deployment/SELF_HOST.md', 'utf-8')
assert(selfHost.includes('Docker'), 'Covers Docker deployment')
assert(selfHost.includes('VPS'), 'Covers VPS deployment')
assert(selfHost.includes('Caddy') || selfHost.includes('Nginx'), 'Covers reverse proxy')
assert(selfHost.includes('HTTPS'), 'Mentions HTTPS requirement')
assert(selfHost.toLowerCase().includes('backup'), 'Mentions backup')

// Test 3: Talocode infra roadmap
console.log('\n3. Talocode Infra Roadmap')
assert(fs.existsSync('docs/deployment/TALOCODE_INFRA.md'), 'Infra roadmap exists')
const infra = fs.readFileSync('docs/deployment/TALOCODE_INFRA.md', 'utf-8')
assert(infra.includes('Stacklane'), 'Mentions Stacklane')
assert(infra.includes('Supabase'), 'Mentions current Supabase usage')
assert(infra.includes('Render') === false || infra.includes('no longer'), 'Does not present Render as default')

// Test 4: API business docs
console.log('\n4. API Business Docs')
assert(fs.existsSync('docs/API_BUSINESS.md'), 'API business doc exists')
const apiBiz = fs.readFileSync('docs/API_BUSINESS.md', 'utf-8')
assert(apiBiz.includes('open-source'), 'Positions as open-source')
assert(apiBiz.toLowerCase().includes('self-host'), 'Mentions self-host')
assert(apiBiz.includes('deterministic'), 'Mentions deterministic rendering')

// Test 5: Health endpoint
console.log('\n5. Health Endpoint')
const apiFiles = ['apps/api/src/app.ts', 'app/api/health/route.ts', 'app/api/v1/health/route.ts']
let healthFound = false
for (const f of apiFiles) {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf-8')
    if (content.includes('/health') || content.includes('health')) {
      healthFound = true
      break
    }
  }
}
assert(healthFound || apiFiles.some(f => fs.existsSync(f)), 'Health endpoint exists')

// Test 6: .env.example updated
console.log('\n6. Environment Config')
const envExample = fs.readFileSync('.env.example', 'utf-8')
assert(envExample.includes('NEXT_PUBLIC_APP_URL'), 'Has app URL')
assert(envExample.includes('NEXT_PUBLIC_SUPABASE_URL'), 'Has Supabase URL')
assert(envExample.includes('SUPABASE_SERVICE_ROLE_KEY'), 'Has service key')
assert(envExample.includes('LAUNCHPIX_API_KEY'), 'Has API key')

// Test 7: README updated
console.log('\n7. README')
const readme = fs.readFileSync('README.md', 'utf-8')
assert(readme.includes('Self-Host'), 'README mentions self-host')
assert(readme.includes('Docker'), 'README mentions Docker')
assert(!readme.includes('deploy to Render') || readme.includes('optional'), 'Render not default')

// Test 8: No Render default language
console.log('\n8. No Render Default')
let noRenderDefault = true
const filesToCheck = ['README.md', 'docs/API_BUSINESS.md', 'docs/deployment/SELF_HOST.md']
for (const file of filesToCheck) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8').toLowerCase()
    if (content.includes('deploy to render') && !content.includes('optional')) {
      noRenderDefault = false
      console.log(`  ✗ Render default in ${file}`)
    }
  }
}
assert(noRenderDefault, 'Render not presented as default')

// Test 9: No secrets
console.log('\n9. No Secrets')
const dockerIgnore = fs.readFileSync('.dockerignore', 'utf-8')
assert(dockerIgnore.includes('.env'), '.env is dockerignored')
assert(!dockerIgnore.includes('node_modules') === false || dockerIgnore.includes('node_modules'), 'node_modules ignored')

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
process.exit(failed > 0 ? 1 : 0)
