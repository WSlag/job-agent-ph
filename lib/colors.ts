/**
 * Color System for Job-Agent-PH
 *
 * This file contains all color constants used throughout the application.
 * The color palette is based on the modern tech theme with blue and purple accents,
 * enhanced with gold accents for featured/premium items and semantic status colors.
 *
 * @module colors
 */

/**
 * Primary Brand Colors
 * Main blue color scheme for the application
 */
export const PRIMARY_COLORS = {
  BLUE: '#2563eb',           // primary-600 - Main brand color
  BLUE_DARK: '#1e40af',      // primary-800 - Hover states, darker elements
  BLUE_LIGHT: '#3b82f6',     // primary-500 - Lighter variant
  BLUE_LIGHTER: '#60a5fa',   // primary-400 - Backgrounds, subtle elements
  BLUE_LIGHTEST: '#dbeafe',  // primary-100 - Very light backgrounds
} as const;

/**
 * Accent Colors
 * Purple/magenta colors for secondary emphasis
 */
export const ACCENT_COLORS = {
  PURPLE: '#d946ef',          // accent-500 - Main accent color
  PURPLE_DARK: '#c026d3',     // accent-600 - Darker variant
  PURPLE_LIGHT: '#f0abfc',    // accent-300 - Lighter variant
  PURPLE_GRADIENT: '#9333ea', // For gradients
  MAGENTA: '#8b5cf6',         // Alternative purple shade
} as const;

/**
 * Gold Accent Colors
 * USAGE: Only for featured badges, awards, premium indicators
 * Use sparingly to maintain special significance
 */
export const GOLD_COLORS = {
  GOLD: '#FCD116',           // gold-500 - Main gold accent
  GOLD_DARK: '#eab308',      // gold-600 - Darker gold
  GOLD_LIGHT: '#fde68a',     // gold-300 - Lighter gold
} as const;

/**
 * Status/Semantic Colors
 * For conveying meaning and state
 */
export const STATUS_COLORS = {
  // Success - Verified badges, completed states, success messages
  SUCCESS: '#28a745',         // success-500
  SUCCESS_DARK: '#16a34a',    // success-600
  SUCCESS_LIGHT: '#86efac',   // success-300

  // Warning - Pending statuses, important notices
  WARNING: '#ff9800',         // warning-500
  WARNING_DARK: '#ea580c',    // warning-600
  WARNING_LIGHT: '#fdba74',   // warning-300

  // Error - Errors, rejections, critical warnings
  ERROR: '#dc3545',           // error-500
  ERROR_DARK: '#dc2626',      // error-600
  ERROR_LIGHT: '#fca5a5',     // error-300

  // Info - Tooltips, informational messages
  INFO: '#17a2b8',            // info-500
  INFO_DARK: '#0284c7',       // info-600
  INFO_LIGHT: '#7dd3fc',      // info-300
} as const;

/**
 * Neutral Colors
 * For backgrounds, text, borders
 */
export const NEUTRAL_COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_50: '#f8f9fa',
  GRAY_100: '#e9ecef',
  GRAY_200: '#dee2e6',
  GRAY_300: '#ced4da',
  GRAY_400: '#adb5bd',
  GRAY_500: '#6c757d',
  GRAY_600: '#495057',
  GRAY_700: '#343a40',
  GRAY_800: '#212529',
  GRAY_900: '#1a1a1a',
} as const;

/**
 * Dark Mode Colors
 * For future dark mode implementation (Phase 6)
 */
export const DARK_MODE_COLORS = {
  BG_PRIMARY: '#1a1a1a',
  BG_SECONDARY: '#2d2d2d',
  BG_ELEVATED: '#3a3a3a',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#b0b0b0',
  TEXT_TERTIARY: '#808080',
  BORDER: '#404040',
} as const;

/**
 * Semantic Color Mappings
 * Named aliases for specific use cases
 */
