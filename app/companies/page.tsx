'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Card from '@/components/ui/Card';
import Section from '@/components/ui/Section';
import Badge from '@/components/ui/Badge';
import { Building2, MapPin, Briefcase, CheckCircle, Search } from 'lucide-react';
import Link from 'next/link';
import HeaderDesign1Enhanced from '@/components/layout/HeaderDesign1Enhanced';

interface Agency {
  id: string;
  companyName: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  verified: boolean;
  createdAt: any;
  jobCount?: number;
}

export default function CompaniesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAgencies();
  }, []);

  const loadAgencies = async () => {
    try {
      setLoading(true);

      // Get agencies (limit to 50 for now)
      const agenciesRef = collection(db, 'agencies');
      const agenciesQuery = query(agenciesRef, limit(50));
      const agenciesSnapshot = await getDocs(agenciesQuery);

      const agenciesData: Agency[] = agenciesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Agency));

      // Get job counts for each agency
      for (const agency of agenciesData) {
        const jobsRef = collection(db, 'jobs');
        const jobsQuery = query(
          jobsRef,
          where('agencyId', '==', agency.id),
          where('isActive', '==', true)
        );
        const jobsSnapshot = await getDocs(jobsQuery);
        agency.jobCount = jobsSnapshot.size;
      }

      // Sort by verified status and job count
      agenciesData.sort((a, b) => {
        if (a.verified !== b.verified) return a.verified ? -1 : 1;
        return (b.jobCount || 0) - (a.jobCount || 0);
      });

      setAgencies(agenciesData);
    } catch (error) {
      console.error('Error loading agencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgencies = agencies.filter(agency =>
    agency.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (agency.description && agency.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderDesign1Enhanced />

      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-6">Browse Companies</h1>
          <p className="text-xl text-blue-100">
            Discover companies hiring on Job Agency PH
          </p>
        </div>
      </Section>

      <Section className="py-12">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8">
            {/* Mobile: Compact Layout */}
            <div className="md:hidden flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs bg-gray-50"
                />
              </div>
            </div>

            {/* Desktop: Original Layout */}
            <div className="hidden md:block relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search companies by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{agencies.length}</div>
              <div className="text-gray-600">Total Companies</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {agencies.filter(a => a.verified).length}
              </div>
              <div className="text-gray-600">Verified Companies</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {agencies.reduce((sum, a) => sum + (a.jobCount || 0), 0)}
              </div>
              <div className="text-gray-600">Active Job Openings</div>
            </Card>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading companies...</p>
            </div>
          )}

          {/* Companies List */}
          {!loading && filteredAgencies.length === 0 && (
            <Card className="p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No companies found</h2>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'No companies are currently registered'}
              </p>
            </Card>
          )}

          {!loading && filteredAgencies.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgencies.map((agency) => (
                <Card key={agency.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {agency.logoUrl ? (
                        <img
                          src={agency.logoUrl}
                          alt={agency.companyName}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {agency.companyName}
                        </h3>
                        {agency.verified && (
                          <Badge variant="success" className="mt-1">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {agency.description && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {agency.description}
                    </p>
                  )}

                  {agency.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{agency.address}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Briefcase className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {agency.jobCount || 0} active {agency.jobCount === 1 ? 'job' : 'jobs'}
                    </span>
                  </div>

                  {agency.website && (
                    <a
                      href={agency.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 block truncate"
                    >
                      {agency.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}

                  <Link
                    href={`/jobs?agency=${agency.id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    View Open Positions
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Call to Action */}
      <Section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Are You an Employer?</h2>
          <p className="text-gray-600 mb-8">
            Join our platform and connect with thousands of qualified job seekers in the Philippines
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Register Your Company
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
