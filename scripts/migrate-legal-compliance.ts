/**
 * Database Migration Script: Legal Compliance Fields
 *
 * This script migrates existing users and agencies to have the required
 * legal compliance fields (terms acceptance, privacy acceptance, etc.)
 *
 * IMPORTANT: Run this script ONCE before deploying the updated Firestore rules.
 *
 * Usage:
 *   npx ts-node scripts/migrate-legal-compliance.ts
 *
 * Or with Firebase Admin SDK:
 *   node --loader ts-node/esm scripts/migrate-legal-compliance.ts
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { LEGAL_VERSIONS } from '../lib/legal-versions';

// Initialize Firebase Admin (you'll need to set up service account)
// Download your service account key from Firebase Console
// Place it in scripts/serviceAccountKey.json (add to .gitignore!)

const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

interface MigrationStats {
  usersProcessed: number;
  usersUpdated: number;
  jobHuntersProcessed: number;
  jobHuntersUpdated: number;
  agenciesProcessed: number;
  agenciesUpdated: number;
  errors: Array<{ collection: string; id: string; error: string }>;
}

const stats: MigrationStats = {
  usersProcessed: 0,
  usersUpdated: 0,
  jobHuntersProcessed: 0,
  jobHuntersUpdated: 0,
  agenciesProcessed: 0,
  agenciesUpdated: 0,
  errors: []
};

/**
 * Migrate users collection
 */
