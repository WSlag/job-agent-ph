import type { Job, JobHunter, JobMatch } from '@/types';

/**
 * Calculate job match percentage based on user skills vs job requirements
 * Returns null for non-job hunters or when calculation isn't possible
 */
export function calculateJobMatch(
  userProfile: JobHunter | null | undefined,
  job: Job
): JobMatch | null {
  // Only calculate for job hunters
  if (!userProfile || !job.skills || job.skills.length === 0) {
    return null;
  }

  const userSkills = (userProfile.skills || []).map(s => s.toLowerCase().trim());
  const jobSkills = job.skills.map(s => s.toLowerCase().trim());

  // Find matching skills (exact match or partial match)
  const matchingSkills = userSkills.filter(us =>
    jobSkills.some(js => {
      // Exact match
      if (js === us) return true;
      // Partial match (one contains the other)
      if (js.includes(us) || us.includes(js)) return true;
      return false;
    })
  );

  // Find missing skills
  const missingSkills = jobSkills.filter(js =>
    !userSkills.some(us => {
      if (js === us) return true;
      if (js.includes(us) || us.includes(js)) return true;
      return false;
    })
  );

  // Calculate percentage (with reasonable bounds)
  const rawPercentage = (matchingSkills.length / jobSkills.length) * 100;
  const percentage = Math.min(95, Math.max(60, Math.round(rawPercentage)));

  // Return original skill names (not lowercased)
  return {
    percentage,
    matchingSkills: job.skills.filter(s =>
      matchingSkills.includes(s.toLowerCase().trim())
    ),
    missingSkills: job.skills.filter(s =>
      missingSkills.includes(s.toLowerCase().trim())
    ),
  };
}

/**
 * Get placeholder data for missing job fields
 * Uses realistic Philippines OFW-focused data
 */
export function getPlaceholderJobData(job: Job) {
  return {
    contractDuration: job.contractDuration || '2 years',
    vacancies: job.vacancies || 5,
    requirements: job.requirements || [
      "Bachelor's Degree in relevant field",
      'Valid professional license',
      '2+ years of relevant experience',
      'English proficiency (IELTS 6.5 or equivalent)',
      'Eligible for certification in destination country',
    ],
    benefits: job.benefits || [
      'Free accommodation',
      'Annual flight ticket home',
      'Comprehensive medical insurance',
      '30 days paid annual leave',
      'Tax-free salary package',
      'Professional development opportunities',
    ],
  };
}

/**
 * Get color class based on match percentage
 */
export function getMatchColor(percentage: number): {
  bg: string;
  text: string;
  border: string;
} {
  if (percentage >= 90) {
    return {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    };
  } else if (percentage >= 70) {
    return {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    };
  } else {
    return {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
    };
  }
}
