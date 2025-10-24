/**
 * Script to fix users that exist in 'users' collection but not in 'jobHunters' or 'agencies'
 * Run this with: npx ts-node scripts/fix-user-profiles.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (you'll need to set up service account credentials)
if (!getApps().length) {
  initializeApp({
    // Add your Firebase Admin SDK credentials here
    // credential: cert('./path-to-serviceAccountKey.json')
  });
}

const db = getFirestore();

async function fixUserProfiles() {
  try {
    console.log('Starting user profile fix...');

    // Get all users from the 'users' collection
    const usersSnapshot = await db.collection('users').get();
    console.log(`Found ${usersSnapshot.size} users in 'users' collection`);

    let fixed = 0;
    let skipped = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();
      const userType = userData.userType;

      console.log(`\nChecking user: ${userData.email} (${userType})`);

      if (userType === 'jobhunter') {
        // Check if profile exists in jobHunters collection
        const jobHunterDoc = await db.collection('jobHunters').doc(userId).get();

        if (!jobHunterDoc.exists()) {
          console.log(`  ❌ Missing jobHunter profile for ${userData.email}`);
          console.log(`  Creating jobHunter profile...`);

          // Create basic jobHunter profile
          await db.collection('jobHunters').doc(userId).set({
            email: userData.email,
            userType: 'jobhunter',
            firstName: userData.firstName || 'User',
            lastName: userData.lastName || '',
            location: userData.location || 'Manila',
            skills: userData.skills || [],
            experience: userData.experience || 0,
            createdAt: userData.createdAt || new Date(),
            updatedAt: new Date(),
          });

          console.log(`  ✅ Created jobHunter profile`);
          fixed++;
        } else {
          console.log(`  ✓ jobHunter profile exists`);
          skipped++;
        }
      } else if (userType === 'agency') {
        // Check if profile exists in agencies collection
        const agencyDoc = await db.collection('agencies').doc(userId).get();

        if (!agencyDoc.exists()) {
          console.log(`  ❌ Missing agency profile for ${userData.email}`);
          console.log(`  Creating agency profile...`);

          // Create basic agency profile
          await db.collection('agencies').doc(userId).set({
            email: userData.email,
            userType: 'agency',
            companyName: userData.companyName || 'Agency',
            registrationNumber: userData.registrationNumber || '',
            contactPerson: userData.contactPerson || '',
            phone: userData.phone || '',
            address: userData.address || '',
            verified: false,
            createdAt: userData.createdAt || new Date(),
            updatedAt: new Date(),
          });

          console.log(`  ✅ Created agency profile`);
          fixed++;
        } else {
          console.log(`  ✓ Agency profile exists`);
          skipped++;
        }
      } else {
        console.log(`  ⚠️  Unknown user type: ${userType}`);
      }
    }

    console.log('\n================================');
    console.log('Profile fix complete!');
    console.log(`✅ Fixed: ${fixed}`);
    console.log(`✓ Skipped (already exists): ${skipped}`);
    console.log('================================\n');
  } catch (error) {
    console.error('Error fixing user profiles:', error);
    throw error;
  }
}

// Run the script
fixUserProfiles()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
