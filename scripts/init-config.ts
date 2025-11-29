/**
 * Initialization Script: Create Default Configuration
 *
 * This script creates the default jobPostingLimits configuration document.
 * Run this once after deploying Firestore rules.
 *
 * Usage: npx ts-node scripts/init-config.ts
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
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    admin.initializeApp();
  }
}

const db = admin.firestore();

async function initializeConfiguration() {
  console.log('🔧 Initializing default configuration...\n');

  try {
    const configRef = db.collection('jobPostingLimits').doc('default');
    const configDoc = await configRef.get();

    if (configDoc.exists) {
      console.log('⚠️  Configuration already exists:');
      console.log(JSON.stringify(configDoc.data(), null, 2));
      console.log('\nTo update, delete the document first or modify manually in Firebase Console.');
      return;
    }

    const config = {
      freeTierLimit: 2,
      premiumTierLimit: -1, // -1 means unlimited
      premiumMonthlyPrice: 5000,
      premiumCurrency: 'PHP',
      featuredJobBasePrice: 1000,
      updatedAt: admin.firestore.Timestamp.now(),
    };

    await configRef.set(config);

    console.log('✅ Default configuration created successfully!\n');
    console.log('Configuration:');
    console.log('─────────────────────────────────────');
    console.log(`Free Tier Limit: ${config.freeTierLimit} jobs (lifetime)`);
    console.log(`Premium Tier Limit: Unlimited`);
    console.log(`Premium Monthly Price: ₱${config.premiumMonthlyPrice.toLocaleString()}`);
    console.log(`Currency: ${config.premiumCurrency}`);
    console.log(`Featured Job Base Price: ₱${config.featuredJobBasePrice.toLocaleString()}`);
    console.log('─────────────────────────────────────\n');

    console.log('✅ Configuration initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing configuration:', error);
    throw error;
  }
}

// Run the initialization
initializeConfiguration()
  .then(() => {
    console.log('\n✅ Initialization complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Initialization failed:', error);
    process.exit(1);
  });
