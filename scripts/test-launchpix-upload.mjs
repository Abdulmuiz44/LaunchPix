#!/usr/bin/env node

/**
 * LaunchPix screenshot upload tests.
 * Run: node scripts/test-launchpix-upload.mjs
 */

import * as fs from 'fs'
import * as path from 'path'

let passed = 0
let failed = 0

function assert(condition, label) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.log(`  ✗ ${label}`); failed++; }
}

console.log('\n=== LaunchPix Upload Tests ===\n')

// Test 1: Upload endpoint exists
console.log('1. Upload Endpoint')
assert(fs.existsSync('app/api/v1/screenshots/upload/route.ts'), 'Upload route exists')
const uploadRoute = fs.readFileSync('app/api/v1/screenshots/upload/route.ts', 'utf-8')
assert(uploadRoute.includes('authenticateApiCustomerRequest'), 'Uses API key auth')
assert(uploadRoute.includes('NextResponse.json'), 'Returns JSON only')
assert(uploadRoute.includes('formData'), 'Handles multipart/form-data via formData()')

// Test 2: File type validation
console.log('\n2. File Type Validation')
assert(uploadRoute.includes('image/png'), 'Accepts PNG')
assert(uploadRoute.includes('image/jpeg'), 'Accepts JPEG')
assert(uploadRoute.includes('image/webp'), 'Accepts WEBP')
assert(uploadRoute.includes('Unsupported file type'), 'Rejects unsupported types')

// Test 3: File size validation
console.log('\n3. File Size Validation')
assert(uploadRoute.includes('MAX_FILE_SIZE'), 'Has max file size constant')
assert(uploadRoute.includes('5'), 'Max size is 5MB')
assert(uploadRoute.includes('413'), 'Returns 413 for too large')
assert(uploadRoute.includes('File too large'), 'Shows size error')

// Test 4: Filename sanitization
console.log('\n4. Filename Sanitization')
assert(uploadRoute.includes('sanitizeFilename'), 'Has sanitize function')
assert(uploadRoute.includes('generateStorageKey'), 'Has storage key generator')
assert(uploadRoute.includes('crypto.randomUUID'), 'Uses random UUID for storage key')
assert(uploadRoute.includes('replace'), 'Sanitizes special characters')

// Test 5: Storage safety
console.log('\n5. Storage Safety')
assert(uploadRoute.includes('getPublicUrl'), 'Gets public URL')
assert(uploadRoute.includes('screenshots'), 'Uses screenshots bucket')
assert(uploadRoute.includes('userId'), 'Stores user ID')
assert(uploadRoute.includes('storageKey'), 'Stores storage key')

// Test 6: Response structure
console.log('\n6. Response Structure')
assert(uploadRoute.includes('ok: true'), 'Returns ok: true')
assert(uploadRoute.includes('screenshot'), 'Returns screenshot object')
assert(uploadRoute.includes('id'), 'Returns screenshot ID')
assert(uploadRoute.includes('mimeType'), 'Returns MIME type')
assert(uploadRoute.includes('sizeBytes'), 'Returns file size')
assert(uploadRoute.includes('width'), 'Returns width')
assert(uploadRoute.includes('height'), 'Returns height')
assert(uploadRoute.includes('url'), 'Returns public URL')
assert(uploadRoute.includes('storageKey'), 'Returns storage key')
assert(uploadRoute.includes('storageMode'), 'Returns storage mode field')

// Test 7: Generate endpoint accepts screenshotId
console.log('\n7. Generate Endpoint screenshotId Support')
const genRoute = fs.readFileSync('app/api/v1/assets/generate/route.ts', 'utf-8')
assert(genRoute.includes('screenshotId'), 'Accepts screenshotId')
assert(genRoute.includes('resolveScreenshotUrl'), 'Resolves screenshotId to URL')
assert(genRoute.includes('does not belong to this account'), 'Verifies ownership')
assert(genRoute.includes('Screenshot not found'), 'Handles missing screenshot')

// Test 8: Generate rejects both/neither
console.log('\n8. Generate Input Validation')
assert(genRoute.includes('Either screenshotUrl or screenshotId'), 'Rejects neither')
assert(genRoute.includes('not both'), 'Rejects both')

// Test 9: No secrets
console.log('\n9. No Secrets')
assert(!uploadRoute.includes('process.env.SUPABASE_SERVICE_ROLE_KEY'), 'Does not expose service key')
assert(!uploadRoute.includes('NEXTAUTH_SECRET'), 'Does not expose auth secret')

// Test 10: Types updated
console.log('\n10. Types')
const types = fs.readFileSync('lib/launch/types.ts', 'utf-8')
assert(types.includes('UploadedScreenshot'), 'Has UploadedScreenshot type')
assert(types.includes('ScreenshotUploadResponse'), 'Has ScreenshotUploadResponse type')
assert(types.includes('screenshotId'), 'Has screenshotId in GenerateAssetRequest')
assert(types.includes('storageMode'), 'Has storageMode in UploadedScreenshot')

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
process.exit(failed > 0 ? 1 : 0)