export const SEMANTIC_COLORS = {
  // Verification & Trust
  VERIFIED: STATUS_COLORS.SUCCESS,        // DMW verified badges
  CERTIFIED: STATUS_COLORS.SUCCESS,       // Certifications
  TRUSTED: PRIMARY_COLORS.BLUE,           // Trust indicators

  // Features & Promotions
  FEATURED: GOLD_COLORS.GOLD,             // Featured jobs/agencies
  PREMIUM: GOLD_COLORS.GOLD,              // Premium listings
  URGENT: STATUS_COLORS.ERROR,            // Urgent hiring
  NEW: STATUS_COLORS.INFO,                // New listings

  // Application Status
  PENDING: STATUS_COLORS.WARNING,         // Under review
  ACCEPTED: STATUS_COLORS.SUCCESS,        // Application accepted
  REJECTED: STATUS_COLORS.ERROR,          // Application rejected
  INTERVIEW: PRIMARY_COLORS.BLUE,         // Interview scheduled
  DEPLOYED: STATUS_COLORS.SUCCESS,        // Successfully deployed

  // Job Match
  HIGH_MATCH: STATUS_COLORS.SUCCESS,      // 80%+ match
  MEDIUM_MATCH: STATUS_COLORS.WARNING,    // 50-79% match
  LOW_MATCH: NEUTRAL_COLORS.GRAY_500,     // <50% match

  // User Experience
  LINK: PRIMARY_COLORS.BLUE,              // Clickable links
  LINK_HOVER: PRIMARY_COLORS.BLUE_DARK,   // Link hover state
  FOCUS: PRIMARY_COLORS.BLUE,             // Focus indicators
  DISABLED: NEUTRAL_COLORS.GRAY_400,      // Disabled elements

  // Alerts & Messages
  ALERT_ERROR: STATUS_COLORS.ERROR,
  ALERT_WARNING: STATUS_COLORS.WARNING,
  ALERT_INFO: STATUS_COLORS.INFO,
  ALERT_SUCCESS: STATUS_COLORS.SUCCESS,
} as const;

/**
 * Country Flag Emoji Constants
 * For country selection and display
 */
export const COUNTRY_FLAGS = {
  // Middle East
  SAUDI_ARABIA: '🇸🇦',
  UAE: '🇦🇪',
  KUWAIT: '🇰🇼',
  QATAR: '🇶🇦',
  BAHRAIN: '🇧🇭',
  OMAN: '🇴🇲',

  // Asia Pacific
  SINGAPORE: '🇸🇬',
  HONG_KONG: '🇭🇰',
  JAPAN: '🇯🇵',
  TAIWAN: '🇹🇼',
  SOUTH_KOREA: '🇰🇷',

  // Europe
  ITALY: '🇮🇹',
  UNITED_KINGDOM: '🇬🇧',
  GERMANY: '🇩🇪',
  FRANCE: '🇫🇷',
  SPAIN: '🇪🇸',

  // Americas
  USA: '🇺🇸',
  CANADA: '🇨🇦',

  // Oceania
  AUSTRALIA: '🇦🇺',
  NEW_ZEALAND: '🇳🇿',

  // Home
  PHILIPPINES: '🇵🇭',
} as const;

/**
 * Gradient Combinations
 * Pre-defined gradient color combinations
 */
export const GRADIENTS = {
  PRIMARY: `linear-gradient(135deg, ${PRIMARY_COLORS.BLUE} 0%, ${ACCENT_COLORS.PURPLE} 100%)`,
  PRIMARY_LIGHT: `linear-gradient(135deg, ${PRIMARY_COLORS.BLUE_LIGHT} 0%, ${ACCENT_COLORS.PURPLE_LIGHT} 100%)`,
  SUCCESS: `linear-gradient(135deg, ${STATUS_COLORS.SUCCESS} 0%, ${STATUS_COLORS.SUCCESS_LIGHT} 100%)`,
  GOLD: `linear-gradient(135deg, ${GOLD_COLORS.GOLD} 0%, ${GOLD_COLORS.GOLD_LIGHT} 100%)`,
  BACKGROUND: `linear-gradient(180deg, ${NEUTRAL_COLORS.WHITE} 0%, ${NEUTRAL_COLORS.GRAY_50} 100%)`,
} as const;

