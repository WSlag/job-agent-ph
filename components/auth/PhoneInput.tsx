'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  formatPhoneForFirebase,
  validatePhilippinesPhone,
  getPhoneValidationError,
  normalizePhone,
} from '@/lib/phone-helpers';

interface PhoneInputProps {
  value: string;
  onChange: (phone: string, isValid: boolean) => void;
  error?: string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  showValidation?: boolean;
}

export default function PhoneInput({
  value,
  onChange,
  error: externalError,
  disabled = false,
  label = 'Phone Number',
  placeholder = '917 123 4567',
  showValidation = true,
}: PhoneInputProps) {
  const [localValue, setLocalValue] = useState('');
  const [touched, setTouched] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync external value to local state
  useEffect(() => {
    // If external value has +63, remove it for display
    if (value.startsWith('+63')) {
      setLocalValue(value.substring(3));
    } else if (value.startsWith('0')) {
      setLocalValue(value.substring(1));
    } else {
      setLocalValue(value);
    }
  }, [value]);

  const formatForDisplay = useCallback((input: string): string => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '');

    // Limit to 10 digits
    const limited = digits.slice(0, 10);

    // Format as XXX XXX XXXX
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    } else {
      return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Remove all non-digits
    const digits = input.replace(/\D/g, '');

    // Limit to 10 digits
    const limited = digits.slice(0, 10);

    // Format for display
    const formatted = formatForDisplay(limited);
    setLocalValue(formatted);

    // Convert to E.164 format for Firebase
    const fullNumber = limited.length > 0 ? '+63' + limited : '';
    const isValid = validatePhilippinesPhone(fullNumber);

    onChange(fullNumber, isValid);

    // Validate if touched
    if (touched && showValidation) {
      const error = getPhoneValidationError(fullNumber);
      setValidationError(error);
    }
  }, [onChange, touched, showValidation, formatForDisplay]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (showValidation) {
      const fullNumber = localValue.replace(/\D/g, '');
      const phoneToValidate = fullNumber.length > 0 ? '+63' + fullNumber : '';
      const error = getPhoneValidationError(phoneToValidate);
      setValidationError(error);
    }
  }, [localValue, showValidation]);

  const displayError = externalError || (touched && validationError);
  const inputId = `phone-input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-gray-500 sm:text-sm font-medium">+63</span>
        </div>
        <input
          id={inputId}
          type="tel"
          inputMode="numeric"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            block w-full pl-12 pr-4 py-2 rounded-lg border
            ${displayError
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-gray-100 disabled:cursor-not-allowed
          `}
          aria-describedby={displayError ? `${inputId}-error` : undefined}
        />
      </div>
      {displayError && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {displayError}
        </p>
      )}
      {!displayError && showValidation && touched && !validationError && localValue && (
        <p className="mt-1 text-sm text-green-600">
          Valid phone number
        </p>
      )}
    </div>
  );
}
