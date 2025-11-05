'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ContactInfoData {
  email: string;
  phoneNumber: string;
  province: string;
  city: string;
  barangay?: string;
}

interface ContactInfoStepProps {
  data?: ContactInfoData;
  onNext: () => void;
  onUpdate: (data: ContactInfoData) => void;
}

// Sample Philippine locations (In production, use actual PSGC data)
const PROVINCES = [
  'Metro Manila',
  'Cebu',
  'Davao del Sur',
  'Pampanga',
  'Cavite',
  'Laguna',
  'Rizal',
  'Bulacan',
  // Add more provinces
];

const CITIES: Record<string, string[]> = {
  'Metro Manila': ['Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig', 'Mandaluyong'],
  'Cebu': ['Cebu City', 'Mandaue', 'Lapu-Lapu'],
  'Davao del Sur': ['Davao City', 'Digos'],
  // Add more cities
};

/**
 * ContactInfoStep Component
 *
 * Step 2 of Profile Setup Wizard (40% complete)
 * Collects: Email, Phone, Province, City, Barangay
 */
export default function ContactInfoStep({
  data,
  onNext,
  onUpdate,
}: ContactInfoStepProps) {
  const [formData, setFormData] = useState<ContactInfoData>(
    data || {
      email: '',
      phoneNumber: '',
      province: '',
      city: '',
      barangay: '',
    }
  );

  const [emailVerified, setEmailVerified] = useState(false);
  const cities = formData.province ? CITIES[formData.province] || [] : [];

  const handleChange = (field: keyof ContactInfoData, value: string) => {
    let updated = { ...formData, [field]: value };

    // Reset city if province changes
    if (field === 'province') {
      updated.city = '';
    }

    setFormData(updated);
    onUpdate(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.email &&
      formData.phoneNumber &&
      formData.province &&
      formData.city
    ) {
      onNext();
    }
  };

  const isFormValid =
    formData.email &&
    formData.phoneNumber &&
    formData.province &&
    formData.city;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Contact Information
        </h2>
        <p className="text-gray-600">
          How can agencies reach you?
        </p>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address <span className="text-error-500">*</span>
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="juan@example.com"
          />
          {emailVerified && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <CheckCircle2 size={20} className="text-success-500" />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          We'll send job updates to this email
        </p>
      </div>

      {/* Phone Number */}
      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Phone Number <span className="text-error-500">*</span>
        </label>
        <div className="flex gap-2">
          <div className="w-20">
            <input
              type="text"
              value="+63"
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            />
          </div>
          <input
            id="phoneNumber"
            type="tel"
            required
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="9171234567"
            pattern="[0-9]{10}"
            maxLength={10}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          10-digit mobile number without country code
        </p>
      </div>

      {/* Province */}
      <div>
        <label
          htmlFor="province"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Province <span className="text-error-500">*</span>
        </label>
        <select
          id="province"
          required
          value={formData.province}
          onChange={(e) => handleChange('province', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Select province</option>
          {PROVINCES.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label
          htmlFor="city"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          City/Municipality <span className="text-error-500">*</span>
        </label>
        <select
          id="city"
          required
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
          disabled={!formData.province}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
        >
          <option value="">
            {formData.province ? 'Select city' : 'Select province first'}
          </option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Barangay (Optional) */}
      <div>
        <label
          htmlFor="barangay"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Barangay <span className="text-gray-400">(Optional)</span>
        </label>
        <input
          id="barangay"
          type="text"
          value={formData.barangay}
          onChange={(e) => handleChange('barangay', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Search barangay..."
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
