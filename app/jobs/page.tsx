'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs, DocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import { Job } from '@/types';
import JobList from '@/components/jobs/JobList';
import Header from '@/components/layout/Header';
import { Search, Filter, MapPin, Briefcase, DollarSign } from 'lucide-react';

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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadJobs();
  }, [selectedCountry, selectedJobType]);

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
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        job.title.toLowerCase().includes(search) ||
        job.companyName.toLowerCase().includes(search) ||
        job.location.toLowerCase().includes(search) ||
        job.skills.some((skill) => skill.toLowerCase().includes(search))
      );
    }
    if (minSalary && job.salaryMin) {
      return job.salaryMin >= parseInt(minSalary);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Header />

      {/* Search Section */}
      <div className="bg-white shadow-sm fixed top-16 left-0 right-0 w-full z-40 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Browse Jobs Abroad
          </h1>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search jobs, companies, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 md:w-auto"
            >
              <Filter size={20} />
              Filters
            </button>

            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Search
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Country Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Jobs List */}
      <div className="container mx-auto px-4 py-8 mt-[220px]">
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