/**
 * Shadow Color Configurations
 * For consistent shadow styling
 */
export const SHADOW_COLORS = {
  SOFT: 'rgba(0, 0, 0, 0.07)',
  MEDIUM: 'rgba(0, 0, 0, 0.1)',
  STRONG: 'rgba(0, 0, 0, 0.15)',
  GLOW_BLUE: 'rgba(37, 99, 235, 0.3)',
  GLOW_PURPLE: 'rgba(217, 70, 239, 0.3)',
  GLOW_GOLD: 'rgba(252, 209, 22, 0.3)',
} as const;

/**
 * Color Usage Guidelines
 *
 * PRIMARY BLUE (#2563eb):
 * - Primary buttons and CTAs
 * - Links and interactive elements
 * - Brand elements (logo, headers)
 * - Navigation active states
 *
 * PURPLE (#d946ef):
 * - Accent highlights
 * - Gradient overlays
 * - Secondary interactive elements
 * - Decorative elements
 *
 * GOLD (#FCD116):
 * ⚠️ USE SPARINGLY - Only for:
 * - Featured job badges
 * - Award icons
 * - Premium indicators
 * - Special achievements
 *
 * SUCCESS GREEN (#28a745):
 * - DMW verified badges
 * - Completed states
 * - Success messages
 * - Positive indicators
 *
 * WARNING AMBER (#ff9800):
 * - Pending statuses
 * - Important notices
 * - Attention needed
 * - Caution indicators
 *
 * ERROR RED (#dc3545):
 * - Error messages
 * - Rejection notifications
 * - Critical warnings
 * - Failed states
 *
 * INFO BLUE (#17a2b8):
 * - Informational tooltips
 * - Help messages
 * - Neutral notifications
 * - Tips and hints
 */

/**
 * Helper function to get color with opacity
 * @param color - Hex color string
 * @param opacity - Opacity value (0-1)
 * @returns RGBA color string
 */
export function withOpacity(color: string, opacity: number): string {
  // Remove # if present
  const hex = color.replace('#', '');

  // Parse hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Helper function to get status color based on application status
 * @param status - Application status
 * @returns Color hex string
 */
export function getApplicationStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    pending: SEMANTIC_COLORS.PENDING,
    under_review: SEMANTIC_COLORS.PENDING,
    viewed: STATUS_COLORS.INFO,
    interview_scheduled: SEMANTIC_COLORS.INTERVIEW,
    accepted: SEMANTIC_COLORS.ACCEPTED,
    rejected: SEMANTIC_COLORS.REJECTED,
    withdrawn: NEUTRAL_COLORS.GRAY_500,
    deployed: SEMANTIC_COLORS.DEPLOYED,
  };

  return statusMap[status.toLowerCase()] || NEUTRAL_COLORS.GRAY_500;
}

/**
 * Helper function to get match percentage color
 * @param percentage - Match percentage (0-100)
 * @returns Color hex string
 */
export function getMatchColor(percentage: number): string {
  if (percentage >= 80) return SEMANTIC_COLORS.HIGH_MATCH;
  if (percentage >= 50) return SEMANTIC_COLORS.MEDIUM_MATCH;
  return SEMANTIC_COLORS.LOW_MATCH;
}

/**
 * Export all colors as a single object for convenience
 */
export const COLORS = {
  PRIMARY: PRIMARY_COLORS,
  ACCENT: ACCENT_COLORS,
  GOLD: GOLD_COLORS,
  STATUS: STATUS_COLORS,
  NEUTRAL: NEUTRAL_COLORS,
  DARK_MODE: DARK_MODE_COLORS,
  SEMANTIC: SEMANTIC_COLORS,
  GRADIENTS,
  SHADOWS: SHADOW_COLORS,
  FLAGS: COUNTRY_FLAGS,
} as const;

export default COLORS;
