'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Chip, ChipGroup } from '@/components/ui';
import { COUNTRY_FLAGS } from '@/lib/colors';

interface SkillsPreferencesData {
  skills: string[];
  preferredCountries: string[];
  salaryExpectation: {
    min: number;
    max: number;
  };
  earliestStartDate: string;
}

interface SkillsPreferencesStepProps {
  data?: SkillsPreferencesData;
  onNext: () => void;
  onUpdate: (data: SkillsPreferencesData) => void;
}

const SUGGESTED_SKILLS = [
  'Communication',
  'Time Management',
  'Problem Solving',
  'Customer Service',
  'Computer Literacy',
  'Teamwork',
  'Adaptability',
  'Leadership',
];

const POPULAR_COUNTRIES = [
  { code: 'SAUDI_ARABIA', name: 'Saudi Arabia', flag: COUNTRY_FLAGS.SAUDI_ARABIA },
  { code: 'UAE', name: 'UAE', flag: COUNTRY_FLAGS.UAE },
  { code: 'SINGAPORE', name: 'Singapore', flag: COUNTRY_FLAGS.SINGAPORE },
  { code: 'HONG_KONG', name: 'Hong Kong', flag: COUNTRY_FLAGS.HONG_KONG },
  { code: 'KUWAIT', name: 'Kuwait', flag: COUNTRY_FLAGS.KUWAIT },
  { code: 'QATAR', name: 'Qatar', flag: COUNTRY_FLAGS.QATAR },
];

/**
 * SkillsPreferencesStep Component
 *
 * Step 4 of Profile Setup Wizard (80% complete)
 * Collects: Skills, Preferred Countries, Salary, Start Date
 */
export default function SkillsPreferencesStep({
  data,
  onNext,
  onUpdate,
}: SkillsPreferencesStepProps) {
  const [formData, setFormData] = useState<SkillsPreferencesData>(
    data || {
      skills: [],
      preferredCountries: [],
      salaryExpectation: { min: 20000, max: 50000 },
      earliestStartDate: 'immediately',
    }
  );

  const [skillInput, setSkillInput] = useState('');

  const handleChange = (field: keyof SkillsPreferencesData, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      handleChange('skills', [...formData.skills, skill]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    handleChange(
      'skills',
      formData.skills.filter((s) => s !== skill)
    );
  };

  const toggleCountry = (countryCode: string) => {
    const countries = formData.preferredCountries.includes(countryCode)
      ? formData.preferredCountries.filter((c) => c !== countryCode)
      : [...formData.preferredCountries, countryCode].slice(0, 5); // Max 5

    handleChange('preferredCountries', countries);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.skills.length > 0 &&
      formData.preferredCountries.length > 0 &&
      formData.earliestStartDate
    ) {
      onNext();
    }
  };

  const isFormValid =
    formData.skills.length > 0 &&
    formData.preferredCountries.length > 0 &&
    formData.earliestStartDate;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Skills & Preferences
        </h2>
        <p className="text-gray-600">
          Help us match you with the right opportunities
        </p>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills <span className="text-error-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Add at least 3 skills (select suggested or add custom)
        </p>

        {/* Suggested skills */}
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-600 mb-2">
            Suggested Skills:
          </p>
          <ChipGroup>
            {SUGGESTED_SKILLS.filter((s) => !formData.skills.includes(s)).map(
              (skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  variant="default"
                  clickable
                  onClick={() => addSkill(skill)}
                />
              )
            )}
          </ChipGroup>
        </div>

        {/* Selected skills */}
        {formData.skills.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-600 mb-2">
              Your Skills:
            </p>
            <ChipGroup>
              {formData.skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  variant="primary"
                  removable
                  onRemove={() => removeSkill(skill)}
                />
              ))}
            </ChipGroup>
          </div>
        )}

        {/* Add custom skill */}
        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill(skillInput);
              }
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Type a custom skill..."
          />
          <button
            type="button"
            onClick={() => addSkill(skillInput)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Preferred Countries */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Countries <span className="text-error-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Select up to 5 countries where you'd like to work
        </p>

        <ChipGroup>
          {POPULAR_COUNTRIES.map((country) => (
            <Chip
              key={country.code}
              label={`${country.flag} ${country.name}`}
              variant="primary"
              clickable
              selected={formData.preferredCountries.includes(country.code)}
              onClick={() => toggleCountry(country.code)}
            />
          ))}
        </ChipGroup>

        <p className="text-xs text-gray-500 mt-2">
          {formData.preferredCountries.length}/5 countries selected
        </p>
      </div>

      {/* Salary Expectation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monthly Salary Expectation (PHP)
        </label>
        <div className="space-y-4">
          <div>
            <label htmlFor="minSalary" className="text-xs text-gray-600">
              Minimum: ₱{formData.salaryExpectation.min.toLocaleString()}
            </label>
            <input
              id="minSalary"
              type="range"
              min="10000"
              max="150000"
              step="5000"
              value={formData.salaryExpectation.min}
              onChange={(e) =>
                handleChange('salaryExpectation', {
                  ...formData.salaryExpectation,
                  min: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="maxSalary" className="text-xs text-gray-600">
              Maximum: ₱{formData.salaryExpectation.max.toLocaleString()}
            </label>
            <input
              id="maxSalary"
              type="range"
              min="20000"
              max="200000"
              step="5000"
              value={formData.salaryExpectation.max}
              onChange={(e) =>
                handleChange('salaryExpectation', {
                  ...formData.salaryExpectation,
                  max: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Earliest Start Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          When can you start? <span className="text-error-500">*</span>
        </label>
        <div className="space-y-2">
          {[
            { value: 'immediately', label: 'Immediately' },
            { value: '1-month', label: 'In 1 month' },
            { value: '2-months', label: 'In 2 months' },
            { value: '3-months', label: 'In 3+ months' },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="radio"
                name="startDate"
                value={option.value}
                checked={formData.earliestStartDate === option.value}
                onChange={(e) => handleChange('earliestStartDate', e.target.value)}
                className="w-4 h-4 text-primary-600"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Form validation message */}
      {!isFormValid && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <p className="text-sm text-warning-800">
            Please complete all required fields:
          </p>
          <ul className="text-sm text-warning-700 mt-2 space-y-1">
            {formData.skills.length === 0 && <li>• Add at least one skill</li>}
            {formData.preferredCountries.length === 0 && (
              <li>• Select at least one country</li>
            )}
            {!formData.earliestStartDate && <li>• Select your start date</li>}
          </ul>
        </div>
      )}
    </form>
  );
}
