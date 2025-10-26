/**
 * Categories Configuration
 *
 * This file contains the centralized category configuration for the job board.
 * Categories are used for filtering and organizing jobs.
 */

export interface Category {
  name: string;
  icon: string;
  description?: string;
}

/**
 * Available job categories
 *
 * To add a new category:
 * 1. Add it to this array with name and icon
 * 2. Ensure jobs in Firestore use the exact same category name
 * 3. Update the category dropdown in job creation/edit forms
 */
export const CATEGORIES: Category[] = [
  {
    name: 'IT & Software',
    icon: '💻',
    description: 'Software development, IT infrastructure, and technical roles'
  },
  {
    name: 'Healthcare',
    icon: '🏥',
    description: 'Medical, nursing, and healthcare support positions'
  },
  {
    name: 'Engineering',
    icon: '⚙️',
    description: 'Mechanical, civil, electrical, and other engineering fields'
  },
  {
    name: 'Finance',
    icon: '💰',
    description: 'Accounting, banking, investment, and financial services'
  },
  {
    name: 'Marketing',
    icon: '📱',
    description: 'Digital marketing, advertising, and brand management'
  },
  {
    name: 'Education',
    icon: '📚',
    description: 'Teaching, training, and educational administration'
  },
];

/**
 * Get category names only (for dropdowns and filters)
 */
export const getCategoryNames = (): string[] => {
  return CATEGORIES.map(cat => cat.name);
};

/**
 * Get category by name
 */
export const getCategoryByName = (name: string): Category | undefined => {
  return CATEGORIES.find(cat => cat.name === name);
};

/**
 * Validate if a category name is valid
 */
export const isValidCategory = (name: string): boolean => {
  return CATEGORIES.some(cat => cat.name === name);
};
