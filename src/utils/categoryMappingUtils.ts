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
    'Shortcuts': 'bg-emerald-500',
    // Apps categories
    'Time-Saving Tools': 'bg-blue-500',
    'Design & Creativity': 'bg-pink-500',
    'Developer Tools': 'bg-green-500',
    'AI & Machine Learning': 'bg-purple-500',
    'Marketing & Sales': 'bg-orange-500',
    'Finance & Crypto': 'bg-yellow-500',
    'Health & Wellness': 'bg-emerald-500',
    'Learning & Education': 'bg-red-500',
    'Remote Work & Collaboration': 'bg-indigo-500',
    'Consumer & Lifestyle': 'bg-teal-500'
  };
  return colorMap[categoryName] || 'bg-gray-500';
}

// Function to get the display name for a category (schema → display)
export function getCategoryDisplayName(categoryName: string): string {
  // Mapping for Apps categories from schema to display names
  const appsDisplayNameMap: Record<string, string> = {
    'Time-Saving Tools': 'Apps for saving time',
    'Design & Creativity': 'Apps for creating and designing',
    'Developer Tools': 'Apps for building faster',
    'AI & Machine Learning': 'Apps for working with AI',
    'Marketing & Sales': 'Apps for growing your audience',
    'Finance & Crypto': 'Apps for managing money',
    'Health & Wellness': 'Apps for feeling better',
    'Learning & Education': 'Apps for learning new skills',
    'Remote Work & Collaboration': 'Apps for working together',
    'Consumer & Lifestyle': 'Apps for everyday life'
  };

  // Mapping for blog post categories (existing)
  const blogDisplayNameMap: Record<string, string> = {
    'Writing': 'Writing',
    'Learning': 'Learning',
    'Planning': 'Planning',
    'Building': 'Building',
    'Creativity': 'Creativity',
    'Growth': 'Growth',
    'Focus': 'Focus',
    'Communication': 'Communication',
    'Thinking': 'Thinking',
    'Shortcuts': 'Shortcuts'
  };
  
  // Check Apps categories first, then blog categories
  return appsDisplayNameMap[categoryName] || blogDisplayNameMap[categoryName] || categoryName;
}

// Function to get the schema category name from display name (display → schema)
export function getSchemaCategory(displayName: string): string {
  // Mapping for Apps categories from display names back to schema
  const appsSchemaMap: Record<string, string> = {
    'Apps for saving time': 'Time-Saving Tools',
    'Apps for creating and designing': 'Design & Creativity',
    'Apps for building faster': 'Developer Tools',
    'Apps for working with AI': 'AI & Machine Learning',
    'Apps for growing your audience': 'Marketing & Sales',
    'Apps for managing money': 'Finance & Crypto',
    'Apps for feeling better': 'Health & Wellness',
    'Apps for learning new skills': 'Learning & Education',
    'Apps for working together': 'Remote Work & Collaboration',
    'Apps for everyday life': 'Consumer & Lifestyle'
  };

  // Mapping for blog post categories (existing)
  const blogSchemaMap: Record<string, string> = {
    'Writing': 'Writing',
    'Learning': 'Learning',
    'Planning': 'Planning',
    'Building': 'Building',
    'Creativity': 'Creativity',
    'Growth': 'Growth',
    'Focus': 'Focus',
    'Communication': 'Communication',
    'Thinking': 'Thinking',
    'Shortcuts': 'Shortcuts'
  };
  
  // Check Apps categories first, then blog categories
  return appsSchemaMap[displayName] || blogSchemaMap[displayName] || displayName;
}