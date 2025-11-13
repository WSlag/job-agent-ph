/**
 * Countries Configuration
 *
 * Centralized country list for job postings, optimized for Philippine OFW destinations.
 * Countries are sorted by priority based on OFW deployment statistics.
 */

export interface Country {
  name: string;
  code: string; // ISO 3166-1 alpha-2 code
  currency: string;
  flag: string; // Unicode flag emoji
  priority: 'high' | 'medium' | 'low'; // OFW deployment priority
}

/**
 * Complete list of countries available for job postings
 * Sorted by OFW priority and alphabetically within each tier
 */
export const COUNTRIES: Country[] = [
  // High Priority - Top OFW Destinations (>100k OFWs)
  {
    name: 'Saudi Arabia',
    code: 'SA',
    currency: 'SAR',
    flag: '🇸🇦',
    priority: 'high'
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    currency: 'AED',
    flag: '🇦🇪',
    priority: 'high'
  },
  {
    name: 'Hong Kong',
    code: 'HK',
    currency: 'HKD',
    flag: '🇭🇰',
    priority: 'high'
  },
  {
    name: 'Singapore',
    code: 'SG',
    currency: 'SGD',
    flag: '🇸🇬',
    priority: 'high'
  },
  {
    name: 'Malaysia',
    code: 'MY',
    currency: 'MYR',
    flag: '🇲🇾',
    priority: 'high'
  },
  {
    name: 'United States',
    code: 'US',
    currency: 'USD',
    flag: '🇺🇸',
    priority: 'high'
  },
  {
    name: 'Canada',
    code: 'CA',
    currency: 'CAD',
    flag: '🇨🇦',
    priority: 'high'
  },
  {
    name: 'Australia',
    code: 'AU',
    currency: 'AUD',
    flag: '🇦🇺',
    priority: 'high'
  },
  {
    name: 'Kuwait',
    code: 'KW',
    currency: 'KWD',
    flag: '🇰🇼',
    priority: 'high'
  },
  {
    name: 'Qatar',
    code: 'QA',
    currency: 'QAR',
    flag: '🇶🇦',
    priority: 'high'
  },

  // Medium Priority - Significant OFW Destinations (50k-100k OFWs)
  {
    name: 'Philippines',
    code: 'PH',
    currency: 'PHP',
    flag: '🇵🇭',
    priority: 'medium'
  },
  {
    name: 'Taiwan',
    code: 'TW',
    currency: 'TWD',
    flag: '🇹🇼',
    priority: 'medium'
  },
  {
    name: 'Japan',
    code: 'JP',
    currency: 'JPY',
    flag: '🇯🇵',
    priority: 'medium'
  },
  {
    name: 'South Korea',
    code: 'KR',
    currency: 'KRW',
    flag: '🇰🇷',
    priority: 'medium'
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    currency: 'GBP',
    flag: '🇬🇧',
    priority: 'medium'
  },
  {
    name: 'Italy',
    code: 'IT',
    currency: 'EUR',
    flag: '🇮🇹',
    priority: 'medium'
  },
  {
    name: 'Bahrain',
    code: 'BH',
    currency: 'BHD',
    flag: '🇧🇭',
    priority: 'medium'
  },
  {
    name: 'Oman',
    code: 'OM',
    currency: 'OMR',
    flag: '🇴🇲',
    priority: 'medium'
  },
  {
    name: 'China',
    code: 'CN',
    currency: 'CNY',
    flag: '🇨🇳',
    priority: 'medium'
  },

  // Lower Priority - Other Notable Destinations
  {
    name: 'Thailand',
    code: 'TH',
    currency: 'THB',
    flag: '🇹🇭',
    priority: 'low'
  },
  {
    name: 'Vietnam',
    code: 'VN',
    currency: 'VND',
    flag: '🇻🇳',
    priority: 'low'
  },
  {
    name: 'Indonesia',
    code: 'ID',
    currency: 'IDR',
    flag: '🇮🇩',
    priority: 'low'
  },
  {
    name: 'Germany',
    code: 'DE',
    currency: 'EUR',
    flag: '🇩🇪',
    priority: 'low'
  },
  {
    name: 'New Zealand',
    code: 'NZ',
    currency: 'NZD',
    flag: '🇳🇿',
    priority: 'low'
  },
  {
    name: 'Israel',
    code: 'IL',
    currency: 'ILS',
    flag: '🇮🇱',
    priority: 'low'
  },
  {
    name: 'Netherlands',
    code: 'NL',
    currency: 'EUR',
    flag: '🇳🇱',
    priority: 'low'
  },
  {
    name: 'Other',
    code: 'XX',
    currency: 'USD',
    flag: '🌍',
    priority: 'low'
  },
];

/**
 * Get country names only (for simple lists and validation)
 */
export const getCountryNames = (): string[] => {
  return COUNTRIES.map(country => country.name);
};

/**
 * Get country by name
 */
export const getCountryByName = (name: string): Country | undefined => {
  return COUNTRIES.find(country => country.name === name);
};

/**
 * Get country by code
 */
export const getCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find(country => country.code === code);
};

/**
 * Validate if a country name is valid
 */
export const isValidCountry = (name: string): boolean => {
  return COUNTRIES.some(country => country.name === name);
};

/**
 * Get default currency for a country
 */
export const getCurrencyForCountry = (countryName: string): string => {
  const country = getCountryByName(countryName);
  return country?.currency || 'USD';
};

/**
 * Get countries sorted by priority
 */
export const getCountriesByPriority = (): Country[] => {
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  return [...COUNTRIES].sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return a.name.localeCompare(b.name);
  });
};

/**
 * Search countries by name (case-insensitive)
 */
export const searchCountries = (query: string): Country[] => {
  const lowerQuery = query.toLowerCase();
  return COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(lowerQuery)
  );
};
