'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_PREFIX = 'compliance_hint_';

export interface HintConfig {
  key: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

export function useHints() {
  const [shownHints, setShownHints] = useState<Set<string>>(new Set());

  // Load shown hints from localStorage on mount
  useEffect(() => {
    const stored = new Set<string>();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        stored.add(key.replace(STORAGE_PREFIX, ''));
      }
    }
    setShownHints(stored);
  }, []);

  const shouldShowHint = useCallback((hintKey: string): boolean => {
    return !shownHints.has(hintKey);
  }, [shownHints]);

  const markHintAsShown = useCallback((hintKey: string) => {
    localStorage.setItem(`${STORAGE_PREFIX}${hintKey}`, 'true');
    setShownHints((prev) => new Set(prev).add(hintKey));
  }, []);

  const resetHint = useCallback((hintKey: string) => {
    localStorage.removeItem(`${STORAGE_PREFIX}${hintKey}`);
    setShownHints((prev) => {
      const next = new Set(prev);
      next.delete(hintKey);
      return next;
    });
  }, []);

  const resetAllHints = useCallback(() => {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
    setShownHints(new Set());
  }, []);

  return {
    shouldShowHint,
    markHintAsShown,
    resetHint,
    resetAllHints,
    shownHints: Array.from(shownHints)
  };
}

// Pre-defined hint keys for consistency
export const HINT_KEYS = {
  FIRST_JOB_APPLICATION: 'first_job_application',
  FIRST_MESSAGE: 'first_message_to_agency',
  ZERO_FEE_POLICY: 'zero_fee_policy_education',
  PROFILE_COMPLETION: 'complete_profile_benefits',
  VERIFY_AGENCY: 'verify_agency_dmw_license',
  AGE_VERIFICATION: 'age_verification_required',
  DMW_RESOURCES: 'dmw_resources_available'
} as const;

// Pre-defined hint messages
export const HINT_MESSAGES = {
  [HINT_KEYS.FIRST_JOB_APPLICATION]:
    'Remember: Never pay placement fees for jobs in countries with zero-fee policies!',
  [HINT_KEYS.FIRST_MESSAGE]:
    'Always verify the agency\'s DMW license before sharing personal documents.',
  [HINT_KEYS.ZERO_FEE_POLICY]:
    'Philippines law prohibits placement fees for certain countries. Learn more in our Zero-Fee Policy.',
  [HINT_KEYS.PROFILE_COMPLETION]:
    'Complete your profile to get priority consideration from verified agencies.',
  [HINT_KEYS.VERIFY_AGENCY]:
    'Look for the verified badge - it means we\'ve checked their DMW license.',
  [HINT_KEYS.AGE_VERIFICATION]:
    'You must be 18+ to apply for overseas employment opportunities.',
  [HINT_KEYS.DMW_RESOURCES]:
    'Visit dmw.gov.ph or call +63 2 8721-0619 to verify any agency independently.'
} as const;
