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
  // Core Professional Categories
  {
    name: 'IT & Software Development',
    icon: '💻',
    description: 'Software development, web development, mobile apps, and IT infrastructure'
  },
  {
    name: 'Engineering & Technical',
    icon: '⚙️',
    description: 'Mechanical, civil, electrical, and other engineering fields'
  },
  {
    name: 'Healthcare & Medical',
    icon: '🏥',
    description: 'Doctors, nurses, medical technologists, and healthcare support'
  },
  {
    name: 'Finance & Accounting',
    icon: '💰',
    description: 'Accounting, banking, investment, and financial services'
  },
  {
    name: 'Marketing & Communications',
    icon: '📱',
    description: 'Digital marketing, advertising, PR, and brand management'
  },
  {
    name: 'Sales & Business Development',
    icon: '📊',
    description: 'Sales representatives, account managers, and business growth roles'
  },
  {
    name: 'Human Resources',
    icon: '👥',
    description: 'HR management, recruitment, training, and employee relations'
  },
  {
    name: 'Education & Training',
    icon: '📚',
    description: 'Teachers, tutors, trainers, and educational administration'
  },

  // Specialized Professional Categories
  {
    name: 'Design & Creative',
    icon: '🎨',
    description: 'Graphic design, UI/UX, video editing, and creative services'
  },
  {
    name: 'Data Science & Analytics',
    icon: '📈',
    description: 'Data analysts, data scientists, business intelligence, and analytics'
  },
  {
    name: 'Customer Service & Support',
    icon: '🎧',
    description: 'Customer service, technical support, and client relations'
  },
  {
    name: 'Administrative & Clerical',
    icon: '📋',
    description: 'Administrative assistants, office managers, and clerical support'
  },
  {
    name: 'Hospitality & Tourism',
    icon: '🏨',
    description: 'Hotels, restaurants, travel, and tourism services'
  },
  {
    name: 'Construction & Skilled Trades',
    icon: '🔨',
    description: 'Construction workers, electricians, plumbers, and skilled craftsmen'
  },

  // OFW-Specific Categories
  {
    name: 'Domestic & Caregiving',
    icon: '🏠',
    description: 'Household service workers, nannies, caregivers, and domestic helpers'
  },
  {
    name: 'Maritime & Shipping',
    icon: '⚓',
    description: 'Seafarers, ship officers, crew members, and maritime professionals'
  },
  {
    name: 'Manufacturing & Production',
    icon: '🏭',
    description: 'Factory workers, production staff, and manufacturing roles'
  },
  {
    name: 'Logistics & Transportation',
    icon: '🚚',
    description: 'Drivers, delivery, warehouse, and supply chain management'
  },
  {
    name: 'Retail & Food Service',
    icon: '🛒',
    description: 'Retail sales, cashiers, food service, and restaurant workers'
  },
  {
    name: 'Other',
    icon: '📂',
    description: 'Jobs that don\'t fit into other categories'
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
