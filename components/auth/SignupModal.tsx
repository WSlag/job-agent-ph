'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import BottomSheet from '@/components/ui/BottomSheet';
import Button from '@/components/ui/Button';
import AuthPrompt, { AuthPromptContext } from './AuthPrompt';

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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false,
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

    // Validate all fields
    const emailValid = validateEmail(formData.email);
    const passwordValid = validatePassword(formData.password);

    if (!emailValid || !passwordValid || !formData.agreeToTerms) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual signup logic with Firebase
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // On success
      if (onSuccess) {
        onSuccess();
      } else {
        // Default: redirect to return URL or home
        router.push(context.returnUrl || '/');
      }

      onClose();
    } catch (error) {
      console.error('Signup error:', error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    // TODO: Implement social login
    console.log(`Login with ${provider}`);
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

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={() => handleSocialLogin('facebook')}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Continue with Facebook
          </Button>
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
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="text-center text-gray-600"
            >
              <p>Login form would go here</p>
              <p className="text-sm mt-2">TODO: Implement login form</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BottomSheet>
  );
}
