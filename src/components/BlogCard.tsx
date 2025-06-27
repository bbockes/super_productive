import React from 'react';
import { ClockIcon } from 'lucide-react';
export function BlogCard({
  post,
  onClick
}) {
  const getCategoryColor = category => {
    const colorMap = {
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
    return colorMap[category] || 'bg-gray-500';
  };

  // Format read time - just return as string, allowing custom units
  const formatReadTime = (readTime) => {
    // Convert to string and return as-is
    return String(readTime || '5 min');
  };

  return <div onClick={onClick} className="bg-gray-900 dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-all duration-200 shadow-lg">
      <div className="aspect-video bg-gray-800 dark:bg-gray-700 relative">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="flex items-center gap-1 text-white text-sm">
            <ClockIcon className="w-4 h-4" />
            {formatReadTime(post.read_time || post.readTime)}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg leading-tight">
          {post.title}
        </h3>
        <p className="text-gray-400 dark:text-gray-300 text-sm mt-2 line-clamp-2">
          {post.subheader || post.excerpt}
        </p>
      </div>
    </div>;
}