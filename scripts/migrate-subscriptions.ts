/**
 * Migration Script: Initialize Subscriptions for Existing Agencies
 *
 * This script:
 * 1. Counts all jobs posted by each agency
 * 2. Agencies with >2 jobs: Creates premium subscription (1 month free - grandfathered)
 * 3. Agencies with <=2 jobs: Creates free subscription
 *
 * Run this script ONCE after deploying the subscription system.
 *
 * Usage: npx ts-node scripts/migrate-subscriptions.ts
 */

import * as admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

// Initialize Firebase Admin
if (!admin.apps.length) {
  // Check if we have service account or default credentials
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // Use default credentials
    admin.initializeApp();
  }
}

const db = admin.firestore();

interface MigrationStats {
  totalAgencies: number;
  freeTierCreated: number;
  premiumCreated: number;
  alreadyHasSubscription: number;
  errors: number;
}

async function migrateAgencySubscriptions() {
  console.log('🚀 Starting subscription migration...\n');

  const stats: MigrationStats = {
    totalAgencies: 0,
    freeTierCreated: 0,
    premiumCreated: 0,
    alreadyHasSubscription: 0,
    errors: 0,
  };

  try {
    // Get all agencies
    const agenciesSnapshot = await db.collection('agencies').get();
    stats.totalAgencies = agenciesSnapshot.size;

    console.log(`Found ${stats.totalAgencies} agencies\n`);

    // Process each agency
    for (const agencyDoc of agenciesSnapshot.docs) {
      const agencyId = agencyDoc.id;
      const agencyData = agencyDoc.data();

      console.log(`Processing agency: ${agencyData.companyName || agencyId}`);

      try {
        // Check if subscription already exists
        const subscriptionDoc = await db.collection('subscriptions').doc(agencyId).get();
        if (subscriptionDoc.exists) {
          console.log(`  ℹ️  Already has subscription - skipping`);
          stats.alreadyHasSubscription++;
          continue;
        }

        // Count all jobs for this agency
        const jobsSnapshot = await db
          .collection('jobs')
          .where('agencyId', '==', agencyId)
          .get();

        const lifetimeJobsPosted = jobsSnapshot.size;
        console.log(`  📊 Total jobs posted: ${lifetimeJobsPosted}`);

        const now = admin.firestore.Timestamp.now();

        // Decide subscription tier
        if (lifetimeJobsPosted > 2) {
          // Grandfathered premium (1 month free)
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 30); // 30 days from now

          await db.collection('subscriptions').doc(agencyId).set({
            agencyId,
            plan: 'premium',
            status: 'active',
            startDate: now,
            endDate: admin.firestore.Timestamp.fromDate(endDate),
            autoRenew: false,
            lifetimeJobsPosted,
            currentPeriodJobsPosted: lifetimeJobsPosted,
            currency: 'PHP',
            createdAt: now,
            updatedAt: now,
            notes: 'Grandfathered: 1 month free premium for existing agencies with >2 jobs',
          });

          console.log(`  ✅ Created PREMIUM subscription (grandfathered, expires: ${endDate.toDateString()})`);
          stats.premiumCreated++;
        } else {
          // Free tier
          const farFutureDate = new Date();
          farFutureDate.setFullYear(farFutureDate.getFullYear() + 100);

          await db.collection('subscriptions').doc(agencyId).set({
            agencyId,
            plan: 'free',
            status: 'active',
            startDate: now,
            endDate: admin.firestore.Timestamp.fromDate(farFutureDate),
            autoRenew: false,
            lifetimeJobsPosted,
            currentPeriodJobsPosted: lifetimeJobsPosted,
            currency: 'PHP',
            createdAt: now,
            updatedAt: now,
          });

          console.log(`  ✅ Created FREE subscription`);
          stats.freeTierCreated++;
        }
      } catch (error: any) {
        console.error(`  ❌ Error processing agency ${agencyId}:`, error.message);
        stats.errors++;
      }

      console.log(''); // Empty line for readability
    }

    // Print summary
    console.log('\n═══════════════════════════════════════');
    console.log('📊 MIGRATION SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`Total agencies processed: ${stats.totalAgencies}`);
    console.log(`Free tier created: ${stats.freeTierCreated}`);
    console.log(`Premium created (grandfathered): ${stats.premiumCreated}`);
    console.log(`Already had subscription: ${stats.alreadyHasSubscription}`);
    console.log(`Errors: ${stats.errors}`);
    console.log('═══════════════════════════════════════\n');

    if (stats.errors === 0) {
      console.log('✅ Migration completed successfully!');
    } else {
      console.log('⚠️  Migration completed with some errors. Please review the logs above.');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration
migrateAgencySubscriptions()
  .then(() => {
    console.log('\n✅ Migration script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration script failed:', error);
    process.exit(1);
  });
