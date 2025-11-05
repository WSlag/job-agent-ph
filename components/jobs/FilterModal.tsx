'use client';

import React, { useState } from 'react';
import { X, Filter, Check } from 'lucide-react';
import { BottomSheet, Chip, ChipGroup } from '@/components/ui';
import { COUNTRY_FLAGS } from '@/lib/colors';

interface FilterOptions {
  jobTypes: string[];
  salaryRange: { min: number; max: number };
  postedDate: string;
  countries: string[];
  agencyRating: number;
  benefits: string[];
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: Partial<FilterOptions>;
  onApply: (filters: Partial<FilterOptions>) => void;
  resultCount?: number;
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'];

const POSTED_DATE_OPTIONS = [
  { value: 'any', label: 'Any time' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
];

const POPULAR_COUNTRIES = [
  { code: 'SAUDI_ARABIA', name: 'Saudi Arabia', flag: COUNTRY_FLAGS.SAUDI_ARABIA },
  { code: 'UAE', name: 'UAE', flag: COUNTRY_FLAGS.UAE },
  { code: 'SINGAPORE', name: 'Singapore', flag: COUNTRY_FLAGS.SINGAPORE },
  { code: 'HONG_KONG', name: 'Hong Kong', flag: COUNTRY_FLAGS.HONG_KONG },
  { code: 'KUWAIT', name: 'Kuwait', flag: COUNTRY_FLAGS.KUWAIT },
  { code: 'QATAR', name: 'Qatar', flag: COUNTRY_FLAGS.QATAR },
  { code: 'JAPAN', name: 'Japan', flag: COUNTRY_FLAGS.JAPAN },
  { code: 'CANADA', name: 'Canada', flag: COUNTRY_FLAGS.CANADA },
];

const BENEFITS_OPTIONS = [
  'Housing Allowance',
  'Transportation',
  'Health Insurance',
  'Visa Sponsorship',
  'Flight Tickets',
  'Meals Provided',
  'Annual Leave',
  'End of Service Benefits',
];

/**
 * FilterModal Component
 *
 * Comprehensive job filter modal using BottomSheet
 * Supports multiple filter types with real-time result count
 */
export default function FilterModal({
  isOpen,
  onClose,
  currentFilters,
  onApply,
  resultCount,
}: FilterModalProps) {
  const [filters, setFilters] = useState<Partial<FilterOptions>>(currentFilters);

  const handleJobTypeToggle = (type: string) => {
    const current = filters.jobTypes || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    setFilters({ ...filters, jobTypes: updated });
  };

  const handleCountryToggle = (countryCode: string) => {
    const current = filters.countries || [];
    const updated = current.includes(countryCode)
      ? current.filter(c => c !== countryCode)
      : [...current, countryCode].slice(0, 5); // Max 5
    setFilters({ ...filters, countries: updated });
  };

  const handleBenefitToggle = (benefit: string) => {
    const current = filters.benefits || [];
    const updated = current.includes(benefit)
      ? current.filter(b => b !== benefit)
      : [...current, benefit];
    setFilters({ ...filters, benefits: updated });
  };

  const handleReset = () => {
    setFilters({});
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof FilterOptions];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== undefined && v !== 0);
    }
    return value !== undefined && value !== '';
  }).length;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Jobs"
      showDragHandle
      snapPoint="full"
    >
      <div className="px-6 py-4 space-y-6 pb-24">
        {/* Job Type */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Job Type</h3>
          <div className="space-y-2">
            {JOB_TYPES.map((type) => (
              <label
                key={type}
                className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.jobTypes?.includes(type) || false}
                  onChange={() => handleJobTypeToggle(type)}
                  className="w-5 h-5 text-primary-600 rounded"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            Monthly Salary (PHP)
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="minSalary" className="text-xs text-gray-600 mb-1 block">
                Minimum: ₱{(filters.salaryRange?.min || 10000).toLocaleString()}
              </label>
              <input
                id="minSalary"
                type="range"
                min="10000"
                max="150000"
                step="5000"
                value={filters.salaryRange?.min || 10000}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    salaryRange: {
                      ...filters.salaryRange,
                      min: parseInt(e.target.value),
                      max: filters.salaryRange?.max || 200000,
                    },
                  })
                }
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="maxSalary" className="text-xs text-gray-600 mb-1 block">
                Maximum: ₱{(filters.salaryRange?.max || 200000).toLocaleString()}
              </label>
              <input
                id="maxSalary"
                type="range"
                min="20000"
                max="300000"
                step="10000"
                value={filters.salaryRange?.max || 200000}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    salaryRange: {
                      min: filters.salaryRange?.min || 10000,
                      max: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Posted Date */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Posted Date</h3>
          <div className="space-y-2">
            {POSTED_DATE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  name="postedDate"
                  checked={filters.postedDate === option.value}
                  onChange={() => setFilters({ ...filters, postedDate: option.value })}
                  className="w-5 h-5 text-primary-600"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Countries
          </h3>
          <p className="text-xs text-gray-600 mb-3">Select up to 5 countries</p>
          <ChipGroup>
            {POPULAR_COUNTRIES.map((country) => (
              <Chip
                key={country.code}
                label={`${country.flag} ${country.name}`}
                variant="primary"
                clickable
                selected={filters.countries?.includes(country.code) || false}
                onClick={() => handleCountryToggle(country.code)}
              />
            ))}
          </ChipGroup>
          {filters.countries && filters.countries.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {filters.countries.length}/5 countries selected
            </p>
          )}
        </div>

        {/* Agency Rating */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            Minimum Agency Rating
          </h3>
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilters({ ...filters, agencyRating: rating })}
                className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-all ${
                  filters.agencyRating === rating
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 text-gray-600 hover:border-primary-300'
                }`}
              >
                {rating}★
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Selected: {filters.agencyRating || 0}★ and above
          </p>
        </div>

        {/* Benefits */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Benefits Included</h3>
          <ChipGroup>
            {BENEFITS_OPTIONS.map((benefit) => (
              <Chip
                key={benefit}
                label={benefit}
                variant="default"
                clickable
                selected={filters.benefits?.includes(benefit) || false}
                onClick={() => handleBenefitToggle(benefit)}
              />
            ))}
          </ChipGroup>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center gap-3 z-10">
        <button
          onClick={handleReset}
          className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
        >
          Apply {activeFilterCount > 0 && `(${activeFilterCount})`}
          {resultCount !== undefined && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {resultCount} jobs
            </span>
          )}
        </button>
      </div>
    </BottomSheet>
  );
}
