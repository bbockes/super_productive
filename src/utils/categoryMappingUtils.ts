/**
 * Utility functions for mapping between schema categories and user-friendly labels
 */

// Mapping from schema categories to user-friendly labels
export const APP_CATEGORY_MAPPING: Record<string, string> = {
  'Time-Saving Tools': 'Apps for saving time',
  'Design & Creativity': 'Creative Power',
  'Developer Tools': 'Build Faster',
  'AI & Machine Learning': 'Smarter with AI',
  'Marketing & Sales': 'Grow Your Audience',
  'Finance & Crypto': 'Money Made Simple',
  'Health & Wellness': 'Feel Better',
  'Learning & Education': 'Learn and Level Up',
  'Remote Work & Collaboration': 'Work Better Together',
  'Consumer & Lifestyle': 'Life, Upgraded'
};

// Reverse mapping from user-friendly labels to schema categories
export const REVERSE_APP_CATEGORY_MAPPING: Record<string, string> = Object.fromEntries(
  Object.entries(APP_CATEGORY_MAPPING).map(([key, value]) => [value, key])
);

/**
 * Convert schema category to user-friendly label
 */
export function getCategoryDisplayName(schemaCategory: string): string {
  return APP_CATEGORY_MAPPING[schemaCategory] || schemaCategory;
}

/**
 * Convert user-friendly label back to schema category
 */
export function getSchemaCategory(displayName: string): string {
  return REVERSE_APP_CATEGORY_MAPPING[displayName] || displayName;
}

/**
 * Get all user-friendly category labels
 */
export function getAllDisplayCategories(): string[] {
  return Object.values(APP_CATEGORY_MAPPING);
}

/**
 * Get all schema categories
 */
export function getAllSchemaCategories(): string[] {
  return Object.keys(APP_CATEGORY_MAPPING);
}