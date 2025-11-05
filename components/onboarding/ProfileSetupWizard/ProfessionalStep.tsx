'use client';

import React, { useState } from 'react';
import { Chip, ChipGroup } from '@/components/ui';

interface ProfessionalData {
  jobTitle: string;
  yearsOfExperience: string;
  industry: string;
  education: string;
  fieldOfStudy: string;
}

interface ProfessionalStepProps {
  data?: ProfessionalData;
  onNext: () => void;
  onUpdate: (data: ProfessionalData) => void;
}

const POPULAR_INDUSTRIES = [
  'Healthcare',
  'Hospitality',
  'Construction',
  'IT & Technology',
  'Engineering',
  'Domestic Work',
  'Manufacturing',
  'Education',
];

const EDUCATION_LEVELS = [
  'High School Graduate',
  'Vocational/Technical',
  'Some College',
  'College Graduate',
  'Master\'s Degree',
  'Doctorate',
];

/**
 * ProfessionalStep Component
 *
 * Step 3 of Profile Setup Wizard (60% complete)
 * Collects: Job Title, Experience, Industry, Education, Field of Study
 */
export default function ProfessionalStep({
  data,
  onNext,
  onUpdate,
}: ProfessionalStepProps) {
  const [formData, setFormData] = useState<ProfessionalData>(
    data || {
      jobTitle: '',
      yearsOfExperience: '',
      industry: '',
      education: '',
      fieldOfStudy: '',
    }
  );

  const handleChange = (field: keyof ProfessionalData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleIndustrySelect = (industry: string) => {
    handleChange('industry', industry);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.jobTitle &&
      formData.yearsOfExperience &&
      formData.industry &&
      formData.education
    ) {
      onNext();
    }
  };

  const isFormValid =
    formData.jobTitle &&
    formData.yearsOfExperience &&
    formData.industry &&
    formData.education;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Professional Background
        </h2>
        <p className="text-gray-600">
          Tell us about your work experience
        </p>
      </div>

      {/* Job Title */}
      <div>
        <label
          htmlFor="jobTitle"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Current/Most Recent Job Title <span className="text-error-500">*</span>
        </label>
        <input
          id="jobTitle"
          type="text"
          required
          value={formData.jobTitle}
          onChange={(e) => handleChange('jobTitle', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="e.g., Registered Nurse, Chef, Construction Worker"
          list="job-suggestions"
        />
        <datalist id="job-suggestions">
          <option value="Registered Nurse" />
          <option value="Caregiver" />
          <option value="Domestic Helper" />
          <option value="Chef / Cook" />
          <option value="Construction Worker" />
          <option value="Engineer" />
          <option value="Teacher" />
        </datalist>
      </div>

      {/* Years of Experience */}
      <div>
        <label
          htmlFor="yearsOfExperience"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Years of Experience <span className="text-error-500">*</span>
        </label>
        <select
          id="yearsOfExperience"
          required
          value={formData.yearsOfExperience}
          onChange={(e) => handleChange('yearsOfExperience', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Select years of experience</option>
          <option value="0-1">Less than 1 year</option>
          <option value="1-3">1-3 years</option>
          <option value="3-5">3-5 years</option>
          <option value="5-10">5-10 years</option>
          <option value="10+">More than 10 years</option>
        </select>
      </div>

      {/* Industry */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Industry/Field <span className="text-error-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Select from popular industries or type your own
        </p>

        {/* Popular industries as chips */}
        <ChipGroup className="mb-3">
          {POPULAR_INDUSTRIES.map((industry) => (
            <Chip
              key={industry}
              label={industry}
              variant="primary"
              clickable
              selected={formData.industry === industry}
              onClick={() => handleIndustrySelect(industry)}
            />
          ))}
        </ChipGroup>

        {/* Custom industry input */}
        <input
          type="text"
          value={formData.industry}
          onChange={(e) => handleChange('industry', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Or type your industry..."
        />
      </div>

      {/* Education Level */}
      <div>
        <label
          htmlFor="education"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Highest Educational Attainment <span className="text-error-500">*</span>
        </label>
        <select
          id="education"
          required
          value={formData.education}
          onChange={(e) => handleChange('education', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Select education level</option>
          {EDUCATION_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Field of Study */}
      <div>
        <label
          htmlFor="fieldOfStudy"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Field of Study <span className="text-gray-400">(Optional)</span>
        </label>
        <input
          id="fieldOfStudy"
          type="text"
          value={formData.fieldOfStudy}
          onChange={(e) => handleChange('fieldOfStudy', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="e.g., Nursing, Computer Science, Civil Engineering"
        />
      </div>

      {/* Form validation message */}
      {!isFormValid && (
        <p className="text-sm text-gray-500 text-center">
          Please fill in all required fields to continue
        </p>
      )}
    </form>
  );
}
