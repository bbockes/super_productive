// Static color mapping for existing categories to maintain their current colors
const staticColorMap: Record<string, string> = {
  'All': 'bg-gray-800',
  // Main categories
  'Explore': 'bg-blue-600',
  'Shape': 'bg-green-600', 
  'Build': 'bg-purple-600',
  'Grow': 'bg-orange-600',
  // Explore sub-categories
  'Discovery': 'bg-blue-500',
  'Research': 'bg-blue-500',
  'Ideation': 'bg-blue-500',
  'Validation': 'bg-blue-500',
  'Feedback': 'bg-blue-500',
  // Shape sub-categories  
  'Decision-making': 'bg-green-500',
  'Prototyping': 'bg-green-500',
  'Planning': 'bg-green-500',
  'Alignment': 'bg-green-500',
  'Communication': 'bg-green-500',
  // Build sub-categories
  'Building': 'bg-purple-500',
  'Shortcuts': 'bg-purple-500',
  'Testing': 'bg-purple-500',
  'Documentation': 'bg-purple-500',
  'Iteration': 'bg-purple-500',
  // Grow sub-categories
  'Marketing': 'bg-orange-500',
  'Onboarding': 'bg-orange-500',
  'Measurement': 'bg-orange-500',
  'Scaling': 'bg-orange-500',
  'Retention': 'bg-orange-500',
  // Legacy categories (kept for backwards compatibility)
  'Writing': 'bg-blue-500',
  'Learning': 'bg-red-500',
  'Creativity': 'bg-yellow-500',
  'Growth': 'bg-purple-500',
  'Focus': 'bg-orange-500',
  'Errors': 'bg-orange-500',
  'Thinking': 'bg-teal-500',
  'Legacy': 'bg-gray-500'
};

// Color mapping for link categories (Apps view)
const linkCategoryColorMap: Record<string, string> = {
  '→ Every Use-Case': 'bg-gray-800', // "All" equivalent
  '→ Saving Time': 'bg-blue-500',
  '→ Creating and Designing': 'bg-pink-500',
  '→ Building Faster': 'bg-purple-500',
  '→ Working with AI': 'bg-yellow-500',
  '→ Growing Your Audience': 'bg-green-500',
  '→ Managing Money': 'bg-emerald-500',
  '→ Feeling Better': 'bg-red-500',
  '→ Learning New Skills': 'bg-orange-500',
  '→ Working Together': 'bg-indigo-500',
  '→ Everyday Life': 'bg-teal-500'
};

// Dynamic color palette for new categories
const dynamicColorPalette: string[] = [
  'bg-cyan-500',
  'bg-lime-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-sky-500',
  'bg-stone-500',
  'bg-neutral-500',
  'bg-zinc-500',
  'bg-slate-500',
  'bg-gray-600',
  'bg-red-600',
  'bg-orange-600',
  'bg-yellow-600',
  'bg-green-600',
  'bg-blue-600',
  'bg-indigo-600',
  'bg-purple-600',
  'bg-pink-600',
  'bg-teal-600'
];

// Convert string to consistent hash for color selection
function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Get background color class for a category
export function getCategoryColor(categoryName: string): string {
  // First check if it's in our static mapping
  if (staticColorMap[categoryName]) {
    return staticColorMap[categoryName];
  }
  
  // Check if it's a link category display name
  if (linkCategoryColorMap[categoryName]) {
    return linkCategoryColorMap[categoryName];
  }
  
  // For new categories, use dynamic color palette
  const hash = stringToHash(categoryName);
  const colorIndex = hash % dynamicColorPalette.length;
  return dynamicColorPalette[colorIndex];
}

// Get hover classes for a category
export function getCategoryHoverClass(categoryName: string): string {
  const baseColor = getCategoryColor(categoryName);
  
  // Special handling for "All" button
  if (categoryName === 'All') {
    return 'hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-gray-800';
  }
  
  // Special handling for "→ Every Use-Case" button (All equivalent in Apps view)
  if (categoryName === '→ Every Use-Case') {
    return 'hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-gray-800';
  }
  
  // All other categories: reveal background color on hover
  // Light mode: white text on hover, Dark mode: keep current text color
  return `hover:${baseColor} hover:text-white dark:hover:text-gray-300`;
}

// Get selected state classes for a category
export function getCategorySelectedClass(category: { name: string; color: string }, isDarkMode: boolean = false): string {
  if (category.name === 'All') {
    // Special handling for "All" button - inverse colors in dark mode
    return 'bg-gray-800 text-white dark:bg-white dark:text-gray-800';
  }
  if (category.name === '→ Every Use-Case') {
    // Special handling for "→ Every Use-Case" button - same as All
    return 'bg-gray-800 text-white dark:bg-white dark:text-gray-800';
  }
  
  // For link categories, use the proper color from the mapping
  const properColor = getCategoryColor(category.name);
  return properColor + ' text-white';
}

