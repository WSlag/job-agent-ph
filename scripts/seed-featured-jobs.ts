/**
 * Script to seed test data for featured jobs system
 * Creates sample agencies, jobs, and featured requests
 * Run with: npx tsx scripts/seed-featured-jobs.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Initialize Firebase Admin
if (getApps().length === 0) {
  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    if (serviceAccountPath) {
      const serviceAccount = require(path.resolve(serviceAccountPath));
      initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error);
    process.exit(1);
  }
}

const auth = getAuth();
const db = getFirestore();

// Test agencies data
// Passwords come from TEST_AGENCY_PASSWORD env var — never hardcode credentials in the repo.
const testAgencies = [
  {
    email: 'techhire@example.com',
    password: process.env.TEST_AGENCY_PASSWORD ?? '',
    companyName: 'TechHire Global',
    registrationNumber: 'TH-2024-001',
    contactPerson: 'Maria Santos',
    phone: '+63 917 123 4567',
    address: '123 Business Ave, Makati City',
  },
  {
    email: 'healthcare@example.com',
    password: process.env.TEST_AGENCY_PASSWORD ?? '',
    companyName: 'HealthCare Staffing Inc.',
    registrationNumber: 'HC-2024-002',
    contactPerson: 'Juan Dela Cruz',
    phone: '+63 918 234 5678',
    address: '456 Medical Plaza, BGC, Taguig',
  },
  {
    email: 'engineering@example.com',
    password: process.env.TEST_AGENCY_PASSWORD ?? '',
    companyName: 'Engineering Talent Solutions',
    registrationNumber: 'ET-2024-003',
    contactPerson: 'Ana Reyes',
    phone: '+63 919 345 6789',
    address: '789 Industrial Park, Quezon City',
  },
];

// Sample jobs data
const sampleJobs = [
  {
    title: 'Senior Full-Stack Developer',
    description: 'We are seeking an experienced Full-Stack Developer to join our innovative team. You will work on cutting-edge web applications using modern technologies like React, Node.js, and cloud services. This role offers excellent growth opportunities and the chance to work with international clients.',
    tagline: 'Build the future of web applications with cutting-edge technology',
    location: 'Singapore',
    country: 'Singapore',
    locationType: 'hybrid' as const,
    jobType: 'full-time' as const,
    salaryMin: 80000,
    salaryMax: 120000,
    currency: 'SGD',
    experienceRequired: 5,
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'],
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop',
  },
  {
    title: 'Registered Nurse - ICU',
    description: 'Join our world-class medical facility as an ICU Registered Nurse. Provide exceptional patient care in a state-of-the-art intensive care unit. We offer competitive compensation, professional development opportunities, and comprehensive benefits package.',
    tagline: 'Make a difference in critical care at a leading healthcare facility',
    location: 'Dubai',
    country: 'United Arab Emirates',
    locationType: 'on-site' as const,
    jobType: 'full-time' as const,
    salaryMin: 8000,
    salaryMax: 12000,
    currency: 'AED',
    experienceRequired: 3,
    skills: ['Critical Care', 'Patient Assessment', 'Emergency Response', 'ICU Protocols'],
    category: 'Healthcare',
    imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&h=600&fit=crop',
  },
  {
    title: 'Structural Engineer',
    description: 'Design and oversee major infrastructure projects including bridges, buildings, and transportation systems. Work with a collaborative team of engineers on high-profile projects across Canada. Excellent opportunity for career advancement and professional licensing support.',
    tagline: 'Shape Canada\'s infrastructure landscape with innovative engineering',
    location: 'Toronto',
    country: 'Canada',
    locationType: 'hybrid' as const,
    jobType: 'full-time' as const,
    salaryMin: 75000,
    salaryMax: 95000,
    currency: 'CAD',
    experienceRequired: 4,
    skills: ['Structural Analysis', 'AutoCAD', 'Revit', 'Project Management', 'Building Codes'],
    category: 'Engineering',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=600&fit=crop',
  },
  {
    title: 'Digital Marketing Manager',
    description: 'Lead digital marketing strategies for top European brands. Manage social media campaigns, SEO/SEM initiatives, and content marketing programs. This role requires creativity, analytical skills, and experience with modern marketing tools and platforms.',
    tagline: 'Drive brand growth across Europe with strategic digital campaigns',
    location: 'London',
    country: 'United Kingdom',
    locationType: 'remote' as const,
    jobType: 'full-time' as const,
    salaryMin: 45000,
    salaryMax: 65000,
    currency: 'GBP',
    experienceRequired: 4,
    skills: ['SEO', 'Google Analytics', 'Social Media Marketing', 'Content Strategy', 'PPC'],
    category: 'Marketing',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
  },
  {
    title: 'Hospitality Manager',
    description: 'Manage operations at our premium hospitality venue in Sydney. Oversee guest services, staff management, and facility operations. We seek a passionate professional who can deliver exceptional guest experiences and lead a diverse team.',
    tagline: 'Create unforgettable experiences at Australia\'s premier hospitality venue',
    location: 'Sydney',
    country: 'Australia',
    locationType: 'on-site' as const,
    jobType: 'full-time' as const,
    salaryMin: 65000,
    salaryMax: 85000,
    currency: 'AUD',
    experienceRequired: 5,
    skills: ['Guest Relations', 'Staff Management', 'Operations', 'Budget Management', 'Quality Control'],
    category: 'Hospitality',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop',
  },
];

async function seedData() {
  console.log('\n🌱 Starting data seeding process...\n');

  if (!testAgencies.some((a) => a.password)) {
    console.error('❌ TEST_AGENCY_PASSWORD env var is required (set it in .env.local)');
    process.exit(1);
  }

  const createdAgencies: any[] = [];
  const createdJobs: any[] = [];

  try {
    // Step 1: Create test agencies
    console.log('📋 Step 1: Creating test agencies...\n');

    for (const agencyData of testAgencies) {
      try {
        console.log(`   Creating agency: ${agencyData.companyName}`);

        // Create auth user
        let uid: string;
        try {
          const userRecord = await auth.createUser({
            email: agencyData.email,
            password: agencyData.password,
            displayName: agencyData.companyName,
          });
          uid = userRecord.uid;
        } catch (error: any) {
          if (error.code === 'auth/email-already-exists') {
            const existingUser = await auth.getUserByEmail(agencyData.email);
            uid = existingUser.uid;
            console.log(`   ⚠️  Agency already exists, using existing UID`);
          } else {
            throw error;
          }
        }

        // Create users document
        await db.collection('users').doc(uid).set({
          email: agencyData.email,
          userType: 'agency',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        // Create agencies document
        await db.collection('agencies').doc(uid).set({
          email: agencyData.email,
          userType: 'agency',
          companyName: agencyData.companyName,
          registrationNumber: agencyData.registrationNumber,
          contactPerson: agencyData.contactPerson,
          phone: agencyData.phone,
          address: agencyData.address,
          verified: true,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        createdAgencies.push({ uid, ...agencyData });
        console.log(`   ✅ Created: ${agencyData.companyName} (${uid})\n`);
      } catch (error) {
        console.error(`   ❌ Failed to create agency: ${agencyData.companyName}`, error);
      }
    }

    // Step 2: Create jobs for each agency
    console.log('\n📋 Step 2: Creating sample jobs...\n');

    for (let i = 0; i < sampleJobs.length; i++) {
      const jobData = sampleJobs[i];
      const agency = createdAgencies[i % createdAgencies.length];

      try {
        console.log(`   Creating job: ${jobData.title}`);

        const jobRef = db.collection('jobs').doc();
        await jobRef.set({
          ...jobData,
          agencyId: agency.uid,
          companyName: agency.companyName,
          postedAt: Timestamp.now(),
          isActive: true,
          isFeatured: false,
          createdAt: Timestamp.now(),
        });

        createdJobs.push({ id: jobRef.id, ...jobData, agencyId: agency.uid });
        console.log(`   ✅ Created: ${jobData.title} (${jobRef.id})\n`);
      } catch (error) {
        console.error(`   ❌ Failed to create job: ${jobData.title}`, error);
      }
    }

    // Step 3: Create featured requests (3 pending, 1 approved with featured job, 1 rejected)
    console.log('\n📋 Step 3: Creating featured job requests...\n');

    // Create 3 pending requests
    for (let i = 0; i < 3; i++) {
      const job = createdJobs[i];
      const agency = createdAgencies.find(a => a.uid === job.agencyId);

      const requestRef = db.collection('featuredRequests').doc();
      await requestRef.set({
        jobId: job.id,
        agencyId: agency.uid,
        status: 'pending',
        paymentMethod: ['bank_transfer', 'gcash', 'paymaya'][i % 3],
        paymentReference: `PAY-${Date.now()}-${i}`,
        paymentAmount: 5000,
        currency: 'PHP',
        notes: `Test featured request for ${job.title}`,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      console.log(`   ✅ Pending request: ${job.title}`);
    }

    // Create 1 approved request with featured job
    if (createdJobs.length > 3) {
      const job = createdJobs[3];
      const agency = createdAgencies.find(a => a.uid === job.agencyId);

      const requestRef = db.collection('featuredRequests').doc();
      await requestRef.set({
        jobId: job.id,
        agencyId: agency.uid,
        status: 'approved',
        paymentMethod: 'bank_transfer',
        paymentReference: `PAY-APPROVED-${Date.now()}`,
        paymentAmount: 5000,
        currency: 'PHP',
        notes: 'Approved featured request',
        createdAt: Timestamp.fromMillis(Date.now() - 86400000), // 1 day ago
        updatedAt: Timestamp.now(),
        approvedPriority: 1,
      });

      // Update job to be featured
      await db.collection('jobs').doc(job.id).update({
        isFeatured: true,
        featuredPriority: 1,
        featuredRequestId: requestRef.id,
        featuredAt: Timestamp.now(),
      });

      console.log(`   ✅ Approved & Featured: ${job.title}`);
    }

    // Create 1 rejected request
    if (createdJobs.length > 4) {
      const job = createdJobs[4];
      const agency = createdAgencies.find(a => a.uid === job.agencyId);

      const requestRef = db.collection('featuredRequests').doc();
      await requestRef.set({
        jobId: job.id,
        agencyId: agency.uid,
        status: 'rejected',
        paymentMethod: 'gcash',
        paymentReference: `PAY-REJECTED-${Date.now()}`,
        paymentAmount: 3000,
        currency: 'PHP',
        notes: 'Test rejected request',
        createdAt: Timestamp.fromMillis(Date.now() - 172800000), // 2 days ago
        updatedAt: Timestamp.now(),
        rejectionReason: 'Insufficient payment amount. Minimum featured job fee is PHP 5,000.',
      });

      console.log(`   ✅ Rejected request: ${job.title}`);
    }

    // Success summary
    console.log('\n' + '='.repeat(70));
    console.log('🎉 DATA SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(70));
    console.log('\n📊 Summary:');
    console.log(`   Agencies created:  ${createdAgencies.length}`);
    console.log(`   Jobs created:      ${createdJobs.length}`);
    console.log(`   Pending requests:  3`);
    console.log(`   Approved requests: 1 (job is featured)`);
    console.log(`   Rejected requests: 1`);
    console.log('\n📧 Test Agency Credentials:');
    testAgencies.forEach((agency, index) => {
      console.log(`   ${index + 1}. ${agency.email} / ${agency.password}`);
    });
    console.log('\n🔗 URLs:');
    console.log(`   Homepage (see featured job): http://localhost:3000`);
    console.log(`   Agency Dashboard:           http://localhost:3000/agency/dashboard`);
    console.log(`   Admin Requests:             http://localhost:3000/admin/featured-requests`);
    console.log(`   Admin Featured Jobs:        http://localhost:3000/admin/featured-jobs`);
    console.log('\n='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    throw error;
  }
}

// Run the script
seedData()
  .then(() => {
    console.log('✅ Seeding script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding script failed:', error);
    process.exit(1);
  });
