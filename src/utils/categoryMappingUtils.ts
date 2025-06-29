// Category mapping utilities for transforming between Sanity schema and UI display

// Function to get category color based on name
export function getCategoryColor(categoryName: string): string {
  const colorMap: Record<string, string> = {
    'All': 'bg-gray-800',
    'Writing': 'bg-blue-500',
    'Learning': 'bg-red-500',
    'Planning': 'bg-green-500',
    'Building': 'bg-pink-500',
    'Creativity': 'bg-yellow-500',
    'Growth': 'bg-purple-500',
    'Focus': 'bg-orange-500',
    'Communication': 'bg-indigo-500',
    'Thinking': 'bg-teal-500',
    'Shortcuts': 'bg-emerald-500'
  };
  return colorMap[categoryName] || 'bg-gray-500';
}

// Function to get the display name for a category
export function getCategoryDisplayName(categoryName: string): string {
  // If we need to transform category names from schema to display format
  const displayNameMap: Record<string, string> = {
    'writing': 'Writing',
    'learning': 'Learning',
    'planning': 'Planning',
    'building': 'Building',
    'creativity': 'Creativity',
    'growth': 'Growth',
    'focus': 'Focus',
    'communication': 'Communication',
    'thinking': 'Thinking',
    'shortcuts': 'Shortcuts'
  };
  
  return displayNameMap[categoryName.toLowerCase()] || categoryName;
}

// Function to get the schema category name from display name
export function getSchemaCategory(displayName: string): string {
  // If we need to transform from display format back to schema format
  const schemaMap: Record<string, string> = {
    'Writing': 'writing',
    'Learning': 'learning',
    'Planning': 'planning',
    'Building': 'building',
    'Creativity': 'creativity',
    'Growth': 'growth',
    'Focus': 'focus',
    'Communication': 'communication',
    'Thinking': 'thinking',
    'Shortcuts': 'shortcuts'
  };
  
  return schemaMap[displayName] || displayName.toLowerCase();
}