'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, query, where, orderBy, limit, getDocs, DocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import { Job } from '@/types';
import JobList from '@/components/jobs/JobList';
import HeaderDesign1Enhanced from '@/components/layout/HeaderDesign1Enhanced';
import { Search, Filter, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { getCategoryNames } from '@/lib/categories';

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

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Read category from URL params on mount
  useEffect(() => {
    const categoryParam = searchParams?.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setShowFilters(true); // Auto-show filters when category is selected
    }
  }, [searchParams]);

  useEffect(() => {
    loadJobs();
  }, [selectedCountry, selectedJobType, selectedCategory]);

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

      const q = query(jobsRef, ...constraints);
      const querySnapshot = await getDocs(q);

      const jobsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        postedAt: doc.data().postedAt?.toDate() || new Date(),
      })) as Job[];

      if (loadMore) {
        setJobs([...jobs, ...jobsData]);
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
  };

  const handleLoadMore = () => {
    loadJobs(true);
  };

  const filteredJobs = jobs.filter((job) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header with Integrated Search, Filters, and Search Button */}
      <HeaderDesign1Enhanced
        searchPlaceholder="Search jobs, companies, skills..."
        showFiltersButton={true}
        showSearchButton={true}
        onFiltersClick={() => setShowFilters(!showFilters)}
        onSearchButtonClick={handleSearch}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        showNavigation={false}
      />

      {/* Filters Panel - Below Header */}
      {showFilters && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md">
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
      <div className={`container mx-auto px-4 py-8 ${showFilters ? 'mt-[200px] md:mt-[140px]' : 'mt-20'}`}>
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
  );
}