async function migrateUsers() {
  console.log('\n📝 Migrating users collection...');

  try {
    const usersSnapshot = await db.collection('users').get();

    if (usersSnapshot.empty) {
      console.log('  ℹ️  No users found to migrate');
      return;
    }

    const batch = db.batch();
    let batchCount = 0;
    const BATCH_SIZE = 500;

    for (const doc of usersSnapshot.docs) {
      stats.usersProcessed++;
      const data = doc.data();

      // Only update if legal fields are missing
      if (!data.termsAcceptedAt) {
        const updates: any = {
          termsAcceptedAt: data.createdAt || Timestamp.now(),
          termsVersion: LEGAL_VERSIONS.TERMS_OF_SERVICE,
          privacyAcceptedAt: data.createdAt || Timestamp.now(),
          privacyVersion: LEGAL_VERSIONS.PRIVACY_POLICY,
        };

        // For job hunters, add age verification (grandfather clause)
        if (data.userType === 'jobhunter') {
          updates.ageVerified = true;
          // Note: dateOfBirth should be added by user on next profile update
        }

        batch.update(doc.ref, updates);
        stats.usersUpdated++;
        batchCount++;

        // Commit batch every 500 operations
        if (batchCount >= BATCH_SIZE) {
          await batch.commit();
          console.log(`  ✅ Committed batch of ${batchCount} users`);
          batchCount = 0;
        }
      }
    }

    // Commit remaining operations
    if (batchCount > 0) {
      await batch.commit();
      console.log(`  ✅ Committed final batch of ${batchCount} users`);
    }

    console.log(`  ✅ Users migration complete: ${stats.usersUpdated}/${stats.usersProcessed} updated`);
  } catch (error) {
    console.error('  ❌ Error migrating users:', error);
    stats.errors.push({
      collection: 'users',
      id: 'bulk',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Migrate jobHunters collection
 */
async function migrateJobHunters() {
  console.log('\n📝 Migrating jobHunters collection...');

  try {
    const jobHuntersSnapshot = await db.collection('jobHunters').get();

    if (jobHuntersSnapshot.empty) {
      console.log('  ℹ️  No job hunters found to migrate');
      return;
    }

    const batch = db.batch();
    let batchCount = 0;
    const BATCH_SIZE = 500;

    for (const doc of jobHuntersSnapshot.docs) {
      stats.jobHuntersProcessed++;
      const data = doc.data();

      // Only update if legal fields are missing
      if (!data.termsAcceptedAt) {
        const updates: any = {
          termsAcceptedAt: data.createdAt || Timestamp.now(),
          termsVersion: LEGAL_VERSIONS.TERMS_OF_SERVICE,
          privacyAcceptedAt: data.createdAt || Timestamp.now(),
          privacyVersion: LEGAL_VERSIONS.PRIVACY_POLICY,
          ageVerified: true, // Grandfather clause for existing users
          // Note: dateOfBirth should be added by user on next profile update
        };

        batch.update(doc.ref, updates);
        stats.jobHuntersUpdated++;
        batchCount++;

        if (batchCount >= BATCH_SIZE) {
          await batch.commit();
          console.log(`  ✅ Committed batch of ${batchCount} job hunters`);
          batchCount = 0;
        }
      }
    }

    if (batchCount > 0) {
      await batch.commit();
      console.log(`  ✅ Committed final batch of ${batchCount} job hunters`);
    }

    console.log(`  ✅ Job hunters migration complete: ${stats.jobHuntersUpdated}/${stats.jobHuntersProcessed} updated`);
  } catch (error) {
    console.error('  ❌ Error migrating job hunters:', error);
    stats.errors.push({
      collection: 'jobHunters',
      id: 'bulk',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Migrate agencies collection
 */
async function migrateAgencies() {
  console.log('\n📝 Migrating agencies collection...');

  try {
    const agenciesSnapshot = await db.collection('agencies').get();

    if (agenciesSnapshot.empty) {
      console.log('  ℹ️  No agencies found to migrate');
      return;
    }

    const batch = db.batch();
    let batchCount = 0;
    const BATCH_SIZE = 500;

    for (const doc of agenciesSnapshot.docs) {
      stats.agenciesProcessed++;
      const data = doc.data();

      // Only update if legal fields are missing
      if (!data.termsAcceptedAt) {
        const updates: any = {
          termsAcceptedAt: data.createdAt || Timestamp.now(),
          termsVersion: LEGAL_VERSIONS.TERMS_OF_SERVICE,
          privacyAcceptedAt: data.createdAt || Timestamp.now(),
          privacyVersion: LEGAL_VERSIONS.PRIVACY_POLICY,
          agencyTermsAcceptedAt: data.createdAt || Timestamp.now(),
          agencyTermsVersion: LEGAL_VERSIONS.AGENCY_TERMS,
          // agencyTermsAcceptedIP is optional, don't set it for existing agencies
        };

        batch.update(doc.ref, updates);
        stats.agenciesUpdated++;
        batchCount++;

        if (batchCount >= BATCH_SIZE) {
          await batch.commit();
          console.log(`  ✅ Committed batch of ${batchCount} agencies`);
          batchCount = 0;
        }
      }
    }

    if (batchCount > 0) {
      await batch.commit();
      console.log(`  ✅ Committed final batch of ${batchCount} agencies`);
    }

    console.log(`  ✅ Agencies migration complete: ${stats.agenciesUpdated}/${stats.agenciesProcessed} updated`);
  } catch (error) {
    console.error('  ❌ Error migrating agencies:', error);
    stats.errors.push({
      collection: 'agencies',
      id: 'bulk',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Main migration function
 */
async function runMigration() {
  console.log('🚀 Starting Legal Compliance Migration');
  console.log('=====================================');
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  console.log(`📋 Terms Version: ${LEGAL_VERSIONS.TERMS_OF_SERVICE}`);
  console.log(`📋 Privacy Version: ${LEGAL_VERSIONS.PRIVACY_POLICY}`);
  console.log(`📋 Agency Terms Version: ${LEGAL_VERSIONS.AGENCY_TERMS}`);
  console.log('');

  const startTime = Date.now();

  try {
    // Migrate all collections
    await migrateUsers();
    await migrateJobHunters();
    await migrateAgencies();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    // Print summary
    console.log('\n=====================================');
    console.log('✅ Migration Complete');
    console.log('=====================================');
    console.log(`⏱️  Duration: ${duration}s`);
    console.log('');
    console.log('📊 Summary:');
    console.log(`   Users: ${stats.usersUpdated}/${stats.usersProcessed} updated`);
    console.log(`   Job Hunters: ${stats.jobHuntersUpdated}/${stats.jobHuntersProcessed} updated`);
    console.log(`   Agencies: ${stats.agenciesUpdated}/${stats.agenciesProcessed} updated`);
    console.log('');

    if (stats.errors.length > 0) {
      console.log('⚠️  Errors encountered:');
      stats.errors.forEach(err => {
        console.log(`   ${err.collection}/${err.id}: ${err.error}`);
      });
    } else {
      console.log('✅ No errors encountered');
    }

    console.log('');
    console.log('📝 Next Steps:');
    console.log('   1. Verify the migration in Firestore Console');
    console.log('   2. Deploy the updated firestore.rules');
    console.log('   3. Monitor for any issues with new user signups');
    console.log('');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log('✅ Migration script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });
