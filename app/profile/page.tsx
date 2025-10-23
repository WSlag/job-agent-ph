'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile, updatePassword } from 'firebase/auth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
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
import { User, Mail, Phone, MapPin, Briefcase, FileText, Lock, Upload, Save } from 'lucide-react';

interface JobHunterProfile {
  fullName: string;
  email: string;
  location: string;
  phone?: string;
  skills: string[];
  experience?: number;
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
  const { user: currentUser, userType, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<JobHunterProfile | AgencyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

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

    if (currentUser && userType) {
      loadProfile();
    }
  }, [currentUser, userType, authLoading]);

  const loadProfile = async () => {
    if (!currentUser || !userType) return;

    try {
      setLoading(true);
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
      setMessage({ type: 'error', text: 'Failed to load profile' });
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
      setMessage({ type: 'error', text: 'Skill cannot be empty' });
      return;
    }

    if (profile.skills.includes(sanitized)) {
      setMessage({ type: 'error', text: 'Skill already added' });
      return;
    }

    if (profile.skills.length >= 50) {
      setMessage({ type: 'error', text: 'Maximum 50 skills allowed' });
      return;
    }

    handleInputChange('skills', [...profile.skills, sanitized]);
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profile || !('skills' in profile)) return;
    handleInputChange('skills', profile.skills.filter(s => s !== skillToRemove));
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
      setMessage({ type: 'error', text: validation.error! });
      return;
    }

    if (type === 'resume') {
      setResumeFile(file);
    } else {
      setProfilePictureFile(file);
    }
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSaveProfile = async () => {
    if (!currentUser || !userType || !profile) return;

    try {
      setSaving(true);
      setMessage(null);

      // Validation
      if (userType === 'jobhunter') {
        const hunterProfile = profile as JobHunterProfile;

        if (!hunterProfile.fullName || hunterProfile.fullName.length < 2) {
          setMessage({ type: 'error', text: 'Full name must be at least 2 characters' });
          return;
        }

        const locationValidation = validateLocation(hunterProfile.location);
        if (!locationValidation.valid) {
          setMessage({ type: 'error', text: locationValidation.error! });
          return;
        }

        if (hunterProfile.phone && !validatePhone(hunterProfile.phone)) {
          setMessage({ type: 'error', text: 'Invalid phone number format' });
          return;
        }

        const skillsValidation = validateSkills(hunterProfile.skills);
        if (!skillsValidation.valid) {
          setMessage({ type: 'error', text: skillsValidation.error! });
          return;
        }

        if (hunterProfile.experience !== undefined) {
          const expValidation = validateExperience(hunterProfile.experience);
          if (!expValidation.valid) {
            setMessage({ type: 'error', text: expValidation.error! });
            return;
          }
        }
      } else {
        const agencyProfile = profile as AgencyProfile;

        if (!agencyProfile.companyName || agencyProfile.companyName.length < 2) {
          setMessage({ type: 'error', text: 'Company name must be at least 2 characters' });
          return;
        }

        if (!agencyProfile.contactEmail || !validateEmail(agencyProfile.contactEmail)) {
          setMessage({ type: 'error', text: 'Contact email is required and must be valid' });
          return;
        }

        if (agencyProfile.phone && !validatePhone(agencyProfile.phone)) {
          setMessage({ type: 'error', text: 'Invalid phone number format' });
          return;
        }
      }

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

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      await loadProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentUser) return;

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      setMessage({ type: 'error', text: passwordValidation.error! });
      return;
    }

    try {
      setSaving(true);
      await updatePassword(currentUser, newPassword);
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      if (error.code === 'auth/requires-recent-login') {
        setMessage({ type: 'error', text: 'Please log out and log in again to change your password' });
      } else {
        setMessage({ type: 'error', text: 'Failed to change password. Please try again.' });
      }
    } finally {
      setSaving(false);
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

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
          <Card className="p-6">
            <div className="space-y-6">
              {/* Job Hunter Profile */}
              {userType === 'jobhunter' && 'fullName' in profile && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline w-4 h-4 mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-2" />
                      Location *
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Manila, Philippines"
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
                      placeholder="+63 912 345 6789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="inline w-4 h-4 mr-2" />
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={profile.experience || 0}
                      onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="70"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills *
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a skill (press Enter)"
                      />
                      <Button onClick={handleAddSkill} type="button">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profile.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="Tell us about yourself..."
                      maxLength={500}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="inline w-4 h-4 mr-2" />
                      Resume
                    </label>
                    {profile.resumeUrl && (
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
                    {profile.profilePictureUrl && (
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
                      value={profile.companyName}
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
                      value={profile.contactEmail}
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
                      value={profile.address || ''}
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
                      value={profile.registrationNumber || ''}
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
                      value={profile.website || ''}
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
                      value={profile.description || ''}
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
                    {profile.logoUrl && (
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

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  onClick={() => router.back()}
                  variant="secondary"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
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
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
