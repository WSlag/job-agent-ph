import * as admin from 'firebase-admin';

export interface JobData {
  title: string;
  category: string;
  location: string;
  country: string;
  locationType: 'remote' | 'hybrid' | 'on-site';
  jobType: 'full-time' | 'part-time' | 'contract';
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  experienceRequired: number;
  skills: string[];
}

export interface JobHunterData {
  email?: string;
  firstName?: string;
  lastName?: string;
  location: string;
  skills: string[];
  experience: number;
  preferredCountries?: string[];
  preferredCategories?: string[];
  preferredJobTypes?: ('full-time' | 'part-time' | 'contract')[];
  preferredLocationType?: ('remote' | 'hybrid' | 'on-site')[];
  salaryExpectation?: {
    min: number;
    max: number;
    currency: string;
  };
  jobMatchNotifications?: boolean;
}

interface MatchScore {
  totalScore: number;
  breakdown: {
    skills: number;
    location: number;
    salary: number;
    experience: number;
    jobType: number;
    category: number;
  };
  matchingSkills: string[];
  isMatch: boolean;
}

/**
 * Intelligent job matching algorithm using weighted scoring
 *
 * Scoring breakdown:
 * - Skills match: 40 points (most critical)
 * - Location/Country: 25 points (high importance)
 * - Salary fit: 15 points
 * - Experience level: 10 points
 * - Job type: 5 points
 * - Category: 5 points
 *
 * Match threshold: 60% (configurable)
 */
export function calculateJobMatch(
  jobData: JobData,
  jobHunterData: JobHunterData,
  threshold: number = 60
): MatchScore {
  const breakdown = {
    skills: 0,
    location: 0,
    salary: 0,
    experience: 0,
    jobType: 0,
    category: 0,
  };

  const matchingSkills: string[] = [];

  // 1. SKILLS MATCH (40 points) - Most critical
  if (jobHunterData.skills && jobHunterData.skills.length > 0 && jobData.skills && jobData.skills.length > 0) {
    const hunterSkillsLower = jobHunterData.skills.map(s => s.toLowerCase());
    const jobSkillsLower = jobData.skills.map(s => s.toLowerCase());

    const matches = hunterSkillsLower.filter(skill =>
      jobSkillsLower.some(jobSkill =>
        jobSkill.includes(skill) || skill.includes(jobSkill)
      )
    );

    matchingSkills.push(...matches);

    // Calculate percentage of job requirements met
    const matchPercentage = (matches.length / jobSkillsLower.length) * 100;
    breakdown.skills = Math.min((matchPercentage / 100) * 40, 40);
  }

  // 2. LOCATION/COUNTRY MATCH (25 points)
  if (jobHunterData.preferredCountries && jobHunterData.preferredCountries.length > 0) {
    const prefersCountry = jobHunterData.preferredCountries.some(country =>
      jobData.country.toLowerCase().includes(country.toLowerCase()) ||
      country.toLowerCase().includes(jobData.country.toLowerCase())
    );

    if (prefersCountry) {
      breakdown.location = 25;
    }
  } else if (jobHunterData.location) {
    // Fallback: check current location
    if (
      jobData.location.toLowerCase().includes(jobHunterData.location.toLowerCase()) ||
      jobData.country.toLowerCase().includes(jobHunterData.location.toLowerCase())
    ) {
      breakdown.location = 20; // Slightly lower if using current location
    }
  }

  // 3. SALARY FIT (15 points)
  if (
    jobHunterData.salaryExpectation &&
    jobData.salaryMin !== undefined &&
    jobData.salaryMax !== undefined
  ) {
    const { min: expectedMin, max: expectedMax, currency: expectedCurrency } = jobHunterData.salaryExpectation;

    // Only compare if currencies match
    if (expectedCurrency === jobData.currency) {
      // Check if there's overlap between expected and offered salary ranges
      const hasOverlap = !(expectedMin > jobData.salaryMax || expectedMax < jobData.salaryMin);

      if (hasOverlap) {
        // Perfect match: job salary covers expected salary
        if (jobData.salaryMin >= expectedMin && jobData.salaryMax >= expectedMax) {
          breakdown.salary = 15;
        }
        // Good match: some overlap
        else {
          breakdown.salary = 10;
        }
      }
    }
  }

  // 4. EXPERIENCE LEVEL (10 points)
  if (jobHunterData.experience !== undefined) {
    const experienceGap = Math.abs(jobData.experienceRequired - jobHunterData.experience);

    // Perfect match or slightly over-qualified
    if (jobHunterData.experience >= jobData.experienceRequired && experienceGap <= 2) {
      breakdown.experience = 10;
    }
    // Close match (within 3 years)
    else if (experienceGap <= 3) {
      breakdown.experience = 7;
    }
    // Acceptable gap (within 5 years)
    else if (experienceGap <= 5) {
      breakdown.experience = 4;
    }
  }

  // 5. JOB TYPE (5 points)
  if (jobHunterData.preferredJobTypes && jobHunterData.preferredJobTypes.length > 0) {
    if (jobHunterData.preferredJobTypes.includes(jobData.jobType)) {
      breakdown.jobType = 5;
    }
  }

  // 6. LOCATION TYPE (bonus to job type scoring for flexibility)
  if (jobHunterData.preferredLocationType && jobHunterData.preferredLocationType.length > 0) {
    if (jobHunterData.preferredLocationType.includes(jobData.locationType)) {
      breakdown.jobType = Math.min(breakdown.jobType + 3, 5); // Bonus points
    }
  }

  // 7. CATEGORY MATCH (5 points)
  if (jobHunterData.preferredCategories && jobHunterData.preferredCategories.length > 0) {
    if (jobHunterData.preferredCategories.includes(jobData.category)) {
      breakdown.category = 5;
    }
  }

  // Calculate total score
  const totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0);

  return {
    totalScore,
    breakdown,
    matchingSkills,
    isMatch: totalScore >= threshold,
  };
}

/**
 * Filters job hunters who match a job based on their preferences
 * Returns hunters sorted by match score (best matches first)
 */
export async function findMatchingJobHunters(
  jobData: JobData,
  minMatchScore: number = 60,
  maxResults: number = 100
): Promise<Array<{ hunterId: string; matchScore: MatchScore; hunterData: JobHunterData }>> {
  const db = admin.firestore();

  // Get active job hunters with job match notifications enabled
  const jobHuntersSnapshot = await db
    .collection('jobHunters')
    .where('isActive', '==', true)
    .limit(500) // Pre-filter limit to control costs
    .get();

  const matches: Array<{ hunterId: string; matchScore: MatchScore; hunterData: JobHunterData }> = [];

  for (const doc of jobHuntersSnapshot.docs) {
    const hunterData = doc.data() as JobHunterData;

    // Skip if user disabled job match notifications
    if (hunterData.jobMatchNotifications === false) {
      continue;
    }

    // Calculate match score
    const matchScore = calculateJobMatch(jobData, hunterData, minMatchScore);

    if (matchScore.isMatch) {
      matches.push({
        hunterId: doc.id,
        matchScore,
        hunterData,
      });
    }
  }

  // Sort by match score (descending) and limit results
  return matches
    .sort((a, b) => b.matchScore.totalScore - a.matchScore.totalScore)
    .slice(0, maxResults);
}
