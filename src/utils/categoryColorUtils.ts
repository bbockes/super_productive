export function getCategoryColor(categoryName: string): string {
  const colorMap: { [key: string]: string } = {
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