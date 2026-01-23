'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { collection, query, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { useOptionalAuth } from '@/contexts/AuthContext';
import { logUserActivity } from '@/lib/activity-helpers';
import { Job } from '@/types';
import {
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Sparkles,
  Globe,
} from 'lucide-react';
import HeroCarousel from '@/components/ui/HeroCarousel';
import LandingNav3Enhanced from '@/components/layout/LandingNav3Enhanced';
import Logo from '@/components/ui/Logo';
import Modal from '@/components/ui/Modal';
import JobCard from '@/components/jobs/JobCard';
import SignupModal from '@/components/auth/SignupModal';
import { motion } from 'framer-motion';
import { staggerContainer, listItemAnimation } from '@/lib/animations';
import { CATEGORIES } from '@/lib/categories';

interface HomeClientProps {
  initialFeaturedJobs: Job[];
  initialCategoryCounts: { [key: string]: number };
}

export default function HomeClient({
  initialFeaturedJobs,
  initialCategoryCounts,
}: HomeClientProps) {
  const pathname = usePathname();
  const { user } = useOptionalAuth();

  // Only render on homepage
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load saved jobs only when user is authenticated
  useEffect(() => {
    if (user) {
      loadSavedJobs();
    } else {
      setSavedJobs(new Set());
    }
  }, [user]);

  if (pathname !== '/') {
    return null;
  }

  const loadSavedJobs = async () => {
    if (!user) return;

    try {
      const db = getDbInstance();
      const savedJobsRef = collection(db, 'savedJobs', user.uid, 'jobs');
      const savedJobsSnapshot = await getDocs(query(savedJobsRef));
      const jobIds = savedJobsSnapshot.docs.map(doc => doc.id);
      setSavedJobs(new Set(jobIds));
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    }
  };

  const handleSave = async (jobId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const db = getDbInstance();
      const savedJobRef = doc(db, 'savedJobs', user.uid, 'jobs', jobId);

      if (savedJobs.has(jobId)) {
        await deleteDoc(savedJobRef);
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
        logUserActivity({
          userId: user.uid,
          userType: 'jobhunter',
          userName: user.displayName || 'Job Hunter',
          activityType: 'job_unsaved',
          title: 'Job Unsaved',
          description: 'Removed a job from saved list',
          resourceType: 'job',
          resourceId: jobId,
        });
      } else {
        await setDoc(savedJobRef, {
          savedAt: new Date(),
        });
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.add(jobId);
          return newSet;
        });
        logUserActivity({
          userId: user.uid,
          userType: 'jobhunter',
          userName: user.displayName || 'Job Hunter',
          activityType: 'job_saved',
          title: 'Job Saved',
          description: 'Saved a job to favorites',
          resourceType: 'job',
          resourceId: jobId,
        });
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job. Please try again.');
    }
  };

  const features = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Direct Messaging',
      description: 'Connect directly with recruitment agencies',
      detailedDescription: 'Skip the middleman and communicate directly with verified recruitment agencies. Our platform enables real-time messaging, allowing you to ask questions, discuss opportunities, and negotiate terms instantly.',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Opportunities',
      description: 'Find jobs worldwide from top companies',
      detailedDescription: 'Access thousands of international job opportunities from reputable companies across the globe. We partner with employers in major destinations including Middle East, Europe, Asia, and North America.',
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Verified Agencies',
      description: 'All agencies are verified and trusted',
      detailedDescription: 'Your safety is our priority. Every recruitment agency on our platform undergoes thorough verification including license checks, background screening, and compliance reviews to ensure legitimacy and trustworthiness.',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Matching',
      description: 'Get personalized job recommendations',
      detailedDescription: 'Our intelligent matching system analyzes your skills, experience, and preferences to recommend the most suitable job opportunities. Save time and increase your chances of finding the perfect role.',
    },
  ];

  return (
    <>
      <Suspense fallback={null}>
        <LandingNav3Enhanced />
      </Suspense>

      <main className="min-h-screen bg-white w-full pt-[6.5rem] md:pt-28">
        {/* Hero Carousel Section */}
        <section className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-4 md:pt-8 pb-8 md:pb-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
          >
            <HeroCarousel />
          </motion.div>
        </section>

        {/* Featured Jobs Section */}
        <section className="pt-16 md:pt-20 pb-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-6 md:mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">Featured Job Opportunities</h2>
              <p className="text-base md:text-lg text-gray-600 px-4">Discover your next career move with top international employers</p>
            </motion.div>
            {initialFeaturedJobs.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No jobs available yet. Check back soon!</p>
              </div>
            ) : (
              <>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
                >
                  {initialFeaturedJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      variants={listItemAnimation}
                      transition={{ delay: index * 0.05 }}
                    >
                      <JobCard
                        job={job}
                        onSave={handleSave}
                        isSaved={savedJobs.has(job.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* View All Jobs Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-center mt-6 md:mt-12"
                >
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 bg-white border-2 border-blue-600 text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-full text-sm md:text-base font-semibold hover:bg-blue-600 hover:text-white transition-all shadow-md hover:shadow-xl hover:scale-105"
                  >
                    View All Job Opportunities
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </section>

        {/* Job Categories */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Browse by Category</h2>
              <p className="text-gray-600">Explore opportunities in your field</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {CATEGORIES.map((category, index) => (
                <Link
                  key={index}
                  href={`/jobs?category=${encodeURIComponent(category.name)}`}
                  className="bg-white rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-200 hover:border-blue-300"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">{category.name}</h3>
                    <p className="text-xs text-gray-600">
                      {initialCategoryCounts[category.name] !== undefined
                        ? `${initialCategoryCounts[category.name]} jobs`
                        : '0 jobs'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose Job Agent PH?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're revolutionizing job hunting with innovative features designed for Filipino professionals
              </p>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={listItemAnimation}
                  whileHover={{ y: -8, scale: 1.05 }}
                  onClick={() => setSelectedFeature(index)}
                  className="text-center group cursor-pointer"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl text-blue-600 mb-4 group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white transition-all shadow-md group-hover:shadow-xl">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Join thousands of Filipinos who found their dream jobs abroad
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth/signup"
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl inline-flex items-center justify-center gap-2"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/jobs"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all inline-flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  Browse All Jobs
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Feature Modal */}
      {selectedFeature !== null && (
        <Modal
          isOpen={selectedFeature !== null}
          onClose={() => setSelectedFeature(null)}
          title={features[selectedFeature].title}
          description={features[selectedFeature].detailedDescription}
          icon={features[selectedFeature].icon}
        />
      )}

      {/* Auth Modal for Save Job */}
      <SignupModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        context={{
          action: 'save',
          title: 'Sign up to save jobs',
          description: 'Create a free account to save and organize your job searches',
          benefit: 'Build your personalized job collection and never lose track of opportunities',
          returnUrl: '/',
        }}
      />
    </>
  );
}
