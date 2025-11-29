/**
 * Migration Script: Convert Single Certification URLs to Multi-File Arrays
 *
 * This script migrates existing agency certifications from the legacy single-file format
 * (dmwLicenseUrl, businessPermitUrl) to the new multi-file format
 * (dmwLicenseFiles, businessPermitFiles).
 *
 * The script:
 * 1. Reads all agencies with dmwLicenseUrl or businessPermitUrl
 * 2. Converts single URLs to array format with metadata
 * 3. Keeps legacy fields for rollback safety
 * 4. Runs idempotently (safe to run multiple times)
 *
 * Usage:
 *   npx ts-node scripts/migrate-certification-files.ts
 *
 * Optional flags:
 *   --dry-run    : Preview changes without applying them
 *   --limit=N    : Process only N agencies (for testing)
 *
 * Example:
 *   npx ts-node scripts/migrate-certification-files.ts --dry-run
 *   npx ts-node scripts/migrate-certification-files.ts --limit=10
 */

import * as admin from 'firebase-admin'
import * as path from 'path'

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json')

try {
  const serviceAccount = require(serviceAccountPath)
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  })
  console.log('✅ Firebase Admin initialized successfully')
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error)
  console.error('Make sure serviceAccountKey.json exists in the project root')
  process.exit(1)
}

const db = admin.firestore()

// CertificationFile interface (matches types/index.ts)
interface CertificationFile {
  url: string
  fileName: string
  uploadedAt: admin.firestore.Timestamp
  fileType: string
  fileSize: number
  storagePath: string
}

// Parse command line arguments
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const limitArg = args.find(arg => arg.startsWith('--limit='))
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : undefined

console.log('\n🔄 Migration Configuration:')
console.log(`   Mode: ${isDryRun ? 'DRY RUN (no changes will be made)' : 'LIVE (changes will be applied)'}`)
console.log(`   Limit: ${limit ? `${limit} agencies` : 'All agencies'}`)
console.log('')

/**
 * Extract filename from a Firebase Storage URL
 */
function extractFileName(url: string): string {
  try {
    const parts = url.split('/')
    const filenamePart = parts[parts.length - 1]
    const decoded = decodeURIComponent(filenamePart.split('?')[0])
    // Remove path prefix if present
    const lastSlash = decoded.lastIndexOf('/')
    return lastSlash >= 0 ? decoded.substring(lastSlash + 1) : decoded
  } catch (error) {
    return 'certification-document'
  }
}

/**
 * Guess file type from URL extension
 */
function guessFileType(url: string): string {
  const ext = url.split('.').pop()?.toLowerCase()
  const typeMap: Record<string, string> = {
    'pdf': 'application/pdf',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png'
  }
  return typeMap[ext || ''] || 'application/octet-stream'
}

/**
 * Extract storage path from a Firebase Storage URL
 */
function extractStoragePath(url: string): string {
  try {
    // Firebase Storage URL format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?token=...
    const match = url.match(/\/o\/(.+?)\?/)
    return match ? decodeURIComponent(match[1]) : ''
  } catch (error) {
    return ''
  }
}

/**
 * Convert single URL to CertificationFile object
 */
function convertToCertificationFile(
  url: string,
  uploadedAt: admin.firestore.Timestamp
): CertificationFile {
  return {
    url,
    fileName: extractFileName(url),
    uploadedAt,
    fileType: guessFileType(url),
    fileSize: 0, // Unknown for legacy files
    storagePath: extractStoragePath(url)
  }
}

/**
 * Main migration function
 */
async function migrateCertificationFiles() {
  let migrated = 0
  let skipped = 0
  let errors = 0

  console.log('📊 Starting migration...\n')

  try {
    // Query all agencies
    let query = db.collection('agencies')
    const snapshot = await (limit ? query.limit(limit).get() : query.get())

    console.log(`Found ${snapshot.size} agencies to process\n`)

    for (const agencyDoc of snapshot.docs) {
      const agency = agencyDoc.data()
      const agencyId = agencyDoc.id
      const updates: any = {}
      let needsUpdate = false

      try {
        // Migrate DMW License
        if (agency.dmwLicenseUrl && !agency.dmwLicenseFiles) {
          const certFile = convertToCertificationFile(
            agency.dmwLicenseUrl,
            agency.updatedAt || admin.firestore.Timestamp.now()
          )
          updates.dmwLicenseFiles = [certFile]
          needsUpdate = true
          console.log(`   📄 Will migrate DMW License: ${certFile.fileName}`)
        }

        // Migrate Business Permit
        if (agency.businessPermitUrl && !agency.businessPermitFiles) {
          const certFile = convertToCertificationFile(
            agency.businessPermitUrl,
            agency.updatedAt || admin.firestore.Timestamp.now()
          )
          updates.businessPermitFiles = [certFile]
          needsUpdate = true
          console.log(`   📄 Will migrate Business Permit: ${certFile.fileName}`)
        }

        if (needsUpdate) {
          updates.updatedAt = admin.firestore.Timestamp.now()

          if (!isDryRun) {
            await agencyDoc.ref.update(updates)
          }

          migrated++
          console.log(`✅ ${isDryRun ? 'Would migrate' : 'Migrated'}: ${agency.companyName || agencyId}`)
          console.log(`   ID: ${agencyId}`)
          console.log('')
        } else {
          skipped++
          console.log(`⏭️  Skipped (already migrated): ${agency.companyName || agencyId}`)
        }
      } catch (error) {
        errors++
        console.error(`❌ Error processing ${agencyId}:`, error)
        console.log('')
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 Migration Summary')
    console.log('='.repeat(60))
    console.log(`Mode:           ${isDryRun ? 'DRY RUN' : 'LIVE'}`)
    console.log(`Total agencies: ${snapshot.size}`)
    console.log(`Migrated:       ${migrated}`)
    console.log(`Skipped:        ${skipped}`)
    console.log(`Errors:         ${errors}`)
    console.log('='.repeat(60))

    if (isDryRun) {
      console.log('\n⚠️  This was a DRY RUN - no changes were made')
      console.log('   Run without --dry-run to apply changes')
    } else {
      console.log('\n✅ Migration completed successfully!')
    }

    if (errors > 0) {
      console.log('\n⚠️  Some agencies had errors - please review the logs above')
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateCertificationFiles()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
