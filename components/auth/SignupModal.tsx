'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useOptionalAuth } from '@/contexts/AuthContext';
import BottomSheet from '@/components/ui/BottomSheet';
import Button from '@/components/ui/Button';
import AuthPrompt, { AuthPromptContext } from './AuthPrompt';
import GoogleAuthButton from './GoogleAuthButton';

interface SignupModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  /**
   * Callback when modal should close
   */
  onClose: () => void;
  /**
   * Context for why signup is needed
   */
  context: AuthPromptContext;
  /**
   * Callback when signup is successful
   */
  onSuccess?: () => void;
}

/**
 * SignupModal Component
 *
 * Bottom sheet modal for contextual authentication.
 * Shows benefit of signing up for specific action.
 * Includes quick signup form or social login options.
 *
 * @example
 * ```tsx
 * <SignupModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   context={{
 *     action: 'apply',
 *     title: 'Sign up to apply',
 *     description: 'Create an account to apply to this job',
 *     benefit: 'Track your applications and get updates',
 *     jobId: '123',
 *     returnUrl: '/jobs/123'
 *   }}
 *   onSuccess={() => {
 *     // Handle successful signup
 *     router.push(context.returnUrl || '/');
 *   }}
 * />
 * ```
 */
export default function SignupModal({
  isOpen,
  onClose,
  context,
  onSuccess,
}: SignupModalProps) {
  const router = useRouter();
  const { signUp, signIn } = useOptionalAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false,
  });

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Validation state
  const [validation, setValidation] = useState({
    email: { valid: false, checked: false },
    password: { valid: false, checked: false },
  });

  // Email validation
  const validateEmail = (email: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setValidation((prev) => ({
      ...prev,
      email: { valid: isValid, checked: true },
    }));
    return isValid;
  };

  // Password validation (min 8 chars, 1 uppercase, 1 number)
  const validatePassword = (password: string) => {
    const isValid =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password);
    setValidation((prev) => ({
      ...prev,
      password: { valid: isValid, checked: true },
    }));
    return isValid;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validate on change
    if (field === 'email' && typeof value === 'string') {
      validateEmail(value);
    }
    if (field === 'password' && typeof value === 'string') {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    const emailValid = validateEmail(formData.email);
    const passwordValid = validatePassword(formData.password);

    if (!emailValid || !passwordValid || !formData.agreeToTerms) {
      setError('Please fill all fields correctly and agree to the terms.');
      return;
    }

    setIsLoading(true);

    try {
      // Default to jobhunter userType, can be customized via context
      const userType = context.userType || 'jobhunter';

      // Split name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await signUp(formData.email, formData.password, userType, {
        firstName,
        lastName,
        location: '',
        skills: [],
        experience: 0,
      });

      // On success
      if (onSuccess) {
        onSuccess();
      } else {
        // Default: redirect to return URL or home
        router.push(context.returnUrl || '/');
      }

      onClose();
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(loginData.email, loginData.password);

      // On success
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(context.returnUrl || '/');
      }

      onClose();
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    // On success
    if (onSuccess) {
      onSuccess();
    } else {
      router.push(context.returnUrl || '/');
    }
    onClose();
  };

  const passwordStrength = () => {
    const { password } = formData;
    if (password.length === 0) return 0;
    if (password.length < 6) return 25;
    if (password.length < 8) return 50;
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return 75;
    return 100;
  };

  const getPasswordStrengthColor = () => {
    const strength = passwordStrength();
    if (strength <= 25) return 'bg-error-500';
    if (strength <= 50) return 'bg-warning-500';
    if (strength <= 75) return 'bg-info-500';
    return 'bg-success-500';
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      dismissible={!isLoading}
      snapPoint="full"
    >
      <div className="pb-6">
        {/* Auth Prompt */}
        {context.jobId && (
          <div className="mb-6">
            {/* TODO: Show job card preview here */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Job preview placeholder</p>
            </div>
          </div>
        )}

        <AuthPrompt context={context} className="mb-6" />

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg">
            <p className="text-sm text-error-700">{error}</p>
          </div>
        )}

        {/* Toggle between signup and login */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setShowLogin(false)}
            className={`text-sm font-medium ${
              !showLogin ? 'text-primary-600' : 'text-gray-500'
            }`}
          >
            Sign Up
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={() => setShowLogin(true)}
            className={`text-sm font-medium ${
              showLogin ? 'text-primary-600' : 'text-gray-500'
            }`}
          >
            Log In
          </button>
        </div>

        {/* Google Sign-In Button */}
        <div className="mb-6">
          <GoogleAuthButton
            userType={context.userType || 'jobhunter'}
            returnUrl={context.returnUrl}
            onSuccess={handleGoogleSuccess}
            onError={(errorMsg) => setError(errorMsg)}
            disabled={isLoading}
          />
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        {/* Signup Form */}
        <AnimatePresence mode="wait">
          {!showLogin ? (
            <motion.form
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Juan Dela Cruz"
                  disabled={isLoading}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10 ${
                      validation.email.checked
                        ? validation.email.valid
                          ? 'border-success-500'
                          : 'border-error-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="juan@example.com"
                    disabled={isLoading}
                  />
                  {validation.email.checked && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {validation.email.valid ? (
                        <CheckCircle2 size={20} className="text-success-500" />
                      ) : (
                        <XCircle size={20} className="text-error-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10 ${
                      validation.password.checked
                        ? validation.password.valid
                          ? 'border-success-500'
                          : 'border-error-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password.length > 0 && (
                  <div className="mt-2">
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                        style={{ width: `${passwordStrength()}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {passwordStrength() < 75
                        ? 'Use 8+ characters with uppercase and numbers'
                        : 'Strong password'}
                    </p>
                  </div>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  disabled={isLoading}
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="/terms" className="text-primary-600 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-primary-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                disabled={
                  !formData.agreeToTerms ||
                  !validation.email.valid ||
                  !validation.password.valid
                }
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              {/* Email */}
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="juan@example.com"
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <a
                  href="/auth/forgot-password"
                  className="text-sm text-primary-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                disabled={!loginData.email || !loginData.password}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </BottomSheet>
  );
}
