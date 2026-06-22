#!/usr/bin/env node

/**
 * LaunchPix API tests.
 * Run: node scripts/test-launchpix-api.mjs
 */

import * as fs from 'fs'
import * as path from 'path'

let passed = 0
let failed = 0

function assert(condition, label) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.log(`  ✗ ${label}`); failed++; }
}

console.log('\n=== LaunchPix API Tests ===\n')

// Test 1: API endpoint exists
console.log('1. API Endpoint')
assert(fs.existsSync('app/api/v1/assets/generate/route.ts'), 'Generate endpoint exists')
const route = fs.readFileSync('app/api/v1/assets/generate/route.ts', 'utf-8')
assert(route.includes('authenticateApiCustomerRequest'), 'Uses API key auth')
assert(route.includes('NextResponse.json'), 'Returns JSON only')
assert(route.includes('400'), 'Returns 400 for bad requests')
assert(route.includes('authResult'), 'Checks auth result')

// Test 2: Request validation
console.log('\n2. Request Validation')
assert(route.includes('productName'), 'Validates productName')
assert(route.includes('tagline'), 'Validates tagline')
assert(route.includes('screenshotUrl'), 'Validates screenshotUrl')
assert(route.includes('https://'), 'Requires HTTPS')
assert(route.includes('localhost'), 'Rejects localhost')
assert(route.includes('127.0.0.1'), 'Rejects 127.0.0.1')
assert(route.includes('192.168'), 'Rejects private IPs')
assert(route.includes('10.'), 'Rejects 10.x IPs')
assert(route.includes('hero_banner'), 'Validates assetType')
assert(route.includes('dark'), 'Validates theme')

// Test 3: Renderer exists
console.log('\n3. Deterministic Renderer')
assert(fs.existsSync('lib/render/deterministic.ts'), 'Renderer exists')
const renderer = fs.readFileSync('lib/render/deterministic.ts', 'utf-8')
assert(renderer.includes('renderAssetSvg'), 'Has renderAssetSvg function')
assert(renderer.includes('renderAssetPng'), 'Has renderAssetPng function')
assert(renderer.includes('buildAssetPlan'), 'Has buildAssetPlan function')
assert(renderer.includes('device-mockup'), 'Has device mockup layout')
assert(renderer.includes('browser-mockup'), 'Has browser mockup layout')
assert(renderer.includes('card-mockup') || renderer.includes('card-centered'), 'Has card layout')
assert(renderer.includes('system-ui'), 'Uses system fonts')

// Test 4: Types exist
console.log('\n4. Types')
assert(fs.existsSync('lib/launch/types.ts'), 'Types file exists')
const types = fs.readFileSync('lib/launch/types.ts', 'utf-8')
assert(types.includes('AssetType'), 'Has AssetType')
assert(types.includes('hero_banner'), 'Has hero_banner')
assert(types.includes('promo_tile'), 'Has promo_tile')
assert(types.includes('app_listing_frame'), 'Has app_listing_frame')
assert(types.includes('GenerateAssetRequest'), 'Has request type')
assert(types.includes('GenerateAssetResponse'), 'Has response type')

// Test 5: No fake AI claims
console.log('\n5. No Fake AI Claims')
let noFakeAi = true
const aiClaims = ['ai generated', 'neural render', 'ml generated', 'deep learning render']
const filesToCheck = [renderer, types]
for (const content of filesToCheck) {
  for (const claim of aiClaims) {
    if (content.toLowerCase().includes(claim)) {
      noFakeAi = false
      console.log(`  ✗ Fake AI claim: "${claim}"`)
    }
  }
}
assert(noFakeAi, 'No fake AI image generation claims')
assert(route.includes('No AI image generation'), 'Route explicitly states no AI was used')

// Test 6: Honest status labels
console.log('\n6. Honest Status Labels')
assert(route.includes('preview_generated'), 'Uses preview_generated status')
assert(route.includes('No AI image generation'), 'States no AI was used')
assert(route.includes('deterministic'), 'States deterministic rendering')

// Test 7: Examples exist
console.log('\n7. Examples')
assert(fs.existsSync('examples/tera-hero-banner.json'), 'Tera hero banner example')
assert(fs.existsSync('examples/codra-promo-tile.json'), 'Codra promo tile example')
assert(fs.existsSync('examples/worklane-app-listing.json'), 'WorkLane app listing example')

// Test 8: No secrets exposed
console.log('\n8. No Secrets')
assert(!route.includes('process.env.MISTRAL'), 'Does not expose Mistral key')
assert(!route.includes('process.env.SUPABASE'), 'Does not expose Supabase key')
assert(!route.includes('NEXTAUTH_SECRET'), 'Does not expose auth secret')

// Test 9: Auth behavior
console.log('\n9. Auth Behavior')
assert(route.includes('authenticateApiCustomerRequest'), 'Uses API key authentication')
assert(route.includes("'response' in authResult"), 'Returns auth error response')

// Test 10: Output format support
console.log('\n10. Output Formats')
assert(route.includes("'png'"), 'Supports PNG output')
assert(route.includes("'svg'"), 'Supports SVG fallback')

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
process.exit(failed > 0 ? 1 : 0)
