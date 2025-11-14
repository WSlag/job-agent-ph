/**
 * Script to fix admin role from 'super-admin' to 'super_admin'
 * and add all permissions to the admin account
 *
 * Run with: npx tsx scripts/fix-admin-role.ts
 */

import { getDbInstance } from '../lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { COLLECTIONS } from '../lib/collections';
import { Permission } from '../types';

async function fixAdminRole() {
  try {
    const db = getDbInstance();

    // Get your admin user ID - you'll need to replace this with your actual admin ID
    // You can find this in Firebase Console or from the auth context
    const adminId = process.argv[2];

    if (!adminId) {
      console.error('Usage: npx tsx scripts/fix-admin-role.ts <admin-user-id>');
      console.error('Example: npx tsx scripts/fix-admin-role.ts abc123xyz');
      process.exit(1);
    }

    console.log(`Updating admin account: ${adminId}`);

    // Get current admin data
    const adminRef = doc(db, COLLECTIONS.ADMINS, adminId);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
      console.error(`Admin document not found for ID: ${adminId}`);
      process.exit(1);
    }

    console.log('Current admin data:', adminSnap.data());

    // Update admin with correct role and all permissions
    await updateDoc(adminRef, {
      role: 'super_admin', // Changed from 'super-admin' to 'super_admin'
      permissions: Object.values(Permission), // Add all permissions
      updatedAt: new Date(),
    });

    console.log('✅ Admin role updated successfully!');
    console.log('New role: super_admin');
    console.log('Permissions added:', Object.values(Permission).length);

    // Verify the update
    const updatedAdminSnap = await getDoc(adminRef);
    console.log('\nUpdated admin data:', updatedAdminSnap.data());

    process.exit(0);
  } catch (error) {
    console.error('Error fixing admin role:', error);
    process.exit(1);
  }
}

fixAdminRole();