// Static hover mapping for better performance (optional optimization)
const staticHoverMap: Record<string, string> = {
  'All': 'hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-gray-800',
  // Main categories
  'Explore': 'hover:bg-blue-600 hover:text-white dark:hover:text-gray-300',
  'Shape': 'hover:bg-green-600 hover:text-white dark:hover:text-gray-300',
  'Build': 'hover:bg-purple-600 hover:text-white dark:hover:text-gray-300',
  'Grow': 'hover:bg-orange-600 hover:text-white dark:hover:text-gray-300',
  // Explore sub-categories
  'Discovery': 'hover:bg-blue-500 hover:text-white dark:hover:text-gray-300',
  'Research': 'hover:bg-blue-500 hover:text-white dark:hover:text-gray-300',
  'Ideation': 'hover:bg-blue-500 hover:text-white dark:hover:text-gray-300',
  'Validation': 'hover:bg-blue-500 hover:text-white dark:hover:text-gray-300',
  'Feedback': 'hover:bg-blue-500 hover:text-white dark:hover:text-gray-300',
  // Shape sub-categories
  'Decision-making': 'hover:bg-green-500 hover:text-white dark:hover:text-gray-300',
  'Prototyping': 'hover:bg-green-500 hover:text-white dark:hover:text-gray-300',
  'Planning': 'hover:bg-green-500 hover:text-white dark:hover:text-gray-300',
  'Alignment': 'hover:bg-green-500 hover:text-white dark:hover:text-gray-300',
  'Communication': 'hover:bg-green-500 hover:text-white dark:hover:text-gray-300',
  // Build sub-categories
  'Building': 'hover:bg-purple-500 hover:text-white dark:hover:text-gray-300',
  'Shortcuts': 'hover:bg-purple-500 hover:text-white dark:hover:text-gray-300',
  'Testing': 'hover:bg-purple-500 hover:text-white dark:hover:text-gray-300',
  'Documentation': 'hover:bg-purple-500 hover:text-white dark:hover:text-gray-300',
  'Iteration': 'hover:bg-purple-500 hover:text-white dark:hover:text-gray-300',
  // Grow sub-categories
  'Marketing': 'hover:bg-orange-500 hover:text-white dark:hover:text-gray-300',
  'Onboarding': 'hover:bg-orange-500 hover:text-white dark:hover:text-gray-300',
  'Measurement': 'hover:bg-orange-500 hover:text-white dark:hover:text-gray-300',
  'Scaling': 'hover:bg-orange-500 hover:text-white dark:hover:text-gray-300',
  'Retention': 'hover:bg-orange-500 hover:text-white dark:hover:text-gray-300',
  // Legacy categories (kept for backwards compatibility)
  'Writing': 'hover:bg-blue-500 hover:text-white dark:hover:text-gray-300',
  'Learning': 'hover:bg-red-500 hover:text-white dark:hover:text-gray-300',
  'Creativity': 'hover:bg-yellow-500 hover:text-white dark:hover:text-gray-300',
  'Growth': 'hover:bg-purple-500 hover:text-white dark:hover:text-gray-300',
  'Focus': 'hover:bg-orange-500 hover:text-white dark:hover:text-gray-300',
  'Errors': 'hover:bg-orange-500 hover:text-white dark:hover:text-gray-300',
  'Thinking': 'hover:bg-teal-500 hover:text-white dark:hover:text-gray-300',
  'Legacy': 'hover:bg-gray-500 hover:text-white dark:hover:text-gray-300',
  // Link category hover mappings
  '→ Every Use-Case': 'hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-gray-800',
  '→ Saving Time': 'hover:bg-blue-500 hover:text-white dark:hover:text-gray-300',
  '→ Creating and Designing': 'hover:bg-pink-500 hover:text-white dark:hover:text-gray-300',
  '→ Building Faster': 'hover:bg-purple-500 hover:text-white dark:hover:text-gray-300',
  '→ Working with AI': 'hover:bg-yellow-500 hover:text-white dark:hover:text-gray-300',
  '→ Growing Your Audience': 'hover:bg-green-500 hover:text-white dark:hover:text-gray-300',
  '→ Managing Money': 'hover:bg-emerald-500 hover:text-white dark:hover:text-gray-300',
  '→ Feeling Better': 'hover:bg-red-500 hover:text-white dark:hover:text-gray-300',
  '→ Learning New Skills': 'hover:bg-orange-500 hover:text-white dark:hover:text-gray-300',
  '→ Working Together': 'hover:bg-indigo-500 hover:text-white dark:hover:text-gray-300',
  '→ Everyday Life': 'hover:bg-teal-500 hover:text-white dark:hover:text-gray-300'
};

// Optimized hover class function that uses static mapping when available
export function getCategoryHoverClassOptimized(categoryName: string): string {
  // First check static mapping for performance
  if (staticHoverMap[categoryName]) {
    return staticHoverMap[categoryName];
  }
  
  // Fall back to dynamic generation
  return getCategoryHoverClass(categoryName);
}