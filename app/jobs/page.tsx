'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, query, where, orderBy, limit, getDocs, DocumentSnapshot, startAfter, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import { Job } from '@/types';
import JobList from '@/components/jobs/JobList';
import { Search, Filter, MapPin, Briefcase, DollarSign, X, Building2 } from 'lucide-react';
import { getCategoryNames } from '@/lib/categories';
import { useOnboarding } from '@/contexts/OnboardingContext';
import ListingHeader from '@/components/layout/ListingHeader';

const COUNTRIES = [
  { code: 'AE', name: 'UAE (Middle East)' },
  { code: 'SA', name: 'Saudi Arabia (Middle East)' },
  { code: 'QA', name: 'Qatar (Middle East)' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'JP', name: 'Japan' },
  { code: 'UK', name: 'United Kingdom (Europe)' },
  { code: 'DE', name: 'Germany (Europe)' },
  { code: 'IT', name: 'Italy (Europe)' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
];

const JOB_TYPES = ['full-time', 'part-time', 'contract'];

function JobsPageContent() {
  const searchParams = useSearchParams();
  const { onboardingData, startTour } = useOnboarding();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterRemote, setFilterRemote] = useState(false);
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [mobileSearchExpanded, setMobileSearchExpanded] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState('');
  const [agencyName, setAgencyName] = useState('');

  // Start search-filters tour for first-time users
  useEffect(() => {
    if (onboardingData && !onboardingData.featuresTours['search-filters'] && !loading && jobs.length > 0) {
      const timer = setTimeout(() => {
        startTour('search-filters');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [onboardingData, loading, jobs.length, startTour]);

  // Read all filter params from URL on mount
  useEffect(() => {
    const categoryParam = searchParams?.get('category');
    const locationParam = searchParams?.get('location');
    const typeParam = searchParams?.get('type');
    const featuredParam = searchParams?.get('featured');
    const salaryParam = searchParams?.get('salary');
    const agencyParam = searchParams?.get('agency');

    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setShowFilters(true);
    }

    // Handle agency filter
    if (agencyParam) {
      setSelectedAgency(agencyParam);
      // Fetch agency name
      const fetchAgencyName = async () => {
        try {
          const agencyDoc = await getDoc(doc(db, COLLECTIONS.AGENCIES, agencyParam));
          if (agencyDoc.exists()) {
            const agencyData = agencyDoc.data();
            setAgencyName(agencyData.companyName || agencyData.displayName || 'Unknown Agency');
          }
        } catch (error) {
          console.error('Error fetching agency name:', error);
          setAgencyName('Unknown Agency');
        }
      };
      fetchAgencyName();
    }

    // Map location parameter to country code or remote filter
    if (locationParam) {
      if (locationParam === 'remote') {
        setFilterRemote(true);
        setShowFilters(true);
      } else {
        const locationMap: Record<string, string> = {
          'dubai': 'AE',
          'singapore': 'SG',
          'saudi': 'SA',
          'qatar': 'QA',
          'hongkong': 'HK',
          'taiwan': 'TW',
          'japan': 'JP',
          'uk': 'UK',
          'germany': 'DE',
          'italy': 'IT',
          'canada': 'CA',
          'australia': 'AU',
        };

        if (locationMap[locationParam]) {
          setSelectedCountry(locationMap[locationParam]);
          setShowFilters(true);
        }
      }
    }

    // Map job type parameter
    if (typeParam === 'full-time' || typeParam === 'part-time' || typeParam === 'contract') {
      setSelectedJobType(typeParam);
      setShowFilters(true);
    }

    // Handle salary filter
    if (salaryParam === 'high') {
      setMinSalary('100000'); // Set high salary threshold
      setShowFilters(true);
    }

    // Handle featured filter
    if (featuredParam === 'true') {
      setFilterFeatured(true);
      setShowFilters(true);
    }
  }, [searchParams]);

  useEffect(() => {
    // Reset pagination when filters change
    setLastDoc(null);
    setHasMore(true);
    loadJobs();
  }, [selectedCountry, selectedJobType, selectedCategory, filterRemote, filterFeatured, selectedAgency]);

  const loadJobs = async (loadMore = false) => {
    try {
      setLoading(true);

      const jobsRef = collection(db, COLLECTIONS.JOBS);
      const constraints: any[] = [
        where('isActive', '==', true),
        orderBy('postedAt', 'desc'),
        limit(12),
      ];

      if (selectedCountry) {
        constraints.push(where('country', '==', selectedCountry));
      }

      if (selectedJobType) {
        constraints.push(where('jobType', '==', selectedJobType));
      }

      if (selectedCategory) {
        constraints.push(where('category', '==', selectedCategory));
      }

      if (filterRemote) {
        constraints.push(where('locationType', '==', 'remote'));
      }

      if (filterFeatured) {
        constraints.push(where('isFeatured', '==', true));
      }

      if (selectedAgency) {
        constraints.push(where('agencyId', '==', selectedAgency));
      }

      // Add pagination cursor if loading more
      if (loadMore && lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      const q = query(jobsRef, ...constraints);
      const querySnapshot = await getDocs(q);

      const jobsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        postedAt: doc.data().postedAt?.toDate() || new Date(),
      })) as Job[];

      if (loadMore) {
        // Create a Set of existing job IDs to prevent duplicates
        const existingIds = new Set(jobs.map(j => j.id));
        const uniqueNewJobs = jobsData.filter(job => !existingIds.has(job.id));
        setJobs([...jobs, ...uniqueNewJobs]);
      } else {
        setJobs(jobsData);
      }

      setLastDoc(
        querySnapshot.docs.length > 0
          ? querySnapshot.docs[querySnapshot.docs.length - 1]
          : null
      );
      setHasMore(querySnapshot.docs.length === 12);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadJobs();
    setShowFilters(false); // Close filters after search to show results
    setSearchPerformed(true); // Hide filter/search buttons after search
  };

  const handleLoadMore = () => {
    loadJobs(true);
  };

  // OPTIMIZATION: Memoize filtered jobs to prevent recomputation on every render
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search term filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch = (
          job.title.toLowerCase().includes(search) ||
          job.companyName.toLowerCase().includes(search) ||
          job.location.toLowerCase().includes(search) ||
          job.skills.some((skill) => skill.toLowerCase().includes(search))
        );
        if (!matchesSearch) return false;
      }

      // Minimum salary filter
      if (minSalary && job.salaryMin) {
        if (job.salaryMin < parseInt(minSalary)) return false;
      }

      return true;
    });
  }, [jobs, searchTerm, minSalary]);

  return (
    <>
      <ListingHeader
        breadcrumbs={[{ label: 'Jobs' }]}
        searchPlaceholder="Search jobs, companies, skills..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearch}
        onFilterClick={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
        showSearchButton={true}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Search Bar - Expandable & Sticky (kept for mobile) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          {!mobileSearchExpanded ? (
            // Collapsed state - Shows placeholder button
            <button
              onClick={() => setMobileSearchExpanded(true)}
              data-tour="search-bar"
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-left active:bg-gray-100 transition-colors"
            >
              <Search className="text-gray-400 w-5 h-5 flex-shrink-0" />
              <span className="text-gray-500">Job title, skills</span>
            </button>
          ) : (
            // Expanded state - Shows actual input with close button
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSearchPerformed(false); // Show buttons again when user starts typing
                    }}
                    placeholder="Job title, skills"
                    autoFocus
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => {
                    setMobileSearchExpanded(false);
                    setSearchTerm('');
                  }}
                  className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Quick action buttons - Hidden after search is performed */}
              {!searchPerformed && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    data-tour="filter-button"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      showFilters
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Filters</span>
                  </button>
                  {searchTerm && (
                    <button
                      onClick={handleSearch}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Search
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filters Panel - Below Header */}
      {showFilters && (
        <div className="fixed top-[140px] md:top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Filter size={16} />
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">All Categories</option>
                  {getCategoryNames().map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">All Countries</option>
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Briefcase size={16} />
                  Job Type
                </label>
                <select
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">All Types</option>
                  {JOB_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.replace('-', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minimum Salary Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign size={16} />
                  Minimum Salary
                </label>
                <input
                  type="number"
                  placeholder="e.g., 50000"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Jobs List */}
      <div className={`container mx-auto px-4 py-8 ${showFilters ? 'mt-[340px] md:mt-[140px]' : 'mt-[72px] md:mt-20'}`}>
        {/* Agency Filter Badge */}
        {selectedAgency && agencyName && (
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 border-2 border-blue-200 text-blue-700 px-4 py-2 rounded-lg">
              <Building2 className="w-5 h-5" />
              <span className="font-medium">Filtered by: {agencyName}</span>
              <button
                onClick={() => {
                  setSelectedAgency('');
                  setAgencyName('');
                  // Update URL to remove agency parameter
                  window.history.pushState({}, '', '/jobs');
                }}
                className="ml-2 p-1 hover:bg-blue-100 rounded-full transition-colors"
                aria-label="Clear agency filter"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
          </p>
        </div>

        <JobList
          jobs={filteredJobs}
          loading={loading}
          onLoadMore={handleLoadMore}
          hasMore={hasMore && searchTerm === '' && minSalary === ''}
        />
      </div>
    </div>
    </>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    }>
      <JobsPageContent />
    </Suspense>
  );
}
