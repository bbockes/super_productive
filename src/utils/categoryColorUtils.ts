// Static color mapping for existing categories to maintain their current colors
const staticColorMap: Record<string, string> = {
  'All': 'bg-gray-800',
  'Writing': 'bg-blue-500',
  'Learning': 'bg-red-500',
  'Planning': 'bg-green-500',
  'Building': 'bg-pink-500',
  'Creativity': 'bg-yellow-500',
  'Growth': 'bg-purple-500',
  'Focus': 'bg-orange-500',
  'Errors': 'bg-orange-500',
  'Communication': 'bg-indigo-500',
  'Thinking': 'bg-teal-500',
  'Shortcuts': 'bg-emerald-500'
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
  
  // Extract the color name from the background class (e.g., 'bg-blue-500' -> 'blue-500')
  const colorName = baseColor.replace('bg-', '');
  
  return `hover:${baseColor} hover:text-white dark:hover:text-gray-800`;
  return `hover:${baseColor} hover:text-white dark:hover:text-white`;
}

// Get selected state classes for a category
export function getCategorySelectedClass(category: { name: string; color: string }, isDarkMode: boolean = false): string {
  if (category.name === 'All') {
    // Special handling for "All" button - inverse colors in dark mode
    return 'bg-gray-800 text-white dark:bg-white dark:text-gray-800';
  }
  return category.color + ' text-white';
}

// Static hover mapping for better performance (optional optimization)
const staticHoverMap: Record<string, string> = {
  'All': 'hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-gray-800',
  'Writing': 'hover:bg-blue-500 hover:text-white dark:hover:text-white',
  'Learning': 'hover:bg-red-500 hover:text-white dark:hover:text-white',
  'Planning': 'hover:bg-green-500 hover:text-white dark:hover:text-white',
  'Building': 'hover:bg-pink-500 hover:text-white dark:hover:text-white',
  'Creativity': 'hover:bg-yellow-500 hover:text-white dark:hover:text-white',
  'Growth': 'hover:bg-purple-500 hover:text-white dark:hover:text-white',
  'Focus': 'hover:bg-orange-500 hover:text-white dark:hover:text-white',
  'Errors': 'hover:bg-orange-500 hover:text-white dark:hover:text-white',
  'Communication': 'hover:bg-indigo-500 hover:text-white dark:hover:text-white',
  'Thinking': 'hover:bg-teal-500 hover:text-white dark:hover:text-white',
  'Shortcuts': 'hover:bg-emerald-500 hover:text-white dark:hover:text-white'
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