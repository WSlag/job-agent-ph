'use client';

import React, { useState } from 'react';
import { Camera, User } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface PersonalInfoData {
  photoUrl?: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  civilStatus: string;
}

interface PersonalInfoStepProps {
  data?: PersonalInfoData;
  onNext: () => void;
  onUpdate: (data: PersonalInfoData) => void;
}

/**
 * PersonalInfoStep Component
 *
 * Step 1 of Profile Setup Wizard (20% complete)
 * Collects: Photo, Name, Date of Birth, Gender, Civil Status
 */
export default function PersonalInfoStep({
  data,
  onNext,
  onUpdate,
}: PersonalInfoStepProps) {
  const [formData, setFormData] = useState<PersonalInfoData>(
    data || {
      photoUrl: '',
      fullName: '',
      dateOfBirth: '',
      gender: '',
      civilStatus: '',
    }
  );

  const [photoPreview, setPhotoPreview] = useState<string | undefined>(
    data?.photoUrl
  );

  // Photo upload with drag-drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setPhotoPreview(result);
          handleChange('photoUrl', result);
        };
        reader.readAsDataURL(file);
      }
    },
  });

  const handleChange = (field: keyof PersonalInfoData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (
      formData.fullName &&
      formData.dateOfBirth &&
      formData.gender &&
      formData.civilStatus
    ) {
      onNext();
    }
  };

  const isFormValid =
    formData.fullName &&
    formData.dateOfBirth &&
    formData.gender &&
    formData.civilStatus;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600">
          Let's start with your basic information
        </p>
      </div>

      {/* Photo Upload */}
      <div className="flex flex-col items-center">
        <div
          {...getRootProps()}
          className={`
            relative
            w-32
            h-32
            rounded-full
            border-2
            border-dashed
            cursor-pointer
            transition-all
            overflow-hidden
            ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }
          `}
        >
          <input {...getInputProps()} />

          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              {isDragActive ? (
                <Camera size={32} />
              ) : (
                <>
                  <User size={32} />
                  <span className="text-xs mt-2">Add Photo</span>
                </>
              )}
            </div>
          )}

          {/* Camera overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={24} className="text-white" />
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Click or drag to upload (JPG, PNG, max 5MB)
        </p>
      </div>

      {/* Full Name */}
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name <span className="text-error-500">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          required
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Juan Dela Cruz"
        />
      </div>

      {/* Date of Birth */}
      <div>
        <label
          htmlFor="dateOfBirth"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Date of Birth <span className="text-error-500">*</span>
        </label>
        <input
          id="dateOfBirth"
          type="date"
          required
          value={formData.dateOfBirth}
          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          max={new Date().toISOString().split('T')[0]} // Can't select future dates
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Gender */}
      <div>
        <label
          htmlFor="gender"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Gender <span className="text-error-500">*</span>
        </label>
        <select
          id="gender"
          required
          value={formData.gender}
          onChange={(e) => handleChange('gender', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Prefer not to say</option>
        </select>
      </div>

      {/* Civil Status */}
      <div>
        <label
          htmlFor="civilStatus"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Civil Status <span className="text-error-500">*</span>
        </label>
        <select
          id="civilStatus"
          required
          value={formData.civilStatus}
          onChange={(e) => handleChange('civilStatus', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Select civil status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="widowed">Widowed</option>
          <option value="separated">Separated</option>
          <option value="divorced">Divorced</option>
        </select>
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
