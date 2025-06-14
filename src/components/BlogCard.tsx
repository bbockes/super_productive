import React from 'react';
import { ClockIcon } from 'lucide-react';
export function BlogCard({
  post,
  onClick
}) {
  const getCategoryColor = category => {
    const colorMap = {
      Sales: 'bg-blue-500',
      Content: 'bg-red-500',
      SEO: 'bg-green-500',
      Social: 'bg-pink-500',
      Ads: 'bg-yellow-500',
      Copywriting: 'bg-purple-500',
      'Landing Page': 'bg-orange-500',
      Brand: 'bg-indigo-500',
      Creative: 'bg-teal-500'
    };
    return colorMap[category] || 'bg-gray-500';
  };
  return <div onClick={onClick} className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-all duration-200 shadow-lg">
      <div className="aspect-video bg-gray-800 relative">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="flex items-center gap-1 text-white text-sm">
            <ClockIcon className="w-4 h-4" />
            {post.readTime}
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
        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
          {post.excerpt}
        </p>
      </div>
    </div>;
}