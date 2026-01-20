'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  onResend?: () => void;
  error?: string;
  disabled?: boolean;
  resendCooldown?: number;
  autoFocus?: boolean;
}

export default function OTPInput({
  length = 6,
  onComplete,
  onResend,
  error,
  disabled = false,
  resendCooldown = 60,
  autoFocus = true,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [cooldown, setCooldown] = useState(resendCooldown);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start cooldown timer on mount
  useEffect(() => {
    setCooldown(resendCooldown);
    setCanResend(false);
  }, [resendCooldown]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [cooldown]);

  // Auto focus first input
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  // Check if OTP is complete
  useEffect(() => {
    const code = otp.join('');
    if (code.length === length && !otp.includes('')) {
      onComplete(code);
    }
  }, [otp, length, onComplete]);

  const handleChange = useCallback((index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp, length]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[index]) {
        // Clear current input
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input and clear it
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Handle left arrow
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    // Handle right arrow
    if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp, length]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);

    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);

      // Focus last filled input or next empty input
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  }, [otp, length]);

  const handleResend = useCallback(() => {
    if (canResend && onResend) {
      setOtp(Array(length).fill(''));
      setCooldown(resendCooldown);
      setCanResend(false);
      onResend();
      // Focus first input after resend
      inputRefs.current[0]?.focus();
    }
  }, [canResend, onResend, length, resendCooldown]);

  return (
    <div className="w-full">
      <div className="flex justify-center gap-2 sm:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`
              w-10 h-12 sm:w-12 sm:h-14
              text-center text-xl font-semibold
              border-2 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-offset-0
              transition-colors
              ${error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : digit
                  ? 'border-primary-500 focus:ring-primary-500 focus:border-primary-500'
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
              }
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            `}
            aria-label={`Digit ${index + 1} of ${length}`}
          />
        ))}
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
      )}

      {onResend && (
        <div className="mt-4 text-center">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={disabled}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
            >
              Resend code
            </button>
          ) : (
            <p className="text-sm text-gray-500">
              Resend code in <span className="font-medium">{cooldown}s</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
