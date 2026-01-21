'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDbInstance, getStorageInstance } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile, updatePassword } from 'firebase/auth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProfileChecklist from '@/components/onboarding/ProfileChecklist';
import {
  validateEmail,
  validatePhone,
  validateLocation,
  validateExperience,
  validateSkills,
  validateFile,
  sanitizeString,
  validatePassword
} from '@/lib/validation';
import { User, Mail, Phone, MapPin, Briefcase, FileText, Lock, Upload, Save, ArrowLeft, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import UserDashboardHeader from '@/components/layout/UserDashboardHeader';
import MobileNativeHeader from '@/components/layout/MobileNativeHeader';

interface JobHunterProfile {
  fullName?: string;
  email: string;
  location?: string;
  phone?: string;
  skills?: string[];
  experience?: number;
  age?: number;
  bio?: string;
  resumeUrl?: string;
  profilePictureUrl?: string;
}

interface AgencyProfile {
  companyName: string;
  email: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  registrationNumber?: string;
  description?: string;
  logoUrl?: string;
  website?: string;
}

export default function ProfilePage() {
  const { user: currentUser, userType, loading: authLoading, signOut } = useAuth();
  const { updateProfileChecklist } = useOnboarding();
  const router = useRouter();
  const [profile, setProfile] = useState<JobHunterProfile | AgencyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form states
  const [skillInput, setSkillInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // File states
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/auth/login');
      return;
    }

    // Redirect admin users to admin dashboard
    if (currentUser && userType === 'admin') {
      router.push('/admin/dashboard');
      return;
    }

    if (currentUser && userType) {
      loadProfile();
    }
  }, [currentUser, userType, authLoading]);

  const loadProfile = async () => {
    if (!currentUser || !userType) return;

    try {
      setLoading(true);
      const db = getDbInstance();
      const collectionName = userType === 'jobhunter' ? 'jobHunters' : 'agencies';
      const profileDoc = await getDoc(doc(db, collectionName, currentUser.uid));

      if (profileDoc.exists()) {
        const data = profileDoc.data();
        setProfile({
          ...data,
          email: currentUser.email || '',
        } as JobHunterProfile | AgencyProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProfile(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleAddSkill = () => {
    if (!profile || !('skills' in profile)) return;

    const sanitized = sanitizeString(skillInput, 100);
    if (!sanitized || sanitized.length === 0) {
      toast.error('Skill cannot be empty');
      return;
    }

    const currentSkills = profile.skills || [];

    if (currentSkills.includes(sanitized)) {
      toast.error('Skill already added');
      return;
    }

    if (currentSkills.length >= 50) {
      toast.error('Maximum 50 skills allowed');
      return;
    }

    handleInputChange('skills', [...currentSkills, sanitized]);
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profile || !('skills' in profile)) return;
    const currentSkills = profile.skills || [];
    handleInputChange('skills', currentSkills.filter(s => s !== skillToRemove));
  };

  // Field validation helper
  const validateField = (fieldName: string, value: any): boolean => {
    let error = '';

    switch (fieldName) {
      case 'fullName':
        if (!value || value.length < 2) {
          error = 'Full name must be at least 2 characters';
        }
        break;
      case 'location':
        const locValidation = validateLocation(value || '');
        if (!locValidation.valid) error = locValidation.error!;
        break;
      case 'phone':
        if (value && !validatePhone(value)) {
          error = 'Invalid phone number format';
        }
        break;
      case 'skills':
        const skillsValidation = validateSkills(value || []);
        if (!skillsValidation.valid) error = skillsValidation.error!;
        break;
      case 'experience':
        if (value !== undefined && value !== '') {
          const expValidation = validateExperience(value);
          if (!expValidation.valid) error = expValidation.error!;
        }
        break;
      case 'age':
        if (value !== undefined && value !== '') {
          const ageNum = parseInt(value);
          if (isNaN(ageNum) || ageNum < 18) {
            error = 'You must be at least 18 years old';
          } else if (ageNum > 100) {
            error = 'Please enter a valid age';
          }
        }
        break;
    }

    setFieldErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[fieldName] = error;
      } else {
        delete newErrors[fieldName];
      }
      return newErrors;
    });

    return !error;
  };

  // Clear field error when user starts typing
  const clearFieldError = (fieldName: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const handleFileChange = async (type: 'resume' | 'profilePicture', file: File | null) => {
    if (!file) return;

    const validation = validateFile(file, {
      maxSize: type === 'resume' ? 10 * 1024 * 1024 : 5 * 1024 * 1024,
      allowedTypes: type === 'resume'
        ? ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        : ['image/jpeg', 'image/png', 'image/jpg'],
      allowedExtensions: type === 'resume' ? ['.pdf', '.doc', '.docx'] : ['.jpg', '.jpeg', '.png']
    });

    if (!validation.valid) {
      toast.error(validation.error!);
      return;
    }

    if (type === 'resume') {
      setResumeFile(file);
    } else {
      setProfilePictureFile(file);
    }
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const storage = getStorageInstance();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSaveProfile = async () => {
    if (!currentUser || !userType || !profile) return;

    try {
      setSaving(true);
      const db = getDbInstance();

      // Collect all validation errors
      const errors: Record<string, string> = {};

      // Validation
      if (userType === 'jobhunter') {
        const hunterProfile = profile as JobHunterProfile;

        if (!hunterProfile.fullName || hunterProfile.fullName.length < 2) {
          errors.fullName = 'Full name must be at least 2 characters';
        }

        const locationValidation = validateLocation(hunterProfile.location || '');
        if (!locationValidation.valid) {
          errors.location = locationValidation.error!;
        }

        if (hunterProfile.phone && !validatePhone(hunterProfile.phone)) {
          errors.phone = 'Invalid phone number format';
        }

        const skillsValidation = validateSkills(hunterProfile.skills || []);
        if (!skillsValidation.valid) {
          errors.skills = skillsValidation.error!;
        }

        if (hunterProfile.experience !== undefined) {
          const expValidation = validateExperience(hunterProfile.experience);
          if (!expValidation.valid) {
            errors.experience = expValidation.error!;
          }
        }
      } else {
        const agencyProfile = profile as AgencyProfile;

        if (!agencyProfile.companyName || agencyProfile.companyName.length < 2) {
          errors.companyName = 'Company name must be at least 2 characters';
        }

        if (!agencyProfile.contactEmail || !validateEmail(agencyProfile.contactEmail)) {
          errors.contactEmail = 'Contact email is required and must be valid';
        }

        if (agencyProfile.phone && !validatePhone(agencyProfile.phone)) {
          errors.phone = 'Invalid phone number format';
        }
      }

      // If there are errors, display them and focus first invalid field
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        toast.error('Please fix the errors in the form');

        // Auto-focus first invalid field
        const firstErrorField = Object.keys(errors)[0];
        setTimeout(() => {
          const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLInputElement;
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
          }
        }, 100);

        return;
      }

      // Clear all errors if validation passes
      setFieldErrors({});

      // Upload files if any
      let resumeUrl = 'resumeUrl' in profile ? profile.resumeUrl : undefined;
      let profilePictureUrl = 'profilePictureUrl' in profile
        ? profile.profilePictureUrl
        : 'logoUrl' in profile
        ? profile.logoUrl
        : undefined;

      if (resumeFile) {
        resumeUrl = await uploadFile(resumeFile, `resumes/${currentUser.uid}/${resumeFile.name}`);
        setResumeFile(null);
      }

      if (profilePictureFile) {
        const folder = userType === 'jobhunter' ? 'profile-pictures' : 'company-logos';
        profilePictureUrl = await uploadFile(profilePictureFile, `${folder}/${currentUser.uid}/${profilePictureFile.name}`);
        setProfilePictureFile(null);
      }

      // Update Firestore
      const collectionName = userType === 'jobhunter' ? 'jobHunters' : 'agencies';
      const updateData = {
        ...profile,
        ...(resumeUrl && { resumeUrl }),
        ...(profilePictureUrl && userType === 'jobhunter' && { profilePictureUrl }),
        ...(profilePictureUrl && userType === 'agency' && { logoUrl: profilePictureUrl }),
        updatedAt: new Date()
      };

      delete (updateData as any).email; // Don't update email in profile collection

      await updateDoc(doc(db, collectionName, currentUser.uid), updateData);

      // Update display name in auth
      if (userType === 'jobhunter') {
        await updateProfile(currentUser, {
          displayName: (profile as JobHunterProfile).fullName,
          ...(profilePictureUrl && { photoURL: profilePictureUrl })
        });
      } else {
        await updateProfile(currentUser, {
          displayName: (profile as AgencyProfile).companyName,
          ...(profilePictureUrl && { photoURL: profilePictureUrl })
        });
      }

      toast.success('Profile updated successfully!');
      await loadProfile();

      // Update profile checklist for job hunters
      if (userType === 'jobhunter') {
        const hunterProfile = profile as JobHunterProfile;
        updateProfileChecklist({
          resumeUploaded: !!resumeUrl,
          skillsAdded: (hunterProfile.skills || []).length > 0,
          locationSet: !!(hunterProfile.location && hunterProfile.location.length > 0),
          bioAdded: !!(hunterProfile.bio && hunterProfile.bio.length > 0),
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentUser) return;

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.error!);
      return;
    }

    try {
      setSaving(true);
      await updatePassword(currentUser, newPassword);
      toast.success('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      if (error.code === 'auth/requires-recent-login') {
        toast.error('Please log out and log in again to change your password');
      } else {
        toast.error('Failed to change password. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600">Profile not found</p>
          <Button onClick={() => router.push('/')} className="mt-4">Go Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <UserDashboardHeader showNotifications={true} />
      </div>
      <MobileNativeHeader
        title="Profile"
        onBack={() => router.back()}
        hideOnScroll
        showShadowOnScroll
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl pt-20 md:pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        {/* TODO: Add Legal Compliance Status section here after refactoring auth context */}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'security'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Security
          </button>
        </div>

        {activeTab === 'profile' ? (
          <>
            {/* Profile Checklist - Only for job hunters */}
            {userType === 'jobhunter' && <ProfileChecklist />}

            <Card className="p-6">
              <div className="space-y-6">
                {/* Job Hunter Profile */}
                {userType === 'jobhunter' && profile && (
                  <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline w-4 h-4 mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={'fullName' in profile ? (profile.fullName || '') : ''}
                      onChange={(e) => {
                        handleInputChange('fullName', e.target.value);
                        clearFieldError('fullName');
                      }}
                      onBlur={(e) => validateField('fullName', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        fieldErrors.fullName
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                      aria-invalid={!!fieldErrors.fullName}
                      aria-describedby={fieldErrors.fullName ? 'fullName-error' : undefined}
                    />
                    {fieldErrors.fullName && (
                      <p id="fullName-error" className="text-red-600 text-sm mt-1 flex items-center gap-1" role="alert">
                        <span>⚠️</span> {fieldErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline w-4 h-4 mr-2" />
                      Email (read-only)
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div id="location-section">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-2" />
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={'location' in profile ? (profile.location || '') : ''}
                      onChange={(e) => {
                        handleInputChange('location', e.target.value);
                        clearFieldError('location');
                      }}
                      onBlur={(e) => validateField('location', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        fieldErrors.location
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      placeholder="Manila, Philippines"
                      aria-invalid={!!fieldErrors.location}
                      aria-describedby={fieldErrors.location ? 'location-error' : undefined}
                    />
                    {fieldErrors.location && (
                      <p id="location-error" className="text-red-600 text-sm mt-1 flex items-center gap-1" role="alert">
                        <span>⚠️</span> {fieldErrors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline w-4 h-4 mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone || ''}
                      onChange={(e) => {
                        handleInputChange('phone', e.target.value);
                        clearFieldError('phone');
                      }}
                      onBlur={(e) => validateField('phone', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        fieldErrors.phone
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      placeholder="+63 912 345 6789"
                      aria-invalid={!!fieldErrors.phone}
                      aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                    />
                    {fieldErrors.phone && (
                      <p id="phone-error" className="text-red-600 text-sm mt-1 flex items-center gap-1" role="alert">
                        <span>⚠️</span> {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="inline w-4 h-4 mr-2" />
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={'experience' in profile ? (profile.experience || 0) : 0}
                      onChange={(e) => {
                        handleInputChange('experience', parseInt(e.target.value) || 0);
                        clearFieldError('experience');
                      }}
                      onBlur={(e) => validateField('experience', parseInt(e.target.value))}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        fieldErrors.experience
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      min="0"
                      max="70"
                      aria-invalid={!!fieldErrors.experience}
                      aria-describedby={fieldErrors.experience ? 'experience-error' : undefined}
                    />
                    {fieldErrors.experience && (
                      <p id="experience-error" className="text-red-600 text-sm mt-1 flex items-center gap-1" role="alert">
                        <span>⚠️</span> {fieldErrors.experience}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline w-4 h-4 mr-2" />
                      Age <span className="text-gray-500 text-xs">(You must be 18+ to use this platform)</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={'age' in profile ? (profile.age || '') : ''}
                      onChange={(e) => {
                        handleInputChange('age', e.target.value ? parseInt(e.target.value) : undefined);
                        clearFieldError('age');
                      }}
                      onBlur={(e) => validateField('age', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        fieldErrors.age
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      min="18"
                      max="100"
                      placeholder="Enter your age"
                      aria-invalid={!!fieldErrors.age}
                      aria-describedby={fieldErrors.age ? 'age-error' : undefined}
                    />
                    {fieldErrors.age && (
                      <p id="age-error" className="text-red-600 text-sm mt-1 flex items-center gap-1" role="alert">
                        <span>⚠️</span> {fieldErrors.age}
                      </p>
                    )}
                  </div>

                  <div id="skills-section">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills *
                    </label>
                    {fieldErrors.skills && (
                      <p className="text-red-600 text-sm mb-2 flex items-center gap-1" role="alert">
                        <span>⚠️</span> {fieldErrors.skills}
                      </p>
                    )}
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a skill (press Enter)"
                      />
                      <Button
                        onClick={handleAddSkill}
                        type="button"
                        className="!rounded-lg text-sm sm:text-base px-3 sm:px-6 py-2 sm:py-3"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {('skills' in profile ? (profile.skills || []) : []).map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div id="bio-section">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={'bio' in profile ? (profile.bio || '') : ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="Tell us about yourself..."
                      maxLength={500}
                    />
                  </div>

                  <div id="resume-section">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="inline w-4 h-4 mr-2" />
                      Resume
                    </label>
                    {'resumeUrl' in profile && profile.resumeUrl && (
                      <div className="mb-2">
                        <a
                          href={profile.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View current resume
                        </a>
                      </div>
                    )}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange('resume', e.target.files?.[0] || null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {resumeFile && (
                      <p className="mt-2 text-sm text-gray-600">
                        <Upload className="inline w-4 h-4 mr-1" />
                        Selected: {resumeFile.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture
                    </label>
                    {'profilePictureUrl' in profile && profile.profilePictureUrl && (
                      <img
                        src={profile.profilePictureUrl}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover mb-2"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('profilePicture', e.target.files?.[0] || null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {profilePictureFile && (
                      <p className="mt-2 text-sm text-gray-600">
                        <Upload className="inline w-4 h-4 mr-1" />
                        Selected: {profilePictureFile.name}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Agency Profile */}
              {userType === 'agency' && 'companyName' in profile && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="inline w-4 h-4 mr-2" />
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={'companyName' in profile ? profile.companyName : ''}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Acme Corporation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline w-4 h-4 mr-2" />
                      Account Email (read-only)
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline w-4 h-4 mr-2" />
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      value={'contactEmail' in profile ? profile.contactEmail : ''}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="contact@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline w-4 h-4 mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profile.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+63 2 1234 5678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-2" />
                      Address
                    </label>
                    <input
                      type="text"
                      value={'address' in profile ? (profile.address || '') : ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123 Business St, Makati, Philippines"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      value={'registrationNumber' in profile ? (profile.registrationNumber || '') : ''}
                      onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="DTI-12345678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={'website' in profile ? (profile.website || '') : ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Description
                    </label>
                    <textarea
                      value={'description' in profile ? (profile.description || '') : ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="Tell job seekers about your company..."
                      maxLength={1000}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Logo
                    </label>
                    {'logoUrl' in profile && profile.logoUrl && (
                      <img
                        src={profile.logoUrl}
                        alt="Company Logo"
                        className="w-24 h-24 rounded object-cover mb-2"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('profilePicture', e.target.files?.[0] || null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {profilePictureFile && (
                      <p className="mt-2 text-sm text-gray-600">
                        <Upload className="inline w-4 h-4 mr-1" />
                        Selected: {profilePictureFile.name}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full sm:flex-1"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  onClick={() => router.back()}
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
          </>
        ) : (
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <Lock className="inline w-5 h-5 mr-2" />
                  Change Password
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Ensure your password is strong and unique. It should be at least 8 characters long and include a mix of letters, numbers, and special characters.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    disabled={saving || !newPassword || !confirmPassword}
                  >
                    {saving ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </div>

              {/* Logout Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Log Out</h3>
                <p className="text-sm text-gray-600 mb-4">Sign out of your account on this device</p>
                <button
                  onClick={handleLogout}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors active:scale-95"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
    </>
  );
}
