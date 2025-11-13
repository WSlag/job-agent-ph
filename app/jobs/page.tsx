'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, query, where, orderBy, limit, getDocs, DocumentSnapshot, startAfter, doc, getDoc } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import { Job } from '@/types';
import JobList from '@/components/jobs/JobList';
import { Search, Filter, MapPin, Briefcase, DollarSign, X, Building2 } from 'lucide-react';
import { getCategoryNames } from '@/lib/categories';
import { useOnboarding } from '@/contexts/OnboardingContext';
import ListingHeader from '@/components/layout/ListingHeader';
import { useScrollDirection } from '@/hooks/useScrollDirection';

// Country list matching database values (full names, not codes)
const COUNTRIES = [
  'Philippines',
  'Singapore',
  'Malaysia',
  'Thailand',
  'Vietnam',
  'Indonesia',
  'Japan',
  'South Korea',
  'Hong Kong',
  'Taiwan',
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'Kuwait',
  'United Kingdom',
  'Germany',
  'Italy',
  'Canada',
  'Australia',
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
  const [filterHighSalary, setFilterHighSalary] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [mobileSearchExpanded, setMobileSearchExpanded] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  // Scroll direction detection for filter panel visibility
  const scrollDirection = useScrollDirection({ threshold: 10, minScrollY: 80 });
  const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(true);

  // Detect mobile viewport for conditional body scroll blocking
  // Initialize synchronously to prevent race condition with URL param reading
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768; // 768px = Tailwind 'md' breakpoint
    }
    return false;
  });

  // Detect screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px = Tailwind 'md' breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Start search-filters tour for first-time users
  useEffect(() => {
    if (onboardingData && !onboardingData.featuresTours['search-filters'] && !loading && jobs.length > 0) {
      const timer = setTimeout(() => {
        startTour('search-filters');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [onboardingData, loading, jobs.length, startTour]);

  // Control filter panel visibility based on scroll direction
  useEffect(() => {
    if (!showFilters) return; // Don't hide if filters aren't even open

    if (scrollDirection === 'down') {
      setIsFilterPanelVisible(false);
    } else if (scrollDirection === 'up') {
      setIsFilterPanelVisible(true);
    }
  }, [scrollDirection, showFilters]);

  // Block body scroll when filters are open - ONLY on mobile
  // On desktop, allow scrolling so scroll-based filter visibility can work
  useEffect(() => {
    if (showFilters && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFilters, isMobile]);

  // Read all filter params from URL on mount
  useEffect(() => {
    const categoryParam = searchParams?.get('category');
    const locationParam = searchParams?.get('location');
    const typeParam = searchParams?.get('type');
    const featuredParam = searchParams?.get('featured');
    const salaryParam = searchParams?.get('salary');
    const agencyParam = searchParams?.get('agency');
    const searchParam = searchParams?.get('q');

    // Handle search query from URL
    if (searchParam) {
      setSearchTerm(searchParam);
    }

    if (categoryParam) {
      setSelectedCategory(categoryParam);
      // On mobile, explicitly close filters so users can see job results
      // On desktop, open filters to show what's applied
      if (isMobile) {
        setShowFilters(false);
      } else {
        setShowFilters(true);
      }
    }

    // Handle agency filter
    if (agencyParam) {
      setSelectedAgency(agencyParam);
      // Fetch agency name
      const fetchAgencyName = async () => {
        try {
          const db = getDbInstance();
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
        // Only open filters on desktop
        if (!isMobile) {
          setShowFilters(true);
        }
      } else {
        // Map location parameter to full country names (as stored in database)
        const locationMap: Record<string, string> = {
          'dubai': 'United Arab Emirates',
          'singapore': 'Singapore',
          'saudi': 'Saudi Arabia',
          'qatar': 'Qatar',
          'hongkong': 'Hong Kong',
          'taiwan': 'Taiwan',
          'japan': 'Japan',
          'uk': 'United Kingdom',
          'germany': 'Germany',
          'italy': 'Italy',
          'canada': 'Canada',
          'australia': 'Australia',
          'philippines': 'Philippines',
          'malaysia': 'Malaysia',
          'thailand': 'Thailand',
          'vietnam': 'Vietnam',
          'indonesia': 'Indonesia',
          'korea': 'South Korea',
          'kuwait': 'Kuwait',
        };

        if (locationMap[locationParam]) {
          setSelectedCountry(locationMap[locationParam]);
          // Only open filters on desktop
          if (!isMobile) {
            setShowFilters(true);
          }
        }
      }
    }

    // Map job type parameter
    if (typeParam === 'full-time' || typeParam === 'part-time' || typeParam === 'contract') {
      setSelectedJobType(typeParam);
      // Only open filters on desktop
      if (!isMobile) {
        setShowFilters(true);
      }
    }

    // Handle salary filter
    if (salaryParam === 'high') {
      setFilterHighSalary(true);
      setMinSalary('100000'); // Also set minSalary for display purposes
      // Only open filters on desktop
      if (!isMobile) {
        setShowFilters(true);
      }
    }

    // Handle featured filter
    if (featuredParam === 'true') {
      setFilterFeatured(true);
      // Only open filters on desktop
      if (!isMobile) {
        setShowFilters(true);
      }
    }
  }, [searchParams, isMobile]);

  useEffect(() => {
    // Reset pagination when filters change
    setLastDoc(null);
    setHasMore(true);
    setIsFiltering(true);
    loadJobs();
  }, [selectedCountry, selectedJobType, selectedCategory, filterRemote, filterFeatured, filterHighSalary, selectedAgency]);

  const loadJobs = async (loadMore = false) => {
    try {
      setLoading(true);

      const db = getDbInstance();
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

      if (filterHighSalary) {
        constraints.push(where('salaryMin', '>=', 100000));
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
      setIsFiltering(false);
    }
  };

  const handleSearch = () => {
    loadJobs();
    setShowFilters(false); // Close filters after search to show results
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

      // Minimum salary filter (only for custom minSalary input, not for filterHighSalary)
      if (minSalary && !filterHighSalary && job.salaryMin) {
        if (job.salaryMin < parseInt(minSalary)) return false;
      }

      return true;
    });
  }, [jobs, searchTerm, minSalary, filterHighSalary]);

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
                    onChange={(e) => setSearchTerm(e.target.value)}
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

              {/* Quick action buttons - Always visible */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  data-tour="filter-button"
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    showFilters
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filters</span>
                </button>
                <button
                  onClick={handleSearch}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters Panel - Below Header */}
      {showFilters && (
        <div className={`fixed top-[140px] md:top-16 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-md max-h-[60vh] overflow-y-auto transition-all duration-300 ease-in-out ${
          isFilterPanelVisible
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0'
        }`}>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">All Countries</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Jobs List */}
      <div className={`container mx-auto px-4 py-8 transition-all duration-300 ${showFilters ? 'mt-[340px] md:mt-[140px]' : 'mt-[72px] md:mt-20'}`}>
        {/* Active Filter Pills */}
        {(selectedAgency || filterRemote || selectedJobType || selectedCountry || filterFeatured || minSalary || filterHighSalary) && (
          <div className="mb-6 px-2 md:px-0">
            <div className="flex flex-wrap items-center gap-2.5 md:gap-2">
              <span className="text-sm md:text-sm font-medium text-gray-700 w-full md:w-auto mb-1 md:mb-0">Active Filters:</span>

              {/* Agency Filter Badge */}
              {selectedAgency && agencyName && (
                <div className="inline-flex items-center gap-2 md:gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 md:px-3 md:py-1.5 rounded-full text-sm md:text-sm min-h-[44px] md:min-h-0">
                  <Building2 className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{agencyName}</span>
                  <button
                    onClick={() => {
                      setSelectedAgency('');
                      setAgencyName('');
                      window.history.pushState({}, '', '/jobs');
                    }}
                    className="hover:bg-blue-100 rounded-full transition-colors p-1 min-w-[24px] min-h-[24px] flex items-center justify-center"
                    aria-label="Clear agency filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Remote Filter Badge */}
              {filterRemote && (
                <div className="inline-flex items-center gap-2 md:gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 md:px-3 md:py-1.5 rounded-full text-sm md:text-sm min-h-[44px] md:min-h-0">
                  <span>🌏 Remote</span>
                  <button
                    onClick={() => {
                      setFilterRemote(false);
                      window.history.pushState({}, '', '/jobs');
                    }}
                    className="hover:bg-green-100 rounded-full transition-colors p-1 min-w-[24px] min-h-[24px] flex items-center justify-center"
                    aria-label="Clear remote filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Job Type Filter Badge */}
              {selectedJobType && (
                <div className="inline-flex items-center gap-2 md:gap-2 bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2 md:px-3 md:py-1.5 rounded-full text-sm md:text-sm min-h-[44px] md:min-h-0">
                  <span>💼 {selectedJobType.replace('-', ' ').toUpperCase()}</span>
                  <button
                    onClick={() => {
                      setSelectedJobType('');
                      window.history.pushState({}, '', '/jobs');
                    }}
                    className="hover:bg-purple-100 rounded-full transition-colors p-1 min-w-[24px] min-h-[24px] flex items-center justify-center"
                    aria-label="Clear job type filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Country Filter Badge */}
              {selectedCountry && (
                <div className="inline-flex items-center gap-2 md:gap-2 bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 md:px-3 md:py-1.5 rounded-full text-sm md:text-sm min-h-[44px] md:min-h-0">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{selectedCountry}</span>
                  <button
                    onClick={() => {
                      setSelectedCountry('');
                      window.history.pushState({}, '', '/jobs');
                    }}
                    className="hover:bg-orange-100 rounded-full transition-colors p-1 min-w-[24px] min-h-[24px] flex items-center justify-center"
                    aria-label="Clear country filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Featured Filter Badge */}
              {filterFeatured && (
                <div className="inline-flex items-center gap-2 md:gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 md:px-3 md:py-1.5 rounded-full text-sm md:text-sm min-h-[44px] md:min-h-0">
                  <span>✨ Featured</span>
                  <button
                    onClick={() => {
                      setFilterFeatured(false);
                      window.history.pushState({}, '', '/jobs');
                    }}
                    className="hover:bg-yellow-100 rounded-full transition-colors p-1 min-w-[24px] min-h-[24px] flex items-center justify-center"
                    aria-label="Clear featured filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* High Salary Filter Badge */}
              {(minSalary || filterHighSalary) && (
                <div className="inline-flex items-center gap-2 md:gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 md:px-3 md:py-1.5 rounded-full text-sm md:text-sm min-h-[44px] md:min-h-0">
                  <span>💰 {filterHighSalary ? 'High Salary' : `Salary ≥ ${parseInt(minSalary).toLocaleString()}`}</span>
                  <button
                    onClick={() => {
                      setMinSalary('');
                      setFilterHighSalary(false);
                      window.history.pushState({}, '', '/jobs');
                    }}
                    className="hover:bg-emerald-100 rounded-full transition-colors p-1 min-w-[24px] min-h-[24px] flex items-center justify-center"
                    aria-label="Clear salary filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Clear All Button */}
              <button
                onClick={() => {
                  setSelectedAgency('');
                  setAgencyName('');
                  setFilterRemote(false);
                  setSelectedJobType('');
                  setSelectedCountry('');
                  setFilterFeatured(false);
                  setMinSalary('');
                  setFilterHighSalary(false);
                  window.history.pushState({}, '', '/jobs');
                }}
                className="inline-flex items-center justify-center gap-1 px-4 py-2 md:px-0 md:py-0 bg-gray-100 md:bg-transparent border border-gray-300 md:border-0 rounded-full md:rounded-none text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-200 md:hover:bg-transparent font-medium md:underline min-h-[44px] md:min-h-0 w-full md:w-auto mt-1 md:mt-0 transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isFiltering && (
          <div className="mb-6 flex items-center gap-3 text-blue-600">
            <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm font-medium">Applying filters...</span>
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Empty Results Feedback */}
        {!loading && !isFiltering && filteredJobs.length === 0 && (selectedCountry || selectedJobType || filterRemote || filterFeatured || minSalary || filterHighSalary || searchTerm) && (
          <div className="max-w-lg mx-auto text-center py-12">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? `No jobs match your search "${searchTerm}" with the current filters.`
                : "No jobs match your current filters."}
            </p>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Try:</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Clearing some filters to see more results</li>
                <li>• Using different search keywords</li>
                <li>• Checking back later for new opportunities</li>
              </ul>
            </div>
            <button
              onClick={() => {
                setSelectedAgency('');
                setAgencyName('');
                setFilterRemote(false);
                setSelectedJobType('');
                setSelectedCountry('');
                setFilterFeatured(false);
                setMinSalary('');
                setFilterHighSalary(false);
                setSearchTerm('');
                window.history.pushState({}, '', '/jobs');
              }}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          </div>
        )}

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
